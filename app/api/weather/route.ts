import { NextResponse } from "next/server"

const PAKISTAN_CITIES = {
  Karachi: { lat: 24.8607, lon: 67.0011 },
  Lahore: { lat: 31.5204, lon: 74.3587 },
  Islamabad: { lat: 33.6844, lon: 73.0479 },
  Peshawar: { lat: 34.0151, lon: 71.5249 },
  Quetta: { lat: 30.1798, lon: 66.975 },
  Multan: { lat: 30.1575, lon: 71.4454 },
  Rawalpindi: { lat: 33.5794, lon: 73.4683 },
  Hyderabad: { lat: 25.396, lon: 68.4626 },
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const city = searchParams.get("city") || "Lahore"

  const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      { error: "Weather API key not configured. Please add NEXT_PUBLIC_WEATHER_API_KEY to .env.local" },
      { status: 500 }
    )
  }

  try {
    const coordinates = PAKISTAN_CITIES[city as keyof typeof PAKISTAN_CITIES] || PAKISTAN_CITIES.Lahore

    // Fetch current weather
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`
    const currentResponse = await fetch(currentWeatherUrl)
    const currentData = await currentResponse.json()

    // Fetch 5-day forecast (for solar prediction)
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`
    const forecastResponse = await fetch(forecastUrl)
    const forecastData = await forecastResponse.json()

    // Calculate average sunlight hours based on cloud coverage
    const calculateSunlightHours = (clouds: number) => {
      // Assumes 12 hours of daylight, reduced by cloud coverage
      const maxDaylight = 12
      const sunlightHours = maxDaylight * (1 - clouds / 100)
      return Math.max(6, Math.min(10, sunlightHours)).toFixed(1)
    }

    // Process forecast data for next 7 days
    const dailyForecasts = []
    const uniqueDays = new Set()

    for (const item of forecastData.list) {
      const date = new Date(item.dt * 1000)
      const dayKey = date.toISOString().split("T")[0]

      if (!uniqueDays.has(dayKey) && uniqueDays.size < 7) {
        uniqueDays.add(dayKey)

        const sunlightHours = parseFloat(calculateSunlightHours(item.clouds.all))
        const solarEfficiency = Math.round(85 + (1 - item.clouds.all / 100) * 15) // 85-100%

        dailyForecasts.push({
          date: dayKey,
          day: date.toLocaleDateString("en-US", { weekday: "long" }),
          temp: Math.round(item.main.temp),
          feelsLike: Math.round(item.main.feels_like),
          humidity: item.main.humidity,
          clouds: item.clouds.all,
          weather: item.weather[0].main.toLowerCase(),
          description: item.weather[0].description,
          sunlightHours: sunlightHours,
          solarEfficiency: solarEfficiency,
          windSpeed: item.wind.speed,
          optimal: sunlightHours >= 8 && item.clouds.all < 30,
        })
      }
    }

    // Current weather with solar metrics
    const currentSunlight = calculateSunlightHours(currentData.clouds.all)
    const currentEfficiency = Math.round(85 + (1 - currentData.clouds.all / 100) * 15)

    const response = {
      city,
      current: {
        temp: Math.round(currentData.main.temp),
        feelsLike: Math.round(currentData.main.feels_like),
        humidity: currentData.main.humidity,
        pressure: currentData.main.pressure,
        clouds: currentData.clouds.all,
        weather: currentData.weather[0].main.toLowerCase(),
        description: currentData.weather[0].description,
        windSpeed: currentData.wind.speed,
        sunrise: new Date(currentData.sys.sunrise * 1000).toISOString(),
        sunset: new Date(currentData.sys.sunset * 1000).toISOString(),
        sunlightHours: currentSunlight,
        solarEfficiency: currentEfficiency,
      },
      forecast: dailyForecasts,
      metadata: {
        timestamp: new Date().toISOString(),
        source: "OpenWeatherMap",
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Weather API Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch weather data" },
      { status: 500 }
    )
  }
}
