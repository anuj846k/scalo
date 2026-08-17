import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';

import { resolveMcpContext } from '@/lib/mcp/context';
import { registerScaloTools } from '@/lib/mcp/register-tools';

function getBearerToken(request: Request) {
  const header = request.headers.get('authorization');
  if (!header?.startsWith('Bearer ')) return null;
  return header.slice('Bearer '.length).trim();
}

export async function POST(request: Request) {
  const token = getBearerToken(request);
  if (!token) {
    return Response.json(
      { error: 'Missing bearer token' },
      { status: 401, headers: { 'WWW-Authenticate': 'Bearer' } },
    );
  }

  try {
    await resolveMcpContext(token);
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Unauthorized' },
      { status: 401 },
    );
  }

  const server = new McpServer({ name: 'scalo', version: '0.1.0' });
  registerScaloTools(server, () => resolveMcpContext(token));

  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });
  await server.connect(transport);

  return transport.handleRequest(request);
}

export async function GET() {
  return Response.json(
    { error: 'This MCP endpoint only supports stateless POST requests' },
    { status: 405 },
  );
}
