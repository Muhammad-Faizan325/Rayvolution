"use client"

import { motion } from "framer-motion"
import { Coins, Heart, TrendingUp, Users, Zap, ArrowRightLeft, Gift, Award } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DashboardCard } from "@/components/dashboard-card"
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

interface EnergyListing {
  id: string
  user: string
  tokens: number
  location: string
  price: number
  type: "sell" | "donate"
}

const marketListings: EnergyListing[] = [
  { id: "1", user: "Ahmad K.", tokens: 15, location: "Lahore", price: 450, type: "sell" },
  { id: "2", user: "Sara M.", tokens: 20, location: "Karachi", price: 600, type: "sell" },
  { id: "3", user: "Ali R.", tokens: 10, location: "Islamabad", price: 0, type: "donate" },
  { id: "4", user: "Fatima S.", tokens: 25, location: "Peshawar", price: 750, type: "sell" },
  { id: "5", user: "Hassan A.", tokens: 12, location: "Multan", price: 0, type: "donate" },
]

const recentTransactions = [
  { from: "You", to: "Quetta Community", tokens: 5, type: "donation", time: "2 hours ago" },
  { from: "Ali R.", to: "You", tokens: 10, type: "purchase", time: "5 hours ago" },
  { from: "Community Pool", to: "Balochistan", tokens: 50, type: "distribution", time: "1 day ago" },
]

export default function MarketplacePage() {
  const [userTokens] = useState(45)
  const [selectedListing, setSelectedListing] = useState<string | null>(null)

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
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 neon-glow-emerald">
              <ArrowRightLeft className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">Virtual Energy Marketplace</h1>
              <p className="text-foreground/60 text-lg">
                Trade or donate energy tokens to support communities across Pakistan
              </p>
            </div>
          </div>
        </motion.div>

        {/* User Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <DashboardCard
              icon={Coins}
              label="Your Energy Tokens"
              value={userTokens.toString()}
              suffix="kWh"
              trend="+5 today"
              trendPositive
              accentColor="emerald"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <DashboardCard
              icon={TrendingUp}
              label="Market Value"
              value="1,350"
              prefix="Rs "
              trend="+8.5%"
              trendPositive
              accentColor="cyan"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <DashboardCard
              icon={Heart}
              label="Tokens Donated"
              value="128"
              suffix="kWh"
              trend="+12 this month"
              trendPositive
              accentColor="emerald"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <DashboardCard
              icon={Users}
              label="Communities Helped"
              value="7"
              trend="Across Pakistan"
              trendPositive
              accentColor="cyan"
            />
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Marketplace Listings */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="glass-dark p-6 neon-border-cyan mb-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <Zap className="w-6 h-6 text-primary" />
                    Available Listings
                  </h2>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="text-xs">
                      All
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs">
                      Sell
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs">
                      Donate
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {marketListings.map((listing) => (
                    <motion.div
                      key={listing.id}
                      className={`p-4 rounded-xl transition-all cursor-pointer ${
                        selectedListing === listing.id
                          ? "glass-light neon-border-emerald scale-[1.02]"
                          : "glass-dark border border-foreground/10 hover:border-primary/30"
                      }`}
                      onClick={() => setSelectedListing(listing.id)}
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                            {listing.user[0]}
                          </div>
                          <div>
                            <p className="font-bold text-foreground">{listing.user}</p>
                            <p className="text-xs text-foreground/60">{listing.location}</p>
                          </div>
                        </div>
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            listing.type === "donate"
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-cyan-500/20 text-cyan-400"
                          }`}
                        >
                          {listing.type === "donate" ? "Donation" : "For Sale"}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-accent" />
                          <span className="text-lg font-bold text-foreground">{listing.tokens} kWh</span>
                        </div>
                        {listing.type === "sell" ? (
                          <div className="text-right">
                            <p className="text-xs text-foreground/60">Price</p>
                            <p className="text-lg font-bold text-primary">Rs {listing.price}</p>
                          </div>
                        ) : (
                          <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600">
                            <Heart className="w-4 h-4 mr-2" />
                            Accept Donation
                          </Button>
                        )}
                      </div>

                      {selectedListing === listing.id && listing.type === "sell" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-4 pt-4 border-t border-foreground/10 flex gap-2"
                        >
                          <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90">
                            <Coins className="w-4 h-4 mr-2" />
                            Purchase
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            Message Seller
                          </Button>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </Card>

              {/* Donate to Communities */}
              <Card className="glass-dark p-6 neon-border-emerald">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <Gift className="w-6 h-6 text-accent" />
                  Support Energy-Deficient Areas
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { region: "Balochistan", shortage: 42, needed: 150, color: "from-orange-500 to-red-500" },
                    { region: "Southern Punjab", shortage: 35, needed: 120, color: "from-yellow-500 to-orange-500" },
                  ].map((area) => (
                    <div key={area.region} className="p-4 rounded-xl glass-light">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-foreground">{area.region}</h3>
                        <div className="px-2 py-1 rounded bg-red-500/20 text-xs text-red-400">
                          {area.shortage}% shortage
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-foreground/60 mb-1">
                          <span>Progress</span>
                          <span>{area.needed} kWh needed</span>
                        </div>
                        <div className="h-2 bg-foreground/10 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${area.color}`}
                            style={{ width: "35%" }}
                          />
                        </div>
                      </div>

                      <Button size="sm" className="w-full bg-emerald-500 hover:bg-emerald-600">
                        <Heart className="w-4 h-4 mr-2" />
                        Donate Tokens
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Recent Activity Sidebar */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="glass-dark p-6 mb-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-accent" />
                  Recent Transactions
                </h2>

                <div className="space-y-3">
                  {recentTransactions.map((tx, index) => (
                    <div key={index} className="p-3 rounded-lg glass-light">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <ArrowRightLeft className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium text-foreground">
                            {tx.tokens} kWh
                          </span>
                        </div>
                        <div
                          className={`text-xs px-2 py-1 rounded ${
                            tx.type === "donation"
                              ? "bg-emerald-500/20 text-emerald-400"
                              : tx.type === "purchase"
                                ? "bg-cyan-500/20 text-cyan-400"
                                : "bg-purple-500/20 text-purple-400"
                          }`}
                        >
                          {tx.type}
                        </div>
                      </div>
                      <p className="text-xs text-foreground/60">
                        From <span className="text-foreground">{tx.from}</span> to{" "}
                        <span className="text-foreground">{tx.to}</span>
                      </p>
                      <p className="text-xs text-foreground/40 mt-1">{tx.time}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="glass-dark p-6">
                <h2 className="text-xl font-bold mb-4">How It Works</h2>
                <div className="space-y-4 text-sm">
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-primary font-bold">
                      1
                    </div>
                    <p className="text-foreground/70">
                      <strong className="text-foreground">Earn Tokens:</strong> Save energy and earn 1 token per kWh
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-primary font-bold">
                      2
                    </div>
                    <p className="text-foreground/70">
                      <strong className="text-foreground">Trade or Donate:</strong> List tokens for sale or donate to communities
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-primary font-bold">
                      3
                    </div>
                    <p className="text-foreground/70">
                      <strong className="text-foreground">Make Impact:</strong> Help reduce energy inequality across Pakistan
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
