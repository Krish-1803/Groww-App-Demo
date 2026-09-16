// ---------------------------------------------------------------------------
// Groww Buddy: a calm plain-language COACH, never a tipster.
//
// Two paths behind VITE_USE_LIVE_AI (Prompt 2):
//  - false (DEFAULT): offline, intent-matched engine so the shared link always
//    works with no network and no key.
//  - true (LOCAL DEV ONLY): calls the Anthropic API with a system prompt that
//    hard-codes the no-tips / coach / de-escalate rules. Falls back to the
//    offline engine on ANY error.
//
// A published static page cannot reach api.anthropic.com, so the live path is
// for local development only and never ships a key.
// ---------------------------------------------------------------------------

import { BUDDY_ANSWERS, BUDDY_FALLBACK } from '../mock/data'
import type { BuddyAnswer } from '../mock/types'

export const USE_LIVE_AI =
  (import.meta.env.VITE_USE_LIVE_AI ?? 'false') === 'true'

export interface BuddyReply {
  text: string
  chips?: string[]
  source: 'offline' | 'live'
}

/** Normalise a query for keyword matching. */
function norm(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9&\s]/g, ' ')
}

/** Score an answer by how many of its intents appear in the query. */
function scoreAnswer(query: string, a: BuddyAnswer): number {
  const q = norm(query)
  let score = 0
  for (const intent of a.intents) {
    if (q.includes(intent)) {
      // Longer, more specific phrases weigh more.
      score += intent.includes(' ') ? 3 : 1
    }
  }
  return score
}

/** The offline coach: pick the best-matching scripted answer, else fallback. */
export function offlineReply(query: string): BuddyReply {
  let best: BuddyAnswer | null = null
  let bestScore = 0
  for (const a of BUDDY_ANSWERS) {
    const s = scoreAnswer(query, a)
    if (s > bestScore) {
      bestScore = s
      best = a
    }
  }
  if (best && bestScore > 0) {
    return { text: best.answer, chips: best.chips, source: 'offline' }
  }
  const greeting = BUDDY_ANSWERS.find((a) => a.id === 'greeting')
  return { text: BUDDY_FALLBACK, chips: greeting?.chips, source: 'offline' }
}

const SYSTEM_PROMPT = `You are Groww Buddy, a calm, plain-language money coach for a first-time Indian investor aged ~22.

HARD RULES (never break):
- You are NOT a tipster. Never give buy or sell calls on any stock, fund, crypto or asset. If asked "should I buy X?", reframe to time horizon, diversification, and why chasing trending names is speculation, not investing.
- De-escalate panic. If the market is falling, reassure: staying invested and continuing the SIP means buying cheaper units; selling locks in losses. Offer to show the long-term projection.
- Explain jargon (SIP, index fund, expense ratio, F&O, ELSS, 80C) in one or two plain sentences, each with a line on "why it matters at 22".
- Be context-aware: the user's mock portfolio is concentrated (~90% in one flexi-cap fund) with no emergency fund, so gently flag concentration and protection-first when relevant.
- Keep replies short (2-4 sentences), warm, and never preachy. Rupee amounts in ₹.
- Nothing is investment advice; past performance does not guarantee future returns.`

/** The live path: Anthropic API, LOCAL DEV ONLY, falls back on any error. */
export async function liveReply(
  query: string,
  history: { role: 'user' | 'assistant'; content: string }[] = [],
): Promise<BuddyReply> {
  try {
    const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
    if (!apiKey) throw new Error('no key')
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: [
          ...history.map((h) => ({ role: h.role, content: h.content })),
          { role: 'user', content: query },
        ],
      }),
    })
    if (!res.ok) throw new Error(`http ${res.status}`)
    const data = await res.json()
    const text = (data.content ?? [])
      .filter((b: { type: string }) => b.type === 'text')
      .map((b: { text: string }) => b.text)
      .join('\n')
      .trim()
    if (!text) throw new Error('empty')
    return { text, source: 'live' }
  } catch {
    // Any failure (no key, offline, published page, CORS) → offline coach.
    return offlineReply(query)
  }
}

/** Single entry point used by the UI. */
export async function askBuddy(
  query: string,
  history: { role: 'user' | 'assistant'; content: string }[] = [],
): Promise<BuddyReply> {
  if (USE_LIVE_AI) return liveReply(query, history)
  return offlineReply(query)
}
