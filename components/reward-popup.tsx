"use client"

import { motion } from "framer-motion"
import { Zap, Check } from "lucide-react"

interface RewardPopupProps {
  coins: number
  onComplete: () => void
}

export function RewardPopup({ coins, onComplete }: RewardPopupProps) {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="glass-dark p-8 rounded-2xl text-center max-w-sm mx-4 neon-border-cyan"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: "spring",
          damping: 15,
          stiffness: 100,
        }}
      >
        <motion.div
          className="mb-6 flex justify-center"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
            <Zap className="w-10 h-10" />
          </div>
        </motion.div>

        <h3 className="text-2xl font-bold text-foreground mb-2">Report Submitted!</h3>
        <p className="text-foreground/60 mb-6">Thank you for contributing to the community</p>

        <motion.div
          className="mb-6 space-y-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Check className="w-5 h-5 text-emerald-400" />
            <span className="text-foreground">Report verified</span>
          </div>
          <p className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            +{coins} GreenCoins
          </p>
        </motion.div>

        <motion.button
          onClick={onComplete}
          className="w-full py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-semibold transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Continue
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
