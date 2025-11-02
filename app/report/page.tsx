"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { AlertCircle, Check, Upload, Sparkles } from "lucide-react"
import { RewardPopup } from "@/components/reward-popup"
import { Button } from "@/components/ui/button"

type FormStep = "type" | "details" | "submit"

interface FormData {
  type: "outage" | "solar-usage" | "suggestion"
  title: string
  description: string
  location: string
  severity?: "low" | "medium" | "high"
  image?: File | null
}

export default function ReportPage() {
  const [step, setStep] = useState<FormStep>("type")
  const [formData, setFormData] = useState<FormData>({
    type: "outage",
    title: "",
    description: "",
    location: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [reward, setReward] = useState<{ coins: number; show: boolean }>({ coins: 0, show: false })

  const reportTypes = [
    {
      id: "outage" as const,
      title: "Report Outage",
      description: "Report a power shortage in your area",
      icon: AlertCircle,
      color: "from-red-500 to-orange-500",
      reward: 50,
    },
    {
      id: "solar-usage" as const,
      title: "Share Solar Usage",
      description: "Report your daily solar energy consumption",
      icon: Sparkles,
      color: "from-yellow-500 to-amber-500",
      reward: 25,
    },
    {
      id: "suggestion" as const,
      title: "Send Suggestion",
      description: "Share ideas to improve the platform",
      icon: AlertCircle,
      color: "from-blue-500 to-cyan-500",
      reward: 75,
    },
  ]

  const handleSubmit = () => {
    const rewardAmount = reportTypes.find((t) => t.id === formData.type)?.reward || 0
    setReward({ coins: rewardAmount, show: true })
    setSubmitted(true)

    // Reset form after 3 seconds
    setTimeout(() => {
      setStep("type")
      setFormData({ type: "outage", title: "", description: "", location: "" })
      setSubmitted(false)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-card/10 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Submit a Report</h1>
          <p className="text-foreground/60 text-lg">
            Help us improve the network. Earn GreenCoins for every submission.
          </p>
        </motion.div>

        {/* Step Indicator */}
        <div className="flex justify-between items-center mb-12">
          {["Select Type", "Add Details", "Submit"].map((label, i) => (
            <motion.div key={i} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  step === ["type", "details", "submit"][i]
                    ? "bg-gradient-to-br from-primary to-accent text-foreground"
                    : ["type", "details", "submit"].indexOf(step) > i
                      ? "bg-emerald-500 text-foreground"
                      : "bg-muted text-foreground/50"
                }`}
              >
                {["type", "details", "submit"].indexOf(step) > i ? "✓" : i + 1}
              </div>
              {i < 2 && (
                <div
                  className={`w-12 h-1 mx-2 transition-all ${
                    ["type", "details", "submit"].indexOf(step) > i ? "bg-emerald-500" : "bg-muted"
                  }`}
                />
              )}
            </motion.div>
          ))}
        </div>

        {/* Form Content */}
        <motion.div
          className="glass-dark p-8 rounded-xl neon-border-cyan"
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          {step === "type" && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-foreground">What would you like to report?</h2>
              <div className="grid grid-cols-1 gap-4">
                {reportTypes.map((type) => {
                  const Icon = type.icon
                  return (
                    <motion.button
                      key={type.id}
                      onClick={() => {
                        setFormData({ ...formData, type: type.id })
                        setStep("details")
                      }}
                      className={`p-6 rounded-lg border-2 text-left transition-all ${
                        formData.type === type.id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-12 h-12 rounded-lg bg-gradient-to-br ${type.color} flex items-center justify-center`}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-foreground text-lg">{type.title}</h3>
                          <p className="text-foreground/60 text-sm">{type.description}</p>
                          <p className="text-primary text-sm font-semibold mt-2">+{type.reward} GreenCoins</p>
                        </div>
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </div>
          )}

          {step === "details" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder={`${reportTypes.find((t) => t.id === formData.type)?.title} title`}
                  className="w-full px-4 py-3 rounded-lg bg-black/30 border border-border text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Provide detailed information about your report..."
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg bg-black/30 border border-border text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="City or area name"
                  className="w-full px-4 py-3 rounded-lg bg-black/30 border border-border text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              {formData.type === "outage" && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Severity Level</label>
                  <div className="flex gap-3">
                    {(["low", "medium", "high"] as const).map((sev) => (
                      <button
                        key={sev}
                        onClick={() => setFormData({ ...formData, severity: sev })}
                        className={`flex-1 py-2 rounded-lg capitalize font-medium transition-all ${
                          formData.severity === sev
                            ? "bg-primary text-primary-foreground"
                            : "bg-black/30 text-foreground hover:border border-border"
                        }`}
                      >
                        {sev}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Upload Image (Optional)</label>
                <motion.div
                  className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                >
                  <Upload className="w-8 h-8 mx-auto mb-2 text-foreground/60" />
                  <p className="text-sm text-foreground/60">Drag and drop or click to upload</p>
                  <p className="text-xs text-foreground/40 mt-1">PNG, JPG up to 5MB</p>
                </motion.div>
              </div>

              <div className="flex gap-4">
                <Button onClick={() => setStep("type")} variant="outline" className="flex-1">
                  Back
                </Button>
                <Button
                  onClick={() => setStep("submit")}
                  className="flex-1 bg-primary hover:bg-primary/90"
                  disabled={!formData.title || !formData.description}
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {step === "submit" && (
            <div className="text-center">
              <motion.div
                className="mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 10 }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8" />
                </div>
              </motion.div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Review Your Report</h2>
              <p className="text-foreground/60 mb-6">Please review the information before submitting</p>

              <div className="glass-dark p-6 rounded-lg mb-6 text-left space-y-3">
                <div>
                  <p className="text-foreground/60 text-sm">Type</p>
                  <p className="font-semibold text-foreground capitalize">{formData.type.replace("-", " ")}</p>
                </div>
                <div>
                  <p className="text-foreground/60 text-sm">Title</p>
                  <p className="font-semibold text-foreground">{formData.title}</p>
                </div>
                <div>
                  <p className="text-foreground/60 text-sm">Location</p>
                  <p className="font-semibold text-foreground">{formData.location}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Button onClick={() => setStep("details")} variant="outline" className="flex-1">
                  Edit
                </Button>
                <Button onClick={handleSubmit} className="flex-1 bg-primary hover:bg-primary/90">
                  Submit Report
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Reward Popup */}
      {reward.show && <RewardPopup coins={reward.coins} onComplete={() => setReward({ ...reward, show: false })} />}
    </div>
  )
}
