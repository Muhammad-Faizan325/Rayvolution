"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { PakistanMap } from "@/components/pakistan-map"
import { CityInsightDrawer } from "@/components/city-insight-drawer"
import { DashboardCard } from "@/components/dashboard-card"
import { MapPin, Users, Zap, TrendingUp } from "lucide-react"

interface City {
  id: string
  name: string
  province: string
  latitude: number
  longitude: number
  adoptionRate: number
  sunlightHours: number
  powerShortage: number
  users: number
  prediction: string
}

const cities: City[] = [
  {
    id: "karachi",
    name: "Karachi",
    province: "Sindh",
    latitude: 24.8607,
    longitude: 67.0011,
    adoptionRate: 45,
    sunlightHours: 8.2,
    powerShortage: 28,
    users: 380,
    prediction: "92% efficiency predicted for next 3 days",
  },
  {
    id: "lahore",
    name: "Lahore",
    province: "Punjab",
    latitude: 31.5204,
    longitude: 74.3587,
    adoptionRate: 52,
    sunlightHours: 7.8,
    powerShortage: 32,
    users: 420,
    prediction: "88% efficiency predicted for next 3 days",
  },
  {
    id: "islamabad",
    name: "Islamabad",
    province: "Islamabad",
    latitude: 33.6844,
    longitude: 73.0479,
    adoptionRate: 58,
    sunlightHours: 7.5,
    powerShortage: 25,
    users: 280,
    prediction: "85% efficiency predicted for next 3 days",
  },
  {
    id: "peshawar",
    name: "Peshawar",
    province: "KPK",
    latitude: 34.0151,
    longitude: 71.5249,
    adoptionRate: 38,
    sunlightHours: 7.2,
    powerShortage: 38,
    users: 180,
    prediction: "81% efficiency predicted for next 3 days",
  },
  {
    id: "quetta",
    name: "Quetta",
    province: "Balochistan",
    latitude: 30.1798,
    longitude: 66.975,
    adoptionRate: 28,
    sunlightHours: 8.8,
    powerShortage: 42,
    users: 95,
    prediction: "95% efficiency predicted for next 3 days",
  },
  {
    id: "multan",
    name: "Multan",
    province: "Punjab",
    latitude: 30.1575,
    longitude: 71.4454,
    adoptionRate: 35,
    sunlightHours: 8.1,
    powerShortage: 35,
    users: 160,
    prediction: "90% efficiency predicted for next 3 days",
  },
  {
    id: "rawalpindi",
    name: "Rawalpindi",
    province: "Punjab",
    latitude: 33.5794,
    longitude: 73.4683,
    adoptionRate: 48,
    sunlightHours: 7.6,
    powerShortage: 30,
    users: 210,
    prediction: "86% efficiency predicted for next 3 days",
  },
  {
    id: "hyderabad",
    name: "Hyderabad",
    province: "Sindh",
    latitude: 25.396,
    longitude: 68.4626,
    adoptionRate: 42,
    sunlightHours: 8.3,
    powerShortage: 30,
    users: 200,
    prediction: "93% efficiency predicted for next 3 days",
  },
]

export default function MapPage() {
  const [selectedCity, setSelectedCity] = useState<City | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const handleCityClick = (city: City) => {
    setSelectedCity(city)
    setIsDrawerOpen(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-card/10">
      {/* Header */}
      <motion.div
        className="py-8 px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Community Impact Map</h1>
          <p className="text-foreground/60 text-lg mb-8">
            Interactive map showing city-wise solar adoption and power shortage across Pakistan
          </p>

          {/* National Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <DashboardCard
              icon={MapPin}
              label="Cities Covered"
              value={cities.length.toString()}
              trend="+2 this month"
              trendPositive
              accentColor="cyan"
            />
            <DashboardCard
              icon={Users}
              label="Total Solar Users"
              value={(cities.reduce((acc, city) => acc + city.users, 0)).toString()}
              trend="+145 this week"
              trendPositive
              accentColor="emerald"
            />
            <DashboardCard
              icon={TrendingUp}
              label="Avg Adoption Rate"
              value={Math.round(cities.reduce((acc, city) => acc + city.adoptionRate, 0) / cities.length).toString()}
              suffix="%"
              trend="+5.2%"
              trendPositive
              accentColor="cyan"
            />
            <DashboardCard
              icon={Zap}
              label="Avg Power Shortage"
              value={Math.round(cities.reduce((acc, city) => acc + city.powerShortage, 0) / cities.length).toString()}
              suffix="%"
              trend="-3.1%"
              trendPositive
              accentColor="emerald"
            />
          </div>
        </div>
      </motion.div>

      {/* Map Container */}
      <div className="px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="glass-dark rounded-2xl overflow-hidden h-96 md:h-screen max-h-[800px] neon-border-cyan"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <PakistanMap cities={cities} onCityClick={handleCityClick} />
          </motion.div>
        </div>
      </div>

      {/* Legend */}
      <motion.div
        className="px-4 sm:px-6 lg:px-8 pb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="glass-dark p-6 rounded-xl">
            <h3 className="font-bold text-foreground mb-4">Adoption Level Legend</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                { range: "0-20%", color: "bg-red-600", label: "Critical" },
                { range: "21-40%", color: "bg-orange-500", label: "Low" },
                { range: "41-60%", color: "bg-yellow-500", label: "Medium" },
                { range: "61-80%", color: "bg-blue-500", label: "High" },
                { range: "81-100%", color: "bg-emerald-500", label: "Excellent" },
              ].map((item) => (
                <div key={item.range} className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded ${item.color}`} />
                  <div className="text-sm">
                    <p className="font-medium text-foreground">{item.range}</p>
                    <p className="text-foreground/60">{item.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* City Insight Drawer */}
      {selectedCity && (
        <CityInsightDrawer city={selectedCity} isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      )}
    </div>
  )
}
