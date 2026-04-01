import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { supabase, getUser, updateUser, getInventory, getBoosters, getTasks as fetchTasks, completeTask as completeTaskDb, addToInventory as addToInventoryDb, updateBooster as updateBoosterDb } from '../lib/supabase'
import { getTelegramUserId, initTelegram, notifyHapticFeedback } from '../lib/telegram'
import { boosters as boostersData, genres } from '../data/gameData'

interface InventoryItem {
  genre: string
  level: number
}

interface BoosterState {
  boosterType: string
  level: number
}

interface GameState {
  userId: string | null
  balance: number
  profitPerHour: number
  boostMultiplier: number
  selectedGenre: string | null
  ownedGenres: string[]
  inventory: InventoryItem[]
  boosters: BoosterState[]
  completedTasks: string[]
  lastClaim: Date | null
  lastDailyBonus: Date | null
  isLoading: boolean
  error: string | null
}

interface GameContextType extends GameState {
  claimPassiveIncome: () => Promise<number>
  purchaseInstrument: (genre: string, level: number) => Promise<boolean>
  purchaseBooster: (boosterType: string) => Promise<boolean>
  completeTask: (taskType: string, reward: number) => Promise<boolean>
  selectGenre: (genre: string) => Promise<void>
  redeemPromoCode: (code: string) => Promise<{ success: boolean; message: string; reward?: number }>
  refreshData: () => Promise<void>
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>({
    userId: null,
    balance: 0,
    profitPerHour: 0,
    boostMultiplier: 1.0,
    selectedGenre: null,
    ownedGenres: [],
    inventory: [],
    boosters: [],
    completedTasks: [],
    lastClaim: null,
    lastDailyBonus: null,
    isLoading: true,
    error: null,
  })

  const syncIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    initTelegram()
    const userId = getTelegramUserId()
    if (!userId) {
      setState(prev => ({ ...prev, isLoading: false, error: 'Could not get Telegram user ID' }))
      return
    }
    setState(prev => ({ ...prev, userId }))
    loadUserData(userId)
  }, [])

  useEffect(() => {
    if (state.userId && state.profitPerHour > 0) {
      syncIntervalRef.current = setInterval(() => {
        syncBalance()
      }, 30000)
    }
    return () => {
      if (syncIntervalRef.current) clearInterval(syncIntervalRef.current)
    }
  }, [state.userId, state.profitPerHour])

  const loadUserData = async (userId: string) => {
    try {
      const [user, inventory, boosters, tasks] = await Promise.all([
        getUser(userId),
        getInventory(userId),
        getBoosters(userId),
        fetchTasks(userId),
      ])

      if (!user) {
        await supabase.from('users').insert({
          id: userId,
          balance: 0,
          profit_per_hour: 0,
          boost_multiplier: 1.0,
          owned_genres: [],
          last_claim: new Date().toISOString(),
        })
      }

      const userData = user || { balance: 0, profit_per_hour: 0, boost_multiplier: 1.0, selected_genre: null, owned_genres: [], last_claim: null, last_daily_bonus: null }
      
      let passiveEarnings = 0
      if (userData.last_claim && userData.profit_per_hour > 0) {
        const hoursPassed = Math.min((Date.now() - new Date(userData.last_claim).getTime()) / (1000 * 60 * 60), 24)
        passiveEarnings = Math.floor(hoursPassed * userData.profit_per_hour * (userData.boost_multiplier || 1.0))
      }

      const totalBalance = (userData.balance || 0) + passiveEarnings

      setState(prev => ({
        ...prev,
        balance: totalBalance,
        profitPerHour: userData.profit_per_hour || 0,
        boostMultiplier: userData.boost_multiplier || 1.0,
        selectedGenre: userData.selected_genre || null,
        ownedGenres: userData.owned_genres || [],
        inventory: inventory.map(i => ({ genre: i.genre, level: i.level })),
        boosters: boosters.map(b => ({ boosterType: b.booster_type, level: b.level })),
        completedTasks: tasks.filter(t => t.completed).map(t => t.task_type),
        lastClaim: userData.last_claim ? new Date(userData.last_claim) : null,
        lastDailyBonus: userData.last_daily_bonus ? new Date(userData.last_daily_bonus) : null,
        isLoading: false,
      }))

      if (passiveEarnings > 0) {
        await updateUser(userId, { balance: totalBalance, last_claim: new Date().toISOString() })
      }
    } catch (err: any) {
      console.error('Error loading user data:', err)
      setState(prev => ({ ...prev, isLoading: false, error: err.message }))
    }
  }

  const syncBalance = async () => {
    if (!state.userId) return
    try {
      await updateUser(state.userId, { balance: state.balance, last_claim: new Date().toISOString() })
    } catch (err) {
      console.error('Sync error:', err)
    }
  }

  const claimPassiveIncome = useCallback(async (): Promise<number> => {
    if (!state.userId) return 0
    try {
      await updateUser(state.userId, { last_claim: new Date().toISOString() })
      setState(prev => ({ ...prev, lastClaim: new Date() }))
      return 0
    } catch (err: any) {
      console.error('Claim error:', err)
      return 0
    }
  }, [state.userId])

  const purchaseInstrument = useCallback(async (genre: string, level: number): Promise<boolean> => {
    if (!state.userId) return false
    
    const genreData = genres.find(g => g.id === genre)
    if (!genreData) return false
    
    const levelData = genreData.levels.find(l => l.level === level)
    if (!levelData) return false

    if (state.balance < levelData.price) return false

    const alreadyOwned = state.inventory.some(i => i.genre === genre && i.level === level)
    if (alreadyOwned) return false

    try {
      notifyHapticFeedback('medium')
      
      await addToInventoryDb(state.userId, genre, level)

      const newProfitPerHour = state.profitPerHour + levelData.profitPerHour
      const newBalance = state.balance - levelData.price
      const newOwnedGenres = state.ownedGenres.includes(genre) ? state.ownedGenres : [...state.ownedGenres, genre]
      const newInventory = [...state.inventory, { genre, level }]

      await updateUser(state.userId, {
        balance: newBalance,
        profit_per_hour: newProfitPerHour,
        owned_genres: newOwnedGenres,
      })

      setState(prev => ({
        ...prev,
        balance: newBalance,
        profitPerHour: newProfitPerHour,
        ownedGenres: newOwnedGenres,
        inventory: newInventory,
      }))

      return true
    } catch (err: any) {
      console.error('Purchase error:', err)
      setState(prev => ({ ...prev, error: err.message }))
      return false
    }
  }, [state.userId, state.balance, state.profitPerHour, state.inventory, state.ownedGenres])

  const purchaseBooster = useCallback(async (boosterType: string): Promise<boolean> => {
    if (!state.userId) return false
    
    const boosterData = boostersData.find(b => b.id === boosterType)
    if (!boosterData) return false

    const currentBooster = state.boosters.find(b => b.boosterType === boosterType)
    const currentLevel = currentBooster?.level || 0
    
    if (currentLevel >= boosterData.maxLevel) return false

    const cost = Math.floor(boosterData.baseCost * Math.pow(boosterData.costMultiplier, currentLevel))
    if (state.balance < cost) return false

    try {
      notifyHapticFeedback('medium')
      
      await updateBoosterDb(state.userId, boosterType, currentLevel + 1)

      const bonus = boosterData.bonusPerLevel[currentLevel]
      const newBoostMultiplier = state.boostMultiplier + bonus
      const newBalance = state.balance - cost

      await updateUser(state.userId, {
        balance: newBalance,
        boost_multiplier: newBoostMultiplier,
      })

      setState(prev => ({
        ...prev,
        balance: newBalance,
        boostMultiplier: newBoostMultiplier,
        boosters: prev.boosters.some(b => b.boosterType === boosterType)
          ? prev.boosters.map(b => b.boosterType === boosterType ? { ...b, level: currentLevel + 1 } : b)
          : [...prev.boosters, { boosterType, level: currentLevel + 1 }],
      }))

      return true
    } catch (err: any) {
      console.error('Booster purchase error:', err)
      setState(prev => ({ ...prev, error: err.message }))
      return false
    }
  }, [state.userId, state.balance, state.boostMultiplier, state.boosters])

  const completeTask = useCallback(async (taskType: string, reward: number): Promise<boolean> => {
    if (!state.userId) return false
    
    if (state.completedTasks.includes(taskType)) return false

    try {
      notifyHapticFeedback('success' as any)
      
      await completeTaskDb(state.userId, taskType)

      const newBalance = state.balance + reward
      const newCompletedTasks = [...state.completedTasks, taskType]

      await updateUser(state.userId, {
        balance: newBalance,
        last_daily_bonus: taskType === 'daily_bonus' ? new Date().toISOString() : undefined,
      })

      setState(prev => ({
        ...prev,
        balance: newBalance,
        completedTasks: newCompletedTasks,
        lastDailyBonus: taskType === 'daily_bonus' ? new Date() : prev.lastDailyBonus,
      }))

      return true
    } catch (err: any) {
      console.error('Task completion error:', err)
      setState(prev => ({ ...prev, error: err.message }))
      return false
    }
  }, [state.userId, state.balance, state.completedTasks])

  const selectGenre = useCallback(async (genre: string) => {
    if (!state.userId) return
    try {
      await updateUser(state.userId, { selected_genre: genre })
      setState(prev => ({ ...prev, selectedGenre: genre }))
    } catch (err: any) {
      console.error('Genre selection error:', err)
    }
  }, [state.userId])

  const redeemPromoCode = useCallback(async (code: string): Promise<{ success: boolean; message: string; reward?: number }> => {
    if (!state.userId) return { success: false, message: 'User not authenticated' }
    
    const trimmedCode = code.trim().toUpperCase()
    if (!trimmedCode) return { success: false, message: 'Please enter a code' }

    try {
      const { data: promoData, error: promoError } = await supabase
        .from('promo_codes')
        .select('*')
        .eq('code', trimmedCode)
        .eq('is_active', true)
        .single()
      
      if (promoError || !promoData) {
        return { success: false, message: 'Invalid promo code' }
      }
      
      if (promoData.expires_at && new Date(promoData.expires_at) < new Date()) {
        return { success: false, message: 'This promo code has expired' }
      }
      
      if (promoData.used_count >= promoData.max_uses) {
        return { success: false, message: 'This promo code has been fully used' }
      }
      
      const { data: usageData } = await supabase
        .from('promo_usage')
        .select('*')
        .eq('promo_code_id', promoData.id)
        .eq('user_id', state.userId)
        .single()
      
      if (usageData) {
        return { success: false, message: 'You have already used this code' }
      }
      
      if (promoData.type === 'unique' && promoData.used_count > 0) {
        return { success: false, message: 'This unique code has already been claimed' }
      }

      await supabase.from('promo_usage').insert({ 
        promo_code_id: promoData.id, 
        user_id: state.userId 
      })

      try {
        await supabase.rpc('update_promo_usage', { 
          p_code_id: promoData.id 
        })
      } catch {
        await supabase.from('promo_codes')
          .update({ used_count: promoData.used_count + 1 })
          .eq('id', promoData.id)
      }

      if (promoData.type === 'boost') {
        const boostEndsAt = new Date(Date.now() + (promoData.boost_duration_hours || 2) * 60 * 60 * 1000)
        await updateUser(state.userId, {
          active_boost_type: 'promo_boost',
          active_boost_ends_at: boostEndsAt.toISOString(),
        })
        return { success: true, message: `Boost activated for ${promoData.boost_duration_hours || 2} hours!`, reward: promoData.reward_value }
      }

      const newBalance = state.balance + promoData.reward_value
      await updateUser(state.userId, { balance: newBalance })
      setState(prev => ({ ...prev, balance: newBalance }))

      return { success: true, message: `Received ${promoData.reward_value} SAH coins!`, reward: promoData.reward_value }
    } catch (err: any) {
      console.error('Promo code error:', err)
      return { success: false, message: err.message || 'Failed to redeem code' }
    }
  }, [state.userId, state.balance])

  const refreshData = useCallback(async () => {
    if (state.userId) {
      await loadUserData(state.userId)
    }
  }, [state.userId])

  useEffect(() => {
    if (state.profitPerHour > 0) {
      const interval = setInterval(() => {
        setState(prev => ({
          ...prev,
          balance: prev.balance + Math.floor(prev.profitPerHour * prev.boostMultiplier / 3600),
        }))
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [state.profitPerHour])

  return (
    <GameContext.Provider value={{
      ...state,
      claimPassiveIncome,
      purchaseInstrument,
      purchaseBooster,
      completeTask,
      selectGenre,
      redeemPromoCode,
      refreshData,
    }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const context = useContext(GameContext)
  if (!context) throw new Error('useGame must be used within GameProvider')
  return context
}
