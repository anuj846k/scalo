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
      title: c.title,
      subTitle: c.subTitle,
      locationCode: c.locationCode,
      locationCoordinate: c.locationCoordinate,
      lastSyncedAt: c.lastSyncedAt,
      status: c.status,
      createdAt: c.createdAt,
    })),
  });
}
