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
    'call again with page: 2, 3, etc. The total field tells you how many matching items exist in total.',
  inputSchema: z.object({
    query: z
      .string()
      .describe('The search query to find matching customer feedback'),
    page: z
      .number()
      .min(1)
      .default(1)
      .describe(
        'Page number for pagination. Starts at 1. Each page returns up to 5 items.',
      ),
  }),
  execute: async ({ query, page = 1 }) => {
    const sql = neon(DATABASE_URL);
    const queryEmb = await generateEmbedding(query);
    const queryEmbStr = `[${queryEmb.join(',')}]`;
    const limit = 5;
    const offset = (page - 1) * limit;

    const countResult = await sql`
      SELECT COUNT(*) as total
      FROM feedback_embeddings e
      JOIN feedback_items f ON f.id = e.feedback_item_id
    `;
    const total = Number(countResult[0]?.total ?? 0);

    const rows = await sql`
      SELECT f.text, f.rating,
        ROUND((1 - (e.embedding <=> ${queryEmbStr}::vector)) * 100) AS relevance
      FROM feedback_embeddings e
      JOIN feedback_items f ON f.id = e.feedback_item_id
      ORDER BY e.embedding <=> ${queryEmbStr}::vector
      LIMIT ${limit} OFFSET ${offset}
    `;

    const items = rows.map((r: any) => ({
      text: r.text,
      rating: r.rating,
      relevance: Number(r.relevance),
    }));

    return { items, total, page, hasMore: offset + limit < total };
  },
});
