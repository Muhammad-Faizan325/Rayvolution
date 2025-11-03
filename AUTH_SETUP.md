# Rayvolution Pakistan - Authentication System

Complete user authentication system with login, signup, and profile management.

## 🎯 Features Implemented

1. **User Login** - Secure authentication with email/password
2. **User Signup** - Registration with Pakistan-specific fields
3. **User Profile** - Personalized dashboard with energy statistics
4. **Session Management** - localStorage-based session handling
5. **Protected Routes** - Profile page requires authentication

## 📋 Pages Created

### 1. Login Page (`/login`)
- Email & password authentication
- Password visibility toggle
- Remember me functionality
- Social login buttons (Google, Facebook) - UI ready
- Forgot password link
- Redirect to dashboard on successful login

**Features:**
- Form validation
- Error handling with user-friendly messages
- Animated glassmorphic design
- Responsive layout

**Test Credentials:**
```
Email: ahmad@example.com
Password: password123
```

### 2. Signup Page (`/signup`)
- Full user registration form
- Pakistan city dropdown (12 major cities)
- Phone number field
- Energy goal selection
- Solar panel ownership checkbox
- Password strength validation (min 8 characters)
- Terms & conditions agreement

**Features:**
- Email format validation
- Password strength requirements
- Real-time form validation
- Welcome bonus: 100 GreenCoins on signup
- Starting sustainability score: 50/100

### 3. Profile Page (`/profile`)
- User information display
- Energy impact statistics
- Sustainability score with progress bar
- Current streak tracker
- Energy tokens balance
- Recent achievements showcase
- Quick action buttons
- Logout functionality

**Profile Statistics:**
- Energy Saved (kWh)
- CO₂ Reduced (kg)
- GreenCoins Balance
- Sustainability Score (0-100)
- Current Streak (days)
- Energy Tokens (kWh)

## 🔐 API Endpoints

### 1. Login API (`/api/auth/login`)
```typescript
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "1",
    "name": "Ahmad Khan",
    "email": "ahmad@example.com",
    "phone": "+92 300 1234567",
    "city": "Lahore",
    "solarPanels": true,
    "energyGoal": "solar-adoption",
    "joinDate": "2024-01-15"
  }
}
```

### 2. Signup API (`/api/auth/signup`)
```typescript
POST /api/auth/signup
Content-Type: application/json

{
  "name": "Ahmad Khan",
  "email": "ahmad@example.com",
  "password": "password123",
  "phone": "+92 300 1234567",
  "city": "Lahore",
  "solarPanels": true,
  "energyGoal": "solar-adoption"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Account created successfully",
  "user": {
    "id": "user-1234567890",
    "name": "Ahmad Khan",
    "email": "ahmad@example.com",
    "phone": "+92 300 1234567",
    "city": "Lahore",
    "solarPanels": true,
    "energyGoal": "solar-adoption",
    "joinDate": "2024-11-03T...",
    "stats": {
      "energySaved": 0,
      "co2Reduced": 0,
      "greenCoins": 100,
      "sustainabilityScore": 50,
      "streak": 0,
      "energyTokens": 0
    }
  }
}
```

## 🎨 UI Components

### Navbar Updates
- **Desktop**: Login & Sign Up buttons (or Profile button if logged in)
- **Mobile**: Auth links in dropdown menu
- Dynamic display based on login status
- Profile link with active indicator

### Profile Features
- **Avatar**: Generated from first letter of name
- **Quick Stats**: Email, phone, city, join date
- **Solar Status Badge**: Shows if user has solar panels
- **Impact Cards**: Energy saved, CO₂ reduced, GreenCoins
- **Progress Bar**: Sustainability score visualization
- **Achievements Grid**: 4 unlockable achievements
- **Quick Actions**: Links to Dashboard, Challenges, Marketplace, Settings

## 🔄 Authentication Flow

### Login Flow:
1. User enters email & password
2. Frontend validates input
3. POST request to `/api/auth/login`
4. API checks credentials
5. On success: User data stored in localStorage
6. Redirect to `/dashboard`
7. Navbar shows "Profile" button

### Signup Flow:
1. User fills registration form
2. Frontend validates all fields
3. POST request to `/api/auth/signup`
4. API validates & creates account
5. Welcome bonus: 100 GreenCoins
6. User data stored in localStorage
7. Redirect to `/dashboard`

### Logout Flow:
1. User clicks "Logout" button
2. Remove user data from localStorage
3. Redirect to `/login`
4. Navbar shows "Login" & "Sign Up" buttons

## 💾 Data Storage

Currently using **localStorage** for session management:

```typescript
// Store user data on login/signup
localStorage.setItem("user", JSON.stringify(userData))

// Check if user is logged in
const userData = localStorage.getItem("user")
const isLoggedIn = !!userData

// Get user data
const user = JSON.parse(localStorage.getItem("user") || "{}")

// Logout
localStorage.removeItem("user")
```

### User Data Structure:
```typescript
{
  id: string
  name: string
  email: string
  phone: string
  city: string
  solarPanels: boolean
  energyGoal: "reduce-consumption" | "solar-adoption" | "sell-energy" | "sustainability"
  joinDate: string (ISO date)
  stats: {
    energySaved: number      // in kWh
    co2Reduced: number       // in kg
    greenCoins: number       // total coins
    sustainabilityScore: number  // 0-100
    streak: number          // days
    energyTokens: number    // in kWh
  }
}
```

## 🌍 Pakistan-Specific Features

### Supported Cities:
1. Karachi
2. Lahore
3. Islamabad
4. Rawalpindi
5. Faisalabad
6. Multan
7. Peshawar
8. Quetta
9. Hyderabad
10. Gujranwala
11. Sialkot
12. Bahawalpur

### Energy Goals:
- **Reduce Consumption**: Focus on energy-saving tips
- **Solar Adoption**: Get solar panel installation guidance
- **Generate & Sell**: Marketplace focus for energy trading
- **Sustainability**: Improve environmental impact score

## 🚀 Quick Start

### Testing the Auth System:

1. **Visit Login Page:**
   ```
   http://localhost:3000/login
   ```

2. **Test Login:**
   - Email: `ahmad@example.com`
   - Password: `password123`

3. **Visit Signup Page:**
   ```
   http://localhost:3000/signup
   ```

4. **Create New Account:**
   - Fill in all fields
   - Select your city from dropdown
   - Choose energy goal
   - Accept terms & conditions

5. **View Profile:**
   ```
   http://localhost:3000/profile
   ```
   (Must be logged in)

## 🛠️ Development Notes

### Current Implementation:
- ✅ Mock authentication (no real database)
- ✅ localStorage for session management
- ✅ Client-side form validation
- ✅ Password visibility toggle
- ✅ Error handling & user feedback
- ✅ Responsive design
- ✅ Animated UI components

### For Production:
- 🔄 Connect to real database (MongoDB, PostgreSQL, etc.)
- 🔄 Implement JWT token authentication
- 🔄 Hash passwords with bcrypt
- 🔄 Add email verification
- 🔄 Implement "Forgot Password" functionality
- 🔄 Add OAuth (Google, Facebook) integration
- 🔄 Implement refresh tokens
- 🔄 Add rate limiting for API routes
- 🔄 Add CSRF protection
- 🔄 Implement secure HTTP-only cookies

### Security Improvements Needed:
```typescript
// Current (mock):
if (user.password !== password) { ... }

// Production (use bcrypt):
import bcrypt from 'bcrypt'
const isValid = await bcrypt.compare(password, user.hashedPassword)

// Hash on signup:
const hashedPassword = await bcrypt.hash(password, 10)
```

## 📊 User Statistics Tracking

The profile page displays:

### Energy Impact:
- **Energy Saved**: Total kWh saved since joining
- **CO₂ Reduced**: Environmental impact in kg
- **GreenCoins**: Earned through challenges & contributions

### Progress Metrics:
- **Sustainability Score**: 0-100 rating
- **Current Streak**: Consecutive active days
- **Energy Tokens**: Available for marketplace trading

### Achievements (4 unlocked):
1. 🏆 **Energy Saver** - Saved 1000+ kWh
2. ⚡ **Week Warrior** - 7-day streak completed
3. 🌱 **Eco Champion** - Reduced 1000+ kg CO₂
4. 👥 **Community Leader** - Top 10% in city

## 🎯 Navigation

### Navbar Changes:
**Before Login:**
- Login button (desktop & mobile)
- Sign Up button (desktop & mobile, highlighted)

**After Login:**
- Profile button (desktop & mobile)
- Shows user avatar on profile page

### Profile Quick Actions:
- Dashboard → Energy overview
- Challenges → Daily tasks & rewards
- Marketplace → Energy token trading
- Settings → Account settings (coming soon)

## 🔗 Related Pages

- `/login` - User login
- `/signup` - New user registration
- `/profile` - User profile & statistics
- `/dashboard` - Main dashboard (after login)
- `/challenges` - Daily challenges
- `/marketplace` - Energy marketplace
- `/sustainability` - Sustainability score details

## ✨ Design Features

### Glassmorphism UI:
- Frosted glass effect on cards
- Neon borders (cyan for login, emerald for signup)
- Smooth animations with Framer Motion
- Gradient backgrounds
- Responsive layouts

### Animation Effects:
- Page transitions
- Loading spinners
- Hover effects
- Scale animations
- Rotating solar icons

## 📝 Future Enhancements

1. **Email Verification**: Send verification email on signup
2. **Password Reset**: Full forgot password flow
3. **2FA Authentication**: Two-factor auth for security
4. **Social Login**: Complete Google & Facebook OAuth
5. **Profile Editing**: Allow users to update their info
6. **Avatar Upload**: Custom profile pictures
7. **Activity Log**: Track user actions & history
8. **Notifications**: In-app notification system
9. **Settings Page**: Privacy, security, preferences
10. **Admin Panel**: User management for admins

## 🎉 That's It!

Your Rayvolution Pakistan project now has a complete authentication system with:
- ✅ Login & Signup pages
- ✅ User profile with stats
- ✅ Session management
- ✅ Protected routes
- ✅ Navbar integration
- ✅ Responsive design
- ✅ Beautiful animations

**Ready to use!** Start by visiting `/login` or `/signup`
