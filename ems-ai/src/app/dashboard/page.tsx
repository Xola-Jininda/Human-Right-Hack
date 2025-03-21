"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from "recharts";
import { 
  Ambulance, 
  MapPin, 
  AlertTriangle, 
  Check, 
  Clock, 
  Activity,
  Search,
  Filter
} from "lucide-react";

// Mock data - would be replaced with API calls in a real implementation
const mockAmbulanceData = {
  totalAmbulances: 48,
  availableAmbulances: 32,
  inServiceAmbulances: 16,
  areas: [
    { id: 1, name: "Downtown", total: 15, available: 9, inService: 6 },
    { id: 2, name: "North District", total: 12, available: 8, inService: 4 },
    { id: 3, name: "East Side", total: 10, available: 8, inService: 2 },
    { id: 4, name: "South County", total: 11, available: 7, inService: 4 }
  ],
  responseTimeAvg: "8.3 minutes",
  alerts: 2,
};

const COLORS = ["#00C49F", "#FF8042"];

export default function AmbulancesPage() {
  const [selectedArea, setSelectedArea] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      setIsLoaded(true);
    }, 500);
  }, []);

  const displayedArea = selectedArea 
    ? mockAmbulanceData.areas.find(area => area.id === selectedArea) 
    : null;

  const getAreaStats = () => {
    if (!displayedArea) return mockAmbulanceData;
    
    return {
      totalAmbulances: displayedArea.total,
      availableAmbulances: displayedArea.available,
      inServiceAmbulances: displayedArea.inService,
      responseTimeAvg: mockAmbulanceData.responseTimeAvg,
      alerts: mockAmbulanceData.alerts
    };
  };

  const stats = getAreaStats();
  
  const pieData = [
    { name: "Available", value: stats.availableAmbulances },
    { name: "In Service", value: stats.inServiceAmbulances },
  ];

  const areaBarData = mockAmbulanceData.areas.map(area => ({
    name: area.name,
    available: area.available,
    inService: area.inService,
  }));

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : -20 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              <Ambulance className="text-blue-600" />
              Ambulance Fleet Dashboard
            </h1>
            <p className="text-gray-500 mt-1">
              {selectedArea 
                ? `Viewing ambulances in ${displayedArea?.name}`
                : "Real-time overview of all ambulance units"
              }
            </p>
          </div>
          
          <div className="mt-4 sm:mt-0 flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search ambulances..."
                className="pl-9 py-2 pr-4 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="flex items-center gap-1 bg-white border rounded-lg px-3 py-2 text-sm font-medium">
              <Filter className="h-4 w-4" />
              Filters
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-4 border border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Ambulance className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Ambulances</p>
                <h3 className="text-2xl font-bold">{stats.totalAmbulances}</h3>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-4 border border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-3 rounded-lg">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Available Units</p>
                <h3 className="text-2xl font-bold">{stats.availableAmbulances}</h3>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-4 border border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Avg. Response Time</p>
                <h3 className="text-2xl font-bold">{stats.responseTimeAvg}</h3>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm p-4 border border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div className="bg-red-100 p-3 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Active Alerts</p>
                <h3 className="text-2xl font-bold">{stats.alerts}</h3>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: isLoaded ? 1 : 0, x: isLoaded ? 0 : -20 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 lg:col-span-2"
        >
          <h2 className="text-lg font-semibold mb-4">Ambulance Status</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({name, percent}: {name: string, percent: number}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#00C49F]"></div>
              <span className="text-sm text-gray-600">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FF8042]"></div>
              <span className="text-sm text-gray-600">In Service</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, x: isLoaded ? 0 : 20 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 lg:col-span-3"
        >
          <h2 className="text-lg font-semibold mb-4">Distribution by Area</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={areaBarData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="available" name="Available" fill="#00C49F" />
                <Bar dataKey="inService" name="In Service" fill="#FF8042" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Area Selection Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Coverage Areas</h2>
          {selectedArea && (
            <button 
              onClick={() => setSelectedArea(null)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View All Areas
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockAmbulanceData.areas.map((area, index) => (
            <motion.div
              key={area.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              whileHover={{ scale: 1.03 }}
              className={`bg-white rounded-xl shadow-sm p-4 border cursor-pointer
                ${selectedArea === area.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-100'}`}
              onClick={() => setSelectedArea(area.id)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <h3 className="font-medium">{area.name}</h3>
                </div>
                <div className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                  {((area.available / area.total) * 100).toFixed(0)}% available
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500">Total Units</p>
                  <p className="font-semibold">{area.total}</p>
                </div>
                <div className="h-8 w-px bg-gray-200"></div>
                <div>
                  <p className="text-xs text-gray-500">Available</p>
                  <p className="font-semibold text-green-600">{area.available}</p>
                </div>
                <div className="h-8 w-px bg-gray-200"></div>
                <div>
                  <p className="text-xs text-gray-500">In Service</p>
                  <p className="font-semibold text-orange-600">{area.inService}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}