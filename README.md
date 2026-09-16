# Groww for Gen Z — prototype

A mobile-first, front-end prototype that layers a **habit + learning + guardrail
mode** on top of the real Groww product surface. Built for a Product-Intern
assignment. **Everything is mock data — no real prices, KYC, payments, or orders.**

> Not affiliated with, or endorsed by, Groww. A concept prototype only.

---

## Thesis

Gen Z isn't a segment Groww must *attract* — they're already the engine of new
growth. The job is **retention + responsible investing**, not acquisition. Two
failure modes destroy Gen Z value:

1. **One-and-done dormancy** — open an account, start one SIP, disappear.
2. **The "trading not investing" trap** — F&O and trending-stock FOMO pull
   first-timers into losses.

So "Groww for Gen Z" is a **mode layered on the real Groww app**, not a separate
app and not a gamified casino. It rides Groww's strengths (₹100 SIPs,
zero-commission direct mutual funds, a clean UI) and adds a habit + learning +
guardrail layer that can be toggled on or off.

## Assumptions

- Target user: 20–26, first paycheck / student, ₹100–2,000/mo tickets,
  mobile-only, learns from reels + peers.
- Front-end prototype with **mock data** — no real KYC / payments / prices /
  execution.
- **No stock tips.** Groww doesn't give them, and neither does this. Social proof
  stays anonymised/aggregate and baskets are *themes, not advice*.
- Projections assume a **12% p.a.** long-term equity return (stated everywhere it
  appears; not a guarantee).

## What's in scope vs out

- **In scope:** the standard Groww surface (Stocks, F&O, MTF, Mutual Funds, US
  Stocks, IPO, Gold/SGB, FDs, Bonds, ETFs, watchlist, portfolio) reskinned,
  **plus** the Gen Z layer as a toggle.
- **Out of scope:** real backend, KYC/AML, payment rails, live prices, order
  routing, tax filing, regulatory approval.

---

## Features

### Base app (the real Groww surface — always present)
- Search bar + **Nifty 50 / Sensex / Bank Nifty** indices strip, notifications,
  profile.
- **Product grid:** Stocks, F&O, Mutual Funds, US Stocks, IPO, Gold/SGB, FDs,
  Bonds, ETFs, MTF — every tile does something.
- Watchlist, **Groww Digest** / Explore feed, **Holdings/Portfolio** with P&L +
  (mock) XIRR and an allocation donut.
- Flat **₹20 brokerage**, **zero-commission direct** mutual funds, **SIP from
  ₹100**, SIP calculator, compare funds, IPO apply + allotment status, biometric
  app-lock placeholder.

### Gen Z layer (a profile toggle — default ON for the demo)
1. **Quiz onboarding → starter portfolio.** A 4-question personality risk quiz
   (not a form) → Cautious / Balanced / Growth → starter portfolio (index +
   flexi-cap ± satellite) → 10-yr projection of ₹500/mo → one-tap "Start first
   SIP ₹500". Works end-to-end.
2. **Goal-based investing.** Goa, iPhone, emergency fund, FIRE — cards with
   progress rings and on-track/behind status. Create-goal **back-solves the
   monthly SIP** and suggests a fund category in ≤3 taps.
3. **Round-ups / micro-investing.** "₹247 rounded up from 18 UPI spends — invest
   it?" auto-invests spare change.
4. **SIP streak habit engine.** Flame + month count + badges — framed on
   **discipline**, not trade frequency.
5. **Groww Buddy copilot.** A calm plain-language coach (FAB → chat sheet).
   Explains jargon, de-escalates panic/FOMO, is context-aware of the concentrated
   mock portfolio, and **never gives buy/sell calls.** Offline intent engine by
   default; optional live-AI path behind an env flag (see below).
6. **Learn feed.** Vertical 60-second cards (SIP, index vs active, expense ratio,
   what F&O is + why it's risky, ELSS/80C, diversification), each ending in a
   1-question quiz, with a daily-2-min streak + XP. Some products are
   **learn-to-unlock.**
7. **Community (compliance-safe, no tips).** Anonymised "people your age"
   aggregate stats + top fund **categories** + theme baskets (Green/ESG, Made in
   India, Brands I use) labelled "not advice".
8. **Responsible-investing guardrails.** F&O is **locked by default** — unlocking
   needs a reality check ("~9 in 10 individual F&O traders lose money") + an
   explicit "I understand the risk" checkbox + a 3-question quiz + a **24-hour
   cooling-off** (with a dev "skip timer"). The **4th simulated trade/day** is
   blocked with a cooling-off nudge, there's a one-tap "Pause / talk to Buddy",
   and a **"protection first"** nudge appears while the emergency fund is ₹0.
9. **Radical transparency.** "What you actually pay" (₹0 direct-MF commission vs a
   regular plan) + an ELSS/80C tax-saved nudge, in plain language.

Both worlds share **one mock dataset** (`src/mock/`), so numbers match
everywhere, and the Gen Z toggle genuinely shows/hides the layer.

---

## Tech

- **Vite + React + TypeScript + Tailwind CSS**
- **Zustand** — one store (`src/store/useStore.ts`): user, portfolio, goals,
  streak, session counter, F&O unlock, Gen Z toggle, trades/day, round-ups, theme.
- **recharts** (projections + allocation donut), **lucide-react** (icons),
  **react-router-dom** (HashRouter tabs).
- Brand tokens live in `tailwind.config.js`, backed by CSS variables in
  `src/index.css` for a light/dark-aware palette (default light).

```
src/
  buddy/engine.ts        # Groww Buddy: offline coach + optional live-AI path
  components/            # PhoneFrame, TopBar, BottomTabs, Sheet, Buddy, cards…
  lib/                   # finance (SIP back-solve, projection), formatting
  mock/                  # ONE source of truth: funds, stocks, goals, learn, …
  screens/               # Home, Goals, Learn, Community, Portfolio, MutualFunds,
                         # Stocks, FnO, IPO, Explore, Onboarding
  store/useStore.ts      # single Zustand store
```

---

## Run & deploy

```bash
npm install
npm run dev        # local dev at http://localhost:5173
npm run build      # type-check + production build to /dist
npm run preview    # preview the production build
```

**Deploy (Vercel / Netlify / any static host):** build command `npm run build`,
output directory `dist`. The app uses a relative base and a `HashRouter`, so it
works on a static host with no server-side rewrites.

## Groww Buddy — live-AI path (local dev only)

By default Buddy runs a **local intent-matched engine** with no network, so the
deployed/shared link always works. An optional live path calls the Anthropic API:

```bash
cp .env.example .env
# set VITE_USE_LIVE_AI=true and VITE_ANTHROPIC_API_KEY=... (local dev only)
```

The system prompt hard-codes the no-tips / coach / de-escalate rules, and any
error falls back to the offline engine. A published static page **cannot** reach
`api.anthropic.com`, and you must never ship a key in client code — so keep the
live path off for any deployed build.

---

## Acceptance / eval checklist

- ✅ Both worlds work; the Gen Z toggle shows/hides the layer; numbers share one
  dataset.
- ✅ Onboarding → starter portfolio → first SIP works end-to-end.
- ✅ Create-goal recomputes (back-solves) the monthly SIP.
- ✅ F&O stays locked until quiz + reality check + 24h cooling-off.
- ✅ Buddy never gives a buy/sell tip.
- ✅ An info sheet states: prototype, mock data, no real transactions/KYC/prices.
- ✅ `npm run build` passes; mobile-first and responsive.
