import { retrieveLaunchParams, mockTelegramEnv } from '@telegram-apps/sdk'

let isInitialized = false

export function initTelegram() {
  if (isInitialized) return
  
  try {
    // DEV mode - mock for development
    if (import.meta.env.DEV) {
      mockTelegramEnv({
        initData: {
          user: { id: 123456789, first_name: 'Test', username: 'testuser' },
        },
      } as any)
      console.log('DEV mode: Telegram SDK mocked')
    }
    
    // Try to get launch params
    const lp = retrieveLaunchParams()
    console.log('Telegram launch params:', lp)
    isInitialized = true
  } catch (e) {
    // Not in Telegram environment - that's ok for testing
    console.log('Not running in Telegram environment')
    isInitialized = true
  }
}

export function getTelegramUser() {
  try {
    // Method 1: Check window.Telegram.WebApp.initDataUnsafe (most common)
    const tg = (window as any).Telegram?.WebApp
    if (tg?.initDataUnsafe?.user) {
      console.log('Found user via Telegram.WebApp:', tg.initDataUnsafe.user)
      return tg.initDataUnsafe.user
    }
    
    // Method 2: Check window.Telegram directly
    const tg2 = (window as any).Telegram
    if (tg2?.WebApp?.initDataUnsafe?.user) {
      console.log('Found user via Telegram:', tg2.WebApp.initDataUnsafe.user)
      return tg2.WebApp.initDataUnsafe.user
    }
    
    console.log('No Telegram user found. Available:', (window as any).Telegram)
    return null
  } catch (e) {
    console.warn('getTelegramUser error:', e)
    return null
  }
}

export function getTelegramUserId(): string | null {
  // Telegram injects Telegram.WebApp automatically when opened in mini-app
  const tg = (window as any).Telegram?.WebApp
  
  if (tg?.initDataUnsafe?.user) {
    console.log('Telegram ID found:', tg.initDataUnsafe.user.id)
    return String(tg.initDataUnsafe.user.id)
  }
  
  // Fallback: check window.Telegram directly
  const tg2 = (window as any).Telegram
  if (tg2?.WebApp?.initDataUnsafe?.user) {
    console.log('Telegram ID found (alt):', tg2.WebApp.initDataUnsafe.user.id)
    return String(tg2.WebApp.initDataUnsafe.user.id)
  }
  
  console.log('Telegram ID NOT found. window.Telegram:', !!tg, 'initDataUnsafe:', tg?.initDataUnsafe)
  return null
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
