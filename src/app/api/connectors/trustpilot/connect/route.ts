import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import {
  createConnectorConfig,
  getConfigByPlaceId,
} from '@/lib/db/connector-queries';
import { inngest } from '@/inngest/client';

function extractTrustpilotDomain(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  try {
    const url = new URL(trimmed);
    if (
      url.hostname === 'www.trustpilot.com' ||
      url.hostname === 'trustpilot.com'
    ) {
      const pathMatch = url.pathname.match(/^\/review\/([^/]+)/);
      if (pathMatch?.[1]) {
        const domain = decodeURIComponent(pathMatch[1]).trim();
        if (domain) return domain;
      }
    }
  } catch {
    // not a URL, treat as raw domain
  }

  if (trimmed.includes('.')) return trimmed;
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

  let body: { domain?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 },
    );
  }

  const domain = extractTrustpilotDomain(body.domain ?? '');
  if (!domain) {
    return NextResponse.json(
      {
        error:
          'Could not extract a valid domain. Paste a Trustpilot URL (e.g. https://www.trustpilot.com/review/www.wise.com) or a domain (e.g. www.wise.com).',
      },
      { status: 400 },
    );
  }

  const existing = await getConfigByPlaceId(
    organizationId,
    'trustpilot',
    domain,
  );
  if (existing) {
    return NextResponse.json(
      { error: 'This business is already connected' },
      { status: 409 },
    );
  }

  const config = await createConnectorConfig({
    organizationId,
    connectorType: 'trustpilot',
    placeId: domain,
  });

  await inngest.send({
    name: 'trustpilot.sync',
    data: { configId: config.id },
  });

  return NextResponse.json({
    status: 'processing',
    message: 'Reviews are being synced. This may take a moment.',
    configId: config.id,
  });
}
