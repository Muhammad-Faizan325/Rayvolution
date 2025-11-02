"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Zap } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface City {
  id: string
  name: string
  province: string
  adoptionRate: number
  sunlightHours: number
  powerShortage: number
  users: number
  prediction: string
}

interface CityInsightDrawerProps {
  city: City | null
  isOpen: boolean
  onClose: () => void
}

export function CityInsightDrawer({ city, isOpen, onClose }: CityInsightDrawerProps) {
  if (!city) return null

  const shortageData = [
    { month: "Jan", shortage: city.powerShortage + 5 },
    { month: "Feb", shortage: city.powerShortage + 4 },
    { month: "Mar", shortage: city.powerShortage + 2 },
    { month: "Apr", shortage: city.powerShortage - 1 },
    { month: "May", shortage: city.powerShortage - 3 },
    { month: "Jun", shortage: city.powerShortage - 5 },
    { month: "Jul", shortage: city.powerShortage },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            className="fixed right-0 top-0 h-screen w-full max-w-md bg-card border-l border-border shadow-xl z-50 overflow-y-auto"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 20 }}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-1">{city.name}</h2>
                  <p className="text-foreground/60">{city.province}</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="glass-dark p-4 rounded-lg">
                  <p className="text-sm text-foreground/60 mb-1">Adoption Rate</p>
                  <p className="text-2xl font-bold text-primary">{city.adoptionRate}%</p>
                </div>
                <div className="glass-dark p-4 rounded-lg">
                  <p className="text-sm text-foreground/60 mb-1">Active Users</p>
                  <p className="text-2xl font-bold text-accent">{city.users}</p>
                </div>
                <div className="glass-dark p-4 rounded-lg">
                  <p className="text-sm text-foreground/60 mb-1">Sunlight Hours</p>
                  <p className="text-2xl font-bold text-cyan-400">{city.sunlightHours}h</p>
                </div>
                <div className="glass-dark p-4 rounded-lg">
                  <p className="text-sm text-foreground/60 mb-1">Power Shortage</p>
                  <p className="text-2xl font-bold text-red-400">{city.powerShortage}%</p>
                </div>
              </div>

              {/* Power Shortage Trend */}
              <div className="glass-dark p-4 rounded-lg mb-8">
                <h3 className="font-semibold text-foreground mb-4">Power Shortage Trend</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={shortageData}>
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
                    <Line
                      type="monotone"
                      dataKey="shortage"
                      stroke="rgba(239, 68, 68, 1)"
                      dot={false}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* AI Insight */}
              <div className="glass-dark p-4 rounded-lg neon-border-cyan">
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">AI Prediction</h4>
                    <p className="text-sm text-foreground/80">{city.prediction}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 space-y-3">
                <button className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium">
                  View Detailed Report
                </button>
                <button className="w-full border border-border text-foreground py-3 rounded-lg hover:bg-muted transition-colors font-medium">
                  Share Insights
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
