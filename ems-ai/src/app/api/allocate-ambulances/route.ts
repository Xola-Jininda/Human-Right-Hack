// app/api/allocate-ambulances/route.ts
import { OpenAI } from 'openai';
import { NextRequest, NextResponse } from 'next/server';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define the expected facility type
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

export async function POST(request: NextRequest) {
  try {
    const { facilities, availableAmbulances } = await request.json();

    // Call OpenAI with function calling
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: `You are an emergency medical services dispatcher AI. Your job is to allocate ambulances optimally to facilities based on priority tier, operational status, population served, and road conditions.
          
          Guidelines:
          1. Critical priority facilities should be allocated first.
          2. Consider operational status (prioritize "Operational" and "Partially Operational" over "Grounded").
          3. Prioritize facilities serving larger populations.
          4. Consider road conditions (prioritize "Good" and "Moderate" over "Poor").
          5. Allocate no more than the available number of ambulances.
          6. Return only the facility IDs that should receive additional ambulances.`
        },
        {
          role: "user",
          content: `I have ${availableAmbulances} ambulances available and these facilities: ${JSON.stringify(facilities)}`
        }
      ],
      functions: [
        {
          name: "allocate_ambulances",
          description: "Allocate available ambulances to the most critical facilities",
          parameters: {
            type: "object",
            properties: {
              allocations: {
                type: "array",
                items: {
                  type: "string"
                },
                description: "Array of facility IDs that should receive additional ambulances"
              },
              reasoning: {
                type: "string", 
                description: "Explanation of the allocation decisions"
              }
            },
            required: ["allocations", "reasoning"]
          }
        }
      ],
      function_call: { name: "allocate_ambulances" }
    });

    // Extract the function call from the response
    const functionCall = response.choices[0].message.function_call;
    if (!functionCall) {
      return NextResponse.json({ error: "Failed to get allocation recommendations" }, { status: 500 });
    }

    // Parse the function arguments
    const functionArgs = JSON.parse(functionCall.arguments);
    
    return NextResponse.json({
      allocations: functionArgs.allocations,
      reasoning: functionArgs.reasoning
    });
  } catch (error) {
    console.error("Error in ambulance allocation:", error);
    return NextResponse.json({ error: "Failed to process allocation request" }, { status: 500 });
  }
}