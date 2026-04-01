import { useState } from 'react'
import { motion } from 'framer-motion'
import { useGame } from '../context/GameContext'
import { GlassCard } from '../components/GlassCard'
import { LevelBadge } from '../components/LevelBadge'
import { genres } from '../data/gameData'
import { Lock, Check } from 'lucide-react'

export function StoreScreen() {
  const { balance, inventory, ownedGenres, purchaseInstrument, selectGenre, selectedGenre } = useGame()
  const [selectedGenreId, setSelectedGenreId] = useState<string>(selectedGenre || '')
  const [purchasing, setPurchasing] = useState<string | null>(null)

  const currentGenre = genres.find(g => g.id === selectedGenreId)
  const genreInventory = inventory.filter(i => i.genre === selectedGenreId)

  const handlePurchase = async (genre: string, level: number) => {
    const key = `${genre}-${level}`
    setPurchasing(key)
    await purchaseInstrument(genre, level)
    setPurchasing(null)
  }

  const isLevelUnlocked = (level: number): boolean => {
    if (level === 1) return true
    return genreInventory.some(i => i.level === level - 1)
  }

  const isLevelOwned = (level: number): boolean => {
    return genreInventory.some(i => i.level === level)
  }

  if (!selectedGenreId) {
    return (
      <div className="min-h-screen pb-24 px-4 pt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gradient-gold mb-2">Instrument Store</h1>
          <p className="text-text-secondary">Choose a genre to start your journey</p>
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
                  setSelectedGenreId(genre.id)
                  if (!ownedGenres.includes(genre.id)) {
                    selectGenre(genre.id)
                  }
                }}
              >
                <div className="text-4xl mb-3">{genre.icon}</div>
                <h3 className="font-bold text-text-primary">{genre.name}</h3>
                <p className="text-xs text-text-secondary mt-1">
                  {ownedGenres.includes(genre.id) ? 'Owned' : 'Tap to select'}
                </p>
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
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => setSelectedGenreId('')}
          className="text-text-secondary hover:text-text-primary transition-colors"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-gradient-gold">{currentGenre?.name} Store</h1>
      </div>

      {/* Balance */}
      <GlassCard className="mb-6 text-center">
        <p className="text-sm text-text-secondary mb-1">Your Balance</p>
        <p className="text-3xl font-bold text-gradient-gold">{balance.toLocaleString()} SAH</p>
      </GlassCard>

      {/* Instruments */}
      <div className="space-y-4">
        {currentGenre?.levels.map((level, index) => {
          const unlocked = isLevelUnlocked(level.level)
          const owned = isLevelOwned(level.level)
          const canAfford = balance >= level.price
          const isPurchasing = purchasing === `${currentGenre.id}-${level.level}`

          return (
            <motion.div
              key={level.level}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className={`${!unlocked ? 'opacity-50' : ''}`}>
                <div className="flex items-center gap-4">
                  <LevelBadge level={level.level} />
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{level.icon}</span>
                      <div>
                        <h3 className="font-bold text-text-primary">{level.name}</h3>
                        <p className="text-sm text-green-neon">+{level.profitPerHour}/hr</p>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    {owned ? (
                      <div className="flex items-center gap-1 text-green-neon">
                        <Check size={18} />
                        <span className="text-sm font-medium">Owned</span>
                      </div>
                    ) : !unlocked ? (
                      <div className="flex items-center gap-1 text-text-secondary">
                        <Lock size={16} />
                        <span className="text-sm">Locked</span>
                      </div>
                    ) : (
                      <motion.button
                        className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                          canAfford
                            ? 'bg-gradient-to-r from-gold to-gold-dark text-bg-primary'
                            : 'bg-bg-secondary text-text-secondary'
                        }`}
                        disabled={!canAfford || isPurchasing}
                        whileTap={canAfford ? { scale: 0.95 } : {}}
                        onClick={() => handlePurchase(currentGenre.id, level.level)}
                      >
                        {isPurchasing ? '...' : `${level.price.toLocaleString()}`}
                      </motion.button>
                    )}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
