const mongoose = require('mongoose');

const energySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  city: {
    type: String,
    required: true,
    enum: ['Karachi', 'Lahore', 'Islamabad', 'Peshawar', 'Quetta', 'Multan', 'Rawalpindi', 'Hyderabad', 'Other']
  },
  type: {
    type: String,
    required: true,
    enum: ['usage', 'savings', 'production']
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    default: 'kWh',
    enum: ['kWh', 'MWh']
  },
  source: {
    type: String,
    enum: ['solar', 'grid', 'hybrid', 'other'],
    default: 'grid'
  },
  date: {
    type: Date,
    default: Date.now,
    index: true
  },
  metadata: {
    temperature: Number,
    sunlightHours: Number,
    weatherCondition: String,
    panelEfficiency: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient querying
energySchema.index({ userId: 1, date: -1 });
energySchema.index({ city: 1, date: -1 });

module.exports = mongoose.model('Energy', energySchema);
