'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line } from 'recharts';

interface SparklineData {
  reviewsPerDay: number[];
  avgRating: number[];
  sentimentRatio: number[];
  newThisWeek: number[];
}

interface KPIProps {
  totalReviews: number;
  avgRating: number;
  sentimentRatio: { positive: number; neutral: number; negative: number };
  newThisWeek: number;
  sourcesConnected: number;
  sparklines: SparklineData;
}

function TrendBadge({ data }: { data: number[] }) {
  if (data.length < 4) {
    return (
      <Badge variant="secondary" className="gap-1 text-[10px] h-5">
        <Minus className="size-2.5" />
        new
      </Badge>
    );
  }

  const mid = Math.floor(data.length / 2);
  const firstHalf = data.slice(0, mid);
  const secondHalf = data.slice(mid);

  const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

  if (firstAvg < 1 || firstAvg === secondAvg) {
    return (
      <Badge variant="secondary" className="gap-1 text-[10px] h-5">
        <Minus className="size-2.5" />
        flat
      </Badge>
    );
  }

  const pct = Math.min(
    Math.abs(Math.round(((secondAvg - firstAvg) / firstAvg) * 100)),
    100,
  );

  if (secondAvg > firstAvg && pct >= 5) {
    return (
      <Badge className="gap-1 text-[10px] h-5 bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 hover:bg-emerald-100">
        <ArrowUp className="size-2.5" />
        {pct}%
      </Badge>
    );
  }

  if (secondAvg < firstAvg && pct >= 5) {
    return (
      <Badge className="gap-1 text-[10px] h-5 bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400 hover:bg-red-100">
        <ArrowDown className="size-2.5" />
        {pct}%
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className="gap-1 text-[10px] h-5">
      <Minus className="size-2.5" />
      flat
    </Badge>
  );
}

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  if (!data.length) return null;
  return (
    <ResponsiveContainer width="100%" height={32}>
      <LineChart data={data.map((v, i) => ({ v, i }))}>
        <Line
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={3}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function KPICards({
  kpis,
  loading,
}: {
  kpis?: KPIProps;
  loading?: boolean;
}) {
  if (loading || !kpis) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-5 space-y-3">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-7 w-16" />
              <Skeleton className="h-8 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      label: 'Total Reviews',
      value: kpis.totalReviews.toLocaleString(),
      sparkline: kpis.sparklines.reviewsPerDay,
      color: '#0025f5',
    },
    {
      label: 'Avg Rating',
      value: kpis.avgRating.toFixed(1),
      sparkline: kpis.sparklines.avgRating,
      color: '#059669',
    },
    {
      label: 'Sentiment',
      value: `${Math.round(kpis.sentimentRatio.positive * 100)}%`,
      subtitle: 'positive',
      sparkline: kpis.sparklines.sentimentRatio,
      color: '#059669',
    },
    {
      label: 'New This Week',
      value: kpis.newThisWeek.toString(),
      sparkline: kpis.sparklines.newThisWeek,
      color: '#0025f5',
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, i) => {
        const hasTrend = card.sparkline.length >= 4;
        const isSentiment = card.label === 'Sentiment';
        return (
          <Card key={i}>
            <CardContent className="p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground/70 font-medium">
                  {card.label}
                </span>
                {hasTrend && !isSentiment && (
                  <TrendBadge data={card.sparkline} />
                )}
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold tracking-tight tabular-nums">
                  {card.value}
                </span>
                {card.subtitle && (
                  <span className="text-xs text-muted-foreground/60">
                    {card.subtitle}
                  </span>
                )}
              </div>
              <MiniSparkline data={card.sparkline} color={card.color} />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
