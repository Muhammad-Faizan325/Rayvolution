const mongoose = require('mongoose');
const SindhDistrict = require('../models/SindhDistrict.model');
const PowerOutage = require('../models/PowerOutage.model');
require('dotenv').config();

// Sindh Districts Data (29 districts)
const sindhDistrictsData = [
  // Karachi Division
  {
    name: 'Karachi Central',
    nameUrdu: 'کراچی سینٹرل',
    division: 'Karachi',
    coordinates: { lat: 24.9056, lng: 67.0822 },
    population: 2900000,
    sunlightHours: 9.5,
    outageStats: {
      currentStatus: 'minor_outage',
      averageDailyOutageHours: 2,
      totalOutagesThisMonth: 12
    },
    solarStats: {
      adoptionRate: 15,
      totalSolarUsers: 4350,
      totalCapacityKW: 21750
    }
  },
  {
    name: 'Karachi East',
    nameUrdu: 'کراچی مشرقی',
    division: 'Karachi',
    coordinates: { lat: 24.8826, lng: 67.0778 },
    population: 2600000,
    sunlightHours: 9.5,
    outageStats: {
      currentStatus: 'normal',
      averageDailyOutageHours: 1,
      totalOutagesThisMonth: 5
    },
    solarStats: {
      adoptionRate: 22,
      totalSolarUsers: 5720,
      totalCapacityKW: 28600
    }
  },
  {
    name: 'Karachi South',
    nameUrdu: 'کراچی جنوبی',
    division: 'Karachi',
    coordinates: { lat: 24.8568, lng: 67.0100 },
    population: 1800000,
    sunlightHours: 9.5,
    outageStats: {
      currentStatus: 'normal',
      averageDailyOutageHours: 0.5,
      totalOutagesThisMonth: 3
    },
    solarStats: {
      adoptionRate: 28,
      totalSolarUsers: 5040,
      totalCapacityKW: 25200
    }
  },
  {
    name: 'Karachi West',
    nameUrdu: 'کراچی مغربی',
    division: 'Karachi',
    coordinates: { lat: 24.9270, lng: 66.9880 },
    population: 3600000,
    sunlightHours: 9.5,
    outageStats: {
      currentStatus: 'major_outage',
      averageDailyOutageHours: 4,
      totalOutagesThisMonth: 18
    },
    solarStats: {
      adoptionRate: 12,
      totalSolarUsers: 4320,
      totalCapacityKW: 21600
    }
  },
  {
    name: 'Korangi',
    nameUrdu: 'کورنگی',
    division: 'Karachi',
    coordinates: { lat: 24.8390, lng: 67.1123 },
    population: 2400000,
    sunlightHours: 9.5,
    outageStats: {
      currentStatus: 'minor_outage',
      averageDailyOutageHours: 3,
      totalOutagesThisMonth: 15
    },
    solarStats: {
      adoptionRate: 18,
      totalSolarUsers: 4320,
      totalCapacityKW: 21600
    }
  },
  {
    name: 'Malir',
    nameUrdu: 'ملیر',
    division: 'Karachi',
    coordinates: { lat: 24.9410, lng: 67.2048 },
    population: 2000000,
    sunlightHours: 9.5,
    outageStats: {
      currentStatus: 'major_outage',
      averageDailyOutageHours: 5,
      totalOutagesThisMonth: 22
    },
    solarStats: {
      adoptionRate: 10,
      totalSolarUsers: 2000,
      totalCapacityKW: 10000
    }
  },

  // Hyderabad Division
  {
    name: 'Hyderabad',
    nameUrdu: 'حیدرآباد',
    division: 'Hyderabad',
    coordinates: { lat: 25.3792, lng: 68.3683 },
    population: 1800000,
    sunlightHours: 9.3,
    outageStats: {
      currentStatus: 'major_outage',
      averageDailyOutageHours: 6,
      totalOutagesThisMonth: 25
    },
    solarStats: {
      adoptionRate: 20,
      totalSolarUsers: 3600,
      totalCapacityKW: 18000
    }
  },
  {
    name: 'Dadu',
    nameUrdu: 'دادو',
    division: 'Hyderabad',
    coordinates: { lat: 26.7314, lng: 67.7786 },
    population: 1500000,
    sunlightHours: 9.8,
    outageStats: {
      currentStatus: 'critical',
      averageDailyOutageHours: 10,
      totalOutagesThisMonth: 30
    },
    solarStats: {
      adoptionRate: 8,
      totalSolarUsers: 1200,
      totalCapacityKW: 6000
    }
  },
  {
    name: 'Jamshoro',
    nameUrdu: 'جامشورو',
    division: 'Hyderabad',
    coordinates: { lat: 25.4358, lng: 68.2803 },
    population: 300000,
    sunlightHours: 9.4,
    outageStats: {
      currentStatus: 'major_outage',
      averageDailyOutageHours: 7,
      totalOutagesThisMonth: 20
    },
    solarStats: {
      adoptionRate: 15,
      totalSolarUsers: 450,
      totalCapacityKW: 2250
    }
  },
  {
    name: 'Matiari',
    nameUrdu: 'مٹیاری',
    division: 'Hyderabad',
    coordinates: { lat: 25.5969, lng: 68.4467 },
    population: 750000,
    sunlightHours: 9.5,
    outageStats: {
      currentStatus: 'critical',
      averageDailyOutageHours: 12,
      totalOutagesThisMonth: 28
    },
    solarStats: {
      adoptionRate: 6,
      totalSolarUsers: 450,
      totalCapacityKW: 2250
    }
  },
  {
    name: 'Tando Allahyar',
    nameUrdu: 'ٹنڈو الہیار',
    division: 'Hyderabad',
    coordinates: { lat: 25.4604, lng: 68.7184 },
    population: 500000,
    sunlightHours: 9.6,
    outageStats: {
      currentStatus: 'major_outage',
      averageDailyOutageHours: 8,
      totalOutagesThisMonth: 24
    },
    solarStats: {
      adoptionRate: 12,
      totalSolarUsers: 600,
      totalCapacityKW: 3000
    }
  },
  {
    name: 'Tando Muhammad Khan',
    nameUrdu: 'ٹنڈو محمد خان',
    division: 'Hyderabad',
    coordinates: { lat: 25.1240, lng: 68.5369 },
    population: 400000,
    sunlightHours: 9.5,
    outageStats: {
      currentStatus: 'major_outage',
      averageDailyOutageHours: 7,
      totalOutagesThisMonth: 22
    },
    solarStats: {
      adoptionRate: 14,
      totalSolarUsers: 560,
      totalCapacityKW: 2800
    }
  },
  {
    name: 'Thatta',
    nameUrdu: 'ٹھٹہ',
    division: 'Hyderabad',
    coordinates: { lat: 24.7471, lng: 67.9245 },
    population: 1000000,
    sunlightHours: 9.7,
    outageStats: {
      currentStatus: 'critical',
      averageDailyOutageHours: 11,
      totalOutagesThisMonth: 32
    },
    solarStats: {
      adoptionRate: 5,
      totalSolarUsers: 500,
      totalCapacityKW: 2500
    }
  },
  {
    name: 'Badin',
    nameUrdu: 'بدین',
    division: 'Hyderabad',
    coordinates: { lat: 24.6560, lng: 68.8400 },
    population: 1800000,
    sunlightHours: 9.8,
    outageStats: {
      currentStatus: 'critical',
      averageDailyOutageHours: 14,
      totalOutagesThisMonth: 35
    },
    solarStats: {
      adoptionRate: 4,
      totalSolarUsers: 720,
      totalCapacityKW: 3600
    }
  },

  // Sukkur Division
  {
    name: 'Sukkur',
    nameUrdu: 'سکھر',
    division: 'Sukkur',
    coordinates: { lat: 27.7058, lng: 68.8574 },
    population: 1500000,
    sunlightHours: 10.2,
    outageStats: {
      currentStatus: 'major_outage',
      averageDailyOutageHours: 8,
      totalOutagesThisMonth: 26
    },
    solarStats: {
      adoptionRate: 16,
      totalSolarUsers: 2400,
      totalCapacityKW: 12000
    }
  },
  {
    name: 'Ghotki',
    nameUrdu: 'گھوٹکی',
    division: 'Sukkur',
    coordinates: { lat: 28.0093, lng: 69.3152 },
    population: 1500000,
    sunlightHours: 10.5,
    outageStats: {
      currentStatus: 'critical',
      averageDailyOutageHours: 12,
      totalOutagesThisMonth: 30
    },
    solarStats: {
      adoptionRate: 7,
      totalSolarUsers: 1050,
      totalCapacityKW: 5250
    }
  },
  {
    name: 'Khairpur',
    nameUrdu: 'خیرپور',
    division: 'Sukkur',
    coordinates: { lat: 27.5295, lng: 68.7592 },
    population: 2400000,
    sunlightHours: 10.3,
    outageStats: {
      currentStatus: 'major_outage',
      averageDailyOutageHours: 9,
      totalOutagesThisMonth: 28
    },
    solarStats: {
      adoptionRate: 11,
      totalSolarUsers: 2640,
      totalCapacityKW: 13200
    }
  },
  {
    name: 'Shikarpur',
    nameUrdu: 'شکارپور',
    division: 'Sukkur',
    coordinates: { lat: 27.9557, lng: 68.6382 },
    population: 1100000,
    sunlightHours: 10.4,
    outageStats: {
      currentStatus: 'critical',
      averageDailyOutageHours: 10,
      totalOutagesThisMonth: 29
    },
    solarStats: {
      adoptionRate: 9,
      totalSolarUsers: 990,
      totalCapacityKW: 4950
    }
  },

  // Mirpurkhas Division
  {
    name: 'Mirpurkhas',
    nameUrdu: 'میرپور خاص',
    division: 'Mirpurkhas',
    coordinates: { lat: 25.5268, lng: 69.0113 },
    population: 1500000,
    sunlightHours: 9.9,
    outageStats: {
      currentStatus: 'major_outage',
      averageDailyOutageHours: 8,
      totalOutagesThisMonth: 25
    },
    solarStats: {
      adoptionRate: 13,
      totalSolarUsers: 1950,
      totalCapacityKW: 9750
    }
  },
  {
    name: 'Tharparkar',
    nameUrdu: 'تھرپارکر',
    division: 'Mirpurkhas',
    coordinates: { lat: 24.8744, lng: 70.6356 },
    population: 1600000,
    sunlightHours: 11.0,
    outageStats: {
      currentStatus: 'critical',
      averageDailyOutageHours: 16,
      totalOutagesThisMonth: 40
    },
    solarStats: {
      adoptionRate: 3,
      totalSolarUsers: 480,
      totalCapacityKW: 2400
    }
  },
  {
    name: 'Umerkot',
    nameUrdu: 'عمرکوٹ',
    division: 'Mirpurkhas',
    coordinates: { lat: 25.3549, lng: 69.7363 },
    population: 1100000,
    sunlightHours: 10.2,
    outageStats: {
      currentStatus: 'major_outage',
      averageDailyOutageHours: 9,
      totalOutagesThisMonth: 27
    },
    solarStats: {
      adoptionRate: 8,
      totalSolarUsers: 880,
      totalCapacityKW: 4400
    }
  },

  // Larkana Division
  {
    name: 'Larkana',
    nameUrdu: 'لاڑکانہ',
    division: 'Larkana',
    coordinates: { lat: 27.5590, lng: 68.2121 },
    population: 1500000,
    sunlightHours: 10.1,
    outageStats: {
      currentStatus: 'major_outage',
      averageDailyOutageHours: 8,
      totalOutagesThisMonth: 24
    },
    solarStats: {
      adoptionRate: 14,
      totalSolarUsers: 2100,
      totalCapacityKW: 10500
    }
  },
  {
    name: 'Jacobabad',
    nameUrdu: 'جیکب آباد',
    division: 'Larkana',
    coordinates: { lat: 28.2819, lng: 68.4375 },
    population: 1000000,
    sunlightHours: 10.8,
    outageStats: {
      currentStatus: 'critical',
      averageDailyOutageHours: 13,
      totalOutagesThisMonth: 33
    },
    solarStats: {
      adoptionRate: 6,
      totalSolarUsers: 600,
      totalCapacityKW: 3000
    }
  },
  {
    name: 'Kambar Shahdadkot',
    nameUrdu: 'کامبر شہدادکوٹ',
    division: 'Larkana',
    coordinates: { lat: 27.5950, lng: 68.0330 },
    population: 600000,
    sunlightHours: 10.2,
    outageStats: {
      currentStatus: 'major_outage',
      averageDailyOutageHours: 9,
      totalOutagesThisMonth: 26
    },
    solarStats: {
      adoptionRate: 10,
      totalSolarUsers: 600,
      totalCapacityKW: 3000
    }
  },
  {
    name: 'Qambar',
    nameUrdu: 'قمبر',
    division: 'Larkana',
    coordinates: { lat: 27.5877, lng: 68.0170 },
    population: 500000,
    sunlightHours: 10.3,
    outageStats: {
      currentStatus: 'major_outage',
      averageDailyOutageHours: 8.5,
      totalOutagesThisMonth: 25
    },
    solarStats: {
      adoptionRate: 11,
      totalSolarUsers: 550,
      totalCapacityKW: 2750
    }
  },
  {
    name: 'Kashmore',
    nameUrdu: 'کشمور',
    division: 'Larkana',
    coordinates: { lat: 28.4331, lng: 69.5836 },
    population: 900000,
    sunlightHours: 10.6,
    outageStats: {
      currentStatus: 'critical',
      averageDailyOutageHours: 11,
      totalOutagesThisMonth: 31
    },
    solarStats: {
      adoptionRate: 5,
      totalSolarUsers: 450,
      totalCapacityKW: 2250
    }
  },

  // Shaheed Benazirabad Division
  {
    name: 'Shaheed Benazirabad',
    nameUrdu: 'شہید بے نظیرآباد',
    division: 'Shaheed Benazirabad',
    coordinates: { lat: 26.2442, lng: 68.4114 },
    population: 1400000,
    sunlightHours: 9.8,
    outageStats: {
      currentStatus: 'major_outage',
      averageDailyOutageHours: 7,
      totalOutagesThisMonth: 23
    },
    solarStats: {
      adoptionRate: 17,
      totalSolarUsers: 2380,
      totalCapacityKW: 11900
    }
  },
  {
    name: 'Naushahro Feroze',
    nameUrdu: 'نوشہرو فیروز',
    division: 'Shaheed Benazirabad',
    coordinates: { lat: 26.8408, lng: 68.1224 },
    population: 1200000,
    sunlightHours: 9.9,
    outageStats: {
      currentStatus: 'major_outage',
      averageDailyOutageHours: 8,
      totalOutagesThisMonth: 24
    },
    solarStats: {
      adoptionRate: 12,
      totalSolarUsers: 1440,
      totalCapacityKW: 7200
    }
  },
  {
    name: 'Sanghar',
    nameUrdu: 'سانگھڑ',
    division: 'Shaheed Benazirabad',
    coordinates: { lat: 26.0465, lng: 68.9481 },
    population: 2000000,
    sunlightHours: 10.0,
    outageStats: {
      currentStatus: 'major_outage',
      averageDailyOutageHours: 9,
      totalOutagesThisMonth: 27
    },
    solarStats: {
      adoptionRate: 9,
      totalSolarUsers: 1800,
      totalCapacityKW: 9000
    }
  }
];

async function seedSindh() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB');

    // Clear existing Sindh data
    console.log('🗑️  Clearing existing Sindh data...');
    await SindhDistrict.deleteMany({});
    await PowerOutage.deleteMany({});

    // Seed districts
    console.log('🌆 Seeding Sindh districts...');
    const createdDistricts = await SindhDistrict.insertMany(sindhDistrictsData);
    console.log(`✅ Seeded ${createdDistricts.length} Sindh districts`);

    // Create some sample outages
    console.log('⚡ Creating sample power outages...');
    const sampleOutages = [
      {
        districtId: createdDistricts.find(d => d.name === 'Karachi West')._id,
        districtName: 'Karachi West',
        type: 'load_shedding',
        severity: 'high',
        status: 'ongoing',
        area: 'Orangi Town',
        coordinates: { lat: 24.9494, lng: 66.9894 },
        affectedHouseholds: 15000,
        affectedPopulation: 75000,
        cause: 'overload',
        description: 'Scheduled load shedding due to high demand'
      },
      {
        districtId: createdDistricts.find(d => d.name === 'Tharparkar')._id,
        districtName: 'Tharparkar',
        type: 'unscheduled',
        severity: 'critical',
        status: 'ongoing',
        area: 'Mithi',
        coordinates: { lat: 24.7360, lng: 69.7969 },
        affectedHouseholds: 25000,
        affectedPopulation: 150000,
        cause: 'transmission_failure',
        description: 'Major transmission line fault'
      },
      {
        districtId: createdDistricts.find(d => d.name === 'Hyderabad')._id,
        districtName: 'Hyderabad',
        type: 'load_shedding',
        severity: 'medium',
        status: 'ongoing',
        area: 'Latifabad',
        coordinates: { lat: 25.3607, lng: 68.3788 },
        affectedHouseholds: 8000,
        affectedPopulation: 40000,
        cause: 'overload',
        description: 'Peak hours load management'
      }
    ];

    await PowerOutage.insertMany(sampleOutages);
    console.log(`✅ Created ${sampleOutages.length} sample outages`);

    console.log('\n🎉 Sindh data seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Districts: ${createdDistricts.length}`);
    console.log(`   Sample Outages: ${sampleOutages.length}`);
    console.log(`   Total Population: ${sindhDistrictsData.reduce((sum, d) => sum + d.population, 0).toLocaleString()}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding Sindh data:', error);
    process.exit(1);
  }
}

// Run seeding
seedSindh();
