import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { GlassCard } from '../components/GlassCard'
import { Lock, Plus, ToggleLeft, ToggleRight, Trash2, Users, Ticket, Settings, LogOut, Search, Edit2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

type TabType = 'stats' | 'users' | 'promos' | 'tasks'

interface User {
  id: string
  username: string | null
  first_name: string | null
  balance: number
  profit_per_hour: number
  boost_multiplier: number
  last_claim: string | null
  created_at: string
}

interface PromoCode {
  id: string
  code: string
  type: string
  reward_value: number
  max_uses: number
  used_count: number
  is_active: boolean
  expires_at: string | null
}

interface AdminTask {
  id: string
  task_type: string
  title: string
  url: string
  reward: number
  verify_seconds: number
  period: string
  is_active: boolean
}

export function AdminScreen() {
  const [authCode, setAuthCode] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authError, setAuthError] = useState('')
  const [activeTab, setActiveTab] = useState<TabType>('stats')
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({ totalUsers: 0, totalBalance: 0, totalPromos: 0, activeTasks: 0 })
  const [users, setUsers] = useState<User[]>([])
  const [promos, setPromos] = useState<PromoCode[]>([])
  const [tasks, setTasks] = useState<AdminTask[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [balanceEdit, setBalanceEdit] = useState<{ userId: string; amount: number } | null>(null)
  const [showAddPromo, setShowAddPromo] = useState(false)
  const [showAddTask, setShowAddTask] = useState(false)
  const [editingTask, setEditingTask] = useState<AdminTask | null>(null)

  const [newPromo, setNewPromo] = useState({ code: '', type: 'fixed_reward', reward_value: 1000, max_uses: 100 })
  const [newTask, setNewTask] = useState({ task_type: 'video', title: '', url: '', reward: 50, verify_seconds: 30, period: 'daily' })

  useEffect(() => {
    if (sessionStorage.getItem('admin_auth') === 'true') setIsAuthenticated(true)
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      loadStats()
      loadUsers()
      loadPromos()
      loadTasks()
    }
  }, [isAuthenticated])

  const handleAuth = async () => {
    setLoading(true)
    setAuthError('')
    try {
      const { data, error } = await supabase.from('admin_settings').select('value').eq('key', 'admin_code').single()
      if (error || !data) { setAuthError('Authentication failed'); setLoading(false); return }
      if (data.value === authCode.trim()) {
        setIsAuthenticated(true)
        sessionStorage.setItem('admin_auth', 'true')
      } else { setAuthError('Invalid code') }
    } catch { setAuthError('Authentication failed') }
    setLoading(false)
  }

  const loadStats = async () => {
    try {
      const { count: userCount } = await supabase.from('users').select('*', { count: 'exact', head: true })
      const { data: usersData } = await supabase.from('users').select('balance')
      const { count: promoCount } = await supabase.from('promo_codes').select('*', { count: 'exact', head: true })
      const { count: activeCount } = await supabase.from('admin_tasks').select('*', { count: 'exact', head: true }).eq('is_active', true)
      const totalBalance = usersData?.reduce((sum, u) => sum + (u.balance || 0), 0) || 0
      setStats({ totalUsers: userCount || 0, totalBalance, totalPromos: promoCount || 0, activeTasks: activeCount || 0 })
    } catch (err) { console.error('Failed to load stats:', err) }
  }

  const loadUsers = async () => {
    try {
      const { data } = await supabase.from('users').select('*').order('balance', { ascending: false }).limit(100)
      if (data) setUsers(data)
    } catch (err) { console.error('Failed to load users:', err) }
  }

  const loadPromos = async () => {
    try {
      const { data } = await supabase.from('promo_codes').select('*').order('created_at', { ascending: false })
      if (data) setPromos(data)
    } catch (err) { console.error('Failed to load promos:', err) }
  }

  const loadTasks = async () => {
    try {
      const { data } = await supabase.from('admin_tasks').select('*').order('sort_order', { ascending: true })
      if (data) setTasks(data)
    } catch (err) { console.error('Failed to load tasks:', err) }
  }

  const handleBalanceUpdate = async () => {
    if (!balanceEdit) return
    setLoading(true)
    try {
      await supabase.from('users').update({ balance: balanceEdit.amount }).eq('id', balanceEdit.userId)
      setBalanceEdit(null)
      loadUsers()
      loadStats()
    } catch (err) { console.error('Failed to update balance:', err) }
    setLoading(false)
  }

  const handleAddPromo = async () => {
    if (!newPromo.code) return
    setLoading(true)
    try {
      await supabase.from('promo_codes').insert({ ...newPromo, is_active: true })
      setShowAddPromo(false)
      setNewPromo({ code: '', type: 'fixed_reward', reward_value: 1000, max_uses: 100 })
      loadPromos()
      loadStats()
    } catch (err) { console.error('Failed to add promo:', err) }
    setLoading(false)
  }

  const handleTogglePromo = async (promo: PromoCode) => {
    try {
      await supabase.from('promo_codes').update({ is_active: !promo.is_active }).eq('id', promo.id)
      loadPromos()
    } catch (err) { console.error('Failed to toggle promo:', err) }
  }

  const handleDeletePromo = async (id: string) => {
    if (!confirm('Delete this promo code?')) return
    try {
      await supabase.from('promo_codes').delete().eq('id', id)
      loadPromos()
      loadStats()
    } catch (err) { console.error('Failed to delete promo:', err) }
  }

  const handleAddTask = async () => {
    if (!newTask.title || !newTask.url) return
    setLoading(true)
    try {
      await supabase.from('admin_tasks').insert({ ...newTask, is_active: true, sort_order: tasks.length })
      setShowAddTask(false)
      setNewTask({ task_type: 'video', title: '', url: '', reward: 50, verify_seconds: 30, period: 'daily' })
      loadTasks()
      loadStats()
    } catch (err) { console.error('Failed to add task:', err) }
    setLoading(false)
  }

  const handleToggleTask = async (task: AdminTask) => {
    try {
      await supabase.from('admin_tasks').update({ is_active: !task.is_active }).eq('id', task.id)
      loadTasks()
      loadStats()
    } catch (err) { console.error('Failed to toggle task:', err) }
  }

  const handleUpdateTask = async (task: AdminTask) => {
    setLoading(true)
    try {
      await supabase.from('admin_tasks').update({ title: task.title, url: task.url, reward: task.reward, verify_seconds: task.verify_seconds, period: task.period }).eq('id', task.id)
      setEditingTask(null)
      loadTasks()
    } catch (err) { console.error('Failed to update task:', err) }
    setLoading(false)
  }

  const handleDeleteTask = async (id: string) => {
    if (!confirm('Delete this task?')) return
    try {
      await supabase.from('admin_tasks').delete().eq('id', id)
      loadTasks()
      loadStats()
    } catch (err) { console.error('Failed to delete task:', err) }
  }

  const handleLogout = () => { setIsAuthenticated(false); sessionStorage.removeItem('admin_auth') }

  const filteredUsers = users.filter(u =>
    (u.username || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.first_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.id.includes(searchQuery)
  )

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <GlassCard className="w-full max-w-sm p-6">
          <div className="text-center mb-5">
            <Lock size={40} className="mx-auto text-gold mb-3" />
            <h1 className="text-lg font-semibold text-text-primary">Admin Panel</h1>
            <p className="text-text-secondary text-sm mt-1">Enter admin code</p>
          </div>
          <input
            type="password"
            value={authCode}
            onChange={(e) => setAuthCode(e.target.value)}
            placeholder="Admin code..."
            className="w-full bg-bg-secondary border border-border-glass rounded-lg px-3 py-2.5 text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:border-gold transition-colors mb-3"
            onKeyDown={(e) => e.key === 'Enter' && handleAuth()}
          />
          {authError && <p className="text-rose text-xs mb-3 text-center">{authError}</p>}
          <motion.button
            className="w-full py-2.5 bg-gradient-to-r from-gold to-gold-dark text-bg-primary font-semibold text-sm rounded-lg"
            whileTap={{ scale: 0.95 }}
            onClick={handleAuth}
            disabled={loading || !authCode.trim()}
          >
            {loading ? 'Checking...' : 'Login'}
          </motion.button>
        </GlassCard>
      </div>
    )
  }

  const tabs: { id: TabType; label: string; icon: typeof Users }[] = [
    { id: 'stats', label: 'Stats', icon: Settings },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'promos', label: 'Promos', icon: Ticket },
    { id: 'tasks', label: 'Tasks', icon: Settings },
  ]

  return (
    <div className="min-h-screen pb-8 px-4 pt-5">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold text-gradient-gold">Admin Panel</h1>
        <button onClick={handleLogout} className="text-text-secondary hover:text-text-primary"><LogOut size={18} /></button>
      </div>

      <div className="flex gap-1.5 mb-4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1 ${
              activeTab === tab.id ? 'bg-gradient-to-r from-gold to-gold-dark text-bg-primary' : 'glass-card text-text-secondary'
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'stats' && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <GlassCard className="text-center p-3">
              <p className="text-xl font-semibold text-gold">{stats.totalUsers}</p>
              <p className="text-xs text-text-secondary">Total Users</p>
            </GlassCard>
            <GlassCard className="text-center p-3">
              <p className="text-xl font-semibold text-emerald">{stats.totalBalance.toLocaleString()}</p>
              <p className="text-xs text-text-secondary">Total Balance</p>
            </GlassCard>
            <GlassCard className="text-center p-3">
              <p className="text-xl font-semibold text-violet">{stats.totalPromos}</p>
              <p className="text-xs text-text-secondary">Promo Codes</p>
            </GlassCard>
            <GlassCard className="text-center p-3">
              <p className="text-xl font-semibold text-cyan">{stats.activeTasks}</p>
              <p className="text-xs text-text-secondary">Active Tasks</p>
            </GlassCard>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="space-y-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users..."
              className="w-full bg-bg-secondary border border-border-glass rounded-lg pl-9 pr-3 py-2.5 text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:border-gold"
            />
          </div>
          {filteredUsers.map(user => (
            <GlassCard key={user.id} className="p-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-bg-tertiary flex items-center justify-center text-sm font-semibold text-gold flex-shrink-0">
                  {(user.first_name || user.username || '?')[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-text-primary text-sm truncate">{user.first_name || user.username || user.id.slice(0, 8)}</p>
                  <p className="text-xs text-text-secondary truncate">{user.id}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-gold">{user.balance?.toLocaleString() || 0}</p>
                  <p className="text-[10px] text-text-secondary">{user.profit_per_hour}/hr</p>
                </div>
              </div>
              {balanceEdit?.userId === user.id ? (
                <div className="flex gap-2 mt-3">
                  <input
                    type="number"
                    value={balanceEdit.amount}
                    onChange={(e) => setBalanceEdit({ ...balanceEdit, amount: parseInt(e.target.value) || 0 })}
                    className="flex-1 bg-bg-secondary border border-border-glass rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-gold"
                  />
                  <button onClick={handleBalanceUpdate} className="px-3 py-2 bg-emerald text-bg-primary text-xs font-semibold rounded-lg">{loading ? '...' : 'Save'}</button>
                  <button onClick={() => setBalanceEdit(null)} className="px-3 py-2 bg-bg-tertiary text-text-secondary text-xs rounded-lg">Cancel</button>
                </div>
              ) : (
                <button onClick={() => setBalanceEdit({ userId: user.id, amount: user.balance || 0 })} className="mt-2 text-xs text-cyan flex items-center gap-1"><Edit2 size={12} /> Edit Balance</button>
              )}
            </GlassCard>
          ))}
        </div>
      )}

      {activeTab === 'promos' && (
        <div className="space-y-3">
          <motion.button
            className="w-full py-2.5 bg-gradient-to-r from-violet to-violet-light text-white font-semibold text-sm rounded-lg flex items-center justify-center gap-2"
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddPromo(true)}
          >
            <Plus size={16} /> Add Promo Code
          </motion.button>

          <AnimatePresence>
            {showAddPromo && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <GlassCard className="p-3">
                  <div className="space-y-2">
                    <input type="text" value={newPromo.code} onChange={(e) => setNewPromo(p => ({ ...p, code: e.target.value.toUpperCase() }))} placeholder="Code (e.g. TRIAL5000)" className="w-full bg-bg-secondary border border-border-glass rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-gold" />
                    <div className="grid grid-cols-3 gap-2">
                      <input type="number" value={newPromo.reward_value} onChange={(e) => setNewPromo(p => ({ ...p, reward_value: parseInt(e.target.value) || 0 }))} placeholder="Reward" className="bg-bg-secondary border border-border-glass rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-gold" />
                      <input type="number" value={newPromo.max_uses} onChange={(e) => setNewPromo(p => ({ ...p, max_uses: parseInt(e.target.value) || 0 }))} placeholder="Max Uses" className="bg-bg-secondary border border-border-glass rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-gold" />
                      <select value={newPromo.type} onChange={(e) => setNewPromo(p => ({ ...p, type: e.target.value }))} className="bg-bg-secondary border border-border-glass rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-gold">
                        <option value="fixed_reward">Fixed</option>
                        <option value="boost">Boost</option>
                        <option value="unique">Unique</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={handleAddPromo} className="flex-1 py-2 bg-emerald text-bg-primary text-xs font-semibold rounded-lg">{loading ? '...' : 'Create'}</button>
                      <button onClick={() => setShowAddPromo(false)} className="px-4 py-2 bg-bg-tertiary text-text-secondary text-xs rounded-lg">Cancel</button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>

          {promos.map(promo => (
            <GlassCard key={promo.id} className="p-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-bg-tertiary flex items-center justify-center text-sm font-mono font-bold text-gold flex-shrink-0">
                  {promo.code[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-mono font-semibold text-text-primary text-sm">{promo.code}</p>
                  <p className="text-xs text-text-secondary">{promo.reward_value.toLocaleString()} SAH • {promo.used_count}/{promo.max_uses} used</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => handleTogglePromo(promo)} className="p-1.5">
                    {promo.is_active ? <ToggleRight size={20} className="text-emerald" /> : <ToggleLeft size={20} className="text-text-secondary" />}
                  </button>
                  <button onClick={() => handleDeletePromo(promo.id)} className="p-1.5 text-text-secondary hover:text-rose"><Trash2 size={16} /></button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {activeTab === 'tasks' && (
        <div className="space-y-3">
          <motion.button
            className="w-full py-2.5 bg-gradient-to-r from-cyan to-cyan-light text-bg-primary font-semibold text-sm rounded-lg flex items-center justify-center gap-2"
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddTask(true)}
          >
            <Plus size={16} /> Add Task
          </motion.button>

          <AnimatePresence>
            {showAddTask && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <GlassCard className="p-3">
                  <div className="space-y-2">
                    <select value={newTask.task_type} onChange={(e) => setNewTask(t => ({ ...t, task_type: e.target.value }))} className="w-full bg-bg-secondary border border-border-glass rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-gold">
                      <option value="video">📹 Video</option>
                      <option value="like">👍 Like</option>
                      <option value="comment">💬 Comment</option>
                      <option value="share">📤 Share</option>
                    </select>
                    <input type="text" value={newTask.title} onChange={(e) => setNewTask(t => ({ ...t, title: e.target.value }))} placeholder="Title" className="w-full bg-bg-secondary border border-border-glass rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-gold" />
                    <input type="text" value={newTask.url} onChange={(e) => setNewTask(t => ({ ...t, url: e.target.value }))} placeholder="URL" className="w-full bg-bg-secondary border border-border-glass rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-gold" />
                    <div className="grid grid-cols-3 gap-2">
                      <input type="number" value={newTask.reward} onChange={(e) => setNewTask(t => ({ ...t, reward: parseInt(e.target.value) || 0 }))} placeholder="Reward" className="bg-bg-secondary border border-border-glass rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-gold" />
                      <input type="number" value={newTask.verify_seconds} onChange={(e) => setNewTask(t => ({ ...t, verify_seconds: parseInt(e.target.value) || 30 }))} placeholder="Seconds" className="bg-bg-secondary border border-border-glass rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-gold" />
                      <select value={newTask.period} onChange={(e) => setNewTask(t => ({ ...t, period: e.target.value }))} className="bg-bg-secondary border border-border-glass rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-gold">
                        <option value="daily">Daily</option>
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={handleAddTask} className="flex-1 py-2 bg-emerald text-bg-primary text-xs font-semibold rounded-lg">{loading ? '...' : 'Add'}</button>
                      <button onClick={() => setShowAddTask(false)} className="px-4 py-2 bg-bg-tertiary text-text-secondary text-xs rounded-lg">Cancel</button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>

          {tasks.map(task => (
            <GlassCard key={task.id} className="p-3">
              {editingTask?.id === task.id ? (
                <div className="space-y-2">
                  <input type="text" value={editingTask.title} onChange={(e) => setEditingTask(t => t ? { ...t, title: e.target.value } : null)} className="w-full bg-bg-secondary border border-border-glass rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-gold" />
                  <input type="text" value={editingTask.url} onChange={(e) => setEditingTask(t => t ? { ...t, url: e.target.value } : null)} className="w-full bg-bg-secondary border border-border-glass rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-gold" />
                  <div className="grid grid-cols-3 gap-2">
                    <input type="number" value={editingTask.reward} onChange={(e) => setEditingTask(t => t ? { ...t, reward: parseInt(e.target.value) || 0 } : null)} className="bg-bg-secondary border border-border-glass rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-gold" />
                    <input type="number" value={editingTask.verify_seconds} onChange={(e) => setEditingTask(t => t ? { ...t, verify_seconds: parseInt(e.target.value) || 30 } : null)} className="bg-bg-secondary border border-border-glass rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-gold" />
                    <select value={editingTask.period} onChange={(e) => setEditingTask(t => t ? { ...t, period: e.target.value } : null)} className="bg-bg-secondary border border-border-glass rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-gold">
                      <option value="daily">Daily</option>
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleUpdateTask(editingTask)} className="flex-1 py-2 bg-emerald text-bg-primary text-xs font-semibold rounded-lg">Save</button>
                    <button onClick={() => setEditingTask(null)} className="px-4 py-2 bg-bg-tertiary text-text-secondary text-xs rounded-lg">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="text-xl flex-shrink-0">
                    {task.task_type === 'video' ? '📹' : task.task_type === 'like' ? '👍' : task.task_type === 'comment' ? '💬' : '📤'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-text-primary text-sm truncate">{task.title}</p>
                    <p className="text-xs text-text-secondary truncate">{task.url}</p>
                    <div className="flex gap-2 mt-0.5">
                      <span className="text-[10px] text-gold">+{task.reward} SAH</span>
                      <span className="text-[10px] text-cyan">{task.verify_seconds}s</span>
                      <span className="text-[10px] text-text-secondary">{task.period}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleToggleTask(task)} className="p-1.5">
                      {task.is_active ? <ToggleRight size={18} className="text-emerald" /> : <ToggleLeft size={18} className="text-text-secondary" />}
                    </button>
                    <button onClick={() => setEditingTask(task)} className="p-1.5 text-text-secondary hover:text-text-primary"><Edit2 size={14} /></button>
                    <button onClick={() => handleDeleteTask(task.id)} className="p-1.5 text-text-secondary hover:text-rose"><Trash2 size={14} /></button>
                  </div>
                </div>
              )}
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  )
}
