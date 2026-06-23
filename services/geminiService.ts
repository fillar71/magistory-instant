import { GoogleGenAI, Type } from "@google/genai";
import { VideoScriptScene } from '../types';

if (!process.env.API_KEY || process.env.API_KEY === 'mock-key') {
  console.warn("API_KEY environment variable not set or is mock key. Using a mock response.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "mock-key" });

const scriptSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      scene: { type: Type.STRING, description: 'Scene number, e.g., "1"' },
      visual: { type: Type.STRING, description: 'A detailed description of the visual content for this scene.' },
      narration: { type: Type.STRING, description: 'The voice-over or narration script for this scene.' },
      stock_keyword: { 
        type: Type.STRING, 
        description: 'A simple and direct search keyword (1-3 words) based on the most important noun or concept in the scene. Example: "pekerja pabrik robot" or "teknologi AI".' 
      }
    },
    required: ['scene', 'visual', 'narration', 'stock_keyword']
  }
};

const mockScript: VideoScriptScene[] = [
    { scene: 1, visual: "Wide shot of a bustling futuristic city with flying vehicles.", narration: "In a world where technology advanced beyond imagination, one thing remained constant...", stock_keyword: "futuristic city" },
    { scene: 2, visual: "Close up on a young woman working on a holographic interface.", narration: "...the human desire to create and share stories.", stock_keyword: "holographic interface" },
    { scene: 3, visual: "A montage of beautiful landscapes: mountains, oceans, forests.", narration: "From the grandest tales to the smallest moments.", stock_keyword: "beautiful landscapes" },
    { scene: 4, visual: "The Magistory AI logo appears with a tagline.", narration: "Magistory AI: Your story, instantly visualized.", stock_keyword: "abstract technology" },
];

export const generateVideoScript = async (
  prompt: string,
  durationMinutes: number,
  aspectRatio: string
): Promise<VideoScriptScene[]> => {
  if (!process.env.API_KEY || process.env.API_KEY === 'mock-key') {
    return new Promise(resolve => setTimeout(() => resolve(mockScript), 2000));
  }
  
  try {
    const fullPrompt = `Create a detailed video script based on the following idea: "${prompt}". 
The video should be approximately ${durationMinutes} minutes long and in ${aspectRatio} aspect ratio. 
For each scene, provide:
1.  **visual**: A detailed description of the visual content.
2.  **narration**: The voice-over script for the scene.
3.  **stock_keyword**: A simple and direct search keyword (1-3 words) for finding stock footage. This keyword should be the most important noun or concept from the 'narration' or 'visual' description. Focus on concrete objects, roles, or actions.
    - **Example 1:** If narration is "Pekerja pabrik kini bekerja bersama robot canggih", a good keyword is "pekerja pabrik robot".
    - **Example 2:** If visual is "Seorang kasir di supermarket modern", a good keyword is "kasir supermarket".
    - **Example 3:** If narration mentions "teknologi AI masa depan", a good keyword is "teknologi AI".

Structure your response as a JSON array of scenes.`;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: fullPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: scriptSchema,
      },
    });

    const jsonText = response.text.trim();
    const parsedResponse = JSON.parse(jsonText);

    // The Gemini API might return scenes with string numbers, so we parse them.
    return parsedResponse.map((item: any) => ({
        ...item,
        scene: parseInt(item.scene, 10)
    }));
    
  } catch (error) {
    console.error("Error generating script with Gemini:", error);
    // Throw a user-friendly error to be caught by the UI
    throw new Error('Gagal membuat skrip dari AI. Pastikan kunci API Gemini Anda valid dan coba lagi.');
  }
};