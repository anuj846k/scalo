import { useCallback } from 'react';
import useSWRInfinite from 'swr/infinite';

interface Chat {
  id: string;
  title: string;
  userId: string;
  organizationId: string;
  createdAt: string;
}

export function getChatHistoryPaginationKey(
  pageIndex: number,
  previousPageData: { chats: Chat[]; hasMore: boolean } | null,
) {
  if (previousPageData && !previousPageData.hasMore) return null;
  if (pageIndex === 0) return '/api/history?limit=20';

  const lastChat = previousPageData?.chats?.[previousPageData.chats.length - 1];
  if (!lastChat) return null;
  return `/api/history?limit=20&before=${lastChat.createdAt}`;
}

async function fetcher(url: string) {
  return fetch(url).then((r) => r.json());
}

export function useChatHistory() {
  const { data, setSize, mutate, isLoading, error, isValidating } =
    useSWRInfinite(getChatHistoryPaginationKey, fetcher, {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateFirstPage: false,
    });

  const chats: Chat[] = data ? data.flatMap((page) => page.chats) : [];
  const hasMore = data ? (data[data.length - 1]?.hasMore ?? false) : false;
  const loadMore = useCallback(() => {
    if (!isValidating) {
      setSize((s) => s + 1);
    }
  }, [setSize, isValidating]);

  return { chats, hasMore, loadMore, mutate, isLoading, error };
}
