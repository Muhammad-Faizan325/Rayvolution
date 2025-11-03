const mongoose = require('mongoose');

const solarCalculationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  // Input parameters
  panelCapacity: {
    type: Number,
    required: true,
    min: 0.1,
    max: 1000 // kW
  },
  sunlightHours: {
    type: Number,
    required: true,
    min: 0,
    max: 14
  },
  efficiency: {
    type: Number,
    required: true,
    min: 0.1,
    max: 1,
    default: 0.8
  },
  city: {
    type: String,
    required: true
  },
  systemType: {
    type: String,
    enum: ['grid-tied', 'off-grid', 'hybrid'],
    default: 'grid-tied'
  },
  // Calculated results
  results: {
    energyPerDay: {
      type: Number,
      required: true
    },
    energyPerMonth: {
      type: Number,
      required: true
    },
    energyPerYear: {
      type: Number,
      required: true
    },
    costSavingPKR: {
      type: Number,
      required: true
    },
    costSavingPerMonth: {
      type: Number,
      required: true
    },
    costSavingPerYear: {
      type: Number,
      required: true
    },
    co2ReducedKG: {
      type: Number,
      required: true
    },
    co2ReducedPerMonth: {
      type: Number,
      required: true
    },
    co2ReducedPerYear: {
      type: Number,
      required: true
    },
    treesEquivalent: {
      type: Number,
      required: true
    }
  },
  // Additional metadata
  electricityRate: {
    type: Number,
    default: 18 // PKR per kWh
  },
  carbonIntensity: {
    type: Number,
    default: 0.85 // kg CO2 per kWh
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

// Index for efficient querying
solarCalculationSchema.index({ userId: 1, createdAt: -1 });

// Static method to calculate solar energy
solarCalculationSchema.statics.calculateSolarEnergy = function(params) {
  const { panelCapacity, sunlightHours, efficiency, electricityRate = 18, carbonIntensity = 0.85 } = params;

  // Energy calculations (in kWh)
  const energyPerDay = panelCapacity * sunlightHours * efficiency;
  const energyPerMonth = energyPerDay * 30;
  const energyPerYear = energyPerDay * 365;

  // Cost savings (in PKR)
  const costSavingPKR = energyPerDay * electricityRate;
  const costSavingPerMonth = energyPerMonth * electricityRate;
  const costSavingPerYear = energyPerYear * electricityRate;

  // CO2 reduction (in kg)
  const co2ReducedKG = energyPerDay * carbonIntensity;
  const co2ReducedPerMonth = energyPerMonth * carbonIntensity;
  const co2ReducedPerYear = energyPerYear * carbonIntensity;

  // Trees equivalent (1 tree absorbs ~21 kg CO2/year)
  const treesEquivalent = Math.round(co2ReducedPerYear / 21);

  return {
    energyPerDay: Math.round(energyPerDay * 100) / 100,
    energyPerMonth: Math.round(energyPerMonth * 100) / 100,
    energyPerYear: Math.round(energyPerYear * 100) / 100,
    costSavingPKR: Math.round(costSavingPKR),
    costSavingPerMonth: Math.round(costSavingPerMonth),
    costSavingPerYear: Math.round(costSavingPerYear),
    co2ReducedKG: Math.round(co2ReducedKG * 100) / 100,
    co2ReducedPerMonth: Math.round(co2ReducedPerMonth * 100) / 100,
    co2ReducedPerYear: Math.round(co2ReducedPerYear * 100) / 100,
    treesEquivalent
  };
};

module.exports = mongoose.model('SolarCalculation', solarCalculationSchema);
