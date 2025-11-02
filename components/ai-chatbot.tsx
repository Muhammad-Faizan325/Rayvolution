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
      text: "Hello! I'm your AI Energy Assistant. How can I help you today? I can assist with energy-saving tips, city performance, sunlight predictions, and more.",
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

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages([...messages, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponses = [
        "That's a great question! Here are my recommendations: 1) Install solar panels on south-facing roofs. 2) Use smart thermostats to optimize energy usage. 3) Switch to LED lighting.",
        "Based on current data, Lahore has the highest solar adoption rate at 52%. The city is showing excellent growth with +12% monthly increase.",
        "The next 3 days forecast shows optimal solar conditions with 92% efficiency. I recommend maximizing your solar generation during peak hours.",
        "Energy-saving tip: Running appliances during peak sunlight hours (10 AM - 3 PM) can increase your solar energy utilization by 40%.",
        "Your city's power shortage is decreasing! With current solar adoption rates, we expect a 35% reduction by next quarter.",
      ]

      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)]

      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        text: randomResponse,
        sender: "ai",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
      setIsLoading(false)
    }, 1000)
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
