import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { extractPlaceId } from '@/lib/ingestion/place-id';
import {
  createConnectorConfig,
  getConfigByPlaceId,
} from '@/lib/db/connector-queries';
import { inngest } from '@/inngest/client';

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const organizationId = session.session.activeOrganizationId;
  if (!organizationId) {
    return NextResponse.json({ error: 'No active workspace' }, { status: 400 });
  }

  let body: { placeIdOrUrl?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 },
    );
  }

  const input = body.placeIdOrUrl?.trim();
  if (!input) {
    return NextResponse.json(
      { error: 'Place ID or URL is required' },
      { status: 400 },
    );
  }

  const placeId = extractPlaceId(input);
  if (!placeId) {
    return NextResponse.json(
      {
        error:
          'Could not extract a valid Place ID from the input. Paste a Google Maps URL or Place ID.',
      },
      { status: 400 },
    );
  }

  const existing = await getConfigByPlaceId(
    organizationId,
    'google_reviews',
    placeId,
  );
  if (existing) {
    return NextResponse.json(
      { error: 'This business is already connected' },
      { status: 409 },
    );
  }

  const config = await createConnectorConfig({
    organizationId,
    connectorType: 'google_reviews',
    placeId,
  });

  await inngest.send({
    name: 'google-reviews.sync',
    data: { configId: config.id },
  });

  return NextResponse.json({
    status: 'processing',
    message: 'Reviews are being synced. This may take a moment.',
    configId: config.id,
  });
}
