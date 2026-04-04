import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, Store, Zap, List, Trophy, Wallet } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

const navItems = [
  { path: '/', icon: Home, label: 'Studio' },
  { path: '/store', icon: Store, label: 'Store' },
  { path: '/boosters', icon: Zap, label: 'Boost' },
  { path: '/tasks', icon: List, label: 'Tasks' },
  { path: '/leaderboard', icon: Trophy, label: 'Ranks' },
  { path: '/wallet', icon: Wallet, label: 'Wallet' },
]

function hapticFeedback(type: 'light' | 'medium' | 'heavy' = 'light') {
  try {
    const tg = (window as any).Telegram?.WebApp
    if (tg?.HapticFeedback) {
      tg.HapticFeedback.impactOccurred(type)
    }
  } catch {}
}

export function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    hapticFeedback('light')
  }, [location.pathname])

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="glass-card mx-2 mb-3 px-2 py-1.5">
        <div className="flex justify-center items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <motion.button
                key={item.path}
                onClick={() => {
                  hapticFeedback('medium')
                  navigate(item.path)
                }}
                className="relative flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all duration-200"
                whileTap={{ scale: 0.88 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-0 rounded-xl"
                      style={{
                        background: 'rgba(200, 134, 10, 0.12)',
                        border: '1px solid rgba(200, 134, 10, 0.25)',
                      }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    />
                  )}
                </AnimatePresence>

                <motion.div
                  className="relative z-10"
                  animate={{
                    y: isActive ? -2 : 0,
                    scale: isActive ? 1.1 : 1,
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  <item.icon
                    size={20}
                    strokeWidth={isActive ? 2.5 : 2}
                    className={`transition-colors duration-200 ${
                      isActive ? 'text-gold glow-gold' : 'text-text-secondary'
                    }`}
                  />
                </motion.div>

                <motion.span
                  className={`relative z-10 text-[10px] font-medium leading-none transition-colors duration-200 ${
                    isActive ? 'text-gold' : 'text-text-muted'
                  }`}
                  animate={{
                    scale: isActive ? 1.05 : 1,
                  }}
                >
                  {item.label}
                </motion.span>
              </motion.button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
