import type { DataForSEOTrustpilotReviewItem } from './dataforseo';
import type { NormalizedFeedback } from './csv';

export function normalizeTrustpilotReview(
  item: DataForSEOTrustpilotReviewItem,
): NormalizedFeedback {
  const parts: string[] = [];
  if (item.title?.trim()) parts.push(item.title.trim());
  if (item.review_text?.trim()) parts.push(item.review_text.trim());

  return {
    text: parts.join('\n'),
    rating: item.rating?.value != null ? Math.round(item.rating.value) : null,
    authorName: item.user_profile?.name ?? null,
    sourceItemId: item.url ?? null,
    createdAt: item.timestamp ? new Date(item.timestamp) : new Date(),
  };
}

export function buildTrustpilotMetadata(
  item: DataForSEOTrustpilotReviewItem,
): Record<string, unknown> | null {
  const meta: Record<string, unknown> = {};
  if (item.url) meta.review_url = item.url;
  if (item.verified !== undefined) meta.verified = item.verified;
  if (item.language) meta.language = item.language;
  if (item.user_profile) meta.user_profile = item.user_profile;
  if (item.responses && item.responses.length > 0)
    meta.responses = item.responses;
  return Object.keys(meta).length > 0 ? meta : null;
}
