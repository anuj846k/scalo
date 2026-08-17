import { and, eq, gt, isNull, lt, or } from 'drizzle-orm';

import { db } from '@/db/drizzle';
import { mcpAccessTokens, member, organization, user } from '@/db/schema';
import { hashMcpToken, isMcpTokenFormatValid } from '@/lib/mcp/token-auth';

export interface McpContext {
  organization: {
    id: string;
    name: string;
    slug: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
}

export function getMcpTokenFromEnvironment() {
  const token = process.env.SCALO_MCP_TOKEN;

  if (!token) {
    throw new Error(
      'SCALO_MCP_TOKEN must be set before starting the Scalo MCP server.',
    );
  }

  if (!isMcpTokenFormatValid(token)) {
    throw new Error('SCALO_MCP_TOKEN has an invalid format.');
  }

  return token;
}

export async function resolveMcpContext(token: string): Promise<McpContext> {
  const now = new Date();
  const [record] = await db
    .select({
      tokenId: mcpAccessTokens.id,
      organizationId: organization.id,
      organizationName: organization.name,
      organizationSlug: organization.slug,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      role: member.role,
    })
    .from(mcpAccessTokens)
    .innerJoin(
      organization,
      eq(organization.id, mcpAccessTokens.organizationId),
    )
    .innerJoin(user, eq(user.id, mcpAccessTokens.userId))
    .innerJoin(
      member,
      and(
        eq(member.organizationId, mcpAccessTokens.organizationId),
        eq(member.userId, mcpAccessTokens.userId),
      ),
    )
    .where(
      and(
        eq(mcpAccessTokens.tokenHash, hashMcpToken(token)),
        isNull(mcpAccessTokens.revokedAt),
        gt(mcpAccessTokens.expiresAt, now),
      ),
    )
    .limit(1);

  if (!record) {
    throw new Error('The Scalo MCP key is invalid, expired, or revoked.');
  }

  const lastUsedCutoff = new Date(now.getTime() - 5 * 60 * 1000);
  await db
    .update(mcpAccessTokens)
    .set({ lastUsedAt: now })
    .where(
      and(
        eq(mcpAccessTokens.id, record.tokenId),
        or(
          isNull(mcpAccessTokens.lastUsedAt),
          lt(mcpAccessTokens.lastUsedAt, lastUsedCutoff),
        ),
      ),
    );

  return {
    organization: {
      id: record.organizationId,
      name: record.organizationName,
      slug: record.organizationSlug,
    },
    user: {
      id: record.userId,
      name: record.userName,
      email: record.userEmail,
      role: record.role,
    },
  };
}
