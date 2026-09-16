// Sticky top bar: search + notifications + profile chip. The profile chip opens
// a menu with the Gen Z toggle, theme toggle, biometric-lock placeholder,
// prototype info, and reset.

import { useState } from 'react'
import {
  Bell,
  BookOpen,
  CalendarClock,
  Fingerprint,
  Flame,
  Info,
  Moon,
  Receipt,
  RotateCcw,
  Search,
  Sun,
  User,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { useStore } from '../store/useStore'
import { cx } from '../lib/utils'
import { Sheet } from './Sheet'
import { Button } from './primitives'

export function TopBar({ onOpenInfo }: { onOpenInfo: () => void }) {
  const genZ = useStore((s) => s.genZMode)
  const toggleGenZ = useStore((s) => s.toggleGenZ)
  const theme = useStore((s) => s.theme)
  const toggleTheme = useStore((s) => s.toggleTheme)
  const reset = useStore((s) => s.reset)
  const streak = useStore((s) => s.streakMonths)
  const [menu, setMenu] = useState(false)
  const [notif, setNotif] = useState(false)

  return (
    <>
      <div className="sticky top-0 z-20 bg-canvas/95 pt-3 backdrop-blur">
        <div className="flex items-center gap-1.5 px-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-white font-extrabold shadow-soft">
            g
          </div>
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-line bg-card px-3 py-2">
            <Search size={16} className="shrink-0 text-muted" />
            <input
              className="w-full min-w-0 bg-transparent text-sm text-ink placeholder:text-muted focus:outline-none"
              placeholder="Search"
            />
          </div>
          <button
            onClick={toggleTheme}
            className="rounded-xl border border-line bg-card p-2 text-ink"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
          </button>
          <button
            onClick={() => setNotif(true)}
            className="relative rounded-xl border border-line bg-card p-2 text-ink"
            aria-label="Notifications"
          >
            <Bell size={17} />
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-danger" />
          </button>
          <button
            onClick={() => setMenu(true)}
            className={cx(
              'flex items-center gap-1 rounded-xl border px-2 py-2 text-ink',
              genZ ? 'border-primary/40 bg-primary/10' : 'border-line bg-card',
            )}
            aria-label="Profile"
          >
            <User size={17} />
            {genZ && <Zap size={13} className="text-teal" />}
          </button>
        </div>
      </div>

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
      <Sheet open={menu} onClose={() => setMenu(false)} title="Profile & settings">
        <div className="space-y-3">
          <div className="flex items-center gap-3 rounded-2xl bg-canvas p-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/15 text-teal">
              <User size={20} />
            </div>
            <div className="flex-1">
              <p className="font-bold text-ink">Aarav (demo)</p>
              <p className="text-xs text-muted">KYC: mock · Age 22 · rkkdclaude</p>
            </div>
          </div>

          {/* Gen Z toggle: the switch that shows/hides the whole layer */}
          <ToggleRow
            icon={<Zap size={18} className="text-teal" />}
            title="Gen Z mode"
            sub="Habits, learning & guardrails layer"
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
              <p className="text-xs text-muted">Placeholder, no real auth in the prototype</p>
            </div>
            <span className="rounded-full bg-canvas px-2 py-0.5 text-[10px] font-semibold text-muted">On</span>
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
              <p className="text-sm font-semibold text-ink">About this prototype</p>
              <p className="text-xs text-muted">Mock data · no real transactions</p>
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
            <RotateCcw size={16} /> Reset prototype
          </Button>
        </div>
      </Sheet>
    </>
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
        className={cx(
          'relative h-6 w-11 rounded-full transition',
          on ? 'bg-primary' : 'bg-line',
        )}
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
