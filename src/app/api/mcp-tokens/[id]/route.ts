import { NextResponse } from 'next/server';

import { getMcpApiIdentity } from '@/lib/mcp/api-auth';
import { revokeMcpAccessToken } from '@/lib/mcp/token-auth';

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const identity = await getMcpApiIdentity();
  if ('error' in identity) {
    return NextResponse.json(
      { error: identity.error },
      { status: identity.status },
    );
  }

  const { id } = await params;
  const token = await revokeMcpAccessToken({ ...identity, id });

  if (!token) {
    return NextResponse.json({ error: 'MCP key not found.' }, { status: 404 });
  }

  return NextResponse.json({ revoked: true });
}
