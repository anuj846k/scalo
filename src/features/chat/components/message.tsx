'use client';

import type { ChatMessage } from '@/lib/types';
import { Shimmer } from './shimmer';
import { Tool, ToolContent, ToolHeader, ToolInput, ToolOutput } from './tool';
import { Reasoning, ReasoningTrigger, ReasoningContent } from './reasoning';
import { MessageResponse } from './message-response';
import { MessageActions } from './message-actions';
import { collectCitationsFromParts, SourceCitations } from './source-citations';
import Image from 'next/image';
import { cn } from '@/lib/utils';

type PurePreviewMessageProps = {
  chatId: string;
  message: ChatMessage;
  isLoading: boolean;
  isLastMessage: boolean;
  messages: ChatMessage[];
  messageIndex: number;
};

const PurePreviewMessage = ({
  chatId,
  message,
  isLoading,
  isLastMessage,
  messages,
  messageIndex,
}: PurePreviewMessageProps) => {
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

  const hasAnyContent = message.parts?.some(
    (part) =>
      (part.type === 'text' && part.text?.trim().length > 0) ||
      (part.type === 'reasoning' && part.text?.trim().length > 0) ||
      part.type.startsWith('tool-'),
  );
  const isThinking =
    isAssistant && isLastMessage && isLoading && !hasAnyContent;

  const mergedReasoning = message.parts?.reduce(
    (acc: { text: string; isStreaming: boolean; rendered: boolean }, part) => {
      if (part.type === 'reasoning' && part.text?.trim().length > 0) {
        return {
          text: acc.text ? `${acc.text}\n\n${part.text}` : part.text,
          isStreaming: 'state' in part ? part.state === 'streaming' : false,
          rendered: false,
        };
      }
      return acc;
    },
    { text: '', isStreaming: false, rendered: false },
  ) ?? { text: '', isStreaming: false, rendered: false };

  const thisHasText = message.parts?.some((p) => p.type === 'text');
  const laterMsgs = messages.slice(messageIndex + 1);
  const hasTextLater = laterMsgs.some(
    (m) => m.role === 'assistant' && m.parts?.some((p) => p.type === 'text'),
  );
  const hideToolUI = thisHasText || hasTextLater;

  const parts = message.parts?.map((part, j) => {
    if (part.type === 'reasoning') {
      if (!mergedReasoning.rendered && mergedReasoning.text) {
        mergedReasoning.rendered = true;
        return (
          <Reasoning
            defaultOpen={mergedReasoning.isStreaming}
            isStreaming={isLoading || mergedReasoning.isStreaming}
            key="reasoning"
          >
            <ReasoningTrigger />
            <ReasoningContent>{mergedReasoning.text}</ReasoningContent>
          </Reasoning>
        );
      }
      return null;
    }

    if (part.type === 'text') {
      return (
        <div key={j}>
          <MessageResponse>{part.text}</MessageResponse>
          {isLastMessage && isLoading && (
            <span className="inline-block w-1.5 h-[13px] ml-0.5 bg-foreground/60 animate-pulse align-middle rounded-sm" />
          )}
        </div>
      );
    }

    if (part.type.startsWith('tool-') && !hideToolUI) {
      const { toolCallId, state, input, output, errorText } = part as any;

      if (part.type === 'tool-searchFeedback') {
        return (
          <Tool
            key={toolCallId || j}
            defaultOpen={state === 'output-available'}
          >
            <ToolHeader type={part.type as any} state={state} />
            <ToolContent>
              {input && <ToolInput input={input} />}
              {output && <ToolOutput output={output} errorText={errorText} />}
            </ToolContent>
          </Tool>
        );
      }

      return null;
    }

    return null;
  });

  const citations = isAssistant
    ? collectCitationsFromParts(
        message.parts as Array<Record<string, unknown>> | undefined,
      )
    : [];

  const actions = (
    <MessageActions
      chatId={chatId}
      messageId={message.id}
      role={message.role}
      parts={
        message.parts as Array<{
          type: string;
          text?: string;
        }>
      }
    />
  );

  const content = isThinking ? (
    <div className="flex h-[calc(13px*1.65)] items-center">
      <Shimmer className="font-medium" duration={1}>
        Thinking...
      </Shimmer>
    </div>
  ) : (
    <>
      <div className="flex flex-col gap-2">{parts}</div>
      {citations.length > 0 && <SourceCitations citations={citations} />}
      {actions}
    </>
  );

  return (
    <div
      className={cn(
        'group/message w-full',
        isUser && 'animate-[fade-up_0.25s_cubic-bezier(0.22,1,0.36,1)]',
      )}
    >
      <div
        className={cn(
          isUser ? 'flex flex-col items-end gap-2' : 'flex items-start gap-3',
        )}
      >
        {isAssistant && (
          <div className="flex h-[calc(13px*1.65)] shrink-0 items-center">
            <div className="flex size-7 items-center justify-center rounded-lg bg-brand-50 ring-1 ring-brand-200 dark:bg-brand-950 dark:ring-brand-800">
              <Image
                src="/logos/logo.svg"
                alt="Scalo"
                width={16}
                height={16}
                className="size-4"
              />
            </div>
          </div>
        )}
        {isUser ? (
          content
        ) : (
          <div className="flex min-w-0 flex-1 flex-col gap-2 text-[13px] leading-[1.65] text-foreground/90">
            {content}
          </div>
        )}
      </div>
    </div>
  );
};

export const PreviewMessage = PurePreviewMessage;

export const ThinkingMessage = () => {
  return (
    <div className="group/message w-full">
      <div className="flex items-start gap-3">
        <div className="flex h-[calc(13px*1.65)] shrink-0 items-center">
          <div className="flex size-7 items-center justify-center rounded-lg bg-brand-50 ring-1 ring-brand-200 dark:bg-brand-950 dark:ring-brand-800">
            <Image
              src="/logos/logo.svg"
              alt="Scalo"
              width={16}
              height={16}
              className="size-4"
            />
          </div>
        </div>
        <div className="flex h-[calc(13px*1.65)] items-center text-[13px] leading-[1.65]">
          <Shimmer className="font-medium" duration={1}>
            Thinking...
          </Shimmer>
        </div>
      </div>
    </div>
  );
};
