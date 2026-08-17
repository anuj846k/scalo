export type CommunityUrlKind =
  | 'community'
  | 'web'
  | 'google_reviews'
  | 'trustpilot';

export type CommunityPlatform =
  | 'reddit'
  | 'hackernews'
  | 'producthunt'
  | 'web'
  | 'google_reviews'
  | 'trustpilot';

export interface ClassifiedCommunityUrl {
  kind: CommunityUrlKind;
  platform: CommunityPlatform;
  /** Canonical thread URL used as Connector Config placeId */
  canonicalUrl: string;
  hostname: string;
  /** True when the URL must use a dedicated connector instead of Firecrawl */
  blocked: boolean;
  blockReason?: string;
}

const TRACKING_PARAMS = new Set([
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'ref',
  'ref_src',
  'fbclid',
  'gclid',
  'mc_cid',
  'mc_eid',
]);

function stripTrackingParams(url: URL): void {
  for (const key of [...url.searchParams.keys()]) {
    if (
      TRACKING_PARAMS.has(key.toLowerCase()) ||
      key.toLowerCase().startsWith('utm_')
    ) {
      url.searchParams.delete(key);
    }
  }
}

function normalizeHostname(hostname: string): string {
  return hostname.toLowerCase().replace(/^www\./, '');
}

function isGoogleReviewsHost(hostname: string): boolean {
  const host = normalizeHostname(hostname);
  return (
    host === 'google.com' ||
    host === 'maps.google.com' ||
    host === 'maps.app.goo.gl' ||
    host === 'goo.gl' ||
    host.endsWith('.google.com') ||
    host === 'g.page'
  );
}

function isTrustpilotHost(hostname: string): boolean {
  const host = normalizeHostname(hostname);
  return host === 'trustpilot.com' || host.endsWith('.trustpilot.com');
}

function detectPlatform(hostname: string): CommunityPlatform | null {
  const host = normalizeHostname(hostname);
  if (
    host === 'reddit.com' ||
    host === 'old.reddit.com' ||
    host.endsWith('.reddit.com')
  ) {
    return 'reddit';
  }
  if (
    host === 'news.ycombinator.com' ||
    host === 'ycombinator.com' ||
    host === 'hn.algolia.com'
  ) {
    return 'hackernews';
  }
  if (host === 'producthunt.com' || host.endsWith('.producthunt.com')) {
    return 'producthunt';
  }
  return null;
}

function canonicalizeCommunityUrl(raw: string): URL {
  const trimmed = raw.trim();
  if (!trimmed) {
    throw new Error('URL is required');
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed.includes('://') ? trimmed : `https://${trimmed}`);
  } catch {
    throw new Error('Invalid URL');
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error('Only http(s) URLs are supported');
  }

  parsed.hash = '';
  stripTrackingParams(parsed);

  // Prefer www-less host for placeId uniqueness
  parsed.hostname = parsed.hostname.toLowerCase();
  if (parsed.pathname.length > 1 && parsed.pathname.endsWith('/')) {
    parsed.pathname = parsed.pathname.slice(0, -1);
  }

  return parsed;
}

/**
 * Classify a discussion URL before any Firecrawl call.
 * Google Reviews / Trustpilot are blocked so dedicated connectors stay the path.
 */
export function classifyCommunityUrl(rawUrl: string): ClassifiedCommunityUrl {
  const url = canonicalizeCommunityUrl(rawUrl);
  const hostname = normalizeHostname(url.hostname);
  const canonicalUrl = url.toString();

  if (isGoogleReviewsHost(url.hostname)) {
    return {
      kind: 'google_reviews',
      platform: 'google_reviews',
      canonicalUrl,
      hostname,
      blocked: true,
      blockReason:
        'Use the Google Reviews connector for Google/Maps review pages.',
    };
  }

  if (isTrustpilotHost(url.hostname)) {
    return {
      kind: 'trustpilot',
      platform: 'trustpilot',
      canonicalUrl,
      hostname,
      blocked: true,
      blockReason: 'Use the Trustpilot connector for Trustpilot review pages.',
    };
  }

  const platform = detectPlatform(url.hostname);
  if (platform) {
    return {
      kind: 'community',
      platform,
      canonicalUrl,
      hostname,
      blocked: false,
    };
  }

  return {
    kind: 'web',
    platform: 'web',
    canonicalUrl,
    hostname,
    blocked: false,
  };
}

export function deriveCommunityTitle(
  threadTitle: string | null | undefined,
  hostname: string,
): string {
  const cleaned = threadTitle?.trim();
  if (cleaned) {
    return cleaned.length > 120 ? `${cleaned.slice(0, 117)}...` : cleaned;
  }
  return hostname;
}
