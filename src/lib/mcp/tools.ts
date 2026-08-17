import { desc, eq, sql } from 'drizzle-orm';

import { db } from '@/db/drizzle';
import { connectorConfigs, feedbackItems } from '@/db/schema';
import type { McpContext } from '@/lib/mcp/context';
import { searchFeedback } from '@/lib/retrieval/search-feedback';

export async function getCurrentContext(context: McpContext) {
  return context;
}

export async function listConnectors(context: McpContext) {
  return db
    .select({
      id: connectorConfigs.id,
      type: connectorConfigs.connectorType,
      placeId: connectorConfigs.placeId,
      title: connectorConfigs.title,
      subTitle: connectorConfigs.subTitle,
      status: connectorConfigs.status,
      lastSyncedAt: connectorConfigs.lastSyncedAt,
    })
    .from(connectorConfigs)
    .where(eq(connectorConfigs.organizationId, context.organization.id))
    .orderBy(desc(connectorConfigs.updatedAt));
}

export async function searchOrganizationFeedback(
  context: McpContext,
  input: Parameters<typeof searchFeedback>[1],
) {
  return searchFeedback(context.organization.id, input);
}

export async function getFeedbackOverview(context: McpContext) {
  const [totals] = await db
    .select({
      total: sql<number>`count(*)::int`,
      averageRating: sql<
        number | null
      >`round(avg(${feedbackItems.rating})::numeric, 2)`,
      latestFeedbackAt: sql<Date | null>`max(${feedbackItems.createdAt})`,
    })
    .from(feedbackItems)
    .where(eq(feedbackItems.organizationId, context.organization.id));

  const bySource = await db
    .select({
      source: feedbackItems.source,
      total: sql<number>`count(*)::int`,
      averageRating: sql<
        number | null
      >`round(avg(${feedbackItems.rating})::numeric, 2)`,
    })
    .from(feedbackItems)
    .where(eq(feedbackItems.organizationId, context.organization.id))
    .groupBy(feedbackItems.source)
    .orderBy(desc(sql`count(*)`));

  const byRating = await db
    .select({
      rating: feedbackItems.rating,
      total: sql<number>`count(*)::int`,
    })
    .from(feedbackItems)
    .where(eq(feedbackItems.organizationId, context.organization.id))
    .groupBy(feedbackItems.rating)
    .orderBy(feedbackItems.rating);

  return { totals, bySource, byRating };
}
