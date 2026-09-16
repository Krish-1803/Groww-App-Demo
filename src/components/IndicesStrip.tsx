import { INDICES } from '../mock/data'
import { cx, pct } from '../lib/utils'

export function IndicesStrip() {
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-2">
      {INDICES.map((idx) => {
        const up = idx.changePct >= 0
        return (
          <div
            key={idx.name}
            className="flex shrink-0 items-center gap-2 rounded-xl border border-line/60 bg-card px-3 py-1.5"
          >
            <span className="text-[11px] font-semibold text-muted">{idx.name}</span>
            <span className="tnum text-[13px] font-bold text-ink">
              {idx.value.toLocaleString('en-IN')}
            </span>
            <span className={cx('tnum text-[11px] font-semibold', up ? 'text-positive' : 'text-danger')}>
              {pct(idx.changePct, 2)}
            </span>
          </div>
        )
      })}
    </div>
  )
}
