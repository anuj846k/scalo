import { serve } from 'inngest/next';
import { inngest } from '@/inngest/client';
import { syncGoogleReviews } from '@/inngest/functions/sync-google-reviews';
import { syncAllGoogleReviews } from '@/inngest/functions/sync-all-google-reviews';

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [syncAllGoogleReviews, syncGoogleReviews],
});
