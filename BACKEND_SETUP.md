# Rayvolution Pakistan - Backend & API Setup

This guide will help you set up the backend APIs for your Rayvolution Pakistan project.

## 🎯 Features Implemented

1. **Weather API** - Real-time weather data for Pakistan cities
2. **AI Chatbot API** - Intelligent energy advisor using Groq/OpenAI
3. **Energy Data API** - Energy metrics and statistics

## 📋 Prerequisites

- Node.js 18+ installed
- Free API keys from the services below

## 🔑 Getting Free API Keys

### 1. OpenWeatherMap (Weather Data)

**Steps:**
1. Visit [https://openweathermap.org/api](https://openweathermap.org/api)
2. Click "Sign Up" (top right)
3. Create a free account
4. Go to "API keys" tab
5. Copy your API key
6. **Free Tier:** 60 calls/minute, 1,000,000 calls/month

### 2. Groq (AI Chatbot) - RECOMMENDED

**Steps:**
1. Visit [https://console.groq.com](https://console.groq.com)
2. Sign up with Google/GitHub
3. Go to "API Keys"
4. Create new API key
5. Copy your key
6. **Free Tier:** Very generous, fast LLaMA models, no credit card required

### 3. Alternative: OpenAI (Optional)

**Steps:**
1. Visit [https://platform.openai.com](https://platform.openai.com)
2. Sign up
3. Go to "API keys"
4. Create new key
5. **Note:** Requires credit card, paid service ($5 free credit for new users)

## ⚙️ Setup Instructions

### Step 1: Configure Environment Variables

1. Copy the `.env.example` file:
```bash
cp .env.example .env.local
```

2. Open `.env.local` and add your API keys:

```env
# Required: Weather API
NEXT_PUBLIC_WEATHER_API_KEY=your_openweathermap_api_key_here

# Required: AI Chatbot (choose one)
GROQ_API_KEY=your_groq_api_key_here
# OR
# OPENAI_API_KEY=your_openai_api_key_here

# App URL (already configured)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 2: Restart Development Server

```bash
npm run dev
```

## 🚀 API Endpoints

### 1. Weather API
```
GET /api/weather?city=Lahore
```

**Response:**
```json
{
  "city": "Lahore",
  "current": {
    "temp": 28,
    "humidity": 65,
    "clouds": 20,
    "sunlightHours": "8.5",
    "solarEfficiency": 92
  },
  "forecast": [...]
}
```

**Supported Cities:**
- Karachi, Lahore, Islamabad, Peshawar, Quetta, Multan, Rawalpindi, Hyderabad

### 2. AI Chatbot API
```
POST /api/chat
Content-Type: application/json

{
  "message": "How can I save energy?"
}
```

**Response:**
```json
{
  "response": "💡 Energy Saving Tips:...",
  "source": "groq",
  "model": "llama-3.3-70b-versatile"
}
```

### 3. Energy Data API
```
GET /api/energy?type=national
GET /api/energy?city=Lahore
GET /api/energy?type=cities
```

**Response:**
```json
{
  "national": {
    "totalUsers": 1925,
    "avgAdoptionRate": 43,
    "totalEnergySaved": 25425,
    ...
  }
}
```

## 🧪 Testing the APIs

### Test Weather API
```bash
curl http://localhost:3000/api/weather?city=Lahore
```

### Test AI Chat API
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Tell me about solar energy in Pakistan"}'
```

### Test Energy Data API
```bash
curl http://localhost:3000/api/energy?type=national
```

## 💡 Features

### Weather API Features:
- Real-time weather data for Pakistan cities
- 7-day forecast
- Automatic sunlight hours calculation
- Solar efficiency predictions
- Cloud coverage analysis

### AI Chatbot Features:
- Context-aware responses
- Pakistan-specific energy advice
- Groq (fast, free) or OpenAI integration
- Fallback to local responses if API unavailable
- Smart suggestions for:
  - Energy saving tips
  - Weather forecasts
  - Sustainability scores
  - GreenCoins guidance
  - City performance
  - Marketplace advice

### Energy Data Features:
- City-wise energy metrics
- National statistics
- Adoption rates
- CO₂ reduction tracking
- User growth analytics

## 🔄 API Integration Status

✅ **Backend APIs Created:**
- `/api/weather` - Weather & solar forecast
- `/api/chat` - AI energy advisor
- `/api/energy` - Energy statistics

✅ **Frontend Integration:**
- AI Chatbot component connected to real API
- Fallback responses if API unavailable
- Error handling implemented

## 🎨 Frontend Components Using APIs

### 1. AI Chatbot (`components/ai-chatbot.tsx`)
- ✅ Now uses `/api/chat` endpoint
- ✅ Real AI responses via Groq
- ✅ Fallback to local responses on error

### 2. Weather Indicator (`components/weather-indicator.tsx`)
- Can be connected to `/api/weather`
- Shows real-time weather data

### 3. AI Prediction Page (`app/ai-prediction/page.tsx`)
- Can fetch 7-day forecast from `/api/weather`

## 🛠️ Troubleshooting

### Issue: "API key not configured"
**Solution:** Make sure you've added API keys to `.env.local` and restarted the dev server.

### Issue: Chat not working
**Solution:**
1. Check if GROQ_API_KEY is set in `.env.local`
2. The chatbot will use fallback responses if API is unavailable
3. Check browser console for errors

### Issue: Weather data not loading
**Solution:**
1. Verify NEXT_PUBLIC_WEATHER_API_KEY is set
2. Check if your API key is active on OpenWeatherMap
3. Free tier has rate limits (60 calls/minute)

## 📊 API Costs

| Service | Free Tier | Cost After Free |
|---------|-----------|----------------|
| OpenWeatherMap | 1M calls/month | $0.0015/call |
| Groq | Very generous | Currently free |
| OpenAI | $5 credit | ~$0.002/1K tokens |

## 🔐 Security Notes

1. ✅ `.env.local` is in `.gitignore` - your keys are safe
2. ✅ API keys are not exposed to the frontend (except NEXT_PUBLIC_*)
3. ✅ Server-side API routes for sensitive operations
4. ⚠️ Never commit `.env.local` to GitHub

## 📝 Next Steps

1. Get your free API keys
2. Add them to `.env.local`
3. Restart the dev server
4. Test the chatbot - it should now use real AI!
5. Test weather API in browser DevTools

## 🎉 That's It!

Your Rayvolution Pakistan project now has a fully functional backend with real APIs!

**Questions?** Check the console logs for debugging information.
