// ---------------------------------------------------------------------------
// Small reusable UI primitives. Animations (count-up, ring fill, flame) are
// mount-time and CSS/RAF based so the prototype feels alive (Prompt 4).
// ---------------------------------------------------------------------------

import { useEffect, useRef, useState } from 'react'
import { Info, ShieldCheck } from 'lucide-react'
import { cx, inr } from '../lib/utils'
import { COMPLIANCE_LINE } from '../mock/data'

// --- Count-up number ----------------------------------------------------
export function CountUp({
  value,
  format = (n) => inr(Math.round(n)),
  duration = 700,
  className,
}: {
  value: number
  format?: (n: number) => string
  duration?: number
  className?: string
}) {
  const [display, setDisplay] = useState(0)
  const fromRef = useRef(0)
  const rafRef = useRef<number>()

  useEffect(() => {
    const from = fromRef.current
    const start = performance.now()
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(from + (value - from) * eased)
      if (t < 1) rafRef.current = requestAnimationFrame(step)
      else fromRef.current = value
    }
    rafRef.current = requestAnimationFrame(step)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [value, duration])

  return <span className={cx('tnum', className)}>{format(display)}</span>
}

// --- Progress ring ------------------------------------------------------
export function ProgressRing({
  progress,
  size = 64,
  stroke = 7,
  children,
  color = 'rgb(var(--c-primary))',
  track = 'rgb(var(--c-line))',
}: {
  progress: number // 0..1
  size?: number
  stroke?: number
  children?: React.ReactNode
  color?: string
  track?: string
}) {
  const clamped = Math.max(0, Math.min(1, progress))
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const [offset, setOffset] = useState(c)

  useEffect(() => {
    const id = requestAnimationFrame(() => setOffset(c * (1 - clamped)))
    return () => cancelAnimationFrame(id)
  }, [c, clamped])

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.9s cubic-bezier(0.22,1,0.36,1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  )
}

// --- Streak flame -------------------------------------------------------
export function StreakFlame({ months, size = 'md' }: { months: number; size?: 'sm' | 'md' | 'lg' }) {
  const px = size === 'lg' ? 'text-3xl' : size === 'sm' ? 'text-base' : 'text-xl'
  return (
    <span className="inline-flex items-center gap-1">
      <span className={cx(px, 'animate-flame inline-block')} role="img" aria-label="streak flame">
        🔥
      </span>
      <span className="tnum font-bold">{months}</span>
    </span>
  )
}

// --- Sparkline (tiny inline SVG) ----------------------------------------
export function Sparkline({
  data,
  width = 60,
  height = 22,
  positive,
}: {
  data: number[]
  width?: number
  height?: number
  positive?: boolean
}) {
  if (data.length < 2) return null
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const up = positive ?? data[data.length - 1] >= data[0]
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width
      const y = height - ((v - min) / range) * height
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        points={pts}
        fill="none"
        stroke={up ? 'rgb(var(--c-positive))' : 'rgb(var(--c-danger))'}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// --- Compliance line ----------------------------------------------------
export function ComplianceLine({ text = COMPLIANCE_LINE, className }: { text?: string; className?: string }) {
  return (
    <p className={cx('flex items-start gap-1.5 text-[11px] leading-tight text-muted', className)}>
      <ShieldCheck size={13} className="mt-0.5 shrink-0 opacity-70" />
      <span>{text}</span>
    </p>
  )
}

// --- Not-advice pill ----------------------------------------------------
export function NotAdvicePill({ label = 'Not advice' }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-warn/10 px-2 py-0.5 text-[10px] font-semibold text-warn">
      <Info size={10} /> {label}
    </span>
  )
}

// --- Empty state --------------------------------------------------------
export function EmptyState({
  illustration,
  title,
  body,
  action,
}: {
  illustration: React.ReactNode
  title: string
  body: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-10 text-center animate-fade-in">
      <div className="text-primary">{illustration}</div>
      <div>
        <p className="font-bold text-ink">{title}</p>
        <p className="mt-1 text-sm text-muted">{body}</p>
      </div>
      {action}
    </div>
  )
}

// --- Buttons ------------------------------------------------------------
export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  full,
  disabled,
  className,
  type = 'button',
}: {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'ghost' | 'outline' | 'danger' | 'soft'
  size?: 'sm' | 'md' | 'lg'
  full?: boolean
  disabled?: boolean
  className?: string
  type?: 'button' | 'submit'
}) {
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-2xl transition active:scale-[0.98] disabled:opacity-40 disabled:active:scale-100'
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-5 py-3.5 text-base',
  }
  const variants = {
    primary: 'bg-primary text-white shadow-soft hover:brightness-105',
    danger: 'bg-danger text-white shadow-soft hover:brightness-105',
    soft: 'bg-primary/10 text-teal hover:bg-primary/15',
    outline: 'border border-line text-ink hover:bg-canvas',
    ghost: 'text-teal hover:bg-primary/10',
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cx(base, sizes[size], variants[variant], full && 'w-full', className)}
    >
      {children}
    </button>
  )
}

// --- Card ---------------------------------------------------------------
export function Card({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}) {
  return (
    <div
      onClick={onClick}
      className={cx(
        'rounded-2xl bg-card shadow-card border border-line/60',
        onClick && 'cursor-pointer active:scale-[0.99] transition',
        className,
      )}
    >
      {children}
    </div>
  )
}

// --- Section title ------------------------------------------------------
export function SectionTitle({
  children,
  action,
}: {
  children: React.ReactNode
  action?: React.ReactNode
}) {
  return (
    <div className="mb-2 flex items-center justify-between">
      <h2 className="text-sm font-bold text-ink">{children}</h2>
      {action}
    </div>
  )
}
