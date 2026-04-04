import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface CoinCounterProps {
  value: number
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
}

export function CoinCounter({ value, size = 'md', showIcon = true }: CoinCounterProps) {
  const [displayValue, setDisplayValue] = useState(value)
  const [isIncreasing, setIsIncreasing] = useState(false)
  
  useEffect(() => {
    const diff = value - displayValue
    setIsIncreasing(diff > 0)
    if (Math.abs(diff) < 100) {
      setDisplayValue(value)
      return
    }
    
    const steps = 20
    const increment = diff / steps
    let current = displayValue
    let step = 0
    
    const timer = setInterval(() => {
      step++
      current += increment
      if (step >= steps) {
        setDisplayValue(value)
        clearInterval(timer)
      } else {
        setDisplayValue(Math.floor(current))
      }
    }, 50)
    
    return () => clearInterval(timer)
  }, [value])

  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toLocaleString()
  }

  return (
    <div className={`flex items-center gap-2 ${sizeClasses[size]}`}>
      {showIcon && (
        <motion.span
          className="text-gold"
          animate={{
            rotate: isIncreasing ? [0, 360] : 0,
            scale: isIncreasing ? [1, 1.2, 1] : 1,
          }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          🪙
        </motion.span>
      )}
      <motion.span
        className="font-mono font-bold text-gradient-gold tabular-nums"
        key={displayValue}
        initial={{ y: isIncreasing ? 8 : -8, opacity: 0.5 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {formatNumber(displayValue)}
      </motion.span>
      <span className="text-sm text-text-secondary font-medium">SAH</span>
    </div>
  )
}
