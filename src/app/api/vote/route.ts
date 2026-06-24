import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { db } from '@/db/drizzle';
import { votes } from '@/db/schema';
import { and, eq } from 'drizzle-orm';

export async function GET(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const chatId = searchParams.get('chatId');
  if (!chatId) {
    return new Response('chatId is required', { status: 400 });
  }

  const result = await db.select().from(votes).where(eq(votes.chatId, chatId));
  return Response.json(result);
}

export async function PATCH(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { chatId, messageId, type } = await req.json();
  if (!chatId || !messageId || !type) {
    return new Response('Missing required fields', { status: 400 });
  }

  const isUpvoted = type === 'up';

  await db
    .insert(votes)
    .values({ chatId, messageId, isUpvoted })
    .onConflictDoUpdate({
      target: [votes.chatId, votes.messageId],
      set: { isUpvoted },
    });

  return Response.json({ success: true });
}
