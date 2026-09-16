// ---------------------------------------------------------------------------
// Bottom sheet: tap-scrim to dismiss, swipe-down to dismiss, sticky within the
// phone frame. Used for product details, Buddy chat, quizzes, guardrails, etc.
// ---------------------------------------------------------------------------

import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { cx } from '../lib/utils'

export function Sheet({
  open,
  onClose,
  title,
  children,
  maxHeight = '86%',
}: {
  open: boolean
  onClose: () => void
  title?: React.ReactNode
  children: React.ReactNode
  maxHeight?: string
}) {
  const [dragY, setDragY] = useState(0)
  const startY = useRef<number | null>(null)
  const [mounted, setMounted] = useState(open)

  useEffect(() => {
    if (open) setMounted(true)
    else {
      const t = setTimeout(() => setMounted(false), 220)
      return () => clearTimeout(t)
    }
  }, [open])

  if (!mounted) return null

  const onTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY
  }
  const onTouchMove = (e: React.TouchEvent) => {
    if (startY.current === null) return
    const dy = e.touches[0].clientY - startY.current
    if (dy > 0) setDragY(dy)
  }
  const onTouchEnd = () => {
    if (dragY > 90) onClose()
    setDragY(0)
    startY.current = null
  }

  return (
    <div className="absolute inset-0 z-40 flex items-end" role="dialog" aria-modal="true">
      {/* scrim */}
      <div
        className={cx(
          'absolute inset-0 bg-black/50 backdrop-blur-[1px] transition-opacity',
          open ? 'opacity-100' : 'opacity-0',
        )}
        onClick={onClose}
      />
      {/* panel */}
      <div
        className={cx(
          'relative w-full rounded-t-3xl bg-card shadow-lift',
          open ? 'animate-sheet-up' : 'translate-y-full',
        )}
        style={{
          maxHeight,
          transform: dragY ? `translateY(${dragY}px)` : undefined,
          transition: dragY ? 'none' : 'transform 0.22s cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        <div
          className="flex flex-col items-center pt-2.5"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="h-1.5 w-10 rounded-full bg-line" />
        </div>
        {title && (
          <div className="flex items-center justify-between px-5 pb-2 pt-3">
            <h3 className="text-base font-bold text-ink">{title}</h3>
            <button
              onClick={onClose}
              className="rounded-full p-1.5 text-muted hover:bg-canvas"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        )}
        <div className="no-scrollbar overflow-y-auto px-5 pb-6" style={{ maxHeight: 'calc(86vh - 60px)' }}>
          {children}
        </div>
      </div>
    </div>
  )
}
