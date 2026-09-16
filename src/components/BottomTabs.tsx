// Sticky bottom tab bar. In Gen Z mode the tabs are Home / Goals / Learn /
// Community / Portfolio. With Gen Z mode OFF, the layer-specific tabs collapse
// to the standard Groww set (Home / Explore / Portfolio).

import { NavLink } from 'react-router-dom'
import { BookOpen, Compass, Home, PieChart, Target, Users } from 'lucide-react'
import { useStore } from '../store/useStore'
import { cx } from '../lib/utils'

const genZTabs = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/goals', label: 'Goals', icon: Target },
  { to: '/learn', label: 'Learn', icon: BookOpen },
  { to: '/community', label: 'Community', icon: Users },
  { to: '/portfolio', label: 'Portfolio', icon: PieChart },
]

const baseTabs = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/explore', label: 'Explore', icon: Compass },
  { to: '/portfolio', label: 'Portfolio', icon: PieChart },
]

export function BottomTabs() {
  const genZ = useStore((s) => s.genZMode)
  const tabs = genZ ? genZTabs : baseTabs

  return (
    <nav className="sticky bottom-0 z-20 border-t border-line bg-card/95 backdrop-blur">
      <div className="flex items-stretch justify-around px-1 pb-[max(0.35rem,env(safe-area-inset-bottom))] pt-1.5">
        {tabs.map((t) => {
          const Icon = t.icon
          return (
            <NavLink
              key={t.to}
              to={t.to}
              end={t.end}
              className={({ isActive }) =>
                cx(
                  'flex flex-1 flex-col items-center gap-0.5 rounded-xl py-1.5 text-[10.5px] font-medium transition',
                  isActive ? 'text-teal' : 'text-muted',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={20} strokeWidth={isActive ? 2.4 : 2} />
                  <span>{t.label}</span>
                </>
              )}
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
