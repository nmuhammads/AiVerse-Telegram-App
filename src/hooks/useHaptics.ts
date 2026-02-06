import WebApp from '@twa-dev/sdk'

const isInTelegram = !!(WebApp.initData && WebApp.initDataUnsafe?.user)

export function useHaptics() {
  const impact = (style: 'light' | 'medium' | 'heavy') => {
    if (isInTelegram) {
      try {
        WebApp.HapticFeedback.impactOccurred(style)
        return
      } catch { /* fallback below */ }
    }
    // Web fallback: use Vibration API if available (Android browsers)
    try {
      navigator.vibrate?.(style === 'heavy' ? 50 : style === 'medium' ? 30 : 15)
    } catch { /* noop */ }
  }

  const notify = (type: 'success' | 'error' | 'warning') => {
    if (isInTelegram) {
      try {
        WebApp.HapticFeedback.notificationOccurred(type)
        return
      } catch { /* fallback below */ }
    }
    try {
      navigator.vibrate?.(type === 'error' ? [50, 30, 50] : type === 'warning' ? [30, 20, 30] : 40)
    } catch { /* noop */ }
  }

  return { impact, notify }
}
