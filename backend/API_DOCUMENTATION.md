# Rayvolution API Documentation

Complete API reference for the Rayvolution backend.

Base URL: `http://localhost:5000/api`

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

Or as a cookie (automatically set after login).

---

## 1. Authentication Endpoints

### 1.1 Register User

**Endpoint:** `POST /auth/signup`

**Description:** Register a new user account

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+92-300-1234567",
  "city": "Karachi",
  "solarPanels": true,
  "energyGoal": "medium"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "stats": { ... }
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

### 1.2 Login

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### 1.3 Logout

**Endpoint:** `POST /auth/logout`

**Auth Required:** Yes

### 1.4 Refresh Token

**Endpoint:** `POST /auth/refresh`

**Request Body:**
```json
{
  "refreshToken": "eyJhbGc..."
}
```

### 1.5 Get Current User

**Endpoint:** `GET /auth/me`

**Auth Required:** Yes

---

## 2. User Endpoints

### 2.1 Get User by ID

**Endpoint:** `GET /users/:id`

**Example:** `GET /users/507f1f77bcf86cd799439011`

### 2.2 Update User Profile

**Endpoint:** `PUT /users/:id`

**Auth Required:** Yes (own profile or admin)

**Request Body:**
```json
{
  "name": "John Updated",
  "phone": "+92-321-9876543",
  "city": "Lahore",
  "solarPanels": true,
  "energyGoal": "high"
}
```

### 2.3 Update User Stats

**Endpoint:** `PUT /users/:id/stats`

**Auth Required:** Yes (own profile)

**Request Body:**
```json
{
  "energySaved": 50,
  "co2Reduced": 25,
  "greenCoins": 100,
  "energyTokens": 10
}
```

### 2.4 Add Achievement

**Endpoint:** `POST /users/:id/achievements`

**Auth Required:** Yes (own profile)

**Request Body:**
```json
{
  "achievement": "solar_adopter"
}
```

**Available Achievements:**
- `first_login`
- `week_streak`
- `month_streak`
- `solar_adopter`
- `energy_saver`
- `community_helper`
- `marketplace_trader`
- `challenge_master`
- `eco_warrior`

### 2.5 Update Streak

**Endpoint:** `POST /users/:id/streak`

**Auth Required:** Yes (own profile)

---

## 3. Energy Endpoints

### 3.1 Record Energy Data

**Endpoint:** `POST /energy`

**Auth Required:** Yes

**Request Body:**
```json
{
  "city": "Karachi",
  "type": "savings",
  "amount": 50.5,
  "source": "solar",
  "metadata": {
    "temperature": 32,
    "sunlightHours": 9,
    "weatherCondition": "sunny",
    "panelEfficiency": 85
  }
}
```

**Energy Types:**
- `usage` - Energy consumed
- `savings` - Energy saved
- `production` - Energy produced

**Energy Sources:**
- `solar`
- `grid`
- `hybrid`
- `other`

### 3.2 Get User Energy History

**Endpoint:** `GET /energy/user/:userId`

**Auth Required:** Yes

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 50)
- `type` - Filter by type (usage/savings/production)
- `startDate` - Filter from date (ISO format)
- `endDate` - Filter to date (ISO format)

**Example:** `GET /energy/user/123?page=1&limit=20&type=savings`

### 3.3 Get All Cities

**Endpoint:** `GET /energy/cities`

**Response:**
```json
{
  "success": true,
  "data": {
    "cities": [
      {
        "name": "Karachi",
        "adoptionRate": 28,
        "sunlightHours": 9.5,
        "powerShortage": 6,
        "totalUsers": 150,
        "solarUsers": 42,
        "totalEnergySaved": 5000,
        "totalCO2Reduced": 2500
      }
    ]
  }
}
```

### 3.4 Get City by Name

**Endpoint:** `GET /energy/cities/:name`

**Example:** `GET /energy/cities/Karachi`

### 3.5 Get National Statistics

**Endpoint:** `GET /energy/national`

### 3.6 Get Energy Trends

**Endpoint:** `GET /energy/trends`

**Query Parameters:**
- `city` - Filter by city
- `days` - Number of days (default: 30)

---

## 4. Statistics Endpoints

### 4.1 Get User Statistics

**Endpoint:** `GET /stats/user/:userId`

### 4.2 Get Global Leaderboard

**Endpoint:** `GET /stats/leaderboard`

**Query Parameters:**
- `sortBy` - Sort field (sustainabilityScore/energySaved/co2Reduced/greenCoins/streak)
- `limit` - Number of results (default: 50)

### 4.3 Get City Leaderboard

**Endpoint:** `GET /stats/leaderboard/city/:cityName`

**Query Parameters:**
- `sortBy` - Sort field
- `limit` - Number of results

### 4.4 Get User Rank

**Endpoint:** `GET /stats/rank/:userId`

**Response:**
```json
{
  "success": true,
  "data": {
    "globalRank": 42,
    "cityRank": 8,
    "sustainabilityScore": 75
  }
}
```

---

## 5. Challenge Endpoints

### 5.1 Get All Challenges

**Endpoint:** `GET /challenges`

**Query Parameters:**
- `type` - daily/weekly/monthly/special
- `category` - energy_saving/community/education/marketplace/streak
- `difficulty` - easy/medium/hard

### 5.2 Get Challenge by ID

**Endpoint:** `GET /challenges/:id`

### 5.3 Get User's Challenges

**Endpoint:** `GET /challenges/user/:userId`

**Auth Required:** Yes

**Query Parameters:**
- `status` - completed/active

### 5.4 Join Challenge

**Endpoint:** `POST /challenges/:id/join`

**Auth Required:** Yes

### 5.5 Update Challenge Progress

**Endpoint:** `PUT /challenges/:id/progress`

**Auth Required:** Yes

**Request Body:**
```json
{
  "progress": 25
}
```

### 5.6 Create Challenge (Admin)

**Endpoint:** `POST /challenges`

**Auth Required:** Yes (admin only)

**Request Body:**
```json
{
  "title": "Energy Saver Pro",
  "description": "Save 100 kWh this week",
  "type": "weekly",
  "category": "energy_saving",
  "target": 100,
  "unit": "kWh",
  "reward": {
    "greenCoins": 200,
    "energyTokens": 20,
    "achievement": "energy_saver"
  },
  "startDate": "2024-01-01T00:00:00Z",
  "endDate": "2024-01-07T23:59:59Z",
  "difficulty": "medium"
}
```

---

## 6. Marketplace Endpoints

### 6.1 Get All Listings

**Endpoint:** `GET /marketplace/listings`

**Query Parameters:**
- `type` - sell/donate
- `status` - active/sold/cancelled/donated
- `page` - Page number
- `limit` - Items per page

### 6.2 Get User's Listings

**Endpoint:** `GET /marketplace/user/:userId/listings`

**Auth Required:** Yes

### 6.3 Create Listing

**Endpoint:** `POST /marketplace/listings`

**Auth Required:** Yes

**Request Body (Sell):**
```json
{
  "type": "sell",
  "energyTokens": 50,
  "pricePerToken": 10,
  "description": "Selling excess solar energy tokens"
}
```

**Request Body (Donate):**
```json
{
  "type": "donate",
  "energyTokens": 20,
  "recipientCity": "Quetta",
  "description": "Donating to help energy-deficient region"
}
```

### 6.4 Purchase Listing

**Endpoint:** `POST /marketplace/listings/:id/purchase`

**Auth Required:** Yes

### 6.5 Donate Tokens

**Endpoint:** `POST /marketplace/donate`

**Auth Required:** Yes

**Request Body:**
```json
{
  "energyTokens": 25,
  "recipientCity": "Quetta",
  "description": "Helping my fellow citizens"
}
```

### 6.6 Cancel Listing

**Endpoint:** `DELETE /marketplace/listings/:id`

**Auth Required:** Yes (own listing)

### 6.7 Get Transaction History

**Endpoint:** `GET /marketplace/transactions`

**Auth Required:** Yes

**Query Parameters:**
- `page` - Page number
- `limit` - Items per page

---

## 7. Report Endpoints

### 7.1 Create Report

**Endpoint:** `POST /reports`

**Auth Required:** Yes

**Request Body:**
```json
{
  "type": "outage",
  "title": "Power outage in Gulshan-e-Iqbal",
  "description": "No power for 6 hours. Affecting 500+ homes.",
  "city": "Karachi",
  "severity": "high",
  "location": {
    "address": "Block 13, Gulshan-e-Iqbal",
    "coordinates": {
      "lat": 24.9247,
      "lng": 67.0926
    }
  },
  "metadata": {
    "outageDuration": 6,
    "affectedUsers": 500
  }
}
```

**Report Types:**
- `outage` - Power outage
- `solar_usage` - Solar usage report
- `suggestion` - Suggestion
- `issue` - Technical issue
- `feedback` - General feedback

**Severity Levels:**
- `low`
- `medium`
- `high`
- `critical`

### 7.2 Get User's Reports

**Endpoint:** `GET /reports/user/:userId`

**Auth Required:** Yes

**Query Parameters:**
- `page` - Page number
- `limit` - Items per page
- `status` - pending/reviewing/in_progress/resolved/closed
- `type` - Report type

### 7.3 Get Report by ID

**Endpoint:** `GET /reports/:id`

**Auth Required:** Yes

### 7.4 Update Report

**Endpoint:** `PUT /reports/:id`

**Auth Required:** Yes (own report or admin)

### 7.5 Add Comment

**Endpoint:** `POST /reports/:id/comments`

**Auth Required:** Yes

**Request Body:**
```json
{
  "text": "I'm experiencing the same issue in my area!"
}
```

### 7.6 Upvote Report

**Endpoint:** `POST /reports/:id/upvote`

**Auth Required:** Yes

### 7.7 Delete Report

**Endpoint:** `DELETE /reports/:id`

**Auth Required:** Yes (own report or admin)

---

## 8. Admin Endpoints

All admin endpoints require admin role.

### 8.1 Get System Analytics

**Endpoint:** `GET /admin/analytics`

**Auth Required:** Yes (admin)

**Response:**
```json
{
  "success": true,
  "data": {
    "users": {
      "total": 2847,
      "solarAdopters": 1195,
      "adoptionRate": "42.00",
      "newThisMonth": 247
    },
    "reports": {
      "total": 1580,
      "active": 247,
      "resolved": 1333,
      "avgResolutionTime": "2.4"
    },
    "energy": {
      "totalSaved": 125000,
      "totalCO2Reduced": 62500
    },
    "cities": [...],
    "challenges": {...},
    "marketplace": {...}
  }
}
```

### 8.2 Get All Reports (Admin)

**Endpoint:** `GET /admin/reports`

**Auth Required:** Yes (admin)

**Query Parameters:**
- `page` - Page number
- `limit` - Items per page
- `status` - Filter by status
- `type` - Filter by type
- `severity` - Filter by severity
- `city` - Filter by city

### 8.3 Update Report Status (Admin)

**Endpoint:** `PUT /admin/reports/:id/status`

**Auth Required:** Yes (admin)

**Request Body:**
```json
{
  "status": "resolved",
  "priority": 5,
  "assignedTo": "admin_user_id",
  "resolution": {
    "description": "Issue has been fixed. Power restored."
  }
}
```

### 8.4 Get All Users (Admin)

**Endpoint:** `GET /admin/users`

**Auth Required:** Yes (admin)

**Query Parameters:**
- `page` - Page number
- `limit` - Items per page
- `city` - Filter by city
- `solarPanels` - true/false
- `role` - user/admin

### 8.5 Update User Role (Admin)

**Endpoint:** `PUT /admin/users/:id/role`

**Auth Required:** Yes (admin)

**Request Body:**
```json
{
  "role": "admin"
}
```

### 8.6 Update City Data (Admin)

**Endpoint:** `PUT /admin/cities/:name`

**Auth Required:** Yes (admin)

**Request Body:**
```json
{
  "adoptionRate": 35,
  "sunlightHours": 9,
  "powerShortage": 5,
  "population": 16000000
}
```

### 8.7 Export Data (Admin)

**Endpoint:** `GET /admin/export/:type`

**Auth Required:** Yes (admin)

**Types:** `users` | `reports` | `energy` | `cities`

**Example:** `GET /admin/export/users`

---

## 9. Chat Endpoints

### 9.1 Send Message

**Endpoint:** `POST /chat`

**Auth Required:** Yes

**Request Body:**
```json
{
  "message": "How can I save more energy?"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Message sent successfully",
  "data": {
    "response": "Here are some energy saving tips: ..."
  }
}
```

### 9.2 Get Chat History

**Endpoint:** `GET /chat/history`

**Auth Required:** Yes

**Query Parameters:**
- `limit` - Number of messages (default: 50)

### 9.3 Clear Chat History

**Endpoint:** `DELETE /chat/history`

**Auth Required:** Yes

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (not logged in)
- `403` - Forbidden (no permission)
- `404` - Not Found
- `500` - Internal Server Error

---

## Rate Limiting

- 100 requests per 15 minutes per IP address
- Applies to all `/api/*` routes

---

## CORS

The API accepts requests from:
- `http://localhost:3000` (development)
- Your production frontend URL (configure in `.env`)

Credentials (cookies) are supported.

---

## Testing Tips

1. Use the admin account for testing admin features:
   - Email: `admin@rayvolution.com`
   - Password: `admin123`

2. Use the sample user for testing user features:
   - Email: `user@example.com`
   - Password: `password123`

3. After login, save the `accessToken` and include it in subsequent requests

4. Use tools like Postman, Insomnia, or Thunder Client for testing

---

## Need Help?

Check the README.md or open an issue in the repository.
