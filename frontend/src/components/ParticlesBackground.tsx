import { useEffect, useRef, useCallback } from 'react'

interface MusicParticle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  rotation: number
  rotationSpeed: number
  pulse: number
  pulseSpeed: number
  symbol: string
}

const musicSymbols = ['♪', '♫', '♬', '♩', '𝅘𝅥𝅮', '𝅗𝅥']

export function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<MusicParticle[]>([])
  const animationRef = useRef<number>(0)

  const createParticles = useCallback((width: number, height: number) => {
    const count = Math.min(30, Math.floor((width * height) / 25000))
    const particles: MusicParticle[] = []
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 14 + 10,
        speedX: (Math.random() - 0.5) * 0.2,
        speedY: -Math.random() * 0.3 - 0.1,
        opacity: Math.random() * 0.25 + 0.05,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.01,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.015 + 0.005,
        symbol: musicSymbols[Math.floor(Math.random() * musicSymbols.length)],
      })
    }
    return particles
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      particlesRef.current = createParticles(canvas.width, canvas.height)
    }

    resize()
    window.addEventListener('resize', resize)

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((p) => {
        p.x += p.speedX
        p.y += p.speedY
        p.rotation += p.rotationSpeed
        p.pulse += p.pulseSpeed

        if (p.y < -30) {
          p.y = canvas.height + 30
          p.x = Math.random() * canvas.width
        }
        if (p.x < -30) p.x = canvas.width + 30
        if (p.x > canvas.width + 30) p.x = -30

        const currentOpacity = p.opacity * (0.5 + 0.5 * Math.sin(p.pulse))

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        ctx.font = `${p.size}px serif`
        ctx.fillStyle = `rgba(200, 134, 10, ${currentOpacity})`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(p.symbol, 0, 0)
        ctx.restore()
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationRef.current)
    }
  }, [createParticles])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.8 }}
    />
  )
}
