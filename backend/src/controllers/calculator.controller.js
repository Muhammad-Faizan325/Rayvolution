const SolarCalculation = require('../models/SolarCalculation.model');
const User = require('../models/User.model');
const { sendSuccess, sendError } = require('../utils/response.utils');

// @desc    Calculate solar energy and savings
// @route   POST /api/calculate
// @access  Private
exports.calculateSolar = async (req, res) => {
  try {
    const { panelCapacity, sunlightHours, efficiency = 0.8, city, systemType = 'grid-tied' } = req.body;

    // Validate inputs
    if (!panelCapacity || !sunlightHours || !city) {
      return sendError(res, 'Panel capacity, sunlight hours, and city are required', 400);
    }

    if (panelCapacity < 0.1 || panelCapacity > 1000) {
      return sendError(res, 'Panel capacity must be between 0.1 and 1000 kW', 400);
    }

    if (sunlightHours < 0 || sunlightHours > 14) {
      return sendError(res, 'Sunlight hours must be between 0 and 14', 400);
    }

    if (efficiency < 0.1 || efficiency > 1) {
      return sendError(res, 'Efficiency must be between 0.1 and 1', 400);
    }

    // Calculate solar energy
    const results = SolarCalculation.calculateSolarEnergy({
      panelCapacity,
      sunlightHours,
      efficiency
    });

    // Save calculation to database
    const calculation = await SolarCalculation.create({
      userId: req.user._id,
      panelCapacity,
      sunlightHours,
      efficiency,
      city,
      systemType,
      results
    });

    // Update user stats
    const user = await User.findById(req.user._id);
    if (user) {
      // Award GreenCoins for using calculator
      user.stats.greenCoins += 10;
      await user.save();
    }

    sendSuccess(res, {
      calculation: {
        _id: calculation._id,
        inputs: {
          panelCapacity,
          sunlightHours,
          efficiency,
          city,
          systemType
        },
        ...results
      }
    }, 'Solar energy calculated successfully', 201);
  } catch (error) {
    console.error('Calculate solar error:', error);
    sendError(res, 'Error calculating solar energy', 500);
  }
};

// @desc    Get user's calculation history
// @route   GET /api/calculate/history
// @access  Private
exports.getCalculationHistory = async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;

    const calculations = await SolarCalculation.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((page - 1) * limit)
      .select('-userId -__v');

    const total = await SolarCalculation.countDocuments({ userId: req.user._id });

    const response = {
      calculations,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };

    sendSuccess(res, response, 'Calculation history retrieved successfully');
  } catch (error) {
    console.error('Get calculation history error:', error);
    sendError(res, 'Error retrieving calculation history', 500);
  }
};

// @desc    Get calculation by ID
// @route   GET /api/calculate/:id
// @access  Private
exports.getCalculationById = async (req, res) => {
  try {
    const calculation = await SolarCalculation.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!calculation) {
      return sendError(res, 'Calculation not found', 404);
    }

    sendSuccess(res, { calculation }, 'Calculation retrieved successfully');
  } catch (error) {
    console.error('Get calculation error:', error);
    sendError(res, 'Error retrieving calculation', 500);
  }
};

// @desc    Get recommended solar setup for user
// @route   POST /api/calculate/recommend
// @access  Private
exports.getRecommendation = async (req, res) => {
  try {
    const { monthlyBill, city, roofArea } = req.body;

    if (!monthlyBill || !city) {
      return sendError(res, 'Monthly bill and city are required', 400);
    }

    // Average electricity rate in Pakistan
    const electricityRate = 18; // PKR per kWh

    // Calculate average monthly consumption
    const monthlyConsumption = monthlyBill / electricityRate;
    const dailyConsumption = monthlyConsumption / 30;

    // Average sunlight hours for major Pakistani cities
    const sunlightHoursMap = {
      'Karachi': 9.5,
      'Lahore': 8.5,
      'Islamabad': 8,
      'Peshawar': 8.2,
      'Quetta': 9,
      'Multan': 9.2,
      'Rawalpindi': 8,
      'Hyderabad': 9.3,
      'Faisalabad': 8.7,
      'Sialkot': 8.3
    };

    const sunlightHours = sunlightHoursMap[city] || 8.5;
    const efficiency = 0.8;

    // Calculate required panel capacity
    // dailyConsumption = panelCapacity * sunlightHours * efficiency
    const recommendedCapacity = dailyConsumption / (sunlightHours * efficiency);

    // Round to nearest 0.5 kW
    const roundedCapacity = Math.ceil(recommendedCapacity * 2) / 2;

    // Calculate with recommended setup
    const results = SolarCalculation.calculateSolarEnergy({
      panelCapacity: roundedCapacity,
      sunlightHours,
      efficiency
    });

    // Calculate payback period (typical system cost is ~150,000 PKR per kW in Pakistan)
    const systemCost = roundedCapacity * 150000;
    const paybackMonths = Math.ceil(systemCost / results.costSavingPerMonth);
    const paybackYears = Math.round((paybackMonths / 12) * 10) / 10;

    // Calculate number of panels (typical 350W panel)
    const numberOfPanels = Math.ceil((roundedCapacity * 1000) / 350);

    // Estimate required roof area (typical panel: 2m²)
    const requiredRoofArea = numberOfPanels * 2;

    const recommendation = {
      inputs: {
        monthlyBill,
        monthlyConsumption: Math.round(monthlyConsumption),
        dailyConsumption: Math.round(dailyConsumption * 100) / 100,
        city,
        sunlightHours,
        roofArea
      },
      recommendation: {
        panelCapacity: roundedCapacity,
        numberOfPanels,
        requiredRoofArea,
        estimatedCost: systemCost,
        paybackPeriod: {
          months: paybackMonths,
          years: paybackYears
        }
      },
      projections: results,
      suitability: roofArea ? (roofArea >= requiredRoofArea ? 'Excellent' : 'Limited') : 'Unknown',
      notes: [
        `You need approximately ${roundedCapacity} kW solar system`,
        `This requires ${numberOfPanels} solar panels`,
        `Estimated installation cost: PKR ${systemCost.toLocaleString()}`,
        `Payback period: ${paybackYears} years`,
        `You'll save PKR ${results.costSavingPerYear.toLocaleString()} per year`,
        roofArea && roofArea < requiredRoofArea ?
          `Warning: Required ${requiredRoofArea}m² but only ${roofArea}m² available` :
          null
      ].filter(Boolean)
    };

    sendSuccess(res, recommendation, 'Solar recommendation generated successfully');
  } catch (error) {
    console.error('Get recommendation error:', error);
    sendError(res, 'Error generating recommendation', 500);
  }
};

// @desc    Compare different solar setups
// @route   POST /api/calculate/compare
// @access  Public
exports.compareSetups = async (req, res) => {
  try {
    const { city, sunlightHours = 8.5 } = req.body;

    const commonSetups = [
      { capacity: 3, name: 'Small Home (3kW)' },
      { capacity: 5, name: 'Medium Home (5kW)' },
      { capacity: 10, name: 'Large Home (10kW)' },
      { capacity: 15, name: 'Small Business (15kW)' },
      { capacity: 25, name: 'Medium Business (25kW)' }
    ];

    const comparisons = commonSetups.map(setup => {
      const results = SolarCalculation.calculateSolarEnergy({
        panelCapacity: setup.capacity,
        sunlightHours,
        efficiency: 0.8
      });

      return {
        name: setup.name,
        capacity: setup.capacity,
        ...results,
        estimatedCost: setup.capacity * 150000
      };
    });

    sendSuccess(res, {
      city,
      sunlightHours,
      comparisons
    }, 'Setup comparisons generated successfully');
  } catch (error) {
    console.error('Compare setups error:', error);
    sendError(res, 'Error comparing setups', 500);
  }
};
