---
version: alpha
name: Wise-design-analysis
description: An inspired interpretation of Wise's design language — a global money-transfer brand whose surface combines an unusually heavy near-black display sans (weight 900 at 64–126 px) with a vivid lime-green brand accent, sage-tinted surface neutrals, and rounded white cards on a pale green-tinted canvas; the whole system reads more like a Scandinavian fintech magazine than a bank.

colors:
  primary: '#9fe870'
  on-primary: '#0e0f0c'
  primary-active: '#cdffad'
  primary-neutral: '#c5edab'
  primary-pale: '#e2f6d5'
  ink: '#0e0f0c'
  ink-deep: '#163300'
  body: '#454745'
  mute: '#868685'
  canvas: '#ffffff'
  canvas-soft: '#e8ebe6'
  positive: '#2ead4b'
  positive-deep: '#054d28'
  warning: '#ffd11a'
  warning-deep: '#b86700'
  warning-content: '#4a3b1c'
  negative: '#d03238'
  negative-deep: '#a72027'
  negative-darkest: '#a7000d'
  negative-bg: '#320707'
  accent-orange: '#ffc091'
  accent-cyan: '#38c8ff'

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

Scalo is an AI-powered creator outreach platform built for influencer agencies, UGC agencies, talent managers, and brands that run creator partnerships at scale.

Today, most creator outreach is managed through spreadsheets, Notion boards, Airtable databases, and manual DMs. Teams struggle to track who was contacted, who replied, who requires follow-up, and which creators converted into partnerships.

Scalo centralizes the entire workflow.

Teams can import creators, organize campaigns, generate personalized outreach with AI, classify responses, manage follow-ups, and track campaign performance from a single dashboard.

The visual language is inspired by modern editorial software rather than traditional CRMs. Large display typography creates confidence, generous spacing improves readability, and soft green accents highlight actions and opportunities.

The platform should feel operational, modern, and focused on helping teams scale creator relationships.

## Key Characteristics

- AI-powered creator outreach workflow
- Centralized creator CRM
- Campaign-first experience
- Clear outreach pipeline management
- Personalized messaging at scale
- Analytics and performance visibility
- Bold editorial typography
- Large rounded surfaces
- Soft green accents for actions and success states
- High information density without visual clutter

---

# Product Positioning

## What Scalo Is

Scalo is a Creator Outreach CRM that helps teams:

- Manage creators
- Run outreach campaigns
- Generate personalized messages
- Track responses
- Manage follow-ups
- Measure campaign performance

## What Scalo Is Not

- Not an influencer marketplace
- Not a creator discovery platform
- Not a talent management platform
- Not a social media scheduling tool

---

# Core Problems Solved

## No Creator CRM

Most teams use:

- Google Sheets
- Notion
- Airtable

Scalo provides:

- Creator database
- Outreach history
- Campaign assignments
- Relationship tracking

---

## Personalization At Scale

Instead of:

"Hey, loved your content"

Scalo generates personalized outreach using:

- Creator bio
- Creator niche
- Campaign context
- Custom prompts

---

## Follow-Up Management

Scalo helps teams track:

- Contacted creators
- Pending responses
- Follow-up schedules
- High-intent creators

---

## Reporting

Agencies can instantly see:

- Reply rates
- Campaign performance
- Interested creators
- Conversion metrics

---

# Dashboard

The dashboard is the operational center of the platform.

## KPI Cards

- Total Creators
- Active Campaigns
- Reply Rate
- Interested Creators

## Performance Section

- Campaign Analytics
- Outreach Trends
- Response Activity

## Activity Section

- Recent Creator Activity
- Follow-Up Queue
- Recent Replies

---

# Creator CRM

Every creator profile contains:

## Creator Information

- Username
- Platform
- Followers
- Engagement Rate
- Bio

## Internal Information

- Notes
- Tags
- Campaign Assignment

## Outreach Information

- Current Status
- Message History
- AI Summary
- Last Activity

---

# Campaigns

Campaigns are the core operational unit.

Each campaign contains:

- Campaign Details
- Creator List
- Templates
- Analytics
- Pipeline

Metrics include:

- Creators Added
- Outreach Sent
- Replies Received
- Interested Creators
- Conversion Rate

---

# Outreach Pipeline

Stages:

1. NOT_CONTACTED
2. CONTACTED
3. REPLIED
4. INTERESTED
5. NEGOTIATING
6. CLOSED

The pipeline should be visible throughout the product.

---

# AI Features

## Message Personalization

Inputs:

- Creator Bio
- Niche
- Campaign Context

Output:

Personalized outreach message.

---

## Reply Classification

Categories:

- Interested
- Not Interested
- Follow-Up Needed
- Pricing Discussion

---

## Conversation Summary

Generate concise summaries of creator conversations.

Example:

"Creator is interested and quoted ₹20,000 per post. Awaiting approval."

---

# Analytics

Key Metrics:

- Total Creators
- Active Campaigns
- Outreach Volume
- Reply Rate
- Interested Rate
- Conversion Rate
- Top Campaigns
- Top Templates

---

# Design Principles

## Do

- Prioritize clarity
- Highlight actions with primary green
- Make metrics visible
- Reduce operational friction
- Keep workflows simple

## Don't

- Add unnecessary complexity
- Hide important metrics
- Overload screens with charts
- Introduce extra accent colors
- Make workflows feel like spreadsheets

---

# Brand Personality

Scalo should feel:

- Modern
- Operational
- Data-driven
- AI-native
- Efficient
- Professional

The experience should feel like a premium creator operations platform rather than a traditional CRM.