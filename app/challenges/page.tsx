"use client"

import { motion } from "framer-motion"
import { Target, Flame, Trophy, Star, CheckCircle, Clock, Zap, TrendingUp } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DashboardCard } from "@/components/dashboard-card"
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

interface Challenge {
  id: string
  title: string
  description: string
  reward: number
  difficulty: "easy" | "medium" | "hard"
  timeLeft: string
  progress: number
  total: number
  completed: boolean
}

const dailyChallenges: Challenge[] = [
  {
    id: "1",
    title: "Energy Saver",
    description: "Keep your energy usage below 5 kWh today",
    reward: 50,
    difficulty: "easy",
    timeLeft: "8h 30m",
    progress: 3.2,
    total: 5,
    completed: false,
  },
  {
    id: "2",
    title: "Peak Performance",
    description: "Generate at least 8 kWh from solar today",
    reward: 75,
    difficulty: "medium",
    timeLeft: "8h 30m",
    progress: 6.5,
    total: 8,
    completed: false,
  },
  {
    id: "3",
    title: "Community Contributor",
    description: "Share one energy report with the community",
    reward: 100,
    difficulty: "easy",
    timeLeft: "8h 30m",
    progress: 0,
    total: 1,
    completed: false,
  },
]

const weeklyChallenges: Challenge[] = [
  {
    id: "4",
    title: "7-Day Streak",
    description: "Complete daily challenges for 7 consecutive days",
    reward: 500,
    difficulty: "hard",
    timeLeft: "3 days",
    progress: 5,
    total: 7,
    completed: false,
  },
  {
    id: "5",
    title: "Efficiency Master",
    description: "Maintain 85%+ solar efficiency for a week",
    reward: 300,
    difficulty: "medium",
    timeLeft: "3 days",
    progress: 4,
    total: 7,
    completed: false,
  },
]

export default function ChallengesPage() {
  const [streakDays] = useState(12)
  const [completedToday] = useState(2)
  const [totalEarned] = useState(1250)

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
            <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 neon-glow-cyan">
              <Target className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">EcoChallenge Mode</h1>
              <p className="text-foreground/60 text-lg">
                Complete daily tasks, build streaks, and earn rewards
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <DashboardCard
              icon={Flame}
              label="Current Streak"
              value={streakDays.toString()}
              suffix="days"
              trend="Personal best!"
              trendPositive
              accentColor="cyan"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <DashboardCard
              icon={CheckCircle}
              label="Completed Today"
              value={completedToday.toString()}
              suffix={`/ ${dailyChallenges.length}`}
              trend="Keep going!"
              trendPositive
              accentColor="emerald"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <DashboardCard
              icon={Trophy}
              label="GreenCoins Earned"
              value={totalEarned.toString()}
              trend="+225 this week"
              trendPositive
              accentColor="cyan"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <DashboardCard
              icon={TrendingUp}
              label="Challenge Rank"
              value="#47"
              trend="Top 5% globally"
              trendPositive
              accentColor="emerald"
            />
          </motion.div>
        </motion.div>

        {/* Streak Tracker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="glass-dark p-6 neon-border-cyan">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <Flame className="w-6 h-6 text-orange-400" />
                Your Streak
              </h2>
              <div className="text-right">
                <p className="text-sm text-foreground/60">Next Milestone</p>
                <p className="text-xl font-bold text-primary">15 Days</p>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-4">
              {Array.from({ length: 14 }, (_, i) => {
                const isCompleted = i < streakDays
                const isToday = i === streakDays - 1
                return (
                  <motion.div
                    key={i}
                    className={`aspect-square rounded-lg flex items-center justify-center text-xs font-bold ${
                      isCompleted
                        ? isToday
                          ? "bg-gradient-to-br from-orange-500 to-red-500 text-white neon-glow-cyan"
                          : "bg-gradient-to-br from-emerald-500 to-green-600 text-white"
                        : "glass-light text-foreground/40"
                    }`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    {i + 1}
                  </motion.div>
                )
              })}
            </div>

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gradient-to-br from-emerald-500 to-green-600" />
                <span className="text-foreground/60">Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gradient-to-br from-orange-500 to-red-500" />
                <span className="text-foreground/60">Today</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded glass-light" />
                <span className="text-foreground/60">Upcoming</span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Daily Challenges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <Card className="glass-dark p-6 neon-border-emerald">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <Clock className="w-6 h-6 text-accent" />
                Today's Challenges
              </h2>
              <div className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium">
                Resets in 8h 30m
              </div>
            </div>

            <div className="space-y-4">
              {dailyChallenges.map((challenge, index) => (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="p-5 rounded-xl glass-light border border-accent/20 hover:border-accent/40 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-lg text-foreground">{challenge.title}</h3>
                        <div
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            challenge.difficulty === "easy"
                              ? "bg-green-500/20 text-green-400"
                              : challenge.difficulty === "medium"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {challenge.difficulty}
                        </div>
                      </div>
                      <p className="text-foreground/70 text-sm mb-3">{challenge.description}</p>

                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="flex justify-between text-xs text-foreground/60 mb-1">
                          <span>Progress</span>
                          <span>
                            {challenge.progress} / {challenge.total}{" "}
                            {challenge.total > 1 ? "units" : "task"}
                          </span>
                        </div>
                        <div className="h-2 bg-foreground/10 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-primary to-accent"
                            initial={{ width: 0 }}
                            animate={{ width: `${(challenge.progress / challenge.total) * 100}%` }}
                            transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-400" />
                      <span className="font-bold text-foreground">+{challenge.reward} GreenCoins</span>
                    </div>
                    {challenge.progress >= challenge.total ? (
                      <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Claim Reward
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline">
                        Track Progress
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Weekly Challenges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass-dark p-6 neon-border-cyan">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <Trophy className="w-6 h-6 text-primary" />
                Weekly Challenges
              </h2>
              <div className="px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-medium">
                Resets in 3 days
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {weeklyChallenges.map((challenge, index) => (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="p-5 rounded-xl glass-light border border-primary/20 hover:border-primary/40 transition-all"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-primary/20">
                      <Zap className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-foreground">{challenge.title}</h3>
                        <div
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            challenge.difficulty === "medium"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {challenge.difficulty}
                        </div>
                      </div>
                      <p className="text-sm text-foreground/70">{challenge.description}</p>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-foreground/60 mb-1">
                      <span>Progress</span>
                      <span>
                        {challenge.progress} / {challenge.total} days
                      </span>
                    </div>
                    <div className="h-2 bg-foreground/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-accent to-primary"
                        style={{ width: `${(challenge.progress / challenge.total) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-400" />
                      <span className="font-bold text-accent">+{challenge.reward} GreenCoins</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
