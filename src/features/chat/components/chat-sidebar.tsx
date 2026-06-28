'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { MoreHorizontal, Trash2, Loader2, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { authClient } from '@/lib/auth-client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { useChatHistory } from '@/features/chat/hooks/use-chat-history';
import { isToday, isYesterday, subWeeks, subMonths } from 'date-fns';

interface Chat {
  id: string;
  title: string;
  createdAt: string;
}

function groupChats(chats: Chat[]) {
  const now = new Date();
  const oneWeekAgo = subWeeks(now, 1);
  const oneMonthAgo = subMonths(now, 1);

  const groups: { label: string; chats: Chat[] }[] = [
    { label: 'Today', chats: [] },
    { label: 'Yesterday', chats: [] },
    { label: 'Last 7 days', chats: [] },
    { label: 'Last 30 days', chats: [] },
    { label: 'Older', chats: [] },
  ];

  for (const chat of chats) {
    const date = new Date(chat.createdAt);
    if (isToday(date)) groups[0].chats.push(chat);
    else if (isYesterday(date)) groups[1].chats.push(chat);
    else if (date > oneWeekAgo) groups[2].chats.push(chat);
    else if (date > oneMonthAgo) groups[3].chats.push(chat);
    else groups[4].chats.push(chat);
  }

  return groups.filter((g) => g.chats.length > 0);
}

function SidebarSkeleton() {
  return (
    <div className="flex flex-col gap-0.5 px-1">
      {[44, 32, 28, 64, 52].map((w) => (
        <div key={w} className="flex h-8 items-center gap-2 rounded-lg px-2">
          <div
            className="h-3 flex-1 animate-pulse rounded-md bg-sidebar-foreground/[0.06]"
            style={{ maxWidth: `${w}%` }}
          />
        </div>
      ))}
    </div>
  );
}

function ChatSidebarItem({
  chat,
  isActive,
  onDelete,
}: {
  chat: Chat;
  isActive: boolean;
  onDelete: (id: string) => void;
}) {
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <Link
        href={`/dashboard/chat/${chat.id}`}
        className={cn(
          'group flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-[13px] transition-colors hover:bg-sidebar-accent/50',
          isActive && 'bg-sidebar-accent',
        )}
      >
        <span className="truncate flex-1 font-medium">
          {chat.title || 'New chat'}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              onClick={(e) => e.preventDefault()}
              className="opacity-0 group-hover:opacity-100 shrink-0 h-5 w-5 inline-flex items-center justify-center rounded-md hover:bg-sidebar-accent-foreground/10 transition-opacity cursor-pointer"
            >
              <MoreHorizontal className="h-3 w-3 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuItem
              className="text-xs text-destructive cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                setDeleteOpen(true);
              }}
            >
              <Trash2 className="h-3.5 w-3.5 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Link>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete chat?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this conversation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onDelete(chat.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export function ChatSidebar({ chatId }: { chatId?: string }) {
  const router = useRouter();
  const { data: sessionData } = authClient.useSession();
  const organizationId =
    sessionData?.session?.activeOrganizationId ?? undefined;
  const { chats, hasMore, loadMore, mutate, isLoading } =
    useChatHistory(organizationId);
  const [deleteAllOpen, setDeleteAllOpen] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  const handleDelete = useCallback(
    async (id: string) => {
      await fetch(`/api/chat?id=${id}`, { method: 'DELETE' });
      mutate();
      toast.success('Chat deleted');
      if (chatId === id) router.push('/dashboard/chat');
    },
    [mutate, chatId, router],
  );

  const handleDeleteAll = async () => {
    await fetch('/api/history', { method: 'DELETE' });
    mutate();
    toast.success('All chats deleted');
    router.push('/dashboard/chat');
  };

  const grouped = useMemo(() => groupChats(chats), [chats]);

  if (isLoading) {
    return (
      <div className="p-2">
        <SidebarSkeleton />
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 px-4 py-8">
        <MessageSquare className="h-8 w-8 text-muted-foreground/30" />
        <p className="text-xs text-sidebar-foreground/60 text-center">
          Your conversations will appear here once you start chatting!
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4 p-2">
        <button
          onClick={() => setDeleteAllOpen(true)}
          className="flex h-8 w-full items-center gap-2 rounded-lg px-2 text-[13px] text-sidebar-foreground/40 transition-colors duration-150 hover:bg-destructive/10 hover:text-destructive cursor-pointer"
        >
          <Trash2 className="size-4" />
          <span>Delete all</span>
        </button>

        {grouped.map((group) => (
          <div key={group.label}>
            <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-sidebar-foreground/70">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.chats.map((chat) => (
                <ChatSidebarItem
                  key={chat.id}
                  chat={chat}
                  isActive={chat.id === chatId}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        ))}

        {hasMore && (
          <div ref={loadMoreRef} className="flex justify-center py-2">
            <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>

      <AlertDialog open={deleteAllOpen} onOpenChange={setDeleteAllOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete all chats?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all your conversations.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAll}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete all
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
