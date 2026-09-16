// Central mapping from domain items to lucide icons. Keeps the UI professional
// and consistent (no decorative emoji) while the data files stay plain.

import {
  AlertTriangle,
  BookOpen,
  CalendarClock,
  Flag,
  Landmark,
  Layers,
  Leaf,
  PieChart,
  Plane,
  Receipt,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Target,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react'
import type { GoalKind } from '../mock/types'

export function basketIcon(id: string): LucideIcon {
  switch (id) {
    case 'green':
      return Leaf
    case 'india':
      return Flag
    case 'brands':
      return ShoppingBag
    default:
      return Layers
  }
}

export function goalIcon(kind: GoalKind): LucideIcon {
  switch (kind) {
    case 'travel':
      return Plane
    case 'gadget':
      return Smartphone
    case 'safety':
      return ShieldCheck
    case 'freedom':
      return TrendingUp
    default:
      return Target
  }
}

export function learnIcon(id: string): LucideIcon {
  switch (id) {
    case 'what-is-sip':
      return CalendarClock
    case 'index-vs-active':
      return Layers
    case 'expense-ratio':
      return Receipt
    case 'what-is-fno':
      return AlertTriangle
    case 'elss-80c':
      return Landmark
    case 'diversification':
      return PieChart
    default:
      return BookOpen
  }
}
