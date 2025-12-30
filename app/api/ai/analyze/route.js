import { NextResponse } from "next/server";

const CATEGORIES = [
  "infrastructure",
  "utilities",
  "sanitation",
  "safety",
  "environment",
  "traffic",
  "other",
];
const PRIORITIES = ["Low", "Medium", "High", "Critical"];

export async function POST(req) {
  try {
    const { images } = await req.json();

    if (!images || !Array.isArray(images) || images.length === 0) {
      throw new Error("No images provided");
    }

    const prompt = `
      You are a civic infrastructure analysis AI.
      STRICT RULES:
      - Choose category ONLY from: ${CATEGORIES.join(", ")}
      - Choose priority ONLY from: ${PRIORITIES.join(", ")}
      - Output MUST be valid JSON.
      
      OUTPUT FORMAT:
      {
        "title": "short clear issue name",
        "description": "3-5 sentence technical summary",
        "category": "one of allowed categories",
        "priority": "one of allowed priorities",
        "confidence": number
      }
    `;

    const messageContent = [
      { type: "text", text: prompt },
      ...images.map((img) => ({
        type: "image_url",
        image_url: {
          url: `data:${img.mimeType};base64,${img.data}`,
        },
      })),
    ];

    const body = {
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [{ role: "user", content: messageContent }],
      temperature: 0.1,
      response_format: { type: "json_object" },
    };

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (data.error) {
      throw new Error(`Groq API Error: ${data.error.message}`);
    }

    const rawText = data.choices[0]?.message?.content;
    if (!rawText) throw new Error("Empty AI response");

    const parsed = JSON.parse(rawText);

    parsed.category = String(parsed.category).toLowerCase();
    if (!CATEGORIES.includes(parsed.category)) parsed.category = "other";
    if (!PRIORITIES.includes(parsed.priority)) parsed.priority = "Medium";

    if (parsed.confidence <= 1) {
      parsed.confidence = Math.round(parsed.confidence * 100);
    }

    parsed.confidence = Math.min(
      100,
      Math.max(0, Number(parsed.confidence) || 0)
    );

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("ANALYSIS ERROR:", err.message);
    return NextResponse.json(
      {
        title: "Manual review required",
        description: "Analysis failed. Technical issue: " + err.message,
        category: "other",
        priority: "Medium",
        confidence: 0,
      },
      { status: 200 }
    );
  }
}
