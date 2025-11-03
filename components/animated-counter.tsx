"use client"

import { useEffect, useState } from "react"

interface AnimatedCounterProps {
  target: number
  duration?: number
}

export function AnimatedCounter({ target, duration = 2000 }: AnimatedCounterProps) {
  const [count, setCount] = useState(target)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setCount(0)
  }, [])

  useEffect(() => {
    if (!mounted) return

    let startTime: number
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * target))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [target, duration, mounted])

  return <span>{count.toLocaleString()}</span>
}
