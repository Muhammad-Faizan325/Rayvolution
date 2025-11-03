# 🧪 Rayvolution API Test Collection

Quick reference for testing all API endpoints with example requests and expected responses.

## Base URL
```
Local: http://localhost:5000/api
Production: https://your-backend.onrender.com/api
```

---

## 1. Health Check

```bash
curl http://localhost:5000/health
```

Expected:
```json
{
  "status": "OK",
  "message": "Rayvolution API is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 2. Authentication

### Register New User
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ahmed Khan",
    "email": "ahmed@test.com",
    "password": "password123",
    "city": "Lahore",
    "phone": "+92-300-1234567",
    "solarPanels": true
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ahmed@test.com",
    "password": "password123"
  }'
```

Save the `accessToken` from response!

### Get Current User
```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 3. Solar Calculator

### Calculate Solar Energy
```bash
curl -X POST http://localhost:5000/api/calculate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "panelCapacity": 5,
    "sunlightHours": 8,
    "efficiency": 0.8,
    "city": "Lahore",
    "systemType": "grid-tied"
  }'
```

Expected Output:
```json
{
  "success": true,
  "message": "Solar energy calculated successfully",
  "data": {
    "calculation": {
      "energyPerDay": 32,
      "energyPerMonth": 960,
      "energyPerYear": 11680,
      "costSavingPKR": 576,
      "costSavingPerMonth": 17280,
      "costSavingPerYear": 207360,
      "co2ReducedKG": 27.2,
      "co2ReducedPerMonth": 816,
      "co2ReducedPerYear": 9928,
      "treesEquivalent": 473
    }
  }
}
```

### Get Recommendation Based on Bill
```bash
curl -X POST http://localhost:5000/api/calculate/recommend \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "monthlyBill": 15000,
    "city": "Karachi",
    "roofArea": 100
  }'
```

### Compare Multiple Setups
```bash
curl -X POST http://localhost:5000/api/calculate/compare \
  -H "Content-Type: application/json" \
  -d '{
    "city": "Lahore",
    "sunlightHours": 8.5
  }'
```

### Get Calculation History
```bash
curl http://localhost:5000/api/calculate/history?limit=10 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 4. Weather & Sunlight

### Get Weather Forecast
```bash
curl http://localhost:5000/api/weather/Lahore
```

### Get Sunlight Prediction
```bash
curl http://localhost:5000/api/weather/Karachi/sunlight
```

### Get Supported Cities
```bash
curl http://localhost:5000/api/weather/cities
```

Expected:
```json
{
  "success": true,
  "data": {
    "cities": [
      {"name": "Karachi", "coordinates": {"lat": 24.8607, "lon": 67.0011}},
      {"name": "Lahore", "coordinates": {"lat": 31.5497, "lon": 74.3436}},
      {"name": "Islamabad", "coordinates": {"lat": 33.6844, "lon": 73.0479}},
      ...
    ]
  }
}
```

---

## 5. AI Energy Advisor

### Get AI Advice
```bash
curl -X POST http://localhost:5000/api/advisor \
  -H "Content-Type: application/json" \
  -d '{
    "query": "How much can I save with solar panels?",
    "userId": "OPTIONAL_USER_ID"
  }'
```

### Get Quick Tips
```bash
curl http://localhost:5000/api/advisor/tips
```

### Get Conversation Starters
```bash
curl http://localhost:5000/api/advisor/starters
```

---

## 6. Sindh Province Map

### Get All Districts
```bash
curl http://localhost:5000/api/sindh/districts
```

### Get Specific District
```bash
curl http://localhost:5000/api/sindh/districts/Karachi%20Central
```

### Get Map Data (Optimized)
```bash
curl http://localhost:5000/api/sindh/map-data
```

### Get Province Statistics
```bash
curl http://localhost:5000/api/sindh/stats
```

Expected:
```json
{
  "success": true,
  "data": {
    "totalDistricts": 29,
    "totalPopulation": 45000000,
    "solar": {
      "totalSolarUsers": 52000,
      "averageAdoptionRate": 11.5,
      "co2SavedThisMonth": 125000
    },
    "outages": {
      "districtsAffected": 22,
      "averageDailyOutageHours": 7.5,
      "criticalDistricts": ["Tharparkar", "Badin"]
    }
  }
}
```

### Report Power Outage
```bash
curl -X POST http://localhost:5000/api/sindh/outages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "districtName": "Karachi Central",
    "area": "Nazimabad",
    "type": "unscheduled",
    "severity": "high",
    "affectedHouseholds": 5000,
    "affectedPopulation": 25000,
    "cause": "technical_fault",
    "description": "Power out since 2 hours"
  }'
```

### Get Active Outages
```bash
curl "http://localhost:5000/api/sindh/outages?status=ongoing&limit=20"
```

---

## 7. User Statistics

### Get User Stats
```bash
curl http://localhost:5000/api/stats/user/USER_ID
```

### Get Global Leaderboard
```bash
curl "http://localhost:5000/api/stats/leaderboard?sortBy=sustainabilityScore&limit=50"
```

### Get City Leaderboard
```bash
curl http://localhost:5000/api/stats/leaderboard/city/Karachi
```

### Get User Rank
```bash
curl http://localhost:5000/api/stats/rank/USER_ID
```

---

## 8. Challenges

### Get All Active Challenges
```bash
curl "http://localhost:5000/api/challenges?type=weekly"
```

### Join a Challenge
```bash
curl -X POST http://localhost:5000/api/challenges/CHALLENGE_ID/join \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update Challenge Progress
```bash
curl -X PUT http://localhost:5000/api/challenges/CHALLENGE_ID/progress \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "progress": 50
  }'
```

---

## 9. Reports

### Create Report
```bash
curl -X POST http://localhost:5000/api/reports \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "type": "outage",
    "title": "Power failure in DHA",
    "description": "Complete power failure since 3 hours",
    "city": "Karachi",
    "severity": "high"
  }'
```

### Get User Reports
```bash
curl "http://localhost:5000/api/reports/user/USER_ID?status=pending" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 10. Admin (Requires Admin Role)

### Get System Analytics
```bash
curl http://localhost:5000/api/admin/analytics \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### Get All Users
```bash
curl "http://localhost:5000/api/admin/users?page=1&limit=50" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### Get All Reports
```bash
curl "http://localhost:5000/api/admin/reports?status=pending" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

## Testing with Postman

### Import Collection

1. Open Postman
2. Click "Import"
3. Create new collection: "Rayvolution API"
4. Add requests from above

### Environment Variables

Create environment with:
```
base_url: http://localhost:5000/api
access_token: YOUR_TOKEN_HERE
user_id: YOUR_USER_ID
```

Use `{{base_url}}` and `{{access_token}}` in requests.

---

## Testing Workflow

### 1. Setup
```bash
# Start backend
cd backend
npm run dev

# Seed data
npm run seed
npm run seed:sindh
```

### 2. Test Authentication
1. Register user
2. Login
3. Save token
4. Test protected route

### 3. Test Calculator
1. Calculate solar energy
2. Get recommendation
3. Compare setups
4. Check history

### 4. Test Weather
1. Get forecast for 3 cities
2. Check sunlight predictions
3. Verify data accuracy

### 5. Test AI Advisor
1. Ask 5 different questions
2. Get tips
3. Try conversation starters

### 6. Test Sindh Map
1. Get all districts
2. Get specific district
3. Report outage
4. Check province stats

### 7. Test Admin (if admin)
1. View analytics
2. List users
3. Check reports
4. Update district data

---

## Expected Results

All endpoints should return:
- ✅ Status 200 for successful GET requests
- ✅ Status 201 for successful POST requests (creation)
- ✅ Status 400 for validation errors
- ✅ Status 401 for unauthorized requests
- ✅ Status 404 for not found
- ✅ Status 500 for server errors

Response format:
```json
{
  "success": true/false,
  "message": "Description",
  "data": { ... }
}
```

---

## Performance Benchmarks

Target response times:
- Authentication: < 500ms
- Calculator: < 200ms
- Weather API: < 2000ms (external API)
- AI Advisor: < 300ms
- Database queries: < 500ms

---

## Debugging Tips

### Check Backend Logs
```bash
# Backend terminal shows:
✅ MongoDB connected successfully
🚀 Server running on port 5000
```

### Test MongoDB Connection
```bash
# In MongoDB Compass
mongodb://localhost:27017/rayvolution
```

### Check Environment Variables
```bash
# In backend directory
cat .env
```

### Test with curl verbose
```bash
curl -v http://localhost:5000/health
```

---

## Quick Test Script

```bash
#!/bin/bash
# test-api.sh

BASE_URL="http://localhost:5000/api"

echo "Testing Rayvolution API..."

# Test 1: Health Check
echo "\n1. Health Check"
curl -s $BASE_URL/../health | jq .

# Test 2: Register User
echo "\n2. Register User"
curl -s -X POST $BASE_URL/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"test123","city":"Lahore"}' \
  | jq .

# Test 3: Weather
echo "\n3. Weather Forecast"
curl -s $BASE_URL/weather/Lahore | jq .current

# Test 4: AI Advisor
echo "\n4. AI Advisor"
curl -s -X POST $BASE_URL/advisor \
  -H "Content-Type: application/json" \
  -d '{"query":"How much can I save?"}' \
  | jq .data.reply

# Test 5: Sindh Stats
echo "\n5. Sindh Statistics"
curl -s $BASE_URL/sindh/stats | jq .data.totalDistricts

echo "\n✅ All tests completed!"
```

Run with: `bash test-api.sh`

---

Happy Testing! 🚀🧪
