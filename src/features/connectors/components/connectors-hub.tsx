'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import useSWR from 'swr';
import {
  ArrowRight,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface ConnectorConfig {
  id: string;
  connectorType: string;
  placeId: string;
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

export default function ConnectorsHub() {
  const { data, mutate } = useSWR('/api/connectors', fetcher);
  const [deleting, setDeleting] = useState<string | null>(null);

  const liveConfigs: ConnectorConfig[] = data?.configs ?? [];
  const googleConfig = liveConfigs.find(
    (c) => c.connectorType === 'google_reviews',
  );

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
    <div className="mx-auto max-w-screen-xl px-4 py-8 md:px-8">
      <div className="max-w-md">
        <h1 className="text-xl font-extrabold sm:text-2xl">Connectors</h1>
        <p className="mt-2 text-muted-foreground">
          Choose a source to import feedback from.
        </p>
      </div>

      <ul className="mt-12 grid gap-6 sm:grid-cols-2">
        <li className="rounded-xl border border-border/40 bg-card transition-shadow hover:shadow-sm">
          <div className="flex items-start justify-between p-5">
            <div className="space-y-3">
              <Image
                src="/logos/csv.svg"
                alt="CSV Upload"
                width={40}
                height={40}
                className="size-10 rounded-xl"
              />
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">CSV Upload</h3>
              </div>
              <p className="text-sm text-muted-foreground/70">
                Upload feedback data from a CSV file. Map columns and ingest
                reviews in bulk.
              </p>
            </div>
          </div>
          <div className="border-t border-border/40 px-5 py-3 text-right">
            <Link
              href="/dashboard/connectors/upload"
              className="inline-flex items-center gap-1 text-sm font-medium text-brand-500 hover:text-brand-600 transition-colors"
            >
              Configure
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </li>

        <li
          className={cn(
            'rounded-xl border border-border/40 bg-card transition-shadow hover:shadow-sm',
          )}
        >
          <div className="flex items-start justify-between p-5">
            <div className="space-y-3">
              <Image
                src="/logos/google.svg"
                alt="Google Reviews"
                width={40}
                height={40}
                className="size-10 rounded-xl"
              />
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">Google Reviews</h3>
                {googleConfig && (
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium',
                      googleConfig.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                        : 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400',
                    )}
                  >
                    {googleConfig.status === 'active' ? (
                      <CheckCircle2 className="size-3" />
                    ) : (
                      <AlertCircle className="size-3" />
                    )}
                    {googleConfig.status === 'active' ? 'Active' : 'Error'}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground/70">
                Pull reviews from a Google Business listing via Place ID.
              </p>
            </div>
          </div>
          <div className="border-t border-border/40 px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground/60">
              <Clock className="size-3" />
              <span>{relativeTime(googleConfig?.lastSyncedAt ?? null)}</span>
            </div>
            <div className="flex items-center gap-2">
              {googleConfig && (
                <button
                  onClick={() => handleDisconnect(googleConfig.id)}
                  disabled={deleting === googleConfig.id}
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground/50 hover:text-destructive transition-colors"
                >
                  <Trash2 className="size-3" />
                  {deleting === googleConfig.id ? '...' : 'Disconnect'}
                </button>
              )}
              <Link
                href="/dashboard/connectors/google-reviews"
                className="inline-flex items-center gap-1 text-sm font-medium text-brand-500 hover:text-brand-600 transition-colors"
              >
                Configure
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </li>

        <li className="rounded-xl border border-border/40 bg-card opacity-40 pointer-events-none">
          <div className="flex items-start justify-between p-5">
            <div className="space-y-3">
              <Image
                src="/logos/instagram.svg"
                alt="Instagram"
                width={40}
                height={40}
                className="size-10 rounded-xl"
              />
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">Instagram</h3>
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                  Soon
                </span>
              </div>
              <p className="text-sm text-muted-foreground/70">
                Import comments from Instagram posts via HikerAPI.
              </p>
            </div>
          </div>
          <div className="border-t border-border/40 px-5 py-3 text-right">
            <span className="text-sm text-muted-foreground/40">
              Coming soon
            </span>
          </div>
        </li>

        <li className="rounded-xl border border-border/40 bg-card opacity-40 pointer-events-none">
          <div className="flex items-start justify-between p-5">
            <div className="space-y-3">
              <Image
                src="/logos/zendesk.svg"
                alt="Zendesk"
                width={40}
                height={40}
                className="size-10 rounded-xl"
              />
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">Zendesk</h3>
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                  Soon
                </span>
              </div>
              <p className="text-sm text-muted-foreground/70">
                Pull support tickets from your Zendesk workspace.
              </p>
            </div>
          </div>
          <div className="border-t border-border/40 px-5 py-3 text-right">
            <span className="text-sm text-muted-foreground/40">
              Coming soon
            </span>
          </div>
        </li>
      </ul>
    </div>
  );
}
