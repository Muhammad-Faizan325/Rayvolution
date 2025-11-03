"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Sun, Moon, Menu, X, User, LogIn } from "lucide-react"
import { useState, useEffect } from "react"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
    // Check localStorage first, then check the document class
    const savedTheme = localStorage.getItem("theme")
    const isDarkMode = savedTheme === "dark" || document.documentElement.classList.contains("dark")
    setIsDark(isDarkMode)

    // Check if user is logged in
    const userData = localStorage.getItem("user")
    setIsLoggedIn(!!userData)

    // Ensure the document class matches the saved theme
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
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
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/dashboard"
              className={`text-foreground/70 hover:text-primary transition-colors relative pb-1 ${
                pathname === "/dashboard" ? "text-primary" : ""
              }`}
            >
              Dashboard
              {pathname === "/dashboard" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent rounded-full" />
              )}
            </Link>
            <Link
              href="/ai-prediction"
              className={`text-foreground/70 hover:text-primary transition-colors relative pb-1 ${
                pathname === "/ai-prediction" ? "text-primary" : ""
              }`}
            >
              AI Prediction
              {pathname === "/ai-prediction" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent rounded-full" />
              )}
            </Link>
            <Link
              href="/map"
              className={`text-foreground/70 hover:text-primary transition-colors relative pb-1 ${
                pathname === "/map" ? "text-primary" : ""
              }`}
            >
              Map
              {pathname === "/map" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent rounded-full" />
              )}
            </Link>
            <Link
              href="/community"
              className={`text-foreground/70 hover:text-primary transition-colors relative pb-1 ${
                pathname === "/community" ? "text-primary" : ""
              }`}
            >
              Community
              {pathname === "/community" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent rounded-full" />
              )}
            </Link>
            <Link
              href="/marketplace"
              className={`text-foreground/70 hover:text-primary transition-colors relative pb-1 ${
                pathname === "/marketplace" ? "text-primary" : ""
              }`}
            >
              Marketplace
              {pathname === "/marketplace" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent rounded-full" />
              )}
            </Link>
            <Link
              href="/challenges"
              className={`text-foreground/70 hover:text-primary transition-colors relative pb-1 ${
                pathname === "/challenges" ? "text-primary" : ""
              }`}
            >
              Challenges
              {pathname === "/challenges" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent rounded-full" />
              )}
            </Link>
            <Link
              href="/sustainability"
              className={`text-foreground/70 hover:text-primary transition-colors relative pb-1 ${
                pathname === "/sustainability" ? "text-primary" : ""
              }`}
            >
              Score
              {pathname === "/sustainability" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent rounded-full" />
              )}
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Auth Buttons - Desktop */}
            <div className="hidden md:flex items-center gap-3">
              {isLoggedIn ? (
                <Link
                  href="/profile"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors ${
                    pathname === "/profile" ? "bg-primary/10 border-primary" : ""
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm">Profile</span>
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
                  >
                    <LogIn className="w-4 h-4" />
                    <span className="text-sm">Login</span>
                  </Link>
                  <Link
                    href="/signup"
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 transition-opacity"
                  >
                    <span className="text-sm font-medium">Sign Up</span>
                  </Link>
                </>
              )}
            </div>

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
          <div className="md:hidden pb-4 space-y-2 border-t border-border mt-2">
            <Link
              href="/dashboard"
              className={`block px-4 py-2 text-foreground/70 hover:text-primary transition-colors relative ${
                pathname === "/dashboard" ? "text-primary font-medium" : ""
              }`}
            >
              Dashboard
              {pathname === "/dashboard" && (
                <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-accent rounded-r-full" />
              )}
            </Link>
            <Link
              href="/ai-prediction"
              className={`block px-4 py-2 text-foreground/70 hover:text-primary transition-colors relative ${
                pathname === "/ai-prediction" ? "text-primary font-medium" : ""
              }`}
            >
              AI Prediction
              {pathname === "/ai-prediction" && (
                <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-accent rounded-r-full" />
              )}
            </Link>
            <Link
              href="/map"
              className={`block px-4 py-2 text-foreground/70 hover:text-primary transition-colors relative ${
                pathname === "/map" ? "text-primary font-medium" : ""
              }`}
            >
              Community Map
              {pathname === "/map" && (
                <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-accent rounded-r-full" />
              )}
            </Link>
            <Link
              href="/community"
              className={`block px-4 py-2 text-foreground/70 hover:text-primary transition-colors relative ${
                pathname === "/community" ? "text-primary font-medium" : ""
              }`}
            >
              Community
              {pathname === "/community" && (
                <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-accent rounded-r-full" />
              )}
            </Link>
            <Link
              href="/marketplace"
              className={`block px-4 py-2 text-foreground/70 hover:text-primary transition-colors relative ${
                pathname === "/marketplace" ? "text-primary font-medium" : ""
              }`}
            >
              Marketplace
              {pathname === "/marketplace" && (
                <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-accent rounded-r-full" />
              )}
            </Link>
            <Link
              href="/challenges"
              className={`block px-4 py-2 text-foreground/70 hover:text-primary transition-colors relative ${
                pathname === "/challenges" ? "text-primary font-medium" : ""
              }`}
            >
              Challenges
              {pathname === "/challenges" && (
                <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-accent rounded-r-full" />
              )}
            </Link>
            <Link
              href="/sustainability"
              className={`block px-4 py-2 text-foreground/70 hover:text-primary transition-colors relative ${
                pathname === "/sustainability" ? "text-primary font-medium" : ""
              }`}
            >
              Sustainability Score
              {pathname === "/sustainability" && (
                <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-accent rounded-r-full" />
              )}
            </Link>
            <Link
              href="/calculator"
              className={`block px-4 py-2 text-foreground/70 hover:text-primary transition-colors relative ${
                pathname === "/calculator" ? "text-primary font-medium" : ""
              }`}
            >
              Calculator
              {pathname === "/calculator" && (
                <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-accent rounded-r-full" />
              )}
            </Link>
            <Link
              href="/admin"
              className={`block px-4 py-2 text-foreground/70 hover:text-primary transition-colors relative ${
                pathname === "/admin" ? "text-primary font-medium" : ""
              }`}
            >
              Admin
              {pathname === "/admin" && (
                <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-accent rounded-r-full" />
              )}
            </Link>

            {/* Mobile Auth Links */}
            <div className="border-t border-border pt-2 mt-2">
              {isLoggedIn ? (
                <Link
                  href="/profile"
                  className={`block px-4 py-2 text-foreground/70 hover:text-primary transition-colors relative ${
                    pathname === "/profile" ? "text-primary font-medium" : ""
                  }`}
                >
                  Profile
                  {pathname === "/profile" && (
                    <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-accent rounded-r-full" />
                  )}
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block px-4 py-2 text-foreground/70 hover:text-primary transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="block mx-4 my-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground text-center font-medium"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
