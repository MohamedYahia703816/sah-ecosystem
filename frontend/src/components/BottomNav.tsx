import { motion } from 'framer-motion'
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

export function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="glass-card mx-2 mb-3 px-2 py-2">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <motion.button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-all duration-200 ${
                  isActive ? 'text-gold' : 'text-text-secondary'
                }`}
                whileTap={{ scale: 0.9 }}
              >
                <item.icon 
                  size={20} 
                  strokeWidth={isActive ? 2.5 : 2}
                  className={isActive ? 'glow-gold' : ''}
                />
                <span className="text-[10px] font-medium leading-none">{item.label}</span>
              </motion.button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
