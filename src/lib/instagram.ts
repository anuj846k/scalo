const INSTAGRAM_API_VERSION = "v25.0";
const INSTAGRAM_AUTH_URL = "https://www.instagram.com/oauth/authorize";
const INSTAGRAM_TOKEN_URL = "https://api.instagram.com/oauth/access_token";
const GRAPH_API_BASE = `https://graph.instagram.com/${INSTAGRAM_API_VERSION}`;

function getClientId() {
    return process.env.INSTAGRAM_CLIENT_ID!;
}

function getClientSecret() {
    return process.env.INSTAGRAM_CLIENT_SECRET!;
}

function getRedirectUri() {
    return process.env.INSTAGRAM_REDIRECT_URI!;
}

export function getAuthorizationUrl(state?: string) {
    const params = new URLSearchParams({
        client_id: getClientId(),
        redirect_uri: getRedirectUri(),
        response_type: "code",
        scope: "instagram_business_basic",
    });
    if (state) {
        params.set("state", state);
    }
    return `${INSTAGRAM_AUTH_URL}?${params.toString()}`;
}

interface ShortLivedTokenResponse {
    access_token: string;
    user_id: string;
    permissions: string;
}

export async function exchangeCodeForShortLivedToken(code: string): Promise<ShortLivedTokenResponse> {
    const body = new URLSearchParams({
        client_id: getClientId(),
        client_secret: getClientSecret(),
        grant_type: "authorization_code",
        redirect_uri: getRedirectUri(),
        code,
    });

    const res = await fetch(INSTAGRAM_TOKEN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error_message || `Token exchange failed: ${res.status}`);
    }

    const data = await res.json();
    return data.data?.[0] ?? data;
}

interface LongLivedTokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
}

export async function exchangeForLongLivedToken(shortLivedToken: string): Promise<LongLivedTokenResponse> {
    const params = new URLSearchParams({
        grant_type: "ig_exchange_token",
        client_secret: getClientSecret(),
        access_token: shortLivedToken,
    });

    const res = await fetch(`https://graph.instagram.com/access_token?${params.toString()}`);

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error_message || `Long-lived token exchange failed: ${res.status}`);
    }

    return res.json();
}

export async function refreshAccessToken(token: string): Promise<LongLivedTokenResponse> {
    const params = new URLSearchParams({
        grant_type: "ig_refresh_token",
        access_token: token,
    });

    const res = await fetch(`https://graph.instagram.com/refresh_access_token?${params.toString()}`);

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error_message || `Token refresh failed: ${res.status}`);
    }

    return res.json();
}

interface InstagramProfile {
    user_id: string;
    username: string;
    name?: string;
    account_type?: string;
    profile_picture_url?: string;
    followers_count?: number;
    follows_count?: number;
    media_count?: number;
}

export async function getProfile(accessToken: string): Promise<InstagramProfile> {
    const params = new URLSearchParams({
        fields: "user_id,username,name,account_type,profile_picture_url,followers_count,follows_count,media_count",
        access_token: accessToken,
    });

    const res = await fetch(`${GRAPH_API_BASE}/me?${params.toString()}`);

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error_message || `Profile fetch failed: ${res.status}`);
    }

    const data = await res.json();
    return data.data?.[0] ?? data;
}

interface CarouselChild {
    id: string;
    media_url?: string;
    media_type?: string;
}

interface MediaItem {
    id: string;
    media_type?: string;
    media_url?: string;
    permalink?: string;
    caption?: string;
    timestamp?: string;
    username?: string;
    children?: { data: CarouselChild[] };
}

interface MediaResponse {
    data: MediaItem[];
    paging?: {
        cursors: { before: string; after: string };
        next?: string;
    };
}

export async function getUserMedia(igUserId: string, accessToken: string): Promise<MediaResponse> {
    const params = new URLSearchParams({
        fields: "id,media_type,media_url,permalink,caption,timestamp,username,children{media_url,media_type}",
        access_token: accessToken,
    });

    const res = await fetch(`${GRAPH_API_BASE}/${igUserId}/media?${params.toString()}`);

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error_message || `Media fetch failed: ${res.status}`);
    }

    return res.json();
}

export function getTokenExpiryDate(expiresInSeconds: number): Date {
    return new Date(Date.now() + expiresInSeconds * 1000);
}

export function isTokenExpiringSoon(expiresAt: Date | null, withinMs: number = 24 * 60 * 60 * 1000): boolean {
    if (!expiresAt) return true;
    return expiresAt.getTime() - Date.now() < withinMs;
}
