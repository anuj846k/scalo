'use client';

import { useState } from 'react';
import useSWR from 'swr';
import {
  MapPin,
  ArrowLeft,
  Loader2,
  ExternalLink,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface ConnectorConfig {
  id: string;
  connectorType: string;
  placeId: string;
  title: string | null;
  subTitle: string | null;
  locationCode: number | null;
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

export default function GoogleReviewsPage() {
  const [placeId, setPlaceId] = useState('');
  const [fetching, setFetching] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const { data, mutate } = useSWR('/api/connectors', fetcher);

  const configs: ConnectorConfig[] = (data?.configs ?? []).filter(
    (c: ConnectorConfig) => c.connectorType === 'google_reviews',
  );

  const handleFetch = async () => {
    if (!placeId.trim()) return;
    setFetching(true);

    try {
      const res = await fetch('/api/connectors/google-reviews/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ placeIdOrUrl: placeId.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Something went wrong. Please try again.');
        return;
      }

      toast.success('Reviews are being synced. This may take a moment.');
      setPlaceId('');
      mutate();
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setFetching(false);
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
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-8">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/connectors"
          className="flex size-8 items-center justify-center rounded-lg hover:bg-muted/50"
        >
          <ArrowLeft className="size-4 text-muted-foreground" />
        </Link>
        <div>
          <h1 className="text-lg font-semibold">Google Reviews</h1>
          <p className="mt-0.5 text-[13px] text-muted-foreground/70">
            Manage connected Google Business locations.
          </p>
        </div>
      </div>

      {/* Existing connected locations */}
      {configs.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground">
            Connected locations ({configs.length})
          </h2>
          {configs.map((config) => (
            <Card key={config.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1 min-w-0">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium',
                          config.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                            : 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400',
                        )}
                      >
                        {config.status === 'active' ? (
                          <CheckCircle2 className="size-3" />
                        ) : (
                          <AlertCircle className="size-3" />
                        )}
                        {config.status === 'active' ? 'Active' : 'Error'}
                      </span>
                      <span className="truncate text-sm font-medium">
                        {config.title ?? config.placeId}
                      </span>
                    </div>
                    {config.subTitle && (
                      <p className="text-[12px] text-muted-foreground/60 truncate">
                        {config.subTitle}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground/60">
                    <Clock className="size-3" />
                    <span>Last synced {relativeTime(config.lastSyncedAt)}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDisconnect(config.id)}
                  disabled={deleting === config.id}
                  className="shrink-0 inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-muted-foreground/50 hover:text-destructive hover:bg-destructive/5 transition-colors"
                >
                  <Trash2 className="size-3" />
                  {deleting === config.id ? '...' : 'Disconnect'}
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Connect another location */}
      <Card className="p-6 space-y-4">
        <div className="flex items-start gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted/60 ring-1 ring-border/50">
            <MapPin className="size-5 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-sm font-medium">
              {configs.length > 0
                ? 'Connect another location'
                : 'Connect a Google Business'}
            </h3>
            <p className="mt-1 text-[12px] text-muted-foreground/60">
              Paste a Google Maps URL or Place ID to start syncing reviews.
            </p>
            <a
              href="https://developers.google.com/maps/documentation/places/web-service/place-id"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center gap-1 text-[11px] text-brand-500 hover:underline"
            >
              How to find my Place ID
              <ExternalLink className="size-3" />
            </a>
          </div>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={placeId}
            onChange={(e) => setPlaceId(e.target.value)}
            placeholder="Paste a Google Maps URL or Place ID"
            className="flex-1 rounded-xl border border-border/40 bg-muted/30 px-3 py-2 text-[13px] placeholder:text-muted-foreground/30 focus:outline-none focus:border-brand-500/40"
          />
          <Button
            onClick={handleFetch}
            disabled={!placeId.trim() || fetching}
            className="rounded-xl"
          >
            {fetching ? <Loader2 className="size-4 animate-spin" /> : 'Connect'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
