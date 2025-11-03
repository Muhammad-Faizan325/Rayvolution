const { sendSuccess, sendError } = require('../utils/response.utils');
const User = require('../models/User.model');
const SolarCalculation = require('../models/SolarCalculation.model');

// Rule-based AI responses
const advisorRules = [
  {
    keywords: ['save', 'saving', 'savings', 'money', 'cost'],
    responses: [
      'Based on a typical 5kW solar setup in Pakistan, you can save approximately Rs. 13,000-15,000 per month on electricity bills!',
      'Solar panels can reduce your electricity costs by 70-90%. With net metering, you can even earn from excess energy!',
      'A 5kW system costs around Rs. 750,000 but pays itself back in 4-5 years through savings.',
      'Switching to solar can save you Rs. 180,000-200,000 annually on electricity bills!'
    ]
  },
  {
    keywords: ['sunlight', 'sun', 'weather', 'forecast', 'prediction'],
    responses: [
      'Pakistan receives 5.5-7 hours of peak sunlight daily, making it perfect for solar energy!',
      'Check our weather forecast for real-time sunlight predictions in your city.',
      'Tomorrow shows 92% sunlight efficiency — an excellent day for solar generation ⚡',
      'Peak solar production hours are 10 AM to 3 PM when the sun is strongest.'
    ]
  },
  {
    keywords: ['efficient', 'efficiency', 'performance', 'output'],
    responses: [
      'Modern solar panels operate at 18-22% efficiency, with premium panels reaching 23-24%.',
      'Your solar system efficiency depends on panel quality, installation angle, and cleanliness.',
      'Clean your solar panels monthly to maintain 95%+ efficiency!',
      'Optimal panel tilt angle in Pakistan is 25-30 degrees for maximum annual output.'
    ]
  },
  {
    keywords: ['panel', 'panels', 'capacity', 'size', 'kW', 'kilowatt'],
    responses: [
      'For an average Pakistani home (300 units/month), a 3-5kW system is ideal.',
      'Each 1kW of solar capacity generates approximately 4-5 units (kWh) daily in Pakistan.',
      'A 5kW system requires 15-17 panels and about 35-40 square meters of roof space.',
      'Start with 3kW and expand later — modular systems are flexible and upgradeable!'
    ]
  },
  {
    keywords: ['co2', 'carbon', 'environment', 'green', 'eco', 'pollution'],
    responses: [
      'A 5kW solar system reduces 2.5-3 tons of CO₂ emissions annually!',
      'Your solar setup has the same environmental impact as planting 120 trees per year.',
      'Pakistan emits 0.85 kg CO₂ per kWh from grid electricity. Solar emits zero! 🌱',
      'Every kWh from solar saves our environment from harmful emissions.'
    ]
  },
  {
    keywords: ['install', 'installation', 'setup', 'how', 'start'],
    responses: [
      'Solar installation takes 2-3 days: site survey → mounting → panel installation → wiring → connection.',
      'Choose AEDB-certified installers for quality and warranty. Check our verified partners!',
      'Net metering registration is essential — your solar installer can help with NEPRA paperwork.',
      'Installation cost ranges from Rs. 140,000-160,000 per kW including panels, inverter, and mounting.'
    ]
  },
  {
    keywords: ['net metering', 'sell', 'excess', 'grid', 'export'],
    responses: [
      'Net metering lets you sell excess solar energy back to the grid and reduce your bill to zero!',
      'Apply for net metering through your distribution company (LESCO, K-Electric, etc.)',
      'With net metering, your meter runs backward when you generate more than you consume.',
      'Net metering approval takes 2-3 months — apply early for faster setup!'
    ]
  },
  {
    keywords: ['battery', 'batteries', 'backup', 'storage', 'load shedding'],
    responses: [
      'Batteries provide backup during outages but increase system cost by 40-60%.',
      'For load shedding areas, consider a hybrid system with 5-10 kWh battery storage.',
      'Lithium batteries last 10-15 years vs 3-5 years for lead-acid batteries.',
      'Grid-tied systems are cheaper but require grid power. Hybrid systems work independently!'
    ]
  },
  {
    keywords: ['maintenance', 'clean', 'repair', 'service'],
    responses: [
      'Solar panels need minimal maintenance — just clean them monthly and check connections annually.',
      'Rain naturally cleans panels, but dust in Pakistani cities requires manual cleaning.',
      'Annual professional inspection costs Rs. 5,000-10,000 and ensures peak performance.',
      'Quality inverters last 10-15 years; panels come with 25-year performance warranties!'
    ]
  },
  {
    keywords: ['loan', 'finance', 'payment', 'installment', 'subsidy'],
    responses: [
      'State Bank of Pakistan offers green financing for solar with 6-9% markup rates.',
      'Many banks provide solar loans with 3-5 year repayment plans.',
      'AEDB subsidies can reduce your solar system cost by 30-40% — check eligibility!',
      'Monthly solar loan installments are often less than your current electricity bill!'
    ]
  },
  {
    keywords: ['begin', 'beginner', 'new', 'first time', 'advice'],
    responses: [
      'Start by calculating your energy needs using our Solar Calculator tool!',
      'Get 3-4 quotes from certified installers to compare prices and warranties.',
      'Check your roof condition, orientation (south-facing is best), and available space.',
      'Begin with a smaller system (3kW) and expand later as your confidence grows!'
    ]
  }
];

// @desc    Get AI advisor response
// @route   POST /api/advisor
// @access  Public/Private
exports.getAdvice = async (req, res) => {
  try {
    const { query, userId } = req.body;

    if (!query || query.trim().length === 0) {
      return sendError(res, 'Query is required', 400);
    }

    const lowerQuery = query.toLowerCase();

    // Find matching rule
    let matchedRule = null;
    for (const rule of advisorRules) {
      if (rule.keywords.some(keyword => lowerQuery.includes(keyword))) {
        matchedRule = rule;
        break;
      }
    }

    // Select random response from matched rule
    let reply = '';
    if (matchedRule) {
      reply = matchedRule.responses[Math.floor(Math.random() * matchedRule.responses.length)];
    } else {
      // Default responses for unmatched queries
      const defaultResponses = [
        'That\'s a great question! Let me help you with solar energy information. Could you be more specific?',
        'I can help you with solar panels, costs, savings, installation, and environmental benefits. What would you like to know?',
        'Solar energy is transforming Pakistan! Ask me about panel capacity, costs, savings, or installation.',
        'I\'m here to guide you on your solar journey. Try asking about savings, efficiency, or getting started!'
      ];
      reply = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }

    // Personalize response if user is logged in
    if (userId) {
      try {
        const user = await User.findById(userId);
        if (user) {
          // Add personalized prefix for returning users
          const names = user.name.split(' ');
          const firstName = names[0];

          // Award coins for using advisor
          user.stats.greenCoins += 5;
          await user.save();

          reply = `Hi ${firstName}! ${reply}`;

          // Add user-specific stats if relevant
          if (lowerQuery.includes('my') || lowerQuery.includes('progress')) {
            const calculations = await SolarCalculation.countDocuments({ userId: user._id });
            if (calculations > 0) {
              reply += ` By the way, you've used our calculator ${calculations} time${calculations > 1 ? 's' : ''} — great job exploring solar options!`;
            }
          }
        }
      } catch (error) {
        // Continue without personalization if user fetch fails
        console.error('User personalization error:', error);
      }
    }

    // Add helpful suggestions
    const suggestions = [
      'How much can I save with solar?',
      'What size solar system do I need?',
      'How does net metering work?',
      'Tell me about solar panel efficiency',
      'How much does installation cost?',
      'What about battery backup?'
    ];

    // Filter out the matched keywords from suggestions
    const relevantSuggestions = suggestions
      .filter(s => !lowerQuery.split(' ').some(word =>
        word.length > 3 && s.toLowerCase().includes(word)
      ))
      .slice(0, 3);

    sendSuccess(res, {
      query,
      reply,
      suggestions: relevantSuggestions,
      timestamp: new Date().toISOString()
    }, 'AI response generated successfully');
  } catch (error) {
    console.error('AI advisor error:', error);
    sendError(res, 'Error generating AI response', 500);
  }
};

// @desc    Get quick tips
// @route   GET /api/advisor/tips
// @access  Public
exports.getQuickTips = (req, res) => {
  const tips = [
    {
      title: '💰 Save Money',
      tip: 'A 5kW solar system can save you Rs. 180,000 annually on electricity bills!',
      category: 'savings'
    },
    {
      title: '🌞 Peak Hours',
      tip: 'Solar panels generate maximum power between 10 AM and 3 PM. Plan heavy usage during these hours!',
      category: 'efficiency'
    },
    {
      title: '🧹 Keep Clean',
      tip: 'Clean your solar panels monthly to maintain 95%+ efficiency. Dust reduces output by 15-25%!',
      category: 'maintenance'
    },
    {
      title: '📐 Optimal Angle',
      tip: 'Install panels at 25-30° tilt angle in Pakistan for maximum annual energy generation.',
      category: 'installation'
    },
    {
      title: '🌱 Go Green',
      tip: 'Every 1000 kWh from solar saves 850 kg of CO₂ — equivalent to planting 40 trees!',
      category: 'environment'
    },
    {
      title: '🔋 Net Metering',
      tip: 'Register for net metering to sell excess energy back to the grid and reduce bills to zero!',
      category: 'savings'
    },
    {
      title: '☀️ Pakistan\'s Potential',
      tip: 'Pakistan receives 5.5-7 hours of peak sunlight daily — among the best in the world for solar!',
      category: 'general'
    },
    {
      title: '💡 Start Small',
      tip: 'Begin with a 3kW system and expand later. Modular solar systems are flexible and upgradeable!',
      category: 'beginner'
    },
    {
      title: '🏦 Financing Available',
      tip: 'Banks offer solar loans with 3-5 year repayment plans. Monthly installments < electricity bills!',
      category: 'finance'
    },
    {
      title: '⚡ Load Shedding Solution',
      tip: 'Hybrid systems with batteries provide uninterrupted power during outages and load shedding!',
      category: 'backup'
    }
  ];

  // Randomly select 5 tips
  const selectedTips = tips.sort(() => Math.random() - 0.5).slice(0, 5);

  sendSuccess(res, { tips: selectedTips }, 'Quick tips retrieved successfully');
};

// @desc    Get conversation starters
// @route   GET /api/advisor/starters
// @access  Public
exports.getConversationStarters = (req, res) => {
  const starters = [
    'How much money can I save with solar panels?',
    'What size solar system do I need for my home?',
    'How does solar energy work in Pakistan?',
    'What is the cost of installing solar panels?',
    'How long do solar panels last?',
    'Can I sell excess electricity back to the grid?',
    'What are the environmental benefits of solar?',
    'How do I maintain my solar panels?',
    'Is solar worth it during load shedding?',
    'What financing options are available for solar?',
    'How much roof space do I need for solar panels?',
    'What is net metering and how do I apply?'
  ];

  // Return 6 random starters
  const selectedStarters = starters.sort(() => Math.random() - 0.5).slice(0, 6);

  sendSuccess(res, { starters: selectedStarters }, 'Conversation starters retrieved successfully');
};

module.exports = exports;
