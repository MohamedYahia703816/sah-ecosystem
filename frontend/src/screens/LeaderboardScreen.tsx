import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { GlassCard } from '../components/GlassCard'
import { getLeaderboard } from '../lib/supabase'
import { Trophy, Medal, Award } from 'lucide-react'

interface LeaderboardUser {
  id: string
  username: string | null
  first_name: string | null
  balance: number
  profit_per_hour: number
}

export function LeaderboardScreen() {
  const [users, setUsers] = useState<LeaderboardUser[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'balance' | 'profit'>('balance')

  useEffect(() => {
    loadLeaderboard()
  }, [tab])

  const loadLeaderboard = async () => {
    setLoading(true)
    try {
      const data = await getLeaderboard(50)
      const sorted = [...data].sort((a, b) => 
        tab === 'balance' 
          ? (b.balance || 0) - (a.balance || 0)
          : (b.profit_per_hour || 0) - (a.profit_per_hour || 0)
      )
      setUsers(sorted)
    } catch (err) {
      console.error('Failed to load leaderboard:', err)
    } finally {
      setLoading(false)
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 0: return <Trophy size={24} className="text-gold" />
      case 1: return <Medal size={24} className="text-gray-300" />
      case 2: return <Award size={24} className="text-amber-600" />
      default: return <span className="text-text-secondary font-bold w-6 text-center">{rank + 1}</span>
    }
  }

  const getDisplayName = (user: LeaderboardUser) => {
    return user.username || user.first_name || `User ${user.id.slice(0, 6)}`
  }

  return (
    <div className="min-h-screen pb-24 px-4 pt-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gradient-gold mb-2">Leaderboard</h1>
        <p className="text-text-secondary">Top music producers</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab('balance')}
          className={`flex-1 py-3 rounded-xl font-medium transition-all ${
            tab === 'balance' 
              ? 'bg-gradient-to-r from-gold to-gold-dark text-bg-primary' 
              : 'glass-card text-text-secondary'
          }`}
        >
          By Balance
        </button>
        <button
          onClick={() => setTab('profit')}
          className={`flex-1 py-3 rounded-xl font-medium transition-all ${
            tab === 'profit' 
              ? 'bg-gradient-to-r from-gold to-gold-dark text-bg-primary' 
              : 'glass-card text-text-secondary'
          }`}
        >
          By Profit/hr
        </button>
      </div>

      {/* Leaderboard */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <GlassCard key={i} className="animate-shimmer h-16"><div /></GlassCard>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <GlassCard className={index < 3 ? 'border-gold/20' : ''}>
                <div className="flex items-center gap-4">
                  <div className="w-10 flex justify-center">
                    {getRankIcon(index)}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-bold text-text-primary">{getDisplayName(user)}</h3>
                    <p className="text-sm text-text-secondary">
                      {tab === 'balance' ? `${user.profit_per_hour}/hr` : `Balance: ${user.balance?.toLocaleString() || 0}`}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold text-gradient-gold">
                      {tab === 'balance' 
                        ? (user.balance || 0).toLocaleString()
                        : `${user.profit_per_hour || 0}`
                      }
                    </p>
                    <p className="text-xs text-text-secondary">SAH</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
          
          {users.length === 0 && (
            <GlassCard className="text-center py-8">
              <p className="text-text-secondary">No users yet. Be the first!</p>
            </GlassCard>
          )}
        </div>
      )}
    </div>
  )
}
