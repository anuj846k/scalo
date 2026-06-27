import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { extractGoogleMapsId } from '@/lib/ingestion/google-maps';
import {
  createConnectorConfig,
  getConfigByPlaceId,
} from '@/lib/db/connector-queries';
import { inngest } from '@/inngest/client';

async function resolveShortUrl(input: string): Promise<string> {
  try {
    const res = await fetch(input, { redirect: 'follow' });
    return res.url;
  } catch {
    return input;
  }
}

function extractCoordinate(input: string): string | null {
  try {
    const url = new URL(input);
    const match = url.pathname.match(/\/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (match?.[1] && match?.[2]) {
      return `${match[1]},${match[2]},200`;
    }
  } catch {
    // not a URL
  }
  return null;
}

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

  let input = body.placeIdOrUrl?.trim();
  if (!input) {
    return NextResponse.json(
      { error: 'Place ID or URL is required' },
      { status: 400 },
    );
  }

  if (
    input.startsWith('https://maps.app.goo.gl/') ||
    input.startsWith('https://goo.gl/maps/')
  ) {
    input = await resolveShortUrl(input);
  }

  const googleMapsId = extractGoogleMapsId(input);
  if (!googleMapsId) {
    return NextResponse.json(
      {
        error:
          'Could not extract a valid identifier from the input. Paste a Google Maps URL or Place ID.',
      },
      { status: 400 },
    );
  }

  const existing = await getConfigByPlaceId(
    organizationId,
    'google_reviews',
    googleMapsId,
  );
  if (existing) {
    return NextResponse.json(
      { error: 'This business is already connected' },
      { status: 409 },
    );
  }

  const coordinate = extractCoordinate(input);

  const config = await createConnectorConfig({
    organizationId,
    connectorType: 'google_reviews',
    placeId: googleMapsId,
    locationCoordinate: coordinate ?? undefined,
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
