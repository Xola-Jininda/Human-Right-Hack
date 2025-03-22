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
import { SmartAmbulanceAllocator } from "@/components/smartambulance";
import { DatabaseUpload } from "@/components/databaseupload";

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

// Add Facility interface
interface Facility {
  facilityId: string;
  facilityName: string;
  district: string;
  ambulancesDeployed: number;
  operationalStatus: string;
  populationServed: number;
  roadCondition: string;
  priorityTier: "Critical" | "High" | "Medium" | "Low";
}

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
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [availableAmbulances, setAvailableAmbulances] = useState(5);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showUpload, setShowUpload] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    
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
      case "High": return "bg-rose-500 border-rose-600 text-white";
      case "Medium": return "bg-amber-500 border-amber-600 text-white";
      case "Low": return "bg-emerald-500 border-emerald-600 text-white";
      default: return "bg-slate-500 border-slate-600 text-white";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending": return "bg-orange-500 border-orange-600 text-white";
      case "Allocated": return "bg-blue-500 border-blue-600 text-white";
      case "Completed": return "bg-emerald-500 border-emerald-600 text-white";
      default: return "bg-slate-500 border-slate-600 text-white";
    }
  };

  const handleManualAllocate = (bookingId: string) => {
    if (availableAmbulances > 0) {
      setBookings(bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: "Allocated" }
          : booking
      ));
      setAvailableAmbulances(prev => prev - 1);
    }
  };

  const handleAIAllocations = (allocatedBookingIds: string[]) => {
    const allocationsCount = Math.min(allocatedBookingIds.length, availableAmbulances);
    setBookings(prevBookings => 
      prevBookings.map(booking => 
        allocatedBookingIds.includes(booking.id) && booking.status === "Pending"
          ? { ...booking, status: "Allocated" }
          : booking
      )
    );
    setAvailableAmbulances(prev => prev - allocationsCount);
  };

  const handleBookingsLoaded = (facilities: Facility[], ambulanceCount: number) => {
    // Convert Facility objects to Booking objects
    const newBookings: Booking[] = facilities.map(facility => ({
      id: facility.facilityId,
      patientName: facility.facilityName,
      location: facility.district,
      symptoms: "From facility data",  // Default value
      timestamp: new Date().toISOString(),
      priority: facility.priorityTier === "Critical" ? "High" : 
                facility.priorityTier === "High" ? "High" : 
                facility.priorityTier === "Medium" ? "Medium" : "Low",
      status: "Pending"
    }));
    
    setBookings(newBookings);
    setAvailableAmbulances(ambulanceCount);
    setShowUpload(false);
    
    // Auto-run AI allocation after loading
    setTimeout(() => {
      if (newBookings.length > 0 && ambulanceCount > 0) {
        const smartAllocatorElement = document.getElementById('run-ai-allocation-btn');
        if (smartAllocatorElement) {
          smartAllocatorElement.click();
        }
      }
    }, 1500);
  };

  const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: false },
    { icon: Calendar, label: "Bookings", active: true },
    { icon: Ambulance, label: "Ambulances", active: false },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-navy-900 text-white">
      {/* Sidebar (keeping the same as original) */}
      <motion.div 
        initial={{ width: sidebarOpen ? 256 : 80, opacity: 0 }}
        animate={{ width: sidebarOpen ? 256 : 80, opacity: 1 }}
        className="h-screen border-r border-slate-700/50 bg-slate-900/80 backdrop-blur-sm z-20"
      >
        {/* Sidebar content remains unchanged */}
        <div className="p-4 flex justify-between items-center border-b border-slate-700/50">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: sidebarOpen ? 1 : 0, x: sidebarOpen ? 0 : -20 }}
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
                  <Link key={item.label} href={`/dashboard/${item.label.toLowerCase()}`}>
                    <motion.div
                      key={index}
                      variants={sidebarItemVariants}
                      whileHover={{ scale: 1.03, x: 5 }}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        item.active 
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                          : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: sidebarOpen ? 1 : 0, width: sidebarOpen ? 'auto' : 0 }}
                      >
                        {item.label}
                      </motion.span>
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
                animate={{ opacity: sidebarOpen ? 1 : 0, width: sidebarOpen ? 'auto' : 0 }}
              >
                Sign Out
              </motion.span>
            </button>
          </div>
        </motion.nav>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto h-screen p-4 sm:p-6 relative">
        <motion.button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute top-4 left-4 p-2 bg-slate-800/70 hover:bg-slate-700/70 rounded-md border border-slate-700/50 z-30"
        >
          {sidebarOpen ? <ChevronLeft className="h-5 w-5 text-slate-300" /> : <Menu className="h-5 w-5 text-slate-300" />}
        </motion.button>
        
        <motion.div 
          className="container p-6 max-w-7xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <motion.h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              <motion.div className="p-2 bg-blue-500/10 rounded-md">
                <Calendar className="text-blue-400" />
              </motion.div>
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                Ambulance Booking Management
              </span>
            </motion.h1>
            
            <motion.div className="flex items-center gap-4">
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
                className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-md"
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

          {/* Upload Section */}
          <AnimatePresence>
            {showUpload && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6"
              >
                <DatabaseUpload onFacilitiesLoaded={handleBookingsLoaded} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Dashboard Content */}
          {!showUpload && (
            <>
              {/* Stats Cards */}
              <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6" variants={containerVariants}>
                <motion.div 
                  variants={itemVariants} 
                  whileHover={cardHoverVariants.hover}
                  initial="initial"
                  className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl shadow-xl border border-slate-700/50 overflow-hidden backdrop-blur-sm"
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Clock className="w-5 h-5 text-amber-400" />
                      Pending Bookings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <motion.p className="text-3xl font-bold text-white">
                      {bookings.filter(b => b.status === "Pending").length}
                    </motion.p>
                  </CardContent>
                </motion.div>

                <motion.div 
                  variants={itemVariants} 
                  whileHover={cardHoverVariants.hover}
                  initial="initial"
                  className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl shadow-xl border border-slate-700/50 overflow-hidden backdrop-blur-sm"
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Ambulance className="w-5 h-5 text-emerald-400" />
                      Available Ambulances
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <motion.p className="text-3xl font-bold text-white">
                      {availableAmbulances}
                    </motion.p>
                  </CardContent>
                </motion.div>

                <motion.div 
                  variants={itemVariants} 
                  whileHover={cardHoverVariants.hover}
                  initial="initial"
                  className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl shadow-xl border border-slate-700/50 overflow-hidden backdrop-blur-sm"
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <MapPin className="w-5 h-5 text-blue-400" />
                      Active Dispatches
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <motion.p className="text-3xl font-bold text-white">
                      {bookings.filter(b => b.status === "Allocated").length}
                    </motion.p>
                  </CardContent>
                </motion.div>
              </motion.div>

              {/* Main Grid Layout */}
              <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Bookings Table */}
                <motion.div 
                  variants={itemVariants}
                  whileHover={cardHoverVariants.hover}
                  initial="initial"
                  className="lg:col-span-2 bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-2xl shadow-xl border border-slate-700/50 overflow-hidden backdrop-blur-sm"
                >
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-400" />
                      Recent Bookings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[500px] w-full pr-4">
                      <Table>
                        <TableHeader className="bg-slate-800/50 sticky top-0 z-10">
                          <TableRow>
                            <TableHead className="text-slate-300">Patient</TableHead>
                            <TableHead className="text-slate-300">Location</TableHead>
                            <TableHead className="text-slate-300">Symptoms</TableHead>
                            <TableHead className="text-slate-300">Priority</TableHead>
                            <TableHead className="text-slate-300">Status</TableHead>
                            <TableHead className="text-slate-300">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {bookings.map((booking) => (
                            <motion.tr
                              key={booking.id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="border-slate-700/30 hover:bg-slate-800/30"
                            >
                              <TableCell className="font-medium text-white">{booking.patientName}</TableCell>
                              <TableCell className="text-slate-300">{booking.location}</TableCell>
                              <TableCell className="text-slate-300 max-w-[200px] truncate">{booking.symptoms}</TableCell>
                              <TableCell>
                                <Badge className={`${getPriorityColor(booking.priority)} border px-2 py-1`}>
                                  {booking.priority}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge className={`${getStatusColor(booking.status)} border px-2 py-1`}>
                                  {booking.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {booking.status === "Pending" && (
                                  <Button
                                    size="sm"
                                    onClick={() => handleManualAllocate(booking.id)}
                                    disabled={availableAmbulances === 0}
                                    className="bg-blue-600 hover:bg-blue-500 text-white"
                                  >
                                    Allocate
                                  </Button>
                                )}
                              </TableCell>
                            </motion.tr>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </CardContent>
                </motion.div>

                {/* AI Allocator */}
                <motion.div 
                  variants={itemVariants}
                  whileHover={cardHoverVariants.hover}
                  initial="initial"
                >
                  <SmartAmbulanceAllocator
                    bookings={bookings}
                    availableAmbulances={availableAmbulances}
                    onAllocationsComplete={handleAIAllocations}
                  />
                </motion.div>
              </motion.div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}