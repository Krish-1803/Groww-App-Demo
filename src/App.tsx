// App shell: the phone frame, top/bottom bars, routed screens, Buddy FAB and
// the prototype info sheet. Onboarding gates the app when Gen Z mode is on and
// the user hasn't finished it yet.

import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useStore } from './store/useStore'
import { PhoneFrame } from './components/PhoneFrame'
import { TopBar } from './components/TopBar'
import { BottomTabs } from './components/BottomTabs'
import { BuddyFab } from './components/Buddy'
import { InfoSheet } from './components/InfoSheet'
import { Onboarding } from './screens/Onboarding'
import { Home } from './screens/Home'
import { Goals } from './screens/Goals'
import { Learn } from './screens/Learn'
import { Community } from './screens/Community'
import { Portfolio } from './screens/Portfolio'
import { MutualFunds } from './screens/MutualFunds'
import { Stocks } from './screens/Stocks'
import { FnO } from './screens/FnO'
import { IPO } from './screens/IPO'
import { Explore } from './screens/Explore'

// Guard so the session counter increments once per page load, even under
// React StrictMode's double-invoked effects in development.
let sessionCounted = false

export default function App() {
  const theme = useStore((s) => s.theme)
  const genZ = useStore((s) => s.genZMode)
  const onboarded = useStore((s) => s.onboarded)
  const setInfo = useStore((s) => s.setInfo)
  const bumpSession = useStore((s) => s.bumpSession)

  // Drive the theme from the document root so the backdrop and every surface
  // (including anything outside the phone frame) flips together.
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.documentElement.style.colorScheme = theme
  }, [theme])

  // Count this visit once. State is persisted, so the counter (and everything
  // else) carries across reloads and sessions.
  useEffect(() => {
    if (sessionCounted) return
    sessionCounted = true
    bumpSession()
  }, [bumpSession])

  const showOnboarding = genZ && !onboarded

  return (
    <PhoneFrame>
      {showOnboarding ? (
        <div className="no-scrollbar h-full overflow-y-auto">
          <Onboarding />
        </div>
      ) : (
        <>
          <TopBar onOpenInfo={() => setInfo(true)} />
          <ScrollArea>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/goals" element={genZ ? <Goals /> : <Navigate to="/" replace />} />
              <Route path="/learn" element={genZ ? <Learn /> : <Navigate to="/" replace />} />
              <Route path="/community" element={<Community />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/mutual-funds" element={<MutualFunds />} />
              <Route path="/stocks" element={<Stocks />} />
              <Route path="/fno" element={<FnO />} />
              <Route path="/ipo" element={<IPO />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ScrollArea>
          {genZ && <BuddyFab />}
          <BottomTabs />
        </>
      )}
      <InfoSheet />
    </PhoneFrame>
  )
}

// Scrollable content region that resets scroll on route change.
function ScrollArea({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  useEffect(() => {
    const el = document.getElementById('scroll-area')
    el?.scrollTo({ top: 0 })
  }, [location.pathname])
  return (
    <div id="scroll-area" className="no-scrollbar flex-1 overflow-y-auto">
      {children}
    </div>
  )
}
