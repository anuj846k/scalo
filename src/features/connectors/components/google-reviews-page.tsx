'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star, ArrowLeft, Loader2, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function GoogleReviewsPage() {
  const [placeId, setPlaceId] = useState('');
  const [fetching, setFetching] = useState(false);
  const router = useRouter();

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
      setTimeout(() => {
        router.push('/dashboard/connectors');
      }, 1500);
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setFetching(false);
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
            Pull reviews from a Google Business listing.
          </p>
        </div>
      </div>

      <Card className="p-6 space-y-4">
        <div className="flex items-start gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted/60 ring-1 ring-border/50">
            <Star className="size-5 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-sm font-medium">Enter your Google Place ID</h3>
            <p className="mt-1 text-[12px] text-muted-foreground/60">
              Find it in your Google Maps listing URL. Look for the{' '}
              <code className="rounded bg-muted px-1 text-[11px]">
                placeid:
              </code>{' '}
              parameter or the string after{' '}
              <code className="rounded bg-muted px-1 text-[11px]">
                /maps/place/
              </code>
              .
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
            {fetching ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              'Fetch reviews'
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}
