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

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const syncGoogleReviews = inngest.createFunction(
  {
    id: 'sync-google-reviews',
    name: 'Sync Google Reviews',
    triggers: [{ event: 'google-reviews.sync' }, { cron: '0 0 * * *' }],
  },
  async ({ event }) => {
    const client = createDataForSEOClient();
    const isEvent = event.name === 'google-reviews.sync';

    if (!isEvent) {
      const configs = await db
        .select()
        .from(connectorConfigs)
        .where(
          and(
            eq(connectorConfigs.connectorType, 'google_reviews'),
            eq(connectorConfigs.status, 'active'),
          ),
        );

      for (const config of configs) {
        await syncConfig(client, config);
      }
    } else {
      const data = event.data as { configId?: string };
      if (!data.configId) return;

      const configs = await db
        .select()
        .from(connectorConfigs)
        .where(eq(connectorConfigs.id, data.configId))
        .limit(1);

      if (configs[0]) {
        await syncConfig(client, configs[0]);
      }
    }
  },
);

async function syncConfig(
  client: ReturnType<typeof createDataForSEOClient>,
  config: typeof connectorConfigs.$inferSelect,
) {
  if (config.status !== 'active') return;

  let locationCode = config.locationCode;

  if (locationCode == null && config.locationCoordinate == null) {
    try {
      const code = await client.getLocationCode();
      if (code) {
        locationCode = code;
        await db
          .update(connectorConfigs)
          .set({ locationCode: code, updatedAt: new Date() })
          .where(eq(connectorConfigs.id, config.id));
      }
    } catch (e) {
      console.error(`Failed to get location code for config ${config.id}:`, e);
      return;
    }
  }

  if (locationCode == null && config.locationCoordinate == null) return;

  const depth = config.lastSyncedAt == null ? 4490 : 20;
  const sortBy = config.lastSyncedAt == null ? 'relevant' : 'newest';

  let taskId: string;
  try {
    taskId = await client.taskPost({
      placeId: config.placeId,
      locationCode,
      locationCoordinate: config.locationCoordinate,
      depth,
      sortBy,
    });
  } catch (e) {
    console.error(
      `Failed to create DataForSEO task for config ${config.id}:`,
      e,
    );
    return;
  }

  let items: Awaited<ReturnType<typeof client.taskGet>>['items'] = [];

  for (let i = 0; i < 40; i++) {
    await delay(3000);

    try {
      const readyIds = await client.tasksReady();
      if (readyIds.includes(taskId)) {
        const result = await client.taskGet(taskId);
        items = result.items;
        break;
      }
    } catch (e) {
      console.error(`Poll error for task ${taskId}:`, e);
    }
  }

  if (items.length === 0) {
    await db
      .update(connectorConfigs)
      .set({ lastSyncedAt: new Date(), updatedAt: new Date() })
      .where(eq(connectorConfigs.id, config.id));
    return;
  }

  const newItems: Array<{
    id: string;
    organizationId: string;
    text: string;
  }> = [];

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
          metadataJson: metadataJson as any,
        })
        .where(eq(feedbackItems.id, existing[0].id));
    } else {
      const id = crypto.randomUUID();
      await db.insert(feedbackItems).values({
        id,
        organizationId: config.organizationId,
        source: 'google_reviews',
        sourceItemId: normalized.sourceItemId,
        text: normalized.text,
        rating: normalized.rating,
        authorName: normalized.authorName,
        createdAt: normalized.createdAt,
        metadataJson: metadataJson as any,
      });

      newItems.push({
        id,
        organizationId: config.organizationId,
        text: normalized.text,
      });
    }
  }

  if (newItems.length > 0) {
    const texts = newItems.map((i) => i.text);
    const embeddings = await generateEmbeddings(texts);

    const embeddingRows = newItems.map((item, idx) => ({
      id: crypto.randomUUID(),
      feedbackItemId: item.id,
      embedding: embeddings[idx] as any,
      modelName: 'gemini-embedding-001',
      createdAt: new Date(),
    }));

    await db.insert(feedbackEmbeddings).values(embeddingRows);
  }

  await db
    .update(connectorConfigs)
    .set({ lastSyncedAt: new Date(), updatedAt: new Date() })
    .where(eq(connectorConfigs.id, config.id));
}
