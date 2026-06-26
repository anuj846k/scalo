import { serve } from 'inngest/next';
import { inngest } from '@/inngest/client';
import { syncGoogleReviews } from '@/inngest/functions/sync-google-reviews';

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [syncGoogleReviews],
});
