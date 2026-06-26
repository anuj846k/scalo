import type { NormalizedFeedback } from './csv';

interface DataForSEOReview {
  review_id?: string;
  review_text?: string;
  rating?: { value?: number };
  profile_name?: string;
  timestamp?: string;
  profile_url?: string;
  profile_image_url?: string;
  review_url?: string;
  owner_answer?: string;
  local_guide?: boolean;
  photos_count?: number;
  reviews_count?: number;
}

export function normalizeGoogleReview(
  item: DataForSEOReview,
): NormalizedFeedback {
  return {
    text: item.review_text ?? '',
    rating: item.rating?.value != null ? Math.round(item.rating.value) : null,
    authorName: item.profile_name ?? null,
    sourceItemId: item.review_id ?? null,
    createdAt: item.timestamp ? new Date(item.timestamp) : new Date(),
  };
}

export function buildReviewMetadata(
  item: DataForSEOReview,
): Record<string, unknown> | null {
  const meta: Record<string, unknown> = {};
  if (item.profile_url) meta.profile_url = item.profile_url;
  if (item.profile_image_url) meta.profile_image_url = item.profile_image_url;
  if (item.review_url) meta.review_url = item.review_url;
  if (item.owner_answer) meta.owner_answer = item.owner_answer;
  if (typeof item.local_guide === 'boolean')
    meta.local_guide = item.local_guide;
  if (typeof item.photos_count === 'number')
    meta.photos_count = item.photos_count;
  if (typeof item.reviews_count === 'number')
    meta.reviews_count = item.reviews_count;
  return Object.keys(meta).length > 0 ? meta : null;
}
