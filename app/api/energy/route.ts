import { NextResponse } from "next/server"

// Simulated energy data for Pakistan cities
// In production, this would connect to a real database
const ENERGY_DATA = {
  cities: {
    Karachi: {
      adoptionRate: 45,
      sunlightHours: 8.2,
      powerShortage: 28,
      users: 380,
      energySaved: 4850,
      co2Reduced: 2425,
      trend: "up",
      monthlyGrowth: 12,
    },
    Lahore: {
      adoptionRate: 52,
      sunlightHours: 7.8,
      powerShortage: 32,
      users: 420,
      energySaved: 5670,
      co2Reduced: 2835,
      trend: "up",
      monthlyGrowth: 15,
    },
    Islamabad: {
      adoptionRate: 58,
      sunlightHours: 7.5,
      powerShortage: 25,
      users: 280,
      energySaved: 3920,
      co2Reduced: 1960,
      trend: "up",
      monthlyGrowth: 18,
    },
    Peshawar: {
      adoptionRate: 38,
      sunlightHours: 7.2,
      powerShortage: 38,
      users: 180,
      energySaved: 2340,
      co2Reduced: 1170,
      trend: "up",
      monthlyGrowth: 8,
    },
    Quetta: {
      adoptionRate: 28,
      sunlightHours: 8.8,
      powerShortage: 42,
      users: 95,
      energySaved: 1235,
      co2Reduced: 618,
      trend: "up",
      monthlyGrowth: 10,
    },
    Multan: {
      adoptionRate: 35,
      sunlightHours: 8.1,
      powerShortage: 35,
      users: 160,
      energySaved: 2080,
      co2Reduced: 1040,
      trend: "up",
      monthlyGrowth: 11,
    },
    Rawalpindi: {
      adoptionRate: 48,
      sunlightHours: 7.6,
      powerShortage: 30,
      users: 210,
      energySaved: 2730,
      co2Reduced: 1365,
      trend: "up",
      monthlyGrowth: 13,
    },
    Hyderabad: {
      adoptionRate: 42,
      sunlightHours: 8.3,
      powerShortage: 30,
      users: 200,
      energySaved: 2600,
      co2Reduced: 1300,
      trend: "up",
      monthlyGrowth: 9,
    },
  },
  national: {
    totalUsers: 1925,
    avgAdoptionRate: 43,
    avgSunlightHours: 7.9,
    avgPowerShortage: 33,
    totalEnergySaved: 25425,
    totalCO2Reduced: 12713,
    activeCities: 8,
  },
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const city = searchParams.get("city")
  const type = searchParams.get("type") || "all"

  try {
    if (city && ENERGY_DATA.cities[city as keyof typeof ENERGY_DATA.cities]) {
      // Return specific city data
      return NextResponse.json({
        city,
        data: ENERGY_DATA.cities[city as keyof typeof ENERGY_DATA.cities],
        timestamp: new Date().toISOString(),
      })
    }

    if (type === "national") {
      // Return national statistics
      return NextResponse.json({
        national: ENERGY_DATA.national,
        timestamp: new Date().toISOString(),
      })
    }

    if (type === "cities") {
      // Return all cities data
      return NextResponse.json({
        cities: ENERGY_DATA.cities,
        timestamp: new Date().toISOString(),
      })
    }

    // Return everything
    return NextResponse.json({
      ...ENERGY_DATA,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Energy Data API Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch energy data" },
      { status: 500 }
    )
  }
}

// POST endpoint for updating energy data (simulated)
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { city, energyUsage, solarGeneration } = body

    // In production, this would save to a database
    // For now, we'll just return a success response
    return NextResponse.json({
      success: true,
      message: "Energy data recorded successfully",
      data: {
        city,
        energyUsage,
        solarGeneration,
        greenCoinsEarned: Math.round(solarGeneration * 2),
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Energy Data POST Error:", error)
    return NextResponse.json(
      { error: "Failed to record energy data" },
      { status: 500 }
    )
  }
}
