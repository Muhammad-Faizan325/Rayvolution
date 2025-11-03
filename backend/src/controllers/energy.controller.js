const Energy = require('../models/Energy.model');
const CityData = require('../models/CityData.model');
const User = require('../models/User.model');
const { sendSuccess, sendError, sendPaginatedResponse } = require('../utils/response.utils');

// @desc    Record energy data
// @route   POST /api/energy
// @access  Private
exports.recordEnergy = async (req, res) => {
  try {
    const { city, type, amount, source, metadata } = req.body;

    const energyRecord = await Energy.create({
      userId: req.user._id,
      city,
      type,
      amount,
      source,
      metadata
    });

    // Update user stats
    const user = await User.findById(req.user._id);
    if (type === 'savings' || type === 'production') {
      user.stats.energySaved += amount;
      user.stats.co2Reduced += amount * 0.5; // Rough estimate: 1 kWh = 0.5 kg CO2
      user.stats.energyTokens += amount; // Earn tokens for savings
      user.stats.greenCoins += Math.floor(amount * 2); // Earn coins
    }
    user.calculateSustainabilityScore();
    await user.save();

    // Update city data
    let cityData = await CityData.findOne({ name: city });
    if (cityData) {
      if (type === 'savings' || type === 'production') {
        cityData.totalEnergySaved += amount;
        cityData.totalCO2Reduced += amount * 0.5;
      }
      if (user.solarPanels && !cityData.solarUsers.includes(req.user._id)) {
        cityData.solarUsers += 1;
      }
      cityData.updateAdoptionRate();
      await cityData.save();
    }

    sendSuccess(res, { energyRecord, stats: user.stats }, 'Energy data recorded successfully', 201);
  } catch (error) {
    console.error('Record energy error:', error);
    sendError(res, 'Error recording energy data', 500);
  }
};

// @desc    Get user energy history
// @route   GET /api/energy/user/:userId
// @access  Private
exports.getUserEnergyHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 50, type, startDate, endDate } = req.query;

    // Build query
    const query = { userId };
    if (type) query.type = type;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const energyRecords = await Energy.find(query)
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Energy.countDocuments(query);

    sendPaginatedResponse(res, energyRecords, page, limit, total, 'Energy history retrieved successfully');
  } catch (error) {
    console.error('Get energy history error:', error);
    sendError(res, 'Error retrieving energy history', 500);
  }
};

// @desc    Get all city data
// @route   GET /api/energy/cities
// @access  Public
exports.getAllCities = async (req, res) => {
  try {
    const cities = await CityData.find().sort({ adoptionRate: -1 });
    sendSuccess(res, { cities }, 'Cities data retrieved successfully');
  } catch (error) {
    console.error('Get cities error:', error);
    sendError(res, 'Error retrieving cities data', 500);
  }
};

// @desc    Get specific city data
// @route   GET /api/energy/cities/:name
// @access  Public
exports.getCityByName = async (req, res) => {
  try {
    const city = await CityData.findOne({ name: req.params.name });

    if (!city) {
      return sendError(res, 'City not found', 404);
    }

    sendSuccess(res, { city }, 'City data retrieved successfully');
  } catch (error) {
    console.error('Get city error:', error);
    sendError(res, 'Error retrieving city data', 500);
  }
};

// @desc    Get national statistics
// @route   GET /api/energy/national
// @access  Public
exports.getNationalStats = async (req, res) => {
  try {
    const cities = await CityData.find();

    const stats = {
      totalUsers: 0,
      totalSolarUsers: 0,
      totalEnergySaved: 0,
      totalCO2Reduced: 0,
      averageAdoptionRate: 0,
      topCities: []
    };

    cities.forEach(city => {
      stats.totalUsers += city.totalUsers;
      stats.totalSolarUsers += city.solarUsers;
      stats.totalEnergySaved += city.totalEnergySaved;
      stats.totalCO2Reduced += city.totalCO2Reduced;
    });

    if (cities.length > 0) {
      stats.averageAdoptionRate = cities.reduce((sum, city) => sum + city.adoptionRate, 0) / cities.length;
    }

    stats.topCities = cities
      .sort((a, b) => b.adoptionRate - a.adoptionRate)
      .slice(0, 5)
      .map(city => ({
        name: city.name,
        adoptionRate: city.adoptionRate,
        energySaved: city.totalEnergySaved,
        users: city.totalUsers
      }));

    sendSuccess(res, stats, 'National statistics retrieved successfully');
  } catch (error) {
    console.error('Get national stats error:', error);
    sendError(res, 'Error retrieving national statistics', 500);
  }
};

// @desc    Get energy trends
// @route   GET /api/energy/trends
// @access  Public
exports.getEnergyTrends = async (req, res) => {
  try {
    const { city, days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const query = { date: { $gte: startDate } };
    if (city) query.city = city;

    const trends = await Energy.aggregate([
      { $match: query },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
            type: '$type'
          },
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.date': 1 } }
    ]);

    sendSuccess(res, { trends }, 'Energy trends retrieved successfully');
  } catch (error) {
    console.error('Get trends error:', error);
    sendError(res, 'Error retrieving energy trends', 500);
  }
};
