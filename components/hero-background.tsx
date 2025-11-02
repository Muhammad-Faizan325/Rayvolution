"use client"

import { useEffect, useState } from "react"

export function HeroBackground() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Gradient orbs with CSS animation */}
      <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-gradient-to-br from-primary/30 to-accent/20 blur-3xl opacity-40 animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-gradient-to-tl from-accent/30 to-primary/20 blur-3xl opacity-40 animate-pulse animation-delay-2000" />

      {/* Grid pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none" />
    </div>
  )
}
