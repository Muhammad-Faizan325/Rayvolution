"use client"

import { motion } from "framer-motion"
import { Award, Zap, Users, TrendingUp } from "lucide-react"
import { GreenCoinBalance } from "@/components/green-coin-balance"
import { EcoBadgesShowcase } from "@/components/eco-badges-showcase"
import { Leaderboard } from "@/components/leaderboard"
import { DailyChallenge } from "@/components/daily-challenge"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
}

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-card/10 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Community</h1>
          <p className="text-foreground/60 text-lg">
            Join the Rayvolution: Earn rewards, compete on leaderboards, and make a difference
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {[
            { icon: Users, label: "Active Members", value: "2,847", color: "text-cyan-400" },
            { icon: Zap, label: "GreenCoins Earned", value: "284K", color: "text-emerald-400" },
            { icon: Award, label: "Badges Awarded", value: "12.4K", color: "text-yellow-400" },
            { icon: TrendingUp, label: "Community Growth", value: "+34%", color: "text-orange-400" },
          ].map((stat, i) => {
            const Icon = stat.icon
            return (
              <motion.div key={i} variants={itemVariants} className="glass-dark p-6 rounded-xl text-center">
                <Icon className={`w-8 h-8 ${stat.color} mx-auto mb-3`} />
                <p className="text-foreground/70 text-sm mb-2">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left Column */}
          <motion.div
            className="lg:col-span-2 space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Daily Challenge */}
            <motion.div variants={itemVariants}>
              <DailyChallenge />
            </motion.div>

            {/* Leaderboards */}
            <motion.div variants={itemVariants}>
              <Leaderboard />
            </motion.div>
          </motion.div>

          {/* Right Column */}
          <motion.div className="space-y-8" variants={containerVariants} initial="hidden" animate="visible">
            {/* GreenCoins Balance */}
            <motion.div variants={itemVariants}>
              <GreenCoinBalance balance={3845} />
            </motion.div>

            {/* Eco Badges */}
            <motion.div variants={itemVariants}>
              <EcoBadgesShowcase />
            </motion.div>
          </motion.div>
        </div>

        {/* Achievement Milestones */}
        <motion.div
          className="glass-dark p-8 rounded-xl neon-border-emerald"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h3 className="text-2xl font-bold mb-6">Your Milestones</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "First Step", description: "Reported your first solar usage", completed: true },
              { title: "Week Warrior", description: "Completed 7 daily challenges", completed: true },
              { title: "Solar Champion", description: "Reach 100 GreenCoins", completed: false },
            ].map((milestone, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-lg bg-black/20">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    milestone.completed ? "bg-gradient-to-br from-primary to-accent" : "border-2 border-muted"
                  }`}
                >
                  {milestone.completed && <span className="text-sm">✓</span>}
                </div>
                <div>
                  <p className="font-bold text-foreground">{milestone.title}</p>
                  <p className="text-sm text-foreground/60">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
