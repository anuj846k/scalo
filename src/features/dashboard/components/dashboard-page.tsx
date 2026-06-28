'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import useSWR from 'swr';
import { authClient } from '@/lib/auth-client';
import { KPICards } from './kpi-cards';
import { SentimentCharts } from './sentiment-charts';
import { RecentReviewsTable } from './recent-reviews-table';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function monthLabel(year: number, month: number): string {
  return new Date(year, month - 1).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
}

function monthRange(year: number, month: number): { from: string; to: string } {
  const from = new Date(year, month - 1, 1);
  const to = new Date(year, month, 0);
  return { from: from.toISOString(), to: to.toISOString() };
}

export default function DashboardPage() {
  const [orgName, setOrgName] = useState('');
  const [hasSources, setHasSources] = useState<boolean | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  const queryParams = useMemo(() => {
    if (selectedPeriod === '30d') return '';
    if (selectedPeriod === '90d')
      return '?from=' + new Date(Date.now() - 90 * 86400000).toISOString();
    const [y, m] = selectedPeriod.split('-').map(Number);
    const { from, to } = monthRange(y, m);
    return `?from=${from}&to=${to}`;
  }, [selectedPeriod]);

  const { data, isLoading } = useSWR('/api/dashboard' + queryParams, fetcher, {
    refreshInterval: 30000,
    revalidateOnFocus: false,
  });

  useEffect(() => {
    (async () => {
      const orgRes = await authClient.organization.getFullOrganization();
      if (orgRes.data) setOrgName(orgRes.data.name || '');
    })();
  }, []);

  useEffect(() => {
    if (data && !isLoading) {
      setHasSources(data.kpis.totalReviews > 0);
    }
  }, [data, isLoading]);

  // Build month options from available data
  const monthOptions = useMemo(() => {
    const options: Array<{ key: string; label: string }> = [
      { key: '30d', label: '30D' },
      { key: '90d', label: '90D' },
    ];
    if (data?.dailySentiment?.length) {
      const months = new Set<string>();
      for (const d of data.dailySentiment) {
        const date = new Date(d.date);
        months.add(`${date.getFullYear()}-${date.getMonth() + 1}`);
      }
      for (const m of [...months].sort().reverse()) {
        const [y, mNum] = m.split('-').map(Number);
        options.push({ key: m, label: monthLabel(y, mNum) });
      }
    }
    return options;
  }, [data?.dailySentiment]);

  if (!isLoading && hasSources === false) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">
            {orgName ? `Welcome to ${orgName}` : 'Dashboard'}
          </h1>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12">
            <div className="text-center space-y-2">
              <h2 className="text-lg font-semibold">No data yet</h2>
              <p className="text-sm text-muted-foreground max-w-sm">
                Connect a feedback source to start seeing customer insights.
              </p>
            </div>
            <Button asChild>
              <Link href="/dashboard/connectors">
                Connect your first source
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <h1 className="text-2xl font-bold">
          {orgName ? `Welcome to ${orgName}` : 'Dashboard'}
        </h1>
        <div className="flex items-center gap-1">
          {monthOptions.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setSelectedPeriod(opt.key)}
              className={cn(
                'px-2.5 py-1 text-xs font-medium rounded-lg transition-colors',
                selectedPeriod === opt.key
                  ? 'bg-brand-600 text-white'
                  : 'bg-muted text-muted-foreground hover:bg-muted/70',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <KPICards kpis={data?.kpis} loading={isLoading} />

      <SentimentCharts
        dailySentiment={data?.dailySentiment}
        loading={isLoading}
      />

      <RecentReviewsTable reviews={data?.recentReviews} loading={isLoading} />
    </div>
  );
}
