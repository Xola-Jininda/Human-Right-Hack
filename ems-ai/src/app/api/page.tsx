// app/api/allocate-ambulances/route.ts
import { OpenAI } from 'openai';
import { NextRequest, NextResponse } from 'next/server';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define the expected booking type
interface Booking {
  id: string;
  patientName: string;
  location: string;
  symptoms: string;
  timestamp: string;
  priority: "High" | "Medium" | "Low";
  status: "Pending" | "Allocated" | "Completed";
}

export async function POST(request: NextRequest) {
  try {
    const { bookings, availableAmbulances } = await request.json();

    // Call OpenAI with function calling
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: `You are an emergency medical services dispatcher AI. Your job is to allocate ambulances optimally based on priority, symptoms, and available resources.
          
          Guidelines:
          - High priority cases should be allocated first
          - Consider symptom severity (chest pain, breathing difficulty, unconsciousness are most urgent)
          - Allocate no more than the available number of ambulances
          - Return only the booking IDs that should receive an ambulance`
        },
        {
          role: "user",
          content: `I have ${availableAmbulances} ambulances available and these pending bookings: ${JSON.stringify(bookings)}`
        }
      ],
      functions: [
        {
          name: "allocate_ambulances",
          description: "Allocate available ambulances to the most critical cases",
          parameters: {
            type: "object",
            properties: {
              allocations: {
                type: "array",
                items: {
                  type: "string"
                },
                description: "Array of booking IDs that should receive an ambulance allocation"
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