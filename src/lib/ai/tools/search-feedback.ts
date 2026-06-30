import { tool } from 'ai';
import { z } from 'zod';
import { generateEmbedding } from '@/lib/ai/embed';
import { neon } from '@neondatabase/serverless';

const dbUrl = process.env.DATABASE_URL as string;
if (!dbUrl) {
  throw new Error('DATABASE_URL environment variable is not set');
}

export function createSearchFeedbackTool(organizationId: string) {
  return tool({
    description:
      'Search the customer feedback database to find reviews, complaints, and feedback relevant to a query. ' +
      'Use this tool whenever the user asks about customer feedback, reviews, complaints, trends, sentiment, ' +
      'themes, or anything related to the uploaded feedback data. Do NOT use for general conversation, ' +
      'small talk, greetings, or questions unrelated to customer feedback. ' +
      'To list general reviews chronologically (e.g. "recent reviews", "show reviews"), set query to "recent" or "all". ' +
      'Results are paginated — page 1 returns the first 5 most relevant items. If you need more, ' +
      'call again with page: 2, 3, etc. Use hasMore to know if more pages exist. ' +
      'Optionally filter by ratingMin/ratingMax (1-5) to narrow by sentiment. ' +
      'Optionally filter by source ("google_reviews", "trustpilot", "csv") when the user asks about reviews from a specific channel. ' +
      'When multiple businesses/locations are connected, each result includes placeId to identify the source. ' +
      'Use the placeId filter to search reviews from a specific business only.',
    inputSchema: z.object({
      query: z
        .string()
        .describe(
          'The search query (topic/theme). Pass "recent" or "all" to retrieve reviews sorted chronologically.',
        ),
      ratingMin: z
        .number()
        .min(1)
        .max(5)
        .optional()
        .describe(
          'Minimum star rating to include (1-5). Use 4 for "positive" queries.',
        ),
      ratingMax: z
        .number()
        .min(1)
        .max(5)
        .optional()
        .describe(
          'Maximum star rating to include (1-5). Use 2 for "negative" queries.',
        ),
      placeId: z
        .string()
        .optional()
        .describe(
          'Filter reviews from a specific business location by its Google Place ID or Trustpilot domain.',
        ),
      source: z
        .string()
        .optional()
        .describe(
          'Filter by feedback source. Use "google_reviews" for Google Reviews, "trustpilot" for Trustpilot, or "csv" for CSV uploads. Omit to search all sources.',
        ),
      page: z
        .number()
        .min(1)
        .default(1)
        .describe(
          'Page number for pagination. Starts at 1. Each page returns up to 5 items.',
        ),
    }),
    execute: async ({
      query,
      ratingMin,
      ratingMax,
      placeId,
      source,
      page = 1,
    }) => {
      const sql = neon(dbUrl);
      const limit = 5;
      const offset = (page - 1) * limit;
      const minRating = ratingMin ?? 1;
      const maxRating = ratingMax ?? 5;

      // Check if the query is generic (e.g., "all reviews", "recent", "reviews", or blank)
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

      let rows;
      let total;

      if (isGenericQuery) {
        console.log(
          `[searchFeedback] Executing GENERIC query. Query: "${query}", ratingMin: ${minRating}, ratingMax: ${maxRating}, placeId: ${placeId || 'none'}, source: ${source || 'all'}, page: ${page}, org: ${organizationId}`,
        );
        // Direct database query ordered by date (no embeddings needed)
        rows = await sql`
              SELECT f.text, f.rating, f.author_name, f.created_at, f.source,
                f.metadata_json, c.place_id, c.title, c.sub_title,
                100 AS relevance
              FROM feedback_items f
              LEFT JOIN connector_configs c ON c.id = f.connector_config_id
              WHERE f.organization_id = ${organizationId}
                AND f.rating >= ${minRating} AND f.rating <= ${maxRating}
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
                AND f.rating >= ${minRating} AND f.rating <= ${maxRating}
                ${placeId ? sql`AND c.place_id = ${placeId}` : sql``}
                ${source ? sql`AND f.source = ${source}` : sql``}
            `;
        total = Number(countResult[0]?.total ?? 0);
      } else {
        console.log(
          `[searchFeedback] Executing SEMANTIC VECTOR query. Query: "${query}", ratingMin: ${minRating}, ratingMax: ${maxRating}, placeId: ${placeId || 'none'}, source: ${source || 'all'}, page: ${page}, org: ${organizationId}`,
        );
        // Vector semantic search
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
                AND f.rating >= ${minRating} AND f.rating <= ${maxRating}
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
                AND f.rating >= ${minRating} AND f.rating <= ${maxRating}
                ${placeId ? sql`AND c.place_id = ${placeId}` : sql``}
                ${source ? sql`AND f.source = ${source}` : sql``}
            `;
        total = Number(countResult[0]?.total ?? 0);
      }

      const hasMore = rows.length > limit;
      const items = rows.slice(0, limit).map((r: Record<string, unknown>) => ({
        text: r.text,
        rating: r.rating,
        authorName: r.author_name,
        date: r.created_at,
        source: r.source,
        sourceUrl:
          (r.metadata_json as Record<string, unknown>)?.review_url ?? null,
        profileImageUrl:
          (r.metadata_json as Record<string, unknown>)?.profile_image_url ??
          (
            (r.metadata_json as Record<string, unknown>)
              ?.user_profile as Record<string, unknown>
          )?.image_url ??
          null,
        placeId: r.place_id ?? null,
        businessTitle: r.title ?? null,
        businessAddress: r.sub_title ?? null,
        relevance: Number(r.relevance),
      }));

      return {
        items,
        page,
        hasMore,
        total,
        ratingRange: { min: minRating, max: maxRating },
      };
    },
  });
}
