import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { getConfigById, deleteConfig } from '@/lib/db/connector-queries';

export async function DELETE(
  req: NextRequest,
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

  const config = await getConfigById(id, organizationId);
  if (!config) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await deleteConfig(id, organizationId);

  return NextResponse.json({ deleted: true });
}
