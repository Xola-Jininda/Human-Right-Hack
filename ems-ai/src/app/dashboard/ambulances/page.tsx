"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Ambulance, 
  MapPin, 
  Battery, 
  Clock, 
  Activity,
  Calendar,
  RefreshCw,
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Menu,
  Plus,
  Filter,
  Search,
  ChevronLeft
} from "lucide-react";
import Link from "next/link";

// Enhanced animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0, scale: 0.95 },
  show: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 }
  }
};

const cardHoverVariants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.03,
    y: -5,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 20 
    }
  }
};

const sidebarItemVariants = {
  hidden: { x: -20, opacity: 0 },
  show: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
};

// Example ambulance data
const mockAmbulances = [
  { 
    id: "AMB-001", 
    status: "Available", 
    location: "Downtown Central",
    fuelLevel: 85,
    lastMaintenance: "2023-10-15",
    equipmentStatus: "Full",
    crew: ["Dr. James Wilson", "Nurse Sarah Chen"]
  },
  { 
    id: "AMB-002", 
    status: "In Service", 
    location: "North Hospital",
    fuelLevel: 60,
    lastMaintenance: "2023-09-28",
    equipmentStatus: "Full",
    crew: ["Dr. Emily Rodriguez", "Nurse Michael Lee"]
  },
  { 
    id: "AMB-003", 
    status: "Maintenance", 
    location: "Central Garage",
    fuelLevel: 30,
    lastMaintenance: "2023-11-02",
    equipmentStatus: "Needs Restock",
    crew: []
  },
  { 
    id: "AMB-004", 
    status: "Available", 
    location: "East District",
    fuelLevel: 90,
    lastMaintenance: "2023-10-10",
    equipmentStatus: "Full",
    crew: ["Dr. David Kim", "Nurse Lisa Johnson"]
  },
  { 
    id: "AMB-005", 
    status: "In Service", 
    location: "South County",
    fuelLevel: 75,
    lastMaintenance: "2023-10-05",
    equipmentStatus: "Partial",
    crew: ["Dr. Robert Chen", "Nurse Anna Petrov"]
  }
];

export default function AmbulancesDetailPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [ambulances, setAmbulances] = useState(mockAmbulances);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

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

  const refreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-emerald-500 border-emerald-600 text-white";
      case "In Service":
        return "bg-blue-500 border-blue-600 text-white";
      case "Maintenance":
        return "bg-amber-500 border-amber-600 text-white";
      default:
        return "bg-slate-500 border-slate-600 text-white";
    }
  };

  const getFilteredAmbulances = () => {
    if (!filterStatus) return ambulances;
    return ambulances.filter(amb => amb.status === filterStatus);
  };

  const filteredAmbulances = getFilteredAmbulances();

  const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: false },
    { icon: Calendar, label: "Bookings", active: false },
    { icon: Ambulance, label: "Ambulances", active: true },
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
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : -20 }}
          transition={{ duration: 0.5 }}
          className="mb-8 max-w-7xl mx-auto"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
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
                  Ambulance Fleet Management
                </span>
              </motion.h1>
              <p className="text-slate-300 mt-1">
                Detailed view of all ambulances and their current status
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-4"
            >
              <div className="flex items-center gap-2 bg-slate-800/60 px-3 py-1.5 rounded-md border border-slate-700/50">
                <Calendar className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-slate-300">
                  {currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={refreshData}
                className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
              >
                <motion.div
                  animate={{ rotate: isRefreshing ? 360 : 0 }}
                  transition={{ duration: 1, ease: "linear" }}
                >
                  <RefreshCw className="h-4 w-4" />
                </motion.div>
                Refresh
              </motion.button>
            </motion.div>
          </div>

          {/* Filters and Add Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-between gap-4 mb-6 p-3 bg-slate-800/40 rounded-2xl shadow-lg border border-slate-700/50 backdrop-blur-sm"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-300 flex items-center gap-1">
                <Filter className="h-4 w-4" /> Filter:
              </span>
              {["Available", "In Service", "Maintenance"].map(status => (
                <motion.button
                  key={status}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilterStatus(filterStatus === status ? null : status)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    filterStatus === status 
                      ? getStatusColor(status)
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  {status}
                </motion.button>
              ))}
              {filterStatus && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-xs text-slate-400 hover:text-white"
                  onClick={() => setFilterStatus(null)}
                >
                  Clear filter
                </motion.button>
              )}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Ambulance
            </motion.button>
          </motion.div>

          {/* Ambulance Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {filteredAmbulances.map((ambulance, index) => (
              <motion.div
                key={ambulance.id}
                variants={itemVariants}
                whileHover={cardHoverVariants.hover}
                className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-2xl shadow-xl border border-slate-700/50 overflow-hidden backdrop-blur-sm p-5"
              >
                {/* Glass effect */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-transparent via-slate-500/5 to-transparent rounded-2xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                ></motion.div>
                
                {/* Status indicator */}
                <motion.div 
                  className={`absolute top-3 right-3 h-2 w-2 rounded-full ${
                    ambulance.status === "Available" ? "bg-emerald-500" :
                    ambulance.status === "In Service" ? "bg-blue-500" :
                    ambulance.status === "Maintenance" ? "bg-amber-500" : "bg-slate-500"
                  }`}
                  animate={{ 
                    scale: [1, 1.5, 1],
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
                    <div className="p-2 bg-blue-500/10 rounded-md">
                      <Ambulance className="h-5 w-5 text-blue-400" />
                    </div>
                    <h3 className="font-medium text-white">{ambulance.id}</h3>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(ambulance.status)}`}>
                    {ambulance.status}
                  </div>
                </div>
                
                <div className="space-y-3 relative z-10">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-300">{ambulance.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Battery className="h-4 w-4 text-slate-400" />
                    <div className="flex-1">
                      <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                        <motion.div 
                          className={`h-full ${
                            ambulance.fuelLevel > 70 ? "bg-emerald-500" :
                            ambulance.fuelLevel > 30 ? "bg-amber-500" : "bg-rose-500"
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${ambulance.fuelLevel}%` }}
                          transition={{ duration: 1, delay: 0.2 + (index * 0.1) }}
                        />
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-slate-400">Fuel</span>
                        <span className="text-xs text-slate-400">{ambulance.fuelLevel}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-slate-400" />
                    <span className="text-xs text-slate-400">Last Maintenance: </span>
                    <span className="text-xs text-slate-300">{new Date(ambulance.lastMaintenance).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-slate-400" />
                    <span className="text-xs text-slate-400">Equipment: </span>
                    <span className={`text-xs ${
                      ambulance.equipmentStatus === "Full" ? "text-emerald-400" :
                      ambulance.equipmentStatus === "Partial" ? "text-amber-400" : "text-rose-400"
                    }`}>
                      {ambulance.equipmentStatus}
                    </span>
                  </div>
                  
                  {ambulance.crew.length > 0 && (
                    <div className="pt-2 border-t border-slate-700/50">
                      <p className="text-xs text-slate-400 mb-2">Current Crew:</p>
                      <div className="space-y-1">
                        {ambulance.crew.map((member, i) => (
                          <div key={i} className="text-sm text-slate-300">
                            {member}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 pt-4 border-t border-slate-700/50 flex justify-between">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md"
                  >
                    Details
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-xs px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md"
                  >
                    Manage
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}