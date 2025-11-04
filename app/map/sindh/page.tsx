'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/navbar';

interface District {
  _id: string;
  name: string;
  nameUrdu: string;
  division: string;
  coordinates: { lat: number; lng: number };
  population: number;
  sunlightHours: number;
  outageStats: {
    currentStatus: string;
    averageDailyOutageHours: number;
    totalOutagesThisMonth: number;
    affectedPopulation: number;
  };
  solarStats: {
    adoptionRate: number;
    totalSolarUsers: number;
    totalCapacityKW: number;
    energyGeneratedThisMonth: number;
    co2SavedThisMonth: number;
  };
  totalUsers: number;
  activeOutagesCount: number;
}

interface PowerOutage {
  _id: string;
  district: string;
  area: string;
  coordinates: { lat: number; lng: number };
  severity: string;
  startTime: string;
  affected: number;
}

export default function SindhMapPage() {
  const [districts, setDistricts] = useState<District[]>([]);
  const [activeOutages, setActiveOutages] = useState<PowerOutage[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  const [viewMode, setViewMode] = useState<'outages' | 'solar'>('outages');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetchMapData();
    fetchSindhStats();
  }, []);

  const fetchMapData = async () => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch('http://localhost:5000/api/sindh/map-data');
      const data = await response.json();

      if (data.success) {
        setDistricts(data.data.districts);
        setActiveOutages(data.data.activeOutages);
      }
    } catch (error) {
      console.error('Error fetching map data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSindhStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/sindh/stats');
      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const getOutageColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'bg-green-500';
      case 'minor_outage':
        return 'bg-yellow-500';
      case 'major_outage':
        return 'bg-orange-500';
      case 'critical':
        return 'bg-red-600';
      default:
        return 'bg-gray-500';
    }
  };

  const getSolarColor = (adoptionRate: number) => {
    if (adoptionRate >= 20) return 'bg-green-600';
    if (adoptionRate >= 15) return 'bg-green-500';
    if (adoptionRate >= 10) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading Sindh map data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Sindh Province Energy Map
          </h1>
          <p className="text-gray-600 text-lg">
            Real-time electricity outages and solar energy adoption across Sindh
          </p>
        </motion.div>

        {/* View Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md inline-flex">
            <button
              onClick={() => setViewMode('outages')}
              className={`px-6 py-2 rounded-md transition-all ${
                viewMode === 'outages'
                  ? 'bg-red-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              ⚡ Power Outages
            </button>
            <button
              onClick={() => setViewMode('solar')}
              className={`px-6 py-2 rounded-md transition-all ${
                viewMode === 'solar'
                  ? 'bg-yellow-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              ☀️ Solar Adoption
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
          >
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="text-3xl mb-2">🏙️</div>
              <div className="text-2xl font-bold text-gray-800">{stats.totalDistricts}</div>
              <div className="text-sm text-gray-600">Total Districts</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="text-3xl mb-2">⚡</div>
              <div className="text-2xl font-bold text-red-600">
                {stats.outages?.districtsAffected || 0}
              </div>
              <div className="text-sm text-gray-600">Districts with Outages</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="text-3xl mb-2">☀️</div>
              <div className="text-2xl font-bold text-green-600">
                {stats.solar?.averageAdoptionRate.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Avg Solar Adoption</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="text-3xl mb-2">🌱</div>
              <div className="text-2xl font-bold text-blue-600">
                {(stats.solar?.co2SavedThisMonth / 1000).toFixed(1)}t
              </div>
              <div className="text-sm text-gray-600">CO₂ Saved This Month</div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Area */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-xl p-6"
            >
              <h2 className="text-2xl font-bold mb-4">
                {viewMode === 'outages' ? 'Power Outage Status' : 'Solar Energy Adoption'}
              </h2>

              {/* Legend */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-3 text-sm text-gray-700">Legend:</h3>
                {viewMode === 'outages' ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                      <span>Normal</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
                      <span>Minor</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-orange-500 rounded mr-2"></div>
                      <span>Major</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-red-600 rounded mr-2"></div>
                      <span>Critical</span>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-green-600 rounded mr-2"></div>
                      <span>&gt;20%</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                      <span>15-20%</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
                      <span>10-15%</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-orange-500 rounded mr-2"></div>
                      <span>&lt;10%</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Districts List (Simplified Map) */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[600px] overflow-y-auto">
                {districts.map((district) => (
                  <motion.div
                    key={district._id}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setSelectedDistrict(district)}
                    className={`p-4 rounded-lg cursor-pointer transition-all border-2 ${
                      selectedDistrict?._id === district._id
                        ? 'border-blue-500 shadow-lg'
                        : 'border-transparent'
                    } ${
                      viewMode === 'outages'
                        ? getOutageColor(district.outageStats.currentStatus)
                        : getSolarColor(district.solarStats.adoptionRate)
                    } text-white`}
                  >
                    <div className="font-bold text-sm mb-1">{district.name}</div>
                    <div className="text-xs opacity-90">{district.nameUrdu}</div>
                    <div className="mt-2 text-xs font-semibold">
                      {viewMode === 'outages' ? (
                        <>
                          {district.outageStats.averageDailyOutageHours.toFixed(1)}h/day
                          {district.activeOutagesCount > 0 && (
                            <div className="mt-1 bg-white bg-opacity-30 rounded px-2 py-1">
                              {district.activeOutagesCount} active
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          {district.solarStats.adoptionRate.toFixed(1)}%
                          <div className="mt-1 opacity-80">
                            {district.solarStats.totalSolarUsers} users
                          </div>
                        </>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* District Details Panel */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6 sticky top-4"
            >
              {selectedDistrict ? (
                <>
                  <h2 className="text-2xl font-bold mb-4">{selectedDistrict.name}</h2>
                  <p className="text-gray-600 mb-6">{selectedDistrict.nameUrdu}</p>

                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-600">Division</div>
                      <div className="font-semibold">{selectedDistrict.division}</div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-600">Population</div>
                      <div className="font-semibold">
                        {selectedDistrict.population.toLocaleString()}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-600">Sunlight Hours</div>
                      <div className="font-semibold">{selectedDistrict.sunlightHours}h/day</div>
                    </div>

                    <hr className="my-4" />

                    <div>
                      <h3 className="font-bold text-lg mb-3 text-red-600">⚡ Power Outages</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Status:</span>
                          <span className="font-semibold capitalize">
                            {selectedDistrict.outageStats.currentStatus.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Avg Daily Outage:</span>
                          <span className="font-semibold">
                            {selectedDistrict.outageStats.averageDailyOutageHours.toFixed(1)}h
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">This Month:</span>
                          <span className="font-semibold">
                            {selectedDistrict.outageStats.totalOutagesThisMonth} outages
                          </span>
                        </div>
                        {selectedDistrict.activeOutagesCount > 0 && (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-2">
                            <div className="text-red-800 font-semibold">
                              {selectedDistrict.activeOutagesCount} Active Outage
                              {selectedDistrict.activeOutagesCount !== 1 ? 's' : ''}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <hr className="my-4" />

                    <div>
                      <h3 className="font-bold text-lg mb-3 text-green-600">☀️ Solar Energy</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Adoption Rate:</span>
                          <span className="font-semibold text-green-600">
                            {selectedDistrict.solarStats.adoptionRate.toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Solar Users:</span>
                          <span className="font-semibold">
                            {selectedDistrict.solarStats.totalSolarUsers.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Total Capacity:</span>
                          <span className="font-semibold">
                            {selectedDistrict.solarStats.totalCapacityKW.toLocaleString()} kW
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Energy This Month:</span>
                          <span className="font-semibold">
                            {selectedDistrict.solarStats.energyGeneratedThisMonth.toLocaleString()}{' '}
                            kWh
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">CO₂ Saved:</span>
                          <span className="font-semibold text-green-600">
                            {(selectedDistrict.solarStats.co2SavedThisMonth / 1000).toFixed(1)}t
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center text-gray-500 py-12">
                  <div className="text-5xl mb-4">🗺️</div>
                  <p>Click on a district to view details</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Active Outages List */}
        {viewMode === 'outages' && activeOutages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-white rounded-2xl shadow-xl p-6"
          >
            <h2 className="text-2xl font-bold mb-6">🚨 Active Power Outages</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeOutages.map((outage) => (
                <div
                  key={outage._id}
                  className="border-l-4 border-red-500 bg-red-50 p-4 rounded-lg"
                >
                  <div className="font-bold text-lg">{outage.district}</div>
                  <div className="text-gray-600 text-sm">{outage.area}</div>
                  <div className="mt-2 flex items-center justify-between">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        outage.severity === 'critical'
                          ? 'bg-red-200 text-red-800'
                          : outage.severity === 'high'
                          ? 'bg-orange-200 text-orange-800'
                          : 'bg-yellow-200 text-yellow-800'
                      }`}
                    >
                      {outage.severity.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-600">
                      {new Date(outage.startTime).toLocaleTimeString()}
                    </span>
                  </div>
                  {outage.affected > 0 && (
                    <div className="mt-2 text-sm text-gray-700">
                      👥 {outage.affected.toLocaleString()} people affected
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
