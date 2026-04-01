import { useState, useEffect } from 'react'

interface CoinCounterProps {
  value: number
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
}

export function CoinCounter({ value, size = 'md', showIcon = true }: CoinCounterProps) {
  const [displayValue, setDisplayValue] = useState(value)
  
  useEffect(() => {
    const diff = value - displayValue
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
      {showIcon && <span className="text-gold">🪙</span>}
      <span className="font-mono font-bold text-gradient-gold tabular-nums">
        {formatNumber(displayValue)}
      </span>
      <span className="text-sm text-text-secondary font-medium">SAH</span>
    </div>
  )
}
