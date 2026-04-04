export interface InstrumentLevel {
  level: number
  name: string
  price: number
  profitPerHour: number
  icon: string
}

export interface Genre {
  id: string
  name: string
  icon: string
  color: string
  levels: InstrumentLevel[]
}

export const LEVEL_PRICES = [
  { level: 1, price: 400, profit: 10 },
  { level: 2, price: 1000, profit: 60 },
  { level: 3, price: 3500, profit: 220 },
  { level: 4, price: 9000, profit: 600 },
  { level: 5, price: 25000, profit: 1800 },
]

export const genres: Genre[] = [
  {
    id: 'oriental',
    name: 'Oriental',
    icon: '🎵',
    color: '#FFD700',
    levels: [
      { level: 1, name: 'Oud Reed', price: 400, profitPerHour: 10, icon: '🪕' },
      { level: 2, name: 'Oriental Violin', price: 1000, profitPerHour: 60, icon: '🎻' },
      { level: 3, name: 'Qanun', price: 3500, profitPerHour: 220, icon: '🎶' },
      { level: 4, name: 'Ancient Ney', price: 9000, profitPerHour: 600, icon: '🎺' },
      { level: 5, name: 'Full Oriental Ensemble', price: 25000, profitPerHour: 1800, icon: '🎼' },
    ],
  },
  {
    id: 'rap',
    name: 'Rap & Hip-Hop',
    icon: '🎤',
    color: '#FF6B35',
    levels: [
      { level: 1, name: '808 Drum Machine', price: 400, profitPerHour: 10, icon: '🥁' },
      { level: 2, name: 'Studio Microphone', price: 1000, profitPerHour: 60, icon: '🎙️' },
      { level: 3, name: 'Sampler', price: 3500, profitPerHour: 220, icon: '🎛️' },
      { level: 4, name: 'MPC Producer', price: 9000, profitPerHour: 600, icon: '🎹' },
      { level: 5, name: 'Pro Rap Studio', price: 25000, profitPerHour: 1800, icon: '🏆' },
    ],
  },
  {
    id: 'dj',
    name: 'DJ & EDM',
    icon: '🎧',
    color: '#00F2FF',
    levels: [
      { level: 1, name: 'Launchpad', price: 400, profitPerHour: 10, icon: '🎮' },
      { level: 2, name: 'DJ Mixer', price: 1000, profitPerHour: 60, icon: '🎚️' },
      { level: 3, name: 'Synthesizer', price: 3500, profitPerHour: 220, icon: '🎹' },
      { level: 4, name: 'Visualizer System', price: 9000, profitPerHour: 600, icon: '💡' },
      { level: 5, name: 'World Festival Stage', price: 25000, profitPerHour: 1800, icon: '🏟️' },
    ],
  },
  {
    id: 'shabi',
    name: "Sha'abi",
    icon: '🎪',
    color: '#FF4081',
    levels: [
      { level: 1, name: 'Shaabi Organ', price: 400, profitPerHour: 10, icon: '🎹' },
      { level: 2, name: 'Pro Darbuka', price: 1000, profitPerHour: 60, icon: '🪘' },
      { level: 3, name: 'Reverb Unit', price: 3500, profitPerHour: 220, icon: '🔊' },
      { level: 4, name: 'Wedding Mixer', price: 9000, profitPerHour: 600, icon: '🎛️' },
      { level: 5, name: 'Full Shaabi Band', price: 25000, profitPerHour: 1800, icon: '🎉' },
    ],
  },
  {
    id: 'orchestral',
    name: 'Orchestral',
    icon: '🎼',
    color: '#9C27B0',
    levels: [
      { level: 1, name: 'Violin', price: 400, profitPerHour: 10, icon: '🎻' },
      { level: 2, name: 'Grand Piano', price: 1000, profitPerHour: 60, icon: '🎹' },
      { level: 3, name: 'Cello', price: 3500, profitPerHour: 220, icon: '🎵' },
      { level: 4, name: 'Harp', price: 9000, profitPerHour: 600, icon: '🎶' },
      { level: 5, name: 'Full Orchestra', price: 25000, profitPerHour: 1800, icon: '🏛️' },
    ],
  },
  {
    id: 'jazz',
    name: 'Jazz',
    icon: '🎷',
    color: '#FF9800',
    levels: [
      { level: 1, name: 'Harmonica', price: 400, profitPerHour: 10, icon: '🎵' },
      { level: 2, name: 'Saxophone', price: 1000, profitPerHour: 60, icon: '🎷' },
      { level: 3, name: 'Trumpet', price: 3500, profitPerHour: 220, icon: '🎺' },
      { level: 4, name: 'Double Bass', price: 9000, profitPerHour: 600, icon: '🎸' },
      { level: 5, name: 'Full Jazz Band', price: 25000, profitPerHour: 1800, icon: '🎷' },
    ],
  },
]

export interface Booster {
  id: string
  name: string
  icon: string
  description: string
  maxLevel: number
  bonusPerLevel: number[]
  baseCost: number
  costMultiplier: number
}

export const boosters: Booster[] = [
  {
    id: 'soundproof',
    name: 'Sound Isolation',
    icon: '🔇',
    description: 'Block outside noise for cleaner recordings',
    maxLevel: 3,
    bonusPerLevel: [0.10, 0.10, 0.10],
    baseCost: 500,
    costMultiplier: 2.5,
  },
  {
    id: 'soundcard',
    name: 'Pro Sound Card',
    icon: '🔌',
    description: 'High-quality audio interface',
    maxLevel: 3,
    bonusPerLevel: [0.25, 0.25, 0.25],
    baseCost: 1000,
    costMultiplier: 3,
  },
  {
    id: 'monitoring',
    name: 'Monitoring Headphones',
    icon: '🎧',
    description: 'Studio-grade monitoring',
    maxLevel: 3,
    bonusPerLevel: [0.15, 0.15, 0.15],
    baseCost: 750,
    costMultiplier: 2.5,
  },
  {
    id: 'mixer',
    name: 'Master Mixer',
    icon: '🎛️',
    description: 'Professional mixing console',
    maxLevel: 3,
    bonusPerLevel: [0.20, 0.20, 0.20],
    baseCost: 2000,
    costMultiplier: 3,
  },
  {
    id: 'ai_agent',
    name: 'AI Music Agent',
    icon: '🤖',
    description: 'AI-powered music distribution',
    maxLevel: 2,
    bonusPerLevel: [0.50, 0.50],
    baseCost: 5000,
    costMultiplier: 4,
  },
]

export interface Task {
  id: string
  name: string
  icon: string
  description: string
  reward: number
  type: 'daily_bonus' | 'channel' | 'group' | 'video_am' | 'video_pm' | 'promo'
  url?: string
  repeatable?: boolean
  cooldownHours?: number
}

export const tasks: Task[] = [
  {
    id: 'daily_bonus',
    name: 'Daily Login Bonus',
    icon: '🎁',
    description: 'Claim your daily SAH coins',
    reward: 100,
    type: 'daily_bonus',
    repeatable: true,
    cooldownHours: 24,
  },
  {
    id: 'channel_join',
    name: 'Join Our Channel',
    icon: '📢',
    description: 'Subscribe to Sonic Architect Hub',
    reward: 150,
    type: 'channel',
    url: import.meta.env.VITE_TELEGRAM_CHANNEL || 'https://t.me/SonicArchitectHub',
  },
  {
    id: 'group_join',
    name: 'Join Our Group',
    icon: '💬',
    description: 'Join the community discussion',
    reward: 150,
    type: 'group',
    url: import.meta.env.VITE_TELEGRAM_GROUP || 'https://t.me/SonicArchitect_Hub',
  },
  {
    id: 'video_am',
    name: 'Morning Video',
    icon: '🌅',
    description: 'Watch the morning session video',
    reward: 50,
    type: 'video_am',
    repeatable: true,
    cooldownHours: 12,
  },
  {
    id: 'video_pm',
    name: 'Evening Video',
    icon: '🌙',
    description: 'Watch the evening session video',
    reward: 50,
    type: 'video_pm',
    repeatable: true,
    cooldownHours: 12,
  },
]
