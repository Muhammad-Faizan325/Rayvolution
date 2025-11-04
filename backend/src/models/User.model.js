const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false // Don't return password by default
  },
  phone: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    enum: ['Karachi', 'Lahore', 'Islamabad', 'Peshawar', 'Quetta', 'Multan', 'Rawalpindi', 'Hyderabad', 'Other']
  },
  solarPanels: {
    type: Boolean,
    default: false
  },
  energyGoal: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  stats: {
    energySaved: {
      type: Number,
      default: 0,
      min: 0
    },
    co2Reduced: {
      type: Number,
      default: 0,
      min: 0
    },
    greenCoins: {
      type: Number,
      default: 100, // Starting bonus
      min: 0
    },
    streak: {
      type: Number,
      default: 0,
      min: 0
    },
    lastStreakUpdate: {
      type: Date,
      default: Date.now
    }
  },
  achievements: [{
    type: String,
    enum: [
      'first_login',
      'week_streak',
      'month_streak',
      'solar_adopter',
      'energy_saver',
      'challenge_master',
      'eco_warrior'
    ]
  }],
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  refreshToken: {
    type: String,
    select: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to update streak
userSchema.methods.updateStreak = function() {
  const now = new Date();
  const lastUpdate = new Date(this.stats.lastStreakUpdate);
  const hoursDiff = (now - lastUpdate) / (1000 * 60 * 60);

  if (hoursDiff >= 24 && hoursDiff < 48) {
    // Continue streak
    this.stats.streak += 1;
    this.stats.lastStreakUpdate = now;
  } else if (hoursDiff >= 48) {
    // Reset streak
    this.stats.streak = 1;
    this.stats.lastStreakUpdate = now;
  }

  return this.stats.streak;
};

// Remove sensitive data when converting to JSON
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.refreshToken;
  delete user.__v;
  return user;
};

module.exports = mongoose.model('User', userSchema);
