// Sticky top bar: profile avatar + search + market ticker + theme/notifications.
// The avatar opens the profile menu; the search opens a working search sheet.

import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bell,
  BookOpen,
  CalendarClock,
  Fingerprint,
  Flame,
  Info,
  LineChart,
  Moon,
  Receipt,
  RotateCcw,
  Rocket,
  Search,
  Sun,
  TrendingUp,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { useStore } from '../store/useStore'
import { FUNDS, STOCKS, IPOS, USER } from '../mock/data'
import { cx, inr } from '../lib/utils'
import { Sheet } from './Sheet'
import { IndicesStrip } from './IndicesStrip'
import { Button } from './primitives'

export function TopBar({ onOpenInfo }: { onOpenInfo: () => void }) {
  const genZ = useStore((s) => s.genZMode)
  const toggleGenZ = useStore((s) => s.toggleGenZ)
  const theme = useStore((s) => s.theme)
  const toggleTheme = useStore((s) => s.toggleTheme)
  const reset = useStore((s) => s.reset)
  const streak = useStore((s) => s.streakMonths)
  const notificationsRead = useStore((s) => s.notificationsRead)
  const markNotificationsRead = useStore((s) => s.markNotificationsRead)
  const [menu, setMenu] = useState(false)
  const [notif, setNotif] = useState(false)
  const [search, setSearch] = useState(false)

  const openNotif = () => {
    markNotificationsRead()
    setNotif(true)
  }

  return (
    <>
      <div className="sticky top-0 z-20 bg-canvas/95 pt-2.5 backdrop-blur">
        <div className="flex items-center gap-2 px-3">
          {/* Profile avatar (opens the profile menu) */}
          <button
            onClick={() => setMenu(true)}
            className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-teal text-sm font-extrabold text-white shadow-soft"
            aria-label="Profile"
          >
            {USER.name[0]}
            {genZ && (
              <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-card">
                <Zap size={9} className="text-teal" />
              </span>
            )}
          </button>

          {/* Search (opens the search sheet) */}
          <button
            onClick={() => setSearch(true)}
            className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-line bg-card px-3 py-2 text-left"
          >
            <Search size={16} className="shrink-0 text-muted" />
            <span className="truncate text-sm text-muted">Search stocks, funds, IPOs</span>
          </button>

          <button
            onClick={toggleTheme}
            className="rounded-xl border border-line bg-card p-2 text-ink"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
          </button>
          <button
            onClick={openNotif}
            className="relative rounded-xl border border-line bg-card p-2 text-ink"
            aria-label="Notifications"
          >
            <Bell size={17} />
            {!notificationsRead && (
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-danger" />
            )}
          </button>
        </div>

        {/* Market ticker */}
        <div className="mt-2">
          <IndicesStrip />
        </div>
      </div>

      <SearchSheet open={search} onClose={() => setSearch(false)} />

      {/* Notifications sheet */}
      <Sheet open={notif} onClose={() => setNotif(false)} title="Notifications">
        <div className="space-y-2">
          {([
            { icon: Flame, t: 'Streak alert', b: `You're on a ${streak}-month SIP streak. One more and you unlock the Disciplined badge.` },
            { icon: CalendarClock, t: 'SIP due 5 Oct', b: 'Your ₹500 index SIP runs on the 5th. Nothing to do, it’s automatic.' },
            { icon: Receipt, t: 'IPO update', b: 'Oravel (OYO) allotment status is available. Tap IPO to check.' },
            { icon: BookOpen, t: 'New Learn card', b: '“What F&O is, and why it’s risky” is live. 60 seconds, unlocks a product.' },
          ] as { icon: LucideIcon; t: string; b: string }[]).map((n, i) => {
            const Icon = n.icon
            return (
              <div key={i} className="flex gap-3 rounded-xl border border-line bg-canvas p-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-teal">
                  <Icon size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">{n.t}</p>
                  <p className="mt-0.5 text-xs text-muted">{n.b}</p>
                </div>
              </div>
            )
          })}
        </div>
      </Sheet>

      {/* Profile / settings sheet */}
      <Sheet open={menu} onClose={() => setMenu(false)} title="Profile">
        <div className="space-y-3">
          <div className="flex items-center gap-3 rounded-2xl bg-canvas p-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-teal text-lg font-extrabold text-white">
              {USER.name[0]}
            </div>
            <div className="flex-1">
              <p className="font-bold text-ink">{USER.name}</p>
              <p className="text-xs text-muted">Age {USER.age} · KYC: {USER.kyc}</p>
            </div>
          </div>

          <ToggleRow
            icon={<Zap size={18} className="text-teal" />}
            title="Gen Z mode"
            sub="On for ages 20-26 · habits, learning & guardrails"
            on={genZ}
            onToggle={toggleGenZ}
          />
          <ToggleRow
            icon={theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            title="Dark theme"
            sub="Easier on the eyes at night"
            on={theme === 'dark'}
            onToggle={toggleTheme}
          />

          <div className="flex items-center gap-3 rounded-2xl border border-line p-3">
            <Fingerprint size={18} className="text-muted" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-ink">Biometric app lock</p>
              <p className="text-xs text-muted">Face ID / fingerprint unlock</p>
            </div>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-teal">On</span>
          </div>

          <button
            onClick={() => {
              setMenu(false)
              onOpenInfo()
            }}
            className="flex w-full items-center gap-3 rounded-2xl border border-line p-3 text-left"
          >
            <Info size={18} className="text-muted" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-ink">About Groww</p>
              <p className="text-xs text-muted">What this app is and how it works</p>
            </div>
          </button>

          <Button
            variant="outline"
            full
            onClick={() => {
              reset()
              setMenu(false)
            }}
          >
            <RotateCcw size={16} /> Reset app
          </Button>
        </div>
      </Sheet>
    </>
  )
}

interface Result {
  kind: 'Stock' | 'Fund' | 'IPO'
  title: string
  sub: string
  right?: string
  rightUp?: boolean
  icon: LucideIcon
  to: string
}

function SearchSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate()
  const [q, setQ] = useState('')

  const results = useMemo<Result[]>(() => {
    const query = q.trim().toLowerCase()
    if (!query) return []
    const out: Result[] = []
    for (const s of STOCKS) {
      if (`${s.symbol} ${s.name} ${s.sector}`.toLowerCase().includes(query)) {
        out.push({ kind: 'Stock', title: s.symbol, sub: s.name, right: inr(s.price, 1), rightUp: s.changePct >= 0, icon: TrendingUp, to: '/stocks' })
      }
    }
    for (const f of FUNDS) {
      if (`${f.name} ${f.amc} ${f.category}`.toLowerCase().includes(query)) {
        out.push({ kind: 'Fund', title: f.name, sub: `${f.category} · ${f.riskLabel} risk`, right: `${f.return3y}%`, rightUp: true, icon: LineChart, to: '/mutual-funds' })
      }
    }
    for (const ipo of IPOS) {
      if (ipo.name.toLowerCase().includes(query)) {
        out.push({ kind: 'IPO', title: ipo.name, sub: `${ipo.priceBand} · ${ipo.status}`, icon: Rocket, to: '/ipo' })
      }
    }
    return out.slice(0, 12)
  }, [q])

  const go = (to: string) => {
    onClose()
    setQ('')
    navigate(to)
  }

  const suggestions = ['Nifty', 'HDFC', 'Index', 'Swiggy', 'Gold']

  return (
    <Sheet open={open} onClose={onClose} title="Search">
      <div className="flex items-center gap-2 rounded-xl border border-line bg-canvas px-3 py-2.5">
        <Search size={17} className="text-muted" />
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Stocks, funds, IPOs…"
          className="w-full bg-transparent text-sm text-ink placeholder:text-muted focus:outline-none"
        />
        {q && (
          <button onClick={() => setQ('')} className="text-xs font-semibold text-teal">
            Clear
          </button>
        )}
      </div>

      {!q && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Try searching</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => setQ(s)}
                className="rounded-full bg-canvas px-3 py-1.5 text-sm font-medium text-ink"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {q && results.length === 0 && (
        <p className="py-8 text-center text-sm text-muted">No matches for “{q}”.</p>
      )}

      <div className="mt-3 space-y-1.5">
        {results.map((r, i) => {
          const Icon = r.icon
          return (
            <button
              key={i}
              onClick={() => go(r.to)}
              className="flex w-full items-center gap-3 rounded-xl border border-line bg-card px-3 py-2.5 text-left active:scale-[0.99] transition"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-teal">
                <Icon size={17} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink">{r.title}</p>
                <p className="truncate text-[11px] text-muted">{r.sub}</p>
              </div>
              <div className="text-right">
                {r.right && (
                  <p className={cx('tnum text-sm font-bold', r.kind === 'Stock' ? (r.rightUp ? 'text-positive' : 'text-danger') : r.kind === 'Fund' ? 'text-positive' : 'text-ink')}>
                    {r.right}
                  </p>
                )}
                <p className="text-[10px] text-muted">{r.kind}</p>
              </div>
            </button>
          )
        })}
      </div>
    </Sheet>
  )
}

function ToggleRow({
  icon,
  title,
  sub,
  on,
  onToggle,
}: {
  icon: React.ReactNode
  title: string
  sub: string
  on: boolean
  onToggle: () => void
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-line p-3">
      <div className="text-ink">{icon}</div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-ink">{title}</p>
        <p className="text-xs text-muted">{sub}</p>
      </div>
      <button
        onClick={onToggle}
        className={cx('relative h-6 w-11 rounded-full transition', on ? 'bg-primary' : 'bg-line')}
        aria-pressed={on}
        aria-label={title}
      >
        <span
          className={cx(
            'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all',
            on ? 'left-[22px]' : 'left-0.5',
          )}
        />
      </button>
    </div>
  )
}
