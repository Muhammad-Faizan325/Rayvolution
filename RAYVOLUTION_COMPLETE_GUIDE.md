# 🌞 Rayvolution Pakistan - Complete Implementation Guide

## Project Overview

**Rayvolution Pakistan** is a full-stack AI-powered Solar Energy Awareness and Monitoring Platform designed for all Pakistani users (homeowners, businesses, and institutions).

### Key Features
✅ Solar Energy Calculator with detailed projections
✅ Real-time Weather & Sunlight Prediction
✅ AI-Powered Energy Advisor (Rule-based)
✅ User Authentication & Profiles
✅ Sindh Province Energy Map
✅ Power Outage Tracking
✅ Eco-Challenges & Gamification
✅ Admin Analytics Dashboard
✅ Sustainability Scoring

---

## 🧰 Tech Stack

### Frontend
- Next.js 15 + TypeScript
- Tailwind CSS + Framer Motion
- Recharts for visualizations
- Axios for API calls

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs for password hashing
- OpenWeatherMap API integration

### Deployment
- Frontend: Vercel
- Backend: Render / Railway / Heroku
- Database: MongoDB Atlas

---

## 📦 Installation & Setup

### 1. Prerequisites
```bash
# Install Node.js (v18+)
node --version

# Install MongoDB or use MongoDB Atlas
mongod --version
```

### 2. Clone & Install

```bash
# Navigate to project
cd Rayvolution

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies (if needed)
cd ..
npm install
```

### 3. Configure Environment Variables

#### Backend `.env` file
```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/rayvolution
# Or MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rayvolution

# Authentication
JWT_SECRET=rayvolution-super-secret-key-change-in-production
JWT_REFRESH_SECRET=rayvolution-refresh-secret-change-in-production
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d

# CORS
FRONTEND_URL=http://localhost:3000

# Weather API
WEATHER_API_KEY=your_openweathermap_api_key
# Get free API key from: https://openweathermap.org/api

# Optional: Groq AI for advanced chatbot
GROQ_API_KEY=your_groq_api_key
```

#### Frontend `.env.local` file
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_WEATHER_API_KEY=your_openweathermap_api_key
```

### 4. Seed the Database

```bash
cd backend

# Seed basic data (users, cities, challenges)
npm run seed

# Seed Sindh districts and outages
npm run seed:sindh
```

### 5. Start Development Servers

```bash
# Terminal 1 - Backend
cd backend
npm run dev
# Server runs on http://localhost:5000

# Terminal 2 - Frontend
cd ..
npm run dev
# Frontend runs on http://localhost:3000
```

---

## 🔌 API Endpoints Reference

### Base URL
```
Local: http://localhost:5000/api
Production: https://your-backend.onrender.com/api
```

### 🔐 Authentication

#### Register User
```http
POST /api/auth/signup
Content-Type: application/json

{
  "name": "Ahmed Khan",
  "email": "ahmed@example.com",
  "password": "password123",
  "city": "Lahore",
  "phone": "+92-300-1234567"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "ahmed@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "user": { ...user data },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

### 🧮 Solar Calculator

#### Calculate Solar Energy
```http
POST /api/calculate
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "panelCapacity": 5,
  "sunlightHours": 6,
  "efficiency": 0.8,
  "city": "Lahore",
  "systemType": "grid-tied"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "calculation": {
      "_id": "...",
      "energyPerDay": 24,
      "energyPerMonth": 720,
      "energyPerYear": 8640,
      "costSavingPKR": 432,
      "costSavingPerMonth": 12960,
      "costSavingPerYear": 155520,
      "co2ReducedKG": 20.4,
      "co2ReducedPerMonth": 612,
      "co2ReducedPerYear": 7344,
      "treesEquivalent": 350
    }
  }
}
```

#### Get Solar Recommendation
```http
POST /api/calculate/recommend
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "monthlyBill": 15000,
  "city": "Karachi",
  "roofArea": 100
}
```

Response includes:
- Recommended system size
- Number of panels needed
- Estimated cost
- Payback period
- Projected savings

#### Compare Different Setups
```http
POST /api/calculate/compare
Content-Type: application/json

{
  "city": "Lahore",
  "sunlightHours": 8.5
}
```

Returns comparison of 3kW, 5kW, 10kW, 15kW, and 25kW systems.

### ☀️ Weather & Sunlight Prediction

#### Get Weather Forecast
```http
GET /api/weather/Lahore
```

Response:
```json
{
  "success": true,
  "data": {
    "city": "Lahore",
    "current": {
      "temperature": 28,
      "humidity": 60,
      "sunlightEfficiency": "85%",
      "condition": "Clear"
    },
    "forecast": [
      {
        "day": "Tomorrow",
        "sunlightEfficiency": "92%",
        "sunlightHours": 8.3,
        "temperature": 30,
        "advice": "Excellent day for solar generation! ⚡"
      }
    ]
  }
}
```

#### Get Sunlight Prediction
```http
GET /api/weather/Karachi/sunlight
```

Returns 7-day sunlight forecast with percentages and ratings.

#### Get Supported Cities
```http
GET /api/weather/cities
```

Returns list of 10 major Pakistani cities.

### 🤖 AI Energy Advisor

#### Get AI Advice
```http
POST /api/advisor
Content-Type: application/json

{
  "query": "How much can I save with solar?",
  "userId": "optional_user_id"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "query": "How much can I save with solar?",
    "reply": "Based on a typical 5kW solar setup in Pakistan, you can save approximately Rs. 13,000-15,000 per month on electricity bills!",
    "suggestions": [
      "What size solar system do I need?",
      "How does net metering work?",
      "Tell me about solar panel efficiency"
    ]
  }
}
```

#### Get Quick Tips
```http
GET /api/advisor/tips
```

Returns 5 random solar energy tips.

#### Get Conversation Starters
```http
GET /api/advisor/starters
```

Returns 6 suggested questions for the AI advisor.

### 🗺️ Sindh Province Map

#### Get All Districts
```http
GET /api/sindh/districts
```

Returns all 29 Sindh districts with outage and solar data.

#### Get Map Data
```http
GET /api/sindh/map-data
```

Optimized endpoint for map rendering with:
- District summaries
- Active outages
- Province-wide statistics

#### Get Sindh Statistics
```http
GET /api/sindh/stats
```

Comprehensive province statistics including:
- Total population & users
- Solar adoption metrics
- Outage statistics
- Top solar districts
- Most affected districts

#### Report Power Outage
```http
POST /api/sindh/outages
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "districtName": "Karachi Central",
  "area": "Nazimabad",
  "type": "unscheduled",
  "severity": "high",
  "affectedHouseholds": 5000,
  "affectedPopulation": 25000,
  "cause": "technical_fault",
  "description": "Complete power failure since 2 hours"
}
```

---

## 💻 Frontend Integration Examples

### 1. Authentication Flow

```typescript
// lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = {
  auth: {
    signup: async (userData) => {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      return response.json();
    },

    login: async (email, password) => {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });
      return response.json();
    }
  }
};

// Usage in component
const handleLogin = async (e) => {
  e.preventDefault();
  const result = await api.auth.login(email, password);

  if (result.success) {
    localStorage.setItem('token', result.data.accessToken);
    localStorage.setItem('user', JSON.stringify(result.data.user));
    router.push('/dashboard');
  }
};
```

### 2. Solar Calculator Integration

```typescript
// app/calculator/page.tsx
import { useState } from 'react';

const SolarCalculator = () => {
  const [results, setResults] = useState(null);

  const calculateSolar = async () => {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_URL}/calculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        panelCapacity: 5,
        sunlightHours: 8,
        efficiency: 0.8,
        city: 'Lahore'
      })
    });

    const data = await response.json();
    if (data.success) {
      setResults(data.data.calculation);
    }
  };

  return (
    <div>
      <button onClick={calculateSolar}>Calculate</button>
      {results && (
        <div>
          <h3>Your Solar Projections</h3>
          <p>Daily Energy: {results.energyPerDay} kWh</p>
          <p>Monthly Savings: Rs. {results.costSavingPerMonth.toLocaleString()}</p>
          <p>Yearly Savings: Rs. {results.costSavingPerYear.toLocaleString()}</p>
          <p>CO₂ Reduced: {results.co2ReducedPerYear} kg/year</p>
          <p>Trees Equivalent: {results.treesEquivalent} trees</p>
        </div>
      )}
    </div>
  );
};
```

### 3. Weather Integration

```typescript
// components/WeatherWidget.tsx
const WeatherWidget = ({ city }) => {
  const [forecast, setForecast] = useState(null);

  useEffect(() => {
    fetchWeather();
  }, [city]);

  const fetchWeather = async () => {
    const response = await fetch(`${API_URL}/weather/${city}`);
    const data = await response.json();

    if (data.success) {
      setForecast(data.data);
    }
  };

  return (
    <div className="weather-widget">
      {forecast && (
        <>
          <h3>☀️ Sunlight Forecast for {city}</h3>
          <div className="current">
            <p>Current: {forecast.current.sunlightEfficiency} efficiency</p>
            <p>{forecast.current.temperature}°C</p>
          </div>
          <div className="forecast">
            {forecast.forecast.map((day, index) => (
              <div key={index}>
                <p>{day.day}</p>
                <p>{day.sunlightEfficiency}</p>
                <p>{day.advice}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
```

### 4. AI Advisor Integration

```typescript
// app/advisor/page.tsx
const AIAdvisor = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    const userMessage = { role: 'user', text: input };
    setMessages([...messages, userMessage]);

    const response = await fetch(`${API_URL}/advisor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: input })
    });

    const data = await response.json();
    if (data.success) {
      const aiMessage = { role: 'assistant', text: data.data.reply };
      setMessages(prev => [...prev, aiMessage]);
    }

    setInput('');
  };

  return (
    <div className="chat-interface">
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={msg.role}>
            {msg.text}
          </div>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
      />
    </div>
  );
};
```

---

## 🚀 Deployment Guide

### Deploy Backend to Render

1. **Create Render Account**: https://render.com

2. **Create New Web Service**
   - Connect GitHub repository
   - Select `backend` folder as root directory
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Add Environment Variables**:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Strong random string
   - `JWT_REFRESH_SECRET`: Another strong random string
   - `WEATHER_API_KEY`: OpenWeatherMap API key
   - `FRONTEND_URL`: Your Vercel URL
   - `NODE_ENV`: production

4. **Deploy** - Render will auto-deploy

Your backend URL: `https://rayvolution-backend.onrender.com`

### Deploy Frontend to Vercel

1. **Install Vercel CLI**:
```bash
npm install -g vercel
```

2. **Update `.env.local`**:
```env
NEXT_PUBLIC_API_URL=https://rayvolution-backend.onrender.com/api
NEXT_PUBLIC_WEATHER_API_KEY=your_api_key
```

3. **Deploy**:
```bash
vercel --prod
```

Your frontend URL: `https://rayvolution.vercel.app`

### Setup MongoDB Atlas

1. **Create Account**: https://mongodb.com/cloud/atlas

2. **Create Cluster** (Free tier available)

3. **Create Database User** with password

4. **Whitelist IP**: Add `0.0.0.0/0` for production

5. **Get Connection String**:
```
mongodb+srv://username:password@cluster.mongodb.net/rayvolution
```

6. **Add to Environment Variables** in Render

---

## 📊 Key Formulas & Calculations

### Solar Energy Generation
```javascript
energyPerDay = panelCapacity (kW) × sunlightHours × efficiency
energyPerMonth = energyPerDay × 30
energyPerYear = energyPerDay × 365
```

### Cost Savings
```javascript
costSavingPKR = energyPerDay × electricityRate (Rs. 18/kWh)
costSavingPerMonth = energyPerMonth × electricityRate
costSavingPerYear = energyPerYear × electricityRate
```

### CO₂ Reduction
```javascript
co2ReducedKG = energyPerDay × carbonIntensity (0.85 kg/kWh)
treesEquivalent = co2ReducedPerYear / 21 (kg CO₂ per tree per year)
```

### Sustainability Score
```javascript
score = ((energySaved / 1000) * 30 +
         (co2Reduced / 500) * 30 +
         (streak * 2) +
         (achievements.length * 5))
// Max score: 100
```

### System Sizing
```javascript
requiredCapacity = dailyConsumption / (sunlightHours × efficiency)
numberOfPanels = (capacity × 1000) / panelWattage (350W typical)
roofArea = numberOfPanels × 2 (m² per panel)
```

---

## 🎯 Testing Checklist

### Backend Testing
- [ ] Health check: `http://localhost:5000/health`
- [ ] User registration & login
- [ ] Solar calculator returns correct results
- [ ] Weather forecast fetches data
- [ ] AI advisor responds correctly
- [ ] Sindh map data loads
- [ ] Admin analytics work
- [ ] JWT authentication protects routes

### Frontend Testing
- [ ] Landing page loads
- [ ] User can register/login
- [ ] Calculator shows results
- [ ] Weather widget displays forecast
- [ ] AI chatbot responds
- [ ] Sindh map renders districts
- [ ] Dashboard shows user data
- [ ] Admin panel accessible for admins

---

## 🏆 Project Features Summary

### Core Features
1. ✅ **Solar Calculator** - Calculate energy generation, savings, and CO₂ reduction
2. ✅ **Weather Integration** - 7-day sunlight forecast for 10 Pakistani cities
3. ✅ **AI Advisor** - Rule-based chatbot with 11 categories of responses
4. ✅ **Authentication** - JWT-based secure login system
5. ✅ **User Dashboard** - Personalized energy tracking and statistics
6. ✅ **Sindh Map** - 29 districts with outage and solar data
7. ✅ **Challenges** - Gamification with GreenCoins rewards
8. ✅ **Admin Panel** - Comprehensive analytics and management

### Advanced Features
- System recommendation based on electricity bills
- Multiple setup comparisons
- Calculation history tracking
- Quick tips and conversation starters
- Power outage reporting and tracking
- Community engagement (upvotes, comments)
- Province-wide statistics
- Leaderboards and rankings

---

## 📚 Additional Resources

### API Documentation
- Full API reference: `/backend/API_DOCUMENTATION.md`
- Calculator guide: `/RAYVOLUTION_COMPLETE_GUIDE.md` (this file)

### Setup Guides
- Backend setup: `/BACKEND_SETUP_GUIDE.md`
- Quick start: `/QUICK_START.md`
- Sindh map: `/SINDH_MAP_UPDATE.md`

### Architecture
- System design: `/ARCHITECTURE.md`
- Database models: `/backend/src/models/`

---

## 🐛 Common Issues & Solutions

### Issue: Weather API returns 401
**Solution**: Check `WEATHER_API_KEY` in `.env` file. Get free key from openweathermap.org

### Issue: Calculator returns NaN
**Solution**: Ensure all inputs are numbers and within valid ranges

### Issue: Can't login after deployment
**Solution**: Update `FRONTEND_URL` in backend env vars to match your Vercel URL

### Issue: MongoDB connection failed
**Solution**: Whitelist IP address in MongoDB Atlas and check connection string

---

## 🎉 Success Metrics

After successful deployment, you should have:
- ✅ 50+ API endpoints
- ✅ 10 database models
- ✅ Solar calculator with accurate PKR calculations
- ✅ Real-time weather data for 10 cities
- ✅ AI advisor with 100+ responses
- ✅ 29 Sindh districts mapped
- ✅ Complete authentication system
- ✅ Admin analytics dashboard
- ✅ Fully responsive UI
- ✅ Production-ready deployment

---

## 🚀 Next Steps

1. ✅ Complete backend development
2. ✅ Integrate all APIs with frontend
3. ⬜ Add custom weather predictions
4. ⬜ Enhance AI advisor with ML
5. ⬜ Add real map visualization (Leaflet)
6. ⬜ Implement real-time notifications
7. ⬜ Create mobile app version
8. ⬜ Add payment integration for installations

---

**Rayvolution Pakistan** is now ready to empower every Pakistani with solar energy knowledge and tools! 🌞🇵🇰

For support, check the documentation or create an issue in the repository.
