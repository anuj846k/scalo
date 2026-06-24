---
version: alpha
name: Wise-design-analysis
description: An inspired interpretation of Wise's design language — a global money-transfer brand whose surface combines an unusually heavy near-black display sans (weight 900 at 64–126 px) with a vivid lime-green brand accent, sage-tinted surface neutrals, and rounded white cards on a pale green-tinted canvas; the whole system reads more like a Scandinavian fintech magazine than a bank.

colors:
  primary: '#0025f5'
  primary-foreground: '#ffffff'
  brand-50: '#e8f3ff'
  brand-100: '#d5e8ff'
  brand-200: '#b3d3ff'
  brand-300: '#85b6ff'
  brand-400: '#568cff'
  brand-500: '#2f62ff'
  brand-600: '#0c35ff'
  brand-700: '#0025f5'
  brand-800: '#0627cd'
  brand-900: '#102b9f'
  brand-950: '#0a175c'

typography:
  display-mega:
    fontFamily: Wise Sans, Inter, system-ui, -apple-system, sans-serif
    fontSize: 126px
    fontWeight: 900
    lineHeight: 107.1px
  display-xxl:
    fontFamily: Wise Sans, Inter, system-ui, sans-serif
    fontSize: 96px
    fontWeight: 900
    lineHeight: 81.6px
  display-xl:
    fontFamily: Wise Sans, Inter, system-ui, sans-serif
    fontSize: 64px
    fontWeight: 900
    lineHeight: 54.4px
  display-lg:
    fontFamily: Wise Sans, Inter, system-ui, sans-serif
    fontSize: 47px
    fontWeight: 400
    lineHeight: 70.5px
    letterSpacing: -0.108px
  display-md:
    fontFamily: Wise Sans, Inter, system-ui, sans-serif
    fontSize: 40px
    fontWeight: 900
    lineHeight: 34px
  display-sm:
    fontFamily: Inter, system-ui, sans-serif
    fontSize: 32px
    fontWeight: 600
    lineHeight: 38.4px
    letterSpacing: -0.96px
  display-xs:
    fontFamily: Inter, system-ui, sans-serif
    fontSize: 24px
    fontWeight: 600
    lineHeight: 31.2px
    letterSpacing: -0.48px
  body-lg:
    fontFamily: Inter, system-ui, sans-serif
    fontSize: 20px
    fontWeight: 400
    lineHeight: 30px
  body-md:
    fontFamily: Inter, system-ui, sans-serif
    fontSize: 16px
    fontWeight: 400
    lineHeight: 24px
  body-md-strong:
    fontFamily: Inter, system-ui, sans-serif
    fontSize: 16px
    fontWeight: 600
    lineHeight: 24px
  body-sm:
    fontFamily: Inter, system-ui, sans-serif
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
  body-sm-strong:
    fontFamily: Inter, system-ui, sans-serif
    fontSize: 14px
    fontWeight: 600
    lineHeight: 20px
  caption:
    fontFamily: Inter, system-ui, sans-serif
    fontSize: 12px
    fontWeight: 400
    lineHeight: 16px
  button-md:
    fontFamily: Inter, system-ui, sans-serif
    fontSize: 16px
    fontWeight: 600
    lineHeight: 24px

rounded:
  none: 0px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  pill: 9999px
  full: 9999px

spacing:
  xxs: 2px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  2xl: 32px
  3xl: 48px

components:
  nav-bar:
    backgroundColor: '{colors.canvas}'
    textColor: '{colors.ink}'
    typography: '{typography.body-sm-strong}'
    padding: '{spacing.md} {spacing.xl}'
  nav-link:
    textColor: '{colors.ink}'
    typography: '{typography.body-sm-strong}'
  button-primary:
    backgroundColor: '{colors.primary}'
    textColor: '{colors.on-primary}'
    typography: '{typography.button-md}'
    rounded: '{rounded.xl}'
    padding: '{spacing.md} {spacing.xl}'
  button-secondary:
    backgroundColor: '{colors.canvas-soft}'
    textColor: '{colors.ink}'
    typography: '{typography.button-md}'
    rounded: '{rounded.xl}'
    padding: '{spacing.md} {spacing.xl}'
  button-tertiary:
    backgroundColor: '{colors.canvas}'
    textColor: '{colors.ink}'
    borderColor: '{colors.ink}'
    typography: '{typography.button-md}'
    rounded: '{rounded.xl}'
    padding: '{spacing.md} {spacing.xl}'
  button-icon-circular:
    backgroundColor: '{colors.canvas}'
    textColor: '{colors.ink}'
    rounded: '{rounded.full}'
    padding: '{spacing.sm}'
  text-input:
    backgroundColor: '{colors.canvas}'
    textColor: '{colors.ink}'
    borderColor: '{colors.ink}'
    typography: '{typography.body-md}'
    rounded: '{rounded.md}'
    padding: '{spacing.md} {spacing.lg}'
  card-content:
    backgroundColor: '{colors.canvas}'
    textColor: '{colors.ink}'
    typography: '{typography.body-md}'
    rounded: '{rounded.xl}'
    padding: '{spacing.xl}'
  card-feature-sage:
    backgroundColor: '{colors.canvas-soft}'
    textColor: '{colors.ink}'
    typography: '{typography.body-md}'
    rounded: '{rounded.xl}'
    padding: '{spacing.xl}'
  card-feature-green:
    backgroundColor: '{colors.primary-pale}'
    textColor: '{colors.ink}'
    typography: '{typography.body-md}'
    rounded: '{rounded.xl}'
    padding: '{spacing.xl}'
  card-feature-dark:
    backgroundColor: '{colors.ink}'
    textColor: '{colors.primary}'
    typography: '{typography.body-md}'
    rounded: '{rounded.xl}'
    padding: '{spacing.xl}'
  hero-band:
    backgroundColor: '{colors.canvas-soft}'
    textColor: '{colors.ink}'
    typography: '{typography.display-mega}'
    padding: '{spacing.3xl} {spacing.xl}'
  hero-band-dark:
    backgroundColor: '{colors.ink}'
    textColor: '{colors.primary}'
    typography: '{typography.display-mega}'
    padding: '{spacing.3xl} {spacing.xl}'
  content-band:
    backgroundColor: '{colors.canvas}'
    textColor: '{colors.ink}'
    typography: '{typography.display-md}'
    padding: '{spacing.3xl} {spacing.xl}'
  currency-converter-card:
    backgroundColor: '{colors.canvas}'
    textColor: '{colors.ink}'
    borderColor: '{colors.ink}'
    typography: '{typography.body-md}'
    rounded: '{rounded.xl}'
    padding: '{spacing.xl}'
  badge-positive:
    backgroundColor: '{colors.primary-pale}'
    textColor: '{colors.positive-deep}'
    typography: '{typography.body-sm-strong}'
    rounded: '{rounded.pill}'
    padding: '{spacing.xs} {spacing.md}'
  badge-negative:
    backgroundColor: '{colors.negative-bg}'
    textColor: '{colors.on-primary}'
    typography: '{typography.body-sm-strong}'
    rounded: '{rounded.pill}'
    padding: '{spacing.xs} {spacing.md}'
  footer:
    backgroundColor: '{colors.ink}'
    textColor: '{colors.canvas-soft}'
    typography: '{typography.body-sm}'
    padding: '{spacing.3xl} {spacing.xl}'

  # ─── Examples (illustrative) — auto-derived; resolve any TO_FILL markers below ───
  ex-pricing-tier:
    description: 'Default Pricing tier card. Re-uses feature-card chrome with brand canvas-soft surface.'
    backgroundColor: '{colors.canvas-soft}'
    textColor: '{colors.ink}'
    borderColor: '{colors.mute}'
    rounded: '{rounded.xl}'
    padding: '{spacing.xl}'
  ex-pricing-tier-featured:
    description: 'Featured/highlighted tier — polarity-flipped surface (dark fill + light text in light mode, light fill + dark text in dark mode).'
    backgroundColor: '{colors.ink}'
    textColor: '{colors.on-primary}'
    rounded: '{rounded.xl}'
    padding: '{spacing.xl}'
  ex-product-selector:
    description: "What's Included summary card — re-purposed for SaaS / B2B verticals (NOT a literal product gallery)."
    backgroundColor: '{colors.canvas-soft}'
    rounded: '{rounded.xl}'
    padding: '{spacing.xl}'
  ex-cart-drawer:
    description: 'Subscription summary — re-purposed for SaaS / B2B (line items per add-on, not literal cart).'
    backgroundColor: '{colors.canvas}'
    rounded: '{rounded.xl}'
    padding: '{spacing.xl}'
    item-divider: '{colors.canvas-soft}'
  ex-app-shell-row:
    description: 'Sidebar nav row inside the App Shell example. Active state uses brand primary as the indicator.'
    backgroundColor: '{colors.canvas}'
    activeIndicator: '{colors.primary}'
    rounded: '{rounded.sm}'
    padding: '{spacing.md} {spacing.lg}'
  ex-data-table-cell:
    description: 'Default data-table th + td chrome. Header uses mono-caps eyebrow typography; body uses body-sm.'
    headerBackground: '{colors.canvas-soft}'
    headerTypography: '{typography.caption}'
    bodyTypography: '{typography.body-sm}'
    cellPadding: '{spacing.md} {spacing.lg}'
    rowBorder: '{colors.canvas-soft}'
  ex-auth-form-card:
    description: 'Sign-in / sign-up card. Re-uses feature-card chrome with text-input primitives inside.'
    backgroundColor: '{colors.canvas-soft}'
    rounded: '{rounded.xl}'
    padding: '{spacing.xl}'
  ex-modal-card:
    description: 'Modal dialog surface — same chrome as feature-card with elevated shadow.'
    backgroundColor: '{colors.canvas}'
    rounded: '{rounded.xl}'
    padding: '{spacing.xl}'
  ex-empty-state-card:
    description: 'Empty-state illustration frame.'
    backgroundColor: '{colors.canvas-soft}'
    rounded: '{rounded.xl}'
    padding: '{spacing.3xl}'
    captionTypography: '{typography.body-md}'
  ex-toast:
    description: 'Toast notification surface — feature-card shape + medium shadow.'
    backgroundColor: '{colors.canvas}'
    rounded: '{rounded.xl}'
    padding: '{spacing.md} {spacing.lg}'
    typography: '{typography.body-sm}'
---

# Overview

Murmur is a Customer Intelligence Layer for AI. Connect support tickets, reviews, surveys, and conversations once. Ask questions anywhere — ChatGPT, Claude, Cursor, Slack, or Murmur. Get evidence-backed answers about what customers actually want.

The visual language is inspired by modern editorial software rather than traditional dashboards. Large display typography creates confidence, generous spacing improves readability, and soft green accents highlight evidence and insights.

The platform should feel like a thinking partner — precise, transparent, and focused on surfacing what customers actually need.

## Key Characteristics

- Multi-source feedback ingestion (CSV, reviews, tickets, surveys)
- Normalized schema with embeddings for semantic retrieval
- AI-powered chat with evidence-backed citations
- Theme clustering, sentiment aggregation, trend detection
- Source transparency — every answer links back to original feedback
- Bold editorial typography
- Large rounded surfaces
- Soft violet accents for evidence and insights

---

# Product Positioning

## What Murmur Is

Murmur is a Customer Intelligence Platform that helps teams:

- Connect feedback sources in one place
- Ask natural-language questions about customer needs
- Get evidence-backed answers with citations
- Discover trends and themes automatically
- Share insights across tools (Slack, ChatGPT, etc.)

## What Murmur Is Not

- Not a helpdesk or ticketing system
- Not a survey tool
- Not a CRM
- Not a social media scheduler

---

# Core Problems Solved

## Fragmented Customer Feedback

Teams use:

- Zendesk/Intercom for tickets
- Google Play/App Store reviews
- Survey tools (Typeform, SurveyMonkey)
- Social comments (Instagram, Twitter)
- Sales call transcripts

Murmur connects everything into one searchable brain.

---

## No Semantic Retrieval

Instead of:

"Search by ticket ID or keyword"

Murmur lets you ask:

- "What are customers complaining about most?"
- "What feature requests increased this month?"
- "Why are users mentioning onboarding?"

---

## Evidence-Backed Answers

Every answer includes:

- Source attribution (which ticket, review, comment)
- Direct quotes
- Date and trend context
- Confidence indicators

---

## No Manual Analysis

Instead of:

- Reading 100s of tickets
- Building spreadsheets
- Writing weekly summary reports

Murmur generates:

- Theme clusters
- Sentiment trends
- Weekly summaries

---

# Architecture

## Stack

- **Frontend / API:** Next.js on Vercel
- **AI Layer:** Vercel AI SDK with tool calling (generateText / streamText)
- **Storage:** Supabase/Postgres with pgvector
- **Connectors:** Tools pattern — each integration is a tool with Zod schema + execute function

## Connectors (Tools)

```ts
googleReviewsTool — fetches reviews via DataForSEO Google Reviews API
instagramCommentsTool — fetches comments via HikerAPI
csvIngestTool — parses uploaded CSV and normalizes into schema
zendeskTool — pulls tickets via Zendesk API
analyzeFeedbackTool — runs clustering/sentiment on stored feedback
```

## Pipeline

1. **Ingest** — Pull feedback from connectors or CSV upload
2. **Normalize** — Map into `feedback_items` schema (source, text, rating, etc.)
3. **Embed** — Generate vector embedding per item via AI SDK (`embed`)
4. **Store** — Save in Postgres with pgvector
5. **Retrieve** — User question → embed query → vector similarity search
6. **Generate** — Feed retrieved context into LLM → answer with citations

## Schema

```sql
feedback_items
- id
- tenant_id
- source               -- csv | google_reviews | instagram_comments | zendesk
- source_item_id
- text
- rating
- author_name
- created_at
- metadata_json

feedback_embeddings
- id
- feedback_item_id
- embedding vector(...)
- created_at
```

---

# Phases

## Phase 1 (Days 1-15) — The Customer-Feedback Brain

- Multi-tenant architecture
- Auth
- CSV uploads
- One connector (Zendesk or Intercom)
- Normalized schema
- Embeddings
- Semantic retrieval

**Goal:** Ask a question and retrieve relevant feedback.

---

## Phase 2 (Days 16-25) — Chat Experience

Question → Retrieve evidence → Generate answer → Show citations

Examples:

- "What are customers complaining about most?"
- "What feature requests increased this month?"
- "Why are users mentioning onboarding?"

**Goal:** PM can get answers without opening tickets.

---

## Phase 3 (Days 26-35) — Insight Layer

- Theme clustering
- Sentiment aggregation
- Trend detection
- Weekly summaries

Murmur becomes **Customer Intelligence** instead of Semantic Search.

---

## Phase 4 (Days 36-40) — Design Partner Testing

- Get 2–3 companies
- Watch them use it
- Record every question they ask

This feedback is more valuable than another connector.

---

# Dashboard

The dashboard is the command center for customer intelligence.

## KPI Cards

- Total Feedback Items
- Sources Connected
- Positive / Negative Sentiment Ratio
- Emerging Themes

## Insight Section

- Recent Questions
- Trending Topics
- Sentiment Over Time

## Activity Section

- Latest Ingestion Activity
- Theme Changes
- Weekly Summary

---

# Chat Interface

The chat is the primary interaction model.

## Input

- Natural language question
- Optional source / date filters

## Output

- AI-generated answer
- Cited evidence (direct quotes with source links)
- Related feedback items
- Follow-up suggestions

## Example Questions

- "What features are users requesting for the mobile app?"
- "How did sentiment change after the last release?"
- "Show me all complaints about the checkout flow in the last 30 days."

---

# AI Features

## Semantic Retrieval

User question → embedding → vector similarity search → top-k feedback items.

---

## Evidence-Backed Answers

LLM generates answer from retrieved context. Every claim links to the original feedback source.

---

## Theme Clustering

Unsupervised clustering on feedback text to surface recurring topics.

---

## Sentiment Aggregation

Track positive / negative / neutral sentiment across sources over time.

---

## Trend Detection

Identify which themes are rising or falling week-over-week.

---

## Weekly Summaries

Auto-generated summaries of top themes, sentiment shifts, and notable feedback.

---

# Connectors (Phase 2+)

## Google Reviews

Pull business reviews via DataForSEO API. Fields: text, rating, author, date.

## Instagram Comments

Pull comments on business posts via HikerAPI. Fields: text, author, post link, date.

## CSV Upload

User uploads a CSV with columns: text, rating, author, date, source. File is parsed, validated, and ingested.

## Zendesk / Intercom

Pull tickets via API. Fields: subject, description, status, tags, date.

## Future

- App Store / Play Store reviews
- Survey tools (Typeform, SurveyMonkey)
- Slack threads
- Sales call transcripts

---

# Design Principles

## Do

- Prioritize evidence — every answer needs a source
- Make citations visible and clickable
- Show trend context (is this improving or getting worse?)
- Keep the chat interface clean and fast
- Surface insights without requiring setup

## Don't

- Show answers without citations
- Hide which sources the answer came from
- Overload the chat with unnecessary UI
- Make users dig for evidence
- Require SQL or query languages

---

# Brand Personality

Murmur should feel:

- Intelligent
- Precise
- Transparent
- Insightful
- Calm
- Trustworthy

The experience should feel like having a customer research analyst on your team — one who has read every ticket, review, and comment and can answer any question with receipts.
