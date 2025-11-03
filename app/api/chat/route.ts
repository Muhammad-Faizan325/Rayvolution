import { NextResponse } from "next/server"

const SYSTEM_PROMPT = `You are an AI Personal Energy Advisor for Rayvolution Pakistan, a solar energy platform. You help users with:
- Energy predictions and forecasts for Pakistan cities
- Personalized energy-saving tips
- Sustainability score insights and improvements
- GreenCoins rewards and gamification guidance
- City performance analysis across Pakistan
- Energy marketplace and trading advice
- Daily challenges and streak maintenance

Provide concise, helpful, and Pakistan-specific energy advice. Use emojis to make responses friendly and engaging. Keep responses under 200 words unless asked for detailed information.

Key Pakistan cities solar data:
- Islamabad: 58% adoption, 7.5 hrs avg sunlight
- Lahore: 52% adoption, 7.8 hrs avg sunlight
- Karachi: 45% adoption, 8.2 hrs avg sunlight
- Peshawar: 38% adoption, 7.2 hrs avg sunlight
- Quetta: 28% adoption, 8.8 hrs avg sunlight

Current user stats (example):
- Sustainability Score: 76/100
- GreenCoins Balance: 3,845
- Current Streak: 12 days
- Energy Tokens: 45 kWh`

export async function POST(request: Request) {
  const { message } = await request.json()

  if (!message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 })
  }

  const apiKey = process.env.GROQ_API_KEY

  if (!apiKey) {
    // Fallback to local responses if no API key
    return NextResponse.json({
      response: getFallbackResponse(message),
      source: "fallback",
    })
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile", // Fast and free Groq model
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: message },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    })

    if (!response.ok) {
      throw new Error("Groq API request failed")
    }

    const data = await response.json()
    const aiResponse = data.choices[0]?.message?.content || "I'm sorry, I couldn't process that request."

    return NextResponse.json({
      response: aiResponse,
      source: "groq",
      model: "llama-3.3-70b-versatile",
    })
  } catch (error) {
    console.error("AI Chat Error:", error)

    // Fallback to local responses
    return NextResponse.json({
      response: getFallbackResponse(message),
      source: "fallback",
    })
  }
}

// Fallback intelligent responses when API is not available
function getFallbackResponse(message: string): string {
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes("energy") && lowerMessage.includes("save")) {
    return "💡 Energy Saving Tips:\n1. Run washing machines & dishwashers during 10 AM - 2 PM (peak solar)\n2. Use LED bulbs - save 75% energy\n3. Unplug devices on standby\n4. Set AC to 24°C instead of 20°C\n\nYou could save up to 2.5 kWh daily!"
  }

  if (lowerMessage.includes("predict") || lowerMessage.includes("forecast") || lowerMessage.includes("tomorrow")) {
    return "🌤️ Energy Forecast:\nTomorrow: 8.5 hrs sunlight, 92% efficiency\nBest hours: 10 AM - 2 PM\nExpected generation: 45 kWh\n\n✅ Perfect day to run heavy appliances!"
  }

  if (lowerMessage.includes("sustainability") || lowerMessage.includes("score")) {
    return "🌱 Your Sustainability Score: 76/100\n\n✅ Strengths: Community engagement (92)\n⚠️ Improve: Consistency (65)\n\nTip: Report daily for 7 days to boost score by +15 points!"
  }

  if (lowerMessage.includes("greencoins") || lowerMessage.includes("tokens") || lowerMessage.includes("rewards")) {
    return "🪙 GreenCoins & Rewards:\n\nYour balance: 3,845 coins\n\nEarn more by:\n• Completing daily challenges (+50-100)\n• Maintaining streaks (+500 weekly)\n• Donating energy tokens (+25 per donation)\n\nRedeem at the Marketplace!"
  }

  if (lowerMessage.includes("marketplace") || lowerMessage.includes("trade") || lowerMessage.includes("donate")) {
    return "🔄 Energy Marketplace:\n\nYou have 45 kWh tokens (Rs 1,350 value)\n\nOptions:\n1. Sell tokens (Rs 30/kWh)\n2. Donate to energy-deficient areas\n3. Trade with community\n\nBalochistan needs 150 kWh - consider donating!"
  }

  if (lowerMessage.includes("challenge") || lowerMessage.includes("streak")) {
    return "🎯 Today's Challenges:\n\n1. ⚡ Keep usage below 5 kWh (+50 coins)\n2. ☀️ Generate 8+ kWh solar (+75 coins)\n3. 📊 Share 1 energy report (+100 coins)\n\nCurrent streak: 12 days 🔥\nNext milestone: 15 days for bonus!"
  }

  if (lowerMessage.includes("city") || lowerMessage.includes("lahore") || lowerMessage.includes("karachi")) {
    return "📍 City Performance:\n\nTop 3 Cities:\n1. Islamabad - 58% adoption\n2. Lahore - 52% adoption\n3. Karachi - 45% adoption\n\nLahore trends: +12% monthly growth\nPower shortage: 32% (improving!)"
  }

  if (lowerMessage.includes("impact") || lowerMessage.includes("co2") || lowerMessage.includes("environment")) {
    return "🌍 Your Environmental Impact:\n\nTotal Savings:\n• Energy: 2,847 kWh\n• CO₂ prevented: 1,423 kg\n• Equivalent to: 71 trees planted\n• Money saved: Rs 79,716\n\nYou're in the top 10% nationally! 🏆"
  }

  if (lowerMessage.includes("how") || lowerMessage.includes("start") || lowerMessage.includes("begin")) {
    return "🚀 Getting Started:\n\n1. Visit Dashboard for your overview\n2. Check AI Prediction for daily forecasts\n3. Complete Challenges to earn rewards\n4. Track your Sustainability Score\n5. Join Marketplace to trade energy\n\nNeed help with anything specific?"
  }

  // Default responses
  const responses = [
    "That's a great question! Based on your energy patterns, I recommend focusing on peak solar hours (10 AM - 3 PM) for heavy appliances. This can boost your savings by 40%!",
    "📊 Based on current data, your city is performing well! Solar adoption is up 12%, and power shortages are decreasing. Keep contributing!",
    "🌤️ Weather forecast looks great! The next 3 days show optimal solar conditions with 92% efficiency. Perfect time to maximize generation!",
    "💡 Quick tip: Running appliances during peak sunlight hours can increase your solar energy utilization by 40%. Check your AI Prediction page for best times!",
    "🎯 I see you're active in the community! Complete today's challenges to earn bonus GreenCoins. You're only 3 days away from a 15-day streak milestone!",
    "🌱 Your sustainability score is 76/100 - that's top 10%! To reach 80+, focus on daily consistency. Report your energy usage daily this week.",
  ]

  return responses[Math.floor(Math.random() * responses.length)]
}
