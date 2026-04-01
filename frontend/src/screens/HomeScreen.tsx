import { useState } from 'react'
import { motion } from 'framer-motion'
import { useGame } from '../context/GameContext'
import { CoinCounter } from '../components/CoinCounter'
import { OrbitVisualizer } from '../components/OrbitVisualizer'
import { GlassCard } from '../components/GlassCard'
import { genres } from '../data/gameData'
import { ArrowUpRight, Zap } from 'lucide-react'

export function HomeScreen() {
  const { balance, profitPerHour, boostMultiplier, selectedGenre, inventory, ownedGenres } = useGame()
  const [showGenrePicker, setShowGenrePicker] = useState(!selectedGenre)

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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gradient-gold mb-2">Choose Your Studio</h1>
          <p className="text-text-secondary">Select your first music genre to begin</p>
        </motion.div>

        <div className="grid grid-cols-2 gap-4">
          {genres.map((genre, index) => (
            <motion.div
              key={genre.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard
                hover
                className="text-center cursor-pointer"
                onClick={() => {
                  setShowGenrePicker(false)
                }}
              >
                <div className="text-4xl mb-3">{genre.icon}</div>
                <h3 className="font-bold text-text-primary">{genre.name}</h3>
                <p className="text-xs text-text-secondary mt-1">Start earning SAH</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-24 px-4 pt-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <CoinCounter value={balance} size="md" />
        <div className="flex items-center gap-2 glass-card px-3 py-2">
          <Zap size={16} className="text-cyan" />
          <span className="text-sm font-medium text-gold-neon">+{profitPerHour}/hr</span>
        </div>
      </div>

      {/* Visualizer */}
      <div className="mb-6">
        <OrbitVisualizer
          instrument={currentInstrument}
          level={highestLevel || 1}
          genreColor={genreColor}
          isActive={profitPerHour > 0}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <GlassCard className="text-center">
          <p className="text-xs text-text-secondary mb-1">Profit/Hour</p>
          <div className="flex items-center justify-center gap-1">
            <ArrowUpRight size={16} className="text-green-neon" />
            <span className="text-lg font-bold text-green-neon">{profitPerHour}</span>
          </div>
        </GlassCard>
        <GlassCard className="text-center">
          <p className="text-xs text-text-secondary mb-1">Boost</p>
          <div className="flex items-center justify-center gap-1">
            <Zap size={16} className="text-cyan" />
            <span className="text-lg font-bold text-cyan">+{totalBoost}%</span>
          </div>
        </GlassCard>
      </div>

      {/* Genre Info */}
      <GlassCard className="mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{currentGenre?.icon}</span>
          <div>
            <h3 className="font-bold text-text-primary">{currentGenre?.name} Studio</h3>
            <p className="text-sm text-text-secondary">Level {highestLevel || 0} • {inventory.filter(i => i.genre === selectedGenre).length} instruments</p>
          </div>
        </div>
      </GlassCard>

      {/* Owned Genres */}
      {ownedGenres.length > 1 && (
        <GlassCard>
          <h3 className="font-bold text-text-primary mb-3">Your Studios</h3>
          <div className="flex gap-2 flex-wrap">
            {ownedGenres.map(genreId => {
              const g = genres.find(x => x.id === genreId)
              if (!g) return null
              return (
                <span key={genreId} className="glass-card px-3 py-1 text-sm flex items-center gap-2">
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
