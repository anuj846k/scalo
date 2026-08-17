import type { NormalizedFeedback } from './csv';
import {
  classifyCommunityUrl,
  type CommunityPlatform,
  type CommunityUrlKind,
} from './community-url';

export interface ExtractedCommunityComment {
  id?: string | null;
  permalink?: string | null;
  authorName?: string | null;
  text: string;
  score?: number | null;
  parentId?: string | null;
  createdAt?: string | null;
  /** True when this row is the original post body */
  isOriginalPost?: boolean | null;
}

export interface CommunityExtractionInput {
  threadTitle?: string | null;
  comments: ExtractedCommunityComment[];
}

export interface NormalizedCommunityFeedback extends NormalizedFeedback {
  source: 'community' | 'web';
  metadata: {
    review_url: string;
    platform: CommunityPlatform;
    thread_url: string;
    score?: number;
    parent_id?: string;
    is_original_post?: boolean;
  };
}

export interface NormalizeCommunityResult {
  kind: CommunityUrlKind;
  platform: CommunityPlatform;
  canonicalUrl: string;
  hostname: string;
  threadTitle: string | null;
  items: NormalizedCommunityFeedback[];
}

const NOISE_PATTERNS = [
  /^\[deleted\]$/i,
  /^\[removed\]$/i,
  /^deleted$/i,
  /^removed$/i,
  /^this comment was deleted/i,
  /^automod/i,
  /^i am a bot/i,
  /^beep boop/i,
];

const MIN_SUBSTANTIVE_LENGTH = 12;

function isNoiseText(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return true;
  if (trimmed.length < MIN_SUBSTANTIVE_LENGTH) return true;
  return NOISE_PATTERNS.some((pattern) => pattern.test(trimmed));
}

function parseCreatedAt(value: string | null | undefined): Date {
  if (!value) return new Date();
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

function resolveSourceItemId(
  comment: ExtractedCommunityComment,
  threadUrl: string,
  index: number,
): string {
  const id = comment.id?.trim();
  if (id) return id;

  const permalink = comment.permalink?.trim();
  if (permalink) return permalink;

  // Last-resort stable id within a thread (re-sync may recreate if extract order changes)
  const author = comment.authorName?.trim() || 'anonymous';
  const snippet = comment.text.trim().slice(0, 64).toLowerCase();
  return `${threadUrl}#${index}:${author}:${snippet}`;
}

function resolvePermalink(
  comment: ExtractedCommunityComment,
  threadUrl: string,
  sourceItemId: string,
): string {
  const permalink = comment.permalink?.trim();
  if (permalink) {
    try {
      return new URL(permalink, threadUrl).toString();
    } catch {
      return permalink;
    }
  }
  if (
    sourceItemId.startsWith('http://') ||
    sourceItemId.startsWith('https://')
  ) {
    return sourceItemId;
  }
  return threadUrl;
}

/**
 * Primary ingestion seam: URL classification + extracted comments → normalized feedback.
 * Firecrawl / LLM extractors feed into this; upsert/embed sit downstream.
 */
export function normalizeCommunityExtraction(
  url: string,
  extraction: CommunityExtractionInput,
): NormalizeCommunityResult {
  const classified = classifyCommunityUrl(url);
  if (classified.blocked) {
    throw new Error(
      classified.blockReason ?? 'URL is blocked for community import',
    );
  }

  const source: 'community' | 'web' =
    classified.kind === 'community' ? 'community' : 'web';

  const items: NormalizedCommunityFeedback[] = [];

  extraction.comments.forEach((comment, index) => {
    const text = comment.text?.trim() ?? '';
    if (isNoiseText(text)) return;

    // OP with no substantive body is skipped (same noise rules)
    if (comment.isOriginalPost && isNoiseText(text)) return;

    const sourceItemId = resolveSourceItemId(
      comment,
      classified.canonicalUrl,
      index,
    );
    const reviewUrl = resolvePermalink(
      comment,
      classified.canonicalUrl,
      sourceItemId,
    );

    const metadata: NormalizedCommunityFeedback['metadata'] = {
      review_url: reviewUrl,
      platform: classified.platform,
      thread_url: classified.canonicalUrl,
    };

    if (typeof comment.score === 'number' && Number.isFinite(comment.score)) {
      metadata.score = comment.score;
    }
    if (comment.parentId?.trim()) {
      metadata.parent_id = comment.parentId.trim();
    }
    if (comment.isOriginalPost) {
      metadata.is_original_post = true;
    }

    items.push({
      text,
      rating: null,
      authorName: comment.authorName?.trim() || null,
      sourceItemId,
      createdAt: parseCreatedAt(comment.createdAt),
      source,
      metadata,
    });
  });

  return {
    kind: classified.kind,
    platform: classified.platform,
    canonicalUrl: classified.canonicalUrl,
    hostname: classified.hostname,
    threadTitle: extraction.threadTitle?.trim() || null,
    items,
  };
}
