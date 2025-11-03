# Sindh Map - Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Seed the Database
```bash
cd backend
npm run seed:sindh
```

Expected output:
```
✅ Connected to MongoDB
🗑️  Clearing existing Sindh data...
🌆 Seeding Sindh districts...
✅ Seeded 29 Sindh districts
⚡ Creating sample power outages...
✅ Created 3 sample outages
🎉 Sindh data seeded successfully!
```

### Step 2: Start Backend
```bash
npm run dev
```

Server running at: `http://localhost:5000`

### Step 3: View the Map
Open browser: `http://localhost:3000/map/sindh`

---

## 📊 What You'll See

### Province Statistics
- 29 Sindh districts
- Real-time outage count
- Average solar adoption rate
- CO₂ saved this month

### Interactive Map
- **Outage View**: Color-coded by severity (Green → Yellow → Orange → Red)
- **Solar View**: Color-coded by adoption rate

### District Details
Click any district to see:
- Population & users
- Outage statistics (hours/day, total this month)
- Solar statistics (adoption %, users, capacity)
- Active outages count

### Active Outages
Real-time list of ongoing power outages with:
- Location & area
- Severity level
- Affected population
- Time started

---

## 🎯 Key Features

### For Users
✅ View power outages in their district
✅ See solar adoption rates
✅ Report new outages (when logged in)
✅ Comment and upvote outage reports
✅ Track district performance

### For Admins
✅ Monitor all 29 districts
✅ Update outage status
✅ Verify outage reports
✅ View province-wide statistics
✅ Track critical districts

---

## 🗺️ Districts Covered

**6 Karachi Districts**
- Karachi Central, East, South, West
- Korangi, Malir

**8 Hyderabad Division**
- Hyderabad, Dadu, Jamshoro, Matiari
- Tando Allahyar, Tando Muhammad Khan
- Thatta, Badin

**4 Sukkur Division**
- Sukkur, Ghotki, Khairpur, Shikarpur

**3 Mirpurkhas Division**
- Mirpurkhas, Tharparkar, Umerkot

**5 Larkana Division**
- Larkana, Jacobabad, Kambar Shahdadkot
- Qambar, Kashmore

**3 Shaheed Benazirabad Division**
- Shaheed Benazirabad
- Naushahro Feroze, Sanghar

---

## 🔌 Sample Outages Included

1. **Karachi West - Orangi Town**
   - 🔴 High severity
   - 75,000 people affected
   - Load shedding

2. **Tharparkar - Mithi**
   - 🔴 Critical severity
   - 150,000 people affected
   - Transmission failure

3. **Hyderabad - Latifabad**
   - 🟡 Medium severity
   - 40,000 people affected
   - Load management

---

## 📡 API Endpoints

### Get All Districts
```
GET http://localhost:5000/api/sindh/districts
```

### Get Map Data (Optimized)
```
GET http://localhost:5000/api/sindh/map-data
```

### Get Province Stats
```
GET http://localhost:5000/api/sindh/stats
```

### Get Active Outages
```
GET http://localhost:5000/api/sindh/outages?status=ongoing
```

### Report Outage (Requires Auth)
```
POST http://localhost:5000/api/sindh/outages
Body: {
  "districtName": "Karachi Central",
  "area": "Nazimabad",
  "type": "unscheduled",
  "severity": "high",
  "description": "Power out since 2 hours"
}
```

---

## 🎨 Color Coding

### Outage Status
- 🟢 **Green** = Normal (no issues)
- 🟡 **Yellow** = Minor outage (<4h/day)
- 🟠 **Orange** = Major outage (4-8h/day)
- 🔴 **Red** = Critical (>8h/day)

### Solar Adoption
- 🟢 **Dark Green** = >20% adoption (excellent)
- 🟢 **Green** = 15-20% adoption (good)
- 🟡 **Yellow** = 10-15% adoption (moderate)
- 🟠 **Orange** = <10% adoption (low)

---

## 📈 Sample Statistics

Based on seed data:

**Province Total:**
- Population: ~45 million
- Solar adoption: ~11.5%
- Avg outage: ~7.5h/day

**Best Solar Districts:**
1. Karachi South - 28%
2. Karachi East - 22%
3. Shaheed Benazirabad - 17%

**Most Affected by Outages:**
1. Tharparkar - 16h/day (critical)
2. Badin - 14h/day (critical)
3. Jacobabad - 13h/day (critical)

---

## ✨ What Changed from Old System

### ❌ Removed
- Marketplace (selling/buying energy tokens)
- Energy tokens from user profiles
- Transaction history
- Marketplace API routes

### ✅ Added
- Sindh province map (29 districts)
- Power outage tracking
- District-level solar statistics
- Real-time outage reporting
- Community engagement (upvotes, comments)
- Province-wide analytics

---

## 🔧 Troubleshooting

### Map shows no data?
- Run `npm run seed:sindh` to populate database
- Check backend is running on port 5000
- Verify MongoDB connection

### Can't report outages?
- Make sure you're logged in
- Check JWT token is valid
- Verify district name matches exactly

### Outdated statistics?
- Stats update when:
  - New outages reported
  - Outages marked as resolved
  - Users install solar panels
  - Districts manually updated by admin

---

## 💡 Tips

1. **Color Patterns**: Red districts need urgent attention
2. **Solar Potential**: Districts with high sunlight but low adoption = opportunity
3. **Compare Views**: Toggle between outage and solar views to see correlation
4. **District Details**: Always check details panel for full picture
5. **Report Accuracy**: More reports = better data = better decisions

---

## 🔮 Future Features (Coming Soon)

- Real geographic map with Leaflet
- Historical outage data charts
- Outage predictions using AI
- SMS notifications for outages
- Mobile app for field reporting
- Weather integration
- Solar potential calculator per district

---

## 📞 Support

**Need Help?**
- Check `/SINDH_MAP_UPDATE.md` for detailed documentation
- See `/API_DOCUMENTATION.md` for all endpoints
- Review seed script output for errors

**Quick Links:**
- Map: http://localhost:3000/map/sindh
- API: http://localhost:5000/api/sindh/*
- Docs: /SINDH_MAP_UPDATE.md

---

Happy mapping! 🗺️⚡☀️
