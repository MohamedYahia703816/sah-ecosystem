import { retrieveLaunchParams, mockTelegramEnv } from '@telegram-apps/sdk'

let isInitialized = false

export function initTelegram() {
  if (isInitialized) return
  
  try {
    if (import.meta.env.DEV) {
      mockTelegramEnv({
        initData: {
          user: { id: 123456789, first_name: 'Test', username: 'testuser' },
        },
      } as any)
    }
    
    const lp = retrieveLaunchParams()
    console.log('Telegram launch params:', lp)
    isInitialized = true
  } catch (e) {
    console.warn('Telegram SDK init warning:', e)
    isInitialized = true
  }
}

export function getTelegramUser() {
  try {
    // Debug: log what's available
    console.log('Telegram check:', window.Telegram?.WebApp?.initDataUnsafe)
    
    if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
      return window.Telegram.WebApp.initDataUnsafe.user
    }
    return null
  } catch (e) {
    console.warn('Telegram getUser error:', e)
    return null
  }
}

export function getTelegramUserId(): string | null {
  const user = getTelegramUser()
  if (!user) {
    console.log('No Telegram user found')
    return null
  }
  console.log('Telegram user found:', user.id, user.first_name)
  return String(user.id)
}

export function notifyHapticFeedback(type: 'light' | 'medium' | 'heavy' = 'light') {
  try {
    window.Telegram?.WebApp?.HapticFeedback?.impactOccurred(type)
  } catch {}
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        initDataUnsafe: {
          user?: {
            id: number
            first_name: string
            last_name?: string
            username?: string
            language_code?: string
          }
          query_id?: string
        }
        ready: () => void
        expand: () => void
        close: () => void
        HapticFeedback?: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void
          notificationOccurred: (type: 'error' | 'success' | 'warning') => void
        }
        MainButton?: {
          text: string
          color: string
          textColor: string
          isVisible: boolean
          isActive: boolean
          show: () => void
          hide: () => void
          enable: () => void
          disable: () => void
          onClick: (cb: () => void) => void
          offClick: (cb: () => void) => void
        }
        BackButton?: {
          isVisible: boolean
          show: () => void
          hide: () => void
          onClick: (cb: () => void) => void
          offClick: (cb: () => void) => void
        }
        theme: string
        colorScheme: string
      }
    }
  }
}
