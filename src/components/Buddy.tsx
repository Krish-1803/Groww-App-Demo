// Groww Buddy: a floating action button that opens a chat sheet. Uses the
// offline coach by default; the live-AI path is behind VITE_USE_LIVE_AI.

import { useEffect, useRef, useState } from 'react'
import { Send, Sparkles } from 'lucide-react'
import { Sheet } from './Sheet'
import { askBuddy, USE_LIVE_AI } from '../buddy/engine'
import { BUDDY_ANSWERS } from '../mock/data'
import { cx } from '../lib/utils'

interface Msg {
  role: 'user' | 'assistant'
  text: string
  chips?: string[]
}

const greeting = BUDDY_ANSWERS.find((a) => a.id === 'greeting')!

export function BuddyFab() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="absolute bottom-[76px] right-4 z-30 flex items-center gap-1.5 rounded-full bg-ink px-4 py-3 text-white shadow-lift active:scale-95 transition"
        aria-label="Open Groww Buddy"
      >
        <Sparkles size={18} className="text-primary" />
        <span className="text-sm font-semibold">Buddy</span>
      </button>
      <BuddyChat open={open} onClose={() => setOpen(false)} />
    </>
  )
}

export function BuddyChat({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: 'assistant', text: greeting.answer, chips: greeting.chips },
  ])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [msgs, thinking])

  const send = async (text: string) => {
    const q = text.trim()
    if (!q || thinking) return
    const history = msgs.map((m) => ({ role: m.role, content: m.text }))
    setMsgs((m) => [...m, { role: 'user', text: q }])
    setInput('')
    setThinking(true)
    const reply = await askBuddy(q, history)
    setThinking(false)
    setMsgs((m) => [...m, { role: 'assistant', text: reply.text, chips: reply.chips }])
  }

  return (
    <Sheet open={open} onClose={onClose} title={
      <span className="flex items-center gap-2">
        <Sparkles size={18} className="text-primary" /> Groww Buddy
      </span>
    }>
      <div className="flex h-[62vh] flex-col">
        <p className="mb-2 rounded-lg bg-canvas px-3 py-2 text-[11px] text-muted">
          A calm money coach — explains jargon, de-escalates panic, never gives buy/sell tips.
          {USE_LIVE_AI
            ? ' Live AI is ON (preview only).'
            : ' Live AI runs in preview; this link uses the built-in coach.'}
        </p>

        <div ref={scrollRef} className="no-scrollbar flex-1 space-y-3 overflow-y-auto pb-2">
          {msgs.map((m, i) => (
            <div key={i}>
              <div className={cx('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
                <div
                  className={cx(
                    'max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm',
                    m.role === 'user'
                      ? 'rounded-br-md bg-primary text-white'
                      : 'rounded-bl-md bg-canvas text-ink',
                  )}
                >
                  {m.text}
                </div>
              </div>
              {m.chips && m.role === 'assistant' && i === msgs.length - 1 && !thinking && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {m.chips.map((c) => (
                    <button
                      key={c}
                      onClick={() => send(c)}
                      className="rounded-full border border-primary/40 bg-primary/5 px-3 py-1 text-xs font-medium text-teal active:scale-95 transition"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          {thinking && (
            <div className="flex justify-start">
              <div className="flex gap-1 rounded-2xl rounded-bl-md bg-canvas px-4 py-3">
                <Dot /> <Dot delay={0.15} /> <Dot delay={0.3} />
              </div>
            </div>
          )}
        </div>

        <form
          className="mt-2 flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            send(input)
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about SIPs, F&O, a market dip…"
            className="flex-1 rounded-full border border-line bg-canvas px-4 py-2.5 text-sm text-ink placeholder:text-muted focus:border-primary focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || thinking}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white disabled:opacity-40 active:scale-95 transition"
            aria-label="Send"
          >
            <Send size={17} />
          </button>
        </form>
      </div>
    </Sheet>
  )
}

function Dot({ delay = 0 }: { delay?: number }) {
  return (
    <span
      className="h-2 w-2 animate-bounce rounded-full bg-muted"
      style={{ animationDelay: `${delay}s`, animationDuration: '0.9s' }}
    />
  )
}
