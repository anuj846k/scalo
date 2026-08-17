import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { eq, and } from 'drizzle-orm';

import { auth } from '@/lib/auth';
import { db } from '@/db/drizzle';
import { connectorConfigs } from '@/db/schema';
import { inngest } from '@/inngest/client';

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const organizationId = session.session.activeOrganizationId;
  if (!organizationId) {
    return NextResponse.json({ error: 'No active workspace' }, { status: 400 });
  }

  const { id } = await params;

  const [config] = await db
    .select()
    .from(connectorConfigs)
    .where(
      and(
        eq(connectorConfigs.id, id),
        eq(connectorConfigs.organizationId, organizationId),
        eq(connectorConfigs.connectorType, 'community'),
      ),
    )
    .limit(1);

  if (!config) {
    return NextResponse.json({ error: 'Connector not found' }, { status: 404 });
  }

  await db
    .update(connectorConfigs)
    .set({ status: 'pending', updatedAt: new Date() })
    .where(eq(connectorConfigs.id, config.id));

  await inngest.send({
    name: 'community.sync',
    data: { configId: config.id },
  });

  return NextResponse.json({
    status: 'processing',
    message: 'Re-sync started.',
    configId: config.id,
  });
}
