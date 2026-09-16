// The phone shell: centered, max-w-[420px], full height, with a relative inner
// surface so bottom sheets and the Buddy FAB position within the frame. The
// theme is driven from the document root (see App), so this stays presentational.

export function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] w-full flex items-stretch justify-center sm:items-center sm:py-6">
      <div className="theme-surface relative flex min-h-[100dvh] w-full max-w-[420px] flex-col overflow-hidden bg-canvas shadow-lift sm:h-[860px] sm:min-h-0 sm:max-h-[calc(100dvh-3rem)] sm:rounded-[2.4rem] sm:border-[10px] sm:border-[#12151d]">
        {children}
      </div>
    </div>
  )
}
