export function extractPlaceId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  try {
    const url = new URL(trimmed);

    const isShortUrl =
      url.hostname === 'maps.app.goo.gl' ||
      url.hostname === 'goo.gl' ||
      url.pathname.startsWith('/maps/');

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

    const cidMatch = url.pathname.match(/!1s(0x[0-9a-fA-F]+:0x[0-9a-fA-F]+)/);
    if (cidMatch?.[1]) return `cid:${cidMatch[1]}`;

    const fragmentCidMatch = url.hash.match(
      /!1s(0x[0-9a-fA-F]+:0x[0-9a-fA-F]+)/,
    );
    if (fragmentCidMatch?.[1]) return `cid:${fragmentCidMatch[1]}`;

    const ftidMatch = url.pathname.match(/16s(%2F|%2f|\/)([^!?&]+)/);
    if (ftidMatch?.[2]) {
      const ftid = decodeURIComponent(ftidMatch[2]);
      return `ftid:${ftid}`;
    }

    const fragmentMatch = url.hash.match(/placeid:([^&]+)/);
    if (fragmentMatch?.[1]) return fragmentMatch[1];

    if (isShortUrl) return `resolve:${trimmed}`;
  } catch {
    // not a URL, treat as raw Place ID
  }

  if (/^ChIJ[A-Za-z0-9_-]{20,}$/.test(trimmed)) return trimmed;
  if (/^[A-Za-z0-9_-]{27,}$/.test(trimmed)) return trimmed;

  if (/^0x[0-9a-fA-F]+:0x[0-9a-fA-F]+$/.test(trimmed)) return `cid:${trimmed}`;

  return null;
}
