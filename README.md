This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

npx inngest-cli@latest dev
You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Testing Guide

Run checks from the repository root.

### Static checks

```bash
pnpm lint
pnpm build
```

Use `pnpm lint` for fast feedback while editing. Use `pnpm build` before opening a PR or deploying because it catches Next.js routing, server/client component, and TypeScript build issues.

For focused linting after a small change:

```bash
pnpm exec eslint src/path/to/file.tsx
```

### MCP server

The local MCP server requires `DATABASE_URL` and `SCALO_MCP_TOKEN` in `.env`.

```bash
pnpm mcp:test
```

Expected result:

- starts the `scalo` MCP server over STDIO
- lists `get_current_context`, `list_connectors`, `get_feedback_overview`, and `search_feedback`
- calls `get_current_context` and returns the organization/user resolved from the MCP token

To verify editor registration with Codex:

```bash
codex mcp list
```

Expected result: `scalo` is listed as an enabled stdio server. More editor setup notes live in `docs/mcp.md`.

### Database schema

Generate migrations after schema changes:

```bash
pnpm db:generate
```

Apply schema changes to the configured database:

```bash
pnpm db:push
```

Use `pnpm db:migrate` only when the target database migration ledger is aligned with the local `migrations/` history. If the database was previously updated with push/manual SQL, prefer `db:push` until the migration baseline is fixed.

### Product smoke test

Use this flow when testing the app as a new workspace.

1. Start the web app:

```bash
pnpm dev
```

2. In a second terminal, start Inngest so connector sync jobs can run locally:

```bash
npx inngest-cli@latest dev
```

3. Open `http://localhost:3000/signup` and create a new user.

4. Complete workspace setup by creating an organization.

5. Confirm `/dashboard` loads after setup. Billing is currently disabled for local testing, so the dashboard should not redirect to `/subscribe`.

6. Go to `/dashboard/connectors` and test the available connector entry points:

- CSV Upload: upload a CSV, map columns, and confirm feedback appears in the dashboard/chat.
- Google Reviews: paste a Google Maps URL or Place ID.
- Trustpilot: paste a Trustpilot profile URL or domain.

7. Watch the Inngest dev server for connector job progress. Google Reviews and Trustpilot jobs create DataForSEO tasks, wait for pingback, save new feedback rows, then generate embeddings.

8. Open `/dashboard/chat` and ask questions such as:

- `Show recent reviews`
- `What are the top complaints?`
- `Show negative Google reviews`
- `How do customers feel about staff?`

Chat uses the AI SDK tool wrapper, which calls the shared retrieval function in `src/lib/retrieval/search-feedback.ts`. The MCP `search_feedback` tool uses the same retrieval function.

### Connector limits

These defaults keep DataForSEO usage small while the product is being tested:

| Area                            | Default behavior                              |
| ------------------------------- | --------------------------------------------- |
| Google Reviews initial sync     | Fetches up to 20 reviews                      |
| Google Reviews incremental sync | Fetches up to 20 reviews                      |
| Trustpilot initial sync         | Fetches up to 20 reviews                      |
| Trustpilot incremental sync     | Fetches up to 20 reviews                      |
| Chat/retrieval results          | Returns 5 feedback items per page/tool call   |
| Chat history API                | Returns 20 chats by default, capped at 50     |
| CSV preview                     | Shows the first 10 rows before upload mapping |

### MCP smoke test

After creating an organization, generate an MCP key from the dashboard settings. Put the key in `.env`:

```bash
SCALO_MCP_TOKEN=scalo_mcp_your-generated-key
```

Then run:

```bash
pnpm mcp:test
```

Expected result:

- the MCP server starts over STDIO
- `get_current_context` returns your organization and user
- the tool list includes `list_connectors`, `get_feedback_overview`, and `search_feedback`

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
