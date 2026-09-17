// Auto-scrolling market ticker (Nifty / Sensex / Bank Nifty) that sits under
// the search bar, like a real trading app. The row is duplicated so the
// translateX marquee loops seamlessly.

import { INDICES } from '../mock/data'
import { cx, pct } from '../lib/utils'

function Item({ name, value, changePct }: { name: string; value: number; changePct: number }) {
  const up = changePct >= 0
  return (
    <div className="flex shrink-0 items-center gap-1.5 px-3">
      <span className="text-[11px] font-semibold text-muted">{name}</span>
      <span className="tnum text-[12px] font-bold text-ink">{value.toLocaleString('en-IN')}</span>
      <span className={cx('tnum text-[11px] font-semibold', up ? 'text-positive' : 'text-danger')}>
        {up ? '▲' : '▼'} {pct(changePct, 2)}
      </span>
    </div>
  )
}

export function IndicesStrip() {
  // Duplicate the list so the -50% marquee wraps with no visible seam.
  const row = [...INDICES, ...INDICES, ...INDICES, ...INDICES]
  return (
    <div className="relative overflow-hidden border-y border-line/70 bg-card/60 py-1.5">
      <div className="flex w-max animate-marquee items-center">
        {row.map((idx, i) => (
          <div key={i} className="flex items-center">
            <Item name={idx.name} value={idx.value} changePct={idx.changePct} />
            <span className="h-3 w-px bg-line" />
          </div>
        ))}
      </div>
    </div>
  )
}
