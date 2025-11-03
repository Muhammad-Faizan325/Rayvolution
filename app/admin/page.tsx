"use client"

import { motion } from "framer-motion"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { Download, TrendingUp, Users, Zap, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

const adoptionData = [
  { month: "Jan", adoption: 1200, target: 1500 },
  { month: "Feb", adoption: 1450, target: 1600 },
  { month: "Mar", adoption: 1680, target: 1700 },
  { month: "Apr", adoption: 1920, target: 1900 },
  { month: "May", adoption: 2200, target: 2100 },
  { month: "Jun", adoption: 2520, target: 2400 },
  { month: "Jul", adoption: 2847, target: 2800 },
]

const co2Data = [
  { month: "Jan", co2: 5200 },
  { month: "Feb", co2: 6100 },
  { month: "Mar", co2: 7200 },
  { month: "Apr", co2: 8500 },
  { month: "May", co2: 10200 },
  { month: "Jun", co2: 12500 },
  { month: "Jul", co2: 15480 },
]

const cityRankings = [
  { name: "Lahore", adoption: 52, users: 420, trend: "up" },
  { name: "Karachi", adoption: 45, users: 380, trend: "up" },
  { name: "Islamabad", adoption: 58, users: 280, trend: "up" },
  { name: "Rawalpindi", adoption: 48, users: 210, trend: "down" },
  { name: "Peshawar", adoption: 38, users: 180, trend: "up" },
]

const engagementData = [
  { name: "Reports", value: 1247, fill: "#93C5FD" },
  { name: "Challenges", value: 3850, fill: "#6EE7B7" },
  { name: "Badges", value: 12400, fill: "#FBBF24" },
  { name: "Referrals", value: 2150, fill: "#F97316" },
]

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

export default function AdminDashboard() {
  const handleExportCSV = () => {
    // Prepare data for CSV export
    const csvData = [
      ["Metric", "Value", "Trend"],
      ["Total Users", "2,847", "+12.5%"],
      ["Active Reports", "1,247", "+34.2%"],
      ["Adoption Rate", "42%", "+8.1%"],
      ["Total Energy Saved", "15,480 kWh", "+28.4%"],
      ...cityRankings.map(city => [city.name, `${city.adoption}%`, city.users]),
    ]
    const csvContent = csvData.map(row => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `rayvolution-analytics-${new Date().toISOString().split("T")[0]}.csv`
    link.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-card/10 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-12 flex justify-between items-start"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-foreground/60">System analytics and network insights</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleExportCSV} className="gap-2 bg-primary hover:bg-primary/90">
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
            <Button variant="outline" onClick={() => window.print()}>Export PDF</Button>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {[
            { icon: Users, label: "Total Users", value: "2,847", trend: "+12.5%" },
            { icon: Zap, label: "Active Reports", value: "1,247", trend: "+34.2%" },
            { icon: TrendingUp, label: "Adoption Rate", value: "42%", trend: "+8.1%" },
            { icon: AlertCircle, label: "Avg. Resolution", value: "2.4h", trend: "-15%" },
          ].map((metric, i) => {
            const Icon = metric.icon
            return (
              <motion.div key={i} variants={itemVariants} className="glass-dark p-6 rounded-xl">
                <div className="flex justify-between items-start mb-4">
                  <Icon className="w-5 h-5 text-primary" />
                  <span className="text-xs font-semibold text-emerald-400">{metric.trend}</span>
                </div>
                <p className="text-foreground/70 text-sm mb-2">{metric.label}</p>
                <p className="text-3xl font-bold text-foreground">{metric.value}</p>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Solar Adoption Chart */}
          <motion.div
            className="glass-dark p-6 rounded-xl neon-border-cyan"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-bold text-foreground mb-4">Solar Adoption Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={adoptionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(147, 197, 253, 0.1)" />
                <XAxis dataKey="month" stroke="rgba(147, 197, 253, 0.5)" fontSize={12} />
                <YAxis stroke="rgba(147, 197, 253, 0.5)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.9)",
                    border: "1px solid rgba(147, 197, 253, 0.3)",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="adoption" stroke="rgba(147, 197, 253, 1)" strokeWidth={2} />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="rgba(110, 231, 183, 0.5)"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* CO2 Saved Chart */}
          <motion.div
            className="glass-dark p-6 rounded-xl neon-border-emerald"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.35 }}
          >
            <h3 className="text-lg font-bold text-foreground mb-4">Carbon Reduction Impact</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={co2Data}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(110, 231, 183, 0.1)" />
                <XAxis dataKey="month" stroke="rgba(110, 231, 183, 0.5)" fontSize={12} />
                <YAxis stroke="rgba(110, 231, 183, 0.5)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.9)",
                    border: "1px solid rgba(110, 231, 183, 0.3)",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="co2" fill="rgba(110, 231, 183, 0.7)" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* City Rankings */}
          <motion.div
            className="glass-dark p-6 rounded-xl neon-border-cyan"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-lg font-bold text-foreground mb-4">Top Cities</h3>
            <div className="space-y-3">
              {cityRankings.map((city, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-black/20">
                  <div>
                    <p className="font-semibold text-foreground">
                      {i + 1}. {city.name}
                    </p>
                    <p className="text-xs text-foreground/60">{city.users} users</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">{city.adoption}%</p>
                    <p className={`text-xs ${city.trend === "up" ? "text-emerald-400" : "text-red-400"}`}>
                      {city.trend === "up" ? "↑" : "↓"} Adoption
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Engagement Metrics */}
          <motion.div
            className="glass-dark p-6 rounded-xl neon-border-emerald lg:col-span-2"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.45 }}
          >
            <h3 className="text-lg font-bold text-foreground mb-4">Community Engagement</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {engagementData.map((item) => (
                <div key={item.name} className="text-center">
                  <p className="text-2xl font-bold" style={{ color: item.fill }}>
                    {item.value.toLocaleString()}
                  </p>
                  <p className="text-xs text-foreground/60 mt-1">{item.name}</p>
                </div>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={engagementData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {engagementData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.9)",
                    border: "1px solid rgba(147, 197, 253, 0.3)",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* AI Insights */}
        <motion.div
          className="mt-8 glass-dark p-8 rounded-xl neon-border-cyan"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-lg font-bold text-foreground mb-4">AI Insights: Top 5 Cities Needing Solar Expansion</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { rank: 1, city: "Peshawar", potential: "92%", priority: "Critical" },
              { rank: 2, city: "Quetta", potential: "88%", priority: "High" },
              { rank: 3, city: "Multan", potential: "84%", priority: "High" },
              { rank: 4, city: "Hyderabad", potential: "78%", priority: "Medium" },
              { rank: 5, city: "Rawalpindi", potential: "72%", priority: "Medium" },
            ].map((item) => (
              <div key={item.city} className="p-4 rounded-lg bg-black/30 border border-border">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-2xl font-bold text-primary">{item.rank}</span>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      item.priority === "Critical"
                        ? "bg-red-500/20 text-red-400"
                        : item.priority === "High"
                          ? "bg-orange-500/20 text-orange-400"
                          : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {item.priority}
                  </span>
                </div>
                <p className="font-semibold text-foreground">{item.city}</p>
                <p className="text-sm text-foreground/60">Expansion potential:</p>
                <p className="text-lg font-bold text-primary mt-1">{item.potential}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
