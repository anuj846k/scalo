export function extractGoogleMapsId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  try {
    const url = new URL(trimmed);
    const params = new URLSearchParams(url.search);
    const paramId = params.get('place_id') ?? params.get('placeid');
    if (paramId) return paramId;

    const pathMatch = url.pathname.match(/\/place\/([^/@]+)/);
    if (pathMatch?.[1]) {
      const slug = pathMatch[1];

      if (/^ChIJ[A-Za-z0-9_-]{20,}$/.test(slug)) return slug;
      if (/^[A-Za-z0-9_-]{27,}$/.test(slug) && !slug.includes('+')) return slug;

      const name = decodeURIComponent(slug).replace(/\+/g, ' ').trim();
      if (name) return `name:${name}`;
    }

    const fragmentMatch = url.hash.match(/placeid:([^&]+)/);
    if (fragmentMatch?.[1]) return fragmentMatch[1];
  } catch {
    // not a URL — treat as raw Place ID
  }

  if (/^ChIJ[A-Za-z0-9_-]{20,}$/.test(trimmed)) return trimmed;
  if (/^[A-Za-z0-9_-]{27,}$/.test(trimmed)) return trimmed;

  return null;
}
