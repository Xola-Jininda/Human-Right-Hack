"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Filter,
  Calendar,
  RefreshCw,
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Menu,
  ChevronLeft
} from "lucide-react";
import Link from "next/link";

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

// Update colors for a more dynamic palette
const COLORS = ["#10b981", "#f97316"];
const CHART_GRADIENT = {
  available: ["#10b981", "#059669"],
  inService: ["#f97316", "#ea580c"]
};

// Enhanced animation variants
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

// Added sidebar animation variants
const sidebarItemVariants = {
  hidden: { x: -20, opacity: 0 },
  show: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
};

export default function AmbulancesPage() {
  const [selectedArea, setSelectedArea] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  // Add sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    
    // Update time every minute
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // Function to refresh data
  const refreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

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

  // Sidebar items array
  const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: true },
    { icon: Calendar, label: "Bookings", active: false },
    { icon: Ambulance, label: "Ambulances", active: false },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-navy-900 text-white">
      {/* Sidebar */}
      <motion.div 
        initial={{ width: sidebarOpen ? 256 : 80, opacity: 0 }}
        animate={{ 
          width: sidebarOpen ? 256 : 80, 
          opacity: 1,
          transition: { duration: 0.3, ease: "easeInOut" }
        }}
        className="h-screen border-r border-slate-700/50 bg-slate-900/80 backdrop-blur-sm z-20"
      >
        <div className="p-4 flex justify-between items-center border-b border-slate-700/50">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ 
              opacity: sidebarOpen ? 1 : 0, 
              x: sidebarOpen ? 0 : -20,
              transition: { duration: 0.2 }
            }}
            className="font-bold text-xl bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent"
          >
            EMS Admin
          </motion.h2>
          <motion.button 
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg bg-slate-800/60 text-slate-300 hover:text-white border border-slate-700/50"
          >
            <Menu className="h-5 w-5" />
          </motion.button>
        </div>
        
        <div className="px-3 py-6">
          <nav className="space-y-1">
            <AnimatePresence>
              {sidebarItems.map((item, index) => (
                <Link
                  key={item.label}
                  href={
                    item.label === "Dashboard" 
                      ? "/dashboard" 
                      : item.label === "Bookings" 
                        ? "/dashboard/booking" 
                        : `/dashboard/${item.label.toLowerCase()}`
                  }
                  className="block"
                >
                  <motion.div
                    variants={sidebarItemVariants}
                    initial="hidden"
                    animate="show"
                    transition={{ delay: 0.1 * index }}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium ${
                      item.active 
                        ? 'bg-gradient-to-r from-blue-600/50 to-blue-700/50 text-white' 
                        : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                    } transition-colors`}
                  >
                    <item.icon className={`h-5 w-5 ${item.active ? 'text-blue-300' : 'text-slate-400'}`} />
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ 
                        opacity: sidebarOpen ? 1 : 0,
                        width: sidebarOpen ? 'auto' : 0,
                        transition: { duration: 0.2 }
                      }}
                      className="whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                    {item.active && (
                      <motion.div 
                        layoutId="sidebar-active-indicator"
                        className="w-1 h-5 bg-blue-400 rounded-full ml-auto"
                      />
                    )}
                  </motion.div>
                </Link>
              ))}
            </AnimatePresence>
          </nav>
        </div>
        
        <div className="px-3 py-3 mt-auto border-t border-slate-700/50">
          <button 
            className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:bg-red-500/10 hover:text-red-400 transition-colors"
            onClick={() => console.log('Sign out')}
          >
            <LogOut className="h-5 w-5 text-slate-400" />
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ 
                opacity: sidebarOpen ? 1 : 0,
                width: sidebarOpen ? 'auto' : 0 
              }}
              className="whitespace-nowrap"
            >
              Sign Out
            </motion.span>
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto h-screen p-4 sm:p-6 md:p-8 relative">
        {/* Hamburger Menu - Top Left */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute top-4 left-4 p-2 bg-slate-800/70 hover:bg-slate-700/70 rounded-md border border-slate-700/50 z-30 flex items-center justify-center"
          aria-label="Toggle menu"
        >
          {sidebarOpen ? (
            <ChevronLeft className="h-5 w-5 text-slate-300" />
          ) : (
            <Menu className="h-5 w-5 text-slate-300" />
          )}
        </motion.button>
        
        {/* Dashboard Header */}
        <div className="mb-8 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : -20 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex flex-col"
            >
              <motion.h1 
                className="text-2xl md:text-3xl font-bold flex items-center gap-2"
              >
                <motion.div
                  initial={{ rotate: -10, scale: 0.8 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="p-2 bg-blue-500/10 rounded-md"
                >
                  <Ambulance className="text-blue-400" />
                </motion.div>
                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                  Ambulance Fleet Dashboard
                </span>
              </motion.h1>
              <p className="text-slate-300 mt-1">
                {selectedArea 
                  ? `Viewing ambulances in ${displayedArea?.name}`
                  : "Real-time overview of all ambulance units"
                }
              </p>
            </motion.div>
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1 px-3 py-1.5 bg-slate-800/80 rounded-md border border-slate-700/50">
                <Clock className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-slate-300">
                  {currentTime.toLocaleDateString()} {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={refreshData}
                className="flex items-center gap-1 px-3 py-1.5 bg-slate-800/80 rounded-md border border-slate-700/50 text-blue-400 hover:bg-slate-700/50 transition-colors"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                <span className="text-sm">Refresh</span>
              </motion.button>
              
              <div className="relative flex items-center gap-1 px-2 py-1.5 bg-slate-800/80 rounded-md border border-slate-700/50">
                <Search className="h-4 w-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="w-32 sm:w-48 bg-transparent border-none text-sm text-white focus:outline-none"
                />
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1 px-3 py-1.5 bg-slate-800/80 rounded-md border border-slate-700/50 text-slate-300 hover:bg-slate-700/50 transition-colors"
              >
                <Filter className="h-4 w-4 text-slate-400" />
                <span className="text-sm">Filter</span>
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Statistics Cards */}
        <div className="mb-8 max-w-7xl mx-auto">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            {/* Ambulance Stats Card */}
            <motion.div
              variants={itemVariants}
              className="col-span-1"
            >
              <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-md shadow-xl border border-slate-700/50 overflow-hidden backdrop-blur-sm p-5 h-full">
                <div className="absolute inset-0 bg-slate-500/5"></div>
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/20 to-cyan-500/0 rounded-bl-md"></div>
                
                <div className="relative z-10">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                    <div className="p-2 bg-emerald-500/10 rounded-md">
                      <Ambulance className="h-5 w-5 text-emerald-400" />
                    </div>
                    Total Ambulances
                  </h2>
                  
                  <div className="flex items-center gap-4">
                    <div>
                      <AnimatePresence mode="wait">
                        <motion.p 
                          key={stats.totalAmbulances}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="text-4xl font-bold text-white"
                        >
                          {stats.totalAmbulances}
                        </motion.p>
                      </AnimatePresence>
                      <p className="text-slate-400 text-sm mt-1">Total fleet size</p>
                    </div>
                    
                    <div className="pl-4 border-l border-slate-700">
                      <div className="flex items-center gap-1">
                        <div className="h-3 w-3 bg-emerald-500 rounded-full"></div>
                        <span className="text-sm text-slate-300">Available: {stats.availableAmbulances}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="h-3 w-3 bg-orange-500 rounded-full"></div>
                        <span className="text-sm text-slate-300">In Service: {stats.inServiceAmbulances}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Response Time Card */}
            <motion.div
              variants={itemVariants}
              className="col-span-1"
            >
              <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-md shadow-xl border border-slate-700/50 overflow-hidden backdrop-blur-sm p-5 h-full">
                <div className="absolute inset-0 bg-slate-500/5"></div>
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-cyan-500/20 to-blue-500/0 rounded-bl-md"></div>
                
                <div className="relative z-10">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                    <div className="p-2 bg-cyan-500/10 rounded-md">
                      <Clock className="h-5 w-5 text-cyan-400" />
                    </div>
                    Response Time
                  </h2>
                  
                  <AnimatePresence mode="wait">
                    <motion.p 
                      key={stats.responseTimeAvg}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-4xl font-bold text-white"
                    >
                      {stats.responseTimeAvg}
                    </motion.p>
                  </AnimatePresence>
                  <p className="text-slate-400 text-sm mt-1">Average response time</p>
                  
                  <div className="mt-2 pt-2 border-t border-slate-700/50">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">Response rating</span>
                      <span className="text-xs text-emerald-400 font-medium">Excellent</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-700 rounded-full mt-1 overflow-hidden">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                        initial={{ width: 0 }}
                        animate={{ width: "85%" }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Alerts Card */}
            <motion.div
              variants={itemVariants}
              className="col-span-1"
            >
              <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-md shadow-xl border border-slate-700/50 overflow-hidden backdrop-blur-sm p-5 h-full">
                <div className="absolute inset-0 bg-slate-500/5"></div>
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-500/20 to-orange-500/0 rounded-bl-md"></div>
                
                <div className="relative z-10">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                    <div className="p-2 bg-amber-500/10 rounded-md">
                      <AlertTriangle className="h-5 w-5 text-amber-400" />
                    </div>
                    Alerts
                  </h2>
                  
                  <AnimatePresence mode="wait">
                    <motion.p 
                      key={stats.alerts}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-4xl font-bold text-white"
                    >
                      {stats.alerts}
                    </motion.p>
                  </AnimatePresence>
                  <p className="text-slate-400 text-sm mt-1">Active alerts</p>
                  
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-2 p-2 bg-amber-500/10 rounded-md">
                      <div className="h-2 w-2 bg-amber-500 rounded-full"></div>
                      <span className="text-xs text-amber-400">3 units low on fuel</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-red-500/10 rounded-md">
                      <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                      <span className="text-xs text-red-400">1 unit requires maintenance</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Charts Section */}
        <div className="mb-8 max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
          >
            {/* Pie Chart */}
            <motion.div
              variants={itemVariants}
              className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-md shadow-xl border border-slate-700/50 overflow-hidden backdrop-blur-sm p-5"
            >
              <div className="absolute inset-0 bg-slate-500/5"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-500/20 to-emerald-500/0 rounded-bl-md"></div>
              
              <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4 relative z-10">
                <div className="p-2 bg-teal-500/10 rounded-md">
                  <Activity className="h-5 w-5 text-teal-400" />
                </div>
                Status Distribution
              </h2>
              
              <div className="h-[300px] relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Available', value: stats.availableAmbulances },
                        { name: 'In Service', value: stats.inServiceAmbulances },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                      stroke="rgba(0,0,0,0.1)"
                      strokeWidth={2}
                    >
                      {COLORS.map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: '8px',
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        border: '1px solid #1e293b',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <p className="text-sm text-slate-400">Total Fleet</p>
                  <p className="text-3xl font-bold text-white">{stats.totalAmbulances}</p>
                </div>
              </div>
              
              <div className="flex justify-center gap-6 mt-2 relative z-10">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[0] }}></div>
                  <span className="text-sm text-slate-300">Available ({stats.availableAmbulances})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[1] }}></div>
                  <span className="text-sm text-slate-300">In Service ({stats.inServiceAmbulances})</span>
                </div>
              </div>
            </motion.div>
            
            {/* Bar Chart */}
            <motion.div
              variants={itemVariants}
              className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-md shadow-xl border border-slate-700/50 overflow-hidden backdrop-blur-sm p-5"
            >
              <div className="absolute inset-0 bg-slate-500/5"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-indigo-500/0 rounded-bl-md"></div>
              
              <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4 relative z-10">
                <div className="p-2 bg-blue-500/10 rounded-md">
                  <MapPin className="h-5 w-5 text-blue-400" />
                </div>
                Distribution by Area
              </h2>
              
              <div className="h-[300px] relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={areaBarData}
                    margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
                  >
                    <defs>
                      <linearGradient id="barAvailable" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.2}/>
                      </linearGradient>
                      <linearGradient id="barInService" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0.2}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" axisLine={false} tickLine={false} />
                    <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "rgba(15, 23, 42, 0.9)", 
                        borderColor: "#1e293b",
                        borderRadius: "8px",
                        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)"
                      }}
                      cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                    />
                    <Legend iconType="circle" />
                    <Bar dataKey="available" name="Available" radius={[8, 8, 0, 0]} fill="url(#barAvailable)" />
                    <Bar dataKey="inService" name="In Service" radius={[8, 8, 0, 0]} fill="url(#barInService)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Areas Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Coverage Areas</h2>
            {selectedArea && (
              <motion.button 
                onClick={() => setSelectedArea(null)}
                className="text-sm px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-md text-white"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View All Areas
              </motion.button>
            )}
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {mockAmbulanceData.areas.map((area, index) => (
              <motion.div
                key={area.id}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.03, 
                  y: -5,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
                }}
                className={`relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-md shadow-xl p-5 cursor-pointer backdrop-blur-sm overflow-hidden
                  ${selectedArea === area.id 
                      ? 'ring-2 ring-blue-500 border border-blue-500/50' 
                      : 'border border-slate-700/50 hover:border-slate-600/50'}`}
                onClick={() => setSelectedArea(area.id)}
              >
                {/* Glass effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-slate-500/5 to-transparent"></div>
                
                {/* Status indicator */}
                <motion.div 
                  className="absolute top-3 right-3 h-2 w-2 rounded-full bg-emerald-500"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{ 
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut"
                  }}
                />
                
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-cyan-500/10 rounded-md">
                      <MapPin className="h-5 w-5 text-cyan-400" />
                    </div>
                    <h3 className="font-medium text-white">{area.name}</h3>
                  </div>
                  <div className="text-xs px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded-full font-medium">
                    {((area.available / area.total) * 100).toFixed(0)}% available
                  </div>
                </div>
                
                <div className="flex justify-between items-center relative z-10 p-3 bg-slate-800/50 rounded-md border border-slate-700/50">
                  <div className="text-center">
                    <p className="text-xs text-slate-400 mb-1">Total Units</p>
                    <p className="font-semibold text-white text-lg">{area.total}</p>
                  </div>
                  <div className="h-10 w-px bg-slate-700/50"></div>
                  <div className="text-center">
                    <p className="text-xs text-slate-400 mb-1">Available</p>
                    <p className="font-semibold text-emerald-400 text-lg">{area.available}</p>
                  </div>
                  <div className="h-10 w-px bg-slate-700/50"></div>
                  <div className="text-center">
                    <p className="text-xs text-slate-400 mb-1">In Service</p>
                    <p className="font-semibold text-orange-400 text-lg">{area.inService}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}