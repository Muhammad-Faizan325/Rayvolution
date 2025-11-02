"use client"

import { motion } from "framer-motion"
import { type LucideIcon, TrendingUp, TrendingDown } from "lucide-react"
import type { ReactNode } from "react"

interface DashboardCardProps {
  icon: LucideIcon
  label: string
  value: ReactNode
  suffix?: string
  trend: string
  trendPositive: boolean
  accentColor?: "cyan" | "emerald"
}

export function DashboardCard({
  icon: Icon,
  label,
  value,
  suffix,
  trend,
  trendPositive,
  accentColor = "cyan",
}: DashboardCardProps) {
  const borderClass = accentColor === "cyan" ? "neon-border-cyan" : "neon-border-emerald"
  const accentClass =
    accentColor === "cyan" ? "text-cyan-400 dark:text-cyan-300" : "text-emerald-400 dark:text-emerald-300"

  return (
    <motion.div
      className={`glass-dark p-6 rounded-xl group hover:scale-105 transition-all duration-300 cursor-pointer ${borderClass}`}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex justify-between items-start mb-4">
        <div
          className={`w-10 h-10 rounded-lg bg-gradient-to-br from-primary/50 to-accent/50 flex items-center justify-center ${accentClass} group-hover:neon-glow-cyan`}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <p className="text-foreground/70 text-sm mb-2">{label}</p>

      <div className="flex items-baseline gap-2 mb-4">
        <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {value}
        </div>
        {suffix && <span className="text-foreground/50 text-sm">{suffix}</span>}
      </div>

      <div className={`flex items-center gap-1 text-sm ${trendPositive ? "text-emerald-400" : "text-red-400"}`}>
        {trendPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
        <span>{trend}</span>
        <span className="text-foreground/50">this month</span>
      </div>
    </motion.div>
  )
}
