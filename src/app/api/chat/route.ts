import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
} from 'ai';
import { google, type GoogleLanguageModelOptions } from '@ai-sdk/google';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { eq } from 'drizzle-orm';
import { db } from '@/db/drizzle';
import { organization } from '@/db/schema';
import {
  createChat,
  deleteChat,
  getChatById,
  getMessages,
  saveMessage,
  updateChatTitle,
  updateMessage,
} from '@/lib/db/chat-queries';
import { createSearchFeedbackTool } from '@/lib/ai/tools/search-feedback';
import { systemPrompt } from '@/lib/ai/prompts';
import { generateTitleFromUserMessage } from '@/app/actions';
import type { ChatMessage } from '@/lib/types';

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  const organizationId = session.session.activeOrganizationId;
  if (!organizationId) {
    return new Response('No active organization', { status: 400 });
  }

  const [org] = await db
    .select({ subscriptionStatus: organization.subscriptionStatus })
    .from(organization)
    .where(eq(organization.id, organizationId))
    .limit(1);

  const status = org?.subscriptionStatus ?? 'inactive';
  if (status !== 'active' && status !== 'trialing') {
    return new Response('Subscription required', { status: 402 });
  }

  const body = await req.json();
  const chatId = body.id;

  if (!chatId) {
    return new Response('Chat ID is required', { status: 400 });
  }

  const isToolContinuation = Boolean(body.messages) && !body.message;

  let chat = await getChatById(chatId, organizationId);
  let titlePromise: Promise<string> | null = null;

  if (chat) {
    if (chat.userId !== session.user.id) {
      return new Response('Forbidden', { status: 403 });
    }
  } else if (body.message?.role === 'user') {
    await createChat({
      id: chatId,
      title: 'New chat',
      userId: session.user.id,
      organizationId,
    });
    chat = await getChatById(chatId, organizationId);
    titlePromise = generateTitleFromUserMessage({ message: body.message });
  }

  if (body.message?.role === 'user') {
    await saveMessage({
      id: body.message.id,
      chatId,
      role: 'user',
      parts: body.message.parts,
    });
  }

  let uiMessages: ChatMessage[];

  if (isToolContinuation && body.messages) {
    uiMessages = body.messages;
  } else {
    const dbMessages = await getMessages(chatId);
    const dbUiMessages = dbMessages.map((m) => ({
      id: m.id,
      role: m.role,
      parts: m.parts,
    }));
    uiMessages = [...dbUiMessages, body.message];
  }

  const modelMessages = await convertToModelMessages(uiMessages);

  const stream = createUIMessageStream({
    originalMessages: isToolContinuation ? uiMessages : undefined,
    execute: async ({ writer: dataStream }) => {
      const result = streamText({
        model: google('gemini-2.5-flash'),
        system: systemPrompt,
        messages: modelMessages,
        providerOptions: {
          google: {
            thinkingConfig: {
              thinkingBudget: 8192,
              includeThoughts: true,
            },
          } satisfies GoogleLanguageModelOptions,
        },
        tools: {
          searchFeedback: createSearchFeedbackTool(organizationId),
        },
      });

      dataStream.merge(
        result.toUIMessageStream({
          sendReasoning: true,
        }),
      );

      if (titlePromise) {
        try {
          const title = await titlePromise;
          dataStream.write({ type: 'data-chat-title', data: title });
          updateChatTitle(chatId, title);
        } catch {
          /* non-fatal */
        }
      }
    },
    onFinish: async ({ messages: finishedMessages }) => {
      for (const finishedMsg of finishedMessages) {
        const existingMsg = uiMessages.find((m) => m.id === finishedMsg.id);
        if (existingMsg) {
          await updateMessage(finishedMsg.id, finishedMsg.parts);
        } else {
          await saveMessage({
            id: finishedMsg.id,
            chatId,
            role: finishedMsg.role,
            parts: finishedMsg.parts,
          });
        }
      }
    },
  });

  return createUIMessageStreamResponse({
    stream,
  });
}

export async function DELETE(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  const organizationId = session.session.activeOrganizationId;
  if (!organizationId) {
    return new Response('No active organization', { status: 400 });
  }

  const url = new URL(req.url);
  const chatId = url.searchParams.get('id');
  if (!chatId) {
    return new Response('Chat ID is required', { status: 400 });
  }

  const chat = await getChatById(chatId, organizationId);
  if (!chat || chat.userId !== session.user.id) {
    return new Response('Forbidden', { status: 403 });
  }

  await deleteChat(chatId);
  return Response.json({ success: true });
}
