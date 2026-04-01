import { useState } from 'react'
import { motion } from 'framer-motion'
import { useGame } from '../context/GameContext'
import { GlassCard } from '../components/GlassCard'
import { boosters as boostersData } from '../data/gameData'
import { Zap, Check } from 'lucide-react'

export function BoostersScreen() {
  const { balance, boosters, boostMultiplier, purchaseBooster } = useGame()
  const [purchasing, setPurchasing] = useState<string | null>(null)

  const handlePurchase = async (boosterType: string) => {
    setPurchasing(boosterType)
    await purchaseBooster(boosterType)
    setPurchasing(null)
  }

  const getBoosterLevel = (boosterType: string): number => {
    return boosters.find(b => b.boosterType === boosterType)?.level || 0
  }

  const getBoosterCost = (booster: typeof boostersData[0], currentLevel: number): number => {
    return Math.floor(booster.baseCost * Math.pow(booster.costMultiplier, currentLevel))
  }

  const totalBoost = ((boostMultiplier - 1) * 100).toFixed(0)

  return (
    <div className="min-h-screen pb-24 px-4 pt-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gradient-gold mb-2">Boosters Hub</h1>
        <p className="text-text-secondary">Upgrade your equipment to boost earnings</p>
      </div>

      {/* Total Boost */}
      <GlassCard className="mb-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Zap size={24} className="text-cyan" />
          <span className="text-3xl font-bold text-cyan">+{totalBoost}%</span>
        </div>
        <p className="text-sm text-text-secondary">Total Boost Multiplier</p>
      </GlassCard>

      {/* Boosters */}
      <div className="space-y-4">
        {boostersData.map((booster, index) => {
          const currentLevel = getBoosterLevel(booster.id)
          const isMaxed = currentLevel >= booster.maxLevel
          const cost = getBoosterCost(booster, currentLevel)
          const canAfford = balance >= cost
          const nextBonus = booster.bonusPerLevel[currentLevel]
          const isPurchasing = purchasing === booster.id

          return (
            <motion.div
              key={booster.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard>
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{booster.icon}</div>
                  
                  <div className="flex-1">
                    <h3 className="font-bold text-text-primary">{booster.name}</h3>
                    <p className="text-sm text-text-secondary">{booster.description}</p>
                    
                    {/* Level indicators */}
                    <div className="flex gap-1 mt-2">
                      {Array.from({ length: booster.maxLevel }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-2 flex-1 rounded-full ${
                            i < currentLevel ? 'bg-gold' : 'bg-bg-secondary'
                          }`}
                        />
                      ))}
                    </div>
                    
                    <p className="text-xs text-text-secondary mt-1">
                      Level {currentLevel}/{booster.maxLevel}
                      {!isMaxed && ` • Next: +${(nextBonus * 100).toFixed(0)}%`}
                    </p>
                  </div>

                  <div className="text-right">
                    {isMaxed ? (
                      <div className="flex items-center gap-1 text-green-neon">
                        <Check size={18} />
                        <span className="text-sm font-medium">MAX</span>
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
                        onClick={() => handlePurchase(booster.id)}
                      >
                        {isPurchasing ? '...' : `${cost.toLocaleString()}`}
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
