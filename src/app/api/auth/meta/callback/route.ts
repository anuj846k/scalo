import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-utils";
import { db } from "@/db/drizzle";
import { instagramAccount } from "@/db/schema";
import {
    exchangeCodeForShortLivedToken,
    exchangeForLongLivedToken,
    getProfile,
    getTokenExpiryDate,
} from "@/lib/instagram";
import { eq } from "drizzle-orm";

function getOrigin(req: NextRequest) {
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "localhost:3000";
    const proto = req.headers.get("x-forwarded-proto") || "https";
    return `${proto}://${host}`;
}

export async function GET(req: NextRequest) {
    const origin = getOrigin(req);
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error || !code) {
        console.error("Meta auth error:", error);
        return NextResponse.redirect(new URL("/dashboard/settings?instagram=error&reason=access_denied", origin));
    }

    const user = await requireAuth();
    const userId = user.id;

    try {
        const shortTokenData = await exchangeCodeForShortLivedToken(code);

        const longTokenData = await exchangeForLongLivedToken(shortTokenData.access_token);
        const accessToken = longTokenData.access_token;

        const tokenExpiresAt = longTokenData.expires_in != null
            ? getTokenExpiryDate(longTokenData.expires_in)
            : null;

        const profile = await getProfile(accessToken);
        const igUserId = profile.user_id;
        const igUsername = profile.username;

        if (!igUserId) {
            console.error("No igUserId in response:", profile);
            return NextResponse.redirect(new URL("/dashboard/settings?instagram=error&reason=no_ig_user", origin));
        }

        const existing = await db
            .select()
            .from(instagramAccount)
            .where(eq(instagramAccount.igUserId, igUserId))
            .limit(1);

        if (existing.length > 0) {
            await db
                .update(instagramAccount)
                .set({
                    igUsername,
                    accessToken,
                    tokenExpiresAt,
                    updatedAt: new Date(),
                })
                .where(eq(instagramAccount.id, existing[0].id));
        } else {
            await db.insert(instagramAccount).values({
                id: crypto.randomUUID(),
                userId,
                igUserId,
                igUsername,
                accessToken,
                tokenExpiresAt,
                connectedAt: new Date(),
                updatedAt: new Date(),
            });
        }

        console.log("Connected IG account:", { userId, igUserId, igUsername });

        return NextResponse.redirect(new URL("/dashboard/settings?instagram=connected", origin));
    } catch (e) {
        console.error("Meta callback exception:", e);
        return NextResponse.redirect(new URL("/dashboard/settings?instagram=error&reason=exception", origin));
    }
}
