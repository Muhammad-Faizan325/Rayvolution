# Rayvolution Backend Setup Guide

## Quick Start Guide

Follow these steps to get your backend up and running:

### Step 1: Install MongoDB

**Option A: Local MongoDB (Recommended for Development)**

1. Download MongoDB from: https://www.mongodb.com/try/download/community
2. Install MongoDB
3. Start MongoDB service:
   - Windows: MongoDB should start automatically as a service
   - Mac: `brew services start mongodb-community`
   - Linux: `sudo systemctl start mongod`

**Option B: MongoDB Atlas (Cloud - Free Tier Available)**

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a new cluster (free tier)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Update `MONGODB_URI` in `backend/.env` file with your connection string

### Step 2: Install Backend Dependencies

Open terminal in the backend folder:

```bash
cd backend
npm install
```

This will install all required packages:
- express
- mongoose
- bcryptjs
- jsonwebtoken
- cors
- helmet
- and more...

### Step 3: Configure Environment Variables

The `.env` file has been created for you in `backend/.env`

**Important:** Update these values:

1. **MongoDB URI**: If using local MongoDB, keep as is. If using Atlas, replace with your connection string.
2. **JWT Secrets**: For production, generate strong random strings
3. **API Keys** (optional): Add if you want weather and AI chat features

### Step 4: Seed the Database

Populate the database with initial data (cities, challenges, admin user):

```bash
npm run seed
```

This creates:
- 8 Pakistan cities with data
- 5 sample challenges
- Admin account: `admin@rayvolution.com` / `admin123`
- Sample user: `user@example.com` / `password123`

### Step 5: Start the Backend Server

```bash
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
🚀 Server running on port 5000 in development mode
```

### Step 6: Test the API

Open your browser or Postman and visit:
- Health Check: http://localhost:5000/health
- Should return: `{"status":"OK","message":"Rayvolution API is running"}`

## Common Issues & Solutions

### Issue: MongoDB Connection Error

**Error:** `MongoServerError: connect ECONNREFUSED`

**Solution:**
1. Make sure MongoDB is running
2. Check if `MONGODB_URI` in `.env` is correct
3. For local MongoDB, try: `mongodb://127.0.0.1:27017/rayvolution`

### Issue: Port Already in Use

**Error:** `EADDRINUSE: address already in use :::5000`

**Solution:**
1. Change `PORT=5000` to `PORT=5001` in `.env` file
2. Or kill the process using port 5000

Windows:
```bash
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F
```

### Issue: npm install fails

**Solution:**
1. Delete `node_modules` folder
2. Delete `package-lock.json`
3. Run `npm install` again

## API Testing

### Using Postman

1. Download Postman: https://www.postman.com/downloads/
2. Import the API endpoints
3. Test endpoints like:

**Register User:**
```
POST http://localhost:5000/api/auth/signup
Body (JSON):
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "city": "Karachi"
}
```

**Login:**
```
POST http://localhost:5000/api/auth/login
Body (JSON):
{
  "email": "test@example.com",
  "password": "password123"
}
```

### Using VS Code REST Client

Install "REST Client" extension and create `test.http` file:

```http
### Health Check
GET http://localhost:5000/health

### Register
POST http://localhost:5000/api/auth/signup
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "city": "Karachi"
}

### Login
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@rayvolution.com",
  "password": "admin123"
}
```

## Connecting to Frontend

Update your Next.js app to use this backend:

1. Create an API service file in your frontend:

```typescript
// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = {
  auth: {
    signup: (data) => fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),
    login: (data) => fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data)
    })
  }
  // ... more endpoints
}
```

2. Add to your `.env.local` in Next.js:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Database Management

### View Database with MongoDB Compass

1. Download: https://www.mongodb.com/products/compass
2. Connect using: `mongodb://localhost:27017`
3. Browse the `rayvolution` database

### Useful MongoDB Commands

View all users:
```javascript
db.users.find()
```

View all challenges:
```javascript
db.challenges.find()
```

Clear all data:
```javascript
db.users.deleteMany({})
db.energies.deleteMany({})
// etc...
```

## Production Deployment

### Environment Variables for Production

Update `.env` for production:
```env
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=use-a-strong-random-secret-here
FRONTEND_URL=https://your-frontend-domain.com
```

### Deploy to Vercel/Railway/Heroku

1. Push code to GitHub
2. Connect your repository
3. Add environment variables
4. Deploy!

### Deploy to VPS (DigitalOcean, AWS, etc.)

1. SSH into your server
2. Install Node.js and MongoDB
3. Clone your repository
4. Install PM2: `npm install -g pm2`
5. Start server: `pm2 start src/server.js --name rayvolution-api`
6. Set up Nginx reverse proxy

## Next Steps

1. ✅ Backend is running
2. Update your Next.js frontend to use these API endpoints
3. Remove the old localStorage-based authentication
4. Connect all features to the backend
5. Test thoroughly
6. Deploy to production

## Support

If you encounter any issues:
1. Check the console logs
2. Verify MongoDB is running
3. Check `.env` configuration
4. Review the README.md for API documentation

## Folder Structure

```
backend/
├── src/
│   ├── controllers/      # Request handlers
│   ├── models/          # Database schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Auth, validation
│   ├── utils/           # Helper functions
│   ├── scripts/         # Database seeding
│   └── server.js        # Main server file
├── .env                 # Environment variables
├── .gitignore
├── package.json
├── nodemon.json
└── README.md
```

Happy coding! 🚀
