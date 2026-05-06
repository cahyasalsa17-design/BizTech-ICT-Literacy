import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function askGemini(prompt: string, history: { role: 'user' | 'model', parts: { text: string }[] }[] = []) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set');
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...history.map(h => ({
          role: h.role,
          parts: h.parts
        })),
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: "Anda adalah asisten AI untuk aplikasi 'Digital Academy'. Bantu pengguna memahami materi tentang literasi digital, pemasaran bisnis, keamanan siber, AI, dan kewirausahaan. Jawab dalam bahasa Indonesia yang ramah, profesional, dan mudah dimengerti. Jika ditanya tentang materi kursus, Anda bisa memberikan penjelasan tambahan atau merangkum poin-poin penting.",
        temperature: 0.7,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}
