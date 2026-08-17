# Scalo MCP development

`pnpm mcp` starts Scalo's local Model Context Protocol server over STDIO. It exposes read-only, organization-scoped feedback tools:

- `get_current_context`
- `list_connectors`
- `get_feedback_overview`
- `search_feedback`

## Required local environment

Generate a key from **Dashboard → Organisation → MCP keys**, then add it to `.env` or provide it through the editor's MCP environment configuration:

```bash
SCALO_MCP_TOKEN=scalo_mcp_your-generated-key
```

The key resolves the issuing user and active organization. Revoked and expired keys are rejected on every tool call.

The server also requires the existing `DATABASE_URL` and, for semantic searches, the embedding provider configuration used by the chat feature.

## VS Code

Create `.vscode/mcp.json`:

```json
{
  "servers": {
    "scalo": {
      "type": "stdio",
      "command": "pnpm",
      "args": ["mcp"],
      "cwd": "${workspaceFolder}"
    }
  }
}
```

## Claude Code

From the Scalo repository root, register the project-local server:

```bash
claude mcp add --scope project scalo -- pnpm mcp
```

Claude Code stores a project-scoped configuration in `.mcp.json` and loads it when a new session starts.

## Codex

Add this to the trusted project configuration in `.codex/config.toml`, replacing the path with your local Scalo checkout:

```toml
[mcp_servers.scalo]
command = "pnpm"
args = ["mcp"]
cwd = "/absolute/path/to/scalo"
```

To test the Codex wiring from the repository root:

```bash
codex mcp list
```

Expected: the list includes an enabled `scalo` stdio server. In the Codex TUI, restart Codex after changing `.codex/config.toml`, then type `/mcp` to view connected MCP servers and tools.

## Antigravity

Add this server to Antigravity's `mcp_config.json`:

```json
{
  "mcpServers": {
    "scalo": {
      "command": "pnpm",
      "args": ["mcp"],
      "cwd": "/absolute/path/to/scalo"
    }
  }
}
```

Use Antigravity's MCP Servers panel to reload the configuration after saving it.
