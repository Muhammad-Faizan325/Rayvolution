// Simple in-memory user storage (in production, use a real database)
// This is a workaround since we can't use a database yet

export interface User {
  id: string
  name: string
  email: string
  password: string
  phone: string
  city: string
  solarPanels: boolean
  energyGoal: string
  joinDate: string
}

// In-memory storage (will reset on server restart)
const users: User[] = [
  {
    id: "1",
    name: "Ahmad Khan",
    email: "ahmad@example.com",
    password: "password123",
    phone: "+92 300 1234567",
    city: "Lahore",
    solarPanels: true,
    energyGoal: "solar-adoption",
    joinDate: "2024-01-15",
  },
  // Demo user for testing
  {
    id: "2",
    name: "Demo User",
    email: "demo@test.com",
    password: "demo123",
    phone: "+92 300 0000000",
    city: "Karachi",
    solarPanels: false,
    energyGoal: "reduce-consumption",
    joinDate: "2024-11-03",
  },
]

export const userStorage = {
  // Get all users
  getAll: (): User[] => {
    return users
  },

  // Find user by email
  findByEmail: (email: string): User | undefined => {
    return users.find((u) => u.email.toLowerCase() === email.toLowerCase())
  },

  // Find user by id
  findById: (id: string): User | undefined => {
    return users.find((u) => u.id === id)
  },

  // Add new user
  add: (user: User): void => {
    users.push(user)
  },

  // Check if email exists
  emailExists: (email: string): boolean => {
    return users.some((u) => u.email.toLowerCase() === email.toLowerCase())
  },

  // Get user count
  count: (): number => {
    return users.length
  },
}
