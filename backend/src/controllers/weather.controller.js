const axios = require('axios');
const { sendSuccess, sendError } = require('../utils/response.utils');

// Major Pakistani cities coordinates
const cityCoordinates = {
  'Karachi': { lat: 24.8607, lon: 67.0011 },
  'Lahore': { lat: 31.5497, lon: 74.3436 },
  'Islamabad': { lat: 33.6844, lon: 73.0479 },
  'Peshawar': { lat: 34.0151, lon: 71.5249 },
  'Quetta': { lat: 30.1798, lon: 66.9750 },
  'Multan': { lat: 30.1575, lon: 71.5249 },
  'Rawalpindi': { lat: 33.5651, lon: 73.0169 },
  'Hyderabad': { lat: 25.3792, lon: 68.3683 },
  'Faisalabad': { lat: 31.4180, lon: 73.0790 },
  'Sialkot': { lat: 32.4945, lon: 74.5229 }
};

// @desc    Get weather forecast with sunlight prediction
// @route   GET /api/weather/:city
// @access  Public
exports.getWeatherForecast = async (req, res) => {
  try {
    const { city } = req.params;

    // Check if city is supported
    if (!cityCoordinates[city]) {
      return sendError(res, `City '${city}' not supported. Available cities: ${Object.keys(cityCoordinates).join(', ')}`, 400);
    }

    const { lat, lon } = cityCoordinates[city];
    const apiKey = process.env.WEATHER_API_KEY || process.env.NEXT_PUBLIC_WEATHER_API_KEY;

    if (!apiKey) {
      return sendError(res, 'Weather API key not configured', 500);
    }

    // Fetch 5-day weather forecast from OpenWeatherMap
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );

    const forecastData = response.data;

    // Process forecast data - group by day
    const dailyForecasts = {};

    forecastData.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const day = date.toISOString().split('T')[0];

      if (!dailyForecasts[day]) {
        dailyForecasts[day] = {
          date: day,
          dayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
          temps: [],
          clouds: [],
          weather: [],
          humidity: []
        };
      }

      dailyForecasts[day].temps.push(item.main.temp);
      dailyForecasts[day].clouds.push(item.clouds.all);
      dailyForecasts[day].weather.push(item.weather[0].main);
      dailyForecasts[day].humidity.push(item.main.humidity);
    });

    // Calculate averages and sunlight efficiency
    const forecast = Object.values(dailyForecasts).slice(0, 5).map(day => {
      const avgTemp = day.temps.reduce((sum, t) => sum + t, 0) / day.temps.length;
      const avgClouds = day.clouds.reduce((sum, c) => sum + c, 0) / day.clouds.length;
      const avgHumidity = day.humidity.reduce((sum, h) => sum + h, 0) / day.humidity.length;

      // Calculate sunlight efficiency (0-100%)
      // Less clouds = better sunlight
      const sunlightEfficiency = Math.round(100 - avgClouds);

      // Determine condition
      const mostCommonWeather = day.weather.sort((a, b) =>
        day.weather.filter(v => v === a).length - day.weather.filter(v => v === b).length
      ).pop();

      // Generate sunlight hours estimate (based on season and clouds)
      const month = new Date(day.date).getMonth();
      const baseSunlightHours = month >= 3 && month <= 8 ? 9 : 7; // Summer vs winter
      const sunlightHours = Math.round((baseSunlightHours * sunlightEfficiency / 100) * 10) / 10;

      // Generate advice
      let advice = '';
      if (sunlightEfficiency >= 85) {
        advice = 'Excellent day for solar generation! Maximum efficiency expected ⚡';
      } else if (sunlightEfficiency >= 70) {
        advice = 'Good solar conditions. Your panels will perform well ☀️';
      } else if (sunlightEfficiency >= 50) {
        advice = 'Moderate conditions. Expect reduced solar output ⛅';
      } else {
        advice = 'Poor solar conditions. Consider using grid power ☁️';
      }

      return {
        day: day.dayName,
        date: day.date,
        sunlightEfficiency: `${sunlightEfficiency}%`,
        sunlightHours,
        temperature: Math.round(avgTemp),
        humidity: Math.round(avgHumidity),
        cloudCoverage: Math.round(avgClouds),
        condition: mostCommonWeather,
        advice
      };
    });

    // Current weather
    const currentWeather = forecastData.list[0];
    const currentSunlight = Math.round(100 - currentWeather.clouds.all);

    const result = {
      city,
      current: {
        temperature: Math.round(currentWeather.main.temp),
        humidity: currentWeather.main.humidity,
        cloudCoverage: currentWeather.clouds.all,
        condition: currentWeather.weather[0].main,
        description: currentWeather.weather[0].description,
        sunlightEfficiency: `${currentSunlight}%`,
        windSpeed: currentWeather.wind.speed
      },
      forecast,
      summary: {
        averageSunlight: Math.round(forecast.reduce((sum, f) => sum + parseInt(f.sunlightEfficiency), 0) / forecast.length),
        bestDay: forecast.reduce((best, current) =>
          parseInt(current.sunlightEfficiency) > parseInt(best.sunlightEfficiency) ? current : best
        ),
        worstDay: forecast.reduce((worst, current) =>
          parseInt(current.sunlightEfficiency) < parseInt(worst.sunlightEfficiency) ? current : worst
        )
      }
    };

    sendSuccess(res, result, 'Weather forecast retrieved successfully');
  } catch (error) {
    console.error('Weather forecast error:', error.response?.data || error.message);

    if (error.response?.status === 401) {
      return sendError(res, 'Invalid Weather API key', 401);
    }

    sendError(res, 'Error fetching weather forecast', 500);
  }
};

// @desc    Get sunlight prediction for next 7 days
// @route   GET /api/weather/:city/sunlight
// @access  Public
exports.getSunlightPrediction = async (req, res) => {
  try {
    const { city } = req.params;

    if (!cityCoordinates[city]) {
      return sendError(res, `City '${city}' not supported`, 400);
    }

    const { lat, lon } = cityCoordinates[city];
    const apiKey = process.env.WEATHER_API_KEY || process.env.NEXT_PUBLIC_WEATHER_API_KEY;

    if (!apiKey) {
      // Return simulated data if no API key
      const simulatedData = generateSimulatedSunlight(city);
      return sendSuccess(res, simulatedData, 'Simulated sunlight prediction (no API key)');
    }

    // Fetch forecast
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );

    // Process into simple sunlight predictions
    const dailyData = {};

    response.data.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const day = date.toISOString().split('T')[0];

      if (!dailyData[day]) {
        dailyData[day] = [];
      }

      dailyData[day].push(100 - item.clouds.all);
    });

    const predictions = Object.entries(dailyData).slice(0, 7).map(([date, values], index) => {
      const avgSunlight = Math.round(values.reduce((sum, v) => sum + v, 0) / values.length);
      const dayName = index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : `Day ${index + 1}`;

      return {
        day: dayName,
        date,
        sunlight: `${avgSunlight}%`,
        rating: avgSunlight >= 80 ? 'Excellent' : avgSunlight >= 60 ? 'Good' : avgSunlight >= 40 ? 'Fair' : 'Poor'
      };
    });

    sendSuccess(res, { city, predictions }, 'Sunlight prediction retrieved successfully');
  } catch (error) {
    console.error('Sunlight prediction error:', error);
    sendError(res, 'Error fetching sunlight prediction', 500);
  }
};

// @desc    Get all supported cities
// @route   GET /api/weather/cities
// @access  Public
exports.getSupportedCities = (req, res) => {
  const cities = Object.keys(cityCoordinates).map(city => ({
    name: city,
    coordinates: cityCoordinates[city]
  }));

  sendSuccess(res, { cities }, 'Supported cities retrieved successfully');
};

// Helper function to generate simulated sunlight data
function generateSimulatedSunlight(city) {
  const predictions = [];
  const dayNames = ['Today', 'Tomorrow', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];

  for (let i = 0; i < 7; i++) {
    const baseSunlight = 75 + Math.random() * 20;
    const sunlight = Math.round(baseSunlight);

    predictions.push({
      day: dayNames[i],
      sunlight: `${sunlight}%`,
      rating: sunlight >= 80 ? 'Excellent' : sunlight >= 60 ? 'Good' : 'Fair'
    });
  }

  return { city, predictions, note: 'Simulated data - configure WEATHER_API_KEY for real forecasts' };
}

module.exports = exports;
