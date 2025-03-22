"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Ambulance, 
  Brain, 
  Clock, 
  MapPin,
  LayoutDashboard,
  Calendar,
  Users,
  Settings,
  LogOut,
  Menu,
  RefreshCw,
  ChevronLeft
} from "lucide-react";
import Link from "next/link";

// Animation variants
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
  hidden: { y: 20, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 }
  }
};

const sidebarItemVariants = {
  hidden: { x: -20, opacity: 0 },
  show: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
};

interface Booking {
  id: string;
  patientName: string;
  location: string;
  symptoms: string;
  timestamp: string;
  priority: "High" | "Medium" | "Low";
  status: "Pending" | "Allocated" | "Completed";
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: "1",
      patientName: "John Doe",
      location: "123 Emergency St, City",
      symptoms: "Severe chest pain, difficulty breathing",
      timestamp: new Date().toISOString(),
      priority: "High",
      status: "Pending",
    },
    {
      id: "2",
      patientName: "Jane Smith",
      location: "456 Medical Ave, Town",
      symptoms: "Broken arm, conscious but in pain",
      timestamp: new Date().toISOString(),
      priority: "Medium",
      status: "Pending",
    },
  ]);

  const [availableAmbulances, setAvailableAmbulances] = useState(5);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-rose-500 border-rose-600 text-white";
      case "Medium":
        return "bg-amber-500 border-amber-600 text-white";
      case "Low":
        return "bg-emerald-500 border-emerald-600 text-white";
      default:
        return "bg-slate-500 border-slate-600 text-white";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-orange-500 border-orange-600 text-white";
      case "Allocated":
        return "bg-blue-500 border-blue-600 text-white";
      case "Completed":
        return "bg-emerald-500 border-emerald-600 text-white";
      default:
        return "bg-slate-500 border-slate-600 text-white";
    }
  };

  const allocateAmbulance = (bookingId: string) => {
    if (availableAmbulances > 0) {
      setBookings(bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: "Allocated" }
          : booking
      ));
      setAvailableAmbulances(prev => prev - 1);
    }
  };

  const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: false },
    { icon: Calendar, label: "Bookings", active: true },
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
            className="p-2 rounded-md bg-slate-800/60 text-slate-300 hover:text-white border border-slate-700/50"
          >
            <Menu className="h-5 w-5" />
          </motion.button>
        </div>
        
        <motion.nav 
          className="p-4"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
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
                      key={index}
                      variants={sidebarItemVariants}
                      whileHover={{ 
                        scale: 1.03, 
                        x: 5, 
                        transition: { type: "spring", stiffness: 400 } 
                      }}
                      className={`
                        flex items-center gap-4 p-3 rounded-md cursor-pointer mb-2
                        ${item.active 
                          ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md' 
                          : 'hover:bg-slate-800/60 text-slate-300 hover:text-white'}
                        transition-all duration-200
                      `}
                    >
                      <item.icon className="h-5 w-5" />
                      <AnimatePresence>
                        {sidebarOpen && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
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
        </motion.nav>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto h-screen p-4 sm:p-6 relative">
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
          className="container p-6 max-w-7xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.5 }}
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
                  <Calendar className="text-blue-400" />
                </motion.div>
                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                  Ambulance Booking Management
                </span>
              </motion.h1>
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
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-2 bg-blue-500/10 px-3 py-1.5 rounded-md border border-blue-500/20"
              >
                <Brain className="h-4 w-4 text-cyan-400" />
                <span className="text-sm text-cyan-300">AI Assistant Active</span>
              </motion.div>
              
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

          {/* Stats Cards */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.03, y: -5 }}
              className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-md shadow-lg overflow-hidden backdrop-blur-sm border border-slate-700/50"
            >
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/10 to-amber-500/0 pointer-events-none"
                initial={{ x: "-100%" }}
                animate={{ x: "200%" }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
              />
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-white">
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                    className="bg-amber-500/20 p-2 rounded-md"
                  >
                    <Clock className="w-5 h-5 text-amber-400" />
                  </motion.div>
                  Pending Bookings
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <AnimatePresence mode="wait">
                  <motion.p 
                    key={bookings.filter(b => b.status === "Pending").length}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-3xl font-bold text-white"
                  >
                    {bookings.filter(b => b.status === "Pending").length}
                  </motion.p>
                </AnimatePresence>
              </CardContent>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.03, y: -5 }}
              className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-md shadow-lg overflow-hidden backdrop-blur-sm border border-slate-700/50"
            >
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-emerald-500/0 pointer-events-none"
                initial={{ x: "-100%" }}
                animate={{ x: "200%" }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
              />
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-white">
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                    className="bg-emerald-500/20 p-2 rounded-md"
                  >
                    <Ambulance className="w-5 h-5 text-emerald-400" />
                  </motion.div>
                  Available Ambulances
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <AnimatePresence mode="wait">
                  <motion.p 
                    key={availableAmbulances}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-3xl font-bold text-white flex items-center gap-2"
                  >
                    {availableAmbulances}
                    {availableAmbulances === 0 && (
                      <span className="text-xs font-normal text-rose-400 bg-rose-500/20 px-2 py-0.5 rounded-full">
                        Critical
                      </span>
                    )}
                  </motion.p>
                </AnimatePresence>
              </CardContent>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.03, y: -5 }}
              className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-md shadow-lg overflow-hidden backdrop-blur-sm border border-slate-700/50"
            >
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 pointer-events-none"
                initial={{ x: "-100%" }}
                animate={{ x: "200%" }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
              />
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-white">
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                    className="bg-blue-500/20 p-2 rounded-md"
                  >
                    <MapPin className="w-5 h-5 text-blue-400" />
                  </motion.div>
                  Active Dispatches
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <AnimatePresence mode="wait">
                  <motion.p 
                    key={bookings.filter(b => b.status === "Allocated").length}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-3xl font-bold text-white"
                  >
                    {bookings.filter(b => b.status === "Allocated").length}
                  </motion.p>
                </AnimatePresence>
              </CardContent>
            </motion.div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.4 }}
            className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-md shadow-xl border border-slate-700/50 overflow-hidden backdrop-blur-sm"
          >
            <div className="absolute inset-0 bg-slate-500/5"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-cyan-500/0 rounded-bl-full"></div>
            
            <CardHeader className="relative z-10">
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                Recent Bookings
              </CardTitle>
            </CardHeader>
            
            <CardContent className="relative z-10">
              <ScrollArea className="h-[500px] w-full pr-4">
                <Table>
                  <TableHeader className="bg-slate-800/50 sticky top-0 z-10">
                    <TableRow className="border-slate-700/50 hover:bg-transparent">
                      <TableHead className="text-slate-300">Patient</TableHead>
                      <TableHead className="text-slate-300">Location</TableHead>
                      <TableHead className="text-slate-300">Symptoms</TableHead>
                      <TableHead className="text-slate-300">Priority</TableHead>
                      <TableHead className="text-slate-300">Status</TableHead>
                      <TableHead className="text-slate-300">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {bookings.map((booking, index) => (
                        <motion.tr
                          key={booking.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ 
                            opacity: 1, 
                            y: 0,
                            transition: { delay: index * 0.1 }
                          }}
                          exit={{ opacity: 0, y: -20 }}
                          className="border-slate-700/30 hover:bg-slate-800/30 transition-colors"
                        >
                          <TableCell className="font-medium text-white">
                            {booking.patientName}
                          </TableCell>
                          <TableCell className="text-slate-300">{booking.location}</TableCell>
                          <TableCell className="text-slate-300 max-w-[200px] truncate" title={booking.symptoms}>
                            {booking.symptoms}
                          </TableCell>
                          <TableCell>
                            <motion.div whileHover={{ scale: 1.05 }}>
                              <Badge className={`${getPriorityColor(booking.priority)} border px-2 py-1`}>
                                {booking.priority}
                              </Badge>
                            </motion.div>
                          </TableCell>
                          <TableCell>
                            <motion.div whileHover={{ scale: 1.05 }}>
                              <Badge className={`${getStatusColor(booking.status)} border px-2 py-1`}>
                                {booking.status}
                              </Badge>
                            </motion.div>
                          </TableCell>
                          <TableCell>
                            {booking.status === "Pending" && (
                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Button
                                  size="sm"
                                  onClick={() => allocateAmbulance(booking.id)}
                                  disabled={availableAmbulances === 0}
                                  className={`bg-blue-600 hover:bg-blue-500 text-white ${
                                    availableAmbulances === 0 ? 'opacity-50 cursor-not-allowed' : ''
                                  }`}
                                >
                                  Allocate Ambulance
                                </Button>
                              </motion.div>
                            )}
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}