import { useState } from 'react'
import { motion } from 'framer-motion'
import { useGame } from '../context/GameContext'
import { GlassCard } from '../components/GlassCard'
import { tasks } from '../data/gameData'
import { ExternalLink, Check, Clock, Gift, Play } from 'lucide-react'

export function TasksScreen() {
  const { balance, completedTasks, completeTask, redeemPromoCode } = useGame()
  const [promoCode, setPromoCode] = useState('')
  const [promoMessage, setPromoMessage] = useState('')
  const [promoSuccess, setPromoSuccess] = useState<boolean | null>(null)
  const [processing, setProcessing] = useState<string | null>(null)

  const isTaskCompleted = (taskId: string) => completedTasks.includes(taskId)

  const handleTask = async (task: typeof tasks[0]) => {
    if (isTaskCompleted(task.id) || processing) return
    
    setProcessing(task.id)
    
    if (task.url) {
      window.open(task.url, '_blank')
      await new Promise(resolve => setTimeout(resolve, 3000))
    }
    
    const success = await completeTask(task.id, task.reward)
    if (success) {
      setPromoMessage(`+${task.reward} SAH earned!`)
      setPromoSuccess(true)
    }
    setProcessing(null)
  }

  const handlePromoRedeem = async () => {
    if (!promoCode.trim()) return
    
    setProcessing('promo')
    const result = await redeemPromoCode(promoCode)
    setPromoMessage(result.message)
    setPromoSuccess(result.success)
    setProcessing(null)
    
    if (result.success) {
      setPromoCode('')
    }
  }

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'daily_bonus': return <Gift size={24} className="text-gold" />
      case 'channel':
      case 'group': return <ExternalLink size={24} className="text-cyan" />
      case 'video_am':
      case 'video_pm': return <Play size={24} className="text-green-neon" />
      default: return <Clock size={24} className="text-text-secondary" />
    }
  }

  return (
    <div className="min-h-screen pb-24 px-4 pt-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gradient-gold mb-2">Task Center</h1>
        <p className="text-text-secondary">Complete tasks to earn SAH coins</p>
      </div>

      {/* Balance */}
      <GlassCard className="mb-6 text-center">
        <p className="text-sm text-text-secondary mb-1">Your Balance</p>
        <p className="text-3xl font-bold text-gradient-gold">{balance.toLocaleString()} SAH</p>
      </GlassCard>

      {/* Promo Code */}
      <GlassCard className="mb-6">
        <h3 className="font-bold text-text-primary mb-3 flex items-center gap-2">
          <Gift size={18} className="text-gold" />
          Promo Code
        </h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
            placeholder="Enter code..."
            className="flex-1 bg-bg-secondary border border-border-glass rounded-xl px-4 py-3 text-text-primary placeholder-text-secondary focus:outline-none focus:border-gold transition-colors"
            onKeyDown={(e) => e.key === 'Enter' && handlePromoRedeem()}
          />
          <motion.button
            className="px-6 py-3 bg-gradient-to-r from-gold to-gold-dark text-bg-primary font-bold rounded-xl"
            whileTap={{ scale: 0.95 }}
            onClick={handlePromoRedeem}
            disabled={processing === 'promo' || !promoCode.trim()}
          >
            {processing === 'promo' ? '...' : 'Redeem'}
          </motion.button>
        </div>
        {promoMessage && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-2 text-sm ${promoSuccess ? 'text-green-neon' : 'text-red-400'}`}
          >
            {promoMessage}
          </motion.p>
        )}
      </GlassCard>

      {/* Tasks */}
      <div className="space-y-4">
        {tasks.map((task, index) => {
          const completed = isTaskCompleted(task.id)

          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard
                hover={!completed}
                className={`cursor-pointer transition-all ${completed ? 'opacity-60' : ''}`}
                onClick={() => !completed && handleTask(task)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-bg-secondary flex items-center justify-center">
                    {completed ? <Check size={24} className="text-green-neon" /> : getTaskIcon(task.type)}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-bold text-text-primary">{task.name}</h3>
                    <p className="text-sm text-text-secondary">{task.description}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-lg font-bold text-gold">+{task.reward}</span>
                    <p className="text-xs text-text-secondary">SAH</p>
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
