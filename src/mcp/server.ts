import 'dotenv/config';

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

import {
  getMcpTokenFromEnvironment,
  resolveMcpContext,
} from '@/lib/mcp/context';
import { registerScaloTools } from '@/lib/mcp/register-tools';

const server = new McpServer({ name: 'scalo', version: '0.1.0' });

const token = getMcpTokenFromEnvironment();

registerScaloTools(server, () => resolveMcpContext(token));

async function main() {
  await resolveMcpContext(token);
  await server.connect(new StdioServerTransport());
  console.error('Scalo MCP server running on stdio');
}

main().catch((error: unknown) => {
  console.error('Scalo MCP server failed to start:', error);
  process.exit(1);
});
