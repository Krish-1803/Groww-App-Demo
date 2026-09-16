// ---------------------------------------------------------------------------
// Finance helpers. Plain, well-known formulas so the same numbers appear on the
// base Groww surface and the Gen Z layer. All assumptions are explicit.
// ---------------------------------------------------------------------------

import { RETURN_ASSUMPTION } from '../mock/data'

/** Future value of a monthly SIP compounded monthly. */
export function sipFutureValue(
  monthly: number,
  months: number,
  annualRate = RETURN_ASSUMPTION,
): number {
  const r = annualRate / 12
  if (months <= 0) return 0
  if (r === 0) return monthly * months
  // FV = P * [((1+r)^n - 1) / r] * (1+r)
  return monthly * ((Math.pow(1 + r, months) - 1) / r) * (1 + r)
}

/** Monthly SIP required to reach `target` in `months` (back-solved). */
export function sipForTarget(
  target: number,
  months: number,
  annualRate = RETURN_ASSUMPTION,
): number {
  const r = annualRate / 12
  if (months <= 0) return target
  if (r === 0) return target / months
  const factor = ((Math.pow(1 + r, months) - 1) / r) * (1 + r)
  return target / factor
}

/** Months needed to reach `target` at a fixed monthly SIP. */
export function monthsForTarget(
  target: number,
  monthly: number,
  annualRate = RETURN_ASSUMPTION,
): number {
  const r = annualRate / 12
  if (monthly <= 0) return Infinity
  if (r === 0) return Math.ceil(target / monthly)
  // Solve (1+r)^n = 1 + target*r / (monthly*(1+r))
  const inner = 1 + (target * r) / (monthly * (1 + r))
  return Math.ceil(Math.log(inner) / Math.log(1 + r))
}

/** Year-by-year projection series for a monthly SIP (for charts). */
export function projectionSeries(
  monthly: number,
  years: number,
  annualRate = RETURN_ASSUMPTION,
): { year: number; invested: number; value: number }[] {
  const out: { year: number; invested: number; value: number }[] = []
  for (let y = 0; y <= years; y++) {
    const months = y * 12
    out.push({
      year: y,
      invested: Math.round(monthly * months),
      value: Math.round(sipFutureValue(monthly, months, annualRate)),
    })
  }
  return out
}

/** A stable mock XIRR from invested vs current value (not a real cashflow XIRR). */
export function mockXirr(invested: number, current: number): number {
  if (invested <= 0) return 0
  // Treat the gain as if earned over ~1.5 years for a believable annualised figure.
  const totalReturn = current / invested
  const annualised = (Math.pow(totalReturn, 1 / 1.5) - 1) * 100
  return annualised
}
