const User = require('../models/User.model');
const Report = require('../models/Report.model');
const CityData = require('../models/CityData.model');
const Energy = require('../models/Energy.model');
const { Challenge } = require('../models/Challenge.model');
const { MarketplaceListing, Transaction } = require('../models/Marketplace.model');
const { sendSuccess, sendError } = require('../utils/response.utils');

// @desc    Get system analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
exports.getSystemAnalytics = async (req, res) => {
  try {
    // User statistics
    const totalUsers = await User.countDocuments();
    const solarUsers = await User.countDocuments({ solarPanels: true });
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: new Date(new Date().setDate(1)) }
    });

    // Report statistics
    const totalReports = await Report.countDocuments();
    const activeReports = await Report.countDocuments({ status: { $in: ['pending', 'reviewing', 'in_progress'] } });
    const resolvedReports = await Report.countDocuments({ status: 'resolved' });

    // Calculate average resolution time
    const resolvedReportsWithTime = await Report.find({
      status: 'resolved',
      'resolution.timeTaken': { $exists: true }
    }).select('resolution.timeTaken');

    let avgResolutionTime = 0;
    if (resolvedReportsWithTime.length > 0) {
      const totalTime = resolvedReportsWithTime.reduce((sum, report) => sum + report.resolution.timeTaken, 0);
      avgResolutionTime = totalTime / resolvedReportsWithTime.length;
    }

    // Energy statistics
    const totalEnergySaved = await Energy.aggregate([
      { $match: { type: { $in: ['savings', 'production'] } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // City data
    const cityStats = await CityData.find().sort({ adoptionRate: -1 });

    // Challenge statistics
    const activeChallenges = await Challenge.countDocuments({ isActive: true, endDate: { $gte: new Date() } });

    // Marketplace statistics
    const activeListings = await MarketplaceListing.countDocuments({ status: 'active' });
    const totalTransactions = await Transaction.countDocuments();

    // Recent activity
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(10).select('name email city createdAt');
    const recentReports = await Report.find().sort({ createdAt: -1 }).limit(10).populate('userId', 'name city');

    const analytics = {
      users: {
        total: totalUsers,
        solarAdopters: solarUsers,
        adoptionRate: totalUsers > 0 ? (solarUsers / totalUsers * 100).toFixed(2) : 0,
        newThisMonth: newUsersThisMonth
      },
      reports: {
        total: totalReports,
        active: activeReports,
        resolved: resolvedReports,
        avgResolutionTime: avgResolutionTime.toFixed(2)
      },
      energy: {
        totalSaved: totalEnergySaved.length > 0 ? totalEnergySaved[0].total : 0,
        totalCO2Reduced: totalEnergySaved.length > 0 ? totalEnergySaved[0].total * 0.5 : 0
      },
      cities: cityStats.map(city => ({
        name: city.name,
        adoptionRate: city.adoptionRate,
        users: city.totalUsers,
        solarUsers: city.solarUsers,
        energySaved: city.totalEnergySaved
      })),
      challenges: {
        active: activeChallenges
      },
      marketplace: {
        activeListings,
        totalTransactions
      },
      recentActivity: {
        users: recentUsers,
        reports: recentReports
      }
    };

    sendSuccess(res, analytics, 'System analytics retrieved successfully');
  } catch (error) {
    console.error('Get analytics error:', error);
    sendError(res, 'Error retrieving analytics', 500);
  }
};

// @desc    Get all reports (admin)
// @route   GET /api/admin/reports
// @access  Private/Admin
exports.getAllReports = async (req, res) => {
  try {
    const { page = 1, limit = 50, status, type, severity, city } = req.query;

    const query = {};
    if (status) query.status = status;
    if (type) query.type = type;
    if (severity) query.severity = severity;
    if (city) query.city = city;

    const reports = await Report.find(query)
      .populate('userId', 'name email city')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Report.countDocuments(query);

    const response = {
      reports,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };

    sendSuccess(res, response, 'Reports retrieved successfully');
  } catch (error) {
    console.error('Get all reports error:', error);
    sendError(res, 'Error retrieving reports', 500);
  }
};

// @desc    Update report status (admin)
// @route   PUT /api/admin/reports/:id/status
// @access  Private/Admin
exports.updateReportStatus = async (req, res) => {
  try {
    const { status, priority, assignedTo, resolution } = req.body;

    const report = await Report.findById(req.params.id);

    if (!report) {
      return sendError(res, 'Report not found', 404);
    }

    if (status) report.status = status;
    if (priority) report.priority = priority;
    if (assignedTo) report.assignedTo = assignedTo;

    if (status === 'resolved' && resolution) {
      report.resolution.description = resolution.description;
      report.resolution.resolvedBy = req.user._id;
    }

    await report.save();

    sendSuccess(res, { report }, 'Report status updated successfully');
  } catch (error) {
    console.error('Update report status error:', error);
    sendError(res, 'Error updating report status', 500);
  }
};

// @desc    Get all users (admin)
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 50, city, solarPanels, role } = req.query;

    const query = {};
    if (city) query.city = city;
    if (solarPanels !== undefined) query.solarPanels = solarPanels === 'true';
    if (role) query.role = role;

    const users = await User.find(query)
      .select('-password -refreshToken')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    const response = {
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };

    sendSuccess(res, response, 'Users retrieved successfully');
  } catch (error) {
    console.error('Get all users error:', error);
    sendError(res, 'Error retrieving users', 500);
  }
};

// @desc    Update user role (admin)
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return sendError(res, 'Invalid role', 400);
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password -refreshToken');

    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    sendSuccess(res, { user }, 'User role updated successfully');
  } catch (error) {
    console.error('Update user role error:', error);
    sendError(res, 'Error updating user role', 500);
  }
};

// @desc    Update city data (admin)
// @route   PUT /api/admin/cities/:name
// @access  Private/Admin
exports.updateCityData = async (req, res) => {
  try {
    const { adoptionRate, sunlightHours, powerShortage, population } = req.body;

    const city = await CityData.findOne({ name: req.params.name });

    if (!city) {
      return sendError(res, 'City not found', 404);
    }

    if (adoptionRate !== undefined) city.adoptionRate = adoptionRate;
    if (sunlightHours !== undefined) city.sunlightHours = sunlightHours;
    if (powerShortage !== undefined) city.powerShortage = powerShortage;
    if (population !== undefined) city.population = population;

    await city.save();

    sendSuccess(res, { city }, 'City data updated successfully');
  } catch (error) {
    console.error('Update city data error:', error);
    sendError(res, 'Error updating city data', 500);
  }
};

// @desc    Export data as CSV
// @route   GET /api/admin/export/:type
// @access  Private/Admin
exports.exportData = async (req, res) => {
  try {
    const { type } = req.params;

    let data = [];
    let headers = '';

    switch (type) {
      case 'users':
        data = await User.find().select('-password -refreshToken');
        break;
      case 'reports':
        data = await Report.find().populate('userId', 'name email');
        break;
      case 'energy':
        data = await Energy.find().populate('userId', 'name');
        break;
      case 'cities':
        data = await CityData.find();
        break;
      default:
        return sendError(res, 'Invalid export type', 400);
    }

    sendSuccess(res, { data, count: data.length }, `${type} data exported successfully`);
  } catch (error) {
    console.error('Export data error:', error);
    sendError(res, 'Error exporting data', 500);
  }
};
