import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function initUser(userId: string, username?: string, firstName?: string, lastName?: string) {
  const { data, error } = await supabase.rpc('upsert_user', {
    p_id: userId,
    p_username: username || null,
    p_first_name: firstName || null,
    p_last_name: lastName || null,
  })
  if (error) throw error
  return data
}

export async function getUser(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()
  if (error && error.code !== 'PGRST116') throw error
  return data
}

export async function updateUser(userId: string, updates: Record<string, any>) {
  const { data, error } = await supabase
    .from('users')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function getInventory(userId: string) {
  const { data, error } = await supabase
    .from('inventory')
    .select('*')
    .eq('user_id', userId)
  if (error) throw error
  return data || []
}

export async function addToInventory(userId: string, genre: string, level: number) {
  const { data, error } = await supabase
    .from('inventory')
    .insert({ user_id: userId, genre, level })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function getBoosters(userId: string) {
  const { data, error } = await supabase
    .from('boosters')
    .select('*')
    .eq('user_id', userId)
  if (error) throw error
  return data || []
}

export async function updateBooster(userId: string, boosterType: string, level: number) {
  const { data, error } = await supabase
    .from('boosters')
    .upsert({ user_id: userId, booster_type: boosterType, level }, { onConflict: 'user_id,booster_type' })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function getTasks(userId: string) {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
  if (error) throw error
  return data || []
}

export async function completeTask(userId: string, taskType: string) {
  const { data, error } = await supabase
    .from('tasks')
    .upsert({ user_id: userId, task_type: taskType, completed: true, completed_at: new Date().toISOString() }, { onConflict: 'user_id,task_type' })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function getVideoTasks() {
  const { data, error } = await supabase
    .from('video_tasks')
    .select('*')
    .eq('is_active', true)
  if (error) throw error
  return data || []
}

export async function getLeaderboard(limit = 50) {
  const { data, error } = await supabase
    .from('users')
    .select('id, username, first_name, balance, profit_per_hour')
    .order('balance', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data || []
}
