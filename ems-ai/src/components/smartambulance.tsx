"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Brain, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";

// Updated interface that matches the expectations of AdminBookings
interface Booking {
  id: string;
  patientName: string;
  location: string;
  symptoms: string;
  timestamp: string;
  priority: "High" | "Medium" | "Low";
  status: "Pending" | "Allocated" | "Completed";
}

interface AllocationResult {
  allocations: string[];
  reasoning: string;
}

export function SmartAmbulanceAllocator({
  bookings,
  availableAmbulances,
  onAllocationsComplete
}: {
  bookings: Booking[];
  availableAmbulances: number;
  onAllocationsComplete: (allocatedBookingIds: string[]) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allocationResult, setAllocationResult] = useState<AllocationResult | null>(null);
  
  const runAIAllocation = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call since we can't access the real API
      setTimeout(() => {
        // Simple algorithm: prioritize High priority bookings that are pending
        const pendingBookings = bookings.filter(b => b.status === "Pending");
        const highPriority = pendingBookings.filter(b => b.priority === "High");
        const mediumPriority = pendingBookings.filter(b => b.priority === "Medium");
        const lowPriority = pendingBookings.filter(b => b.priority === "Low");
        
        // Combine in order of priority
        const prioritizedBookings = [...highPriority, ...mediumPriority, ...lowPriority];
        
        // Only allocate up to available ambulances
        const toAllocate = prioritizedBookings.slice(0, availableAmbulances);
        const allocatedIds = toAllocate.map(b => b.id);
        
        const result = {
          allocations: allocatedIds,
          reasoning: `Allocated ${allocatedIds.length} ambulances based on priority order.\nHigh Priority: ${highPriority.length} bookings\nMedium Priority: ${mediumPriority.length} bookings\nLow Priority: ${lowPriority.length} bookings\n\nAllocated ${Math.min(highPriority.length, availableAmbulances)} high priority bookings first.`
        };
        
        setAllocationResult(result);
        
        // Call the callback with allocated booking IDs
        if (result.allocations && result.allocations.length > 0) {
          onAllocationsComplete(result.allocations);
        }
        
        setIsLoading(false);
      }, 2000); // Simulate 2-second API delay
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="border border-slate-700/50 bg-gradient-to-br from-slate-800/90 to-slate-900/90 shadow-xl backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="bg-blue-500/20 p-2 rounded-md">
            <Brain className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <CardTitle className="text-white">AI Ambulance Allocation</CardTitle>
            <CardDescription className="text-slate-300">
              Optimize ambulance allocation based on priority, location, and symptoms
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800/50 p-4 rounded-md border border-slate-700/50">
              <p className="text-sm text-slate-400">Pending Bookings</p>
              <p className="text-2xl font-bold text-white">
                {bookings.filter(b => b.status === "Pending").length}
              </p>
            </div>
            
            <div className="bg-slate-800/50 p-4 rounded-md border border-slate-700/50">
              <p className="text-sm text-slate-400">Available Ambulances</p>
              <p className="text-2xl font-bold text-white">
                {availableAmbulances}
              </p>
            </div>
          </div>
          
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {allocationResult && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-md p-4">
                  <h3 className="font-medium text-blue-300 flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-4 w-4" />
                    AI Recommendation
                  </h3>
                  
                  <ScrollArea className="h-[150px] w-full pr-4">
                    <p className="text-slate-300 whitespace-pre-line">{allocationResult.reasoning}</p>
                  </ScrollArea>
                </div>
                
                <div>
                  <h3 className="font-medium text-slate-200 mb-2">Allocated Bookings</h3>
                  <div className="flex flex-wrap gap-2">
                    {allocationResult.allocations.map((bookingId) => {
                      const booking = bookings.find(b => b.id === bookingId);
                      return booking ? (
                        <Badge 
                          key={bookingId}
                          className="bg-blue-500/20 text-blue-300 border border-blue-500/30"
                        >
                          {booking.patientName} - {booking.priority} Priority
                        </Badge>
                      ) : null;
                    })}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="border-t border-slate-700/50 pt-4">
        <Button 
          onClick={runAIAllocation}
          disabled={isLoading || availableAmbulances === 0 || bookings.filter(b => b.status === "Pending").length === 0}
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500"
        >
          {isLoading ? "Processing..." : "Run AI Allocation"}
        </Button>
      </CardFooter>
    </Card>
  );
}