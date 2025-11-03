const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    required: true,
    enum: ['outage', 'solar_usage', 'suggestion', 'issue', 'feedback'],
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  city: {
    type: String,
    required: true,
    enum: ['Karachi', 'Lahore', 'Islamabad', 'Peshawar', 'Quetta', 'Multan', 'Rawalpindi', 'Hyderabad', 'Other']
  },
  location: {
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'reviewing', 'in_progress', 'resolved', 'closed'],
    default: 'pending',
    index: true
  },
  priority: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  },
  metadata: {
    outageDuration: Number, // in hours
    affectedUsers: Number,
    energyAmount: Number,
    imageUrls: [String],
    attachments: [String]
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  resolution: {
    description: String,
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    resolvedAt: Date,
    timeTaken: Number // in hours
  },
  comments: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    text: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  upvotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Calculate resolution time when status changes to resolved
reportSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'resolved' && !this.resolution.resolvedAt) {
    this.resolution.resolvedAt = new Date();
    const timeDiff = this.resolution.resolvedAt - this.createdAt;
    this.resolution.timeTaken = timeDiff / (1000 * 60 * 60); // Convert to hours
  }
  next();
});

module.exports = mongoose.model('Report', reportSchema);
