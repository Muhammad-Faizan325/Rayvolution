const mongoose = require('mongoose');

const sindhDistrictSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  nameUrdu: {
    type: String
  },
  division: {
    type: String,
    required: true,
    enum: ['Karachi', 'Hyderabad', 'Sukkur', 'Mirpurkhas', 'Larkana', 'Shaheed Benazirabad']
  },
  coordinates: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  },
  // Electricity outage data
  outageStats: {
    currentStatus: {
      type: String,
      enum: ['normal', 'minor_outage', 'major_outage', 'critical'],
      default: 'normal'
    },
    averageDailyOutageHours: {
      type: Number,
      default: 0,
      min: 0,
      max: 24
    },
    lastOutageDate: Date,
    totalOutagesThisMonth: {
      type: Number,
      default: 0
    },
    affectedPopulation: {
      type: Number,
      default: 0
    }
  },
  // Solar energy data
  solarStats: {
    adoptionRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    totalSolarUsers: {
      type: Number,
      default: 0
    },
    totalCapacityKW: {
      type: Number,
      default: 0
    },
    energyGeneratedToday: {
      type: Number,
      default: 0
    },
    energyGeneratedThisMonth: {
      type: Number,
      default: 0
    },
    co2SavedThisMonth: {
      type: Number,
      default: 0
    }
  },
  // General stats
  population: {
    type: Number,
    default: 0
  },
  totalUsers: {
    type: Number,
    default: 0
  },
  sunlightHours: {
    type: Number,
    default: 8,
    min: 0,
    max: 14
  },
  // Geographic data for map rendering
  bounds: {
    north: Number,
    south: Number,
    east: Number,
    west: Number
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Method to update solar adoption rate
sindhDistrictSchema.methods.updateAdoptionRate = function() {
  if (this.totalUsers > 0) {
    this.solarStats.adoptionRate = (this.solarStats.totalSolarUsers / this.totalUsers) * 100;
  }
  return this.solarStats.adoptionRate;
};

// Method to get outage severity level
sindhDistrictSchema.methods.getOutageSeverity = function() {
  const hours = this.outageStats.averageDailyOutageHours;
  if (hours === 0) return 'normal';
  if (hours < 4) return 'minor_outage';
  if (hours < 8) return 'major_outage';
  return 'critical';
};

module.exports = mongoose.model('SindhDistrict', sindhDistrictSchema);
