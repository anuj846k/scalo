# PRD: Community Discussion Import (Firecrawl)

## Problem Statement

Product teams hear useful customer voice in public discussions (Reddit, Hacker News, Product Hunt, and other threads), but Scalo only ingests structured review sources today (Google Reviews, Trustpilot, CSV). Those community comments never enter the workspace feedback corpus, so chat cannot retrieve or cite them. Users also should not be nudged to scrape Google/Trustpilot via a generic URL importer when dedicated connectors already exist.

## Solution

Add a **Community** connector: users paste public discussion URLs (many over time). Scalo uses Firecrawl to fetch page content, extracts **one Feedback Item per comment**, upserts by comment identity, embeds them, and makes them searchable in chat with clickable source links. Reddit, Hacker News, and Product Hunt are first-class (`source: community`). Other URLs are best-effort (`source: web`). Google Reviews and Trustpilot URLs are blocked with a toaster directing users to the dedicated connector.

## User Stories

1. As a workspace member, I want to open a Community connector from the connectors hub, so that I can import discussion feedback without leaving Scalo.
2. As a workspace member, I want to paste a Reddit thread URL, so that comments from that thread become Feedback Items in my Active Workspace.
3. As a workspace member, I want to paste a Hacker News thread URL, so that HN comments are ingested the same way.
4. As a workspace member, I want to paste a Product Hunt discussion URL, so that PH comments are ingested the same way.
5. As a workspace member, I want to paste an arbitrary public discussion URL, so that Scalo best-effort extracts comments even when the host is not first-class.
6. As a workspace member, I want to add many different thread URLs over time, so that I can build a corpus from multiple discussions.
7. As a workspace member, I want each pasted URL to become its own Connector Config, so that I can see and manage multiple community sources.
8. As a workspace member, I want importing to run in the background, so that long crawls do not freeze or time out the UI.
9. As a workspace member, I want to see import/sync status (pending, active, failed, last synced), so that I know whether a thread finished importing.
10. As a workspace member, I want to re-import / re-sync an existing thread URL, so that new comments are picked up without duplicating old ones.
11. As a workspace member, I want edited comment text to update on re-sync, so that my corpus stays current.
12. As a workspace member, I want each comment stored as its own Feedback Item, so that retrieval can surface precise snippets.
13. As a workspace member, I want each comment to keep a source link (permalink when available), so that chat answers are verifiable.
14. As a workspace member, I want chat to cite community comments with a clickable source link, so that I can open the original comment.
15. As a workspace member, I want the chat UI to show a citation chip/link when `sourceUrl` is present, so that I am not dependent on the model formatting markdown correctly.
16. As a workspace member, I want to ask questions like “what are Reddit users saying about onboarding?”, so that community voice is included in answers.
17. As a workspace member, I want to filter retrieval by `community` or `web`, so that I can separate first-class community imports from best-effort web imports.
18. As a workspace member, if I paste a Google Reviews URL, I want a toaster telling me to use the Google connector, so that I do not use a worse scraping path.
19. As a workspace member, if I paste a Trustpilot URL, I want a toaster telling me to use the Trustpilot connector, so that I use the dedicated integration.
20. As a workspace member, I want unsupported/non-discussion pages to fail clearly when extraction finds no comments, so that I am not left with silent empty imports.
21. As a workspace member, I want author names preserved when available, so that citations can name who said what.
22. As a workspace member, I want platform score/upvotes stored in metadata (not as star `rating`), so that dashboards are not polluted with invented 1–5 scores.
23. As a workspace member, I want community Feedback Items with null ratings still searchable in chat, so that missing stars do not hide community evidence.
24. As a workspace member, I want embeddings generated for ingested comments, so that semantic Retrieval works like other sources.
25. As a workspace admin, I want community imports scoped to the Active Workspace, so that data never leaks across tenants.
26. As a workspace member, I want deleted/empty/automod-only noise skipped when possible, so that the corpus stays useful.
27. As a workspace member, I want the original post included as a Feedback Item when it contains substantive text, so that the OP’s complaint/praise is not lost.
28. As a workspace member, I want connector titles derived from thread title/host, so that I can recognize configs in the hub.
29. As an MCP/tool user, I want `search_feedback` to return `sourceUrl` for community items, so that external agents can cite the same links.
30. As a developer, I want URL classification separated from crawling, so that Google/Trustpilot redirects never call Firecrawl.
31. As a developer, I want Deduplication on `(source, source_item_id)`, so that re-sync is safe.
32. As a developer, I want Firecrawl credentials server-only, so that API keys never ship to the browser.

## Implementation Decisions

- **Product bet:** Firecrawl powers **Community discussion import**, not a replacement for Google/Trustpilot review connectors.
- **Connector model:** Hybrid UX — paste URL to import; persist a **Connector Config** per thread so users can add many configs and re-sync later. No scheduled cron watching required for v1 (manual re-sync / re-import is enough).
- **Connector type:** `community` (and best-effort configs may still use the same connector type with source differentiation on Feedback Items).
- **Place ID reuse:** Store the **canonical thread URL** in Connector Config `placeId` (existing unique index on org + connector type + placeId prevents duplicate configs for the same URL).
- **Granularity:** One **Feedback Item** per comment (plus OP post body when substantive).
- **Sources:**
  - `community` for Reddit, Hacker News, Product Hunt
  - `web` for best-effort unknown hosts
  - Never ingest Google Reviews / Trustpilot via this path
- **URL gate:** Classify URL before crawl:
  - Google Reviews / maps review hosts → reject + toaster → dedicated connector
  - Trustpilot hosts → reject + toaster → dedicated connector
  - Reddit / HN / PH → first-class extract
  - Other → best-effort extract
- **Async Sync:** API authenticates, creates/finds Connector Config, enqueues Inngest event (same pattern as Google Reviews sync). Worker: Firecrawl fetch → LLM/structured extract comments → normalize → upsert → embed → update `lastSyncedAt` / status.
- **Deduplication:** Upsert on comment identity via `sourceItemId` (stable comment id, else canonical permalink). Update text when changed; insert new comments on re-sync.
- **Rating:** Always `null` on Feedback Items from this connector. Store platform score (Reddit ups, HN points, etc.) in `metadataJson` only.
- **Metadata (minimum):** `platform`, `thread_url`, comment permalink as the link used for citations, optional `score`, optional `parent_id`. **Reuse existing retrieval convention:** expose citation URL through `metadataJson.review_url` (today’s `searchFeedback` already maps that to `sourceUrl`), or teach retrieval to also read a community key — prefer one shared field so chat/MCP keep working.
- **Retrieval fix (required):** Current search applies `rating >= 1 AND rating <= 5`, which excludes `rating IS NULL`. Community/web items must remain retrievable (include null ratings unless the user explicitly filters by stars).
- **Chat citations:** Tool results already include `sourceUrl`. Update system prompt examples for community/web (“View on Reddit”, etc.). Add a light UI citation affordance/chip when `sourceUrl` is present (both model link + structured UI).
- **Source filters:** Extend chat tool / MCP source enums/docs to include `community` and `web`.
- **Modules (conceptual):** URL classifier; Firecrawl client wrapper; community comment extractor/normalizer; Inngest sync function; connect/import API; connectors hub entry + import UI; retrieval rating-null fix; prompt + citation UI polish.
- **Primary seam:** `normalizeCommunityExtraction(url, rawPageContent) → NormalizedFeedback[]` (or equivalent), with URL classification as a pure helper. Firecrawl/Inngest are adapters around that seam.
- **Env:** Server-side Firecrawl API key; do not commit secrets.
- **Domain language updates:** Extend Source vocabulary to include `community` and `web`; treat community thread URL as the Connector Config external identity (analogous to Place ID).

## Testing Decisions

- Prefer tests of **external behavior** at the highest seam: given a URL + fixture markdown/HTML (or fixture extraction JSON), assert normalized Feedback Items (text, author, source, sourceItemId, metadata link, rating null) and URL-gate outcomes.
- **Test the URL classifier:** Reddit/HN/PH → allow; Google/Trustpilot → dedicated-connector rejection; other → best-effort.
- **Test upsert identity:** same comment twice → one row; changed text → update; new comment → insert.
- **Test retrieval behavior:** feedback with `rating: null` and `source: community` is returned for unfiltered chat search; explicit star filters may still exclude nulls.
- **Do not** require live Firecrawl in unit tests; inject/fake crawl + extract outputs.
- **Prior art:** No existing `*.test.ts` / `*.spec.ts` suite in the repo — establish this seam as the first focused unit-test surface for ingestion, mirroring how CSV normalization is already isolated as a pure module.

## Out of Scope

- Scraping Google Reviews or Trustpilot with Firecrawl
- Instagram / Zendesk via Firecrawl (use future official APIs)
- Scheduled cron re-crawl of community threads (manual re-sync only in v1)
- Invented 1–5 star ratings from comment text
- Full redesign of chat citation UI beyond a simple source link/chip
- App Store connector (separate future bet)
- Help-center / knowledge-base crawl for policy grounding
- Exa integration
- Perfect extraction quality on every arbitrary website

## Further Notes

- Grilled decisions locked: community import; multiple thread configs; one item per comment; Reddit+HN+PH first-class + best-effort URLs; Google/Trustpilot blocked with toaster; sources `community`/`web`; upsert re-sync; null ratings + score in metadata; async Inngest; citations via tool `sourceUrl` + UI chip.
- Landing already markets “comments”; this feature fills that gap without overlapping existing review connectors.
- Firecrawl cost/latency: prefer async + practical caps later (max comments per thread) if fat threads blow credits; not required to block v1 if extraction is bounded in the prompt/schema.
- Proposed primary test seam: `normalizeCommunityExtraction` (URL classify → extracted comments → normalized feedback). Confirm before implementation if a different seam is preferred.
