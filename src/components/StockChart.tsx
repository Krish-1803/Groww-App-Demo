// A smooth price area-chart for the stock detail view. Expands the short price
// series into a denser, more realistic curve before rendering.

import { Area, AreaChart, ResponsiveContainer, Tooltip, YAxis } from 'recharts'
import { inr } from '../lib/utils'

// Linear-interpolate `data` up to ~`points` samples with a little deterministic
// wobble so the line looks like a real intraday chart, not 7 straight segments.
function expand(data: number[], points = 48): number[] {
  if (data.length < 2) return data
  const out: number[] = []
  const segs = data.length - 1
  const per = Math.max(2, Math.floor(points / segs))
  for (let s = 0; s < segs; s++) {
    const a = data[s]
    const b = data[s + 1]
    for (let k = 0; k < per; k++) {
      const t = k / per
      const base = a + (b - a) * t
      // small sine wobble scaled to the segment size
      const wobble = Math.sin((s * per + k) * 1.7) * Math.abs(b - a) * 0.06
      out.push(base + wobble)
    }
  }
  out.push(data[data.length - 1])
  return out
}

export function StockChart({ data, up, height = 170 }: { data: number[]; up: boolean; height?: number }) {
  const series = expand(data).map((v, i) => ({ i, v }))
  const color = up ? 'rgb(var(--c-positive))' : 'rgb(var(--c-danger))'
  const min = Math.min(...series.map((p) => p.v))
  const max = Math.max(...series.map((p) => p.v))
  const pad = (max - min) * 0.12 || 1

  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={series} margin={{ top: 8, right: 4, left: 4, bottom: 0 }}>
          <defs>
            <linearGradient id="stockFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.28} />
              <stop offset="100%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <YAxis domain={[min - pad, max + pad]} hide />
          <Tooltip
            formatter={(v: number) => [inr(v, 1), 'Price']}
            labelFormatter={() => ''}
            contentStyle={{
              borderRadius: 10,
              border: '1px solid rgb(var(--c-line))',
              background: 'rgb(var(--c-card))',
              fontSize: 12,
              color: 'rgb(var(--c-ink))',
              padding: '4px 8px',
            }}
          />
          <Area type="monotone" dataKey="v" stroke={color} strokeWidth={2.4} fill="url(#stockFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
