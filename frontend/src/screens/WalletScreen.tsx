import { motion } from 'framer-motion'
import { GlassCard } from '../components/GlassCard'
import { Wallet, ExternalLink, Info } from 'lucide-react'

export function WalletScreen() {
  return (
    <div className="min-h-screen pb-24 px-4 pt-5">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-semibold text-gradient-gold mb-1">Wallet</h1>
        <p className="text-text-secondary text-sm">Connect your TON wallet for future airdrops</p>
      </div>

      <GlassCard className="mb-4 text-center py-8">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-5xl mb-3"
        >
          💎
        </motion.div>
        <h2 className="text-base font-semibold text-text-primary mb-1.5">TON Wallet</h2>
        <p className="text-text-secondary text-sm mb-4 px-4">Connect your TON wallet to receive future airdrops based on your in-game balance</p>
        
        <motion.button
          className="btn-violet flex items-center gap-2 mx-auto"
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
          onClick={() => {
            alert('TON Connect integration coming soon!')
          }}
        >
          <Wallet size={18} />
          Connect TON Wallet
        </motion.button>
      </GlassCard>

      <GlassCard className="mb-4 p-3">
        <div className="flex items-start gap-2.5">
          <Info size={18} className="text-cyan mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-text-primary text-sm mb-1">How Airdrops Work</h3>
            <ul className="text-xs text-text-secondary space-y-1.5">
              <li>• Your SAH balance determines your airdrop allocation</li>
              <li>• Higher profit/hour = better rewards</li>
              <li>• Connect your wallet before the snapshot date</li>
              <li>• Tokens will be distributed directly to your wallet</li>
            </ul>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-3">
        <h3 className="font-semibold text-text-primary text-sm mb-3">Your Stats</h3>
        <div className="space-y-2.5">
          <div className="flex justify-between items-center">
            <span className="text-text-secondary text-sm">Eligible for Airdrop</span>
            <span className="text-emerald text-sm font-medium">Yes</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-text-secondary text-sm">Wallet Status</span>
            <span className="text-text-secondary text-sm font-medium">Not Connected</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-text-secondary text-sm">Snapshot Date</span>
            <span className="text-text-secondary text-sm font-medium">TBA</span>
          </div>
        </div>
      </GlassCard>

      <div className="mt-4 space-y-2">
        <GlassCard
          hover
          className="cursor-pointer flex items-center gap-2.5 p-3"
          onClick={() => window.open('https://t.me/SonicArchitectHub', '_blank')}
        >
          <ExternalLink size={16} className="text-cyan flex-shrink-0" />
          <span className="text-text-primary text-sm">Official Channel</span>
        </GlassCard>
        <GlassCard
          hover
          className="cursor-pointer flex items-center gap-2.5 p-3"
          onClick={() => window.open('https://ton.org', '_blank')}
        >
          <ExternalLink size={16} className="text-cyan flex-shrink-0" />
          <span className="text-text-primary text-sm">Learn about TON</span>
        </GlassCard>
      </div>
    </div>
  )
}
