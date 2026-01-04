import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialize the SDK
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { images } = await req.json();

    if (!images || images.length === 0) {
      return NextResponse.json(
        { error: "No image payload detected" },
        { status: 400 }
      );
    }

    // SWITCH TO PRO MODEL HERE
    //models - gemini-3-flash-preview
    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.4, // Lower temperature for more consistent data extraction
      },
    });

    const systemPrompt = `
      ACT AS: A Senior Urban Infrastructure Auditor.
      TASK: Analyze the provided image segments and categorize the civic issue.
      
      OUTPUT FORMAT: You must return valid JSON matching this schema:
      {
        "title": "string (max 5 words)",
        "description": "string (technical, identifying specific damage or risk)",
        "category": "infrastructure" | "utilities" | "sanitation" | "safety" | "environment" | "traffic" | "other",
        "priority": "Low" | "Medium" | "High" | "Critical",
        "confidence": number (0-100)
      }

      CRITICAL: If the image is blurry or irrelevant, set confidence below 40.
    `;

    const imageParts = images.map((img) => ({
      inlineData: {
        data: img.data,
        mimeType: img.mimeType,
      },
    }));

    const result = await model.generateContent([systemPrompt, ...imageParts]);
    const text = result.response.text();

    return NextResponse.json(JSON.parse(text));
  }  catch (error) {
  console.error("Gemini Error:", error);

  const message = error?.message || "";

  // 🎯 QUOTA / LIMIT
  if (
    message.includes("quota") ||
    message.includes("Too Many Requests") ||
    message.includes("429")
  ) {
    return NextResponse.json(
      {
        error: "AI daily limit reached",
        code: "AI_QUOTA_EXCEEDED",
      },
      { status: 429 }
    );
  }

  // ❌ MODEL / CONFIG ERROR
  return NextResponse.json(
    {
      error: "AI model unavailable",
      code: "AI_MODEL_ERROR",
    },
    { status: 500 }
  );
}

}
