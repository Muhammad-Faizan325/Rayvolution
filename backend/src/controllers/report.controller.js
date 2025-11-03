const Report = require('../models/Report.model');
const User = require('../models/User.model');
const { sendSuccess, sendError, sendPaginatedResponse } = require('../utils/response.utils');

// @desc    Create new report
// @route   POST /api/reports
// @access  Private
exports.createReport = async (req, res) => {
  try {
    const { type, title, description, city, location, severity, metadata } = req.body;

    const report = await Report.create({
      userId: req.user._id,
      type,
      title,
      description,
      city,
      location,
      severity: severity || 'medium',
      metadata
    });

    // Award GreenCoins for reporting
    const user = await User.findById(req.user._id);
    user.stats.greenCoins += 10;
    await user.save();

    sendSuccess(res, { report }, 'Report created successfully', 201);
  } catch (error) {
    console.error('Create report error:', error);
    sendError(res, 'Error creating report', 500);
  }
};

// @desc    Get user's reports
// @route   GET /api/reports/user/:userId
// @access  Private
exports.getUserReports = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, type } = req.query;

    const query = { userId: req.params.userId };
    if (status) query.status = status;
    if (type) query.type = type;

    const reports = await Report.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Report.countDocuments(query);

    sendPaginatedResponse(res, reports, page, limit, total, 'User reports retrieved successfully');
  } catch (error) {
    console.error('Get user reports error:', error);
    sendError(res, 'Error retrieving user reports', 500);
  }
};

// @desc    Get report by ID
// @route   GET /api/reports/:id
// @access  Private
exports.getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('userId', 'name email city')
      .populate('assignedTo', 'name email')
      .populate('comments.userId', 'name')
      .populate('resolution.resolvedBy', 'name');

    if (!report) {
      return sendError(res, 'Report not found', 404);
    }

    sendSuccess(res, { report }, 'Report retrieved successfully');
  } catch (error) {
    console.error('Get report error:', error);
    sendError(res, 'Error retrieving report', 500);
  }
};

// @desc    Update report
// @route   PUT /api/reports/:id
// @access  Private (own reports only)
exports.updateReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return sendError(res, 'Report not found', 404);
    }

    // Check authorization
    if (report.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return sendError(res, 'Not authorized to update this report', 403);
    }

    const { title, description, severity, metadata } = req.body;

    if (title) report.title = title;
    if (description) report.description = description;
    if (severity) report.severity = severity;
    if (metadata) report.metadata = { ...report.metadata, ...metadata };

    await report.save();

    sendSuccess(res, { report }, 'Report updated successfully');
  } catch (error) {
    console.error('Update report error:', error);
    sendError(res, 'Error updating report', 500);
  }
};

// @desc    Add comment to report
// @route   POST /api/reports/:id/comments
// @access  Private
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return sendError(res, 'Comment text is required', 400);
    }

    const report = await Report.findById(req.params.id);

    if (!report) {
      return sendError(res, 'Report not found', 404);
    }

    report.comments.push({
      userId: req.user._id,
      text
    });

    await report.save();

    sendSuccess(res, { report }, 'Comment added successfully');
  } catch (error) {
    console.error('Add comment error:', error);
    sendError(res, 'Error adding comment', 500);
  }
};

// @desc    Upvote report
// @route   POST /api/reports/:id/upvote
// @access  Private
exports.upvoteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return sendError(res, 'Report not found', 404);
    }

    // Check if already upvoted
    if (report.upvotes.includes(req.user._id)) {
      // Remove upvote
      report.upvotes = report.upvotes.filter(id => id.toString() !== req.user._id.toString());
    } else {
      // Add upvote
      report.upvotes.push(req.user._id);
    }

    await report.save();

    sendSuccess(res, { upvotes: report.upvotes.length }, 'Upvote toggled successfully');
  } catch (error) {
    console.error('Upvote error:', error);
    sendError(res, 'Error upvoting report', 500);
  }
};

// @desc    Delete report
// @route   DELETE /api/reports/:id
// @access  Private (own reports or admin)
exports.deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return sendError(res, 'Report not found', 404);
    }

    // Check authorization
    if (report.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return sendError(res, 'Not authorized to delete this report', 403);
    }

    await report.deleteOne();

    sendSuccess(res, null, 'Report deleted successfully');
  } catch (error) {
    console.error('Delete report error:', error);
    sendError(res, 'Error deleting report', 500);
  }
};
