import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { getChatById, getMessages } from '@/lib/db/chat-queries';

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
  const chatId = url.searchParams.get('chatId');

  if (!chatId) {
    return new Response('chatId is required', { status: 400 });
  }

  const chat = await getChatById(chatId, organizationId);
  if (!chat) {
    return Response.json({ messages: [] });
  }

  if (chat.userId !== session.user.id) {
    return new Response('Forbidden', { status: 403 });
  }

  const msgs = await getMessages(chatId);
  return Response.json({
    messages: msgs.map((m) => ({
      id: m.id,
      chatId: m.chatId,
      role: m.role,
      parts: m.parts,
      createdAt: m.createdAt,
    })),
  });
}
