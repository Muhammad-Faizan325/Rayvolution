"use client"

import { motion } from "framer-motion"
import { Sun, Cloud, Moon } from "lucide-react"
import { useState, useEffect } from "react"

export function WeatherIndicator() {
  const [weather, setWeather] = useState<"sunny" | "cloudy" | "night">("sunny")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Simulate weather based on time of day
    const hour = new Date().getHours()
    if (hour >= 6 && hour < 12) setWeather("sunny")
    else if (hour >= 12 && hour < 18) setWeather("sunny")
    else if (hour >= 18 && hour < 20) setWeather("cloudy")
    else setWeather("night")
  }, [])

  const weatherConfig = {
    sunny: { icon: Sun, label: "Sunny", color: "from-yellow-400 to-orange-400" },
    cloudy: { icon: Cloud, label: "Cloudy", color: "from-gray-400 to-blue-400" },
    night: { icon: Moon, label: "Night", color: "from-indigo-600 to-purple-700" },
  }

  const config = weatherConfig[weather]
  const Icon = config.icon

  if (!mounted) {
    return (
      <div className={`glass-dark px-6 py-4 rounded-xl flex items-center gap-3 bg-gradient-to-r ${config.color} bg-opacity-10`}>
        <Icon
          className={`w-5 h-5 ${weather === "sunny" ? "text-yellow-400" : weather === "cloudy" ? "text-gray-400" : "text-indigo-400"}`}
        />
        <div>
          <p className="text-sm font-medium text-foreground">{config.label} Today</p>
          <p className="text-xs text-foreground/60">Optimal for solar</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className={`glass-dark px-6 py-4 rounded-xl flex items-center gap-3 bg-gradient-to-r ${config.color} bg-opacity-10`}
      whileHover={{ scale: 1.05 }}
    >
      <motion.div
        animate={{ rotate: weather === "sunny" ? 360 : 0 }}
        transition={{
          duration: weather === "sunny" ? 20 : 0,
          repeat: weather === "sunny" ? Number.POSITIVE_INFINITY : 0,
        }}
      >
        <Icon
          className={`w-5 h-5 ${weather === "sunny" ? "text-yellow-400" : weather === "cloudy" ? "text-gray-400" : "text-indigo-400"}`}
        />
      </motion.div>
      <div>
        <p className="text-sm font-medium text-foreground">{config.label} Today</p>
        <p className="text-xs text-foreground/60">Optimal for solar</p>
      </div>
    </motion.div>
  )
}
