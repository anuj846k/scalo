'use client';

import { useState } from 'react';
import useSWR from 'swr';
import {
  ArrowLeft,
  Loader2,
  MessagesSquare,
  Trash2,
  Clock,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
import { cn } from '@/lib/utils';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface ConnectorConfig {
  id: string;
  connectorType: string;
  placeId: string;
  title: string | null;
  subTitle: string | null;
  lastSyncedAt: string | null;
  status: string;
  createdAt: string;
}

function relativeTime(dateStr: string | null): string {
  if (!dateStr) return 'Never synced';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 30) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

function statusLabel(status: string): string {
  if (status === 'pending') return 'Importing…';
  if (status === 'failed') return 'Failed';
  return 'Active';
}

export default function CommunityPage() {
  const [input, setInput] = useState('');
  const [fetching, setFetching] = useState(false);
  const [syncing, setSyncing] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [pendingDisconnect, setPendingDisconnect] = useState<string | null>(
    null,
  );
  const { data, mutate } = useSWR('/api/connectors', fetcher, {
    refreshInterval: (latest) => {
      const configs = (latest?.configs ?? []) as ConnectorConfig[];
      return configs.some(
        (c) => c.connectorType === 'community' && c.status === 'pending',
      )
        ? 4000
        : 0;
    },
  });

  const configs: ConnectorConfig[] = (data?.configs ?? []).filter(
    (c: ConnectorConfig) => c.connectorType === 'community',
  );

  const handleConnect = async () => {
    if (!input.trim()) return;
    setFetching(true);

    try {
      const res = await fetch('/api/connectors/community/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: input.trim() }),
      });

      const payload = await res.json();

      if (!res.ok) {
        if (payload.code === 'USE_GOOGLE_CONNECTOR') {
          toast.error(payload.error, {
            action: {
              label: 'Open Google',
              onClick: () => {
                window.location.href = '/dashboard/connectors/google-reviews';
              },
            },
          });
          return;
        }
        if (payload.code === 'USE_TRUSTPILOT_CONNECTOR') {
          toast.error(payload.error, {
            action: {
              label: 'Open Trustpilot',
              onClick: () => {
                window.location.href = '/dashboard/connectors/trustpilot';
              },
            },
          });
          return;
        }
        toast.error(payload.error || 'Something went wrong.');
        return;
      }

      toast.success(
        payload.reimported
          ? 'Re-importing this thread.'
          : 'Discussion is being imported.',
      );
      setInput('');
      mutate();
    } catch {
      toast.error('Something went wrong.');
    } finally {
      setFetching(false);
    }
  };

  const handleResync = async (id: string) => {
    setSyncing(id);
    try {
      const res = await fetch(`/api/connectors/community/${id}/sync`, {
        method: 'POST',
      });
      const payload = await res.json();
      if (!res.ok) {
        toast.error(payload.error || 'Failed to re-sync');
        return;
      }
      toast.success('Re-sync started.');
      mutate();
    } catch {
      toast.error('Something went wrong');
    } finally {
      setSyncing(null);
    }
  };

  const handleDisconnect = async (id: string) => {
    setDeleting(id);
    try {
      const res = await fetch(`/api/connectors/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        toast.error('Failed to disconnect');
        return;
      }
      toast.success('Disconnected');
      mutate();
    } catch {
      toast.error('Something went wrong');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/connectors"
          className="flex size-8 items-center justify-center rounded-lg hover:bg-muted/50"
        >
          <ArrowLeft className="size-4 text-muted-foreground" />
        </Link>
        <div>
          <h1 className="text-lg font-semibold">Community</h1>
          <p className="mt-0.5 text-[13px] text-muted-foreground/70">
            Import comments from Reddit, Hacker News, Product Hunt, and other
            public threads.
          </p>
        </div>
      </div>

      {configs.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground">
            Imported threads ({configs.length})
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {configs.map((config) => (
              <Card key={config.id} className="flex flex-col overflow-hidden">
                <div className="flex flex-col flex-1 p-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <span
                      className={cn(
                        'mt-1 block size-2 shrink-0 rounded-full',
                        config.status === 'active' && 'bg-emerald-500',
                        config.status === 'pending' && 'bg-amber-500',
                        config.status === 'failed' && 'bg-red-500',
                      )}
                    />
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <h3 className="truncate text-sm font-medium">
                        {config.title ?? config.placeId}
                      </h3>
                      <p className="truncate text-[12px] text-muted-foreground/60">
                        {config.subTitle ?? statusLabel(config.status)}
                      </p>
                      <a
                        href={config.placeId}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex max-w-full items-center gap-1 truncate text-[11px] text-brand-500 hover:underline"
                      >
                        <ExternalLink className="size-3 shrink-0" />
                        <span className="truncate">{config.placeId}</span>
                      </a>
                    </div>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-4">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground/60">
                      <Clock className="size-3" />
                      <span>
                        {config.status === 'pending'
                          ? 'Importing…'
                          : relativeTime(config.lastSyncedAt)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleResync(config.id)}
                        disabled={
                          syncing === config.id || config.status === 'pending'
                        }
                        className="inline-flex items-center gap-1 text-xs text-muted-foreground/50 hover:text-foreground transition-colors disabled:opacity-40"
                      >
                        <RefreshCw
                          className={cn(
                            'size-3',
                            syncing === config.id && 'animate-spin',
                          )}
                        />
                        Re-sync
                      </button>
                      <button
                        onClick={() => setPendingDisconnect(config.id)}
                        disabled={deleting === config.id}
                        className="inline-flex items-center gap-1 text-xs text-muted-foreground/50 hover:text-destructive transition-colors"
                      >
                        <Trash2 className="size-3" />
                        {deleting === config.id ? '...' : 'Remove'}
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      <Card className="p-6 space-y-4">
        <div className="flex items-start gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted/60 ring-1 ring-border/50">
            <MessagesSquare className="size-5 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-sm font-medium">
              {configs.length > 0
                ? 'Import another discussion'
                : 'Import a discussion thread'}
            </h3>
            <p className="mt-1 text-[12px] text-muted-foreground/60">
              Paste a Reddit, Hacker News, Product Hunt, or other public
              discussion URL. Google Reviews and Trustpilot links should use
              their dedicated connectors.
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <input
            type="url"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleConnect();
            }}
            placeholder="e.g. https://www.reddit.com/r/.../comments/..."
            className="flex-1 rounded-xl border border-border/40 bg-muted/30 px-3 py-2 text-[13px] placeholder:text-muted-foreground/30 focus:outline-none focus:border-brand-500/40"
          />
          <Button
            onClick={handleConnect}
            disabled={!input.trim() || fetching}
            className="rounded-xl"
          >
            {fetching ? <Loader2 className="size-4 animate-spin" /> : 'Import'}
          </Button>
        </div>
      </Card>

      <AlertDialog
        open={pendingDisconnect !== null}
        onOpenChange={(open) => !open && setPendingDisconnect(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this thread import?</AlertDialogTitle>
            <AlertDialogDescription>
              This stops re-syncing the thread. Existing imported comments stay
              in your workspace.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (pendingDisconnect) {
                  handleDisconnect(pendingDisconnect);
                  setPendingDisconnect(null);
                }
              }}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
