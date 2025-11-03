# Rayvolution Backend API

Backend API server for Rayvolution - Solar Energy Management Platform for Pakistan.

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## Features

- User authentication with JWT
- Energy tracking and analytics
- Gamification system (challenges, achievements, streaks)
- Marketplace for energy token trading
- Reporting system for outages and issues
- Admin dashboard and analytics
- AI chatbot integration
- City-wise statistics
- Leaderboards

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Installation

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/rayvolution
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
FRONTEND_URL=http://localhost:3000
```

5. Seed the database (optional but recommended):
```bash
npm run seed
```

## Running the Server

Development mode (with auto-restart):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user profile
- `DELETE /api/users/:id` - Delete user
- `PUT /api/users/:id/stats` - Update user stats
- `POST /api/users/:id/achievements` - Add achievement
- `POST /api/users/:id/streak` - Update streak

### Energy
- `POST /api/energy` - Record energy data
- `GET /api/energy/user/:userId` - Get user energy history
- `GET /api/energy/cities` - Get all cities data
- `GET /api/energy/cities/:name` - Get specific city
- `GET /api/energy/national` - Get national statistics
- `GET /api/energy/trends` - Get energy trends

### Statistics
- `GET /api/stats/user/:userId` - Get user stats
- `GET /api/stats/leaderboard` - Get global leaderboard
- `GET /api/stats/leaderboard/city/:cityName` - Get city leaderboard
- `GET /api/stats/rank/:userId` - Get user rank

### Challenges
- `GET /api/challenges` - Get all active challenges
- `GET /api/challenges/:id` - Get challenge by ID
- `GET /api/challenges/user/:userId` - Get user's challenges
- `POST /api/challenges/:id/join` - Join a challenge
- `PUT /api/challenges/:id/progress` - Update progress
- `POST /api/challenges` - Create challenge (admin)
- `PUT /api/challenges/:id` - Update challenge (admin)
- `DELETE /api/challenges/:id` - Delete challenge (admin)

### Marketplace
- `GET /api/marketplace/listings` - Get all listings
- `GET /api/marketplace/user/:userId/listings` - Get user listings
- `POST /api/marketplace/listings` - Create listing
- `POST /api/marketplace/listings/:id/purchase` - Purchase listing
- `POST /api/marketplace/donate` - Donate tokens
- `DELETE /api/marketplace/listings/:id` - Cancel listing
- `GET /api/marketplace/transactions` - Get transaction history

### Reports
- `POST /api/reports` - Create report
- `GET /api/reports/user/:userId` - Get user reports
- `GET /api/reports/:id` - Get report by ID
- `PUT /api/reports/:id` - Update report
- `POST /api/reports/:id/comments` - Add comment
- `POST /api/reports/:id/upvote` - Upvote report
- `DELETE /api/reports/:id` - Delete report

### Admin
- `GET /api/admin/analytics` - Get system analytics
- `GET /api/admin/reports` - Get all reports
- `PUT /api/admin/reports/:id/status` - Update report status
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/role` - Update user role
- `PUT /api/admin/cities/:name` - Update city data
- `GET /api/admin/export/:type` - Export data

### Chat
- `POST /api/chat` - Send message to AI chatbot
- `GET /api/chat/history` - Get chat history
- `DELETE /api/chat/history` - Clear chat history

## Database Models

### User
- Personal info (name, email, password, phone, city)
- Solar adoption status
- Statistics (energy saved, CO2 reduced, coins, tokens, streak)
- Achievements
- Role (user/admin)

### Energy
- User energy records
- Type (usage, savings, production)
- Amount and source
- Metadata (weather, efficiency)

### CityData
- City statistics
- Adoption rates
- Energy metrics
- Population data

### Challenge
- Challenge details
- Rewards
- Type and difficulty
- Participants

### UserChallenge
- User progress
- Completion status

### MarketplaceListing
- Seller and buyer info
- Energy tokens
- Price and status

### Transaction
- Transaction history
- Types (purchase, sale, donation)

### Report
- User reports
- Status and priority
- Comments and upvotes
- Resolution tracking

### ChatMessage
- Chat history
- User and AI messages

## Default Users (After Seeding)

**Admin Account:**
- Email: `admin@rayvolution.com`
- Password: `admin123`

**Sample User:**
- Email: `user@example.com`
- Password: `password123`

## Security Features

- JWT authentication with refresh tokens
- Password hashing with bcrypt
- HTTP-only cookies
- CORS protection
- Rate limiting
- Input validation
- Helmet.js security headers

## Environment Variables

See `.env.example` for all available configuration options.

## Error Handling

All errors are returned in a consistent format:
```json
{
  "success": false,
  "message": "Error message",
  "errors": []
}
```

## Success Response

All successful responses follow this format:
```json
{
  "success": true,
  "message": "Success message",
  "data": {}
}
```

## MongoDB Setup

### Local MongoDB
1. Install MongoDB locally
2. Set `MONGODB_URI=mongodb://localhost:27017/rayvolution`

### MongoDB Atlas (Cloud)
1. Create account at mongodb.com
2. Create cluster
3. Get connection string
4. Set `MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rayvolution`

## Connecting Frontend

Update your Next.js frontend to point to this backend:
1. Set API base URL to `http://localhost:5000/api`
2. Update authentication to use JWT tokens
3. Use the provided endpoints for all features

## Development Tips

- Use Postman or Thunder Client to test endpoints
- Check logs for debugging
- Run `npm run seed` to reset database with sample data
- Use MongoDB Compass to view database

## License

MIT

## Support

For issues and questions, please open an issue in the repository.
