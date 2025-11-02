"use client"

import { motion } from "framer-motion"

interface City {
  id: string
  name: string
  adoptionRate: number
  latitude: number
  longitude: number
}

interface PakistanMapProps {
  cities: City[]
  onCityClick: (city: City) => void
}

export function PakistanMap({ cities, onCityClick }: PakistanMapProps) {
  // SVG coordinates (normalized to 0-1000 range for Pakistan)
  const getCityColor = (adoptionRate: number) => {
    if (adoptionRate < 20) return "#DC2626"
    if (adoptionRate < 40) return "#F97316"
    if (adoptionRate < 60) return "#EAB308"
    if (adoptionRate < 80) return "#3B82F6"
    return "#10B981"
  }

  const citySvgPositions: Record<string, { x: number; y: number }> = {
    karachi: { x: 180, y: 750 },
    lahore: { x: 350, y: 280 },
    islamabad: { x: 360, y: 200 },
    peshawar: { x: 320, y: 150 },
    quetta: { x: 150, y: 450 },
    multan: { x: 380, y: 400 },
    rawalpindi: { x: 370, y: 220 },
    hyderabad: { x: 250, y: 670 },
  }

  return (
    <div className="w-full h-full bg-gradient-to-b from-slate-900 to-slate-800 relative overflow-auto flex items-center justify-center p-4">
      <svg viewBox="0 0 800 1000" className="w-full h-full max-w-2xl" style={{ maxHeight: "100%" }}>
        {/* Pakistan outline (simplified) */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Base country fill */}
        <path
          d="M 200 150 L 450 100 L 500 200 L 480 450 L 500 600 L 450 800 L 250 850 L 150 700 L 100 500 L 150 300 Z"
          fill="rgba(30, 41, 59, 0.6)"
          stroke="rgba(147, 197, 253, 0.3)"
          strokeWidth="2"
        />

        {/* Cities */}
        {cities.map((city) => {
          const pos = citySvgPositions[city.id]
          if (!pos) return null

          const color = getCityColor(city.adoptionRate)

          return (
            <motion.g
              key={city.id}
              onClick={() => onCityClick(city)}
              className="cursor-pointer"
              whileHover={{ scale: 1.3 }}
            >
              {/* Pulse animation ring */}
              <motion.circle
                cx={pos.x}
                cy={pos.y}
                r="35"
                fill="none"
                stroke={color}
                strokeWidth="2"
                opacity="0.3"
                animate={{ r: [25, 45], opacity: [0.5, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              />

              {/* Main city dot */}
              <motion.circle
                cx={pos.x}
                cy={pos.y}
                r="15"
                fill={color}
                stroke="white"
                strokeWidth="2"
                style={{ filter: `drop-shadow(0 0 8px ${color})` }}
                whileHover={{ r: 20 }}
                transition={{ duration: 0.3 }}
              />

              {/* City label */}
              <text
                x={pos.x}
                y={pos.y + 35}
                textAnchor="middle"
                fill="rgba(255, 255, 255, 0.8)"
                fontSize="12"
                fontWeight="bold"
                className="pointer-events-none"
              >
                {city.name}
              </text>

              <text
                x={pos.x}
                y={pos.y + 50}
                textAnchor="middle"
                fill="rgba(255, 255, 255, 0.6)"
                fontSize="10"
                className="pointer-events-none"
              >
                {city.adoptionRate}%
              </text>
            </motion.g>
          )
        })}
      </svg>

      {/* Floating info card */}
      <div className="absolute top-4 right-4 glass-dark p-4 rounded-lg text-sm text-foreground/70 max-w-xs">
        <p className="font-semibold text-foreground mb-2">Interactive Map Guide</p>
        <p>
          Click on any city marker to view detailed solar adoption statistics, weather conditions, and AI predictions.
        </p>
      </div>
    </div>
  )
}
