import { motion } from 'framer-motion'

interface LevelBadgeProps {
  level: number
  size?: 'sm' | 'md' | 'lg'
}

export function LevelBadge({ level, size = 'sm' }: LevelBadgeProps) {
  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
  }
  
  return (
    <motion.div
      className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center font-bold text-bg-primary glow-gold flex-shrink-0`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      L{level}
    </motion.div>
  )
}
