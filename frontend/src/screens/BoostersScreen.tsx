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
      <div className="text-center mb-6">
        <h1 className="text-2xl font-semibold text-gradient-gold mb-2">Boosters Hub</h1>
        <p className="text-text-secondary text-sm">Upgrade your equipment to boost earnings</p>
      </div>

      <GlassCard className="mb-5 text-center p-4">
        <div className="flex items-center justify-center gap-1.5 mb-1">
          <Zap size={20} className="text-cyan" />
          <span className="text-2xl font-semibold text-cyan">+{totalBoost}%</span>
        </div>
        <p className="text-xs text-text-secondary">Total Boost Multiplier</p>
      </GlassCard>

      <div className="space-y-3">
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
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
            >
              <GlassCard className="p-4">
                <div className="flex items-center gap-3">
                  <div className="text-3xl flex-shrink-0">{booster.icon}</div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-text-primary text-sm">{booster.name}</h3>
                    <p className="text-xs text-text-secondary truncate">{booster.description}</p>
                    
                    <div className="flex gap-1 mt-2">
                      {Array.from({ length: booster.maxLevel }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-1.5 flex-1 rounded-full ${
                            i < currentLevel ? 'bg-gold' : 'bg-bg-tertiary'
                          }`}
                        />
                      ))}
                    </div>
                    
                    <p className="text-[11px] text-text-secondary mt-1.5">
                      Level {currentLevel}/{booster.maxLevel}
                      {!isMaxed && ` • Next: +${(nextBonus * 100).toFixed(0)}%`}
                    </p>
                  </div>

                  <div className="text-right flex-shrink-0">
                    {isMaxed ? (
                      <div className="flex items-center gap-1 text-emerald">
                        <Check size={16} />
                        <span className="text-xs font-medium">MAX</span>
                      </div>
                    ) : (
                      <motion.button
                        className={`btn-gold btn-xs ${!canAfford ? 'btn-secondary' : ''}`}
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
