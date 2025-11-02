"use client"

import { motion } from "framer-motion"
import { Award } from "lucide-react"

const badges = [
  { name: "Solar Hero", icon: "☀️", color: "from-yellow-400 to-orange-400", earned: true },
  { name: "Eco Guardian", icon: "🌱", color: "from-emerald-400 to-teal-400", earned: true },
  { name: "Energy Savior", icon: "⚡", color: "from-cyan-400 to-blue-400", earned: true },
  { name: "Community Star", icon: "⭐", color: "from-purple-400 to-pink-400", earned: false },
  { name: "Carbon Crusher", icon: "♻️", color: "from-green-400 to-emerald-400", earned: false },
  { name: "Peak Performer", icon: "🏆", color: "from-yellow-500 to-yellow-400", earned: false },
]

export function EcoBadgesShowcase() {
  return (
    <motion.div
      className="glass-dark p-6 rounded-xl neon-border-emerald"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center gap-2 mb-6">
        <Award className="w-5 h-5 text-primary" />
        <h3 className="font-bold text-foreground">EcoBadges</h3>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {badges.map((badge, i) => (
          <motion.div key={i} className="relative group" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <div
              className={`w-full aspect-square rounded-lg bg-gradient-to-br ${badge.color} p-3 flex items-center justify-center text-2xl cursor-pointer relative overflow-hidden ${
                badge.earned ? "shadow-lg" : "opacity-40 grayscale"
              }`}
              style={{
                boxShadow: badge.earned ? `0 0 20px rgba(147, 197, 253, 0.5)` : "none",
              }}
            >
              <motion.div
                animate={badge.earned ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                {badge.icon}
              </motion.div>
            </div>

            {/* Tooltip */}
            <motion.div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs py-2 px-3 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              {badge.name}
            </motion.div>
          </motion.div>
        ))}
      </div>

      <p className="text-xs text-foreground/60 mt-4">3 earned • 3 to unlock</p>
    </motion.div>
  )
}
