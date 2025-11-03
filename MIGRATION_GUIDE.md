# Migration Guide: Frontend → Backend Integration

This guide shows how to migrate your existing Next.js frontend from localStorage to the new Express backend.

---

## What Changed?

### Before (Old Approach)
- Authentication: localStorage + cookies
- Data Storage: In-memory (`lib/users-storage.ts`)
- User Data: Browser localStorage
- API Routes: Next.js API routes (`app/api/`)

### After (New Approach)
- Authentication: JWT tokens from Express backend
- Data Storage: MongoDB database
- User Data: Database with proper relationships
- API Routes: Express.js backend (`backend/src/`)

---

## Migration Steps

### Step 1: Update Authentication

#### Old Code (Login Page)
```typescript
// app/login/page.tsx
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();
  localStorage.setItem('user', JSON.stringify(data.user));
  router.push('/dashboard');
};
```

#### New Code (Login Page)
```typescript
// app/login/page.tsx
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // Important for cookies
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();

  if (data.success) {
    // Store token in localStorage or use cookies
    localStorage.setItem('accessToken', data.data.accessToken);
    localStorage.setItem('user', JSON.stringify(data.data.user));
    router.push('/dashboard');
  } else {
    setError(data.message);
  }
};
```

---

### Step 2: Create API Service Layer

Create a new file to centralize all API calls:

```typescript
// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper function to get token
const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('accessToken');
  }
  return null;
};

// Helper function for authenticated requests
const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  const data = await response.json();

  // Handle token expiration
  if (response.status === 401) {
    // Redirect to login or refresh token
    window.location.href = '/login';
  }

  return data;
};

// API methods
export const api = {
  // Authentication
  auth: {
    signup: (userData: any) =>
      authenticatedFetch('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(userData)
      }),

    login: (email: string, password: string) =>
      authenticatedFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      }),

    logout: () =>
      authenticatedFetch('/auth/logout', { method: 'POST' }),

    getCurrentUser: () =>
      authenticatedFetch('/auth/me'),
  },

  // Energy
  energy: {
    record: (energyData: any) =>
      authenticatedFetch('/energy', {
        method: 'POST',
        body: JSON.stringify(energyData)
      }),

    getUserHistory: (userId: string, params?: any) =>
      authenticatedFetch(`/energy/user/${userId}?${new URLSearchParams(params)}`),

    getAllCities: () =>
      authenticatedFetch('/energy/cities'),

    getNationalStats: () =>
      authenticatedFetch('/energy/national'),
  },

  // Challenges
  challenges: {
    getAll: (params?: any) =>
      authenticatedFetch(`/challenges?${new URLSearchParams(params)}`),

    join: (challengeId: string) =>
      authenticatedFetch(`/challenges/${challengeId}/join`, { method: 'POST' }),

    updateProgress: (challengeId: string, progress: number) =>
      authenticatedFetch(`/challenges/${challengeId}/progress`, {
        method: 'PUT',
        body: JSON.stringify({ progress })
      }),

    getUserChallenges: (userId: string) =>
      authenticatedFetch(`/challenges/user/${userId}`),
  },

  // Marketplace
  marketplace: {
    getListings: (params?: any) =>
      authenticatedFetch(`/marketplace/listings?${new URLSearchParams(params)}`),

    createListing: (listingData: any) =>
      authenticatedFetch('/marketplace/listings', {
        method: 'POST',
        body: JSON.stringify(listingData)
      }),

    purchase: (listingId: string) =>
      authenticatedFetch(`/marketplace/listings/${listingId}/purchase`, {
        method: 'POST'
      }),

    donate: (donationData: any) =>
      authenticatedFetch('/marketplace/donate', {
        method: 'POST',
        body: JSON.stringify(donationData)
      }),
  },

  // Reports
  reports: {
    create: (reportData: any) =>
      authenticatedFetch('/reports', {
        method: 'POST',
        body: JSON.stringify(reportData)
      }),

    getUserReports: (userId: string, params?: any) =>
      authenticatedFetch(`/reports/user/${userId}?${new URLSearchParams(params)}`),

    addComment: (reportId: string, text: string) =>
      authenticatedFetch(`/reports/${reportId}/comments`, {
        method: 'POST',
        body: JSON.stringify({ text })
      }),

    upvote: (reportId: string) =>
      authenticatedFetch(`/reports/${reportId}/upvote`, { method: 'POST' }),
  },

  // Stats
  stats: {
    getLeaderboard: (params?: any) =>
      authenticatedFetch(`/stats/leaderboard?${new URLSearchParams(params)}`),

    getCityLeaderboard: (cityName: string, params?: any) =>
      authenticatedFetch(`/stats/leaderboard/city/${cityName}?${new URLSearchParams(params)}`),

    getUserRank: (userId: string) =>
      authenticatedFetch(`/stats/rank/${userId}`),
  },

  // Chat
  chat: {
    send: (message: string) =>
      authenticatedFetch('/chat', {
        method: 'POST',
        body: JSON.stringify({ message })
      }),

    getHistory: () =>
      authenticatedFetch('/chat/history'),
  },

  // Admin
  admin: {
    getAnalytics: () =>
      authenticatedFetch('/admin/analytics'),

    getAllReports: (params?: any) =>
      authenticatedFetch(`/admin/reports?${new URLSearchParams(params)}`),

    getAllUsers: (params?: any) =>
      authenticatedFetch(`/admin/users?${new URLSearchParams(params)}`),
  },
};

export default api;
```

---

### Step 3: Update Components

#### Example: Dashboard Component

**Old Code:**
```typescript
// app/dashboard/page.tsx
const [user, setUser] = useState(null);

useEffect(() => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    setUser(JSON.parse(storedUser));
  }
}, []);
```

**New Code:**
```typescript
// app/dashboard/page.tsx
import { api } from '@/lib/api';

const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchUser = async () => {
    try {
      const response = await api.auth.getCurrentUser();
      if (response.success) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  fetchUser();
}, []);

if (loading) return <div>Loading...</div>;
```

---

### Step 4: Update Environment Variables

Create/Update `.env.local` in your Next.js root:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Keep existing weather and AI keys
NEXT_PUBLIC_WEATHER_API_KEY=your-key
GROQ_API_KEY=your-key
```

---

### Step 5: Remove Old API Routes

You can now delete these files (optional, or keep for reference):
- `app/api/auth/login/route.ts`
- `app/api/auth/signup/route.ts`
- `app/api/chat/route.ts`
- `app/api/energy/route.ts`
- `app/api/weather/route.ts`
- `lib/users-storage.ts`

---

### Step 6: Update Middleware

**Old Code:**
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.get('isAuthenticated');
  // ...
}
```

**New Code:**
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');

  if (!token && protectedRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}
```

---

### Step 7: Update Specific Features

#### Challenges Page

**Old:**
```typescript
const challenges = [
  // hardcoded challenges
];
```

**New:**
```typescript
const [challenges, setChallenges] = useState([]);

useEffect(() => {
  const fetchChallenges = async () => {
    const response = await api.challenges.getAll({ type: 'weekly' });
    if (response.success) {
      setChallenges(response.data.challenges);
    }
  };
  fetchChallenges();
}, []);
```

#### Leaderboard

**Old:**
```typescript
const leaderboard = [
  // hardcoded data
];
```

**New:**
```typescript
const [leaderboard, setLeaderboard] = useState([]);

useEffect(() => {
  const fetchLeaderboard = async () => {
    const response = await api.stats.getLeaderboard({ limit: 50 });
    if (response.success) {
      setLeaderboard(response.data.leaderboard);
    }
  };
  fetchLeaderboard();
}, []);
```

#### Marketplace

**Old:**
```typescript
const handlePurchase = (listing) => {
  // Update localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  user.greenCoins -= listing.price;
  localStorage.setItem('user', JSON.stringify(user));
};
```

**New:**
```typescript
const handlePurchase = async (listingId: string) => {
  try {
    const response = await api.marketplace.purchase(listingId);
    if (response.success) {
      // Update local state
      setUser(prevUser => ({
        ...prevUser,
        stats: response.data.buyerStats
      }));
      // Show success message
      toast.success('Purchase successful!');
    }
  } catch (error) {
    toast.error('Purchase failed');
  }
};
```

---

### Step 8: Add Error Handling

Create a global error handler:

```typescript
// lib/errorHandler.ts
export const handleApiError = (error: any) => {
  if (error.response) {
    // Server responded with error
    switch (error.response.status) {
      case 401:
        // Unauthorized - redirect to login
        window.location.href = '/login';
        break;
      case 403:
        // Forbidden
        return 'You do not have permission to perform this action';
      case 404:
        return 'Resource not found';
      case 500:
        return 'Server error. Please try again later';
      default:
        return error.response.data?.message || 'An error occurred';
    }
  } else if (error.request) {
    // Request made but no response
    return 'Network error. Please check your connection';
  } else {
    // Other errors
    return 'An unexpected error occurred';
  }
};
```

Use it in components:
```typescript
try {
  const response = await api.challenges.join(challengeId);
  // handle success
} catch (error) {
  const errorMessage = handleApiError(error);
  toast.error(errorMessage);
}
```

---

## Complete Example: Energy Recording

### Before
```typescript
// Old approach - update localStorage
const recordEnergy = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  user.stats.energySaved += amount;
  user.stats.greenCoins += amount * 2;
  localStorage.setItem('user', JSON.stringify(user));
};
```

### After
```typescript
// New approach - API call
const recordEnergy = async () => {
  try {
    const response = await api.energy.record({
      city: user.city,
      type: 'savings',
      amount: parseFloat(energyAmount),
      source: 'solar',
      metadata: {
        temperature: weatherData.temp,
        sunlightHours: 9
      }
    });

    if (response.success) {
      // Update local user state with new stats
      setUser(prevUser => ({
        ...prevUser,
        stats: response.data.stats
      }));

      toast.success('Energy recorded successfully!');
      setEnergyAmount('');
    }
  } catch (error) {
    toast.error('Failed to record energy');
  }
};
```

---

## Testing Checklist

After migration, test these features:

- [ ] User registration
- [ ] User login/logout
- [ ] Dashboard displays correct user data
- [ ] Energy recording updates stats
- [ ] Challenges can be joined
- [ ] Challenge progress updates
- [ ] Leaderboard shows real data
- [ ] Marketplace listings load
- [ ] Can purchase/sell tokens
- [ ] Reports can be created
- [ ] Comments and upvotes work
- [ ] Admin dashboard (if admin)
- [ ] AI chatbot responds
- [ ] City statistics load
- [ ] Profile updates save

---

## Common Issues & Solutions

### Issue 1: CORS Errors
```
Access to fetch has been blocked by CORS policy
```

**Solution:** Backend is already configured for CORS. Ensure:
1. Backend `.env` has correct `FRONTEND_URL=http://localhost:3000`
2. You're using `credentials: 'include'` in fetch requests

### Issue 2: 401 Unauthorized
```
{"success": false, "message": "Not authorized"}
```

**Solution:**
1. Check if token is being sent in requests
2. Verify token is stored correctly after login
3. Check if token hasn't expired

### Issue 3: Data Not Updating
```
User stats not updating in real-time
```

**Solution:**
1. Refresh user data after actions
2. Consider using React Context or state management
3. Use SWR or React Query for automatic revalidation

---

## Performance Optimization

### Use SWR for Data Fetching

```typescript
import useSWR from 'swr';

const fetcher = (url: string) =>
  api.stats.getLeaderboard().then(res => res.data);

function Leaderboard() {
  const { data, error, mutate } = useSWR('/stats/leaderboard', fetcher);

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  return <div>{/* render leaderboard */}</div>;
}
```

### Use React Query

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';

function Challenges() {
  const { data, isLoading } = useQuery({
    queryKey: ['challenges'],
    queryFn: () => api.challenges.getAll()
  });

  const joinMutation = useMutation({
    mutationFn: (challengeId: string) => api.challenges.join(challengeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
    }
  });

  return (
    <div>
      {data?.data.challenges.map(challenge => (
        <button onClick={() => joinMutation.mutate(challenge._id)}>
          Join
        </button>
      ))}
    </div>
  );
}
```

---

## Next Steps

1. ✅ Backend is running
2. ✅ Created API service layer
3. ✅ Updated authentication
4. ⬜ Update all components to use API
5. ⬜ Test all features
6. ⬜ Remove old API routes
7. ⬜ Deploy backend to production
8. ⬜ Update frontend environment variables for production

---

## Benefits of Backend Migration

✅ **Persistent Data** - Data survives browser refresh
✅ **Multi-Device** - Same account on multiple devices
✅ **Real-time** - All users see same data
✅ **Scalable** - Can handle millions of users
✅ **Secure** - Proper authentication & authorization
✅ **Analytics** - Track real user behavior
✅ **Admin Control** - Manage users & content
✅ **Production Ready** - Deploy to real users

---

Need help with migration? Check the API_DOCUMENTATION.md for detailed endpoint information!
