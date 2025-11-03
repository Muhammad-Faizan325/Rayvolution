const mongoose = require('mongoose');

const cityDataSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    enum: ['Karachi', 'Lahore', 'Islamabad', 'Peshawar', 'Quetta', 'Multan', 'Rawalpindi', 'Hyderabad']
  },
  adoptionRate: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 0
  },
  sunlightHours: {
    type: Number,
    required: true,
    min: 0,
    max: 24,
    default: 8
  },
  powerShortage: {
    type: Number,
    required: true,
    min: 0,
    max: 24,
    default: 0
  },
  totalUsers: {
    type: Number,
    default: 0,
    min: 0
  },
  solarUsers: {
    type: Number,
    default: 0,
    min: 0
  },
  totalEnergySaved: {
    type: Number,
    default: 0,
    min: 0
  },
  totalCO2Reduced: {
    type: Number,
    default: 0,
    min: 0
  },
  coordinates: {
    lat: Number,
    lng: Number
  },
  population: {
    type: Number,
    default: 0
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Calculate adoption rate based on users
cityDataSchema.methods.updateAdoptionRate = function() {
  if (this.totalUsers > 0) {
    this.adoptionRate = (this.solarUsers / this.totalUsers) * 100;
  }
  return this.adoptionRate;
};

module.exports = mongoose.model('CityData', cityDataSchema);
