import { motion } from 'framer-motion'

interface LevelBadgeProps {
  level: number
  size?: 'sm' | 'md' | 'lg'
}

export function LevelBadge({ level, size = 'md' }: LevelBadgeProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-14 h-14 text-xl',
  }
  
  return (
    <motion.div
      className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center font-bold text-bg-primary shadow-gold`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      L{level}
    </motion.div>
  )
}
