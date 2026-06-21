# agents.md

## Project

**Name:** Murmur  
**Type:** Next.js web application  
**Purpose:** Ingest customer feedback from sources like Google Reviews, Instagram comments, CSV uploads, and other channels; extract themes and sentiment; generate semantic embeddings; and power a chat interface over the feedback corpus.

## Product Goal

Murmur helps businesses understand what customers are saying at scale. The system should:

- collect feedback from multiple sources,
- normalize it into a common schema,
- analyze it for sentiment and themes,
- generate embeddings for semantic retrieval,
- let users ask questions in natural language through a chat interface.

## Core Workflow

1. **Feedback ingestion**
   - Pull or receive raw feedback from connectors and uploads.
   - Preserve raw source payload when useful.
   - Normalize into a shared internal format.

2. **Theme extraction**
   - Identify recurring topics such as service, wait time, staff behavior, food quality, cleanliness, pricing, ambience, or safety.
   - Store both machine labels and human-readable summaries.

3. **Sentiment analysis**
   - Classify sentiment at item level.
   - Prefer simple labels first: positive, neutral, negative.
   - Optionally support aspect-level sentiment later.

4. **Semantic embeddings**
   - Generate embeddings server-side in Node/TypeScript.
   - Do not assume Python is required.
   - Embeddings should be created in backend routes, server actions, or async jobs.
   - Store vectors in Postgres with pgvector.

5. **Chat interface**
   - User asks questions like: "What are the top complaints?" or "How do customers feel about staff?"
   - System retrieves relevant feedback semantically.
   - LLM answers using retrieved evidence.

## Tech Assumptions

- **Frontend:** Next.js
- **Backend:** Next.js server routes / server actions
- **Language:** TypeScript
- **Database:** Postgres or Supabase Postgres
- **Vector storage:** pgvector
- **LLM access:** direct provider API calls are acceptable
- **AI SDK:** may use Vercel AI SDK for chat/streaming/tooling, but AI Gateway is optional
- **Embeddings:** can be generated directly through provider APIs without Python

## Important Architecture Decisions

- Keep the MVP simple.
- Prefer direct model API calls over extra infrastructure unless routing/governance is needed.
- Treat AI Gateway as optional, not mandatory.
- Run embedding generation on the server, never in the browser.
- Separate raw feedback records from derived analysis records.
- Design for async processing so ingestion does not block on heavy AI steps.

## Suggested Data Model

### feedback_items

- id
- tenant_id
- source
- source_item_id
- author_name
- rating
- text
- created_at
- metadata_json
- raw_payload_json

### feedback_analysis

- id
- feedback_item_id
- sentiment_label
- sentiment_score
- themes_json
- summary
- analyzed_at

### feedback_embeddings

- id
- feedback_item_id
- embedding
- model_name
- created_at

## Agent Behavior

When operating on this project, the AI should follow these rules:

- Always preserve the distinction between **raw data**, **derived analysis**, and **retrieval output**.
- Prefer pragmatic MVP decisions over premature complexity.
- Recommend TypeScript/Node-native approaches first because this project is built in Next.js.
- Do not assume Python pipelines unless explicitly requested for advanced ML work.
- When discussing semantic search, describe both embedding creation and vector retrieval.
- When suggesting architecture, prefer clear modules: ingestion, analysis, embeddings, retrieval, chat.
- Make output implementation-oriented, not just conceptual.
- Use schema-first thinking when suggesting backend changes.
- Use Exa web search for external sources or latest documentation when current references are needed.

## Coding Preferences

- Write examples in TypeScript by default.
- Prefer server-side examples for AI calls.
- Use clean, production-leaning folder structures.
- Keep dependencies minimal for MVP.
- Prefer async jobs/queues for embedding backfills and bulk analysis.
- **Never put UI code in `page.tsx`.** `page.tsx` is server-only with minimal layout (flex, flex-col, padding). All heavy UI logic lives in `src/features/<name>/components/`. `page.tsx` imports and composes feature components, nothing more.

## Non-Goals for MVP

- Custom model training
- Python-heavy NLP pipelines
- Multi-provider AI routing from day one
- Complex agent orchestration before core ingestion and retrieval work reliably

## Example Folder Structure

```txt
src/
  app/
    api/
      ingest/
      analyze/
      embeddings/
      chat/
  lib/
    ai/
    db/
    ingestion/
    analysis/
    retrieval/
  jobs/
  types/
```

## Good Default Responses

When the user asks implementation questions, bias toward answers like:

- "Do this in a Next.js server route or background job."
- "Store embeddings in pgvector."
- "Use direct provider API calls for MVP."
- "Keep ingestion, analysis, embeddings, and chat as separate modules."

## Example User Questions This Context Should Support

- Where should semantic embeddings happen in a Next.js app?
- Do we need Python for embeddings?
- Should we use Vercel AI Gateway or direct API calls?
- How should feedback ingestion and chat retrieval be structured?
- What schema should store reviews, analysis, and embeddings?

## Style of Assistance

- Be practical.
- Be architecture-aware.
- Prefer concrete implementation steps.
- Explain trade-offs simply.
- Avoid overengineering the first version.
