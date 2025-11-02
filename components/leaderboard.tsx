"use client"

import { motion } from "framer-motion"
import { Trophy, Award, Users } from "lucide-react"
import { useState } from "react"

const cityLeaders = [
  { rank: 1, city: "Lahore", users: 420, coins: 28500, trend: "↑" },
  { rank: 2, city: "Karachi", users: 380, coins: 24800, trend: "↑" },
  { rank: 3, city: "Islamabad", users: 280, coins: 19200, trend: "=" },
  { rank: 4, city: "Rawalpindi", users: 210, coins: 14500, trend: "↓" },
  { rank: 5, city: "Multan", users: 160, coins: 11200, trend: "↑" },
]

const userLeaders = [
  { rank: 1, name: "Ahmed K.", city: "Lahore", coins: 3200, badge: "⭐" },
  { rank: 2, name: "Fatima S.", city: "Islamabad", coins: 2950, badge: "☀️" },
  { rank: 3, name: "Hassan M.", city: "Karachi", coins: 2750, badge: "☀️" },
  { rank: 4, name: "Ayesha R.", city: "Lahore", coins: 2450, badge: "🌱" },
  { rank: 5, name: "Usman H.", city: "Peshawar", coins: 2150, badge: "⚡" },
]

export function Leaderboard() {
  const [activeTab, setActiveTab] = useState<"cities" | "users">("cities")

  return (
    <motion.div
      className="glass-dark p-8 rounded-xl neon-border-cyan"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="w-5 h-5 text-primary" />
        <h3 className="text-xl font-bold text-foreground">Leaderboards</h3>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-border">
        <button
          onClick={() => setActiveTab("cities")}
          className={`pb-3 px-2 font-medium transition-colors ${
            activeTab === "cities"
              ? "text-primary border-b-2 border-primary"
              : "text-foreground/60 hover:text-foreground"
          }`}
        >
          <Users className="w-4 h-4 inline mr-2" />
          Top Cities
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`pb-3 px-2 font-medium transition-colors ${
            activeTab === "users"
              ? "text-primary border-b-2 border-primary"
              : "text-foreground/60 hover:text-foreground"
          }`}
        >
          <Award className="w-4 h-4 inline mr-2" />
          Top Users
        </button>
      </div>

      {/* Leaderboard Content */}
      <div className="space-y-3">
        {activeTab === "cities"
          ? cityLeaders.map((item, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-4 p-4 rounded-lg bg-black/20 hover:bg-black/40 transition-colors group cursor-pointer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ x: 4 }}
              >
                <div className="text-2xl font-bold w-8 text-center">
                  {item.rank === 1 ? "🥇" : item.rank === 2 ? "🥈" : item.rank === 3 ? "🥉" : item.rank}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{item.city}</p>
                  <p className="text-xs text-foreground/60">{item.users} active users</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">{item.coins.toLocaleString()}</p>
                  <p
                    className={`text-xs ${item.trend === "↑" ? "text-emerald-400" : item.trend === "↓" ? "text-red-400" : "text-foreground/60"}`}
                  >
                    {item.trend}
                  </p>
                </div>
              </motion.div>
            ))
          : userLeaders.map((item, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-4 p-4 rounded-lg bg-black/20 hover:bg-black/40 transition-colors cursor-pointer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ x: 4 }}
              >
                <div className="text-2xl font-bold w-8 text-center">
                  {item.rank === 1 ? "🥇" : item.rank === 2 ? "🥈" : item.rank === 3 ? "🥉" : item.rank}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{item.name}</p>
                  <p className="text-xs text-foreground/60">{item.city}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl">{item.badge}</span>
                  <p className="font-bold text-primary w-16 text-right">{item.coins}</p>
                </div>
              </motion.div>
            ))}
      </div>
    </motion.div>
  )
}
