"use client"

import { useEffect, useState } from "react"

interface WeatherTheme {
  background: string
  primary: string
  accent: string
  glow: string
}

const weatherThemes: Record<string, WeatherTheme> = {
  sunny: {
    background: "from-amber-50 via-orange-50 to-yellow-50",
    primary: "from-yellow-400 to-orange-500",
    accent: "from-orange-500 to-red-500",
    glow: "shadow-yellow-400/50",
  },
  cloudy: {
    background: "from-slate-100 via-gray-100 to-blue-50",
    primary: "from-gray-400 to-blue-500",
    accent: "from-blue-500 to-indigo-500",
    glow: "shadow-blue-400/50",
  },
  rainy: {
    background: "from-slate-200 via-gray-200 to-blue-100",
    primary: "from-blue-500 to-indigo-600",
    accent: "from-indigo-600 to-purple-600",
    glow: "shadow-blue-500/50",
  },
  night: {
    background: "from-slate-900 via-gray-900 to-indigo-950",
    primary: "from-indigo-400 to-purple-500",
    accent: "from-purple-500 to-pink-500",
    glow: "shadow-indigo-500/50",
  },
  default: {
    background: "from-background via-background to-card/10",
    primary: "from-cyan-500 to-blue-600",
    accent: "from-emerald-500 to-green-600",
    glow: "shadow-cyan-400/50",
  },
}

export function DynamicThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentWeather, setCurrentWeather] = useState<string>("default")
  const [sunlightIntensity, setSunlightIntensity] = useState<number>(100)

  useEffect(() => {
    // Simulate weather and sunlight data
    const updateWeatherTheme = () => {
      const hour = new Date().getHours()

      // Determine weather based on time of day
      if (hour >= 6 && hour < 12) {
        setCurrentWeather("sunny")
        setSunlightIntensity(100)
      } else if (hour >= 12 && hour < 18) {
        setCurrentWeather("sunny")
        setSunlightIntensity(95)
      } else if (hour >= 18 && hour < 20) {
        setCurrentWeather("cloudy")
        setSunlightIntensity(40)
      } else {
        setCurrentWeather("night")
        setSunlightIntensity(0)
      }
    }

    updateWeatherTheme()
    const interval = setInterval(updateWeatherTheme, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  const theme = weatherThemes[currentWeather] || weatherThemes.default

  return (
    <div
      className="dynamic-theme-wrapper"
      style={{
        // @ts-ignore
        "--theme-background": theme.background,
        "--theme-primary": theme.primary,
        "--theme-accent": theme.accent,
        "--theme-glow": theme.glow,
        "--sunlight-intensity": `${sunlightIntensity}%`,
      }}
    >
      {children}
    </div>
  )
}

// Hook to use dynamic theme values
export function useDynamicTheme() {
  const [currentWeather, setCurrentWeather] = useState<string>("default")
  const [sunlightIntensity, setSunlightIntensity] = useState<number>(100)

  useEffect(() => {
    const updateWeatherTheme = () => {
      const hour = new Date().getHours()

      if (hour >= 6 && hour < 12) {
        setCurrentWeather("sunny")
        setSunlightIntensity(100)
      } else if (hour >= 12 && hour < 18) {
        setCurrentWeather("sunny")
        setSunlightIntensity(95)
      } else if (hour >= 18 && hour < 20) {
        setCurrentWeather("cloudy")
        setSunlightIntensity(40)
      } else {
        setCurrentWeather("night")
        setSunlightIntensity(0)
      }
    }

    updateWeatherTheme()
    const interval = setInterval(updateWeatherTheme, 60000)

    return () => clearInterval(interval)
  }, [])

  return { currentWeather, sunlightIntensity, theme: weatherThemes[currentWeather] || weatherThemes.default }
}
