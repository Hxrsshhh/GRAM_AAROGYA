import { NextResponse } from "next/server";
import { askGemini } from "@/lib/gemini"; // 👈 adjust path if needed

export async function POST(req) {
  try {
    const { language } = await req.json();

    if (!language) {
      return NextResponse.json(
        { error: "Language is required" },
        { status: 400 }
      );
    }

    const prompt = `
You are a medical news assistant.

Return 5 latest health news articles in ${language}.

IMPORTANT:
- Return ONLY valid JSON
- Do NOT include explanation text
- Format exactly like this:

[
  {
    "title": "",
    "description": "",
    "content": "",
    "url": "",
    "source": "",
    "date": ""
  }
]
`;

    // ✅ call Gemini instead of OpenAI
    const raw = await askGemini(prompt);

    let parsed;

    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      console.error("Gemini raw output:", raw);

      return NextResponse.json(
        { error: "AI returned invalid JSON format" },
        { status: 500 }
      );
    }

    return NextResponse.json({ articles: parsed });

  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}