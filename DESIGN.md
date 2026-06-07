---
version: alpha
name: Scalo-Product-and-Design
description: Scalo is an AI-native advertising platform that replaces the traditional marketing agency model for growing brands. This document contains the core product definition for Scalo, as well as the underlying design system UI tokens (Mintlify aesthetic) used for the platform's presentation.

colors:
  primary: "#0a0a0a"
  on-primary: "#ffffff"
  brand-green: "#00d4a4"
  brand-green-deep: "#00b48a"
  brand-green-soft: "#7cebcb"
  brand-tag: "#3772cf"
  brand-warn: "#c37d0d"
  brand-annotate: "#1ba673"
  brand-error: "#d45656"
  brand-cursor: "#888888"
  hero-sky-from: "#87a8c8"
  hero-sky-to: "#f5e9d8"
  hero-dark-from: "#1a3d4a"
  hero-dark-to: "#2d5a4f"
  testimonial-orange: "#f55a3c"
  testimonial-orange-deep: "#cc3a1f"
  canvas: "#ffffff"
  surface: "#f7f7f7"
  surface-soft: "#fafafa"
  surface-code: "#1c1c1e"
  hairline: "#e5e5e5"
  hairline-soft: "#ededed"
  ink: "#0a0a0a"
  charcoal: "#1c1c1e"
  slate: "#3a3a3c"
  steel: "#5a5a5c"
  stone: "#888888"
  muted: "#a8a8aa"

typography:
  hero-display:
    fontFamily: Inter
    fontSize: 72px
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: -2px
  display-lg:
    fontFamily: Inter
    fontSize: 56px
    fontWeight: 600
    lineHeight: 1.10
    letterSpacing: -1.5px
  heading-1:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: 600
    lineHeight: 1.10
    letterSpacing: -1px
  heading-2:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: 600
    lineHeight: 1.20
    letterSpacing: -0.5px
  heading-3:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: 600
    lineHeight: 1.25
  heading-4:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: 600
    lineHeight: 1.30
  heading-5:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.40
  subtitle:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.50
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.50
  body-md-medium:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.50
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.50
  body-sm-medium:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.50
  caption:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.40
  caption-bold:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: 600
    lineHeight: 1.40
  micro:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.40
  micro-uppercase:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: 600
    lineHeight: 1.40
    letterSpacing: 0.5px
  button-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.30
  code-md:
    fontFamily: Geist Mono
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.50
  code-sm:
    fontFamily: Geist Mono
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.40
  code-inline:
    fontFamily: Geist Mono
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.30

rounded:
  xs: 4px
  sm: 6px
  md: 8px
  lg: 12px
  xl: 16px
  xxl: 24px
  full: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 20px
  xl: 24px
  xxl: 32px
  xxxl: 40px
  section-sm: 48px
  section: 64px
  section-lg: 96px
  hero: 120px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: "10px 20px"
  button-primary-pressed:
    backgroundColor: "{colors.charcoal}"
    textColor: "{colors.on-primary}"
  button-primary-disabled:
    backgroundColor: "{colors.hairline}"
    textColor: "{colors.muted}"
  button-accent-green:
    backgroundColor: "{colors.brand-green}"
    textColor: "{colors.primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: "10px 20px"
  button-on-dark:
    backgroundColor: "{colors.on-dark}"
    textColor: "{colors.primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: "10px 20px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: "10px 20px"
    border: "1px solid {colors.hairline}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
  button-link:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm-medium}"
    padding: "0"
  button-icon-circular:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    size: 32px
    border: "1px solid {colors.hairline}"
  card-base:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
    border: "1px solid {colors.hairline}"
  card-feature:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xxl}"
  card-help:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
    border: "1px solid {colors.hairline}"
  card-startup-perk:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
    border: "1px solid {colors.hairline}"
  pricing-card:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xxl}"
    border: "1px solid {colors.hairline}"
  pricing-card-featured:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xxl}"
    border: "2px solid {colors.brand-green}"
    shadow: "rgba(0, 212, 164, 0.08) 0px 8px 24px"
  testimonial-card-feature:
    backgroundColor: "{colors.testimonial-orange}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.lg}"
    padding: "{spacing.section}"
  testimonial-card-quote:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xxl}"
    border: "1px solid {colors.hairline}"
  text-input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm} {spacing.md}"
    border: "1px solid {colors.hairline}"
    height: 40px
  text-input-focused:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    border: "2px solid {colors.brand-green}"
  search-pill:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.steel}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: "{spacing.xs} {spacing.md}"
    height: 36px
    border: "1px solid {colors.hairline}"
  segmented-tab:
    backgroundColor: "transparent"
    textColor: "{colors.steel}"
    typography: "{typography.body-sm-medium}"
    padding: "{spacing.sm} {spacing.md}"
    border: "0 0 2px transparent solid"
  segmented-tab-active:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm-medium}"
    border: "0 0 2px {colors.ink} solid"
  pill-tab:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.steel}"
    typography: "{typography.body-sm-medium}"
    rounded: "{rounded.full}"
    padding: "8px 16px"
    border: "1px solid {colors.hairline}"
  pill-tab-active:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.full}"
    border: "1px solid {colors.primary}"
  toggle-monthly-yearly:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    padding: "4px"
  badge-discount:
    backgroundColor: "{colors.brand-green}"
    textColor: "{colors.primary}"
    typography: "{typography.caption-bold}"
    rounded: "{rounded.full}"
    padding: "2px 8px"
  badge-required:
    backgroundColor: "{colors.brand-error}"
    textColor: "{colors.on-dark}"
    typography: "{typography.micro-uppercase}"
    rounded: "{rounded.sm}"
    padding: "2px 6px"
  badge-type:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.steel}"
    typography: "{typography.code-sm}"
    rounded: "{rounded.sm}"
    padding: "2px 6px"
  badge-tag:
    backgroundColor: "rgba(55, 114, 207, 0.15)"
    textColor: "{colors.brand-tag}"
    typography: "{typography.caption-bold}"
    rounded: "{rounded.sm}"
    padding: "2px 8px"
  promo-banner:
    backgroundColor: "{colors.ink}"
    textColor: "#ffffff"
    typography: "{typography.body-sm-medium}"
    padding: "{spacing.sm} {spacing.md}"
  code-block:
    backgroundColor: "{colors.surface-code}"
    textColor: "{colors.on-dark}"
    typography: "{typography.code-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
  code-block-header:
    backgroundColor: "{colors.surface-code}"
    textColor: "{colors.on-dark-muted}"
    typography: "{typography.caption}"
    padding: "{spacing.xs} {spacing.md}"
    border: "0 0 1px {colors.hairline-dark} solid"
  code-inline:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.charcoal}"
    typography: "{typography.code-inline}"
    rounded: "{rounded.xs}"
    padding: "2px 6px"
    border: "1px solid {colors.hairline}"
  property-row:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    padding: "{spacing.md} 0"
    border: "0 0 1px {colors.hairline-soft} solid"
  feature-comparison-table:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    border: "1px solid {colors.hairline}"
  feature-comparison-row:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    padding: "{spacing.md} {spacing.lg}"
    border: "0 0 1px {colors.hairline-soft} solid"
  sidebar-nav-item:
    backgroundColor: "transparent"
    textColor: "{colors.steel}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.sm}"
    padding: "{spacing.xs} {spacing.md}"
  sidebar-nav-item-active:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm-medium}"
  sidebar-section-header:
    backgroundColor: "transparent"
    textColor: "{colors.steel}"
    typography: "{typography.micro-uppercase}"
    padding: "{spacing.md} {spacing.md} {spacing.xs}"
  doc-toc-item:
    backgroundColor: "transparent"
    textColor: "{colors.steel}"
    typography: "{typography.body-sm}"
    padding: "{spacing.xxs} 0"
  doc-toc-item-active:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm-medium}"
  copy-code-button:
    backgroundColor: "transparent"
    textColor: "{colors.on-dark-muted}"
    typography: "{typography.caption}"
    rounded: "{rounded.sm}"
    padding: "{spacing.xxs} {spacing.xs}"
    border: "1px solid {colors.hairline-dark}"
  hero-band-sky:
    backgroundColor: "{colors.hero-sky-from}"
    textColor: "{colors.ink}"
    rounded: "0"
    padding: "{spacing.hero}"
  hero-product-mockup:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.lg}"
    padding: "0"
    border: "1px solid {colors.hairline-soft}"
    shadow: "rgba(0, 0, 0, 0.12) 0px 24px 48px -8px"
  logo-wall-item:
    backgroundColor: "transparent"
    textColor: "{colors.steel}"
    typography: "{typography.body-md-medium}"
    padding: "{spacing.lg}"
  faq-accordion-item:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.md}"
    padding: "{spacing.xl}"
    border: "1px solid {colors.hairline-soft}"
  footer-region:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.steel}"
    typography: "{typography.body-sm}"
    padding: "{spacing.section} {spacing.xxl}"
    border: "1px solid {colors.hairline}"
  footer-link:
    backgroundColor: "transparent"
    textColor: "{colors.steel}"
    typography: "{typography.body-sm}"
    padding: "{spacing.xxs} 0"
  startup-program-card:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xxl}"
    border: "1px solid {colors.hairline}"
  founder-quote-card:
    backgroundColor: "{colors.testimonial-orange}"
    textColor: "#ffffff"
    rounded: "{rounded.lg}"
    padding: "{spacing.xxl}"
  auth-split-panel:
    layout: "2-column 50/50 at desktop; stacked (form on top) at mobile"
    left-panel:
      backgroundColor: "{colors.surface-soft}"
      border-right: "1px solid {colors.hairline}"
      padding: "{spacing.section-lg}"
      content: "Brand illustration, product tagline, trust signals"
    right-panel:
      backgroundColor: "{colors.canvas}"
      padding: "{spacing.section} {spacing.xxl}"
      content: "Form heading, input fields, primary CTA button, secondary links"
  auth-form-card:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.xl}"
    padding: "{spacing.xxl}"
    border: "1px solid {colors.hairline}"
    shadow: "rgba(0, 0, 0, 0.04) 0px 4px 16px"
    maxWidth: "440px"
---

# Part 1: Product Definition — Scalo

## 1. What Scalo Is
Scalo is an AI-native advertising platform that replaces the traditional marketing agency model for growing brands. It takes a brand from a simple campaign brief all the way to live, optimised ads running across every major platform — with no agency, no manual design work, and no slow human reaction time.

Scalo is not just another ad scheduling tool. It is an autonomous AI marketing partner that thinks, creates, posts, learns, and adapts — continuously — on behalf of every brand that uses it. The more brands use Scalo, the smarter the entire platform becomes, because every campaign's performance data feeds a shared intelligence layer that benefits all clients.

**In one sentence:** Scalo is the AI CMO your brand cannot afford to hire — available from day one, working 24/7, getting smarter with every impression.

## 2. The Problem We Are Solving
Running effective advertising campaigns today is broken for small and mid-size brands. The current model forces them to choose between three bad options:

| Option | What It Costs | What's Wrong With It |
|---|---|---|
| **Hire a marketing agency** | 20–40% of total monthly ad spend | Expensive, slow to react, manual execution, agency incentives don't always align with brand performance |
| **Do it in-house** | Salaries of 2–4 marketing staff | Requires expertise across creative, strategy, and platform operations simultaneously — rare and costly to staff |
| **Use existing tools** | Subscription fees + still manual | Existing platforms (Meta Ads Manager, Google Ads) require deep expertise and still demand significant human time for creative and decisions |

The four core pains Scalo addresses:
- **PAIN 1 — The Cost Drain:** Brands pay 20–40% of their marketing budget just to have humans place and monitor ads. A brand spending ₹5 lakhs/month pays up to ₹2 lakhs/month purely in agency fees — before a single rupee reaches an actual customer.
- **PAIN 2 — The Speed Problem:** When an ad underperforms or causes brand damage, human agencies take hours or days to react. By the time a decision is made, budget has been wasted and in severe cases, brand damage has already spread.
- **PAIN 3 — The Creative Bottleneck:** Coming up with ad variations, briefing designers, reviewing iterations, and approving creatives is a slow, expensive, back-and-forth process that limits how many ideas a brand can test.
- **PAIN 4 — The Fragmentation Tax:** Running campaigns on Meta, Google, TikTok, and LinkedIn requires separate logins, separate dashboards, separate reporting, and separate expertise — multiplying complexity for every platform added.

## 3. Who It Is For

### 3.1 Primary Target Customer
Scalo is built for brand owners and marketing managers at small-to-mid-size companies who are currently spending between ₹1 lakh and ₹25 lakhs per month on digital advertising and are either using an agency or struggling to manage campaigns in-house effectively.

| Customer Type | Profile |
|---|---|
| **D2C Brand Founder** | Running a direct-to-consumer brand on Shopify or similar. Spending ₹2–10L/month on Meta and Google Ads. Has a small team and no dedicated marketing hire. Feels like the agency is expensive and slow to respond to performance changes. |
| **Marketing Manager at SMB** | In-house marketing lead at a company with 20–200 employees. Manages multiple platforms, reports to a founder or CMO, has limited budget for agency fees, and spends too much time on manual campaign management. |
| **Digital Marketing Agency** | Runs ad campaigns on behalf of 5–30 client brands. Spends enormous time on manual tasks across clients. Would use Scalo as a white-label back-end to service more clients with less headcount, improving margins significantly. |
| **Growth-Stage Startup** | Series A or B company scaling paid acquisition aggressively. Has a marketing team but needs to move faster than traditional creative and campaign review cycles allow. Values speed-to-test over perfection. |

### 3.2 Who It Is NOT For (Yet)
- Enterprise brands with large in-house teams and complex brand governance — they have compliance and approval requirements Scalo does not support in V1.
- Brands with zero digital advertising experience who need strategic consulting alongside execution — Scalo assumes the user knows their business objective.
- Companies in highly regulated industries (pharma, finance, legal) where ad content requires legal pre-approval before posting.

## 4. What Scalo Does — Core Capabilities

### 4.1 The AI CMO Engine
At the heart of Scalo is what we call the AI CMO — an autonomous intelligence layer that takes a brand's objective and budget as input and manages everything from that point forward. It does not just assist a human marketer. It acts as the marketer, with a human in oversight rather than execution.

A brand interacts with Scalo by providing:
- Campaign objective (e.g. generate leads, drive product purchases, build brand awareness)
- Monthly or campaign budget
- Target audience description in plain language
- Brand guidelines — logo, colours, tone of voice, and any content restrictions

From these inputs, Scalo does everything else.

### 4.2 Capability Map by Product Version

**Version 1 — Unified Ad Management (The Foundation)**
- Campaign creation across Meta Ads and Google Ads from a single interface
- Unified budget and bid management — set one budget, Scalo allocates it across platforms based on performance
- Cross-platform analytics dashboard — CTR, ROAS, CPA, CPM in one view, not separate platform logins
- Campaign Health Score — a proprietary 0–100 score grading each campaign's overall performance
- Basic A/B testing — Scalo creates and tests multiple ad copy and creative variants automatically
- Agency white-label mode — agencies can run Scalo under their own brand for their clients
- Role-based access — Campaign Manager, Analyst, Read-Only roles for team collaboration

**Version 2 — Autonomous Intelligence Engine (The Brain)**
- Platform expansion — X (Twitter), TikTok, LinkedIn, and Pinterest Ads added
- Real-time impression signal collection — every like, save, share, click, hide, and report captured instantly
- Autonomous keep/remove/mutate decisions — Scalo decides in real time whether to scale, modify, or kill each ad
- Ad mutation engine — underperforming ads are not just removed; they are intelligently modified and retested
- Creative fatigue detection — identifies when an audience has over-exposed to an ad before performance drops
- Unified Engagement Score (UES) — normalised performance metric comparable across all platforms
- Predictive Lifetime Value (pLTV) bidding — bid aggressively for high-value prospects, conservatively for low-value
- Sentiment analysis — AI reads comment sections and social reactions to detect brand risk before it escalates
- Real-time anomaly alerts — immediate notification when a campaign breaks, with AI-diagnosed root cause

**Version 3 — AI Creative & Trend Intelligence Ecosystem (The Moat)**
- Full campaign generation from a text brief — describe what you want, AI builds the entire campaign
- AI image and video ad creation — generate production-ready creatives with no designer required
- AI Influencer Models — create brand-safe synthetic influencer personas for ad content
- One-Ad-to-Many — upload one creative, Scalo adapts it to every platform format and placement automatically
- Cross-brand trend engine — winning patterns from top-performing ads become trend signals shared platform-wide
- Trend packages — actionable creative direction, format guidance, audience insight, and timing delivered to brands
- Generative Engine Optimisation (GEO) — optimise ads for discovery via AI search assistants
- Natural language campaign control — manage and adjust campaigns by typing instructions in plain language
- AI competitor ad analysis — surface what similar brands are running and benchmark your performance against them
- Marketplace — community templates, audience segments, and AI influencer models available for purchase

## 5. How It Works — End to End

### 5.1 The Campaign Lifecycle
Every campaign on Scalo flows through the same intelligent lifecycle, regardless of version. The level of AI autonomy increases from V1 to V3, but the structure is consistent.

| Step | What Happens | Who Does It |
|---|---|---|
| 1. Brief | Brand inputs campaign objective, budget, audience, and brand guidelines. In V3 this is a single plain-language message. | Brand (human) |
| 2. Strategy | AI analyses the brief, recommends campaign structure, platform mix, budget split, and timeline. | AI CMO |
| 3. Creative generation | AI generates ad copy, images, and video variants. Multiple variations created for testing. Brand safety check applied automatically. | AI Creative Engine |
| 4. Platform adaptation | Each creative is automatically resized and reformatted for every required placement — feed, stories, reels, search, display. | AI Formatting Engine |
| 5. Approval | Brand reviews AI-generated creatives and approves or requests changes. In V3, trusted brands can set fully autonomous approval. | Brand (human) / AI (V3) |
| 6. Multi-platform posting | Approved ads are posted simultaneously across all selected platforms via Scalo's platform connectors. | Automated |
| 7. Real-time monitoring | Every impression signal — click, save, share, hide, report, conversion — is captured and scored in real time. | Signal Intelligence Layer |
| 8. Autonomous decisions | The AI evaluates each ad's Unified Engagement Score continuously. Ads are scaled, mutated, or removed without waiting for human input. | AI Decision Engine |
| 9. Trend extraction | When an ad reaches significance thresholds, its winning pattern is extracted — tone, format, hook, audience — and flagged for trend analysis. | Trend Engine |
| 10. Trend propagation | The abstracted trend pattern is packaged and delivered to relevant brands on the platform as an actionable creative brief. | Trend Propagation Service |
| 11. Model learning | Every campaign outcome feeds back into Scalo's AI models. The platform becomes measurably smarter with every campaign run. | ML Pipeline |

### 5.2 The Autonomous Ad Decision Engine (V2+)
The decision engine is what separates Scalo from every competing tool. Rather than presenting data and waiting for a human to act, Scalo acts — and explains its reasoning transparently.

Every ad running on Scalo is evaluated on a continuous cycle using a Unified Engagement Score (UES) — a normalised 0–100 metric that converts platform-native signals into a single comparable number across all platforms.

| UES Range | Action Taken by Scalo |
|---|---|
| **70–100 (High performer)** | Budget scaled up by 20% per evaluation cycle, up to the campaign cap. Ad flagged for trend analysis. |
| **45–69 (Solid performer)** | Ad maintained. Monitored for trend direction. No budget change. |
| **25–44 (Underperformer)** | Ad creative mutated — headline rewritten, image replaced, or CTA changed. New variant deployed alongside original for split testing. |
| **10–24 (Poor performer)** | Ad paused. Pattern logged to the brand's negative learning library. Available for human review and manual restart. |
| **0–9 or flagged** | Ad immediately removed from all platforms. If hide-ad rate exceeds 3% or any report signal detected, removal is instant. Learnings fed to AI model. |

### 5.3 The Cross-Brand Trend Engine (V3)
The trend engine is Scalo's most defensible long-term feature. It operates on aggregated, anonymised performance data from all campaigns across the entire platform and identifies patterns that represent genuine shifts in consumer engagement.

When an ad meets all three criteria — sufficient impression volume, statistically significant performance above industry baseline, and an extractable creative pattern — Scalo creates a Trend Package. This package contains directional intelligence only (no identifying brand data is shared).

**What a Trend Package Contains:**
- **Creative Direction:** the tone, visual style, narrative structure, and emotional hook type that drove engagement
- **Format Guidance:** which platform, placement, and ad duration performed best for this pattern
- **Audience Insight:** the demographics, psychographics, and behavioural signals of the audience
- **Timing Guidance:** optimal posting windows, campaign duration, and any urgency or seasonality signals
- **Engagement Benchmark:** expected UES range a brand can anticipate if executing the trend well
- **Starter Brief:** a template campaign brief the receiving brand can adapt

## 6. What Makes Scalo Different
The market for ad management tools is crowded. Here is exactly where Scalo sits relative to the landscape:

- **Unified cross-platform management:** Table stakes in 2026. Scalo's V1 competes here on price and simplicity.
- **AI-optimised bidding and targeting:** Scalo does it cross-platform and transparently — showing the brand exactly why each decision was made.
- **Autonomous keep/remove decisions:** No current tool does this as a primary product feature with full transparency and a human override layer. This is Scalo's V2 core differentiator.
- **AI creative generation:** Adobe Firefly, Canva generate images, but none are natively integrated with campaign management, real-time performance feedback, and autonomous posting in one loop.
- **AI Influencer Models:** Significant first-mover opportunity. No ad management platform integrates this with campaign intelligence.
- **Cross-brand trend engine:** Does not exist anywhere in the market today. This is Scalo's long-term moat. Network effect: every new brand makes the trend engine smarter for all brands.
- **Natural language campaign control:** Scalo builds this as a primary interface in V3, not a bolt-on feature.

## 7. Key Concepts & Definitions
- **AI CMO:** The core intelligence engine of Scalo.
- **Unified Engagement Score (UES):** Scalo's proprietary 0–100 ad performance metric.
- **Ad Mutation:** Intelligently modifying underperforming ads (rewrite headline, swap creative) and retesting.
- **Creative Fatigue:** The point at which an audience has seen an ad so many times that engagement falls (detected before performance visibly drops).
- **Trend Package:** Actionable intelligence report Scalo generates from a top-performing ad's patterns.
- **Campaign Health Score:** A 0–100 score Scalo assigns to each campaign summarising overall performance health.
- **One-Ad-to-Many:** Automatically reformatting a single creative for every platform and placement.
- **AI Influencer Model:** Brand-safe synthetic influencer persona generated by Scalo's AI.
- **pLTV (Predictive Lifetime Value):** ML-driven forecast of long-term revenue to guide bidding strategy.
- **GEO (Generative Engine Optimisation):** Optimising ad content for discovery through AI search assistants.

## 8. What Scalo Is Not
- Scalo is not a social media management tool (no organic posts or community management).
- Scalo is not a marketing strategy consultant (it executes strategy based on brand inputs).
- Scalo is not a creative agency (it generates ads, not brand identities or logos).
- Scalo is not a CRM.
- Scalo is not a guarantee of results (it optimises targeting, creative, bidding, and timing).

## 9. The Core Promise
**What Scalo promises every brand that uses it:**
- You will never log into Meta Ads Manager and Google Ads separately again.
- You will never wait 48 hours for an agency to pull a failing ad — Scalo will have already pulled it.
- You will never brief a designer for a standard ad variation — Scalo will have already generated 10 options.
- You will never miss a trend that is working for brands like yours — Scalo will bring it to you.
- You will pay a predictable, transparent fee — not a percentage of your budget that grows as you scale.

---

# Part 2: Design System (Aesthetic UI Tokens)

## Overview

Mintlify positions itself at the intersection of polished marketing presentation and developer-grade documentation density. The home and startups pages open with cinematic atmospheric heroes — soft sky-gradient backdrops with cloud illustrations on the homepage, dark teal-to-mint gradients with a rocket launch on the startups page — that feel more like a SaaS landing aesthetic than a developer tool. Then the deeper surfaces (pricing comparison, live documentation pages) collapse into dense, high-information layouts where Inter body type carries 14–16px copy across long-form prose, syntax-highlighted code blocks, and 3-column documentation grids.

The brand's signature mint green ({colors.brand-green}) appears sparingly but decisively — on the hero "Get started" pill button, the green checkmark icons inside feature lists, the "Featured" pricing tier border, and active state indicators inside docs UI. Black-pill primary buttons dominate the marketing flow; white-on-dark inversions appear on dark hero bands. The signature pairing of Inter (body, headings) with Geist Mono (code blocks, inline references, type signatures) reinforces the developer-tool DNA without requiring a third typeface.

**Key Characteristics:**
- **Light mode only** — the design system is strictly light mode; no dark-mode surface tokens are applied
- Atmospheric gradient hero bands (sky-blue to cream on homepage) provide cinematic marketing presentation
- Signature Mintlify mint green ({colors.brand-green}) reserved for accent CTAs, active states, and feature confirmations
- Black-pill primary buttons ({colors.primary} + `{rounded.full}`) for marketing CTAs
- Inter for all UI prose; Geist Mono for code blocks, inline code, and type/property signatures
- 3-column documentation layout (sidebar / prose / TOC) with dense 14px body type for long-form developer reading
- **Auth pages** use a 2-column split panel: branded illustration/tagline on the LEFT, form card on the RIGHT (`{component.auth-split-panel}`)
- All form inputs use `{component.text-input}` with green focus ring (`{component.text-input-focused}`) and 1px `{colors.hairline}` border at rest
- Tightly-controlled radius scale: marketing uses `{rounded.lg}` (12px), pill buttons use `{rounded.full}` — no in-between corner softening
- Vibrant testimonial card (`{colors.testimonial-orange}`) breaks color rhythm intentionally for emotional impact

## Colors

> Source pages: mintlify.com/ (homepage), /startups (program page), /pricing (comparison), /docs/components/tabs (live documentation). Token coverage was identical across all four pages.

### Brand & Accent
- **Mintlify Mint** ({colors.brand-green}): Signature accent — used on hero "Get started" pill button, green checkmarks in feature lists, featured pricing tier border accent, sidebar active indicator dots.
- **Deep Mint** ({colors.brand-green-deep}): Pressed/active variant of the mint accent.
- **Soft Mint** ({colors.brand-green-soft}): Subtle background tint for success states and confirmation surfaces.
- **Brand Tag** ({colors.brand-tag}): Documentation tag and reference color (used in `<Tabs>` JSX-style annotations and code-tag chips).
- **Brand Annotate** ({colors.brand-annotate}): Inline code annotation green (used in twoslash code annotation system).
- **Brand Warn** ({colors.brand-warn}): Code warning highlight (deprecated, caution).
- **Brand Error** ({colors.brand-error}): Red used for required-field labels and error highlight.
- **Testimonial Orange** ({colors.testimonial-orange}): Warm coral-orange used on the "Cursor" testimonial card and warm callout surfaces.

### Surface
- **Canvas White** ({colors.canvas}): Primary page and card background.
- **Surface** ({colors.surface}): Subtle section backgrounds, search-pill rest, code-inline background, sidebar active state.
- **Surface Soft** ({colors.surface-soft}): Quieter section backgrounds, FAQ accordion, and auth left-panel background.
- **Surface Code** ({colors.surface-code}): Dark code-block wrapper background.
- **Hairline** ({colors.hairline}): 1px borders and primary dividers.
- **Hairline Soft** ({colors.hairline-soft}): Quieter table-row dividers and secondary section breaks.

### Hero Atmospheric
- **Hero Sky From / To** ({colors.hero-sky-from}, {colors.hero-sky-to}): Atmospheric sky-blue to soft cream gradient on the homepage hero.
- **Hero Dark From / To** ({colors.hero-dark-from}, {colors.hero-dark-to}): Dark teal to mint gradient on the startups hero.

### Text
- **Ink** ({colors.ink}): Primary headlines and CTA text.
- **Charcoal** ({colors.charcoal}): Body text, code-inline foreground.
- **Slate** ({colors.slate}): Secondary text and metadata.
- **Steel** ({colors.steel}): Tertiary text, table headers, sidebar inactive items, footer links.
- **Stone** ({colors.stone}): Captions, twoslash cursor color, muted labels.
- **Muted** ({colors.muted}): De-emphasized labels, disabled text, and form helper text.

### Semantic
- Error tones derive from `{colors.brand-error}` for input borders, required-field labels, and validation messaging.

## Typography

### Font Family
**Inter** (primary): Variable typeface optimized for UI legibility. Used across every UI surface — body, headings, navigation, button labels, captions. Fallbacks: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif.

**Geist Mono** (code): Monospace typeface used inside code blocks, inline code references, type signatures (e.g. `string`, `number`, `boolean`), and property names in API documentation. Fallbacks: 'SF Mono', Menlo, Consolas, 'Geist Mono Fallback', monospace.

The brand uses no italic variants of either face — emphasis comes from weight (500/600), color shift, or background highlighting (in code references).

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.hero-display}` | 72px | 600 | 1.05 | -2px | Marketing hero display ("The intelligent Knowledge Platform") |
| `{typography.display-lg}` | 56px | 600 | 1.10 | -1.5px | Major section opener ("Built for the intelligence age") |
| `{typography.heading-1}` | 48px | 600 | 1.10 | -1px | Page-level headlines ("Pricing on your terms") |
| `{typography.heading-2}` | 36px | 600 | 1.20 | -0.5px | Section headlines ("Apply to the Mintlify startup program") |
| `{typography.heading-3}` | 28px | 600 | 1.25 | 0 | Subsection headers, "Tabs" docs page title |
| `{typography.heading-4}` | 22px | 600 | 1.30 | 0 | Card titles, larger feature headers |
| `{typography.heading-5}` | 18px | 600 | 1.40 | 0 | Smaller feature headers, FAQ question titles |
| `{typography.subtitle}` | 18px | 400 | 1.50 | 0 | Hero subtitle, lead body |
| `{typography.body-md}` | 16px | 400 | 1.50 | 0 | Primary body text |
| `{typography.body-md-medium}` | 16px | 500 | 1.50 | 0 | Body emphasis |
| `{typography.body-sm}` | 14px | 400 | 1.50 | 0 | Secondary body, table cells, navigation |
| `{typography.body-sm-medium}` | 14px | 500 | 1.50 | 0 | Active sidebar nav, button labels, tab labels |
| `{typography.caption}` | 13px | 400 | 1.40 | 0 | Helper text, fine print, code-block headers |
| `{typography.caption-bold}` | 13px | 600 | 1.40 | 0 | Badge labels |
| `{typography.micro}` | 12px | 500 | 1.40 | 0 | Footer microcopy, label chips |
| `{typography.micro-uppercase}` | 11px | 600 | 1.40 | 0.5px | Sidebar section headers, "REQUIRED" labels |
| `{typography.button-md}` | 14px | 500 | 1.30 | 0 | Pill button labels |
| `{typography.code-md}` | 14px | 400 | 1.50 | 0 | Code block content |
| `{typography.code-sm}` | 13px | 400 | 1.40 | 0 | Smaller code, type signatures |
| `{typography.code-inline}` | 13px | 500 | 1.30 | 0 | Inline `<Tabs>` references in body |

### Principles
- **Tight hero leading** (1.05) creates magazine-grade display headlines on the 72px hero
- **Negative letter-spacing** progresses inversely with size — display sizes use -2px to -1.5px; smaller headings relax to 0
- **Documentation-grade body** (1.50 line-height on 14–16px) ensures comfortable long-form reading in dense docs surfaces
- **Inter / Geist Mono pairing** — Inter for everything else, Geist Mono surgically for code references; the contrast between the two is the brand's developer-respect signal
- **Uppercase micro labels** with +0.5px letter-spacing carry sidebar section headers and "REQUIRED" annotation tags

## Layout

### Spacing System
- **Base unit**: 4px (8px primary increment)
- **Tokens**: `{spacing.xxs}` (4px) · `{spacing.xs}` (8px) · `{spacing.sm}` (12px) · `{spacing.md}` (16px) · `{spacing.lg}` (20px) · `{spacing.xl}` (24px) · `{spacing.xxl}` (32px) · `{spacing.xxxl}` (40px) · `{spacing.section-sm}` (48px) · `{spacing.section}` (64px) · `{spacing.section-lg}` (96px) · `{spacing.hero}` (120px)
- **Section rhythm**: Marketing pages use `{spacing.section-lg}` (96px) between major bands; pricing comparison tightens to `{spacing.section}` (64px); documentation surfaces use `{spacing.xxl}` (32px) between subsections
- **Card internal padding**: Standard `{spacing.xl}` (24px) for compact cards; `{spacing.xxl}` (32px) for pricing cards and feature panels; testimonial card pushes to `{spacing.section}` (64px) for hero-card presence

### Grid & Container
- Marketing pages use a 1280px max-width with 32px gutters
- Hero and feature bands often use 2-column splits (text left, illustration/mockup right)
- Pricing page renders 3 tier cards in a row at desktop (FREE / Lift Off / Custom), then a comprehensive feature comparison table below
- Documentation pages use a strict 3-column grid: left sidebar nav (~240px), center prose (~720px max-width), right TOC (~200px)
- Logo walls use 6-up rows of customer logos at 80–100px height each

### Whitespace Philosophy
Marketing surfaces give content generous breathing room — `{spacing.hero}` (120px) above-the-fold creates space for atmospheric gradient backdrops to read clearly. Documentation tightens dramatically: section gaps drop to `{spacing.xxl}` (32px), table rows pack to `{spacing.md}` (16px), sidebar nav compresses to `{spacing.xs}` (8px) vertical rhythm.

## Elevation & Depth

The system runs predominantly flat with strategic atmospheric depth.

| Level | Treatment | Use |
|---|---|---|
| 0 (flat) | No shadow; `{colors.hairline}` border | Default cards, table rows, form inputs |
| 1 (subtle) | `rgba(0, 0, 0, 0.04) 0px 1px 2px 0px` | Hover-elevated tiles, subtle highlights |
| 2 (card) | `rgba(0, 0, 0, 0.08) 0px 4px 12px 0px` | Standard feature cards |
| 3 (mockup) | `rgba(0, 0, 0, 0.12) 0px 24px 48px -8px` | Hero product mockup framing — the deep diffuse drop on the homepage hero docs preview |
| 4 (brand-tinted) | `rgba(0, 212, 164, 0.08) 0px 8px 24px` | Featured pricing tier glow |

### Decorative Depth
- The homepage hero uses an atmospheric photographic backdrop (cloud illustration on sky-gradient) for depth — no shadow needed; the imagery does the work
- The startups hero uses a similar treatment with a rocket-launch illustration cutting across the dark teal gradient
- Code blocks carry their own internal depth via syntax-highlighting color hierarchy on the dark surface; no shadow used

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.xs}` | 4px | Inline code chips, micro tags |
| `{rounded.sm}` | 6px | Sidebar nav items, type badges |
| `{rounded.md}` | 8px | Inputs, search pill, code blocks, secondary cards |
| `{rounded.lg}` | 12px | Standard cards, pricing tiers, hero mockup, FAQ items |
| `{rounded.xl}` | 16px | Larger feature panels |
| `{rounded.xxl}` | 24px | Featured product showcase tiles |
| `{rounded.full}` | 9999px | All buttons, pill tabs, badges |

The radius scale is tightly disciplined — the brand never uses a corner softening between `{rounded.md}` (8px) and `{rounded.lg}` (12px) for the same component family. Pill buttons (`{rounded.full}`) are used universally; rectangular cards use `{rounded.lg}` (12px) consistently.

### Photography Geometry
- Hero illustrations (cloud, rocket) sit on full-bleed gradient backdrops with no internal framing
- Customer logo walls use 1:1 ratio cells without rounding (logos are presented inline as wordmarks)
- Testimonial photos use 1:1 aspect with `{rounded.md}` (8px) softening
- Code editor mockup hero image uses `{rounded.lg}` (12px) corners on a hairline-bordered card with a deep diffuse drop shadow

## Components

> Per the no-hover policy, hover states are NOT documented. Default and pressed/active states only.

### Buttons

**`button-primary`** — Black pill primary CTA, the dominant action across all surfaces.
- Background `{colors.primary}`, text `{colors.on-primary}`, typography `{typography.button-md}`, padding `10px 20px`, rounded `{rounded.full}`.
- Pressed state `button-primary-pressed` lifts to `{colors.charcoal}`.
- Disabled state `button-primary-disabled` uses `{colors.hairline}` background and `{colors.muted}` text.

**`button-accent-green`** — Mint green pill for brand-emphasis CTAs (hero "Get started", featured pricing CTA).
- Background `{colors.brand-green}`, text `{colors.primary}`, typography `{typography.button-md}`, padding `10px 20px`, rounded `{rounded.full}`.

**`button-on-dark`** — White pill for use on dark hero bands (startups page "Get started").
- Background `{colors.on-dark}`, text `{colors.primary}`, typography `{typography.button-md}`, padding `10px 20px`, rounded `{rounded.full}`.

**`button-secondary`** — Outlined pill for secondary actions.
- Background transparent, text `{colors.ink}`, border `1px solid {colors.hairline}`, typography `{typography.button-md}`, padding `10px 20px`, rounded `{rounded.full}`.

**`button-ghost`** — Quieter rectangular ghost button (sidebar action, tertiary nav).
- Background transparent, text `{colors.ink}`, typography `{typography.button-md}`, padding `8px 12px`, rounded `{rounded.md}`.

**`button-link`** — Inline text link styled as a subtle button.
- Background transparent, text `{colors.ink}`, typography `{typography.body-sm-medium}`, padding `0`. Underline appears on activation.

**`button-icon-circular`** — 32×32px circular utility button (close, copy, arrow).
- Background `{colors.canvas}`, text `{colors.ink}`, border `1px solid {colors.hairline}`, rounded `{rounded.full}`.

### Cards & Containers

**`card-base`** — Standard documentation/feature card.
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.xl}`, border `1px solid {colors.hairline}`.

**`card-feature`** — Feature panel on light gray surface.
- Background `{colors.surface}`, rounded `{rounded.lg}`, padding `{spacing.xxl}`.

**`card-help`** — "Need help?" CTA cards below the pricing comparison ("Quickstart guide", "Guide to technical writing", "Founder", "Sales").
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.xl}`, border `1px solid {colors.hairline}`.

**`card-startup-perk`** — Startup-program perk grid item ("Discounts and credits", "Priority support", "Startup pack", "Founder community").
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.xl}`, border `1px solid {colors.hairline}`. Carries an icon at top, heading `{typography.heading-5}`, description `{typography.body-sm}` `{colors.steel}`.

**`pricing-card`** — Standard pricing tier card.
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.xxl}`, border `1px solid {colors.hairline}`.
- Title `{typography.heading-3}`, price `{typography.display-lg}`, feature list `{typography.body-sm}` with green checkmark icons.

**`pricing-card-featured`** — Highlighted pricing tier (Lift Off / featured plan).
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.xxl}`, border `2px solid {colors.brand-green}`, soft brand-tinted shadow `rgba(0, 212, 164, 0.08) 0px 8px 24px`.

**`testimonial-card-feature`** — Bright orange large testimonial card with photo + quote ("Cursor — Every YC batch we consistently see the top performing startups use Mintlify to build their docs.").
- Background `{colors.testimonial-orange}`, text `{colors.on-dark}`, rounded `{rounded.lg}`, padding `{spacing.section}`. Photo on right, large quote in `{typography.heading-3}` left, attribution below in `{typography.body-sm-medium}`.

**`testimonial-card-quote`** — Smaller white testimonial card on the startups page.
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.xxl}`, border `1px solid {colors.hairline}`.

**`founder-quote-card`** — Cursor founder testimonial card variant on the orange surface.
- Background `{colors.testimonial-orange}`, text `{colors.on-dark}`, rounded `{rounded.lg}`, padding `{spacing.xxl}`. Carries the specific founder portrait + quote treatment.

**`startup-program-card`** — Larger application/program card containing perks grid + apply CTA.
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.xxl}`, border `1px solid {colors.hairline}`.

### Inputs & Forms

**`text-input`** — Standard text field.
- Background `{colors.canvas}`, text `{colors.ink}`, border `1px solid {colors.hairline}`, rounded `{rounded.md}`, padding `{spacing.sm} {spacing.md}`, height 40px.

**`text-input-focused`** — Activated state.
- Border switches to `2px solid {colors.brand-green}` — focus uses the brand mint as the activation signal.

**`search-pill`** — Documentation top-bar search.
- Background `{colors.surface}`, text `{colors.steel}`, typography `{typography.body-sm}`, rounded `{rounded.md}`, height 36px, border `1px solid {colors.hairline}`.

### Tabs

**`segmented-tab`** + **`segmented-tab-active`** — Underline-style tab navigation (used inside docs Tabs component for "First tab / Second tab / Third tab").
- Inactive: text `{colors.steel}`, transparent background, padding `{spacing.sm} {spacing.md}`. Active: text `{colors.ink}`, 2px bottom border in `{colors.ink}`.

**`pill-tab`** + **`pill-tab-active`** — Pill-style tab nav (top of pricing page: "Pricing / Roadmap").
- Inactive: background `{colors.canvas}`, text `{colors.steel}`, border `1px solid {colors.hairline}`, padding `8px 16px`, rounded `{rounded.full}`.
- Active: background `{colors.primary}`, text `{colors.on-primary}`, no border.

**`toggle-monthly-yearly`** — Two-state pill toggle (Monthly / Annual on pricing page).
- Background `{colors.surface}`, rounded `{rounded.full}`, padding `4px`. Active state moves a white pill thumb to the selected position.

### Badges & Status

**`badge-discount`** — Small green "Save 20%" badge attached to annual toggle.
- Background `{colors.brand-green}`, text `{colors.primary}`, typography `{typography.caption-bold}`, rounded `{rounded.full}`, padding `2px 8px`.

**`badge-required`** — Red "REQUIRED" label on documentation property rows.
- Background `{colors.brand-error}`, text `{colors.on-dark}`, typography `{typography.micro-uppercase}`, rounded `{rounded.sm}`, padding `2px 6px`.

**`badge-type`** — Type signature chip in documentation (e.g. `string`, `number`, `boolean`).
- Background `{colors.surface}`, text `{colors.steel}`, typography `{typography.code-sm}`, rounded `{rounded.sm}`, padding `2px 6px`.

**`badge-tag`** — Documentation tag chip (e.g. `<Tabs>` reference highlighted in body text).
- Background `rgba(55, 114, 207, 0.15)`, text `{colors.brand-tag}`, typography `{typography.caption-bold}`, rounded `{rounded.sm}`, padding `2px 8px`.

**`promo-banner`** — Sticky black promo strip ABOVE the top nav (when present).
- Background `{colors.canvas-dark}`, text `{colors.on-dark}`, typography `{typography.body-sm-medium}`, padding `{spacing.sm} {spacing.md}`.

### Code

**`code-block`** — Syntax-highlighted code container.
- Background `{colors.surface-code}`, text `{colors.on-dark}`, typography `{typography.code-md}`, rounded `{rounded.md}`, padding `{spacing.md}`.

**`code-block-header`** — Header bar above the code with language label + copy button.
- Background `{colors.surface-code}`, text `{colors.on-dark-muted}`, typography `{typography.caption}`, padding `{spacing.xs} {spacing.md}`, bottom border `1px solid {colors.hairline-dark}`.

**`code-inline`** — Inline `<Tabs>` reference in body prose.
- Background `{colors.surface}`, text `{colors.charcoal}`, typography `{typography.code-inline}`, rounded `{rounded.xs}`, padding `2px 6px`, border `1px solid {colors.hairline}`.

**`copy-code-button`** — "Copy code" button in code-block header.
- Background transparent, text `{colors.on-dark-muted}`, typography `{typography.caption}`, rounded `{rounded.sm}`, padding `{spacing.xxs} {spacing.xs}`, border `1px solid {colors.hairline-dark}`.

### Documentation Components

**`property-row`** — API property documentation row (e.g. `defaultIndex` on the Tabs page).
- Background transparent, text `{colors.ink}`, typography `{typography.body-sm}`, padding `{spacing.md} 0`, bottom border `1px solid {colors.hairline-soft}`.
- Layout: property name in `{typography.code-inline}` + type badge + optional REQUIRED badge + description below in `{typography.body-sm}` `{colors.steel}`.

**`feature-comparison-table`** — Detailed pricing-page feature comparison table.
- Background `{colors.canvas}`, text `{colors.ink}`, typography `{typography.body-sm}`, rounded `{rounded.md}`, border `1px solid {colors.hairline}`.

**`feature-comparison-row`** — Individual row inside the comparison table.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.md} {spacing.lg}`, bottom border `1px solid {colors.hairline-soft}`. Section dividers in `{typography.micro-uppercase}` `{colors.steel}`.

**`sidebar-nav-item`** + **`sidebar-nav-item-active`** — Documentation left rail link entries.
- Inactive: background transparent, text `{colors.steel}`, typography `{typography.body-sm}`, rounded `{rounded.sm}`, padding `{spacing.xs} {spacing.md}`.
- Active: background `{colors.surface}`, text `{colors.ink}`, typography `{typography.body-sm-medium}`.

**`sidebar-section-header`** — Uppercase section header inside sidebar (e.g. "COMPONENTS", "PRIMITIVES").
- Background transparent, text `{colors.steel}`, typography `{typography.micro-uppercase}`, padding `{spacing.md} {spacing.md} {spacing.xs}`.

**`doc-toc-item`** + **`doc-toc-item-active`** — Right-rail table-of-contents links.
- Inactive: background transparent, text `{colors.steel}`, typography `{typography.body-sm}`, padding `{spacing.xxs} 0`.
- Active: text `{colors.ink}`, typography `{typography.body-sm-medium}`, optional left-border accent in `{colors.brand-green}`.

### Navigation

**Top Navigation (Marketing)** — Sticky white bar with logo, link list, and right-side CTAs.
- Background `{colors.canvas}`, height ~64px, bottom border `1px solid {colors.hairline-soft}`.
- Left: Mintlify wordmark + horizontal link list (Solutions, Pricing, Customers, Documentation, Changelog).
- Right: secondary "Talk to sales" + black-pill "Get Started".

**Top Navigation (Documentation)** — Compressed nav with center search-pill and right-side account/upgrade CTAs.
- Background `{colors.canvas}`, height ~56px. Search-pill at center, "Documentation / Guides / API Reference / Changelog" links + "Talk to us" + green "Get started" right.

### Signature Components

**`hero-band-sky`** — Homepage hero with atmospheric sky-blue to cream gradient and cloud illustrations.
- Background gradient `linear-gradient(180deg, {colors.hero-sky-from} 0%, {colors.hero-sky-to} 100%)`, text `{colors.on-dark}` (early portion of gradient) shifting to `{colors.ink}` further down, padding `{spacing.hero}`.
- Layout: centered hero headline in `{typography.hero-display}`, centered subtitle in `{typography.subtitle}`, centered button row (`button-accent-green` "Get started" + `button-secondary` "Talk to us"), product mockup below the buttons.

**`hero-band-dark`** — Startups hero with dark teal-to-mint gradient and rocket launch illustration.
- Background gradient `linear-gradient(135deg, {colors.hero-dark-from} 0%, {colors.hero-dark-to} 100%)`, text `{colors.on-dark}`, padding `{spacing.hero}`.
- Layout: hero headline left in `{typography.hero-display}` `{colors.on-dark}`, illustration right (rocket cutting across the gradient), button row uses `button-on-dark` (white pill) + ghost link.

**`hero-product-mockup`** — Code-editor mockup framed inside the homepage hero.
- Background `{colors.canvas}`, rounded `{rounded.lg}`, border `1px solid {colors.hairline-soft}`, deep shadow `rgba(0, 0, 0, 0.12) 0px 24px 48px -8px`.
- Carries a documentation page preview inside (sidebar on left, prose body, mock UI controls).

**`logo-wall-item`** — Customer logo cell in 6-up trust-row grids ("Anthropic / Cognition / Mintlify / Vercel / react / Lovable", "Stripe / Block / PayPal / Compound / Auth").
- Background transparent, text `{colors.steel}`, typography `{typography.body-md-medium}`, padding `{spacing.lg}`.
- Logos rendered as wordmarks with consistent vertical centering.

**`faq-accordion-item`** — Frequently-asked-questions panel item (visible on pricing page).
- Background `{colors.canvas}`, rounded `{rounded.md}`, padding `{spacing.xl}`, border `1px solid {colors.hairline-soft}`.
- Question in `{typography.heading-5}`, expanded answer in `{typography.body-md}` `{colors.steel}`, chevron icon in `{colors.steel}` 16px.

**`footer-region`** — Multi-column site footer.
- Background `{colors.canvas}`, top border `1px solid {colors.hairline}`, padding `{spacing.section} {spacing.xxl}`.
- 5 column groups (Explore / Resources / Company / Legal + brand mark column).
- Section headers in `{typography.body-sm-medium}` `{colors.ink}`, link items in `{typography.body-sm}` `{colors.steel}`.

**`footer-link`** — Individual link entry in the footer.
- Background transparent, text `{colors.steel}`, typography `{typography.body-sm}`, padding `{spacing.xxs} 0`.

## Do's and Don'ts

### Do
- Reserve `{colors.brand-green}` (Mintlify mint) for accent CTAs and active state indicators only — even one accent button per viewport carries weight
- Use `{colors.primary}` (black) as the dominant CTA on light backgrounds; switch to `button-on-dark` (white pill) on dark hero bands
- Apply `{rounded.full}` to every button and pill; never soften pill corners
- Pair Inter (UI prose) with Geist Mono (code) — never introduce a third typeface
- Use atmospheric gradient hero bands sparingly (only the homepage and startups page); keep deeper surfaces flat and dense
- Apply `{rounded.lg}` (12px) consistently on cards; use `{rounded.md}` (8px) only on compact UI like search pills and code blocks
- Keep documentation prose at `{typography.body-md}` (16px) with 1.50 line-height — never compress

### Don't
- Don't use `{colors.brand-green}` on body text or large surfaces — it loses signal
- Don't introduce additional accent colors beyond mint, tag-blue, error-red, and the testimonial orange
- Don't apply heavy shadows on flat documentation cards; reserve elevation for the hero product mockup
- Don't reduce documentation line-height below 1.50 — long-form readability suffers
- Don't combine atmospheric gradients with multiple competing color accents in the same hero — the sky/dark gradient is the brand mood; let it breathe
- Don't use Inter for code or Geist Mono for prose — the typeface assignment IS the brand voice

## Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|---|---|---|
| Mobile (small) | < 480px | Single column. Hero scales to 36px. Pill nav collapses to hamburger. Pricing tiers stack 1-up. Footer 1-column accordion. |
| Mobile (large) | 480 – 767px | Same as small but feature tiles render 2-up. Hero scales to 44px. |
| Tablet | 768 – 1023px | 2-column feature grids. Pill-tab nav returns. Documentation sidebar collapses to drawer. Hero scales to 56px. |
| Desktop | 1024 – 1279px | Full 3-column docs grid (sidebar / body / TOC). 3-tier pricing card row. Hero at 72px. |
| Wide Desktop | ≥ 1280px | Wider hero gutters, larger product mockup, fixed 240px sidebar. |

### Touch Targets
- Pill buttons render at 36–40px effective height — bumps to 44px on mobile via padding override
- Circular icon buttons: 32×32px desktop → 44×44px mobile
- Form inputs render at 40px height; bumps to 44px mobile
- Sidebar nav items render at ~32px tall — bump to 44px mobile drawers

### Collapsing Strategy
- **Promo banner** stays full-width; truncates at < 480px
- **Top nav** below 1024px collapses to hamburger; horizontal links move into drawer
- **Hero band**: 2-column hero (text + mockup) collapses to stacked at < 1024px; mockup rendered below text on mobile
- **Documentation grid**: 3-column desktop → sidebar-drawer at < 1024px → single-column at < 768px
- **Pricing comparison**: 3-column tiers → 1-column stacked at < 768px; comparison table becomes horizontal-scroll
- **Hero typography**: `{typography.hero-display}` (72px) → 56px tablet → 44px mobile-large → 36px mobile-small
- **Customer logo wall**: 6-up → 3-up at tablet → 2-up at mobile
- **Footer**: 5-column desktop → 2-column tablet → accordion at mobile

### Image Behavior
- Hero illustrations (cloud, rocket) lazy-load with the hero band; remain crisp at all breakpoints (SVG-based)
- Product mockup retains its aspect ratio across breakpoints; scales proportionally
- Customer logos use SVG wordmarks; remain crisp on retina displays

## Iteration Guide

1. Focus on ONE component at a time. The system has high internal consistency.
2. Reference component names and tokens directly (`{colors.primary}`, `{component-name}-pressed`, `{rounded.full}`) — do not paraphrase.
3. Run `npx @google/design.md lint DESIGN.md` after edits to catch broken refs and contrast issues.
4. Add new variants as separate `components:` entries (`-pressed`, `-disabled`, `-focused`, `-active`).
5. Default to `{typography.body-md}` for body and `{typography.subtitle}` for emphasis. Headlines step down `hero-display → display-lg → heading-1 → heading-2 → heading-3 → heading-4 → heading-5`.
6. Keep `{colors.brand-green}` confined to accent moments. If it appears on a generic surface, ask whether it earned that role.
7. Pill-shaped buttons (`{rounded.full}`) always; squared buttons signal "third-party widget" in this language.
8. Documentation prose belongs in `{typography.body-md}` 16px with 1.50 line-height — anything denser breaks the reading experience.

## Known Gaps

- **Dark mode is intentionally out of scope** for this design system version; the brand ships light mode only
- Animation/transition timings are not extracted; recommend 150–200ms ease for hover/focus state transitions
- Form validation success state is not explicitly captured beyond defaults — implement following standard green-border + success badge patterns
- Code syntax highlighting palette inside docs is not formalized; documentation samples carry their own twoslash-style annotation system tokens (e.g. `{colors.brand-tag}`, `{colors.brand-annotate}`, `{colors.brand-warn}`) but the full highlight scheme is not enumerated
- Auth page error states (wrong password, account not found) should follow `{colors.brand-error}` border + `{typography.caption}` helper text pattern below the input
