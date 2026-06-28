# Murmur MVP Testing Checklist

## Pre-flight Setup

- [ ] `npm run dev` — Next.js on `:3000`
- [ ] `npx inngest-cli@latest dev` — Inngest on `:8288`
- [ ] `ngrok http 3000` — get public URL, set `APP_BASE_URL=https://xxx.ngrok-free.app` in `.env`
- [ ] `curl http://localhost:3000/api/inngest` — verify `function_count: 3`

---

## 1. Google Reviews — Full E2E

### 1.1 Connect

- [ ] Go to `/dashboard/connectors`
- [ ] Verify Google Reviews card shows "0 connected"
- [ ] Click **Configure** → `/dashboard/connectors/google-reviews`
- [ ] Paste: `https://www.google.com/maps/place/E-O-D+Adventure+Park/@28.6133274,77.296256,17z`
- [ ] Click **Connect**
- [ ] Toast: "Reviews are being synced."

### 1.2 Inngest Dashboard (`localhost:8288`)

- [ ] Find `sync-google-reviews` run
- [ ] Verify steps execute in order: `load-config` → `resolve-location` → `create-task` → `wait-for-dataforseo` (suspends) → `fetch-results` → `update-resolved-place-id` → `upsert-reviews` → `generate-embeddings` → `store-embeddings` → `update-sync-timestamp`
- [ ] Each step shows green checkmark

### 1.3 Verify DB

- [ ] `connector_configs`: connectorType = `google_reviews`, placeId starts with `ChIJ...`, status = `active`, lastSyncedAt populated
- [ ] `feedback_items`: new rows with source = `google_reviews`, sourceItemId populated, connectorConfigId = config id
- [ ] `feedback_embeddings`: rows linked to new feedback_items via feedbackItemId

### 1.4 Place ID auto-upgrade

- [ ] First connect with `name:` prefix — config placeId starts as `name:E-O-D...`
- [ ] After sync completes, placeId upgraded to `ChIJSf3JZqPkDDkR9bxeC00F5wQ`
- [ ] `locationCoordinate` cleared after upgrade
- [ ] `title` and `subTitle` populated from DataForSEO response

### 1.5 Reconnect same business

- [ ] Try connecting same URL again → 409 "This business is already connected"

### 1.6 Disconnect

- [ ] Click Disconnect on the connected card
- [ ] Toast "Disconnected"
- [ ] Config removed from `/api/connectors` response

---

## 2. Google Reviews — Second Business

### 2.1 Connect

- [ ] Connect a second Google Maps URL (different business)
- [ ] Verify both cards show on the page with map iframes
- [ ] Hub page shows "2 connected"

### 2.2 Chat tool — placeId filter

- [ ] Ask: "show reviews from E-O-D Adventure Park"
- [ ] LLM calls `searchFeedback` with `placeId: "ChIJSf3JZqPkDDkR9bxeC00F5wQ"`
- [ ] Results show ONLY that business's reviews
- [ ] `businessTitle` field populated per result

---

## 3. Trustpilot — Full E2E

### 3.1 Connect

- [ ] Go to `/dashboard/connectors`
- [ ] Verify Trustpilot card shows "0 connected"
- [ ] Click **Configure** → `trustpilot` page
- [ ] Paste: `https://www.trustpilot.com/review/www.flipkart.com`
- [ ] Click **Connect**
- [ ] Toast: "Reviews are being synced."

### 3.2 Inngest Dashboard

- [ ] Find `sync-trustpilot` run
- [ ] Verify NO `resolve-location` step (Trustpilot skips this)
- [ ] Steps: `load-config` → `create-task` → `wait-for-dataforseo` → `fetch-results` → `update-business-info` → `upsert-reviews` → `generate-embeddings` → `store-embeddings` → `update-sync-timestamp`
- [ ] All steps green

### 3.3 Verify DB

- [ ] `connector_configs`: connectorType = `trustpilot`, placeId = domain (e.g. `www.flipkart.com`)
- [ ] `title` and `subTitle` populated (business name + address from Trustpilot)
- [ ] `feedback_items`: source = `trustpilot`, sourceItemId = Trustpilot review URL
- [ ] `metadata_json` contains: `review_url`, `verified`, `language`, `user_profile`
- [ ] `feedback_embeddings` linked

### 3.4 Domain extraction

- [ ] Test with: `www.flipkart.com` (raw domain) → works
- [ ] Test with: `https://www.trustpilot.com/review/www.flipkart.com` (full URL) → works
- [ ] Test with: `https://uk.trustpilot.com/review/www.wise.com` → works
- [ ] Test with: empty string → error
- [ ] Test with: `not-a-domain` → error or rejects

### 3.5 Reconnect / Disconnect

- [ ] Same domain → 409 "already connected"
- [ ] Disconnect → config removed

---

## 4. CSV Upload

### 4.1 Upload

- [ ] Go to `/dashboard/connectors/upload` (or wherever CSV upload lives)
- [ ] Upload a CSV with columns: `text`, `rating`, `author_name`, `created_at`
- [ ] Verify toast/confirmation

### 4.2 Verify DB

- [ ] `feedback_items`: source = `csv`, sourceItemId populated (or null if not in CSV)
- [ ] `feedback_embeddings`: generated for CSV items

---

## 5. Chat — With All 3 Sources

### 5.1 Generic search

- [ ] Go to `/dashboard/chat`
- [ ] Ask: "show me recent reviews"
- [ ] LLM calls `searchFeedback` with `query: "recent"` (no source filter)
- [ ] Results include ALL sources (google_reviews, trustpilot, csv)
- [ ] Each result shows `source` label
- [ ] Each result has a clickable `sourceUrl` link

### 5.2 Source-specific search

- [ ] Ask: "show only Trustpilot reviews"
- [ ] LLM calls `searchFeedback` with `source: "trustpilot"`
- [ ] Results show ONLY Trustpilot reviews

- [ ] Ask: "what are Google review complaints?"
- [ ] LLM calls with `source: "google_reviews"`

- [ ] Ask: "show csv feedback"
- [ ] LLM calls with `source: "csv"`

### 5.3 Rating filter

- [ ] Ask: "show positive reviews" → `ratingMin: 4`
- [ ] Ask: "what are the complaints?" → `ratingMax: 2`
- [ ] Ask: "show neutral reviews" → `ratingMin: 3, ratingMax: 3`

### 5.4 Pagination

- [ ] Ask: "show all reviews" — verify `hasMore` in response
- [ ] Ask: "show more" — LLM calls again with `page: 2`
- [ ] Verify results change between pages

### 5.5 Combined filters

- [ ] Ask: "show negative Trustpilot reviews" → `source: "trustpilot", ratingMax: 2`
- [ ] Ask: "positive Google reviews from E-O-D" → `source: "google_reviews", placeId: "...", ratingMin: 4`

### 5.6 Citations

- [ ] Each cited review has: quoted text, rating, author, date
- [ ] Google review has `[View on Google](sourceUrl)` link
- [ ] Trustpilot review has clickable URL in `sourceUrl`
- [ ] Links open the actual review page

### 5.7 Business grouping

- [ ] Ask: "show reviews from all connected businesses"
- [ ] LLM groups results by `businessTitle` when multiple businesses exist
- [ ] Single business results show without grouping header

### 5.8 Chat persistence

- [ ] Refresh the page — chat history persists
- [ ] Open sidebar — shows chat titles
- [ ] Click old chat — loads full message history
- [ ] Delete a chat — removed from sidebar

### 5.9 Title generation

- [ ] Start new chat, ask a question
- [ ] Sidebar shows generated title (not "New chat") after completion
- [ ] Title is 2-5 words summarizing the question

---

## 6. Sync Edge Cases

### 6.1 Duplicate reviews (UPSERT)

- [ ] Reconnect same source (disconnect, reconnect)
- [ ] No duplicate feedback_items — existing review updated instead
- [ ] No duplicate embeddings

### 6.2 Pingback timeout

- [ ] Kill ngrok during pending sync
- [ ] Inngest shows `mark-sync-failed` step after 2h timeout
- [ ] Config `updatedAt` is updated, `lastSyncedAt` is NOT updated

### 6.3 Empty results

- [ ] Connect a Trustpilot domain with no reviews
- [ ] Inngest shows `update-sync-timestamp-empty` step
- [ ] `lastSyncedAt` updated even with 0 results

### 6.4 Inactive config

- [ ] Set config status to `inactive` in DB
- [ ] Trigger sync — function returns early (status !== 'active')
- [ ] No DataForSEO API calls wasted

---

## 7. API Routes

### 7.1 `GET /api/connectors`

- [ ] Returns array with all active configs
- [ ] Includes: id, connectorType, placeId, title, subTitle, status, lastSyncedAt

### 7.2 `DELETE /api/connectors/[id]`

- [ ] Valid ID → 200, config deleted
- [ ] Invalid ID → 404
- [ ] Unauthenticated → 401
- [ ] Feedback items NOT cascade-deleted (preserved for history)

### 7.3 `POST /api/connectors/google-reviews/connect`

- [ ] Valid Maps URL → 200, config created, event fired
- [ ] Short URL (goo.gl/maps) → auto-resolved
- [ ] Duplicate → 409
- [ ] Invalid URL → 400

### 7.4 `POST /api/connectors/trustpilot/connect`

- [ ] Valid Trustpilot URL → 200
- [ ] Raw domain → 200
- [ ] Duplicate → 409
- [ ] Invalid input → 400

### 7.5 Pingback routes

- [ ] `GET /api/connectors/google-reviews/pingback?id=xxx` → sends `dataforseo.task-completed`
- [ ] `GET /api/connectors/trustpilot/pingback?id=xxx` → sends `dataforseo.task-completed`
- [ ] No `?id=` param → still returns 200 (no crash)

---

## 8. Inngest Cron

### 8.1 Daily sync (production only)

- [ ] Set `NODE_ENV=production` (or trigger `google-reviews.sync-all`)
- [ ] Verify ALL active Google + Trustpilot configs get synced
- [ ] Each config gets its own `sync-google-reviews` or `sync-trustpilot` run
- [ ] Fan-out log shows `syncedConfigs` count

---

## 9. Embeds & pgvector

### 9.1 Vector queries work

- [ ] Chat asks semantic question: "what do people think about staff behavior?"
- [ ] `searchFeedback` uses semantic path (not generic)
- [ ] `e.embedding <=>` cosine distance used in ORDER BY
- [ ] `relevance` score between 0-100

### 9.2 Embedding dimensions

- [ ] All embeddings are 768-dimensional (gemini-embedding-001)
- [ ] `feedback_embeddings.embedding` column type: `vector(768)`

---

## 10. Prod Readiness Check

- [ ] `NODE_ENV=production` set for full depth (4490 Google, 200 Trustpilot)
- [ ] `DATAFORSEO_LOGIN` and `DATAFORSEO_PASSWORD` valid + funded
- [ ] `APP_BASE_URL` set to production domain (not localhost)
- [ ] Pingback URL reachable from DataForSEO servers
- [ ] `DATABASE_URL` points to production Supabase/Neon
- [ ] `INNGEST_EVENT_KEY` set (not needed in dev/self-hosted)
- [ ] Rate limits respected: Trustpilot 30/min, Google 2000/min
