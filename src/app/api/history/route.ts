import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { deleteAllChats, getChatsByUser } from '@/lib/db/chat-queries';

export async function GET(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  const organizationId = session.session.activeOrganizationId;
  if (!organizationId) {
    return new Response('No active organization', { status: 400 });
  }

  const url = new URL(req.url);
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 50);
  const before = url.searchParams.get('before') || undefined;

  const result = await getChatsByUser({
    userId: session.user.id,
    organizationId,
    limit,
    before,
  });

  return Response.json(result);
}

export async function DELETE() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  const organizationId = session.session.activeOrganizationId;
  if (!organizationId) {
    return new Response('No active organization', { status: 400 });
  }

  const count = await deleteAllChats(session.user.id, organizationId);
  return Response.json({ deletedCount: count });
}
