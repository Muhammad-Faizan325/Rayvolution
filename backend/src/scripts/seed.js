const mongoose = require('mongoose');
const User = require('../models/User.model');
const CityData = require('../models/CityData.model');
const { Challenge } = require('../models/Challenge.model');
require('dotenv').config();

// City coordinates and data
const citiesData = [
  {
    name: 'Karachi',
    adoptionRate: 28,
    sunlightHours: 9.5,
    powerShortage: 6,
    totalUsers: 0,
    solarUsers: 0,
    totalEnergySaved: 0,
    totalCO2Reduced: 0,
    coordinates: { lat: 24.8607, lng: 67.0011 },
    population: 16000000
  },
  {
    name: 'Lahore',
    adoptionRate: 35,
    sunlightHours: 8.5,
    powerShortage: 5,
    totalUsers: 0,
    solarUsers: 0,
    totalEnergySaved: 0,
    totalCO2Reduced: 0,
    coordinates: { lat: 31.5497, lng: 74.3436 },
    population: 13000000
  },
  {
    name: 'Islamabad',
    adoptionRate: 42,
    sunlightHours: 8,
    powerShortage: 3,
    totalUsers: 0,
    solarUsers: 0,
    totalEnergySaved: 0,
    totalCO2Reduced: 0,
    coordinates: { lat: 33.6844, lng: 73.0479 },
    population: 1200000
  },
  {
    name: 'Peshawar',
    adoptionRate: 22,
    sunlightHours: 8.2,
    powerShortage: 7,
    totalUsers: 0,
    solarUsers: 0,
    totalEnergySaved: 0,
    totalCO2Reduced: 0,
    coordinates: { lat: 34.0151, lng: 71.5249 },
    population: 2500000
  },
  {
    name: 'Quetta',
    adoptionRate: 18,
    sunlightHours: 9,
    powerShortage: 8,
    totalUsers: 0,
    solarUsers: 0,
    totalEnergySaved: 0,
    totalCO2Reduced: 0,
    coordinates: { lat: 30.1798, lng: 66.9750 },
    population: 1200000
  },
  {
    name: 'Multan',
    adoptionRate: 25,
    sunlightHours: 9.2,
    powerShortage: 6,
    totalUsers: 0,
    solarUsers: 0,
    totalEnergySaved: 0,
    totalCO2Reduced: 0,
    coordinates: { lat: 30.1575, lng: 71.5249 },
    population: 2300000
  },
  {
    name: 'Rawalpindi',
    adoptionRate: 31,
    sunlightHours: 8,
    powerShortage: 4,
    totalUsers: 0,
    solarUsers: 0,
    totalEnergySaved: 0,
    totalCO2Reduced: 0,
    coordinates: { lat: 33.5651, lng: 73.0169 },
    population: 2400000
  },
  {
    name: 'Hyderabad',
    adoptionRate: 20,
    sunlightHours: 9.3,
    powerShortage: 7,
    totalUsers: 0,
    solarUsers: 0,
    totalEnergySaved: 0,
    totalCO2Reduced: 0,
    coordinates: { lat: 25.3792, lng: 68.3683 },
    population: 1800000
  }
];

// Sample challenges
const challengesData = [
  {
    title: 'Energy Saver Beginner',
    description: 'Save 50 kWh of energy this week',
    type: 'weekly',
    category: 'energy_saving',
    target: 50,
    unit: 'kWh',
    reward: {
      greenCoins: 100,
      energyTokens: 10
    },
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    difficulty: 'easy',
    icon: '⚡'
  },
  {
    title: 'Daily Login Streak',
    description: 'Login for 7 consecutive days',
    type: 'weekly',
    category: 'streak',
    target: 7,
    unit: 'days',
    reward: {
      greenCoins: 150,
      achievement: 'week_streak'
    },
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    difficulty: 'easy',
    icon: '🔥'
  },
  {
    title: 'Community Helper',
    description: 'Help others by upvoting 10 reports',
    type: 'weekly',
    category: 'community',
    target: 10,
    unit: 'actions',
    reward: {
      greenCoins: 80,
      achievement: 'community_helper'
    },
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    difficulty: 'medium',
    icon: '🤝'
  },
  {
    title: 'Solar Champion',
    description: 'Generate 200 kWh using solar panels',
    type: 'monthly',
    category: 'energy_saving',
    target: 200,
    unit: 'kWh',
    reward: {
      greenCoins: 500,
      energyTokens: 50,
      achievement: 'solar_adopter'
    },
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    difficulty: 'hard',
    icon: '☀️'
  },
  {
    title: 'Marketplace Trader',
    description: 'Complete 5 marketplace transactions',
    type: 'monthly',
    category: 'marketplace',
    target: 5,
    unit: 'trades',
    reward: {
      greenCoins: 200,
      achievement: 'marketplace_trader'
    },
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    difficulty: 'medium',
    icon: '💰'
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await CityData.deleteMany({});
    await Challenge.deleteMany({});

    // Seed city data
    console.log('🌆 Seeding city data...');
    await CityData.insertMany(citiesData);
    console.log(`✅ Seeded ${citiesData.length} cities`);

    // Seed challenges
    console.log('🎯 Seeding challenges...');
    await Challenge.insertMany(challengesData);
    console.log(`✅ Seeded ${challengesData.length} challenges`);

    // Create admin user if doesn't exist
    console.log('👤 Creating admin user...');
    const adminExists = await User.findOne({ email: 'admin@rayvolution.com' });

    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: 'admin@rayvolution.com',
        password: 'admin123',
        phone: '+92-300-1234567',
        city: 'Islamabad',
        solarPanels: true,
        energyGoal: 'high',
        role: 'admin',
        stats: {
          energySaved: 1000,
          co2Reduced: 500,
          greenCoins: 10000,
          sustainabilityScore: 95,
          streak: 100,
          energyTokens: 500
        },
        achievements: ['first_login', 'week_streak', 'month_streak', 'solar_adopter', 'eco_warrior'],
        isEmailVerified: true
      });
      console.log('✅ Admin user created');
      console.log('   Email: admin@rayvolution.com');
      console.log('   Password: admin123');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    // Create sample user
    console.log('👤 Creating sample user...');
    const userExists = await User.findOne({ email: 'user@example.com' });

    if (!userExists) {
      await User.create({
        name: 'John Doe',
        email: 'user@example.com',
        password: 'password123',
        phone: '+92-321-9876543',
        city: 'Karachi',
        solarPanels: true,
        energyGoal: 'medium',
        stats: {
          energySaved: 250,
          co2Reduced: 125,
          greenCoins: 500,
          sustainabilityScore: 65,
          streak: 15,
          energyTokens: 100
        },
        achievements: ['first_login', 'week_streak', 'solar_adopter']
      });
      console.log('✅ Sample user created');
      console.log('   Email: user@example.com');
      console.log('   Password: password123');
    } else {
      console.log('ℹ️  Sample user already exists');
    }

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Cities: ${citiesData.length}`);
    console.log(`   Challenges: ${challengesData.length}`);
    console.log(`   Users: ${await User.countDocuments()}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run seeding
seedDatabase();
