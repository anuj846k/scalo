import { createHash, randomBytes } from 'node:crypto';

import { and, desc, eq, gt, isNull } from 'drizzle-orm';

import { db } from '@/db/drizzle';
import { mcpAccessTokens } from '@/db/schema';

const TOKEN_PREFIX = 'scalo_mcp_';
const TOKEN_PREFIX_LENGTH = TOKEN_PREFIX.length + 8;
const TOKEN_LIFETIME_DAYS = 90;
const MAX_ACTIVE_TOKENS = 10;

export function hashMcpToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

export async function createMcpAccessToken({
  name,
  organizationId,
  userId,
}: {
  name: string;
  organizationId: string;
  userId: string;
}) {
  const existingTokens = await db
    .select({ id: mcpAccessTokens.id })
    .from(mcpAccessTokens)
    .where(
      and(
        eq(mcpAccessTokens.organizationId, organizationId),
        eq(mcpAccessTokens.userId, userId),
        isNull(mcpAccessTokens.revokedAt),
        gt(mcpAccessTokens.expiresAt, new Date()),
      ),
    )
    .limit(MAX_ACTIVE_TOKENS);

  if (existingTokens.length >= MAX_ACTIVE_TOKENS) {
    throw new Error(
      `You can have at most ${MAX_ACTIVE_TOKENS} active MCP keys.`,
    );
  }

  const token = `${TOKEN_PREFIX}${randomBytes(32).toString('base64url')}`;
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + TOKEN_LIFETIME_DAYS);

  const [record] = await db
    .insert(mcpAccessTokens)
    .values({
      id: crypto.randomUUID(),
      organizationId,
      userId,
      name,
      tokenPrefix: token.slice(0, TOKEN_PREFIX_LENGTH),
      tokenHash: hashMcpToken(token),
      expiresAt,
    })
    .returning({
      id: mcpAccessTokens.id,
      name: mcpAccessTokens.name,
      tokenPrefix: mcpAccessTokens.tokenPrefix,
      expiresAt: mcpAccessTokens.expiresAt,
      createdAt: mcpAccessTokens.createdAt,
    });

  return { token, record };
}

export async function listMcpAccessTokens({
  organizationId,
  userId,
}: {
  organizationId: string;
  userId: string;
}) {
  return db
    .select({
      id: mcpAccessTokens.id,
      name: mcpAccessTokens.name,
      tokenPrefix: mcpAccessTokens.tokenPrefix,
      lastUsedAt: mcpAccessTokens.lastUsedAt,
      expiresAt: mcpAccessTokens.expiresAt,
      revokedAt: mcpAccessTokens.revokedAt,
      createdAt: mcpAccessTokens.createdAt,
    })
    .from(mcpAccessTokens)
    .where(
      and(
        eq(mcpAccessTokens.organizationId, organizationId),
        eq(mcpAccessTokens.userId, userId),
      ),
    )
    .orderBy(desc(mcpAccessTokens.createdAt));
}

export async function revokeMcpAccessToken({
  id,
  organizationId,
  userId,
}: {
  id: string;
  organizationId: string;
  userId: string;
}) {
  const [record] = await db
    .update(mcpAccessTokens)
    .set({ revokedAt: new Date() })
    .where(
      and(
        eq(mcpAccessTokens.id, id),
        eq(mcpAccessTokens.organizationId, organizationId),
        eq(mcpAccessTokens.userId, userId),
        isNull(mcpAccessTokens.revokedAt),
      ),
    )
    .returning({ id: mcpAccessTokens.id });

  return record ?? null;
}

export function isMcpTokenFormatValid(token: string) {
  return (
    token.startsWith(TOKEN_PREFIX) &&
    token.length > TOKEN_PREFIX_LENGTH &&
    token.length <= 128
  );
}
