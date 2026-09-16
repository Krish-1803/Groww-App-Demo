# Groww for Gen Z (prototype)

A mobile-first, front-end prototype that layers a habit, learning and guardrail
"Gen Z mode" on top of the real Groww product surface. Built for a Product-Intern
assignment. Everything runs on mock data: no real prices, KYC, payments, or orders.

> Not affiliated with, or endorsed by, Groww. A concept prototype only.

## Thesis

Gen Z isn't a segment Groww has to attract. They're already the engine of new
growth. So the real job is retention and responsible investing, not acquisition.
Two things quietly destroy that value:

1. One-and-done dormancy. Someone opens an account, starts one SIP, and disappears.
2. The "trading, not investing" trap, where F&O and trending-stock FOMO pull
   first-timers straight into losses.

So this isn't a separate app and it isn't a gamified casino. It's a mode that sits
on the real Groww app and can be toggled on or off. It leans on what Groww is
already good at (₹100 SIPs, zero-commission direct mutual funds, a clean UI) and
adds a layer for habits, learning and guardrails on top.

## Assumptions

- Target user is 20 to 26, on a first paycheck or still studying, investing
  ₹100 to ₹2,000 a month, mobile-only, learning from reels and friends.
- This is a front-end prototype on mock data. No real KYC, payments, prices or
  execution.
- No stock tips. Groww doesn't give them and neither does this. Social proof stays
  anonymised and aggregate, and baskets are themes, not advice.
- Projections assume a 12% per year long-term equity return. It's stated wherever
  it appears and it is not a guarantee.

## Scope

In scope: the standard Groww surface (Stocks, F&O, MTF, Mutual Funds, US Stocks,
IPO, Gold/SGB, FDs, Bonds, ETFs, watchlist, portfolio) reskinned, plus the Gen Z
layer as a toggle.

Out of scope: a real backend, KYC/AML, payment rails, live prices, order routing,
tax filing, and regulatory approval.

## Features

### Base app (the real Groww surface, always present)

- Search bar, a Nifty 50 / Sensex / Bank Nifty indices strip, notifications, profile.
- Product grid: Stocks, F&O, Mutual Funds, US Stocks, IPO, Gold/SGB, FDs, Bonds,
  ETFs, MTF. Every tile does something.
- Watchlist, a Groww Digest / Explore feed, and a Holdings/Portfolio view with P&L,
  a mock XIRR, and an allocation donut.
- Flat ₹20 brokerage, zero-commission direct mutual funds, SIP from ₹100, a SIP
  calculator, fund comparison, IPO apply and allotment status, and a biometric
  app-lock placeholder.

### Gen Z layer (a profile toggle, on by default for the demo)

1. Quiz onboarding into a starter portfolio. A 4-question personality risk quiz
   (not a form) sorts you into Cautious, Balanced or Growth, sets up a starter
   portfolio (index plus flexi-cap, with an optional satellite), shows a 10-year
   projection of ₹500/mo, and starts your first SIP in one tap. Works end to end.
2. Goal-based investing. Goa, iPhone, emergency fund and FIRE cards with progress
   rings and an on-track or behind status. Creating a goal back-solves the monthly
   SIP and suggests a fund category in three taps or fewer.
3. Round-ups. "₹247 rounded up from 18 UPI spends, invest it?" auto-invests the
   spare change.
4. A SIP streak engine. Flame, month count and badges, framed on discipline rather
   than trade frequency.
5. Groww Buddy, a copilot. A calm, plain-language coach in a chat sheet. It explains
   jargon, talks people down from panic and FOMO, is aware of the concentrated mock
   portfolio, and never gives buy or sell calls. Offline by default, with an optional
   live-AI path behind an env flag (see below).
6. A Learn feed. Vertical 60-second cards (SIP, index vs active, expense ratio, what
   F&O is and why it's risky, ELSS/80C, diversification), each ending in a one-question
   quiz, with a daily 2-minute streak and XP. Some products are learn-to-unlock.
7. Community, kept compliance-safe. Anonymised "people your age" aggregate stats, top
   fund categories, and theme baskets (Green/ESG, Made in India, Brands I use) clearly
   labelled "not advice".
8. Responsible-investing guardrails. F&O is locked by default. Unlocking it needs a
   reality check ("~9 in 10 individual F&O traders lose money"), an explicit "I
   understand the risk" checkbox, a 3-question quiz, and a 24-hour cooling-off (with
   a dev "skip timer"). The 4th simulated trade of the day is blocked with a
   cooling-off nudge, there's a one-tap "Pause / talk to Buddy", and a "protection
   first" nudge shows while the emergency fund is ₹0.
9. Radical transparency. A "what you actually pay" view (₹0 direct-MF commission vs a
   regular plan) and an ELSS/80C tax-saved nudge, in plain language.

Both worlds share one mock dataset (`src/mock/`), so numbers match everywhere, and
the Gen Z toggle genuinely shows and hides the layer.

## Tech

- Vite, React, TypeScript, Tailwind CSS.
- Zustand for one store (`src/store/useStore.ts`): user, portfolio, goals, streak,
  session counter, F&O unlock, Gen Z toggle, trades per day, round-ups, theme.
- recharts for projections and the allocation donut, lucide-react for icons,
  react-router-dom for the HashRouter tabs.
- Brand tokens live in `tailwind.config.js`, backed by CSS variables in
  `src/index.css` for a light and dark palette (default light).

```
src/
  buddy/engine.ts        Groww Buddy: offline coach + optional live-AI path
  components/            PhoneFrame, TopBar, BottomTabs, Sheet, Buddy, cards, ...
  lib/                   finance (SIP back-solve, projection), formatting
  mock/                  one source of truth: funds, stocks, goals, learn, ...
  screens/               Home, Goals, Learn, Community, Portfolio, MutualFunds,
                         Stocks, FnO, IPO, Explore, Onboarding
  store/useStore.ts      single Zustand store
```

## Run and deploy

```bash
npm install
npm run dev        # local dev at http://localhost:5173
npm run build      # type-check + production build to /dist
npm run preview    # preview the production build
```

To deploy on Vercel, Netlify or any static host: build command `npm run build`,
output directory `dist`. The app uses a relative base and a HashRouter, so it works
on a static host with no server-side rewrites.

## Groww Buddy: live-AI path (local dev only)

By default Buddy runs a local intent-matched engine with no network, so the deployed
or shared link always works. An optional live path calls the Anthropic API:

```bash
cp .env.example .env
# set VITE_USE_LIVE_AI=true and VITE_ANTHROPIC_API_KEY=... (local dev only)
```

The system prompt hard-codes the no-tips, coach and de-escalate rules, and any error
falls back to the offline engine. A published static page cannot reach
`api.anthropic.com`, and you should never ship a key in client code, so keep the live
path off for any deployed build.

## Acceptance checklist

- Both worlds work; the Gen Z toggle shows and hides the layer; numbers share one
  dataset.
- Onboarding into a starter portfolio into a first SIP works end to end.
- Creating a goal recomputes (back-solves) the monthly SIP.
- F&O stays locked until the quiz, reality check and 24-hour cooling-off are done.
- Buddy never gives a buy or sell tip.
- An info sheet states: prototype, mock data, no real transactions, KYC or prices.
- `npm run build` passes; the app is mobile-first and responsive.
