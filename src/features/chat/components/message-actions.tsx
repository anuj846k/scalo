'use client';

import { useCallback } from 'react';
import { useCopyToClipboard } from 'usehooks-ts';
import { toast } from 'sonner';
import useSWR, { useSWRConfig } from 'swr';
import { Copy, ThumbsUp, ThumbsDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Vote {
  chatId: string;
  messageId: string;
  isUpvoted: boolean;
}

function VoteButtons({
  chatId,
  messageId,
}: {
  chatId: string;
  messageId: string;
}) {
  const { mutate } = useSWRConfig();
  const { data: votes } = useSWR<Vote[]>(
    `/api/vote?chatId=${chatId}`,
    (url: string) => fetch(url).then((r) => r.json()),
    { revalidateOnFocus: false },
  );

  const currentVote = votes?.find((v) => v.messageId === messageId);

  const handleVote = useCallback(
    async (type: 'up' | 'down') => {
      mutate<Vote[]>(
        `/api/vote?chatId=${chatId}`,
        (current) => {
          const filtered = (current || []).filter(
            (v) => v.messageId !== messageId,
          );
          return [...filtered, { chatId, messageId, isUpvoted: type === 'up' }];
        },
        { revalidate: false },
      );

      const label = type === 'up' ? 'Upvoted' : 'Downvoted';
      const voteFetch = fetch('/api/vote', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId, messageId, type }),
      });

      toast.promise(voteFetch, {
        loading: `${type === 'up' ? 'Upvoting' : 'Downvoting'}...`,
        success: `${label}!`,
        error: `Failed to ${type === 'up' ? 'upvote' : 'downvote'}.`,
      });
    },
    [chatId, messageId, mutate],
  );

  return (
    <>
      <button
        onClick={() => handleVote('up')}
        disabled={currentVote?.isUpvoted === true}
        className={cn(
          'flex h-7 w-7 items-center justify-center rounded-md transition-colors cursor-pointer',
          currentVote?.isUpvoted
            ? 'text-green-500'
            : 'text-muted-foreground/50 hover:text-foreground',
        )}
        title="Upvote"
      >
        <ThumbsUp className="h-3.5 w-3.5" />
      </button>
      <button
        onClick={() => handleVote('down')}
        disabled={currentVote?.isUpvoted === false}
        className={cn(
          'flex h-7 w-7 items-center justify-center rounded-md transition-colors cursor-pointer',
          currentVote?.isUpvoted === false
            ? 'text-red-500'
            : 'text-muted-foreground/50 hover:text-foreground',
        )}
        title="Downvote"
      >
        <ThumbsDown className="h-3.5 w-3.5" />
      </button>
    </>
  );
}

export function MessageActions({
  chatId,
  messageId,
  role,
  parts,
}: {
  chatId: string;
  messageId: string;
  role: string;
  parts: Array<{ type: string; text?: string }>;
}) {
  const [, copyToClipboard] = useCopyToClipboard();

  const handleCopy = useCallback(async () => {
    const text = parts
      .filter((p) => p.type === 'text')
      .map((p) => p.text || '')
      .join('\n')
      .trim();

    if (!text) {
      toast.error("There's no text to copy!");
      return;
    }

    await copyToClipboard(text);
    toast.success('Copied to clipboard!');
  }, [parts, copyToClipboard]);

  return (
    <div className="flex items-center gap-0.5 opacity-0 transition-opacity duration-150 group-hover/message:opacity-100">
      <button
        onClick={handleCopy}
        className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground/50 hover:text-foreground transition-colors cursor-pointer"
        title="Copy"
      >
        <Copy className="h-3.5 w-3.5" />
      </button>

      {role === 'assistant' && (
        <VoteButtons chatId={chatId} messageId={messageId} />
      )}
    </div>
  );
}
