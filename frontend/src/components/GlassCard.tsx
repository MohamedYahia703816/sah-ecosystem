import { motion } from 'framer-motion'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  hover?: boolean
}

export function GlassCard({ children, className = '', onClick, hover = false }: GlassCardProps) {
  const baseClasses = 'glass-card p-4'
  const hoverClasses = hover ? 'glass-card-hover cursor-pointer transition-all duration-200' : ''
  
  if (onClick) {
    return (
      <motion.div
        className={`${baseClasses} ${hoverClasses} ${className}`}
        onClick={onClick}
        whileTap={{ scale: 0.98 }}
        whileHover={{ scale: 1.01 }}
      >
        {children}
      </motion.div>
    )
  }
  
  return (
    <div className={`${baseClasses} ${hoverClasses} ${className}`}>
      {children}
    </div>
  )
}
