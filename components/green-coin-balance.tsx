"use client"

import { motion } from "framer-motion"
import { Zap, TrendingUp } from "lucide-react"

interface GreenCoinBalanceProps {
  balance: number
}

export function GreenCoinBalance({ balance }: GreenCoinBalanceProps) {
  return (
    <motion.div
      className="glass-dark p-8 rounded-xl neon-border-cyan relative overflow-hidden"
      whileHover={{ scale: 1.02 }}
    >
      {/* Animated background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-foreground">GreenCoins Balance</h3>
        </div>

        <motion.div
          className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {balance.toLocaleString()}
        </motion.div>

        <div className="flex items-center gap-2 text-sm text-emerald-400 mb-6">
          <TrendingUp className="w-4 h-4" />
          <span>+45 earned this week</span>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-foreground/70">
            <span>Level Progress</span>
            <span>75%</span>
          </div>
          <div className="w-full h-2 bg-black/30 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-accent"
              initial={{ width: 0 }}
              animate={{ width: "75%" }}
              transition={{ delay: 0.3, duration: 1 }}
            />
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <p className="text-xs text-foreground/60 mb-3">How to earn:</p>
          <ul className="space-y-2 text-xs text-foreground/70">
            <li>• Daily logins: +10 coins</li>
            <li>• Complete challenges: +50 coins</li>
            <li>• Share reports: +25 coins</li>
          </ul>
        </div>
      </div>
    </motion.div>
  )
}
