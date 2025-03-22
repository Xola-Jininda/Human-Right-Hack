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

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 }
  }
};

const cardHoverVariants = {
  hover: {
    y: -5,
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
    transition: { type: "spring", stiffness: 400 }
  }
};

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
    <div className="min-h-screen bg-navy-900 text-white p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : -20 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex flex-col items-center text-center justify-between mb-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-col items-center"
          >
            <motion.h1 
              className="text-2xl md:text-3xl font-bold flex items-center gap-2"
            >
              <motion.div
                initial={{ rotate: -10, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <Ambulance className="text-blue-400" />
              </motion.div>
              <span className="bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
                Ambulance Fleet Dashboard
              </span>
            </motion.h1>
            <p className="text-gray-300 mt-1">
              {selectedArea 
                ? `Viewing ambulances in ${displayedArea?.name}`
                : "Real-time overview of all ambulance units"
              }
            </p>
          </motion.div>
        </div>

        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            className="relative bg-gradient-to-br from-navy-800 to-navy-700 rounded-xl shadow-lg p-4 border-2 border-gray-500 overflow-hidden group"
          >
            {/* Glow effect */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0 pointer-events-none opacity-0 group-hover:opacity-100"
              initial={{ x: "-100%" }}
              whileHover={{ x: "200%" }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            />
            <div className="flex items-center gap-3 relative z-10">
              <motion.div 
                className="bg-blue-900/50 p-3 rounded-lg"
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <Ambulance className="h-6 w-6 text-blue-400 " />
              </motion.div>
              <div>
                <p className="text-sm text-gray-300">Total Ambulances</p>
                <h3 className="text-2xl font-bold text-white">{stats.totalAmbulances}</h3>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            className="relative bg-gradient-to-br from-navy-800 to-navy-700 rounded-xl shadow-lg p-4 border border-gray-500 overflow-hidden group"
          >
            {/* Glow effect */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/20 to-green-500/0 pointer-events-none opacity-0 group-hover:opacity-100"
              initial={{ x: "-100%" }}
              whileHover={{ x: "200%" }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            />
            <div className="flex items-center gap-3 relative z-10">
              <motion.div 
                className="bg-green-900/50 p-3 rounded-lg"
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <Check className="h-6 w-6 text-green-400" />
              </motion.div>
              <div>
                <p className="text-sm text-gray-300">Available Units</p>
                <h3 className="text-2xl font-bold text-white">{stats.availableAmbulances}</h3>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            className="relative bg-gradient-to-br from-navy-800 to-navy-700 rounded-xl shadow-lg p-4 border border-gray-500 overflow-hidden group"
          >
            {/* Glow effect */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/20 to-orange-500/0 pointer-events-none opacity-0 group-hover:opacity-100"
              initial={{ x: "-100%" }}
              whileHover={{ x: "200%" }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            />
            <div className="flex items-center gap-3 relative z-10">
              <motion.div 
                className="bg-orange-900/50 p-3 rounded-lg"
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <Clock className="h-6 w-6 text-orange-400" />
              </motion.div>
              <div>
                <p className="text-sm text-gray-300">Avg. Response Time</p>
                <h3 className="text-2xl font-bold text-white">{stats.responseTimeAvg}</h3>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            className="relative bg-gradient-to-br from-navy-800 to-navy-700 rounded-xl shadow-lg p-4 border border-gray-500 overflow-hidden group"
          >
            {/* Glow effect */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/20 to-red-500/0 pointer-events-none opacity-0 group-hover:opacity-100"
              initial={{ x: "-100%" }}
              whileHover={{ x: "200%" }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            />
            <div className="flex items-center gap-3 relative z-10">
              <motion.div 
                className="bg-red-900/50 p-3 rounded-lg"
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <AlertTriangle className="h-6 w-6 text-red-400" />
              </motion.div>
              <div>
                <p className="text-sm text-gray-300">Active Alerts</p>
                <h3 className="text-2xl font-bold text-white">{stats.alerts}</h3>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: isLoaded ? 1 : 0, x: isLoaded ? 0 : -20 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
          className="relative bg-gradient-to-br from-navy-800 to-navy-700 rounded-xl shadow-lg p-5 border border-gray-500 lg:col-span-2 overflow-hidden group"
        >
          {/* Glow effect */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0 pointer-events-none opacity-0 group-hover:opacity-100"
            initial={{ x: "-100%" }}
            whileHover={{ x: "200%" }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          />
          <h2 className="text-lg font-semibold mb-4 text-white relative z-10">Ambulance Status</h2>
          <div className="h-[300px] relative z-10">
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
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b", color: "white" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4 relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#00C49F]"></div>
              <span className="text-sm text-gray-300">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FF8042]"></div>
              <span className="text-sm text-gray-300">In Service</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, x: isLoaded ? 0 : 20 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
          className="relative bg-gradient-to-br from-navy-800 to-navy-700 rounded-xl shadow-lg p-5 border border-gray-500 lg:col-span-3 overflow-hidden group"
        >
          {/* Glow effect */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-teal-500/0 via-teal-500/20 to-teal-500/0 pointer-events-none opacity-0 group-hover:opacity-100"
            initial={{ x: "-100%" }}
            whileHover={{ x: "200%" }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          />
          <h2 className="text-lg font-semibold mb-4 text-white relative z-10">Distribution by Area</h2>
          <div className="h-[300px] relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={areaBarData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b", color: "white" }} />
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
          <h2 className="text-lg font-semibold text-white">Coverage Areas</h2>
          {selectedArea && (
            <motion.button 
              onClick={() => setSelectedArea(null)}
              className="text-sm text-blue-400 hover:text-blue-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View All Areas
            </motion.button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockAmbulanceData.areas.map((area, index) => (
            <motion.div
              key={area.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              whileHover={{ scale: 1.05 }}
              className={`relative bg-gradient-to-br from-navy-800 to-navy-700 rounded-xl shadow-lg p-4 cursor-pointer overflow-hidden group
                ${selectedArea === area.id ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border border-gray-500'}`}
              onClick={() => setSelectedArea(area.id)}
            >
              {/* Glow effect */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0 pointer-events-none opacity-0 group-hover:opacity-100"
                initial={{ x: "-100%" }}
                whileHover={{ x: "200%" }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              />
              <div className="flex items-center justify-between mb-3 relative z-10">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-400" />
                  <h3 className="font-medium text-white">{area.name}</h3>
                </div>
                <div className="text-xs px-2 py-1 bg-blue-900/50 text-blue-300 rounded-full">
                  {((area.available / area.total) * 100).toFixed(0)}% available
                </div>
              </div>
              <div className="flex justify-between items-center relative z-10">
                <div>
                  <p className="text-xs text-gray-300">Total Units</p>
                  <p className="font-semibold text-white">{area.total}</p>
                </div>
                <div className="h-8 w-px bg-navy-600"></div>
                <div>
                  <p className="text-xs text-gray-300">Available</p>
                  <p className="font-semibold text-green-400">{area.available}</p>
                </div>
                <div className="h-8 w-px bg-navy-600"></div>
                <div>
                  <p className="text-xs text-gray-300">In Service</p>
                  <p className="font-semibold text-orange-400">{area.inService}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}