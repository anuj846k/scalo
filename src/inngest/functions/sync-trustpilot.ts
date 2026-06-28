import { inngest } from '../client';
import { createDataForSEOClient } from '@/lib/ingestion/dataforseo';
import {
  normalizeTrustpilotReview,
  buildTrustpilotMetadata,
} from '@/lib/ingestion/trustpilot-reviews';
import { generateEmbeddings } from '@/lib/ai/embed';
import { db } from '@/db/drizzle';
import {
  feedbackItems,
  feedbackEmbeddings,
  connectorConfigs,
} from '@/db/schema';
import { eq, and } from 'drizzle-orm';

const isDev = process.env.NODE_ENV === 'development';
const INITIAL_SYNC_DEPTH = isDev ? 20 : 200;
const INCREMENTAL_SYNC_DEPTH = isDev ? 20 : 40;
const PINGBACK_TIMEOUT = '2h';

export const syncTrustpilot = inngest.createFunction(
  {
    id: 'sync-trustpilot',
    name: 'Sync Trustpilot Reviews',
    triggers: [{ event: 'trustpilot.sync' }],
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

    // Step 2: Create Trustpilot task
    const isFirstSync = config.lastSyncedAt == null;
    const depth = isFirstSync ? INITIAL_SYNC_DEPTH : INCREMENTAL_SYNC_DEPTH;

    const baseUrl =
      process.env.APP_BASE_URL ??
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000');

    const taskId = await step.run('create-task', async () => {
      const pingbackUrl = `${baseUrl}/api/connectors/trustpilot/pingback?id=$id`;
      return client.trustpilotTaskPost({
        domain: config.placeId,
        depth,
        sortBy: 'recency',
        pingbackUrl,
      });
    });

    // Step 3: Wait for DataForSEO pingback
    const taskCompleted = await step.waitForEvent('wait-for-dataforseo', {
      event: 'dataforseo.task-completed',
      timeout: PINGBACK_TIMEOUT,
      if: `async.data.taskId == "${taskId}"`,
    });

    if (!taskCompleted) {
      await step.run('mark-sync-failed', async () => {
        await db
          .update(connectorConfigs)
          .set({ updatedAt: new Date() })
          .where(eq(connectorConfigs.id, config.id));
      });
      return;
    }

    // Step 4: Fetch results
    const { items, resolvedTitle, resolvedSubTitle } = await step.run(
      'fetch-results',
      async () => {
        const result = await client.trustpilotTaskGet(taskId);
        return {
          items: result.items,
          resolvedTitle: result.title,
          resolvedSubTitle: result.subTitle,
        };
      },
    );

    if (items.length === 0) {
      await step.run('update-sync-timestamp-empty', async () => {
        await db
          .update(connectorConfigs)
          .set({ lastSyncedAt: new Date(), updatedAt: new Date() })
          .where(eq(connectorConfigs.id, config.id));
      });
      return;
    }

    // Step 5: Save business info on first sync
    if (isFirstSync && resolvedTitle) {
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

    // Step 6: Upsert reviews
    const newItems = await step.run('upsert-reviews', async () => {
      const inserted: Array<{ id: string; text: string }> = [];

      for (const item of items) {
        const normalized = normalizeTrustpilotReview(item);
        if (!normalized.text.trim() || !normalized.sourceItemId) continue;

        const metadataJson = buildTrustpilotMetadata(item);

        const existing = await db
          .select({ id: feedbackItems.id })
          .from(feedbackItems)
          .where(
            and(
              eq(feedbackItems.sourceItemId, normalized.sourceItemId),
              eq(feedbackItems.source, 'trustpilot'),
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
              metadataJson: metadataJson as any,
            })
            .where(eq(feedbackItems.id, existing[0].id));
        } else {
          const id = crypto.randomUUID();
          await db.insert(feedbackItems).values({
            id,
            organizationId: config.organizationId,
            connectorConfigId: config.id,
            source: 'trustpilot',
            sourceItemId: normalized.sourceItemId,
            text: normalized.text,
            rating: normalized.rating,
            authorName: normalized.authorName,
            createdAt: normalized.createdAt,
            metadataJson: metadataJson as any,
          });

          inserted.push({ id, text: normalized.text });
        }
      }

      return inserted;
    });

    // Step 7: Generate embeddings for new items
    if (newItems.length > 0) {
      const embeddings = await step.run('generate-embeddings', async () => {
        const texts = newItems.map((i) => i.text);
        return generateEmbeddings(texts);
      });

      await step.run('store-embeddings', async () => {
        const embeddingRows = newItems.map((item, idx) => ({
          id: crypto.randomUUID(),
          feedbackItemId: item.id,
          embedding: embeddings[idx] as any,
          modelName: 'gemini-embedding-001',
          createdAt: new Date(),
        }));
        await db.insert(feedbackEmbeddings).values(embeddingRows);
      });
    }

    // Step 8: Mark sync complete
    await step.run('update-sync-timestamp', async () => {
      await db
        .update(connectorConfigs)
        .set({ lastSyncedAt: new Date(), updatedAt: new Date() })
        .where(eq(connectorConfigs.id, config.id));
    });
  },
);
