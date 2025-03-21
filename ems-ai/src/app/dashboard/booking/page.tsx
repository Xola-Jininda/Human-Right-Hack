"use client";

import { useState, useEffect } from "react";
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
  Menu
} from "lucide-react";

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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-500";
      case "Medium":
        return "bg-yellow-500";
      case "Low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-orange-500";
      case "Allocated":
        return "bg-blue-500";
      case "Completed":
        return "bg-green-500";
      default:
        return "bg-gray-500";
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
    { icon: LayoutDashboard, label: "Dashboard", active: true },
    { icon: Calendar, label: "Bookings" },
    { icon: Ambulance, label: "Ambulances" },
    { icon: Users, label: "Patients" },
    { icon: Settings, label: "Settings" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white h-screen transition-all duration-300 border-r`}>
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className={`font-bold text-xl ${!sidebarOpen && 'hidden'}`}>Admin Panel</h2>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
        <nav className="p-4">
          {sidebarItems.map((item, index) => (
            <div
              key={index}
              className={`
                flex items-center gap-4 p-3 rounded-lg cursor-pointer
                ${item.active ? 'bg-primary text-primary-foreground' : 'hover:bg-gray-100'}
                mb-2 transition-colors
              `}
            >
              <item.icon className="h-5 w-5" />
              {sidebarOpen && <span>{item.label}</span>}
            </div>
          ))}
          <div className="mt-auto pt-4 border-t">
            <div className="flex items-center gap-4 p-3 rounded-lg cursor-pointer hover:bg-gray-100 text-red-500">
              <LogOut className="h-5 w-5" />
              {sidebarOpen && <span>Logout</span>}
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="container p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Ambulance Booking Management</h1>
            <div className="flex items-center gap-4">
              <Brain className="w-6 h-6 text-primary" />
              <span className="text-lg font-semibold">AI Assistant Active</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Pending Bookings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {bookings.filter(b => b.status === "Pending").length}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ambulance className="w-5 h-5" />
                  Available Ambulances
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{availableAmbulances}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Active Dispatches
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {bookings.filter(b => b.status === "Allocated").length}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Symptoms</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">
                          {booking.patientName}
                        </TableCell>
                        <TableCell>{booking.location}</TableCell>
                        <TableCell>{booking.symptoms}</TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(booking.priority)}>
                            {booking.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {booking.status === "Pending" && (
                            <Button
                              size="sm"
                              onClick={() => allocateAmbulance(booking.id)}
                              disabled={availableAmbulances === 0}
                            >
                              Allocate Ambulance
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}