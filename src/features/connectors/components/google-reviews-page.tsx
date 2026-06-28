'use client';

import { useState } from 'react';
import useSWR from 'swr';
import {
  MapPin,
  ArrowLeft,
  Loader2,
  ExternalLink,
  Trash2,
  Clock,
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
  locationCode: number | null;
  locationCoordinate: string | null;
  lastSyncedAt: string | null;
  status: string;
  createdAt: string;
}

function getMapEmbedUrl(placeId: string): string | null {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!key) return null;
  return `https://www.google.com/maps/embed/v1/place?key=${key}&q=place_id:${placeId}&zoom=15`;
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
  const [pendingDisconnect, setPendingDisconnect] = useState<string | null>(
    null,
  );
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
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
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
          <div className="grid gap-4 sm:grid-cols-2">
            {configs.map((config) => {
              const mapUrl = getMapEmbedUrl(config.placeId);
              return (
                <Card key={config.id} className="flex flex-col overflow-hidden">
                  {mapUrl && (
                    <iframe
                      src={mapUrl}
                      title={`Map of ${config.title ?? 'location'}`}
                      className="h-56 w-full border-0"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  )}
                  <div className="flex flex-col flex-1 p-4">
                    <div className="flex items-start gap-3 min-w-0">
                      <span
                        className={cn(
                          'mt-1 block size-2 shrink-0 rounded-full',
                          config.status === 'active'
                            ? 'bg-emerald-500'
                            : 'bg-red-500',
                        )}
                      />
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <h3 className="truncate text-sm font-medium">
                          {config.title ?? config.placeId}
                        </h3>
                        {config.subTitle && (
                          <p className="truncate text-[12px] text-muted-foreground/60">
                            {config.subTitle}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-4">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground/60">
                        <Clock className="size-3" />
                        <span>{relativeTime(config.lastSyncedAt)}</span>
                      </div>
                      <button
                        onClick={() => setPendingDisconnect(config.id)}
                        disabled={deleting === config.id}
                        className="inline-flex items-center gap-1 text-xs text-muted-foreground/50 hover:text-destructive transition-colors"
                      >
                        <Trash2 className="size-3" />
                        {deleting === config.id ? '...' : 'Disconnect'}
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
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
