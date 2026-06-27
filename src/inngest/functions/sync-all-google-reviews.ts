import { inngest } from '../client';
import { db } from '@/db/drizzle';
import { connectorConfigs } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

const isDev = process.env.NODE_ENV === 'development';

export const syncAllGoogleReviews = inngest.createFunction(
  {
    id: 'sync-all-google-reviews',
    name: 'Sync All Google Reviews',
    triggers: isDev
      ? [{ event: 'google-reviews.sync-all' as const }]
      : [{ cron: '0 0 * * *' }],
  },
  async ({ step }) => {
    // Fetch all active Google Reviews configs
    const configs = await step.run('fetch-active-configs', async () => {
      return db
        .select()
        .from(connectorConfigs)
        .where(
          and(
            eq(connectorConfigs.connectorType, 'google_reviews'),
            eq(connectorConfigs.status, 'active'),
          ),
        );
    });

    if (configs.length === 0) return;

    // Fan out: send individual events so each config syncs independently
    await step.sendEvent(
      'fan-out-sync-events',
      configs.map((config) => ({
        name: 'google-reviews.sync' as const,
        data: { configId: config.id },
      })),
    );

    return { syncedConfigs: configs.length };
  },
);
