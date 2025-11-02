"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface SustainabilityGaugeProps {
  score: number
}

export function SustainabilityGauge({ score }: SustainabilityGaugeProps) {
  const [displayScore, setDisplayScore] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayScore(score)
    }, 100)
    return () => clearTimeout(timer)
  }, [score])

  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (displayScore / 100) * circumference

  return (
    <div className="glass-dark p-8 rounded-xl neon-border-emerald flex flex-col items-center justify-center min-h-[280px]">
      <h3 className="text-foreground/70 text-sm font-medium mb-6">AI Sustainability Score</h3>

      <div className="relative w-48 h-48 mb-6">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
          {/* Background circle */}
          <circle
            cx="60"
            cy="60"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-foreground/10"
          />
          {/* Progress circle */}
          <motion.circle
            cx="60"
            cy="60"
            r="45"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            strokeLinecap="round"
            animate={{ strokeDashoffset }}
            transition={{ duration: 2, ease: "easeOut" }}
            style={{ filter: "drop-shadow(0 0 8px rgba(147, 197, 253, 0.5))" }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(147, 197, 253, 1)" />
              <stop offset="100%" stopColor="rgba(110, 231, 183, 1)" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {displayScore}
          </motion.div>
          <div className="text-xs text-foreground/60">/ 100</div>
        </div>
      </div>

      <p className="text-center text-sm text-foreground/70">
        Excellent performance across all metrics. Keep maintaining renewable energy adoption growth.
      </p>
    </div>
  )
}
