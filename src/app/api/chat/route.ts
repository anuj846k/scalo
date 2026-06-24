import { convertToModelMessages, smoothStream, streamText } from 'ai';
import { google } from '@ai-sdk/google';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import {
  createChat,
  deleteChat,
  getChatById,
  getMessages,
  saveMessage,
  updateChatTitle,
} from '@/lib/db/chat-queries';

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  const organizationId = session.session.activeOrganizationId;
  if (!organizationId) {
    return new Response('No active organization', { status: 400 });
  }

  const body = await req.json();
  const chatId = body.id;

  if (!chatId) {
    return new Response('Chat ID is required', { status: 400 });
  }

  const lastMessage = body.messages?.[body.messages.length - 1];
  const userText = lastMessage?.parts?.find(
    (p: { type: string }) => p.type === 'text',
  )?.text;

  let existingChat = await getChatById(chatId);
  if (!existingChat) {
    await createChat({
      id: chatId,
      title: userText?.slice(0, 80) || 'New chat',
      userId: session.user.id,
      organizationId,
    });
    existingChat = await getChatById(chatId);
  }

  if (!existingChat || existingChat.userId !== session.user.id) {
    return new Response('Forbidden', { status: 403 });
  }

  if (userText) {
    await saveMessage({
      id: crypto.randomUUID(),
      chatId,
      role: 'user',
      parts: [{ type: 'text', text: userText }],
    });
  }

  const dbMessages = await getMessages(chatId);
  const modelMessages = dbMessages.map((m) => ({
    id: m.id,
    role: m.role as 'user' | 'assistant',
    parts: m.parts as Array<{ type: string; text?: string }>,
  }));

  const result = streamText({
    model: google('gemini-2.5-flash'),
    messages: await convertToModelMessages(modelMessages as any),
    experimental_transform: smoothStream({
      delayInMs: 30,
      chunking: 'word',
    }),
    onFinish: async ({ text }) => {
      await saveMessage({
        id: crypto.randomUUID(),
        chatId,
        role: 'assistant',
        parts: [{ type: 'text', text }],
      });

      const dbMsgs = await getMessages(chatId);
      if (dbMsgs.length <= 2) {
        const title = text.slice(0, 80);
        await updateChatTitle(chatId, title);
      }
    },
  });

  return result.toUIMessageStreamResponse();
}

export async function DELETE(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  const url = new URL(req.url);
  const chatId = url.searchParams.get('id');
  if (!chatId) {
    return new Response('Chat ID is required', { status: 400 });
  }

  const chat = await getChatById(chatId);
  if (!chat || chat.userId !== session.user.id) {
    return new Response('Forbidden', { status: 403 });
  }

  await deleteChat(chatId);
  return Response.json({ success: true });
}
