import { inngest } from '../client';
import { db } from '@/db/drizzle';
import { connectorConfigs } from '@/db/schema';
import { eq, and, or } from 'drizzle-orm';

export const syncAllGoogleReviews = inngest.createFunction(
  {
    id: 'sync-all-google-reviews',
    name: 'Sync All Google Reviews',
    triggers: [{ event: 'google-reviews.sync-all' }],
  },
  async ({ step }) => {
    const configs = await step.run('fetch-active-configs', async () => {
      return db
        .select()
        .from(connectorConfigs)
        .where(
          and(
            or(
              eq(connectorConfigs.connectorType, 'google_reviews'),
              eq(connectorConfigs.connectorType, 'trustpilot'),
            ),
            eq(connectorConfigs.status, 'active'),
          ),
        );
    });

    if (configs.length === 0) return;

    await step.sendEvent(
      'fan-out-sync-events',
      configs.map((config) => ({
        name:
          config.connectorType === 'trustpilot'
            ? ('trustpilot.sync' as const)
            : ('google-reviews.sync' as const),
        data: { configId: config.id },
      })),
    );

    return { syncedConfigs: configs.length };
  },
);
