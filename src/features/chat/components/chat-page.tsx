'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import {
  Send,
  Square,
  ArrowDown,
  AlertCircle,
  Sparkles,
  PanelRightIcon,
  PanelRightOpenIcon,
  PenSquareIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChatSidebar } from './chat-sidebar';
import { MessageResponse } from './message-response';
import { MessageActions } from './message-actions';
import { useScrollToBottom } from '@/hooks/use-scroll-to-bottom';
import useSWR from 'swr';
import Link from 'next/link';
import Image from 'next/image';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function ChatPage({ chatId }: { chatId?: string }) {
  const currentChatId = chatId || crypto.randomUUID();
  const isNewChat = !chatId;
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const { data: chatData } = useSWR(
    isNewChat ? null : `/api/messages?chatId=${chatId}`,
    fetcher,
    { revalidateOnFocus: false },
  );

  const initialMessages = isNewChat ? [] : (chatData?.messages ?? []);

  const {
    messages,
    setMessages,
    sendMessage,
    status,
    error,
    stop,
    regenerate,
  } = useChat({
    id: currentChatId,
    messages: initialMessages,
    generateId: () => crypto.randomUUID(),
    transport: new DefaultChatTransport({
      api: '/api/chat',
      prepareSendMessagesRequest: ({ id, messages }) => ({
        body: { id, messages },
      }),
    }),
  });

  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const {
    containerRef,
    endRef,
    isAtBottom,
    scrollToBottom,
    setStreaming,
    reset: resetScroll,
  } = useScrollToBottom();

  const isStreaming = status === 'streaming' || status === 'submitted';

  const prevChatIdRef = useRef(chatId);
  useEffect(() => {
    if (prevChatIdRef.current !== chatId) {
      prevChatIdRef.current = chatId;
      resetScroll();
    }
  }, [chatId, resetScroll]);

  useEffect(() => {
    if (chatData?.messages && !isNewChat) {
      setMessages(chatData.messages);
    }
  }, [chatData?.messages, isNewChat, setMessages]);

  useEffect(() => {
    setStreaming(isStreaming);
  }, [isStreaming, setStreaming]);

  useEffect(() => {
    if (isNewChat) {
      setMessages([]);
    }
  }, [chatId, isNewChat, setMessages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSend = useCallback(() => {
    if (!input.trim() || status !== 'ready') return;
    sendMessage({ text: input });
    setInput('');
  }, [input, status, sendMessage]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  const hasMessages = messages.length > 0;

  return (
    <div className="h-full flex w-full flex-row overflow-hidden">
      <div
        className={cn(
          'flex min-w-0 flex-col bg-sidebar transition-[width] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]',
          sidebarCollapsed ? 'flex-1' : 'flex-1',
        )}
      >
        <header className="sticky top-0 flex h-14 items-center gap-2 bg-sidebar px-3">
          <div className="flex-1" />
          <Button
            size="icon"
            variant="ghost"
            className={cn(
              'h-8 w-8 shrink-0 cursor-pointer',
              !sidebarCollapsed && 'hidden',
            )}
            onClick={() => setSidebarCollapsed(false)}
          >
            <PanelRightIcon className="size-4 text-sidebar-foreground/60" />
          </Button>
        </header>

        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-background md:rounded-tl-[12px] md:border-t md:border-l md:border-border/40">
          <div className="relative flex-1">
            {!hasMessages && !isStreaming && (
              <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
                <div className="text-center space-y-3">
                  <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-muted/60 ring-1 ring-border/50">
                    <Sparkles className="size-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">
                      Ask about your feedback
                    </h2>
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
                'absolute inset-0 touch-pan-y overflow-y-auto scrollbar-hover',
                hasMessages ? 'bg-background' : 'bg-transparent',
              )}
            >
              <div className="mx-auto flex min-h-full min-w-0 max-w-3xl flex-col gap-5 px-2 py-6 md:gap-7 md:px-4">
                {messages.map((message, i) => {
                  const isUser = message.role === 'user';
                  const showCursor =
                    !isUser &&
                    i === messages.length - 1 &&
                    status === 'streaming';

                  return (
                    <div
                      key={message.id}
                      className={cn(
                        'w-full group/message',
                        isUser &&
                          'animate-[fade-up_0.25s_cubic-bezier(0.22,1,0.36,1)]',
                      )}
                    >
                      {isUser ? (
                        <div className="flex flex-col items-end gap-2">
                          <div className="w-fit max-w-[min(80%,56ch)] overflow-hidden break-words rounded-2xl rounded-br-lg border border-brand-500/20 bg-gradient-to-br from-brand-50 to-brand-100 px-3.5 py-2 text-[13px] leading-[1.65] shadow-sm dark:from-brand-950 dark:to-brand-900 dark:border-brand-700/30">
                            {message.parts.map((part, j) =>
                              part.type === 'text' ? (
                                <span key={j}>{part.text}</span>
                              ) : null,
                            )}
                          </div>
                          <MessageActions
                            chatId={currentChatId}
                            messageId={message.id}
                            role={message.role}
                            parts={
                              message.parts as Array<{
                                type: string;
                                text?: string;
                              }>
                            }
                          />
                        </div>
                      ) : (
                        <div className="flex items-start gap-3">
                          <div className="flex h-[calc(13px*1.65)] shrink-0 items-center">
                            <div className="flex size-7 items-center justify-center rounded-lg bg-brand-50 ring-1 ring-brand-200 dark:bg-brand-950 dark:ring-brand-800">
                              <Image
                                src="/logos/logo.svg"
                                alt="Murmur"
                                width={16}
                                height={16}
                                className="size-4"
                              />
                            </div>
                          </div>
                          <div className="flex min-w-0 flex-1 flex-col gap-2">
                            <div className="text-[13px] leading-[1.65] text-foreground/90">
                              {message.parts.map((part, j) =>
                                part.type === 'text' ? (
                                  <span key={j}>
                                    <MessageResponse>
                                      {part.text}
                                    </MessageResponse>
                                    {showCursor && (
                                      <span className="inline-block w-1.5 h-[13px] ml-0.5 bg-foreground/60 animate-pulse align-middle rounded-sm" />
                                    )}
                                  </span>
                                ) : null,
                              )}
                            </div>
                            <MessageActions
                              chatId={currentChatId}
                              messageId={message.id}
                              role={message.role}
                              parts={
                                message.parts as Array<{
                                  type: string;
                                  text?: string;
                                }>
                              }
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {status === 'submitted' &&
                  messages.at(-1)?.role !== 'assistant' &&
                  initialMessages.length > 0 && (
                    <div className="flex items-start gap-3">
                      <div className="flex h-[calc(13px*1.65)] shrink-0 items-center">
                        <div className="flex size-7 items-center justify-center rounded-lg bg-brand-50 ring-1 ring-brand-200 dark:bg-brand-950 dark:ring-brand-800">
                          <Image
                            src="/logos/logo.svg"
                            alt="Murmur"
                            width={16}
                            height={16}
                            className="size-4"
                          />
                        </div>
                      </div>
                      <div className="flex h-[calc(13px*1.65)] items-center text-[13px] leading-[1.65]">
                        <span className="font-medium text-muted-foreground animate-pulse">
                          Thinking...
                        </span>
                      </div>
                    </div>
                  )}

                <div
                  className="min-h-[24px] min-w-[24px] shrink-0"
                  ref={endRef}
                />
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

          {error && (
            <div className="shrink-0 flex items-center gap-2 mx-4 mb-1 px-3 py-1.5 rounded-lg bg-destructive/10 border border-destructive/20 text-xs text-destructive">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span className="flex-1">Something went wrong.</span>
              <button
                onClick={() => regenerate()}
                className="underline shrink-0 font-medium cursor-pointer"
              >
                Retry
              </button>
            </div>
          )}

          <div className="sticky bottom-0 z-1 mx-auto flex w-full max-w-3xl gap-2 border-t-0 bg-background px-2 pb-3 md:px-4 md:pb-4">
            <div className="relative flex w-full flex-col">
              <div className="rounded-2xl border border-border/30 bg-card/70 shadow-sm transition-shadow duration-300 focus-within:border-brand-500/40 focus-within:shadow-md">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isStreaming}
                  rows={1}
                  placeholder="Ask a question about your feedback..."
                  className="w-full min-h-[2.5rem] resize-none bg-transparent px-4 pt-3 pb-1.5 text-[13px] leading-relaxed placeholder:text-muted-foreground/40 focus:outline-none disabled:opacity-50"
                />
                <div className="flex items-center justify-between px-3 pb-3">
                  <div className="flex items-center gap-1">
                    <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                      <Sparkles className="size-3" />
                      Gemini 2.5 Flash
                    </span>
                  </div>
                  {isStreaming ? (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 rounded-lg cursor-pointer"
                      onClick={() => stop()}
                    >
                      <Square className="h-3.5 w-3.5" />
                    </Button>
                  ) : (
                    <Button
                      size="icon"
                      className={cn(
                        'h-7 w-7 rounded-lg cursor-pointer transition-colors',
                        input.trim()
                          ? 'bg-foreground text-background hover:bg-foreground/90'
                          : 'bg-muted text-muted-foreground/25',
                      )}
                      onClick={handleSend}
                      disabled={!input.trim()}
                    >
                      <Send className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={cn(
          'shrink-0 border-l border-sidebar-border bg-sidebar transition-[width] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] overflow-hidden',
          sidebarCollapsed ? 'w-0 border-l-0' : 'w-60',
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-3 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-sidebar-foreground/70">
              History
            </p>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 cursor-pointer"
              onClick={() => setSidebarCollapsed(true)}
            >
              <PanelRightOpenIcon className="size-3.5 text-sidebar-foreground/60" />
            </Button>
          </div>

          <div className="px-2 pb-2 space-y-1">
            <Link
              href="/dashboard/chat"
              className="flex h-8 items-center gap-2 rounded-lg border border-sidebar-border px-2 text-[13px] text-sidebar-foreground/70 transition-colors duration-150 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
            >
              <PenSquareIcon className="size-4" />
              <span className="font-medium">New chat</span>
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto">
            <ChatSidebar chatId={currentChatId} />
          </div>
        </div>
      </div>
    </div>
  );
}
