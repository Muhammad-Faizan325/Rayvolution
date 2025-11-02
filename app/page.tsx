"use client"

import {
  ArrowRight,
  Sun,
  Zap,
  Globe,
  Leaf,
  TrendingUp,
  Award,
  Users,
  Sparkles,
  Activity,
  Droplet,
  Wind,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HeroBackground } from "@/components/hero-background"
import { AnimatedCounter } from "@/components/animated-counter"

export default function Home() {
  return (
    <div className="w-full overflow-hidden bg-gradient-to-b from-background via-background to-card/20">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <HeroBackground />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 backdrop-blur animate-fade-in animation-delay-200">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">Powered by AI & Real-Time Data</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight animate-fade-in animation-delay-400">
            <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 dark:from-cyan-300 dark:via-emerald-300 dark:to-cyan-300 bg-clip-text text-transparent">
              Revolutionizing Energy
            </span>
            <br />
            <span className="text-foreground">Through Every Ray of Sun</span>
          </h1>

          <p className="text-lg md:text-xl text-foreground/70 max-w-3xl mx-auto leading-relaxed animate-fade-in animation-delay-600">
            Pakistan's leading AI-powered solar energy platform. Real-time visualization, predictive analytics,
            community engagement, and environmental impact tracking all in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in animation-delay-800">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 group w-full sm:w-auto"
              >
                Explore Dashboard
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/map">
              <Button
                size="lg"
                variant="outline"
                className="border-primary/30 hover:border-primary hover:bg-primary/5 gap-2 group bg-transparent w-full sm:w-auto"
              >
                View Live Map
                <Globe className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="flex flex-col items-center gap-2 text-foreground/50">
            <span className="text-sm">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-foreground/30 rounded-full flex items-start justify-center p-2">
              <div className="w-1 h-2 bg-foreground/50 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Real-Time Stats Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-card/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 animate-fade-in">Pakistan's Solar Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Active Users", value: 2847, suffix: "+", icon: Users },
              { label: "CO₂ Prevented", value: 15480, suffix: " tons", icon: Leaf },
              { label: "Average Sunlight", value: 8.5, suffix: " hrs", icon: Sun },
              { label: "Adoption Growth", value: 34, suffix: "%", icon: TrendingUp },
            ].map((stat, i) => {
              const Icon = stat.icon
              return (
                <div
                  key={i}
                  className="glass-dark p-6 rounded-xl text-center group hover:neon-border-cyan transition-all duration-300 animate-fade-in hover:scale-105 cursor-pointer"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="flex justify-center mb-3">
                    <Icon className="w-6 h-6 text-primary group-hover:text-accent transition-colors" />
                  </div>
                  <div className="text-sm text-foreground/60 mb-2">{stat.label}</div>
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
                    <AnimatedCounter target={stat.value} />
                  </div>
                  <div className="text-sm text-foreground/50">{stat.suffix}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section
        id="features"
        className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-card/20 to-transparent"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Choose Rayvolution?</h2>
            <p className="text-foreground/60 text-lg max-w-3xl mx-auto">
              Experience the future of solar energy management with AI-powered insights, real-time monitoring, and
              community impact tracking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {[
              {
                icon: Activity,
                title: "Real-Time Monitoring",
                description:
                  "Track solar adoption across Pakistan with live data updates, interactive dashboards, and instant performance metrics.",
              },
              {
                icon: Sparkles,
                title: "AI-Powered Insights",
                description:
                  "Get intelligent predictions, weather forecasting, and personalized recommendations powered by advanced machine learning.",
              },
              {
                icon: Globe,
                title: "Interactive Solar Map",
                description:
                  "Visualize energy adoption levels by city, explore regional trends, and compare performance metrics in real-time.",
              },
              {
                icon: Award,
                title: "Gamification & Rewards",
                description:
                  "Earn GreenCoins, unlock eco-badges, compete on leaderboards, and track your environmental contribution.",
              },
            ].map((feature, i) => {
              const Icon = feature.icon
              return (
                <div
                  key={i}
                  className="glass-dark p-8 rounded-xl group hover:neon-border-emerald transition-all duration-300 hover:scale-105 animate-fade-in"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary/50 to-accent/50 flex items-center justify-center mb-4 group-hover:neon-glow-cyan">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-foreground/70 leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Advanced Features Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Comprehensive Energy Solutions</h2>
            <p className="text-foreground/60 text-lg max-w-3xl mx-auto">
              From prediction to action - everything you need for solar energy optimization
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Droplet,
                title: "Weather Integration",
                description:
                  "Real-time weather data integration for accurate solar generation forecasts and peak performance timing.",
                features: ["Wind Speed", "Cloud Coverage", "Temperature", "Humidity Levels"],
              },
              {
                icon: Zap,
                title: "Energy Analytics",
                description:
                  "Detailed breakdown of energy production, consumption patterns, and efficiency optimization recommendations.",
                features: ["Hourly Trends", "Peak Hours", "Usage Patterns", "Cost Analysis"],
              },
              {
                icon: Wind,
                title: "Environmental Impact",
                description:
                  "Track your contribution to carbon reduction, environmental goals, and sustainability metrics.",
                features: ["CO₂ Saved", "Trees Planted", "Energy Offset", "Impact Score"],
              },
            ].map((feature, i) => {
              const Icon = feature.icon
              return (
                <div
                  key={i}
                  className="glass-dark p-8 rounded-xl animate-fade-in"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/40 to-accent/40 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-foreground/70 mb-4">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.features.map((f, idx) => (
                      <li key={idx} className="text-sm text-foreground/60 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Community Impact Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-card/10 to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Join a Growing Community</h2>
              <p className="text-foreground/70 text-lg mb-6 leading-relaxed">
                Rayvolution connects thousands of solar energy enthusiasts, professionals, and organizations across
                Pakistan. Share insights, compete on leaderboards, and make a collective impact on sustainable energy
                adoption.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Access exclusive community events and webinars",
                  "Share and learn from other solar energy users",
                  "Earn rewards through gamification",
                  "Contribute to Pakistan's clean energy future",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-foreground/80">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/community">
                <Button size="lg" className="bg-primary hover:bg-primary/90 gap-2">
                  Join Community
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="glass-dark p-8 rounded-2xl h-96 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="text-5xl font-bold text-primary">2,847</div>
                <p className="text-foreground/70 text-lg">Active Community Members</p>
                <div className="pt-4 space-y-2">
                  <p className="text-sm text-foreground/60">Top Contributor: Ali Ahmed</p>
                  <p className="text-sm text-foreground/60">Average Session: 24 mins</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Built with Modern Technology</h2>
            <p className="text-foreground/60 text-lg">
              Enterprise-grade infrastructure for reliability and performance
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "Next.js",
              "React",
              "TypeScript",
              "Tailwind CSS",
              "AI/ML",
              "Real-time APIs",
              "Cloud Infrastructure",
              "Data Analytics",
            ].map((tech, i) => (
              <div
                key={i}
                className="glass-dark p-6 rounded-lg text-center text-foreground/80 font-medium hover:neon-border-cyan transition-all"
              >
                {tech}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="glass-dark p-12 rounded-2xl text-center relative overflow-hidden animate-fade-in">
            <div className="relative z-10 space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold">Ready to Transform Pakistan's Energy Future?</h2>
              <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
                Start your solar energy journey today. Monitor, analyze, and optimize with Rayvolution's AI-powered
                platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link href="/dashboard">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto">
                    Start Exploring
                  </Button>
                </Link>
                <Link href="/report">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary/30 hover:border-primary w-full sm:w-auto bg-transparent"
                  >
                    Report Solar Usage
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
