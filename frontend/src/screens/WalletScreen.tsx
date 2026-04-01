import { motion } from 'framer-motion'
import { GlassCard } from '../components/GlassCard'
import { Wallet, ExternalLink, Info } from 'lucide-react'

export function WalletScreen() {
  return (
    <div className="min-h-screen pb-24 px-4 pt-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gradient-gold mb-2">Wallet</h1>
        <p className="text-text-secondary">Connect your TON wallet for future airdrops</p>
      </div>

      {/* Wallet Card */}
      <GlassCard className="mb-6 text-center py-12">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-6xl mb-4"
        >
          💎
        </motion.div>
        <h2 className="text-xl font-bold text-text-primary mb-2">TON Wallet</h2>
        <p className="text-text-secondary mb-6">Connect your TON wallet to receive future airdrops based on your in-game balance</p>
        
        <motion.button
          className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-xl flex items-center gap-2 mx-auto"
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
          onClick={() => {
            // TON Connect integration placeholder
            alert('TON Connect integration coming soon!')
          }}
        >
          <Wallet size={20} />
          Connect TON Wallet
        </motion.button>
      </GlassCard>

      {/* Info */}
      <GlassCard className="mb-6">
        <div className="flex items-start gap-3">
          <Info size={20} className="text-cyan mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-text-primary mb-1">How Airdrops Work</h3>
            <ul className="text-sm text-text-secondary space-y-2">
              <li>• Your SAH balance determines your airdrop allocation</li>
              <li>• Higher profit/hour = better rewards</li>
              <li>• Connect your wallet before the snapshot date</li>
              <li>• Tokens will be distributed directly to your wallet</li>
            </ul>
          </div>
        </div>
      </GlassCard>

      {/* Stats */}
      <GlassCard>
        <h3 className="font-bold text-text-primary mb-4">Your Stats</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-text-secondary">Eligible for Airdrop</span>
            <span className="text-green-neon font-medium">Yes</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-text-secondary">Wallet Status</span>
            <span className="text-text-secondary font-medium">Not Connected</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-text-secondary">Snapshot Date</span>
            <span className="text-text-secondary font-medium">TBA</span>
          </div>
        </div>
      </GlassCard>

      {/* External Links */}
      <div className="mt-6 space-y-3">
        <GlassCard
          hover
          className="cursor-pointer flex items-center gap-3"
          onClick={() => window.open('https://t.me/SonicArchitectHub', '_blank')}
        >
          <ExternalLink size={18} className="text-cyan" />
          <span className="text-text-primary">Official Channel</span>
        </GlassCard>
        <GlassCard
          hover
          className="cursor-pointer flex items-center gap-3"
          onClick={() => window.open('https://ton.org', '_blank')}
        >
          <ExternalLink size={18} className="text-cyan" />
          <span className="text-text-primary">Learn about TON</span>
        </GlassCard>
      </div>
    </div>
  )
}
