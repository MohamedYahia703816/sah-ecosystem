export function hapticFeedback(type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' = 'light') {
  try {
    const tg = (window as any).Telegram?.WebApp
    if (!tg?.HapticFeedback) return

    if (type === 'success') {
      tg.HapticFeedback.notificationOccurred('success')
    } else if (type === 'warning') {
      tg.HapticFeedback.notificationOccurred('warning')
    } else if (type === 'error') {
      tg.HapticFeedback.notificationOccurred('error')
    } else {
      tg.HapticFeedback.impactOccurred(type)
    }
  } catch {}
}
