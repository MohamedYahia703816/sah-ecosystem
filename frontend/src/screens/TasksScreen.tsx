import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '../context/GameContext'
import { GlassCard } from '../components/GlassCard'
import { tasks } from '../data/gameData'
import { ExternalLink, Check, Clock, Gift, Play, AlertCircle } from 'lucide-react'

type WatchState = 'idle' | 'opened' | 'watching' | 'completed'

interface WatchSession {
  taskId: string
  url: string
  reward: number
  state: WatchState
  progress: number
}

export function TasksScreen() {
  const { balance, completedTasks, completeTask, redeemPromoCode } = useGame()
  const [promoCode, setPromoCode] = useState('')
  const [promoMessage, setPromoMessage] = useState('')
  const [promoSuccess, setPromoSuccess] = useState<boolean | null>(null)
  const [processing, setProcessing] = useState<string | null>(null)
  const [watchSession, setWatchSession] = useState<WatchSession | null>(null)
  const watchTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const isTaskCompleted = (taskId: string) => completedTasks.includes(taskId)

  const handleTask = async (task: typeof tasks[0]) => {
    if (isTaskCompleted(task.id) || processing) return

    if (task.type === 'video_am' || task.type === 'video_pm') {
      if (task.url && task.url.includes('PLACEHOLDER')) {
        setPromoMessage('Video not available yet. Check back later!')
        setPromoSuccess(false)
        return
      }

      ;(window as any).Telegram?.WebApp?.openLink?.(task.url) || window.open(task.url, '_blank')

      setWatchSession({
        taskId: task.id,
        url: task.url || '',
        reward: task.reward,
        state: 'opened',
        progress: 0,
      })
      return
    }

    setProcessing(task.id)

    if (task.url) {
      ;(window as any).Telegram?.WebApp?.openLink?.(task.url) || window.open(task.url, '_blank')
      await new Promise(resolve => setTimeout(resolve, 2000))
    }

    const success = await completeTask(task.id, task.reward)
    if (success) {
      setPromoMessage(`+${task.reward} SAH earned!`)
      setPromoSuccess(true)
    }
    setProcessing(null)
  }

  const startWatching = useCallback(() => {
    if (!watchSession) return
    setWatchSession(prev => prev ? { ...prev, state: 'watching', progress: 0 } : null)
  }, [watchSession])

  const claimReward = useCallback(async () => {
    if (!watchSession) return
    setProcessing(watchSession.taskId)
    const success = await completeTask(watchSession.taskId, watchSession.reward)
    if (success) {
      setPromoMessage(`+${watchSession.reward} SAH earned!`)
      setPromoSuccess(true)
    }
    setProcessing(null)
    setWatchSession(null)
  }, [watchSession, completeTask])

  useEffect(() => {
    if (!watchSession || watchSession.state !== 'watching') return

    watchTimerRef.current = setInterval(() => {
      setWatchSession(prev => {
        if (!prev || prev.state !== 'watching') return prev
        const next = prev.progress + 1
        if (next >= 30) {
          if (watchTimerRef.current) clearInterval(watchTimerRef.current)
          return { ...prev, progress: 30, state: 'completed' }
        }
        return { ...prev, progress: next }
      })
    }, 1000)

    return () => {
      if (watchTimerRef.current) clearInterval(watchTimerRef.current)
    }
  }, [watchSession?.taskId, watchSession?.state])

  useEffect(() => {
    if (watchSession?.state === 'completed') {
      claimReward()
    }
  }, [watchSession?.state, claimReward])

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
      case 'daily_bonus': return <Gift size={20} className="text-gold" />
      case 'channel':
      case 'group': return <ExternalLink size={20} className="text-cyan" />
      case 'video_am':
      case 'video_pm': return <Play size={20} className="text-emerald" />
      default: return <Clock size={20} className="text-text-secondary" />
    }
  }

  return (
    <div className="min-h-screen pb-24 px-4 pt-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-semibold text-gradient-gold mb-2">Task Center</h1>
        <p className="text-text-secondary text-sm">Complete tasks to earn SAH coins</p>
      </div>

      <GlassCard className="mb-5 text-center p-4">
        <p className="text-xs text-text-secondary mb-1">Your Balance</p>
        <p className="text-2xl font-semibold text-gradient-gold">{balance.toLocaleString()} SAH</p>
      </GlassCard>

      <GlassCard className="mb-5 p-4">
        <h3 className="font-semibold text-text-primary text-sm mb-3 flex items-center gap-2">
          <Gift size={16} className="text-gold" />
          Promo Code
        </h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
            placeholder="Enter code..."
            className="flex-1 bg-bg-secondary border border-border-glass rounded-lg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-gold transition-colors"
            onKeyDown={(e) => e.key === 'Enter' && handlePromoRedeem()}
          />
          <motion.button
            className="px-4 py-2.5 bg-gradient-to-r from-gold to-gold-dark text-bg-primary font-semibold text-sm rounded-lg"
            whileTap={{ scale: 0.95 }}
            onClick={handlePromoRedeem}
            disabled={processing === 'promo' || !promoCode.trim()}
          >
            {processing === 'promo' ? '...' : 'Redeem'}
          </motion.button>
        </div>
        {promoMessage && (
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-2 text-xs ${promoSuccess ? 'text-emerald' : 'text-rose'}`}
          >
            {promoMessage}
          </motion.p>
        )}
      </GlassCard>

      <div className="space-y-3">
        {tasks.map((task, index) => {
          const completed = isTaskCompleted(task.id)

          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 }}
            >
              <GlassCard
                hover={!completed}
                className={`cursor-pointer transition-all ${completed ? 'opacity-50' : ''}`}
                onClick={() => !completed && handleTask(task)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-lg bg-bg-tertiary flex items-center justify-center flex-shrink-0">
                    {completed ? <Check size={18} className="text-emerald" /> : getTaskIcon(task.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-text-primary text-sm truncate">{task.name}</h3>
                    <p className="text-xs text-text-secondary truncate">{task.description}</p>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="text-sm font-semibold text-gold">+{task.reward}</span>
                    <p className="text-[10px] text-text-secondary">SAH</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )
        })}
      </div>

      <AnimatePresence>
        {watchSession && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-end sm:items-center justify-center"
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="glass-card w-full sm:max-w-md mx-4 mb-4 sm:mb-0 p-6"
            >
              {watchSession.state === 'opened' && (
                <div className="text-center">
                  <div className="text-4xl mb-4">📺</div>
                  <h3 className="text-base font-semibold text-text-primary mb-2">Video Opened!</h3>
                  <p className="text-text-secondary text-sm mb-5">
                    The video opened in your browser. Watch it, then come back and confirm.
                  </p>
                  <motion.button
                    className="w-full py-3 bg-gradient-to-r from-emerald to-emerald-light text-bg-primary font-semibold text-sm rounded-lg"
                    whileTap={{ scale: 0.95 }}
                    onClick={startWatching}
                  >
                    ✅ I Watched the Video
                  </motion.button>
                </div>
              )}

              {watchSession.state === 'watching' && (
                <div className="text-center">
                  <div className="text-4xl mb-4">⏱️</div>
                  <h3 className="text-base font-semibold text-text-primary mb-2">Verifying...</h3>
                  <p className="text-text-secondary text-xs mb-4">
                    Stay on this page for {30 - watchSession.progress} more seconds
                  </p>

                  <div className="mb-4">
                    <div className="h-2 bg-bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-cyan to-emerald"
                        style={{ width: `${(watchSession.progress / 30) * 100}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-xs text-text-secondary">Progress</span>
                      <span className="text-xs font-semibold text-cyan">{watchSession.progress}/30s</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-1.5 text-text-secondary text-xs">
                    <AlertCircle size={14} />
                    <span>Don't close this window</span>
                  </div>
                </div>
              )}

              {watchSession.state === 'completed' && (
                <div className="text-center py-4">
                  <div className="text-4xl mb-4">🎉</div>
                  <h3 className="text-base font-semibold text-emerald mb-1">Reward Earned!</h3>
                  <p className="text-text-secondary text-sm">+{watchSession.reward} SAH added to your balance</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
