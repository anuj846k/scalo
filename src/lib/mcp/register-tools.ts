import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import type { McpContext } from '@/lib/mcp/context';
import {
  getCurrentContext,
  getFeedbackOverview,
  listConnectors,
  searchOrganizationFeedback,
} from '@/lib/mcp/tools';

export function registerScaloTools(
  server: McpServer,
  resolveContext: () => Promise<McpContext>,
) {
  async function withContext<T>(handler: (context: McpContext) => Promise<T>) {
    const context = await resolveContext();
    return {
      content: [
        { type: 'text' as const, text: JSON.stringify(await handler(context)) },
      ],
    };
  }

  server.registerTool(
    'get_current_context',
    {
      description:
        'Get the configured Scalo organization and optional user. Call this before querying feedback when organization context is needed.',
    },
    async () => withContext(getCurrentContext),
  );

  server.registerTool(
    'list_connectors',
    {
      description:
        'List the feedback connectors available to the configured Scalo organization, including source, location, status, and last sync time.',
    },
    async () => withContext(listConnectors),
  );

  server.registerTool(
    'get_feedback_overview',
    {
      description:
        'Get feedback volume, average rating, and breakdowns by source and rating for the configured Scalo organization. Use this for high-level feedback questions.',
    },
    async () => withContext(getFeedbackOverview),
  );

  server.registerTool(
    'search_feedback',
    {
      description:
        'Search customer feedback for the configured Scalo organization. Returns source evidence matching a theme, question, rating, location, or connector.',
      inputSchema: {
        query: z
          .string()
          .describe(
            'Feedback theme or question. Use "recent" to list recent feedback.',
          ),
        ratingMin: z.number().min(1).max(5).optional(),
        ratingMax: z.number().min(1).max(5).optional(),
        placeId: z.string().optional(),
        source: z
          .enum(['google_reviews', 'trustpilot', 'csv', 'community', 'web'])
          .optional(),
        page: z.number().int().min(1).default(1),
      },
    },
    async (input) =>
      withContext((context) => searchOrganizationFeedback(context, input)),
  );
}
