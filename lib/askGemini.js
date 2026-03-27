import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function askGemini(parts) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview", // ✅ stable + supports image
    });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: parts, // 👈 MUST be array of {text} + {inlineData}
        },
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 2048,
      },
    });

    const response = await result.response;

    return response.text(); // ✅ always return text
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Gemini API failed");
  }
}