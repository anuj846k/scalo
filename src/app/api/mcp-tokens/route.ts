import { NextResponse } from 'next/server';
import { z } from 'zod';

import { getMcpApiIdentity } from '@/lib/mcp/api-auth';
import {
  createMcpAccessToken,
  listMcpAccessTokens,
} from '@/lib/mcp/token-auth';

const createTokenSchema = z.object({
  name: z.string().trim().min(1).max(100),
});

export async function GET() {
  const identity = await getMcpApiIdentity();
  if ('error' in identity) {
    return NextResponse.json(
      { error: identity.error },
      { status: identity.status },
    );
  }

  const tokens = await listMcpAccessTokens(identity);
  return NextResponse.json(
    { tokens },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}

export async function POST(request: Request) {
  const identity = await getMcpApiIdentity();
  if ('error' in identity) {
    return NextResponse.json(
      { error: identity.error },
      { status: identity.status },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = createTokenSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Enter a key name between 1 and 100 characters.' },
      { status: 400 },
    );
  }

  try {
    const result = await createMcpAccessToken({
      ...identity,
      name: parsed.data.name,
    });

    return NextResponse.json(result, {
      status: 201,
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    const message =
      error instanceof Error && error.message.includes('at most')
        ? error.message
        : 'Failed to create MCP key.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
