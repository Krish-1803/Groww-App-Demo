// Bite-sized Learn feed: vertical 60-sec cards each ending in a 1-Q quiz;
// daily-2-min streak + XP; some cards are LEARN-TO-UNLOCK (e.g. the F&O card).

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Check, ChevronRight, Clock, Lock, Sparkles, X } from 'lucide-react'
import { useStore } from '../store/useStore'
import type { LearnCard } from '../mock/types'
import { LEARN_CARDS } from '../mock/data'
import { cx } from '../lib/utils'
import { Sheet } from '../components/Sheet'
import { Button, Card } from '../components/primitives'

export function Learn() {
  const learned = useStore((s) => s.learnedCardIds)
  const xp = useStore((s) => s.xp)
  const [active, setActive] = useState<LearnCard | null>(null)
  const doneCount = learned.length

  return (
    <div className="space-y-4 px-4 pb-4 pt-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-ink">Learn</h1>
          <p className="text-xs text-muted">2 minutes a day. Quizzes give XP. Some unlock products.</p>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-bold text-teal">
          <Sparkles size={14} /> {xp} XP
        </div>
      </div>

      {/* daily streak strip */}
      <Card className="flex items-center gap-3 p-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-warn/15 text-2xl">📚</div>
        <div className="flex-1">
          <p className="text-sm font-bold text-ink">Daily 2-min streak</p>
          <p className="text-xs text-muted">{doneCount} of {LEARN_CARDS.length} cards done today</p>
        </div>
        <div className="flex gap-1">
          {LEARN_CARDS.map((c, i) => (
            <span
              key={c.id}
              className={cx('h-2 w-2 rounded-full', i < doneCount ? 'bg-warn' : 'bg-line')}
            />
          ))}
        </div>
      </Card>

      <div className="space-y-3">
        {LEARN_CARDS.map((c) => {
          const isDone = learned.includes(c.id)
          return (
            <Card key={c.id} className="p-4" onClick={() => setActive(c)}>
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-2xl">
                  {c.emoji}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-canvas px-2 py-0.5 text-[10px] font-semibold text-muted">
                      {c.category}
                    </span>
                    {c.unlocks === 'fno' && (
                      <span className="flex items-center gap-1 rounded-full bg-warn/15 px-2 py-0.5 text-[10px] font-semibold text-warn">
                        <Lock size={10} /> Unlocks F&O
                      </span>
                    )}
                    {isDone && <Check size={14} className="text-positive" />}
                  </div>
                  <p className="mt-1 font-bold leading-tight text-ink">{c.title}</p>
                  <p className="mt-1 flex items-center gap-1 text-[11px] text-muted">
                    <Clock size={11} /> {c.readSeconds}s read · +{c.xp} XP
                  </p>
                </div>
                <ChevronRight size={18} className="mt-1 text-muted" />
              </div>
            </Card>
          )
        })}
      </div>

      <LearnReader card={active} onClose={() => setActive(null)} />
    </div>
  )
}

function LearnReader({ card, onClose }: { card: LearnCard | null; onClose: () => void }) {
  const markLearned = useStore((s) => s.markLearned)
  const navigate = useNavigate()
  const [phase, setPhase] = useState<'read' | 'quiz' | 'result'>('read')
  const [choice, setChoice] = useState<number | null>(null)

  if (!card) return null

  const correct = choice === card.quiz.correctIndex

  const finishQuiz = () => {
    if (choice === null) return
    if (correct) markLearned(card.id, card.xp)
    setPhase('result')
  }

  const close = () => {
    onClose()
    setTimeout(() => {
      setPhase('read')
      setChoice(null)
    }, 250)
  }

  return (
    <Sheet open={!!card} onClose={close} title={
      <span className="flex items-center gap-2"><span className="text-xl">{card.emoji}</span>{card.title}</span>
    }>
      {phase === 'read' && (
        <div className="space-y-4">
          {card.body.map((p, i) => (
            <p key={i} className="text-sm leading-relaxed text-ink">
              {p}
            </p>
          ))}
          <Button full size="lg" onClick={() => setPhase('quiz')}>
            Take the 1-question quiz <BookOpen size={16} />
          </Button>
        </div>
      )}

      {phase === 'quiz' && (
        <div className="space-y-4">
          <p className="text-base font-bold text-ink">{card.quiz.question}</p>
          <div className="space-y-2.5">
            {card.quiz.options.map((o, i) => (
              <button
                key={i}
                onClick={() => setChoice(i)}
                className={cx(
                  'flex w-full items-center justify-between rounded-2xl border px-4 py-3.5 text-left text-sm font-semibold transition',
                  choice === i ? 'border-primary bg-primary/10 text-ink' : 'border-line bg-card text-ink',
                )}
              >
                {o}
                <span className={cx('h-4 w-4 rounded-full border-2', choice === i ? 'border-primary bg-primary' : 'border-line')} />
              </button>
            ))}
          </div>
          <Button full size="lg" disabled={choice === null} onClick={finishQuiz}>
            Check answer
          </Button>
        </div>
      )}

      {phase === 'result' && (
        <div className="flex flex-col items-center py-3 text-center">
          <div
            className={cx(
              'mb-3 flex h-16 w-16 items-center justify-center rounded-full',
              correct ? 'bg-positive/15' : 'bg-danger/10',
            )}
          >
            {correct ? <Check size={32} className="text-positive" /> : <X size={32} className="text-danger" />}
          </div>
          <p className="text-lg font-bold text-ink">{correct ? `Nailed it · +${card.xp} XP` : 'Not quite'}</p>
          <p className="mt-1 text-sm text-muted">{card.quiz.explain}</p>

          {card.unlocks === 'fno' && correct && (
            <div className="mt-4 w-full rounded-2xl border border-warn/40 bg-warn/[0.06] p-3 text-left">
              <p className="text-sm font-semibold text-ink">You’ve learned what F&O is. 🔓</p>
              <p className="mt-0.5 text-xs text-muted">
                To actually enable it you still need the reality-check quiz + a 24h cooling-off. That’s
                on purpose.
              </p>
              <Button variant="outline" size="sm" full className="mt-2" onClick={() => { close(); navigate('/fno') }}>
                Go to F&O gate
              </Button>
            </div>
          )}

          <Button full className="mt-5" onClick={close}>
            {correct ? 'Continue' : 'Got it'}
          </Button>
        </div>
      )}
    </Sheet>
  )
}
