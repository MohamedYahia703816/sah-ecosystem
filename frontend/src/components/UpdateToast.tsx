import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw } from 'lucide-react'

interface UpdateToastProps {
  hasUpdate: boolean
  onReload: () => void
}

export function UpdateToast({ hasUpdate, onReload }: UpdateToastProps) {
  return (
    <AnimatePresence>
      {hasUpdate && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-4 left-4 right-4 z-[100]"
        >
          <div className="glass-card p-3 flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-text-primary flex-1">
              A new version is available!
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={onReload}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-gold to-gold-dark text-bg-primary text-xs font-semibold rounded-lg"
              >
                <RefreshCw size={14} />
                Reload
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
