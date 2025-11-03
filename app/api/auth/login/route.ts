import { NextResponse } from "next/server"

// Mock user database (in production, use a real database)
const MOCK_USERS = [
  {
    id: "1",
    name: "Ahmad Khan",
    email: "ahmad@example.com",
    password: "password123", // In production, use hashed passwords
    phone: "+92 300 1234567",
    city: "Lahore",
    solarPanels: true,
    energyGoal: "solar-adoption",
    joinDate: "2024-01-15",
  },
]

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    // Find user by email
    const user = MOCK_USERS.find((u) => u.email === email)

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    // Check password (in production, use bcrypt.compare)
    if (user.password !== password) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "An error occurred during login" },
      { status: 500 }
    )
  }
}
