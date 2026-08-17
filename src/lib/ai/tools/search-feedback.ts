import { tool } from 'ai';
import { z } from 'zod';
import { searchFeedback } from '@/lib/retrieval/search-feedback';

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
      'Optionally filter by source ("google_reviews", "trustpilot", "csv", "community", "web") when the user asks about feedback from a specific channel. ' +
      'When multiple businesses/locations are connected, each result includes placeId to identify the source. ' +
      'Use the placeId filter to search reviews from a specific business only. ' +
      'Omit ratingMin/ratingMax to include community/web comments that have no star rating.',
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
          'Minimum star rating to include (1-5). Use 4 for "positive" queries. When set, excludes null-rated community comments.',
        ),
      ratingMax: z
        .number()
        .min(1)
        .max(5)
        .optional()
        .describe(
          'Maximum star rating to include (1-5). Use 2 for "negative" queries. When set, excludes null-rated community comments.',
        ),
      placeId: z
        .string()
        .optional()
        .describe(
          'Filter feedback from a specific business location or community thread URL (connector placeId).',
        ),
      source: z
        .string()
        .optional()
        .describe(
          'Filter by feedback source. Use "google_reviews", "trustpilot", "csv", "community" (Reddit/HN/Product Hunt), or "web" (best-effort discussion imports). Omit to search all sources.',
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
      return searchFeedback(organizationId, {
        query,
        ratingMin,
        ratingMax,
        placeId,
        source,
        page,
      });
    },
  });
}
