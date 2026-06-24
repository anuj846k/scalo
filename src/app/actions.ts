'use server';

import { generateText, type UIMessage } from 'ai';
import { google } from '@ai-sdk/google';
import { titlePrompt } from '@/lib/ai/prompts';

export async function generateTitleFromUserMessage({
  message,
}: {
  message: UIMessage;
}) {
  const { text } = await generateText({
    model: google('gemini-2.5-flash'),
    system: titlePrompt,
    prompt: getTextFromMessage(message),
  });
  return text
    .replace(/^[#*"\s]+/, '')
    .replace(/["]+$/, '')
    .trim();
}

function getTextFromMessage(message: UIMessage): string {
  return (
    (message.parts as Array<{ type: string; text?: string }>)
      .filter((part) => part.type === 'text')
      .map((part) => part.text || '')
      .join('') || 'New chat'
  );
}
