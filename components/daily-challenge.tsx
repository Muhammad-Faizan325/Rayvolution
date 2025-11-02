"use client"

import { motion } from "framer-motion"
import { Clock, CheckCircle2, AlertCircle } from "lucide-react"
import { useState } from "react"

const challenges = [
  {
    id: 1,
    title: "Solar Spotter",
    description: "Report a new solar installation in your area",
    reward: 50,
    progress: 1,
    target: 1,
    status: "completed",
  },
  {
    id: 2,
    title: "Energy Logger",
    description: "Log your daily energy consumption",
    reward: 25,
    progress: 3,
    target: 3,
    status: "in-progress",
  },
  {
    id: 3,
    title: "Community Connector",
    description: "Refer a friend to Rayvolution",
    reward: 100,
    progress: 0,
    target: 1,
    status: "pending",
  },
]

export function DailyChallenge() {
  const [selectedChallenge, setSelectedChallenge] = useState<number | null>(null)

  return (
    <motion.div
      className="glass-dark p-8 rounded-xl neon-border-emerald"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-5 h-5 text-primary" />
        <h3 className="text-xl font-bold text-foreground">Daily Challenges</h3>
        <span className="ml-auto text-xs bg-primary/20 text-primary px-2 py-1 rounded">Resets in 4h</span>
      </div>

      <div className="space-y-4">
        {challenges.map((challenge, i) => (
          <motion.div
            key={challenge.id}
            className={`p-4 rounded-lg cursor-pointer transition-all ${
              selectedChallenge === challenge.id
                ? "bg-primary/10 border-2 border-primary"
                : "bg-black/20 border border-border hover:border-primary/50"
            }`}
            onClick={() => setSelectedChallenge(challenge.id)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ x: 4 }}
          >
            <div className="flex items-start gap-4">
              {/* Status Icon */}
              <div className="mt-1 flex-shrink-0">
                {challenge.status === "completed" ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                ) : challenge.status === "in-progress" ? (
                  <motion.div
                    className="w-6 h-6 rounded-full border-2 border-primary"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <div className="w-full h-full rounded-full bg-gradient-to-r from-primary/50 to-transparent" />
                  </motion.div>
                ) : (
                  <AlertCircle className="w-6 h-6 text-foreground/40" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-foreground">{challenge.title}</h4>
                  <span className="text-sm font-bold text-primary">+{challenge.reward} coins</span>
                </div>
                <p className="text-sm text-foreground/60 mb-3">{challenge.description}</p>

                {/* Progress Bar */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-black/30 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary to-accent"
                      initial={{ width: 0 }}
                      animate={{ width: `${(challenge.progress / challenge.target) * 100}%` }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>
                  <span className="text-xs text-foreground/60">
                    {challenge.progress}/{challenge.target}
                  </span>
                </div>
              </div>

              {/* Action */}
              {challenge.status === "completed" && (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-1 flex-shrink-0" />
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.button
        className="w-full mt-6 py-3 rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold hover:opacity-90 transition-opacity"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        View All Challenges
      </motion.button>
    </motion.div>
  )
}
