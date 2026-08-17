import { inngest } from '../client';
import { extractCommunityComments } from '@/lib/ingestion/community-extract';
import { normalizeCommunityExtraction } from '@/lib/ingestion/community';
import { deriveCommunityTitle } from '@/lib/ingestion/community-url';
import { scrapeDiscussionUrl } from '@/lib/ingestion/firecrawl';
import { generateEmbeddings } from '@/lib/ai/embed';
import { db } from '@/db/drizzle';
import {
  feedbackItems,
  feedbackEmbeddings,
  connectorConfigs,
} from '@/db/schema';
import { eq, and } from 'drizzle-orm';

async function markConfigStatus(
  configId: string,
  status: 'pending' | 'active' | 'failed',
  extras?: { title?: string; subTitle?: string | null; lastSyncedAt?: Date },
) {
  await db
    .update(connectorConfigs)
    .set({
      status,
      updatedAt: new Date(),
      ...(extras?.title !== undefined ? { title: extras.title } : {}),
      ...(extras?.subTitle !== undefined ? { subTitle: extras.subTitle } : {}),
      ...(extras?.lastSyncedAt !== undefined
        ? { lastSyncedAt: extras.lastSyncedAt }
        : {}),
    })
    .where(eq(connectorConfigs.id, configId));
}

export const syncCommunity = inngest.createFunction(
  {
    id: 'sync-community',
    name: 'Sync Community Discussion',
    triggers: [{ event: 'community.sync' }],
    retries: 2,
  },
  async ({ event, step }) => {
    const { configId } = event.data as { configId?: string };
    if (!configId) return;

    const config = await step.run('load-config', async () => {
      const rows = await db
        .select()
        .from(connectorConfigs)
        .where(eq(connectorConfigs.id, configId))
        .limit(1);
      return rows[0] ?? null;
    });

    if (!config || config.connectorType !== 'community') return;
    if (config.status === 'failed' && !config.placeId) return;

    await step.run('mark-pending', async () => {
      await markConfigStatus(config.id, 'pending');
    });

    try {
      const scraped = await step.run('firecrawl-scrape', async () => {
        return scrapeDiscussionUrl(config.placeId);
      });

      const extraction = await step.run('extract-comments', async () => {
        return extractCommunityComments(
          config.placeId,
          scraped.markdown,
          scraped.title,
        );
      });

      const summary = await step.run('normalize-and-upsert', async () => {
        const normalized = normalizeCommunityExtraction(
          config.placeId,
          extraction,
        );

        if (normalized.items.length === 0) {
          await markConfigStatus(config.id, 'failed', {
            title: deriveCommunityTitle(
              normalized.threadTitle ?? scraped.title,
              normalized.hostname,
            ),
            subTitle: normalized.canonicalUrl,
          });
          return {
            empty: true as const,
            inserted: [] as Array<{ id: string; text: string }>,
            count: 0,
          };
        }

        await markConfigStatus(config.id, 'pending', {
          title: deriveCommunityTitle(
            normalized.threadTitle ?? scraped.title,
            normalized.hostname,
          ),
          subTitle: normalized.hostname,
        });

        const inserted: Array<{ id: string; text: string }> = [];

        for (const item of normalized.items) {
          if (!item.sourceItemId) continue;

          const existing = await db
            .select({ id: feedbackItems.id })
            .from(feedbackItems)
            .where(
              and(
                eq(feedbackItems.sourceItemId, item.sourceItemId),
                eq(feedbackItems.source, item.source),
              ),
            )
            .limit(1);

          if (existing.length > 0) {
            await db
              .update(feedbackItems)
              .set({
                text: item.text,
                rating: null,
                authorName: item.authorName,
                metadataJson: item.metadata,
              })
              .where(eq(feedbackItems.id, existing[0].id));
          } else {
            const id = crypto.randomUUID();
            await db.insert(feedbackItems).values({
              id,
              organizationId: config.organizationId,
              connectorConfigId: config.id,
              source: item.source,
              sourceItemId: item.sourceItemId,
              text: item.text,
              rating: null,
              authorName: item.authorName,
              createdAt: item.createdAt,
              metadataJson: item.metadata,
            });
            inserted.push({ id, text: item.text });
          }
        }

        return {
          empty: false as const,
          inserted,
          count: normalized.items.length,
        };
      });

      if (summary.empty) {
        return {
          status: 'failed',
          reason: 'No discussion comments found on this page.',
        };
      }

      const newItems = summary.inserted;

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

      await step.run('mark-active', async () => {
        await markConfigStatus(config.id, 'active', {
          lastSyncedAt: new Date(),
        });
      });

      return {
        status: 'active',
        upserted: summary.count,
        embedded: newItems.length,
      };
    } catch (error) {
      await step.run('mark-failed', async () => {
        await markConfigStatus(config.id, 'failed');
      });
      throw error;
    }
  },
);
