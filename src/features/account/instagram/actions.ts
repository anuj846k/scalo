"use server";

import { requireAuth } from "@/lib/auth-utils";
import { db } from "@/db/drizzle";
import { instagramAccount } from "@/db/schema";
import { getUserMedia } from "@/lib/instagram";
import { eq } from "drizzle-orm";

export async function getConnectedAccount(userId: string) {
    return db
        .select()
        .from(instagramAccount)
        .where(eq(instagramAccount.userId, userId))
        .limit(1)
        .then((rows) => rows[0] ?? null);
}

export async function getInstagramMedia() {
    const user = await requireAuth();

    const igAccount = await getConnectedAccount(user.id);

    if (!igAccount) {
        return { error: "No Instagram account connected" };
    }

    try {
        const data = await getUserMedia(igAccount.igUserId, igAccount.accessToken);
        return { data: data.data ?? [] };
    } catch (err) {
        return { error: (err as Error).message || "Failed to fetch media" };
    }
}

export async function disconnectInstagram() {
    const user = await requireAuth();

    await db
        .delete(instagramAccount)
        .where(eq(instagramAccount.userId, user.id));

    return { success: true };
}
