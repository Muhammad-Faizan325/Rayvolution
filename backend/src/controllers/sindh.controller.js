const SindhDistrict = require('../models/SindhDistrict.model');
const PowerOutage = require('../models/PowerOutage.model');
const { sendSuccess, sendError } = require('../utils/response.utils');

// @desc    Get all Sindh districts with outage and solar data
// @route   GET /api/sindh/districts
// @access  Public
exports.getAllDistricts = async (req, res) => {
  try {
    const districts = await SindhDistrict.find().sort({ name: 1 });

    // Get active outages count for each district
    const districtsWithOutages = await Promise.all(districts.map(async (district) => {
      const activeOutages = await PowerOutage.countDocuments({
        districtId: district._id,
        status: 'ongoing'
      });

      return {
        ...district.toObject(),
        activeOutagesCount: activeOutages
      };
    }));

    sendSuccess(res, { districts: districtsWithOutages }, 'Sindh districts retrieved successfully');
  } catch (error) {
    console.error('Get districts error:', error);
    sendError(res, 'Error retrieving districts data', 500);
  }
};

// @desc    Get specific district by name
// @route   GET /api/sindh/districts/:name
// @access  Public
exports.getDistrictByName = async (req, res) => {
  try {
    const district = await SindhDistrict.findOne({ name: req.params.name });

    if (!district) {
      return sendError(res, 'District not found', 404);
    }

    // Get recent outages for this district
    const recentOutages = await PowerOutage.find({
      districtId: district._id
    })
      .sort({ startTime: -1 })
      .limit(10)
      .populate('reportedBy', 'name');

    sendSuccess(res, {
      district,
      recentOutages
    }, 'District data retrieved successfully');
  } catch (error) {
    console.error('Get district error:', error);
    sendError(res, 'Error retrieving district data', 500);
  }
};

// @desc    Get map data for Sindh (optimized for map rendering)
// @route   GET /api/sindh/map-data
// @access  Public
exports.getMapData = async (req, res) => {
  try {
    const districts = await SindhDistrict.find()
      .select('name coordinates outageStats solarStats population');

    // Get all active outages
    const activeOutages = await PowerOutage.find({ status: 'ongoing' })
      .select('districtName area coordinates severity startTime affectedPopulation')
      .limit(100);

    const mapData = {
      districts: districts.map(d => ({
        name: d.name,
        coordinates: d.coordinates,
        outageStatus: d.outageStats.currentStatus,
        outageHours: d.outageStats.averageDailyOutageHours,
        solarAdoption: d.solarStats.adoptionRate,
        solarUsers: d.solarStats.totalSolarUsers,
        population: d.population
      })),
      activeOutages: activeOutages.map(o => ({
        district: o.districtName,
        area: o.area,
        coordinates: o.coordinates,
        severity: o.severity,
        startTime: o.startTime,
        affected: o.affectedPopulation
      })),
      summary: {
        totalDistricts: districts.length,
        districtsWithOutages: districts.filter(d => d.outageStats.currentStatus !== 'normal').length,
        totalActiveOutages: activeOutages.length,
        averageSolarAdoption: districts.reduce((sum, d) => sum + d.solarStats.adoptionRate, 0) / districts.length
      }
    };

    sendSuccess(res, mapData, 'Map data retrieved successfully');
  } catch (error) {
    console.error('Get map data error:', error);
    sendError(res, 'Error retrieving map data', 500);
  }
};

// @desc    Get power outages with filters
// @route   GET /api/sindh/outages
// @access  Public
exports.getOutages = async (req, res) => {
  try {
    const { district, status = 'ongoing', limit = 50, page = 1 } = req.query;

    const query = {};
    if (district) query.districtName = district;
    if (status) query.status = status;

    const outages = await PowerOutage.find(query)
      .sort({ startTime: -1 })
      .limit(parseInt(limit))
      .skip((page - 1) * limit)
      .populate('reportedBy', 'name city');

    const total = await PowerOutage.countDocuments(query);

    const response = {
      outages,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };

    sendSuccess(res, response, 'Outages retrieved successfully');
  } catch (error) {
    console.error('Get outages error:', error);
    sendError(res, 'Error retrieving outages', 500);
  }
};

// @desc    Report a power outage
// @route   POST /api/sindh/outages
// @access  Private
exports.reportOutage = async (req, res) => {
  try {
    const {
      districtName,
      area,
      type,
      severity,
      coordinates,
      affectedHouseholds,
      affectedPopulation,
      cause,
      description
    } = req.body;

    // Find district
    const district = await SindhDistrict.findOne({ name: districtName });
    if (!district) {
      return sendError(res, 'District not found', 404);
    }

    // Create outage report
    const outage = await PowerOutage.create({
      districtId: district._id,
      districtName,
      reportedBy: req.user._id,
      area,
      type,
      severity: severity || 'medium',
      coordinates,
      affectedHouseholds: affectedHouseholds || 0,
      affectedPopulation: affectedPopulation || 0,
      cause,
      description
    });

    // Update district outage stats
    district.outageStats.totalOutagesThisMonth += 1;
    district.outageStats.lastOutageDate = new Date();
    district.outageStats.currentStatus = district.getOutageSeverity();
    await district.save();

    sendSuccess(res, { outage }, 'Outage reported successfully', 201);
  } catch (error) {
    console.error('Report outage error:', error);
    sendError(res, 'Error reporting outage', 500);
  }
};

// @desc    Update outage status (resolve/update)
// @route   PUT /api/sindh/outages/:id
// @access  Private
exports.updateOutage = async (req, res) => {
  try {
    const { status, endTime, description } = req.body;

    const outage = await PowerOutage.findById(req.params.id);
    if (!outage) {
      return sendError(res, 'Outage not found', 404);
    }

    if (status) outage.status = status;
    if (endTime) outage.endTime = new Date(endTime);
    if (description) outage.description = description;

    await outage.save();

    // Update district stats if resolved
    if (status === 'resolved') {
      const district = await SindhDistrict.findById(outage.districtId);
      if (district) {
        // Recalculate average outage hours
        const recentOutages = await PowerOutage.find({
          districtId: district._id,
          status: 'resolved',
          duration: { $exists: true, $gt: 0 }
        })
          .sort({ startTime: -1 })
          .limit(30);

        if (recentOutages.length > 0) {
          const avgDuration = recentOutages.reduce((sum, o) => sum + o.duration, 0) / recentOutages.length;
          district.outageStats.averageDailyOutageHours = avgDuration;
        }

        // Check if there are still active outages
        const activeCount = await PowerOutage.countDocuments({
          districtId: district._id,
          status: 'ongoing'
        });

        if (activeCount === 0) {
          district.outageStats.currentStatus = 'normal';
        }

        await district.save();
      }
    }

    sendSuccess(res, { outage }, 'Outage updated successfully');
  } catch (error) {
    console.error('Update outage error:', error);
    sendError(res, 'Error updating outage', 500);
  }
};

// @desc    Add comment to outage
// @route   POST /api/sindh/outages/:id/comments
// @access  Private
exports.addOutageComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return sendError(res, 'Comment text is required', 400);
    }

    const outage = await PowerOutage.findById(req.params.id);
    if (!outage) {
      return sendError(res, 'Outage not found', 404);
    }

    outage.comments.push({
      userId: req.user._id,
      text
    });

    await outage.save();

    sendSuccess(res, { outage }, 'Comment added successfully');
  } catch (error) {
    console.error('Add comment error:', error);
    sendError(res, 'Error adding comment', 500);
  }
};

// @desc    Upvote outage report
// @route   POST /api/sindh/outages/:id/upvote
// @access  Private
exports.upvoteOutage = async (req, res) => {
  try {
    const outage = await PowerOutage.findById(req.params.id);

    if (!outage) {
      return sendError(res, 'Outage not found', 404);
    }

    // Toggle upvote
    if (outage.upvotes.includes(req.user._id)) {
      outage.upvotes = outage.upvotes.filter(id => id.toString() !== req.user._id.toString());
    } else {
      outage.upvotes.push(req.user._id);
    }

    await outage.save();

    sendSuccess(res, { upvotes: outage.upvotes.length }, 'Upvote toggled successfully');
  } catch (error) {
    console.error('Upvote error:', error);
    sendError(res, 'Error upvoting outage', 500);
  }
};

// @desc    Get Sindh province statistics
// @route   GET /api/sindh/stats
// @access  Public
exports.getSindhStats = async (req, res) => {
  try {
    const districts = await SindhDistrict.find();

    const stats = {
      totalDistricts: districts.length,
      totalPopulation: districts.reduce((sum, d) => sum + d.population, 0),
      totalUsers: districts.reduce((sum, d) => sum + d.totalUsers, 0),
      solar: {
        totalSolarUsers: districts.reduce((sum, d) => sum + d.solarStats.totalSolarUsers, 0),
        averageAdoptionRate: districts.reduce((sum, d) => sum + d.solarStats.adoptionRate, 0) / districts.length,
        totalCapacityKW: districts.reduce((sum, d) => sum + d.solarStats.totalCapacityKW, 0),
        energyGeneratedThisMonth: districts.reduce((sum, d) => sum + d.solarStats.energyGeneratedThisMonth, 0),
        co2SavedThisMonth: districts.reduce((sum, d) => sum + d.solarStats.co2SavedThisMonth, 0)
      },
      outages: {
        districtsAffected: districts.filter(d => d.outageStats.currentStatus !== 'normal').length,
        averageDailyOutageHours: districts.reduce((sum, d) => sum + d.outageStats.averageDailyOutageHours, 0) / districts.length,
        totalOutagesThisMonth: districts.reduce((sum, d) => sum + d.outageStats.totalOutagesThisMonth, 0),
        criticalDistricts: districts.filter(d => d.outageStats.currentStatus === 'critical').map(d => d.name)
      },
      topSolarDistricts: districts
        .sort((a, b) => b.solarStats.adoptionRate - a.solarStats.adoptionRate)
        .slice(0, 5)
        .map(d => ({
          name: d.name,
          adoptionRate: d.solarStats.adoptionRate,
          users: d.solarStats.totalSolarUsers
        })),
      mostAffectedByOutages: districts
        .sort((a, b) => b.outageStats.averageDailyOutageHours - a.outageStats.averageDailyOutageHours)
        .slice(0, 5)
        .map(d => ({
          name: d.name,
          outageHours: d.outageStats.averageDailyOutageHours,
          status: d.outageStats.currentStatus
        }))
    };

    sendSuccess(res, stats, 'Sindh statistics retrieved successfully');
  } catch (error) {
    console.error('Get Sindh stats error:', error);
    sendError(res, 'Error retrieving Sindh statistics', 500);
  }
};
