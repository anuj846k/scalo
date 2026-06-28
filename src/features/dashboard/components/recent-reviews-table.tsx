'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, ExternalLink } from 'lucide-react';

interface Review {
  text: string;
  rating: number | null;
  authorName: string | null;
  source: string;
  createdAt: string;
  sourceUrl: string | null;
}

function sourceLabel(source: string): string {
  switch (source) {
    case 'google_reviews':
      return 'Google';
    case 'trustpilot':
      return 'Trustpilot';
    case 'csv':
      return 'CSV';
    default:
      return source;
  }
}

function sourceVariant(source: string): 'default' | 'secondary' | 'outline' {
  switch (source) {
    case 'google_reviews':
      return 'default';
    case 'trustpilot':
      return 'secondary';
    case 'csv':
      return 'outline';
    default:
      return 'secondary';
  }
}

function relativeTime(dateStr: string): string {
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

function RatingStars({ rating }: { rating: number | null }) {
  if (rating == null)
    return <span className="text-muted-foreground/40">—</span>;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`size-3 ${
            i < rating
              ? 'fill-amber-400 text-amber-400'
              : 'text-muted-foreground/20'
          }`}
        />
      ))}
    </div>
  );
}

export function RecentReviewsTable({
  reviews,
  loading,
}: {
  reviews?: Review[];
  loading?: boolean;
}) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-36" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!reviews || reviews.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Recent Reviews</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Source</TableHead>
              <TableHead className="w-[100px]">Rating</TableHead>
              <TableHead className="w-[120px]">Author</TableHead>
              <TableHead>Text</TableHead>
              <TableHead className="w-[100px] text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.map((review, i) => (
              <TableRow key={i}>
                <TableCell>
                  {review.sourceUrl ? (
                    <a
                      href={review.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 hover:underline"
                    >
                      <Badge
                        variant={sourceVariant(review.source)}
                        className="text-[10px] h-5 px-1.5"
                      >
                        {sourceLabel(review.source)}
                      </Badge>
                      <ExternalLink className="size-3 text-muted-foreground/30" />
                    </a>
                  ) : (
                    <Badge
                      variant={sourceVariant(review.source)}
                      className="text-[10px] h-5 px-1.5"
                    >
                      {sourceLabel(review.source)}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <RatingStars rating={review.rating} />
                </TableCell>
                <TableCell className="text-muted-foreground truncate max-w-[120px]">
                  {review.authorName ?? '—'}
                </TableCell>
                <TableCell className="max-w-[300px] truncate">
                  {review.text}
                </TableCell>
                <TableCell className="text-right text-muted-foreground text-xs">
                  {relativeTime(review.createdAt)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
