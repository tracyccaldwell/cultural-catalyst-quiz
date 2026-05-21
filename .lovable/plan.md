## What we're building

A mobile-first, single-page quiz at the project root that scores visitors across two dimensions (Cultural Catalyst alignment + Maxwell's 5 Levels of Leadership), captures their name + email before revealing the result, posts the lead to your ClickFunnels webhook, and shows one of 6 personalized archetype result pages.

## User flow

```text
Landing  →  Part 1 (6 Q)  →  Part 2 (10 Q)  →  Name + Email gate  →  Result page
   │            │                  │                   │                    │
   │      Catalyst score      Level subscores    POST to ClickFunnels   Archetype + CTA
   │      (6 questions,       (2 per level,      webhook + PostHog      back to
   │       1–5 Likert)         1–5 Likert)        "lead_captured"       culturalcatalysts.net
```

One question per screen, large type, progress bar, back button, 5 tap-target Likert pills.

## Scoring

**Catalyst Score** (6–30): sum of Part 1.
**Leadership Level** (1–5): the Maxwell level with the highest 2-question subscore (ties broken by the higher level — Maxwell's model is cumulative).

**Archetype mapping (deterministic):**

| Catalyst Score | Level 1–2 | Level 3 | Level 4 | Level 5 |
|---|---|---|---|---|
| 6–12  | Emerging Leader     | Emerging Leader     | Rising Catalyst     | Rising Catalyst |
| 13–18 | Rising Catalyst     | Connected Catalyst  | Connected Catalyst  | Catalyst in Action |
| 19–24 | Connected Catalyst  | Catalyst in Action  | Catalyst in Action  | Catalyst of Catalysts |
| 25–30 | Catalyst in Action  | Catalyst of Catalysts | Catalyst of Catalysts | **The Cultural Catalyst** |

Each result page shows: archetype name, 1-paragraph description, your current Maxwell level + 1-line growth nudge for the next level, and a CTA back to culturalcatalysts.net.

## Lead capture + ClickFunnels

Between Part 2 and the result, a gate asks for **Name + Email** (zod-validated: trimmed, max 100/255, valid email). On submit:

1. POST JSON `{ name, email, archetype, catalystScore, leadershipLevel, levelSubscores, completedAt }` to your ClickFunnels webhook URL.
2. Fire PostHog `lead_captured` event with the same payload (minus email PII — only a hashed id).
3. Reveal the result regardless of webhook success (we don't block the user on a 3rd-party failure; failures are logged to PostHog as `webhook_failed`).

The webhook URL and PostHog key are stored as environment variables (`VITE_POSTHOG_KEY`, `VITE_CLICKFUNNELS_WEBHOOK_URL`) so you can swap them without a redeploy. I'll prompt you for both values when we implement.

## Analytics events (PostHog)

`quiz_started`, `part1_completed`, `part2_completed`, `email_submitted`, `result_viewed` (with archetype), `cta_clicked`, `webhook_failed`.

## Branding (inferred from culturalcatalysts.net)

- Background: warm off-white `#F7F2EA`
- Text: deep slate `#1F2630`
- Accent: muted gold `#C9A24A`
- Display: a soft serif with italic emphasis (Cormorant Garamond) for headlines and archetype names
- Body: a clean humanist sans (Work Sans) for questions, buttons, and microcopy
- Generous whitespace, soft rounded buttons, subtle fade transitions between questions

## Tech

- TanStack Start (default template)
- Pages: `/` (landing), `/quiz` (handles all 16 questions + gate via internal state machine), `/result/:archetype` with score in query string for shareability
- All quiz content (questions, archetype copy, scoring) lives in a single `quiz.ts` config file so you can edit copy without touching components
- SEO: title, meta description, OG image, JSON-LD Quiz schema, single H1 per page
- No auth, no database — leads live in ClickFunnels + PostHog

## Out of scope for v1

- Storing leads in Lovable Cloud (ClickFunnels is the system of record)
- Sending the result via email (ClickFunnels follow-up sequences handle this)
- Admin UI for editing questions (edit `quiz.ts` directly)
- Shareable social cards per archetype (can add later)

## What I'll need from you at implementation time

1. Your ClickFunnels webhook URL
2. Your PostHog project API key (and host if self-hosted; otherwise defaults to US cloud)
