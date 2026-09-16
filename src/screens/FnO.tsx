// F&O gating (responsible-investing centrepiece). Locked by default. Unlock
// needs: a reality check + "I understand the risk" checkbox → a 3-question quiz
// → a 24h cooling-off (with a dev "skip timer") → explicit unlock. Once open,
// a Pause/talk-to-Buddy action and the 4th-trade/day block apply.

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, ArrowLeft, Check, Clock, Lock, MessageCircle, Unlock, X } from 'lucide-react'
import { useStore } from '../store/useStore'
import { cx, inr } from '../lib/utils'
import { BROKERAGE_FLAT } from '../mock/data'
import { Button, Card, ComplianceLine } from '../components/primitives'
import { BuddyChat } from '../components/Buddy'
import { OvertradeModal } from '../components/OvertradeModal'

const QUIZ = [
  {
    q: 'Roughly how many individual F&O traders lose money?',
    options: ['About 1 in 10', 'About half', 'About 9 in 10'],
    correct: 2,
  },
  {
    q: 'Leverage in F&O means…',
    options: ['Your risk is capped', 'Gains AND losses are magnified', 'You can’t lose more than you invest'],
    correct: 1,
  },
  {
    q: 'Before trading F&O, you should first have…',
    options: ['An emergency fund & clear risk appetite', 'A hot tip from a reel', 'As much leverage as possible'],
    correct: 0,
  },
]

export function FnO() {
  const navigate = useNavigate()
  const fno = useStore((s) => s.fno)
  const acknowledgeRisk = useStore((s) => s.acknowledgeFnoRisk)
  const passQuiz = useStore((s) => s.passFnoQuiz)
  const startCooloff = useStore((s) => s.startCooloff)
  const skipCooloff = useStore((s) => s.skipCooloff)
  const finalize = useStore((s) => s.finalizeFnoUnlock)
  const [buddy, setBuddy] = useState(false)

  if (fno.unlocked) return <FnoUnlocked onBack={() => navigate(-1)} onBuddy={() => setBuddy(true)} buddy={buddy} setBuddy={setBuddy} />

  return (
    <div className="space-y-4 px-4 pb-6 pt-2">
      <div className="flex items-center gap-2">
        <button onClick={() => navigate(-1)} className="rounded-full p-1.5 text-ink hover:bg-canvas" aria-label="Back">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="flex items-center gap-2 text-xl font-extrabold text-ink">
            F&O <Lock size={16} className="text-warn" />
          </h1>
          <p className="text-xs text-muted">Locked by default. This is speculation, not investing.</p>
        </div>
      </div>

      {/* Step 1: reality check + checkbox */}
      <StepBlock n={1} title="Reality check" done={fno.acknowledgedRisk}>
        <div className="rounded-2xl bg-danger/[0.07] p-4">
          <p className="flex items-center gap-2 font-bold text-danger">
            <AlertTriangle size={18} /> ~9 in 10 individual F&O traders lose money
          </p>
          <p className="mt-1.5 text-sm text-muted">
            That’s from SEBI’s own study, where the average loser lost over ₹1 lakh. F&O uses leverage, so
            losses can pile up faster than any SIP builds wealth.
          </p>
        </div>
        {!fno.acknowledgedRisk ? (
          <label className="mt-3 flex cursor-pointer items-start gap-2.5 rounded-xl border border-line p-3">
            <input
              type="checkbox"
              onChange={(e) => e.target.checked && acknowledgeRisk()}
              className="mt-0.5 h-5 w-5 accent-[color:rgb(var(--c-danger))]"
            />
            <span className="text-sm text-ink">
              I understand the risk. I know most people lose money trading F&O and I could lose more than
              I expect.
            </span>
          </label>
        ) : (
          <p className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-positive">
            <Check size={16} /> Risk acknowledged
          </p>
        )}
      </StepBlock>

      {/* Step 2: 3-question quiz */}
      <StepBlock n={2} title="3-question quiz" done={fno.quizPassed} locked={!fno.acknowledgedRisk}>
        {fno.acknowledgedRisk && !fno.quizPassed && <FnoQuiz onPass={passQuiz} />}
        {fno.quizPassed && (
          <p className="flex items-center gap-1.5 text-sm font-semibold text-positive">
            <Check size={16} /> Passed. You clearly understand the risks.
          </p>
        )}
      </StepBlock>

      {/* Step 3: 24h cooling-off */}
      <StepBlock n={3} title="24-hour cooling-off" done={cooloffDone(fno.cooloffUntil)} locked={!fno.quizPassed}>
        {fno.quizPassed && (
          <CoolingOff
            cooloffUntil={fno.cooloffUntil}
            onStart={startCooloff}
            onSkip={skipCooloff}
          />
        )}
      </StepBlock>

      <Button
        full
        size="lg"
        disabled={!(fno.acknowledgedRisk && fno.quizPassed && cooloffDone(fno.cooloffUntil))}
        onClick={finalize}
      >
        <Unlock size={18} /> Unlock F&O
      </Button>

      <Button variant="outline" full onClick={() => setBuddy(true)}>
        <MessageCircle size={16} /> Not sure? Talk to Buddy first
      </Button>

      <ComplianceLine />
      <BuddyChat open={buddy} onClose={() => setBuddy(false)} />
    </div>
  )
}

function cooloffDone(until: number | null): boolean {
  return until !== null && Date.now() >= until
}

function StepBlock({
  n,
  title,
  children,
  done,
  locked,
}: {
  n: number
  title: string
  children?: React.ReactNode
  done?: boolean
  locked?: boolean
}) {
  return (
    <Card className={cx('p-4', locked && 'opacity-50')}>
      <div className="mb-2 flex items-center gap-2">
        <span
          className={cx(
            'flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold',
            done ? 'bg-positive text-white' : 'bg-canvas text-muted',
          )}
        >
          {done ? <Check size={14} /> : n}
        </span>
        <p className="font-bold text-ink">{title}</p>
      </div>
      {!locked && children}
      {locked && <p className="text-xs text-muted">Complete the previous step first.</p>}
    </Card>
  )
}

function FnoQuiz({ onPass }: { onPass: () => void }) {
  const [answers, setAnswers] = useState<(number | null)[]>([null, null, null])
  const [submitted, setSubmitted] = useState(false)

  const allAnswered = answers.every((a) => a !== null)
  const allCorrect = QUIZ.every((q, i) => answers[i] === q.correct)

  const submit = () => {
    setSubmitted(true)
    if (allCorrect) onPass()
  }

  return (
    <div className="space-y-4">
      {QUIZ.map((q, qi) => (
        <div key={qi}>
          <p className="mb-2 text-sm font-semibold text-ink">{qi + 1}. {q.q}</p>
          <div className="space-y-1.5">
            {q.options.map((o, oi) => {
              const chosen = answers[qi] === oi
              const showWrong = submitted && chosen && oi !== q.correct
              const showRight = submitted && oi === q.correct
              return (
                <button
                  key={oi}
                  onClick={() => { if (!submitted) setAnswers((a) => a.map((v, i) => (i === qi ? oi : v))) }}
                  className={cx(
                    'flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-left text-sm transition',
                    showRight ? 'border-positive bg-positive/10 text-ink' : showWrong ? 'border-danger bg-danger/10 text-ink' : chosen ? 'border-primary bg-primary/10 text-ink' : 'border-line text-ink',
                  )}
                >
                  {o}
                  {showRight && <Check size={15} className="text-positive" />}
                  {showWrong && <X size={15} className="text-danger" />}
                </button>
              )
            })}
          </div>
        </div>
      ))}
      {submitted && !allCorrect ? (
        <div className="rounded-xl bg-danger/10 p-3 text-sm text-ink">
          Some answers are off. Review them above, then try again. This gate exists for a reason.
          <Button variant="outline" size="sm" full className="mt-2" onClick={() => { setSubmitted(false); setAnswers([null, null, null]) }}>
            Retry quiz
          </Button>
        </div>
      ) : (
        <Button full disabled={!allAnswered} onClick={submit}>
          Submit answers
        </Button>
      )}
    </div>
  )
}

function CoolingOff({
  cooloffUntil,
  onStart,
  onSkip,
}: {
  cooloffUntil: number | null
  onStart: () => void
  onSkip: () => void
}) {
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    if (cooloffUntil === null) return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [cooloffUntil])

  if (cooloffUntil === null) {
    return (
      <div>
        <p className="text-sm text-muted">
          A mandatory 24-hour pause between deciding and trading. It’s the single best filter against
          FOMO-driven mistakes.
        </p>
        <Button full className="mt-3" onClick={onStart}>
          <Clock size={16} /> Start 24-hour cooling-off
        </Button>
      </div>
    )
  }

  const remaining = Math.max(0, cooloffUntil - now)
  if (remaining <= 0) {
    return (
      <p className="flex items-center gap-1.5 text-sm font-semibold text-positive">
        <Check size={16} /> Cooling-off complete
      </p>
    )
  }

  const h = Math.floor(remaining / 3.6e6)
  const m = Math.floor((remaining % 3.6e6) / 6e4)
  const s = Math.floor((remaining % 6e4) / 1000)

  return (
    <div>
      <div className="flex items-center gap-3 rounded-xl bg-canvas p-3">
        <Clock size={18} className="text-warn" />
        <div className="flex-1">
          <p className="tnum text-lg font-extrabold text-ink">{h}h {m}m {s}s</p>
          <p className="text-[11px] text-muted">left in your cooling-off period</p>
        </div>
      </div>
      <button onClick={onSkip} className="mt-2 w-full text-center text-[11px] font-medium text-muted underline">
        (dev) skip timer
      </button>
    </div>
  )
}

// --- Unlocked F&O surface (still guarded) ------------------------------
function FnoUnlocked({
  onBack,
  buddy,
  setBuddy,
}: {
  onBack: () => void
  onBuddy: () => void
  buddy: boolean
  setBuddy: (v: boolean) => void
}) {
  const tradesToday = useStore((s) => s.tradesToday)
  const recordTrade = useStore((s) => s.recordTrade)
  const [overtrade, setOvertrade] = useState(false)
  const [placed, setPlaced] = useState(false)

  const tryTrade = () => {
    if (tradesToday >= 3) {
      setOvertrade(true)
      return
    }
    recordTrade()
    setPlaced(true)
    setTimeout(() => setPlaced(false), 1600)
  }

  return (
    <div className="space-y-4 px-4 pb-6 pt-2">
      <div className="flex items-center gap-2">
        <button onClick={onBack} className="rounded-full p-1.5 text-ink hover:bg-canvas" aria-label="Back">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="flex items-center gap-2 text-xl font-extrabold text-ink">F&O <Unlock size={15} className="text-positive" /></h1>
          <p className="text-xs text-muted">Unlocked. Trade responsibly, the odds don’t change.</p>
        </div>
      </div>

      <Card className="border-warn/40 bg-warn/[0.06] p-3">
        <p className="text-xs text-muted">
          Reminder: ~9 in 10 lose money here. Your SIPs are still your real wealth engine.
        </p>
      </Card>

      <Button variant="outline" full onClick={() => setBuddy(true)}>
        <MessageCircle size={16} /> Pause / talk to Buddy
      </Button>

      <Card className="p-4">
        <p className="text-sm font-bold text-ink">NIFTY 24,200 CE · Weekly</p>
        <div className="mt-2 grid grid-cols-3 gap-2 text-center text-sm">
          <div className="rounded-lg bg-canvas p-2"><p className="tnum font-bold text-ink">142.5</p><p className="text-[10px] text-muted">LTP</p></div>
          <div className="rounded-lg bg-canvas p-2"><p className="tnum font-bold text-positive">+8.3%</p><p className="text-[10px] text-muted">Day</p></div>
          <div className="rounded-lg bg-canvas p-2"><p className="tnum font-bold text-ink">75</p><p className="text-[10px] text-muted">Lot</p></div>
        </div>
        <p className="mt-2 text-[11px] text-muted">Brokerage {inr(BROKERAGE_FLAT)} · mock chain, no real order.</p>
        <Button full className="mt-3" onClick={tryTrade}>
          {placed ? 'Mock order placed' : 'Place mock F&O trade'}
        </Button>
      </Card>

      <Card className="flex items-center justify-between p-3">
        <p className="text-xs text-muted">Simulated trades today</p>
        <div className="flex gap-1">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className={cx('h-2.5 w-6 rounded-full', i < tradesToday ? 'bg-warn' : 'bg-line')} />
          ))}
        </div>
      </Card>

      <ComplianceLine />
      <OvertradeModal open={overtrade} onClose={() => setOvertrade(false)} />
      <BuddyChat open={buddy} onClose={() => setBuddy(false)} />
    </div>
  )
}
