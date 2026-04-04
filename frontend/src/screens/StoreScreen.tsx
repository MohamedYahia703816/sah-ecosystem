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
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl font-semibold text-gradient-gold mb-2">Instrument Store</h1>
          <p className="text-text-secondary text-sm">Choose a genre to start your journey</p>
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
                onClick={() => {
                  setSelectedGenreId(genre.id)
                  if (!ownedGenres.includes(genre.id)) {
                    selectGenre(genre.id)
                  }
                }}
              >
                <div className="text-3xl mb-3">{genre.icon}</div>
                <h3 className="font-semibold text-text-primary text-sm">{genre.name}</h3>
                <p className="text-[11px] text-text-secondary mt-1">
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
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={() => setSelectedGenreId('')}
          className="text-text-secondary hover:text-text-primary transition-colors text-sm"
        >
          ← Back
        </button>
        <h1 className="text-lg font-semibold text-gradient-gold">{currentGenre?.name} Store</h1>
      </div>

      <GlassCard className="mb-5 text-center p-4">
        <p className="text-xs text-text-secondary mb-1">Your Balance</p>
        <p className="text-2xl font-semibold text-gradient-gold">{balance.toLocaleString()} SAH</p>
      </GlassCard>

      <div className="space-y-3">
        {currentGenre?.levels.map((level, index) => {
          const unlocked = isLevelUnlocked(level.level)
          const owned = isLevelOwned(level.level)
          const canAfford = balance >= level.price
          const isPurchasing = purchasing === `${currentGenre.id}-${level.level}`

          return (
            <motion.div
              key={level.level}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 }}
            >
              <GlassCard className={`${!unlocked ? 'opacity-40' : ''} p-4`}>
                <div className="flex items-center gap-3">
                  <LevelBadge level={level.level} size="sm" />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{level.icon}</span>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-text-primary text-sm truncate">{level.name}</h3>
                        <p className="text-xs text-emerald">+{level.profitPerHour}/hr</p>
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    {owned ? (
                      <div className="flex items-center gap-1 text-emerald">
                        <Check size={16} />
                        <span className="text-xs font-medium">Owned</span>
                      </div>
                    ) : !unlocked ? (
                      <div className="flex items-center gap-1 text-text-secondary">
                        <Lock size={14} />
                        <span className="text-xs">Locked</span>
                      </div>
                    ) : (
                      <motion.button
                        className={`btn-gold btn-xs ${!canAfford ? 'btn-secondary' : ''}`}
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
