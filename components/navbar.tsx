"use client"

import Link from "next/link"
import { Sun, Moon, Menu, X } from "lucide-react"
import { useState, useEffect } from "react"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isDark, setIsDark] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const isDarkMode = document.documentElement.classList.contains("dark")
    setIsDark(isDarkMode)
  }, [])

  const toggleTheme = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)
    localStorage.setItem("theme", newIsDark ? "dark" : "light")
    if (newIsDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  if (!mounted) return null

  return (
    <nav className="sticky top-0 z-50 glass-dark border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-emerald-400 dark:from-cyan-300 dark:to-emerald-300 flex items-center justify-center neon-glow-cyan">
              <span className="text-xs font-bold text-black dark:text-black">R</span>
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 dark:from-cyan-300 dark:via-emerald-300 dark:to-cyan-300 bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
              Rayvolution
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/#features" className="text-foreground/70 hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="/dashboard" className="text-foreground/70 hover:text-primary transition-colors">
              Dashboard
            </Link>
            <Link href="/calculator" className="text-foreground/70 hover:text-primary transition-colors">
              Calculator
            </Link>
            <Link href="/map" className="text-foreground/70 hover:text-primary transition-colors">
              Map
            </Link>
            <Link href="/community" className="text-foreground/70 hover:text-primary transition-colors">
              Community
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-border hover:bg-muted transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg border border-border"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2 border-t border-border">
            <Link href="/#features" className="block px-4 py-2 text-foreground/70 hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="/dashboard" className="block px-4 py-2 text-foreground/70 hover:text-primary transition-colors">
              Dashboard
            </Link>
            <Link
              href="/calculator"
              className="block px-4 py-2 text-foreground/70 hover:text-primary transition-colors"
            >
              Calculator
            </Link>
            <Link href="/map" className="block px-4 py-2 text-foreground/70 hover:text-primary transition-colors">
              Map
            </Link>
            <Link href="/community" className="block px-4 py-2 text-foreground/70 hover:text-primary transition-colors">
              Community
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
