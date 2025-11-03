"use client"

import { motion } from "framer-motion"
import { Sun, Wind, TrendingUp, Leaf, Cloud, Zap, Brain, MapPin, Trophy, ArrowRightLeft, Target } from "lucide-react"
import { DashboardCard } from "@/components/dashboard-card"
import { SustainabilityGauge } from "@/components/sustainability-gauge"
import { GrowthChart } from "@/components/growth-chart"
import { WeatherIndicator } from "@/components/weather-indicator"
import { AnimatedCounter } from "@/components/animated-counter"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

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

export default function Dashboard() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [userName, setUserName] = useState("User")

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (!userData) {
      // Redirect to login if not authenticated
      router.push("/login")
    } else {
      // Get user name from localStorage
      const user = JSON.parse(userData)
      setUserName(user.name || "User")
      setIsLoading(false)
    }
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Zap className="w-12 h-12 text-primary" />
        </motion.div>
      </div>
    )
  }

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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">Welcome, {userName}!</h1>
              <p className="text-foreground/60 text-lg">Real-time energy insights across Pakistan</p>
            </div>
            <WeatherIndicator />
          </div>
        </motion.div>

        {/* KPI Cards Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <DashboardCard
              icon={Sun}
              label="Total Solar Users"
              value={<AnimatedCounter target={2847} />}
              trend="+12.5%"
              trendPositive
              accentColor="cyan"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <DashboardCard
              icon={TrendingUp}
              label="Average Power Shortage"
              value={<AnimatedCounter target={34} />}
              suffix="%"
              trend="-8.2%"
              trendPositive
              accentColor="emerald"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <DashboardCard
              icon={Wind}
              label="Average Sunlight Hours"
              value="8.5"
              suffix="hrs"
              trend="+2.1 hrs"
              trendPositive
              accentColor="cyan"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <DashboardCard
              icon={Leaf}
              label="CO₂ Saved"
              value={<AnimatedCounter target={15480} />}
              suffix="tons"
              trend="+28.4%"
              trendPositive
              accentColor="emerald"
            />
          </motion.div>
        </motion.div>

        {/* Sustainability Score & Growth */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.3 }}>
            <SustainabilityGauge score={76} />
          </motion.div>

          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.35 }}
            className="lg:col-span-2"
          >
            <GrowthChart />
          </motion.div>
        </div>

        {/* AI Insights & Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
            className="glass-dark p-6 rounded-xl neon-border-emerald"
          >
            <div className="flex items-start gap-3 mb-4">
              <Zap className="w-5 h-5 text-primary mt-1" />
              <div>
                <h3 className="font-bold text-foreground">AI Insight</h3>
                <p className="text-sm text-foreground/60">Peak Performance</p>
              </div>
            </div>
            <p className="text-foreground/80 text-sm">
              Solar efficiency is 23% above average today. Recommended: Increase grid utilization by 15% to maximize
              renewable output.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.45 }}
            className="glass-dark p-6 rounded-xl neon-border-cyan"
          >
            <div className="flex items-start gap-3 mb-4">
              <Cloud className="w-5 h-5 text-accent mt-1" />
              <div>
                <h3 className="font-bold text-foreground">Weather Alert</h3>
                <p className="text-sm text-foreground/60">Next 3 Days</p>
              </div>
            </div>
            <p className="text-foreground/80 text-sm">
              Sunny conditions expected across 8 provinces. Solar generation forecast: +18% above normal capacity.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.5 }}
            className="glass-dark p-6 rounded-xl"
          >
            <div className="flex items-start gap-3 mb-4">
              <TrendingUp className="w-5 h-5 text-primary mt-1" />
              <div>
                <h3 className="font-bold text-foreground">Growth Trend</h3>
                <p className="text-sm text-foreground/60">This Month</p>
              </div>
            </div>
            <p className="text-foreground/80 text-sm">
              Monthly adoption increased by 847 users. Projected: 4,200 new solar installations by year-end.
            </p>
          </motion.div>
        </div>

        {/* Feature Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <h2 className="text-2xl font-bold mb-6">Explore Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/ai-prediction">
              <Card className="glass-dark p-6 hover:glass-light transition-all cursor-pointer group neon-border-cyan h-full">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-cyan-500/20 group-hover:bg-cyan-500/30 transition-colors">
                    <Brain className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      AI Energy Prediction
                    </h3>
                    <p className="text-sm text-foreground/60">
                      Get 7-day forecasts and smart appliance scheduling recommendations
                    </p>
                  </div>
                </div>
              </Card>
            </Link>

            <Link href="/map">
              <Card className="glass-dark p-6 hover:glass-light transition-all cursor-pointer group neon-border-emerald h-full">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-emerald-500/20 group-hover:bg-emerald-500/30 transition-colors">
                    <MapPin className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground mb-2 group-hover:text-accent transition-colors">
                      Community Impact Map
                    </h3>
                    <p className="text-sm text-foreground/60">
                      Interactive map showing city-wise solar adoption across Pakistan
                    </p>
                  </div>
                </div>
              </Card>
            </Link>

            <Link href="/marketplace">
              <Card className="glass-dark p-6 hover:glass-light transition-all cursor-pointer group neon-border-cyan h-full">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-cyan-500/20 group-hover:bg-cyan-500/30 transition-colors">
                    <ArrowRightLeft className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      Energy Marketplace
                    </h3>
                    <p className="text-sm text-foreground/60">
                      Trade or donate energy tokens to support communities in need
                    </p>
                  </div>
                </div>
              </Card>
            </Link>

            <Link href="/challenges">
              <Card className="glass-dark p-6 hover:glass-light transition-all cursor-pointer group neon-border-emerald h-full">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-orange-500/20 group-hover:bg-orange-500/30 transition-colors">
                    <Target className="w-6 h-6 text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground mb-2 group-hover:text-accent transition-colors">
                      EcoChallenge Mode
                    </h3>
                    <p className="text-sm text-foreground/60">
                      Complete daily tasks, build streaks, and earn GreenCoins rewards
                    </p>
                  </div>
                </div>
              </Card>
            </Link>

            <Link href="/sustainability">
              <Card className="glass-dark p-6 hover:glass-light transition-all cursor-pointer group neon-border-cyan h-full">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-emerald-500/20 group-hover:bg-emerald-500/30 transition-colors">
                    <Leaf className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      Sustainability Score
                    </h3>
                    <p className="text-sm text-foreground/60">
                      Track your eco-performance between 0-100 based on multiple factors
                    </p>
                  </div>
                </div>
              </Card>
            </Link>

            <Link href="/community">
              <Card className="glass-dark p-6 hover:glass-light transition-all cursor-pointer group neon-border-emerald h-full">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-cyan-500/20 group-hover:bg-cyan-500/30 transition-colors">
                    <Trophy className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground mb-2 group-hover:text-accent transition-colors">
                      Community Hub
                    </h3>
                    <p className="text-sm text-foreground/60">
                      Earn badges, compete on leaderboards, and join the Rayvolution
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
