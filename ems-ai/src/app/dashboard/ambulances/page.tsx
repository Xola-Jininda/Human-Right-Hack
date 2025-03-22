"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import dynamic from "next/dynamic";
import {
  Ambulance,
  Phone,
  Clock,
  MapPin,
  Battery,
  Activity,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

// Dynamically import the map component to avoid SSR issues
const Map = dynamic(() => import("./map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-gray-100 animate-pulse rounded-lg" />
  ),
});

// Mock data for Eastern Cape districts and ambulances
const ambulances = [
  {
    id: 1,
    callSign: "EC-AMB-001",
    district: "OR Tambo District",
    location: { lat: -31.5892, lng: 28.7845 },
    status: "Available",
    batteryLevel: 85,
    lastMaintenance: "2024-03-15",
    crew: ["Dr. Sarah Smith", "John Doe"],
    contact: "+27 123 456 789",
  },
  {
    id: 2,
    callSign: "EC-AMB-002",
    district: "Alfred Nzo District",
    location: { lat: -30.7433, lng: 29.0379 },
    status: "En Route",
    batteryLevel: 65,
    lastMaintenance: "2024-03-10",
    crew: ["Dr. Michael Brown", "Jane Wilson"],
    contact: "+27 123 456 790",
  },
  {
    id: 3,
    callSign: "EC-AMB-003",
    district: "Chris Hani District",
    location: { lat: -31.9046, lng: 27.5768 },
    status: "Available",
    batteryLevel: 92,
    lastMaintenance: "2024-03-18",
    crew: ["Dr. Emily Johnson", "Robert Clark"],
    contact: "+27 123 456 791",
  },
  {
    id: 4,
    callSign: "EC-AMB-004",
    district: "Joe Gqabi District",
    location: { lat: -30.9858, lng: 26.8764 },
    status: "Maintenance",
    batteryLevel: 30,
    lastMaintenance: "2024-03-01",
    crew: ["Dr. David Wilson", "Mary Thompson"],
    contact: "+27 123 456 792",
  },
];

export default function AmbulanceLocations() {
  const [selectedAmbulance, setSelectedAmbulance] = useState<number | null>(null);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "available":
        return "bg-green-500";
      case "en route":
        return "bg-blue-500";
      case "maintenance":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Eastern Cape Ambulance Network</h1>
          <p className="text-muted-foreground">
            Real-time ambulance locations and status
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Ambulance className="h-6 w-6 text-primary" />
          <span className="text-sm font-medium">
            {ambulances.filter((a) => a.status === "Available").length} Available
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-[600px] overflow-hidden">
            <Map
              ambulances={ambulances}
              selectedAmbulance={selectedAmbulance}
              onAmbulanceSelect={setSelectedAmbulance}
            />
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="h-[600px]">
            <ScrollArea className="h-full">
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-4">
                  Ambulance Units
                </h2>
                <div className="space-y-4">
                  {ambulances.map((ambulance) => (
                    <div
                      key={ambulance.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                        selectedAmbulance === ambulance.id
                          ? "bg-primary/5 border-primary"
                          : "hover:bg-secondary"
                      }`}
                      onClick={() => setSelectedAmbulance(ambulance.id)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <Ambulance className="h-5 w-5" />
                          <span className="font-medium">
                            {ambulance.callSign}
                          </span>
                        </div>
                        <Badge
                          className={`${getStatusColor(ambulance.status)} text-white`}
                        >
                          {ambulance.status}
                        </Badge>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{ambulance.district}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{ambulance.contact}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Battery className="h-4 w-4 text-muted-foreground" />
                          <span>Battery: {ambulance.batteryLevel}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-muted-foreground" />
                          <span>
                            Last Maintenance: {ambulance.lastMaintenance}
                          </span>
                        </div>
                      </div>

                      <Separator className="my-2" />

                      <div className="text-sm">
                        <strong>Crew:</strong>
                        <ul className="mt-1 space-y-1">
                          {ambulance.crew.map((member, index) => (
                            <li key={index}>{member}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollArea>
          </Card>
        </div>
      </div>
    </div>
  );
}