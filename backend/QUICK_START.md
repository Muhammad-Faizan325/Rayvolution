# Quick Start - Get Running in 5 Minutes!

## Prerequisites Check

Before starting, make sure you have:
- ✅ Node.js installed (v14 or higher) - Check with: `node --version`
- ✅ MongoDB installed and running - Check with: `mongod --version`

Don't have them? Quick install:
- Node.js: https://nodejs.org/ (download LTS version)
- MongoDB: https://www.mongodb.com/try/download/community

---

## 5-Minute Setup

### 1. Open Terminal in Backend Folder

```bash
cd backend
```

### 2. Install Dependencies (30 seconds)

```bash
npm install
```

Wait for all packages to download...

### 3. Start MongoDB (if not running)

**Windows:**
MongoDB should auto-start. If not:
```bash
net start MongoDB
```

**Mac:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

### 4. Seed Database (10 seconds)

```bash
npm run seed
```

You should see:
```
✅ Connected to MongoDB
✅ Seeded 8 cities
✅ Seeded 5 challenges
✅ Admin user created
✅ Sample user created
🎉 Database seeded successfully!
```

### 5. Start Server (5 seconds)

```bash
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
🚀 Server running on port 5000 in development mode
```

---

## Test It's Working

### Option 1: Browser

Open: http://localhost:5000/health

Should show:
```json
{"status":"OK","message":"Rayvolution API is running","timestamp":"..."}
```

### Option 2: Command Line

```bash
curl http://localhost:5000/health
```

---

## Login & Get Token

### Test Login with Admin Account

Using curl:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@rayvolution.com\",\"password\":\"admin123\"}"
```

Or using PowerShell (Windows):
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"email":"admin@rayvolution.com","password":"admin123"}'
```

You'll get back a token like:
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": { ... }
  }
}
```

---

## What's Next?

### 1. Install a REST Client (Choose One)

**Option A: Postman (Recommended)**
- Download: https://www.postman.com/downloads/
- Import the API endpoints from API_DOCUMENTATION.md
- Test all endpoints easily

**Option B: VS Code REST Client**
- Install "REST Client" extension in VS Code
- Create `test.http` file
- Add test requests

**Option C: Thunder Client (VS Code)**
- Install "Thunder Client" extension
- Visual Postman-like interface in VS Code

### 2. Test Some Endpoints

Try these:

**Get All Cities:**
```
GET http://localhost:5000/api/energy/cities
```

**Get Leaderboard:**
```
GET http://localhost:5000/api/stats/leaderboard
```

**Get Admin Analytics:**
```
GET http://localhost:5000/api/admin/analytics
Authorization: Bearer YOUR_TOKEN_HERE
```

### 3. Connect Your Frontend

Update your Next.js app:

1. Create `lib/api.ts`:
```typescript
const API_URL = 'http://localhost:5000/api';

export const login = async (email: string, password: string) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password })
  });
  return response.json();
};
```

2. Replace localStorage auth with backend auth

3. Update all API calls to use the backend

---

## Default Accounts

After seeding, you have these accounts:

**Admin Account:**
- Email: `admin@rayvolution.com`
- Password: `admin123`
- Role: Admin
- GreenCoins: 10,000
- All features unlocked

**Sample User:**
- Email: `user@example.com`
- Password: `password123`
- Role: User
- City: Karachi
- Has solar panels

---

## Common Commands

**Start Server (Development):**
```bash
npm run dev
```

**Start Server (Production):**
```bash
npm start
```

**Reset Database:**
```bash
npm run seed
```

**Stop Server:**
- Press `Ctrl + C` in terminal

---

## Troubleshooting

### Can't connect to MongoDB?

1. Check if MongoDB is running:
```bash
# Windows
tasklist | findstr mongod

# Mac/Linux
ps aux | grep mongod
```

2. Try connecting manually:
```bash
mongosh
# or
mongo
```

3. If connection fails, check `.env` file and update `MONGODB_URI`

### Port 5000 already in use?

Change port in `.env`:
```
PORT=5001
```

### Dependencies won't install?

1. Delete `node_modules` and `package-lock.json`
2. Run `npm install` again
3. Try `npm cache clean --force` first

---

## File Structure

```
backend/
├── src/
│   ├── controllers/    # Business logic
│   ├── models/        # Database schemas
│   ├── routes/        # API endpoints
│   ├── middleware/    # Auth & validation
│   ├── utils/         # Helper functions
│   ├── scripts/       # Database tools
│   └── server.js      # Main file
├── .env              # Your config
├── package.json      # Dependencies
└── README.md         # Full docs
```

---

## Development Workflow

1. Make code changes
2. Server auto-restarts (nodemon)
3. Test with Postman/curl
4. Check MongoDB Compass to see data
5. Repeat!

---

## Production Checklist

Before deploying:

- [ ] Change JWT secrets in `.env`
- [ ] Use MongoDB Atlas (cloud database)
- [ ] Update CORS settings
- [ ] Set `NODE_ENV=production`
- [ ] Remove console.logs
- [ ] Add proper error logging
- [ ] Set up monitoring
- [ ] Configure HTTPS

---

## Need More Help?

1. **Full API Docs:** See `API_DOCUMENTATION.md`
2. **Detailed Setup:** See `BACKEND_SETUP_GUIDE.md`
3. **Code Reference:** See `README.md`

---

## You're All Set! 🎉

Your backend is now running and ready to use!

**Backend:** http://localhost:5000
**Health Check:** http://localhost:5000/health
**API Base:** http://localhost:5000/api

Now go build something amazing! 🚀
