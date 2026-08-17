import { inngest } from '../client';
import { createDataForSEOClient } from '@/lib/ingestion/dataforseo';
import {
  normalizeGoogleReview,
  buildReviewMetadata,
} from '@/lib/ingestion/google-reviews';
import { generateEmbeddings } from '@/lib/ai/embed';
import { db } from '@/db/drizzle';
import {
  feedbackItems,
  feedbackEmbeddings,
  connectorConfigs,
} from '@/db/schema';
import { eq, and } from 'drizzle-orm';

const INITIAL_SYNC_DEPTH = 20;
const INCREMENTAL_SYNC_DEPTH = 20;
const PINGBACK_TIMEOUT = '2h';

export const syncGoogleReviews = inngest.createFunction(
  {
    id: 'sync-google-reviews',
    name: 'Sync Google Reviews',
    triggers: [{ event: 'google-reviews.sync' }],
    retries: 3,
  },
  async ({ event, step }) => {
    const { configId } = event.data as { configId?: string };
    if (!configId) return;

    const client = createDataForSEOClient();

    // Step 1: Load connector config
    const config = await step.run('load-config', async () => {
      const rows = await db
        .select()
        .from(connectorConfigs)
        .where(eq(connectorConfigs.id, configId))
        .limit(1);
      return rows[0] ?? null;
    });

    if (!config || config.status !== 'active') return;

    // Step 2: Resolve location code if missing
    const locationCode = await step.run('resolve-location', async () => {
      if (config.locationCode != null || config.locationCoordinate != null) {
        return config.locationCode ?? null;
      }
      const code = await client.getLocationCode();
      if (code) {
        await db
          .update(connectorConfigs)
          .set({ locationCode: code, updatedAt: new Date() })
          .where(eq(connectorConfigs.id, config.id));
      }
      return code;
    });

    if (locationCode == null && config.locationCoordinate == null) return;

    // Step 3: Create DataForSEO task
    const isFirstSync = config.lastSyncedAt == null;
    const depth = isFirstSync ? INITIAL_SYNC_DEPTH : INCREMENTAL_SYNC_DEPTH;

    const baseUrl =
      process.env.APP_BASE_URL ??
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000');

    const taskId = await step.run('create-task', async () => {
      const pingbackUrl = `${baseUrl}/api/connectors/google-reviews/pingback?id=$id`;
      return client.taskPost({
        placeId: config.placeId,
        locationCode,
        locationCoordinate: config.locationCoordinate,
        depth,
        sortBy: 'newest',
        pingbackUrl,
      });
    });

    // Step 4: Wait for DataForSEO to finish (zero compute — function suspends)
    // DataForSEO calls our pingback URL when done, which sends an Inngest event.
    const taskCompleted = await step.waitForEvent('wait-for-dataforseo', {
      event: 'dataforseo.task-completed',
      timeout: PINGBACK_TIMEOUT,
      if: `async.data.taskId == "${taskId}"`,
    });

    if (!taskCompleted) {
      // Timed out — DataForSEO didn't respond in 2h, something is very wrong
      await step.run('mark-sync-failed', async () => {
        await db
          .update(connectorConfigs)
          .set({ updatedAt: new Date() })
          .where(eq(connectorConfigs.id, config.id));
      });
      return;
    }

    // Step 5: Fetch results (guaranteed ready — pingback confirms completion)
    const { items, resolvedPlaceId, resolvedTitle, resolvedSubTitle } =
      await step.run('fetch-results', async () => {
        const result = await client.taskGet(taskId);
        return {
          items: result.items,
          resolvedPlaceId: result.placeId,
          resolvedTitle: result.title,
          resolvedSubTitle: result.subTitle,
        };
      });

    if (items.length === 0) {
      await step.run('update-sync-timestamp-empty', async () => {
        await db
          .update(connectorConfigs)
          .set({ lastSyncedAt: new Date(), updatedAt: new Date() })
          .where(eq(connectorConfigs.id, config.id));
      });
      return;
    }

    // Step 6: Update placeId and business info if DataForSEO resolved it
    if (resolvedPlaceId && config.placeId.startsWith('name:')) {
      await step.run('update-resolved-place-id', async () => {
        await db
          .update(connectorConfigs)
          .set({
            placeId: resolvedPlaceId,
            title: resolvedTitle ?? null,
            subTitle: resolvedSubTitle ?? null,
            locationCoordinate: null,
            updatedAt: new Date(),
          })
          .where(eq(connectorConfigs.id, config.id));
      });
    } else if (resolvedTitle && !config.title) {
      // First sync: save title/subTitle if not yet set
      await step.run('update-business-info', async () => {
        await db
          .update(connectorConfigs)
          .set({
            title: resolvedTitle,
            subTitle: resolvedSubTitle ?? null,
            updatedAt: new Date(),
          })
          .where(eq(connectorConfigs.id, config.id));
      });
    }

    // Step 7: Upsert reviews into feedback_items (dedup via sourceItemId)
    const newItems = await step.run('upsert-reviews', async () => {
      const inserted: Array<{ id: string; text: string }> = [];

      for (const item of items) {
        const normalized = normalizeGoogleReview(item);
        if (!normalized.text.trim() || !normalized.sourceItemId) continue;

        const metadataJson = buildReviewMetadata(item);

        const existing = await db
          .select({ id: feedbackItems.id })
          .from(feedbackItems)
          .where(
            and(
              eq(feedbackItems.sourceItemId, normalized.sourceItemId),
              eq(feedbackItems.source, 'google_reviews'),
            ),
          )
          .limit(1);

        if (existing.length > 0) {
          await db
            .update(feedbackItems)
            .set({
              text: normalized.text,
              rating: normalized.rating,
              authorName: normalized.authorName,
              metadataJson,
            })
            .where(eq(feedbackItems.id, existing[0].id));
        } else {
          const id = crypto.randomUUID();
          await db.insert(feedbackItems).values({
            id,
            organizationId: config.organizationId,
            connectorConfigId: config.id,
            source: 'google_reviews',
            sourceItemId: normalized.sourceItemId,
            text: normalized.text,
            rating: normalized.rating,
            authorName: normalized.authorName,
            createdAt: normalized.createdAt,
            metadataJson,
          });

          inserted.push({ id, text: normalized.text });
        }
      }

      return inserted;
    });

    // Step 8: Generate embeddings for new items only
    if (newItems.length > 0) {
      const embeddings = await step.run('generate-embeddings', async () => {
        const texts = newItems.map((i) => i.text);
        return generateEmbeddings(texts);
      });

      await step.run('store-embeddings', async () => {
        const embeddingRows = newItems.map((item, idx) => ({
          id: crypto.randomUUID(),
          feedbackItemId: item.id,
          embedding: embeddings[idx],
          modelName: 'gemini-embedding-001',
          createdAt: new Date(),
        }));
        await db.insert(feedbackEmbeddings).values(embeddingRows);
      });
    }

    // Step 9: Mark sync as complete
    await step.run('update-sync-timestamp', async () => {
      await db
        .update(connectorConfigs)
        .set({ lastSyncedAt: new Date(), updatedAt: new Date() })
        .where(eq(connectorConfigs.id, config.id));
    });
  },
);
