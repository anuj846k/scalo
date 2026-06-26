'use client';

import type { ChatMessage } from '@/lib/types';
import { ArrowDown, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PreviewMessage, ThinkingMessage } from './message';
import { Skeleton } from '@/components/ui/skeleton';

type MessagesProps = {
  chatId: string;
  status: string;
  messages: ChatMessage[];
  containerRef: React.RefObject<HTMLDivElement>;
  endRef: React.RefObject<HTMLDivElement>;
  isAtBottom: boolean;
  scrollToBottom: (behavior?: ScrollBehavior) => void;
  hasMessages: boolean;
  isHistoryLoading: boolean;
  isNewChatPage: boolean;
};

export const Messages = ({
  chatId,
  status,
  messages,
  containerRef,
  endRef,
  isAtBottom,
  scrollToBottom,
  hasMessages,
  isHistoryLoading,
  isNewChatPage,
}: MessagesProps) => {
  const isLoading = status === 'streaming' || status === 'submitted';

  return (
    <div className="relative flex-1">
      {isNewChatPage && !hasMessages && !isLoading && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-muted/60 ring-1 ring-border/50">
              <Sparkles className="size-6 text-muted-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Ask about your feedback</h2>
              <p className="mt-1 text-[13px] text-muted-foreground/60">
                Ask questions about your uploaded feedback data.
              </p>
            </div>
          </div>
        </div>
      )}

      <div
        ref={containerRef}
        className={cn(
          'scrollbar-hover absolute inset-0 touch-pan-y overflow-y-auto',
          hasMessages ? 'bg-background' : 'bg-transparent',
        )}
      >
        <div className="mx-auto flex min-h-full min-w-0 max-w-3xl flex-col gap-5 px-2 py-6 md:gap-7 md:px-4">
          {messages.map((message, i) => (
            <PreviewMessage
              chatId={chatId}
              isLastMessage={i === messages.length - 1}
              isLoading={status === 'streaming' && messages.length - 1 === i}
              key={message.id}
              message={message}
              messages={messages}
              messageIndex={i}
            />
          ))}

          {status === 'submitted' && messages.at(-1)?.role !== 'assistant' && (
            <ThinkingMessage />
          )}

          <div className="min-h-[24px] min-w-[24px] shrink-0" ref={endRef} />
        </div>
      </div>

      <button
        aria-label="Scroll to bottom"
        className={cn(
          'absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center rounded-full border border-border/50 bg-card/90 px-3.5 shadow-sm backdrop-blur-lg transition-all duration-200 h-7 text-[10px]',
          isAtBottom
            ? 'pointer-events-none scale-90 opacity-0'
            : 'pointer-events-auto scale-100 opacity-100',
        )}
        onClick={() => scrollToBottom('smooth')}
        type="button"
      >
        <ArrowDown className="size-3 text-muted-foreground" />
      </button>
    </div>
  );
};
