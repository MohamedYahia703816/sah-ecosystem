import { motion } from 'framer-motion'

interface OrbitVisualizerProps {
  instrument: string
  level: number
  genreColor: string
  isActive: boolean
}

export function OrbitVisualizer({ instrument, level, genreColor, isActive }: OrbitVisualizerProps) {
  const orbitCount = Math.min(level, 5)
  
  return (
    <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
      {/* Orbit rings */}
      {Array.from({ length: orbitCount }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border"
          style={{
            width: `${120 + i * 40}px`,
            height: `${120 + i * 40}px`,
            borderColor: genreColor + '40',
            boxShadow: `0 0 ${10 + i * 5}px ${genreColor}20`,
          }}
          animate={{
            rotate: isActive ? [0, 360] : 0,
            scale: isActive ? [1, 1.02, 1] : 1,
          }}
          transition={{
            rotate: { duration: 8 + i * 2, repeat: Infinity, ease: 'linear' },
            scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
          }}
        />
      ))}
      
      {/* Particles on orbits */}
      {Array.from({ length: orbitCount * 3 }).map((_, i) => {
        const orbitIndex = Math.floor(i / 3)
        const particleIndex = i % 3
        const radius = 60 + orbitIndex * 20
        const angle = (particleIndex * 120 + orbitIndex * 30) * (Math.PI / 180)
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius
        
        return (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-2 h-2 rounded-full"
            style={{
              backgroundColor: genreColor,
              boxShadow: `0 0 8px ${genreColor}`,
              left: '50%',
              top: '50%',
            }}
            animate={{
              x: isActive ? [x, x * 0.9, x] : x,
              y: isActive ? [y, y * 0.9, y] : y,
              opacity: isActive ? [0.6, 1, 0.6] : 0.3,
            }}
            transition={{
              duration: 2 + orbitIndex * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.1,
            }}
          />
        )
      })}
      
      {/* Center instrument */}
      <motion.div
        className="relative z-10 text-7xl"
        animate={{
          scale: isActive ? [1, 1.05, 1] : 1,
          filter: isActive ? `drop-shadow(0 0 15px ${genreColor})` : 'none',
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {instrument}
      </motion.div>
      
      {/* Center glow */}
      <motion.div
        className="absolute w-32 h-32 rounded-full"
        style={{
          background: `radial-gradient(circle, ${genreColor}30 0%, transparent 70%)`,
        }}
        animate={{
          scale: isActive ? [1, 1.2, 1] : 1,
          opacity: isActive ? [0.5, 0.8, 0.5] : 0.2,
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  )
}
