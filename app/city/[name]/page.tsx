"use client"

import { motion } from "framer-motion"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Cloud, Leaf, Zap, TrendingUp } from "lucide-react"
import { SustainabilityGauge } from "@/components/sustainability-gauge"

const shortageData = [
  { month: "Jan", shortage: 42 },
  { month: "Feb", shortage: 40 },
  { month: "Mar", shortage: 38 },
  { month: "Apr", shortage: 35 },
  { month: "May", shortage: 32 },
  { month: "Jun", shortage: 30 },
  { month: "Jul", shortage: 28 },
]

const adoptionData = [
  { month: "Jan", adoption: 28 },
  { month: "Feb", adoption: 32 },
  { month: "Mar", adoption: 36 },
  { month: "Apr", adoption: 40 },
  { month: "May", adoption: 44 },
  { month: "Jun", adoption: 48 },
  { month: "Jul", shortage: 52 },
]

const efficiencyData = [
  { day: "Mon", efficiency: 82 },
  { day: "Tue", efficiency: 85 },
  { day: "Wed", efficiency: 88 },
  { day: "Thu", efficiency: 84 },
  { day: "Fri", efficiency: 90 },
  { day: "Sat", efficiency: 92 },
  { day: "Sun", efficiency: 88 },
]

export default function CityPage({ params }: { params: { name: string } }) {
  const cityName = decodeURIComponent(params.name)

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-card/10 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Background */}
        <motion.div
          className="mb-12 relative h-48 rounded-xl overflow-hidden neon-border-cyan group"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-transparent opacity-60" />
          <div className="relative z-10 h-full flex flex-col justify-end p-8">
            <h1 className="text-5xl font-bold text-foreground mb-2">{cityName}</h1>
            <p className="text-foreground/70">Detailed solar adoption and energy insights</p>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {[
            { icon: TrendingUp, label: "Solar Adoption", value: "52%", color: "text-primary" },
            { icon: Zap, label: "Power Shortage", value: "28%", color: "text-red-400" },
            { icon: Cloud, label: "Sunlight Hours", value: "8.2h", color: "text-yellow-400" },
            { icon: Leaf, label: "CO₂ Saved", value: "5.2K tons", color: "text-emerald-400" },
          ].map((metric, i) => {
            const Icon = metric.icon
            return (
              <motion.div
                key={i}
                className="glass-dark p-6 rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Icon className={`w-5 h-5 ${metric.color} mb-2`} />
                <p className="text-foreground/70 text-sm mb-1">{metric.label}</p>
                <p className="text-3xl font-bold text-foreground">{metric.value}</p>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Sustainability Score */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <SustainabilityGauge score={68} />
          </motion.div>

          {/* Solar Adoption Over Time */}
          <motion.div
            className="glass-dark p-6 rounded-xl neon-border-cyan lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <h3 className="text-lg font-bold text-foreground mb-4">Solar Adoption Over Time</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={adoptionData}>
                <defs>
                  <linearGradient id="colorAdoption" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="rgba(147, 197, 253, 0.8)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="rgba(147, 197, 253, 0)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(147, 197, 253, 0.1)" />
                <XAxis dataKey="month" stroke="rgba(147, 197, 253, 0.5)" />
                <YAxis stroke="rgba(147, 197, 253, 0.5)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.9)",
                    border: "1px solid rgba(147, 197, 253, 0.3)",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="adoption"
                  stroke="rgba(147, 197, 253, 1)"
                  fillOpacity={1}
                  fill="url(#colorAdoption)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Power Shortage & Efficiency */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <motion.div
            className="glass-dark p-6 rounded-xl neon-border-emerald"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-bold text-foreground mb-4">Power Shortage Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={shortageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(110, 231, 183, 0.1)" />
                <XAxis dataKey="month" stroke="rgba(110, 231, 183, 0.5)" />
                <YAxis stroke="rgba(110, 231, 183, 0.5)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.9)",
                    border: "1px solid rgba(110, 231, 183, 0.3)",
                    borderRadius: "8px",
                  }}
                />
                <Line type="monotone" dataKey="shortage" stroke="rgba(239, 68, 68, 1)" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            className="glass-dark p-6 rounded-xl neon-border-cyan"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <h3 className="text-lg font-bold text-foreground mb-4">Predicted Energy Efficiency</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={efficiencyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(147, 197, 253, 0.1)" />
                <XAxis dataKey="day" stroke="rgba(147, 197, 253, 0.5)" />
                <YAxis stroke="rgba(147, 197, 253, 0.5)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.9)",
                    border: "1px solid rgba(147, 197, 253, 0.3)",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="efficiency" fill="rgba(147, 197, 253, 0.7)" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* AI Recommendations */}
        <motion.div
          className="glass-dark p-8 rounded-xl neon-border-emerald"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-xl font-bold text-foreground mb-6">AI Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Expansion Opportunity",
                description:
                  "Current adoption rate (52%) shows strong potential. Recommend installing 150 more solar units in residential areas.",
                icon: TrendingUp,
              },
              {
                title: "Load Balancing",
                description:
                  "Peak hours (10 AM - 3 PM) show 92% efficiency. Incentivize consumption during this window to maximize solar utilization.",
                icon: Zap,
              },
            ].map((rec, i) => {
              const Icon = rec.icon
              return (
                <div key={i} className="flex gap-4">
                  <Icon className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-bold text-foreground mb-1">{rec.title}</p>
                    <p className="text-sm text-foreground/70">{rec.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
