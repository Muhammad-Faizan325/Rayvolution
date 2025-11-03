"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { User, Mail, Phone, MapPin, Zap, Leaf, TrendingUp, Award, Calendar, Settings, LogOut, Edit } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface UserProfile {
  name: string
  email: string
  phone: string
  city: string
  solarPanels: boolean
  energyGoal: string
  joinDate: string
  stats: {
    energySaved: number
    co2Reduced: number
    greenCoins: number
    sustainabilityScore: number
    streak: number
    energyTokens: number
  }
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    // Load user data from localStorage
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser({
        ...parsedUser,
        joinDate: parsedUser.joinDate || "2024-01-15",
        stats: parsedUser.stats || {
          energySaved: 2847,
          co2Reduced: 1423,
          greenCoins: 3845,
          sustainabilityScore: 76,
          streak: 12,
          energyTokens: 45,
        },
      })
    } else {
      // Redirect to login if not logged in
      router.push("/login")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    // Clear authentication cookie
    document.cookie = "isAuthenticated=; path=/; max-age=0"
    // Trigger auth change event for navbar
    window.dispatchEvent(new Event("authChange"))
    router.push("/login")
  }

  if (!user) {
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
          className="mb-8 flex justify-between items-start"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">My Profile</h1>
            <p className="text-foreground/60">Manage your account and track your energy journey</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="gap-2 border-red-500/20 text-red-400 hover:bg-red-500/10"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="glass-dark p-6 neon-border-cyan">
                <div className="flex flex-col items-center">
                  {/* Avatar */}
                  <motion.div
                    className="relative mb-4"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 to-emerald-400 flex items-center justify-center text-3xl font-bold text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <motion.div
                      className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center border-2 border-background"
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                      <Zap className="w-4 h-4 text-white" />
                    </motion.div>
                  </motion.div>

                  <h2 className="text-2xl font-bold text-foreground mb-1">{user.name}</h2>
                  <p className="text-sm text-foreground/60 mb-4">Energy Champion</p>

                  {/* Quick Stats */}
                  <div className="w-full space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="w-4 h-4 text-foreground/40" />
                      <span className="text-foreground/60">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="w-4 h-4 text-foreground/40" />
                      <span className="text-foreground/60">{user.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="w-4 h-4 text-foreground/40" />
                      <span className="text-foreground/60">{user.city}, Pakistan</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="w-4 h-4 text-foreground/40" />
                      <span className="text-foreground/60">Joined {new Date(user.joinDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Solar Status */}
                  {user.solarPanels && (
                    <div className="w-full p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2 mb-4">
                      <Leaf className="w-4 h-4 text-emerald-400" />
                      <span className="text-sm text-emerald-400 font-medium">Solar Panel Owner</span>
                    </div>
                  )}

                  <Button
                    onClick={() => setIsEditing(!isEditing)}
                    className="w-full gap-2 bg-gradient-to-r from-primary to-accent"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Profile
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Energy Goal Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="glass-dark p-6 border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground">Energy Goal</h3>
                </div>
                <p className="text-sm text-foreground/60 capitalize">
                  {user.energyGoal.replace("-", " ")}
                </p>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Stats & Achievements */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-bold mb-4">Your Impact</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Energy Saved */}
                <Card className="glass-dark p-6 neon-border-cyan">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-xl bg-cyan-500/20">
                      <Zap className="w-6 h-6 text-cyan-400" />
                    </div>
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                  </div>
                  <p className="text-3xl font-bold text-foreground mb-1">
                    {user.stats.energySaved.toLocaleString()}
                  </p>
                  <p className="text-sm text-foreground/60">kWh Saved</p>
                </Card>

                {/* CO2 Reduced */}
                <Card className="glass-dark p-6 neon-border-emerald">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-xl bg-emerald-500/20">
                      <Leaf className="w-6 h-6 text-emerald-400" />
                    </div>
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                  </div>
                  <p className="text-3xl font-bold text-foreground mb-1">
                    {user.stats.co2Reduced.toLocaleString()}
                  </p>
                  <p className="text-sm text-foreground/60">kg CO₂ Reduced</p>
                </Card>

                {/* GreenCoins */}
                <Card className="glass-dark p-6 neon-border-yellow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-xl bg-yellow-500/20">
                      <Award className="w-6 h-6 text-yellow-400" />
                    </div>
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                  </div>
                  <p className="text-3xl font-bold text-foreground mb-1">
                    {user.stats.greenCoins.toLocaleString()}
                  </p>
                  <p className="text-sm text-foreground/60">GreenCoins</p>
                </Card>
              </div>
            </motion.div>

            {/* Sustainability Score */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="glass-dark p-6 border border-border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">Sustainability Score</h3>
                  <span className="text-3xl font-bold text-primary">{user.stats.sustainabilityScore}/100</span>
                </div>
                <div className="w-full bg-black/30 rounded-full h-3 mb-4">
                  <motion.div
                    className="h-3 rounded-full bg-gradient-to-r from-primary to-accent"
                    initial={{ width: 0 }}
                    animate={{ width: `${user.stats.sustainabilityScore}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </div>
                <p className="text-sm text-foreground/60">
                  You're in the top 10% of users! Keep up the great work.
                </p>
              </Card>
            </motion.div>

            {/* Current Streak & Tokens */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Streak */}
                <Card className="glass-dark p-6 border border-border">
                  <div className="flex items-center gap-3 mb-2">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <span className="text-3xl">🔥</span>
                    </motion.div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{user.stats.streak} Days</p>
                      <p className="text-sm text-foreground/60">Current Streak</p>
                    </div>
                  </div>
                  <p className="text-xs text-foreground/40 mt-2">
                    3 more days until next milestone bonus!
                  </p>
                </Card>

                {/* Energy Tokens */}
                <Card className="glass-dark p-6 border border-border">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-cyan-500/20">
                      <Zap className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{user.stats.energyTokens} kWh</p>
                      <p className="text-sm text-foreground/60">Energy Tokens</p>
                    </div>
                  </div>
                  <p className="text-xs text-foreground/40 mt-2">
                    Worth Rs {(user.stats.energyTokens * 30).toLocaleString()}
                  </p>
                </Card>
              </div>
            </motion.div>

            {/* Recent Achievements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="text-2xl font-bold mb-4">Recent Achievements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="glass-dark p-4 border border-emerald-500/20 flex items-center gap-4">
                  <div className="text-4xl">🏆</div>
                  <div>
                    <p className="font-bold text-foreground">Energy Saver</p>
                    <p className="text-xs text-foreground/60">Saved 1000+ kWh</p>
                  </div>
                </Card>
                <Card className="glass-dark p-4 border border-cyan-500/20 flex items-center gap-4">
                  <div className="text-4xl">⚡</div>
                  <div>
                    <p className="font-bold text-foreground">Week Warrior</p>
                    <p className="text-xs text-foreground/60">7-day streak completed</p>
                  </div>
                </Card>
                <Card className="glass-dark p-4 border border-yellow-500/20 flex items-center gap-4">
                  <div className="text-4xl">🌱</div>
                  <div>
                    <p className="font-bold text-foreground">Eco Champion</p>
                    <p className="text-xs text-foreground/60">Reduced 1000+ kg CO₂</p>
                  </div>
                </Card>
                <Card className="glass-dark p-4 border border-purple-500/20 flex items-center gap-4">
                  <div className="text-4xl">👥</div>
                  <div>
                    <p className="font-bold text-foreground">Community Leader</p>
                    <p className="text-xs text-foreground/60">Top 10% in your city</p>
                  </div>
                </Card>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="text-2xl font-bold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  variant="outline"
                  className="h-24 flex-col gap-2 border-border hover:bg-muted"
                  onClick={() => router.push("/dashboard")}
                >
                  <Zap className="w-6 h-6" />
                  <span className="text-xs">Dashboard</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex-col gap-2 border-border hover:bg-muted"
                  onClick={() => router.push("/challenges")}
                >
                  <Award className="w-6 h-6" />
                  <span className="text-xs">Challenges</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex-col gap-2 border-border hover:bg-muted"
                  onClick={() => router.push("/marketplace")}
                >
                  <TrendingUp className="w-6 h-6" />
                  <span className="text-xs">Marketplace</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex-col gap-2 border-border hover:bg-muted"
                  onClick={() => alert("Settings coming soon!")}
                >
                  <Settings className="w-6 h-6" />
                  <span className="text-xs">Settings</span>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
