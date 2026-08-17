import { neon } from '@neondatabase/serverless';

import { generateEmbedding } from '@/lib/ai/embed';
import { shouldIncludeNullRatings } from '@/lib/retrieval/rating-filter';

const dbUrl = process.env.DATABASE_URL;

export interface SearchFeedbackInput {
  query: string;
  ratingMin?: number;
  ratingMax?: number;
  placeId?: string;
  source?: string;
  page?: number;
}

export interface FeedbackSearchResult {
  items: Array<{
    text: unknown;
    rating: unknown;
    authorName: unknown;
    date: unknown;
    source: unknown;
    sourceUrl: unknown;
    profileImageUrl: unknown;
    placeId: unknown;
    businessTitle: unknown;
    businessAddress: unknown;
    relevance: number;
  }>;
  page: number;
  hasMore: boolean;
  total: number;
  ratingRange: { min: number; max: number };
}

export async function searchFeedback(
  organizationId: string,
  {
    query,
    ratingMin,
    ratingMax,
    placeId,
    source,
    page = 1,
  }: SearchFeedbackInput,
): Promise<FeedbackSearchResult> {
  if (!dbUrl) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  const sql = neon(dbUrl);
  const limit = 5;
  const offset = (page - 1) * limit;
  const includeNullRatings = shouldIncludeNullRatings(ratingMin, ratingMax);
  const minRating = ratingMin ?? 1;
  const maxRating = ratingMax ?? 5;
  const normalizedQuery = query.trim().toLowerCase();
  const isGenericQuery =
    !normalizedQuery ||
    normalizedQuery === 'all' ||
    normalizedQuery === 'review' ||
    normalizedQuery === 'reviews' ||
    normalizedQuery === 'all reviews' ||
    normalizedQuery === 'recent reviews' ||
    normalizedQuery === 'recent' ||
    normalizedQuery === '*';

  // Unfiltered search includes null ratings (community/web comments).
  // Explicit star filters keep requiring a numeric rating in range.
  const ratingClause = includeNullRatings
    ? sql`AND (f.rating IS NULL OR (f.rating >= ${minRating} AND f.rating <= ${maxRating}))`
    : sql`AND f.rating >= ${minRating} AND f.rating <= ${maxRating}`;

  let rows;
  let total;

  if (isGenericQuery) {
    rows = await sql`
      SELECT f.text, f.rating, f.author_name, f.created_at, f.source,
        f.metadata_json, c.place_id, c.title, c.sub_title,
        100 AS relevance
      FROM feedback_items f
      LEFT JOIN connector_configs c ON c.id = f.connector_config_id
      WHERE f.organization_id = ${organizationId}
        ${ratingClause}
        ${placeId ? sql`AND c.place_id = ${placeId}` : sql``}
        ${source ? sql`AND f.source = ${source}` : sql``}
      ORDER BY f.created_at DESC
      LIMIT ${limit + 1} OFFSET ${offset}
    `;

    const countResult = await sql`
      SELECT COUNT(*) as total
      FROM feedback_items f
      LEFT JOIN connector_configs c ON c.id = f.connector_config_id
      WHERE f.organization_id = ${organizationId}
        ${ratingClause}
        ${placeId ? sql`AND c.place_id = ${placeId}` : sql``}
        ${source ? sql`AND f.source = ${source}` : sql``}
    `;
    total = Number(countResult[0]?.total ?? 0);
  } else {
    const queryEmb = await generateEmbedding(query);
    const queryEmbStr = `[${queryEmb.join(',')}]`;

    rows = await sql`
      SELECT f.text, f.rating, f.author_name, f.created_at, f.source,
        f.metadata_json, c.place_id, c.title, c.sub_title,
        ROUND((1 - (e.embedding <=> ${queryEmbStr}::vector)) * 100) AS relevance
      FROM feedback_embeddings e
      JOIN feedback_items f ON f.id = e.feedback_item_id
      LEFT JOIN connector_configs c ON c.id = f.connector_config_id
      WHERE f.organization_id = ${organizationId}
        ${ratingClause}
        ${placeId ? sql`AND c.place_id = ${placeId}` : sql``}
        ${source ? sql`AND f.source = ${source}` : sql``}
      ORDER BY e.embedding <=> ${queryEmbStr}::vector
      LIMIT ${limit + 1} OFFSET ${offset}
    `;

    const countResult = await sql`
      SELECT COUNT(*) as total
      FROM feedback_embeddings e
      JOIN feedback_items f ON f.id = e.feedback_item_id
      LEFT JOIN connector_configs c ON c.id = f.connector_config_id
      WHERE f.organization_id = ${organizationId}
        ${ratingClause}
        ${placeId ? sql`AND c.place_id = ${placeId}` : sql``}
        ${source ? sql`AND f.source = ${source}` : sql``}
    `;
    total = Number(countResult[0]?.total ?? 0);
  }

  const hasMore = rows.length > limit;
  const items = rows.slice(0, limit).map((row: Record<string, unknown>) => ({
    text: row.text,
    rating: row.rating,
    authorName: row.author_name,
    date: row.created_at,
    source: row.source,
    sourceUrl:
      (row.metadata_json as Record<string, unknown>)?.review_url ?? null,
    profileImageUrl:
      (row.metadata_json as Record<string, unknown>)?.profile_image_url ??
      (
        (row.metadata_json as Record<string, unknown>)?.user_profile as Record<
          string,
          unknown
        >
      )?.image_url ??
      null,
    placeId: row.place_id ?? null,
    businessTitle: row.title ?? null,
    businessAddress: row.sub_title ?? null,
    relevance: Number(row.relevance),
  }));

  return {
    items,
    page,
    hasMore,
    total,
    ratingRange: { min: minRating, max: maxRating },
  };
}
