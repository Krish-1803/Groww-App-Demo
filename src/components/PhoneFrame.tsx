// The phone shell, sized to iPhone 16 Pro Max proportions (440 x 956 logical
// points). On desktop it renders a realistic device: thick dark bezel, deep
// corner radius, a status bar with a Dynamic Island, and a home indicator. On
// a real phone it goes full-bleed and the OS provides that chrome. The theme is
// driven from the document root (see App), so this stays presentational.

import { BatteryFull, Wifi } from 'lucide-react'

export function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] w-full items-stretch justify-center sm:items-center sm:py-6">
      <div className="theme-surface relative flex min-h-[100dvh] w-full max-w-[440px] flex-col overflow-hidden bg-canvas shadow-lift sm:h-[956px] sm:min-h-0 sm:max-h-[calc(100dvh-3rem)] sm:w-[440px] sm:rounded-[3.4rem] sm:border-[13px] sm:border-[#0b0d12]">
        <StatusBar />
        {children}
        {/* Home indicator (framed view only) */}
        <div className="pointer-events-none absolute inset-x-0 bottom-1.5 z-30 hidden justify-center sm:flex">
          <div className="h-1 w-32 rounded-full bg-ink/30" />
        </div>
      </div>
    </div>
  )
}

// iOS-style status bar with a Dynamic Island. Shown only in the framed
// (desktop) view; hidden on real phones where the OS draws its own.
function StatusBar() {
  return (
    <div className="relative z-20 hidden h-11 shrink-0 items-center justify-between bg-canvas px-7 pt-1 sm:flex">
      <span className="text-sm font-semibold text-ink">9:41</span>
      {/* Dynamic Island */}
      <div className="absolute left-1/2 top-2 h-7 w-[104px] -translate-x-1/2 rounded-full bg-[#0b0d12]" />
      <div className="flex items-center gap-1.5 text-ink">
        <SignalDots />
        <Wifi size={15} />
        <BatteryFull size={19} />
      </div>
    </div>
  )
}

function SignalDots() {
  return (
    <span className="flex items-end gap-[2px]" aria-hidden>
      {[6, 8, 10, 12].map((h) => (
        <span key={h} className="w-[3px] rounded-sm bg-ink" style={{ height: h }} />
      ))}
    </span>
  )
}
