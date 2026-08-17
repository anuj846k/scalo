'use client';

import { ExternalLink } from 'lucide-react';

import { cn } from '@/lib/utils';

type Citation = {
  url: string;
  label: string;
};

function labelForSource(source: unknown, url: string): string {
  const host = (() => {
    try {
      return new URL(url).hostname.replace(/^www\./, '');
    } catch {
      return '';
    }
  })();

  if (source === 'google_reviews' || host.includes('google.')) {
    return 'Google';
  }
  if (source === 'trustpilot' || host.includes('trustpilot.')) {
    return 'Trustpilot';
  }
  if (host.includes('reddit.')) return 'Reddit';
  if (host.includes('ycombinator.') || host === 'news.ycombinator.com') {
    return 'HN';
  }
  if (host.includes('producthunt.')) return 'Product Hunt';
  if (source === 'community') return 'Community';
  if (source === 'web') return 'Web';
  return host || 'Source';
}

export function collectCitationsFromParts(
  parts: Array<Record<string, unknown>> | undefined,
): Citation[] {
  if (!parts?.length) return [];

  const seen = new Set<string>();
  const citations: Citation[] = [];

  for (const part of parts) {
    if (part.type !== 'tool-searchFeedback') continue;
    const output = part.output as
      | { items?: Array<{ sourceUrl?: unknown; source?: unknown }> }
      | undefined;
    if (!output?.items) continue;

    for (const item of output.items) {
      const url = typeof item.sourceUrl === 'string' ? item.sourceUrl : null;
      if (!url || seen.has(url)) continue;
      seen.add(url);
      citations.push({
        url,
        label: labelForSource(item.source, url),
      });
    }
  }

  return citations;
}

export function SourceCitations({
  citations,
  className,
}: {
  citations: Citation[];
  className?: string;
}) {
  if (citations.length === 0) return null;

  return (
    <div className={cn('flex flex-wrap gap-1.5 pt-1', className)}>
      {citations.map((citation) => (
        <a
          key={citation.url}
          href={citation.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 rounded-md border border-border/50 bg-muted/40 px-2 py-0.5 text-[11px] text-muted-foreground transition-colors hover:border-brand-500/40 hover:text-foreground"
        >
          <ExternalLink className="size-3" />
          {citation.label}
        </a>
      ))}
    </div>
  );
}
