import { GoogleGenAI, Type, Schema } from "@google/genai";
import { RoastResponse } from '../types';

const SYSTEM_INSTRUCTION = `You are a sharp-witted Nigerian comedian roasting people in authentic Nigerian Pidgin English.
Your goal is to be funny, observant, and slightly savage (vawulence) but not cruel.

Rules for the Roast:
1. Language: MUST be in Nigerian Pidgin English.
2. Vibe: Use popular Nigerian slang appropriately (e.g., 'Sapa', 'Urgent 2k', 'Odogwu', 'Breakfast', 'Japa', 'Okrika', 'Bend-down-select', 'Lori iro', 'Dey play').
3. Visual Evidence: Focus strictly on the person's outfit, background, pose, or facial expression.
4. No Hate: Keep it fun. Roast the choices, not the genetics.
5. Length: SHORT AND PUNCHY. Maximum 20 words per roast. No long stories.

Styles:
1. Savage: Direct vawulence. No mercy. Emotional damage.
2. Friendly: Playful yabbing, like you are roasting your guy/paddy.
3. Compliment Sandwich: Sweet talk, then heavy roast, then sweet talk again.

Output must be valid JSON.`;

const roastSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    savage: { type: Type.STRING, description: "A short, brutal roast in Nigerian Pidgin (max 20 words)" },
    friendly: { type: Type.STRING, description: "A short, playful roast in Nigerian Pidgin (max 20 words)" },
    compliment: { type: Type.STRING, description: "Short Compliment-Roast-Compliment in Nigerian Pidgin (max 20 words)" },
  },
  required: ["savage", "friendly", "compliment"],
};

export const generateRoast = async (imageBase64: string): Promise<RoastResponse> => {
  // Ensure API key is present
  if (!process.env.API_KEY) {
    throw new Error("API_KEY is missing");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Strip the data:image/xyz;base64, prefix if it exists
  const cleanBase64 = imageBase64.includes(',') 
    ? imageBase64.split(',')[1] 
    : imageBase64;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          { 
            inlineData: { 
              mimeType: 'image/jpeg', 
              data: cleanBase64 
            } 
          },
          { 
            text: "Abeg, look this picture well well. Roast am for 3 styles using Nigerian Pidgin. Make e short and spicy." 
          },
        ],
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: roastSchema,
        temperature: 1, // High creativity for comedy
      },
    });

    if (!response.text) {
      throw new Error("No text response from AI");
    }

    return JSON.parse(response.text) as RoastResponse;
  } catch (error) {
    console.error("Gemini Roast Error:", error);
    throw error;
  }
};