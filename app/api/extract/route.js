import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { images } = await req.json();

    // Initialize Gemini 3 Flash
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3-flash-preview", // Updated for 2026 model series
      generationConfig: {
        // Gemini 3 special parameter: 'low', 'medium', or 'high'
        // 'low' is ultra-fast for simple scans
        // @ts-ignore
        thinkingLevel: "low", 
        responseMimeType: "application/json",
      }
    });

    const prompt = `
      Perform a 'CivicPulse' rapid scan on these image streams.
      Return a JSON object:
      {
        "title": "Short issue title",
        "description": "Technical details of damage",
        "category": "infrastructure" | "utilities" | "sanitation" | "safety" | "environment" | "traffic",
        "priority": "Low" | "Medium" | "High" | "Critical",
        "confidence": number(0-100)
      }
    `;

    const imageParts = images.map((img) => ({
      inlineData: { data: img.data, mimeType: img.mimeType },
    }));

    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    
    // Gemini 3 is very good at following JSON instructions, but we still parse carefully
    const data = JSON.parse(response.text());

    return NextResponse.json(data);
  } catch (error) {
    console.error("Gemini 3 Flash Error:", error);
    return NextResponse.json({ error: "Flash Analysis Failed" }, { status: 500 });
  }
}