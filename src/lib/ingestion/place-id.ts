export function extractPlaceId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  try {
    const url = new URL(trimmed);
    const params = new URLSearchParams(url.search);
    const paramId = params.get('place_id') ?? params.get('placeid');
    if (paramId) return paramId;

    const match = url.pathname.match(/\/place\/([^/]+)/);
    if (match?.[1]) return match[1];

    const fragmentMatch = url.hash.match(/placeid:([^&]+)/);
    if (fragmentMatch?.[1]) return fragmentMatch[1];
  } catch {
    // not a URL, treat as raw Place ID
  }

  if (/^ChIJ[A-Za-z0-9_-]{20,}$/.test(trimmed)) return trimmed;
  if (/^[A-Za-z0-9_-]{27,}$/.test(trimmed)) return trimmed;

  return null;
}
