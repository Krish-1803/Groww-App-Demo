// The phone shell: centered, max-w-[420px], full height, with a relative inner
// surface so bottom sheets and the Buddy FAB position within the frame.

import { cx } from '../lib/utils'

export function PhoneFrame({ children, dark }: { children: React.ReactNode; dark: boolean }) {
  return (
    <div className={cx('min-h-[100dvh] w-full flex items-stretch justify-center sm:items-center sm:py-6', dark && 'dark')}>
      <div className="relative flex w-full max-w-[420px] flex-col overflow-hidden bg-canvas shadow-lift sm:h-[860px] sm:max-h-[calc(100dvh-3rem)] sm:rounded-[2.2rem] sm:border-[10px] sm:border-ink/90 min-h-[100dvh] sm:min-h-0">
        {children}
      </div>
    </div>
  )
}
