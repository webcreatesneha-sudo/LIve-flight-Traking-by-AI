import { GoogleGenAI } from "@google/genai";
import { Flight } from "../types";

// Fix: Per coding guidelines, initialize GoogleGenAI directly assuming API_KEY is always present.
// This removes the conditional logic and fallback for a missing API key.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });


export const generateFlightStory = async (flight: Flight): Promise<string> => {
  // Fix: Removed the null check for the 'ai' instance, as it is now guaranteed to be initialized.
  const prompt = `
    Create a short, imaginative, and engaging story (about 100 words) about flight ${flight.callsign}, an ${flight.aircraftType} operated by ${flight.airline}.
    The flight is traveling from ${flight.origin} (${flight.originCode}) to ${flight.destination} (${flight.destinationCode}).
    Its current status is "${flight.status}". 
    If it is en route, mention its current altitude of ${flight.altitude} feet and speed of ${flight.speed} knots.
    Make the story sound like a snippet from a travel documentary or an exciting novel. Be creative and avoid just listing the facts.
    For example, you could talk about the view from the window, a passenger's thoughts, or the pilot's perspective.
    `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
           temperature: 0.8,
           topP: 0.95,
        }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw new Error("Failed to generate flight story from Gemini API.");
  }
};
