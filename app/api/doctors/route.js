import { NextResponse } from "next/server";

const MODEL_NAME = "gemini-3-flash-preview";
const apiKey = process.env.GEMINI_API_KEY;

export async function POST(req) {
  try {
    if (!apiKey) throw new Error("Missing GEMINI_API_KEY");

    const { condition, location } = await req.json();

    if (!condition || !location) {
      return NextResponse.json(
        { error: "Condition and location required" },
        { status: 400 }
      );
    }

    const systemPrompt = `
You MUST return ONLY valid JSON. No markdown, no explanation.

{
  "doctors": [
    {
      "name": "",
      "specialization": "",
      "rating": "",
      "experience": "",
      "fee": "",
      "address": "",
      "mapsLink": ""
    }
  ]
}
`;

    const userQuery = `Find top doctors for ${condition} in ${location}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userQuery }] }],
          systemInstruction: { parts: [{ text: systemPrompt }] },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(errText);
    }

    const result = await response.json();
    const rawText = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) throw new Error("Empty response from Gemini");

    const cleaned = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const data = JSON.parse(cleaned);

    return NextResponse.json(data);

  } catch (error) {
    console.error("❌ Backend Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch medical data" },
      { status: 500 }
    );
  }
}