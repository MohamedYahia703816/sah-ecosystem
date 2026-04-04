import { useState, useEffect, useRef } from 'react'

interface VersionInfo {
  build: number
  timestamp: string
}

export function useVersionCheck(intervalMs = 12 * 60 * 60 * 1000) {
  const [currentVersion, setCurrentVersion] = useState<VersionInfo | null>(null)
  const [hasUpdate, setHasUpdate] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    fetch('/version.json?t=' + Date.now())
      .then(r => r.json())
      .then(data => setCurrentVersion(data))
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!currentVersion) return

    intervalRef.current = setInterval(async () => {
      try {
        const res = await fetch('/version.json?t=' + Date.now())
        const newVersion: VersionInfo = await res.json()
        if (newVersion.build !== currentVersion.build) {
          setHasUpdate(true)
          if (intervalRef.current) clearInterval(intervalRef.current)
        }
      } catch {}
    }, intervalMs)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [currentVersion, intervalMs])

  const handleUpdate = () => {
    window.location.reload()
  }

  return { hasUpdate, handleUpdate }
}
