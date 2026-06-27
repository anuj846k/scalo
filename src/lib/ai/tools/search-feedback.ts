import { tool } from 'ai';
import { z } from 'zod';
import { generateEmbedding } from '@/lib/ai/embed';
import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

export const searchFeedback = tool({
  description:
    'Search the customer feedback database to find reviews, complaints, and feedback relevant to a query. ' +
    'Use this tool whenever the user asks about customer feedback, reviews, complaints, trends, sentiment, ' +
    'themes, or anything related to the uploaded feedback data. Do NOT use for general conversation, ' +
    'small talk, greetings, or questions unrelated to customer feedback. ' +
    'Results are paginated — page 1 returns the first 5 most relevant items. If you need more, ' +
    'call again with page: 2, 3, etc. Use hasMore to know if more pages exist. ' +
    'Optionally filter by ratingMin/ratingMax (1-5) to narrow by sentiment. ' +
    'When multiple businesses/locations are connected, each result includes placeId to identify the source. ' +
    'Use the placeId filter to search reviews from a specific business only.',
  inputSchema: z.object({
    query: z
      .string()
      .describe('The search query to find matching customer feedback'),
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
        'Filter reviews from a specific business location by its Google Place ID.',
      ),
    page: z
      .number()
      .min(1)
      .default(1)
      .describe(
        'Page number for pagination. Starts at 1. Each page returns up to 5 items.',
      ),
  }),
  execute: async ({ query, ratingMin, ratingMax, placeId, page = 1 }) => {
    const sql = neon(DATABASE_URL);
    const queryEmb = await generateEmbedding(query);
    const queryEmbStr = `[${queryEmb.join(',')}]`;
    const limit = 5;
    const offset = (page - 1) * limit;

    const minRating = ratingMin ?? 1;
    const maxRating = ratingMax ?? 5;

    const rows = placeId
      ? await sql`
          SELECT f.text, f.rating, f.author_name, f.created_at, f.source,
            f.metadata_json, c.place_id, c.title, c.sub_title,
            ROUND((1 - (e.embedding <=> ${queryEmbStr}::vector)) * 100) AS relevance
          FROM feedback_embeddings e
          JOIN feedback_items f ON f.id = e.feedback_item_id
          LEFT JOIN connector_configs c ON c.id = f.connector_config_id
          WHERE f.rating >= ${minRating} AND f.rating <= ${maxRating}
            AND c.place_id = ${placeId}
          ORDER BY e.embedding <=> ${queryEmbStr}::vector
          LIMIT ${limit + 1} OFFSET ${offset}
        `
      : await sql`
          SELECT f.text, f.rating, f.author_name, f.created_at, f.source,
            f.metadata_json, c.place_id, c.title, c.sub_title,
            ROUND((1 - (e.embedding <=> ${queryEmbStr}::vector)) * 100) AS relevance
          FROM feedback_embeddings e
          JOIN feedback_items f ON f.id = e.feedback_item_id
          LEFT JOIN connector_configs c ON c.id = f.connector_config_id
          WHERE f.rating >= ${minRating} AND f.rating <= ${maxRating}
          ORDER BY e.embedding <=> ${queryEmbStr}::vector
          LIMIT ${limit + 1} OFFSET ${offset}
        `;

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
        (r.metadata_json as Record<string, unknown>)?.profile_image_url ?? null,
      placeId: r.place_id ?? null,
      businessTitle: r.title ?? null,
      businessAddress: r.sub_title ?? null,
      relevance: Number(r.relevance),
    }));

    // Count total matching items (for the rating range, optionally scoped to placeId)
    const countResult = placeId
      ? await sql`
          SELECT COUNT(*) as total
          FROM feedback_embeddings e
          JOIN feedback_items f ON f.id = e.feedback_item_id
          LEFT JOIN connector_configs c ON c.id = f.connector_config_id
          WHERE f.rating >= ${minRating} AND f.rating <= ${maxRating}
            AND c.place_id = ${placeId}
        `
      : await sql`
          SELECT COUNT(*) as total
          FROM feedback_embeddings e
          JOIN feedback_items f ON f.id = e.feedback_item_id
          WHERE f.rating >= ${minRating} AND f.rating <= ${maxRating}
        `;
    const total = Number(countResult[0]?.total ?? 0);

    return {
      items,
      page,
      hasMore,
      total,
      ratingRange: { min: minRating, max: maxRating },
    };
  },
});
