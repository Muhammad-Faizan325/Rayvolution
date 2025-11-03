import { NextResponse } from "next/server"
import { userStorage } from "@/lib/users-storage"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password, phone, city, solarPanels, energyGoal } = body

    // Validation
    if (!name || !email || !password || !phone || !city) {
      return NextResponse.json(
        { error: "All required fields must be filled" },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    // Password validation
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      )
    }

    // Check if user already exists
    if (userStorage.emailExists(email)) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      )
    }

    // Create new user (in production, hash the password with bcrypt)
    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      password, // In production: await bcrypt.hash(password, 10)
      phone,
      city,
      solarPanels: solarPanels || false,
      energyGoal: energyGoal || "reduce-consumption",
      joinDate: new Date().toISOString(),
      stats: {
        energySaved: 0,
        co2Reduced: 0,
        greenCoins: 100, // Welcome bonus
        sustainabilityScore: 50, // Starting score
        streak: 0,
        energyTokens: 0,
      },
    }

    // Save to shared user storage
    userStorage.add(newUser)

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser

    return NextResponse.json({
      success: true,
      message: "Account created successfully",
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json(
      { error: "An error occurred during signup" },
      { status: 500 }
    )
  }
}
