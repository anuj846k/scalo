export interface FirecrawlScrapeResult {
  markdown: string;
  title: string | null;
  sourceUrl: string;
}

interface FirecrawlScrapeResponse {
  success?: boolean;
  data?: {
    markdown?: string;
    metadata?: {
      title?: string;
      sourceURL?: string;
      url?: string;
    };
  };
  error?: string;
}

/**
 * Thin Firecrawl adapter. Keeps credentials server-side and returns markdown only.
 */
export async function scrapeDiscussionUrl(
  url: string,
  apiKey = process.env.FIRECRAWL_API_KEY,
): Promise<FirecrawlScrapeResult> {
  if (!apiKey) {
    throw new Error('FIRECRAWL_API_KEY is not configured');
  }

  const response = await fetch('https://api.firecrawl.dev/v2/scrape', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url,
      formats: ['markdown'],
      onlyMainContent: true,
    }),
  });

  const payload = (await response.json()) as FirecrawlScrapeResponse;

  if (!response.ok || payload.success === false) {
    throw new Error(
      payload.error || `Firecrawl scrape failed (${response.status})`,
    );
  }

  const markdown = payload.data?.markdown?.trim() ?? '';
  if (!markdown) {
    throw new Error('Firecrawl returned empty page content');
  }

  return {
    markdown,
    title: payload.data?.metadata?.title?.trim() || null,
    sourceUrl:
      payload.data?.metadata?.sourceURL || payload.data?.metadata?.url || url,
  };
}
