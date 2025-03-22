// app/api/allocate-ambulances/route.ts
import { NextRequest, NextResponse } from 'next/server';

interface Facility {
  facilityId: string;
  facilityName: string;
  district: string;
  ambulancesDeployed: number;
  operationalStatus: "Grounded" | "Operational" | "Partially Operational";
  populationServed: number;
  roadCondition: "Poor" | "Moderate" | "Good";
  priorityTier: "Critical" | "High" | "Medium" | "Low";
}

// Allocation algorithm - simulates what FastAPI would do
function allocateAmbulances(facilities: Facility[], availableAmbulances: number) {
  // Sort facilities by priority
  const priorityOrder = { "Critical": 0, "High": 1, "Medium": 2, "Low": 3 };
  const operationalOrder = { "Operational": 0, "Partially Operational": 1, "Grounded": 2 };
  const roadOrder = { "Good": 0, "Moderate": 1, "Poor": 2 };
  
  // Sort facilities based on multiple criteria
  const sortedFacilities = [...facilities].sort((a, b) => {
    // Primary sort: Priority Tier
    if (priorityOrder[a.priorityTier] !== priorityOrder[b.priorityTier]) {
      return priorityOrder[a.priorityTier] - priorityOrder[b.priorityTier];
    }
    
    // Secondary sort: Operational Status
    if (operationalOrder[a.operationalStatus] !== operationalOrder[b.operationalStatus]) {
      return operationalOrder[a.operationalStatus] - operationalOrder[b.operationalStatus];
    }
    
    // Tertiary sort: Population Served (higher first)
    if (a.populationServed !== b.populationServed) {
      return b.populationServed - a.populationServed;
    }
    
    // Quaternary sort: Road Condition
    return roadOrder[a.roadCondition] - roadOrder[b.roadCondition];
  });
  
  // Allocate ambulances until we run out
  const allocations: string[] = [];
  let reasoning = "FastAPI Ambulance Allocation System\n\n";
  let remainingAmbulances = availableAmbulances;
  
  reasoning += `Starting with ${availableAmbulances} ambulances available for allocation.\n\n`;
  reasoning += "Allocation process:\n";
  
  for (const facility of sortedFacilities) {
    if (remainingAmbulances <= 0) break;
    
    // Determine how many ambulances to allocate to this facility (1 per facility for simplicity)
    const ambulancesToAllocate = 1;
    
    if (ambulancesToAllocate <= remainingAmbulances) {
      allocations.push(facility.facilityId);
      remainingAmbulances -= ambulancesToAllocate;
      
      reasoning += `- Allocated ${ambulancesToAllocate} ambulance to ${facility.facilityName} (ID: ${facility.facilityId}):\n`;
      reasoning += `  * Priority: ${facility.priorityTier}\n`;
      reasoning += `  * Status: ${facility.operationalStatus}\n`;
      reasoning += `  * Population: ${facility.populationServed}\n`;
      reasoning += `  * Road Condition: ${facility.roadCondition}\n`;
      reasoning += `  * Remaining ambulances: ${remainingAmbulances}\n\n`;
    }
  }
  
  reasoning += `Allocation complete. ${allocations.length} facilities received ambulances.`;
  
  return {
    allocations,
    reasoning
  };
}

export async function POST(request: NextRequest) {
  try {
    console.log("Request received by FastAPI-style allocation system");
    
    // Parse request data
    const requestData = await request.json();
    const { facilities, availableAmbulances } = requestData;
    
    // Validate input
    if (!facilities || !Array.isArray(facilities)) {
      return NextResponse.json({ error: "Invalid request format: facilities must be an array" }, { status: 400 });
    }
    
    if (availableAmbulances === undefined || isNaN(Number(availableAmbulances))) {
      return NextResponse.json({ error: "Invalid request format: availableAmbulances must be a number" }, { status: 400 });
    }
    
    console.log(`Processing allocation for ${facilities.length} facilities with ${availableAmbulances} ambulances`);
    
    // Run the allocation algorithm
    const result = allocateAmbulances(facilities, availableAmbulances);
    
    console.log(`Allocation complete. ${result.allocations.length} facilities were allocated ambulances`);
    
    // Return the result
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in ambulance allocation:", error);
    return NextResponse.json({ 
      error: "Failed to process allocation request",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}