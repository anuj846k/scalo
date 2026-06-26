import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { getConfigsByWorkspace } from '@/lib/db/connector-queries';

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const organizationId = session.session.activeOrganizationId;
  if (!organizationId) {
    return NextResponse.json({ error: 'No active workspace' }, { status: 400 });
  }

  const configs = await getConfigsByWorkspace(organizationId);

  return NextResponse.json({
    configs: configs.map((c) => ({
      id: c.id,
      connectorType: c.connectorType,
      placeId: c.placeId,
      locationCode: c.locationCode,
      lastSyncedAt: c.lastSyncedAt,
      status: c.status,
      createdAt: c.createdAt,
    })),
  });
}
