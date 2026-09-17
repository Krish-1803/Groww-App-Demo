import { useStore } from '../store/useStore'

/**
 * Returns a guard(fn) wrapper. If the user has taken the risk quiz it runs the
 * action; otherwise it opens the quiz first. Used on every "put money in"
 * action (start SIP, buy a stock, contribute to a goal, place an F&O trade) so
 * we always understand risk appetite before investing.
 */
export function useInvestGuard() {
  const onboarded = useStore((s) => s.onboarded)
  const openOnboarding = useStore((s) => s.openOnboarding)
  return (proceed: () => void) => {
    if (!onboarded) {
      openOnboarding()
      return
    }
    proceed()
  }
}
