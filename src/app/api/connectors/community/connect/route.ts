import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

import { auth } from '@/lib/auth';
import {
  createConnectorConfig,
  getConfigByPlaceId,
} from '@/lib/db/connector-queries';
import {
  classifyCommunityUrl,
  deriveCommunityTitle,
} from '@/lib/ingestion/community-url';
import { inngest } from '@/inngest/client';
import { db } from '@/db/drizzle';
import { connectorConfigs } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const organizationId = session.session.activeOrganizationId;
  if (!organizationId) {
    return NextResponse.json({ error: 'No active workspace' }, { status: 400 });
  }

  let body: { url?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 },
    );
  }

  let classified;
  try {
    classified = classifyCommunityUrl(body.url ?? '');
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Could not parse that URL. Paste a public discussion link.',
      },
      { status: 400 },
    );
  }

  if (classified.blocked) {
    return NextResponse.json(
      {
        error: classified.blockReason,
        code:
          classified.kind === 'google_reviews'
            ? 'USE_GOOGLE_CONNECTOR'
            : 'USE_TRUSTPILOT_CONNECTOR',
        redirect:
          classified.kind === 'google_reviews'
            ? '/dashboard/connectors/google-reviews'
            : '/dashboard/connectors/trustpilot',
      },
      { status: 400 },
    );
  }

  const existing = await getConfigByPlaceId(
    organizationId,
    'community',
    classified.canonicalUrl,
  );

  if (existing) {
    await db
      .update(connectorConfigs)
      .set({ status: 'pending', updatedAt: new Date() })
      .where(eq(connectorConfigs.id, existing.id));

    await inngest.send({
      name: 'community.sync',
      data: { configId: existing.id },
    });

    return NextResponse.json({
      status: 'processing',
      message:
        'Re-importing this thread. New comments will be added without duplicates.',
      configId: existing.id,
      reimported: true,
    });
  }

  const config = await createConnectorConfig({
    organizationId,
    connectorType: 'community',
    placeId: classified.canonicalUrl,
    title: deriveCommunityTitle(null, classified.hostname),
    subTitle: classified.platform,
    status: 'pending',
  });

  await inngest.send({
    name: 'community.sync',
    data: { configId: config.id },
  });

  return NextResponse.json({
    status: 'processing',
    message: 'Discussion is being imported. This may take a moment.',
    configId: config.id,
  });
}
