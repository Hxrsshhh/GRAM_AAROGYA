import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function askGemini(prompt) {
  const model = genAI.getGenerativeModel({
    model: process.env.MODEL || "gemini-3-flash-preview",
  });

  try {
    const result = await model.generateContent(prompt);
    const response =  result.response;
    return response.text();
  } catch (error) {
    if (error.status === 429) {
      console.error("Quota exceeded. Try again in a few seconds.");
      return "System is currently busy due to high demand. Please try again shortly.";
    }
    throw error;
  }
}
