"use client"

import { motion } from "framer-motion"
import { Brain, Sun, CloudRain, Zap, TrendingUp, Calendar, Clock, AlertCircle } from "lucide-react"
import { DashboardCard } from "@/components/dashboard-card"
import { Card } from "@/components/ui/card"
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

const weeklyForecast = [
  { day: "Monday", sunlight: 8.5, generation: 45, weather: "sunny", optimal: true },
  { day: "Tuesday", sunlight: 8.2, generation: 43, weather: "sunny", optimal: true },
  { day: "Wednesday", sunlight: 6.5, generation: 32, weather: "cloudy", optimal: false },
  { day: "Thursday", sunlight: 8.8, generation: 48, weather: "sunny", optimal: true },
  { day: "Friday", sunlight: 7.2, generation: 38, weather: "partly-cloudy", optimal: false },
  { day: "Saturday", sunlight: 9.1, generation: 52, weather: "sunny", optimal: true },
  { day: "Sunday", sunlight: 8.6, generation: 46, weather: "sunny", optimal: true },
]

const smartSuggestions = [
  {
    time: "10:00 AM - 2:00 PM",
    activity: "Run Washing Machine",
    reason: "Peak sunlight hours tomorrow",
    energySaved: "2.5 kWh",
    icon: Sun,
  },
  {
    time: "11:00 AM - 1:00 PM",
    activity: "Charge Electric Devices",
    reason: "Maximum solar generation expected",
    energySaved: "1.8 kWh",
    icon: Zap,
  },
  {
    time: "Avoid: 6:00 PM - 8:00 PM",
    activity: "Heavy Appliances",
    reason: "Low sunlight on Wednesday",
    energySaved: "3.2 kWh",
    icon: AlertCircle,
  },
]

export default function AIPrediction() {
  const [selectedDay, setSelectedDay] = useState(0)

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
            <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 neon-glow-cyan">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">AI Energy Prediction</h1>
              <p className="text-foreground/60 text-lg">
                Smart forecasting to optimize your solar energy usage
              </p>
            </div>
          </div>
        </motion.div>

        {/* KPI Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <DashboardCard
              icon={Sun}
              label="Avg Sunlight This Week"
              value="8.1"
              suffix="hrs"
              trend="+1.2 hrs"
              trendPositive
              accentColor="cyan"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <DashboardCard
              icon={Zap}
              label="Expected Generation"
              value="304"
              suffix="kWh"
              trend="+15%"
              trendPositive
              accentColor="emerald"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <DashboardCard
              icon={TrendingUp}
              label="Best Day"
              value="Saturday"
              trend="9.1 hrs sunlight"
              trendPositive
              accentColor="cyan"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <DashboardCard
              icon={CloudRain}
              label="Low Sunlight Alert"
              value="Wednesday"
              trend="6.5 hrs only"
              trendPositive={false}
              accentColor="emerald"
            />
          </motion.div>
        </motion.div>

        {/* Weekly Forecast */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <Card className="glass-dark p-6 neon-border-cyan">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Calendar className="w-6 h-6 text-primary" />
              7-Day Energy Forecast
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {weeklyForecast.map((day, index) => (
                <motion.button
                  key={day.day}
                  onClick={() => setSelectedDay(index)}
                  className={`p-4 rounded-xl transition-all ${
                    selectedDay === index
                      ? "glass-light neon-border-emerald scale-105"
                      : "glass-dark hover:glass-light"
                  } ${day.optimal ? "border-emerald-500/30" : "border-orange-500/30"}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="text-center">
                    <p className="text-xs text-foreground/60 mb-2">{day.day}</p>
                    {day.weather === "sunny" ? (
                      <Sun className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                    ) : day.weather === "cloudy" ? (
                      <CloudRain className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    ) : (
                      <CloudRain className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    )}
                    <p className="text-sm font-bold text-foreground">{day.sunlight} hrs</p>
                    <p className="text-xs text-primary">{day.generation} kWh</p>
                    {day.optimal && (
                      <div className="mt-2 px-2 py-1 bg-emerald-500/20 rounded text-xs text-emerald-400">
                        Optimal
                      </div>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Selected Day Details */}
            <motion.div
              key={selectedDay}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mt-6 p-4 rounded-xl glass-light border border-primary/20"
            >
              <h3 className="font-bold text-lg mb-2">{weeklyForecast[selectedDay].day} Details</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-foreground/60">Sunlight Hours</p>
                  <p className="text-xl font-bold text-primary">
                    {weeklyForecast[selectedDay].sunlight} hrs
                  </p>
                </div>
                <div>
                  <p className="text-foreground/60">Expected Generation</p>
                  <p className="text-xl font-bold text-accent">
                    {weeklyForecast[selectedDay].generation} kWh
                  </p>
                </div>
                <div>
                  <p className="text-foreground/60">Weather</p>
                  <p className="text-xl font-bold capitalize">{weeklyForecast[selectedDay].weather}</p>
                </div>
              </div>
            </motion.div>
          </Card>
        </motion.div>

        {/* Smart Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <Card className="glass-dark p-6 neon-border-emerald">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Clock className="w-6 h-6 text-accent" />
              AI Smart Suggestions
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {smartSuggestions.map((suggestion, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="p-5 rounded-xl glass-light border border-accent/20 hover:border-accent/40 transition-all"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-accent/20">
                      <suggestion.icon className="w-5 h-5 text-accent" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-foreground/60 mb-1">{suggestion.time}</p>
                      <h3 className="font-bold text-foreground">{suggestion.activity}</h3>
                    </div>
                  </div>
                  <p className="text-sm text-foreground/70 mb-3">{suggestion.reason}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-foreground/60">Potential Savings</span>
                    <span className="text-sm font-bold text-emerald-400">{suggestion.energySaved}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-dark p-6 neon-border-cyan">
              <div className="flex items-start gap-3 mb-4">
                <Brain className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h3 className="font-bold text-lg text-foreground">Weekly Pattern Analysis</h3>
                  <p className="text-sm text-foreground/60">AI-generated insights</p>
                </div>
              </div>
              <p className="text-foreground/80 mb-4">
                Your solar system will perform 15% better than last week due to improved weather conditions.
                Saturday shows optimal conditions with 9.1 hours of sunlight.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/60">Optimal Days</span>
                  <span className="font-bold text-emerald-400">5 out of 7</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/60">Total Expected Generation</span>
                  <span className="font-bold text-primary">304 kWh</span>
                </div>
              </div>
            </Card>

            <Card className="glass-dark p-6 neon-border-emerald">
              <div className="flex items-start gap-3 mb-4">
                <AlertCircle className="w-6 h-6 text-accent mt-1" />
                <div>
                  <h3 className="font-bold text-lg text-foreground">Smart Alerts</h3>
                  <p className="text-sm text-foreground/60">Upcoming notifications</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                  <p className="text-sm font-medium text-emerald-400 mb-1">High Performance Alert</p>
                  <p className="text-xs text-foreground/70">
                    Saturday will have peak sunlight. Consider running energy-intensive tasks.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/30">
                  <p className="text-sm font-medium text-orange-400 mb-1">Low Sunlight Warning</p>
                  <p className="text-xs text-foreground/70">
                    Wednesday may have reduced generation. Minimize heavy appliance usage.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
