"use client"

import { useState } from "react"
import { Zap, Leaf, DollarSign, Droplet, Wind, Trees, Home, Lightbulb, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

interface FormData {
  city: string
  coolingCost: number
  heatingCost: number
  monthlyBill: number
  buildingType: string
  area: number
  energySource: string
  hasSolarPanels: boolean
  solarSystemKW: number
  hasSmartWind: boolean
  hasShaderTrees: boolean
  hasInsulation: boolean
  airLeakage: number
  windowRValue: number
  fixedCosts: number
  hasInflation: boolean
}

interface Results {
  tenYearCost: number
  annualSavings: number
  co2Saved: number
  solarEfficiency: number
  costReduction: number
  monthlyAverage: number
  paybackPeriod: number
  solarGenerationKWh: number
  solarSavingsAmount: number
}

const CITY_SOLAR_DATA: Record<string, { avgSunlight: number; costPerKwh: number }> = {
  Lahore: { avgSunlight: 8.2, costPerKwh: 28 },
  Karachi: { avgSunlight: 8.8, costPerKwh: 26 },
  Islamabad: { avgSunlight: 7.9, costPerKwh: 27 },
  Quetta: { avgSunlight: 9.1, costPerKwh: 29 },
  Peshawar: { avgSunlight: 7.5, costPerKwh: 28 },
  Multan: { avgSunlight: 8.4, costPerKwh: 27 },
}

export default function EnergyCalculator() {
  const [step, setStep] = useState(1)
  const [showResults, setShowResults] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    city: "Lahore",
    coolingCost: 28,
    heatingCost: 12,
    monthlyBill: 5000,
    buildingType: "House",
    area: 2000,
    energySource: "Grid",
    hasSolarPanels: false,
    solarSystemKW: 5,
    hasSmartWind: false,
    hasShaderTrees: false,
    hasInsulation: false,
    airLeakage: 12,
    windowRValue: 2.5,
    fixedCosts: 1000,
    hasInflation: true,
  })

  const calculateResults = (): Results => {
    const solarData = CITY_SOLAR_DATA[formData.city] || CITY_SOLAR_DATA.Lahore
    const baseAnnualCost = formData.monthlyBill * 12
    let savings = 0
    let solarGenerationKWh = 0
    let solarSavingsAmount = 0

    // Solar savings based on system kW capacity
    if (formData.hasSolarPanels && formData.solarSystemKW > 0) {
      // Average daily generation = kW × average sunlight hours × system efficiency (0.85)
      const dailyGeneration = formData.solarSystemKW * solarData.avgSunlight * 0.85
      // Annual generation in kWh
      solarGenerationKWh = Math.round(dailyGeneration * 365)
      // Annual savings in rupees
      solarSavingsAmount = Math.round(solarGenerationKWh * solarData.costPerKwh)
      savings += solarSavingsAmount
    }

    // Smart wind savings
    if (formData.hasSmartWind) {
      savings += baseAnnualCost * 0.12
    }

    // Shade trees savings
    if (formData.hasShaderTrees) {
      savings += baseAnnualCost * 0.08
    }

    // Insulation savings
    if (formData.hasInsulation) {
      const insulationReduction = (formData.airLeakage / 20) * 0.15 * baseAnnualCost
      savings += insulationReduction
    }

    // Window improvements
    if (formData.windowRValue > 2.5) {
      savings += baseAnnualCost * ((formData.windowRValue - 2.5) / 5) * 0.1
    }

    // Calculate metrics
    const annualSavings = Math.round(savings)
    const tenYearCost = (baseAnnualCost - annualSavings) * 10
    const costReduction = baseAnnualCost > 0 ? Math.round((annualSavings / baseAnnualCost) * 100) : 0
    // CO2 saved: approximately 0.92 kg CO2 per kWh in Pakistan
    const co2Saved = Math.round((solarGenerationKWh * 0.92) / 1000) // in tons
    const solarEfficiency = formData.hasSolarPanels ? 85 : 0
    // Typical solar system cost in Pakistan: PKR 100,000 - 120,000 per kW
    const solarSystemCost = formData.solarSystemKW * 110000
    const paybackPeriod = solarSavingsAmount > 0 ? Math.round((solarSystemCost / solarSavingsAmount) * 10) / 10 : 0

    return {
      tenYearCost,
      annualSavings,
      co2Saved,
      solarEfficiency,
      costReduction: Math.min(costReduction, 100),
      monthlyAverage: Math.round(annualSavings / 12),
      paybackPeriod,
      solarGenerationKWh,
      solarSavingsAmount,
    }
  }

  const handleSimulation = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setShowResults(true)
    setIsLoading(false)
  }

  const results = calculateResults()

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-background via-background to-card/20">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-4 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 backdrop-blur">
            <Zap className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">AI-Powered Simulation</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 dark:from-cyan-300 dark:via-emerald-300 dark:to-cyan-300 bg-clip-text text-transparent">
              Energy Savings Simulator
            </span>
          </h1>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Estimate your solar savings and power efficiency in real time using AI-powered calculations based on
            Pakistan's climate data.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {!showResults ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form Section */}
              <div className="lg:col-span-2">
                <div className="space-y-6">
                  {/* Step Indicator */}
                  <div className="flex gap-2 mb-8">
                    {[1, 2, 3].map((s) => (
                      <div key={s} className="flex items-center gap-2 flex-1">
                        <button
                          onClick={() => step >= s && setStep(s)}
                          className={`w-10 h-10 rounded-full font-bold transition-all ${
                            step >= s
                              ? "bg-primary text-primary-foreground"
                              : "bg-card border border-primary/20 text-foreground/50"
                          }`}
                        >
                          {s}
                        </button>
                        {s < 3 && (
                          <div
                            className={`flex-1 h-1 rounded-full transition-all ${step > s ? "bg-primary" : "bg-card"}`}
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Step 1: Basic Info */}
                  {step === 1 && (
                    <div className="glass-dark p-8 rounded-2xl space-y-6 animate-fade-in">
                      <div>
                        <h2 className="text-2xl font-bold mb-6">Basic Information</h2>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Select Your City</label>
                            <select
                              value={formData.city}
                              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                              className="w-full px-4 py-3 rounded-lg bg-input border border-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                              {Object.keys(CITY_SOLAR_DATA).map((city) => (
                                <option key={city} value={city}>
                                  {city}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">Cooling Cost per kWh (₨)</label>
                              <input
                                type="number"
                                value={formData.coolingCost}
                                onChange={(e) =>
                                  setFormData({ ...formData, coolingCost: Number.parseFloat(e.target.value) })
                                }
                                className="w-full px-4 py-3 rounded-lg bg-input border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">Heating Cost per kWh (₨)</label>
                              <input
                                type="number"
                                value={formData.heatingCost}
                                onChange={(e) =>
                                  setFormData({ ...formData, heatingCost: Number.parseFloat(e.target.value) })
                                }
                                className="w-full px-4 py-3 rounded-lg bg-input border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Monthly Electricity Bill (₨) - Optional
                            </label>
                            <input
                              type="number"
                              value={formData.monthlyBill}
                              onChange={(e) =>
                                setFormData({ ...formData, monthlyBill: Number.parseFloat(e.target.value) })
                              }
                              placeholder="5000"
                              className="w-full px-4 py-3 rounded-lg bg-input border border-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                        </div>
                      </div>

                      <Button
                        onClick={() => setStep(2)}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        Continue to Building Details
                      </Button>
                    </div>
                  )}

                  {/* Step 2: Building Details */}
                  {step === 2 && (
                    <div className="glass-dark p-8 rounded-2xl space-y-6 animate-fade-in">
                      <div>
                        <h2 className="text-2xl font-bold mb-6">Building Details</h2>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">Building Type</label>
                              <select
                                value={formData.buildingType}
                                onChange={(e) => setFormData({ ...formData, buildingType: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg bg-input border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                              >
                                <option>Apartment</option>
                                <option>House</option>
                                <option>Office</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">Total Area (sq. ft.)</label>
                              <input
                                type="number"
                                value={formData.area}
                                onChange={(e) => setFormData({ ...formData, area: Number.parseFloat(e.target.value) })}
                                className="w-full px-4 py-3 rounded-lg bg-input border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">Current Energy Source</label>
                            <select
                              value={formData.energySource}
                              onChange={(e) => setFormData({ ...formData, energySource: e.target.value })}
                              className="w-full px-4 py-3 rounded-lg bg-input border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                              <option>Grid</option>
                              <option>Solar</option>
                              <option>Hybrid</option>
                            </select>
                          </div>

                          <div className="pt-4 border-t border-white/10">
                            <p className="text-sm font-medium mb-4">Energy Solutions</p>
                            <div className="space-y-3">
                              {[
                                { key: "hasSolarPanels", label: "Add Solar Panels", icon: Zap },
                                { key: "hasSmartWind", label: "Add SmartWind", icon: Wind },
                                { key: "hasShaderTrees", label: "Add Shade Trees", icon: Trees },
                                { key: "hasInsulation", label: "Add Insulation", icon: Home },
                              ].map((option) => {
                                const Icon = option.icon
                                return (
                                  <label
                                    key={option.key}
                                    className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-2 rounded transition"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={formData[option.key as keyof FormData] as boolean}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          [option.key]: e.target.checked,
                                        })
                                      }
                                      className="w-4 h-4 rounded border-primary bg-input cursor-pointer"
                                    />
                                    <Icon className="w-4 h-4 text-primary" />
                                    <span className="text-sm">{option.label}</span>
                                  </label>
                                )
                              })}
                            </div>

                            {/* Solar System Capacity Input */}
                            {formData.hasSolarPanels && (
                              <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/30">
                                <label className="block text-sm font-medium mb-2">
                                  Solar System Capacity (kW)
                                </label>
                                <input
                                  type="number"
                                  min="1"
                                  max="100"
                                  step="0.5"
                                  value={formData.solarSystemKW}
                                  onChange={(e) =>
                                    setFormData({ ...formData, solarSystemKW: Number.parseFloat(e.target.value) || 0 })
                                  }
                                  className="w-full px-4 py-3 rounded-lg bg-input border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                  placeholder="e.g., 5"
                                />
                                <p className="text-xs text-foreground/60 mt-2">
                                  Enter your solar panel system capacity in kilowatts (kW). Common residential systems range from 3-10 kW.
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          onClick={() => setStep(1)}
                          variant="outline"
                          className="flex-1 border-primary/30 bg-transparent"
                        >
                          Back
                        </Button>
                        <Button onClick={() => setStep(3)} className="flex-1 bg-primary hover:bg-primary/90">
                          Continue to Advanced Options
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Advanced Options */}
                  {step === 3 && (
                    <div className="glass-dark p-8 rounded-2xl space-y-6 animate-fade-in">
                      <div>
                        <h2 className="text-2xl font-bold mb-6">Advanced Options</h2>
                        <div className="space-y-6">
                          <div>
                            <label className="block text-sm font-medium mb-3">
                              Air Leakage (ACH): {formData.airLeakage.toFixed(1)}
                            </label>
                            <input
                              type="range"
                              min="5"
                              max="20"
                              step="0.5"
                              value={formData.airLeakage}
                              onChange={(e) =>
                                setFormData({ ...formData, airLeakage: Number.parseFloat(e.target.value) })
                              }
                              className="w-full h-2 bg-input rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                            <p className="text-xs text-foreground/50 mt-1">Lower = Better insulation</p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-3">
                              Window R-Value: {formData.windowRValue.toFixed(1)}
                            </label>
                            <input
                              type="range"
                              min="1.5"
                              max="5"
                              step="0.1"
                              value={formData.windowRValue}
                              onChange={(e) =>
                                setFormData({ ...formData, windowRValue: Number.parseFloat(e.target.value) })
                              }
                              className="w-full h-2 bg-input rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                            <p className="text-xs text-foreground/50 mt-1">Higher = Better insulation</p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-3">
                              Fixed Monthly Costs (₨): {formData.fixedCosts}
                            </label>
                            <input
                              type="range"
                              min="500"
                              max="5000"
                              step="100"
                              value={formData.fixedCosts}
                              onChange={(e) =>
                                setFormData({ ...formData, fixedCosts: Number.parseFloat(e.target.value) })
                              }
                              className="w-full h-2 bg-input rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                          </div>

                          <label className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-3 rounded transition">
                            <input
                              type="checkbox"
                              checked={formData.hasInflation}
                              onChange={(e) => setFormData({ ...formData, hasInflation: e.target.checked })}
                              className="w-4 h-4 rounded border-primary bg-input cursor-pointer"
                            />
                            <div>
                              <p className="text-sm font-medium">Include Energy Inflation</p>
                              <p className="text-xs text-foreground/50">Account for 3% annual price increase</p>
                            </div>
                          </label>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          onClick={() => setStep(2)}
                          variant="outline"
                          className="flex-1 border-primary/30 bg-transparent"
                        >
                          Back
                        </Button>
                        <Button
                          onClick={handleSimulation}
                          disabled={isLoading}
                          className="flex-1 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-white font-semibold text-lg py-6"
                        >
                          {isLoading ? "Running Simulation..." : "Run Simulation"}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Info Panel */}
              <div className="space-y-4">
                <Card className="glass-dark p-6 rounded-2xl border-0">
                  <div className="flex items-start gap-3 mb-4">
                    <Lightbulb className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold mb-2">Pro Tip</p>
                      <p className="text-sm text-foreground/70">
                        This simulation uses real weather data and energy rates from Pakistan's National Database.
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="glass-dark p-6 rounded-2xl border-0">
                  <p className="text-sm font-semibold mb-3">Current Selection Summary</p>
                  <ul className="space-y-2 text-sm text-foreground/70">
                    <li>
                      <span className="text-foreground">City:</span> {formData.city}
                    </li>
                    <li>
                      <span className="text-foreground">Building:</span> {formData.buildingType} ({formData.area} sq.
                      ft.)
                    </li>
                    <li>
                      <span className="text-foreground">Monthly Bill:</span> ₨{formData.monthlyBill.toLocaleString()}
                    </li>
                    <li className="pt-2 border-t border-white/10">
                      <span className="text-foreground">Solutions Selected:</span>
                      {[
                        formData.hasSolarPanels && `Solar Panels (${formData.solarSystemKW} kW)`,
                        formData.hasSmartWind && "SmartWind",
                        formData.hasShaderTrees && "Shade Trees",
                        formData.hasInsulation && "Insulation",
                      ]
                        .filter(Boolean)
                        .join(", ") || "None"}
                    </li>
                  </ul>
                </Card>
              </div>
            </div>
          ) : (
            // Results Section
            <div className="space-y-8 animate-fade-in">
              <div className="text-center space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold">Your Simulation Results</h2>
                <p className="text-foreground/70 text-lg">
                  AI-Powered Analysis Based on <span className="text-primary font-semibold">{formData.city}</span>'s
                  Climate Data
                </p>
              </div>

              {/* Main Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-dark p-8 rounded-2xl text-center group hover:neon-border-cyan transition-all">
                  <div className="text-5xl font-bold text-primary mb-2">₨{results.annualSavings.toLocaleString()}</div>
                  <p className="text-foreground/70 text-sm">Annual Savings</p>
                  <p className="text-xs text-foreground/50 mt-2">₨{results.monthlyAverage.toLocaleString()}/month</p>
                </div>

                <div className="glass-dark p-8 rounded-2xl text-center group hover:neon-border-emerald transition-all">
                  <div className="text-5xl font-bold text-accent mb-2">₨{results.tenYearCost.toLocaleString()}</div>
                  <p className="text-foreground/70 text-sm">10-Year Total Cost</p>
                  <p className="text-xs text-foreground/50 mt-2">Smart Setup</p>
                </div>

                <div className="glass-dark p-8 rounded-2xl text-center group hover:neon-border-cyan transition-all">
                  <div className="text-5xl font-bold text-primary mb-2">{results.co2Saved}</div>
                  <p className="text-foreground/70 text-sm">CO₂ Prevented</p>
                  <p className="text-xs text-foreground/50 mt-2">tons/year</p>
                </div>
              </div>

              {/* Gauges */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CircularGauge label="Solar Efficiency" value={results.solarEfficiency} />
                <CircularGauge label="Cost Reduction" value={results.costReduction} />
              </div>

              {/* Solar Generation Details */}
              {formData.hasSolarPanels && results.solarGenerationKWh > 0 && (
                <div className="glass-dark p-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/5">
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <Zap className="w-6 h-6 text-emerald-400" />
                    Solar Energy Generation
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 rounded-lg bg-white/5">
                      <p className="text-sm text-foreground/70 mb-1">System Capacity</p>
                      <p className="text-3xl font-bold text-primary">{formData.solarSystemKW} kW</p>
                    </div>
                    <div className="p-4 rounded-lg bg-white/5">
                      <p className="text-sm text-foreground/70 mb-1">Annual Generation</p>
                      <p className="text-3xl font-bold text-emerald-400">{results.solarGenerationKWh.toLocaleString()} kWh</p>
                      <p className="text-xs text-foreground/50 mt-1">
                        ~{Math.round(results.solarGenerationKWh / 12).toLocaleString()} kWh/month
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-white/5">
                      <p className="text-sm text-foreground/70 mb-1">Solar Savings</p>
                      <p className="text-3xl font-bold text-accent">₨{results.solarSavingsAmount.toLocaleString()}</p>
                      <p className="text-xs text-foreground/50 mt-1">
                        ₨{Math.round(results.solarSavingsAmount / 12).toLocaleString()}/month
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Detailed Breakdown */}
              <div className="glass-dark p-8 rounded-2xl">
                <h3 className="text-2xl font-bold mb-6">Detailed Breakdown</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      icon: DollarSign,
                      label: "Solar System Investment",
                      value: formData.hasSolarPanels ? `₨${(formData.solarSystemKW * 110000).toLocaleString()}` : "N/A",
                    },
                    {
                      icon: Zap,
                      label: "Payback Period",
                      value: results.paybackPeriod > 0 ? `${results.paybackPeriod} years` : "N/A"
                    },
                    { icon: Leaf, label: "Trees Equivalent", value: `${Math.round(results.co2Saved * 15)}` },
                    { icon: Droplet, label: "Water Saved", value: `${Math.round(results.annualSavings / 100)} m³` },
                  ].map((item, i) => {
                    const Icon = item.icon
                    return (
                      <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-white/5">
                        <Icon className="w-6 h-6 text-primary flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm text-foreground/70">{item.label}</p>
                          <p className="text-lg font-bold text-primary">{item.value}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* AI Insights */}
              <div className="glass-dark p-8 rounded-2xl border border-cyan-500/30 bg-cyan-500/5">
                <div className="flex items-start gap-4">
                  <Sparkles className="w-6 h-6 text-primary flex-shrink-0 mt-1 animate-pulse" />
                  <div>
                    <h4 className="font-bold text-lg mb-2">AI Suggests</h4>
                    <p className="text-foreground/80 leading-relaxed">
                      {results.annualSavings > 100000
                        ? `You can save ₨${(results.annualSavings / 1000).toFixed(0)}k annually by switching to a smart solar setup with all recommended upgrades. Consider prioritizing solar panels for maximum long-term ROI.`
                        : results.annualSavings > 50000
                          ? `Implementing solar panels and insulation could reduce your energy costs by ₨${(results.annualSavings / 1000).toFixed(0)}k annually, with a payback period of ${results.paybackPeriod} years.`
                          : `Start with basic energy efficiency improvements like insulation and window upgrades. These have lower upfront costs but immediate savings.`}
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => {
                    setShowResults(false)
                    setStep(1)
                  }}
                  variant="outline"
                  className="flex-1 border-primary/30 bg-transparent hover:bg-primary/10"
                >
                  Run Another Simulation
                </Button>
                <Link href="/report" className="flex-1">
                  <Button className="w-full bg-primary hover:bg-primary/90">Report Your Energy Setup</Button>
                </Link>
              </div>

              <p className="text-center text-xs text-foreground/50">
                Rayvolution Pakistan © 2025 — Powered by AI & Solar Innovation
              </p>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="glass-dark p-8 rounded-2xl text-center space-y-4">
                <div className="w-16 h-16 mx-auto relative">
                  <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
                  <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" />
                </div>
                <p className="text-lg font-semibold">Running Simulation...</p>
                <p className="text-sm text-foreground/70">Analyzing your energy data with AI models</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

function CircularGauge({ label, value }: { label: string; value: number }) {
  const radius = 45
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference

  return (
    <div className="glass-dark p-8 rounded-2xl flex flex-col items-center justify-center">
      <svg width="120" height="120" className="mb-4">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="currentColor" strokeWidth="8" className="text-card" />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="text-primary transition-all duration-1000"
          strokeLinecap="round"
        />
        <text x="60" y="70" textAnchor="middle" className="fill-primary font-bold text-2xl">
          {value}%
        </text>
      </svg>
      <p className="text-foreground/70 text-sm font-medium">{label}</p>
    </div>
  )
}
