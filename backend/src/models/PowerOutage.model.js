const mongoose = require('mongoose');

const powerOutageSchema = new mongoose.Schema({
  districtId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SindhDistrict',
    required: true,
    index: true
  },
  districtName: {
    type: String,
    required: true
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  // Outage details
  type: {
    type: String,
    enum: ['scheduled', 'unscheduled', 'load_shedding'],
    required: true
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['ongoing', 'resolved', 'scheduled'],
    default: 'ongoing',
    index: true
  },
  // Location details
  area: {
    type: String,
    required: true
  },
  coordinates: {
    lat: Number,
    lng: Number
  },
  // Time details
  startTime: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },
  endTime: Date,
  duration: {
    type: Number, // in hours
    default: 0
  },
  // Impact assessment
  affectedHouseholds: {
    type: Number,
    default: 0
  },
  affectedPopulation: {
    type: Number,
    default: 0
  },
  affectedBusinesses: {
    type: Number,
    default: 0
  },
  // Additional info
  cause: {
    type: String,
    enum: [
      'technical_fault',
      'maintenance',
      'overload',
      'weather',
      'fuel_shortage',
      'transmission_failure',
      'unknown'
    ]
  },
  description: String,
  officialNotice: String,
  // Community engagement
  upvotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
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
  // Verification
  verified: {
    type: Boolean,
    default: false
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Calculate duration when outage ends
powerOutageSchema.pre('save', function(next) {
  if (this.status === 'resolved' && this.endTime && this.startTime) {
    const diff = this.endTime - this.startTime;
    this.duration = diff / (1000 * 60 * 60); // Convert to hours
  }
  next();
});

// Index for efficient querying
powerOutageSchema.index({ districtId: 1, startTime: -1 });
powerOutageSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('PowerOutage', powerOutageSchema);
