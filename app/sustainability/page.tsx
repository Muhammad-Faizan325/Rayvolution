"use client"

import { motion } from "framer-motion"
import { Leaf, TrendingUp, Award, Zap, Droplet, Wind, Users, Target } from "lucide-react"
import { Card } from "@/components/ui/card"
import { SustainabilityGauge } from "@/components/sustainability-gauge"
import { useState } from "react"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
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

const scoreBreakdown = [
  { category: "Energy Saved", score: 85, max: 100, icon: Zap, color: "text-yellow-400" },
  { category: "CO₂ Reduced", score: 78, max: 100, icon: Leaf, color: "text-emerald-400" },
  { category: "Community Engagement", score: 92, max: 100, icon: Users, color: "text-cyan-400" },
  { category: "Consistency", score: 65, max: 100, icon: Target, color: "text-orange-400" },
]

const monthlyProgress = [
  { month: "Jan", score: 62 },
  { month: "Feb", score: 68 },
  { month: "Mar", score: 71 },
  { month: "Apr", score: 76 },
  { month: "May", score: 76 },
  { month: "Jun", score: 76 },
]

const achievements = [
  {
    title: "Top 10% Nationally",
    description: "Your sustainability score is higher than 90% of users",
    icon: Trophy,
    unlocked: true,
  },
  {
    title: "100-Day Streak",
    description: "Unlock at 100 consecutive days of reporting",
    icon: Flame,
    unlocked: false,
    progress: 67,
  },
  {
    title: "Carbon Neutral Hero",
    description: "Saved 10,000 kg CO₂ - You did it!",
    icon: Leaf,
    unlocked: true,
  },
]

import { Flame, Trophy } from "lucide-react"

export default function SustainabilityPage() {
  const [overallScore] = useState(76)

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
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 neon-glow-emerald">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">AI Sustainability Score</h1>
              <p className="text-foreground/60 text-lg">
                Track your eco-performance and environmental impact
              </p>
            </div>
          </div>
        </motion.div>

        {/* Main Score Display */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <SustainabilityGauge score={overallScore} />

            <Card className="glass-dark p-6 mt-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Your Ranking
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-foreground/60">National Rank</span>
                  <span className="font-bold text-primary text-xl">#142</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-foreground/60">City Rank (Lahore)</span>
                  <span className="font-bold text-accent text-xl">#23</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-foreground/60">Top Percentile</span>
                  <span className="font-bold text-emerald-400 text-xl">10%</span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Score Breakdown */}
          <motion.div
            className="lg:col-span-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Card className="glass-dark p-6 neon-border-emerald">
              <h2 className="text-2xl font-bold mb-6">Score Breakdown</h2>

              <div className="space-y-6">
                {scoreBreakdown.map((item, index) => {
                  const Icon = item.icon
                  const percentage = (item.score / item.max) * 100

                  return (
                    <motion.div key={item.category} variants={itemVariants}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Icon className={`w-5 h-5 ${item.color}`} />
                          <span className="font-medium text-foreground">{item.category}</span>
                        </div>
                        <span className="font-bold text-foreground">
                          {item.score}/{item.max}
                        </span>
                      </div>

                      <div className="relative h-3 bg-foreground/10 rounded-full overflow-hidden">
                        <motion.div
                          className={`absolute inset-y-0 left-0 bg-gradient-to-r ${
                            percentage >= 80
                              ? "from-emerald-500 to-green-600"
                              : percentage >= 60
                                ? "from-cyan-500 to-blue-600"
                                : "from-orange-500 to-red-600"
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                        />
                      </div>

                      <p className="text-xs text-foreground/60 mt-1">
                        {percentage >= 80
                          ? "Excellent performance"
                          : percentage >= 60
                            ? "Good, keep improving"
                            : "Needs attention"}
                      </p>
                    </motion.div>
                  )
                })}
              </div>
            </Card>

            {/* Monthly Progress */}
            <Card className="glass-dark p-6 mt-6 neon-border-cyan">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-primary" />
                6-Month Progress
              </h2>

              <div className="flex items-end justify-between gap-4 h-48">
                {monthlyProgress.map((month, index) => (
                  <motion.div
                    key={month.month}
                    className="flex-1 flex flex-col items-center gap-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <div className="text-xs text-foreground/60 font-medium">{month.score}</div>
                    <motion.div
                      className={`w-full rounded-t-lg bg-gradient-to-t ${
                        month.score >= 75
                          ? "from-emerald-500 to-green-600"
                          : "from-cyan-500 to-blue-600"
                      }`}
                      initial={{ height: 0 }}
                      animate={{ height: `${(month.score / 100) * 100}%` }}
                      transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                    />
                    <div className="text-xs text-foreground font-medium">{month.month}</div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-lg glass-light">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  <div>
                    <p className="font-bold text-foreground">+14 Points This Month</p>
                    <p className="text-sm text-foreground/60">
                      You're on track to reach 80+ score by next month
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <Card className="glass-dark p-6 neon-border-emerald">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Award className="w-6 h-6 text-accent" />
              Sustainability Achievements
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {achievements.map((achievement, index) => {
                const Icon = achievement.icon
                return (
                  <motion.div
                    key={achievement.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className={`p-5 rounded-xl ${
                      achievement.unlocked
                        ? "glass-light border-2 border-accent/40"
                        : "glass-dark border border-foreground/20"
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                        achievement.unlocked
                          ? "bg-gradient-to-br from-accent to-primary"
                          : "bg-foreground/10"
                      }`}
                    >
                      <Icon
                        className={`w-6 h-6 ${achievement.unlocked ? "text-white" : "text-foreground/40"}`}
                      />
                    </div>

                    <h3
                      className={`font-bold mb-1 ${achievement.unlocked ? "text-foreground" : "text-foreground/60"}`}
                    >
                      {achievement.title}
                    </h3>
                    <p className="text-sm text-foreground/60 mb-3">{achievement.description}</p>

                    {!achievement.unlocked && achievement.progress !== undefined && (
                      <div>
                        <div className="h-2 bg-foreground/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-accent"
                            style={{ width: `${achievement.progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-foreground/60 mt-1">{achievement.progress}% complete</p>
                      </div>
                    )}

                    {achievement.unlocked && (
                      <div className="inline-flex items-center gap-1 px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 text-xs font-medium">
                        <Award className="w-3 h-3" />
                        Unlocked
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </Card>
        </motion.div>

        {/* AI Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-dark p-6 neon-border-cyan">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                How to Improve
              </h3>
              <div className="space-y-3">
                <div className="p-3 rounded-lg glass-light">
                  <p className="font-medium text-foreground mb-1">Boost Consistency Score</p>
                  <p className="text-sm text-foreground/70">
                    Report your energy data daily for 7 consecutive days to improve by +15 points
                  </p>
                </div>
                <div className="p-3 rounded-lg glass-light">
                  <p className="font-medium text-foreground mb-1">Increase CO₂ Reduction</p>
                  <p className="text-sm text-foreground/70">
                    Switch 2 more appliances to solar hours to save 50kg CO₂/month
                  </p>
                </div>
              </div>
            </Card>

            <Card className="glass-dark p-6 neon-border-emerald">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-accent" />
                Impact Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-foreground/60">Energy Saved (Total)</span>
                  <span className="font-bold text-primary">2,847 kWh</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-foreground/60">CO₂ Prevented</span>
                  <span className="font-bold text-emerald-400">1,423 kg</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-foreground/60">Trees Equivalent</span>
                  <span className="font-bold text-accent">71 trees</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-foreground/60">Money Saved</span>
                  <span className="font-bold text-primary">Rs 79,716</span>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
