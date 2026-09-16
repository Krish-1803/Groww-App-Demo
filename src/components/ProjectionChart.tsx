// Recharts area chart: invested vs projected value over time. Shared by
// onboarding, the SIP calculator and goal projections so the shapes match.

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { projectionSeries } from '../lib/finance'
import { inrCompact } from '../lib/utils'

export function ProjectionChart({
  monthly,
  years,
  height = 170,
}: {
  monthly: number
  years: number
  height?: number
}) {
  const data = projectionSeries(monthly, years)

  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 6, right: 6, left: -8, bottom: 0 }}>
          <defs>
            <linearGradient id="valueFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(var(--c-primary))" stopOpacity={0.35} />
              <stop offset="100%" stopColor="rgb(var(--c-primary))" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="investedFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(var(--c-muted))" stopOpacity={0.18} />
              <stop offset="100%" stopColor="rgb(var(--c-muted))" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--c-line))" vertical={false} />
          <XAxis
            dataKey="year"
            tickFormatter={(y) => `${y}y`}
            tick={{ fontSize: 10, fill: 'rgb(var(--c-muted))' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => inrCompact(v)}
            tick={{ fontSize: 10, fill: 'rgb(var(--c-muted))' }}
            axisLine={false}
            tickLine={false}
            width={42}
          />
          <Tooltip
            formatter={(v: number, name) => [inrCompact(v), name === 'value' ? 'Projected' : 'Invested']}
            labelFormatter={(y) => `After ${y} year${y === 1 ? '' : 's'}`}
            contentStyle={{
              borderRadius: 12,
              border: '1px solid rgb(var(--c-line))',
              background: 'rgb(var(--c-card))',
              fontSize: 12,
              color: 'rgb(var(--c-ink))',
            }}
          />
          <Area
            type="monotone"
            dataKey="invested"
            stroke="rgb(var(--c-muted))"
            strokeWidth={1.5}
            fill="url(#investedFill)"
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="rgb(var(--c-primary))"
            strokeWidth={2.5}
            fill="url(#valueFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
