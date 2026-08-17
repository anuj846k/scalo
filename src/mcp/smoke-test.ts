import 'dotenv/config';

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

function getStringEnvironment() {
  return Object.fromEntries(
    Object.entries(process.env).filter(
      (entry): entry is [string, string] => typeof entry[1] === 'string',
    ),
  );
}

async function main() {
  const client = new Client({ name: 'scalo-mcp-smoke-test', version: '0.1.0' });
  const transport = new StdioClientTransport({
    command: 'pnpm',
    args: ['mcp'],
    cwd: process.cwd(),
    env: getStringEnvironment(),
    stderr: 'pipe',
  });

  transport.stderr?.on('data', (chunk) => {
    process.stderr.write(chunk);
  });

  await client.connect(transport);

  const tools = await client.listTools();
  console.log(
    JSON.stringify(
      {
        server: client.getServerVersion(),
        tools: tools.tools.map((tool) => tool.name),
      },
      null,
      2,
    ),
  );

  const context = await client.callTool({ name: 'get_current_context' });
  console.log(
    JSON.stringify({ get_current_context: context.content }, null, 2),
  );

  await client.close();
}

main().catch((error: unknown) => {
  console.error('Scalo MCP smoke test failed:', error);
  process.exit(1);
});
