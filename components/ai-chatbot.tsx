"use client"

import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, X, Send, Loader } from "lucide-react"
import { useState, useRef, useEffect } from "react"

interface Message {
  id: string
  text: string
  sender: "user" | "ai"
  timestamp: Date
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "👋 Hello! I'm your AI Personal Energy Advisor!\n\nI can help you with:\n• 🌤️ Energy predictions & forecasts\n• 💡 Personalized energy-saving tips\n• 🏆 Sustainability score insights\n• 🪙 GreenCoins & rewards guidance\n• 📊 City performance analysis\n• 🔄 Marketplace & trading advice\n\nWhat would you like to know?",
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: input,
      sender: "user",
      timestamp: new Date(),
    }

    const currentInput = input
    setMessages([...messages, userMessage])
    setInput("")
    setIsLoading(true)

    // Call the AI API
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: currentInput }),
      })

      const data = await response.json()

      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        text: data.response || "I'm sorry, I couldn't process that request.",
        sender: "ai",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
      setIsLoading(false)
    } catch (error) {
      console.error("Chat error:", error)

      // Fallback to local response on error
      const lowerInput = currentInput.toLowerCase()

      let response = ""

      // AI Energy Advisor - Context-aware responses
      if (lowerInput.includes("energy") && lowerInput.includes("save")) {
        response = "💡 Energy Saving Tips:\n1. Run washing machines & dishwashers during 10 AM - 2 PM (peak solar)\n2. Use LED bulbs - save 75% energy\n3. Unplug devices on standby\n4. Set AC to 24°C instead of 20°C\n\nYou could save up to 2.5 kWh daily!"
      } else if (lowerInput.includes("predict") || lowerInput.includes("forecast") || lowerInput.includes("tomorrow")) {
        response = "🌤️ Energy Forecast:\nTomorrow: 8.5 hrs sunlight, 92% efficiency\nBest hours: 10 AM - 2 PM\nExpected generation: 45 kWh\n\n✅ Perfect day to run heavy appliances!"
      } else if (lowerInput.includes("sustainability") || lowerInput.includes("score")) {
        response = "🌱 Your Sustainability Score: 76/100\n\n✅ Strengths: Community engagement (92)\n⚠️ Improve: Consistency (65)\n\nTip: Report daily for 7 days to boost score by +15 points!"
      } else if (lowerInput.includes("greencoins") || lowerInput.includes("tokens") || lowerInput.includes("rewards")) {
        response = "🪙 GreenCoins & Rewards:\n\nYour balance: 3,845 coins\n\nEarn more by:\n• Completing daily challenges (+50-100)\n• Maintaining streaks (+500 weekly)\n• Donating energy tokens (+25 per donation)\n\nRedeem at the Marketplace!"
      } else if (lowerInput.includes("marketplace") || lowerInput.includes("trade") || lowerInput.includes("donate")) {
        response = "🔄 Energy Marketplace:\n\nYou have 45 kWh tokens (Rs 1,350 value)\n\nOptions:\n1. Sell tokens (Rs 30/kWh)\n2. Donate to energy-deficient areas\n3. Trade with community\n\nBalochistan needs 150 kWh - consider donating!"
      } else if (lowerInput.includes("challenge") || lowerInput.includes("streak")) {
        response = "🎯 Today's Challenges:\n\n1. ⚡ Keep usage below 5 kWh (+50 coins)\n2. ☀️ Generate 8+ kWh solar (+75 coins)\n3. 📊 Share 1 energy report (+100 coins)\n\nCurrent streak: 12 days 🔥\nNext milestone: 15 days for bonus!"
      } else if (lowerInput.includes("city") || lowerInput.includes("lahore") || lowerInput.includes("karachi")) {
        response = "📍 City Performance:\n\nTop 3 Cities:\n1. Islamabad - 58% adoption\n2. Lahore - 52% adoption\n3. Karachi - 45% adoption\n\nLahore trends: +12% monthly growth\nPower shortage: 32% (improving!)"
      } else if (lowerInput.includes("impact") || lowerInput.includes("co2") || lowerInput.includes("environment")) {
        response = "🌍 Your Environmental Impact:\n\nTotal Savings:\n• Energy: 2,847 kWh\n• CO₂ prevented: 1,423 kg\n• Equivalent to: 71 trees planted\n• Money saved: Rs 79,716\n\nYou're in the top 10% nationally! 🏆"
      } else if (lowerInput.includes("how") || lowerInput.includes("start") || lowerInput.includes("begin")) {
        response = "🚀 Getting Started:\n\n1. Visit Dashboard for your overview\n2. Check AI Prediction for daily forecasts\n3. Complete Challenges to earn rewards\n4. Track your Sustainability Score\n5. Join Marketplace to trade energy\n\nNeed help with anything specific?"
      } else {
        // Default intelligent responses
        const aiResponses = [
          "That's a great question! Based on your energy patterns, I recommend focusing on peak solar hours (10 AM - 3 PM) for heavy appliances. This can boost your savings by 40%!",
          "📊 Based on current data, your city is performing well! Solar adoption is up 12%, and power shortages are decreasing. Keep contributing!",
          "🌤️ Weather forecast looks great! The next 3 days show optimal solar conditions with 92% efficiency. Perfect time to maximize generation!",
          "💡 Quick tip: Running appliances during peak sunlight hours can increase your solar energy utilization by 40%. Check your AI Prediction page for best times!",
          "🎯 I see you're active in the community! Complete today's challenges to earn bonus GreenCoins. You're only 3 days away from a 15-day streak milestone!",
          "🌱 Your sustainability score is 76/100 - that's top 10%! To reach 80+, focus on daily consistency. Report your energy usage daily this week.",
        ]
        response = aiResponses[Math.floor(Math.random() * aiResponses.length)]
      }

      const randomResponse = response

      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        text: randomResponse,
        sender: "ai",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Chat Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg z-40 hover:scale-110 transition-transform"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}>
            <MessageCircle className="w-6 h-6" />
          </motion.div>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-8 w-96 max-h-96 rounded-2xl glass-dark border border-border shadow-2xl z-40 flex flex-col overflow-hidden neon-border-cyan"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", damping: 20 }}
          >
            {/* Header */}
            <div className="p-4 border-b border-border bg-black/30">
              <h3 className="font-bold text-foreground">AI Energy Assistant</h3>
              <p className="text-xs text-foreground/60">Always here to help</p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.sender === "user"
                        ? "bg-gradient-to-r from-primary to-accent text-primary-foreground"
                        : "bg-black/30 text-foreground border border-border"
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  className="flex justify-start"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                >
                  <div className="bg-black/30 text-foreground border border-border px-4 py-2 rounded-lg flex items-center gap-2">
                    <Loader className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border bg-black/30">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask me anything..."
                  className="flex-1 px-3 py-2 rounded-lg bg-black/30 border border-border text-foreground text-sm placeholder:text-foreground/40 focus:outline-none focus:border-primary transition-colors"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="p-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
