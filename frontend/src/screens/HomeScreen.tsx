import { useState } from 'react'
import { motion } from 'framer-motion'
import { useGame } from '../context/GameContext'
import { CoinCounter } from '../components/CoinCounter'
import { OrbitVisualizer } from '../components/OrbitVisualizer'
import { GlassCard } from '../components/GlassCard'
import { genres } from '../data/gameData'
import { ArrowUpRight, Zap, Snowflake } from 'lucide-react'

export function HomeScreen() {
  const { balance, profitPerHour, boostMultiplier, selectedGenre, inventory, ownedGenres, isLoading, error, userStatus, isFrozen, suspendedUntil } = useGame()
  const [showGenrePicker, setShowGenrePicker] = useState(!selectedGenre)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-pulse">🎹</div>
          <p className="text-text-secondary text-sm">Loading your studio...</p>
        </div>
      </div>
    )
  }

  if (userStatus === 'banned') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="glass-card p-6 text-center max-w-sm">
          <div className="text-5xl mb-4">🚫</div>
          <h2 className="text-lg font-semibold text-rose mb-2">Account Banned</h2>
          <p className="text-text-secondary text-sm mb-3">Your account has been permanently banned.</p>
          <p className="text-xs text-text-muted">Contact support if you believe this is a mistake.</p>
        </div>
      </div>
    )
  }

  if (userStatus === 'suspended' && suspendedUntil) {
    const suspendEnd = new Date(suspendedUntil)
    const isStillSuspended = suspendEnd > new Date()
    if (isStillSuspended) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="glass-card p-6 text-center max-w-sm">
            <div className="text-5xl mb-4">⏸️</div>
            <h2 className="text-lg font-semibold text-amber-500 mb-2">Account Suspended</h2>
            <p className="text-text-secondary text-sm mb-3">Your account is temporarily suspended.</p>
            <p className="text-xs text-text-muted">Access will be restored on {suspendEnd.toLocaleString()}</p>
          </div>
        </div>
      )
    }
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="glass-card p-6 text-center max-w-sm">
          <div className="text-5xl mb-4">🎵</div>
          <h2 className="text-lg font-semibold text-text-primary mb-2">SAH Music Studio</h2>
          <p className="text-text-secondary text-sm mb-3">Open this app from within Telegram to start playing.</p>
          <p className="text-xs text-text-muted">Search for the bot in Telegram and tap "Open Studio"</p>
        </div>
      </div>
    )
  }

  const currentGenre = genres.find(g => g.id === selectedGenre)
  const highestLevel = inventory
    .filter(i => i.genre === selectedGenre)
    .reduce((max, i) => Math.max(max, i.level), 0)
  
  const currentInstrument = currentGenre?.levels[highestLevel - 1]?.icon || currentGenre?.icon || '🎵'
  const genreColor = currentGenre?.color || '#00F2FF'

  const totalBoost = ((boostMultiplier - 1) * 100).toFixed(0)

  if (showGenrePicker) {
    return (
      <div className="min-h-screen pb-24 px-4 pt-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl font-semibold text-gradient-gold mb-2">Choose Your Studio</h1>
          <p className="text-text-secondary text-sm">Select your first music genre to begin</p>
        </motion.div>

        <div className="grid grid-cols-2 gap-4">
          {genres.map((genre, index) => (
            <motion.div
              key={genre.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
            >
              <GlassCard
                hover
                className="text-center cursor-pointer p-4"
                onClick={() => setShowGenrePicker(false)}
              >
                <div className="text-3xl mb-3">{genre.icon}</div>
                <h3 className="font-semibold text-text-primary text-sm">{genre.name}</h3>
                <p className="text-[11px] text-text-secondary mt-1">Start earning SAH</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-24 px-4 pt-6">
      {isFrozen && (
        <div className="glass-card p-3 mb-4 flex items-center gap-2 border-cyan/20">
          <Snowflake size={16} className="text-cyan flex-shrink-0" />
          <p className="text-xs text-cyan">Your balance is frozen. You cannot make purchases or earn profits.</p>
        </div>
      )}

      <div className="flex justify-between items-center mb-5">
        <CoinCounter value={balance} size="sm" />
        <div className="flex items-center gap-1.5 glass-card px-3 py-2">
          <Zap size={14} className="text-cyan" />
          <span className="text-xs font-medium text-emerald">+{profitPerHour}/hr</span>
        </div>
      </div>

      <div className="mb-6">
        <OrbitVisualizer
          instrument={currentInstrument}
          level={highestLevel || 1}
          genreColor={genreColor}
          isActive={profitPerHour > 0}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <GlassCard className="text-center p-4">
          <p className="text-[11px] text-text-secondary mb-1">Profit/Hour</p>
          <div className="flex items-center justify-center gap-1">
            <ArrowUpRight size={14} className="text-emerald" />
            <span className="text-base font-semibold text-emerald">{profitPerHour}</span>
          </div>
        </GlassCard>
        <GlassCard className="text-center p-4">
          <p className="text-[11px] text-text-secondary mb-1">Boost</p>
          <div className="flex items-center justify-center gap-1">
            <Zap size={14} className="text-cyan" />
            <span className="text-base font-semibold text-cyan">+{totalBoost}%</span>
          </div>
        </GlassCard>
      </div>

      <GlassCard className="mb-4 p-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{currentGenre?.icon}</span>
          <div>
            <h3 className="font-semibold text-text-primary text-sm">{currentGenre?.name} Studio</h3>
            <p className="text-xs text-text-secondary">Level {highestLevel || 0} • {inventory.filter(i => i.genre === selectedGenre).length} instruments</p>
          </div>
        </div>
      </GlassCard>

      {ownedGenres.length > 1 && (
        <GlassCard className="p-4">
          <h3 className="font-semibold text-text-primary text-sm mb-3">Your Studios</h3>
          <div className="flex gap-2 flex-wrap">
            {ownedGenres.map(genreId => {
              const g = genres.find(x => x.id === genreId)
              if (!g) return null
              return (
                <span key={genreId} className="glass-card px-3 py-1.5 text-xs flex items-center gap-1.5">
                  <span>{g.icon}</span>
                  <span>{g.name}</span>
                </span>
              )
            })}
          </div>
        </GlassCard>
      )}
    </div>
  )
}
