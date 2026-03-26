import { NextResponse } from "next/server";
import { askGemini } from "@/lib/gemini";

export async function POST(req) {
  try {
   const { question, language = "English" } = await req.json();

    if (!question) {
      return NextResponse.json(
        { error: "No question provided" },
        { status: 400 }
      );
    }

    const prompt = `
You are a professional AI medical assistant.

Analyze the symptoms and return STRICT JSON only.

⚠️ RULES:
- DO NOT return anything outside JSON
- DO NOT wrap in markdown (no \`\`\`)
- FOLLOW format EXACTLY
- Use clean medical language
- Use emojis in markdown sections
- Translate ALL content into ${language}

---

RETURN FORMAT:

{
  "points": [
    "Short clinical observation 1",
    "Short clinical observation 2",
    "Short clinical observation 3"
  ],
  "details": "## 🧠 Clinical Overview\\n<2-3 lines>\\n\\n---\\n\\n## ⚠️ Potential Causes\\n\\n### 🦠 Viral Infections\\n- point\\n- point\\n\\n### 🦟 Vector-Borne Diseases\\n- point\\n- point\\n\\n### 🧫 Bacterial Infections\\n- point\\n- point\\n\\n---\\n\\n## 🚨 Critical Red Flags\\nSeek **immediate medical care** if you notice:\\n- point\\n- point\\n- point\\n\\n---\\n\\n## 🩺 Recommended Actions\\n- point\\n- point\\n- point\\n\\n---\\n\\n## 📌 Summary\\n<short summary>",
  "summary": "This information is for educational purposes only. Please consult a qualified doctor."
}

---

USER QUESTION:
"${question}"

If you do not follow the format exactly, the response is invalid.
`;

    const result = await askGemini(prompt);

    // 🔥 Strong cleaning (handles bad AI responses)
    let cleaned = result
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsed;

    try {
      parsed = JSON.parse(cleaned);
    } catch (e) {
      console.error("Parsing failed, fallback used:", e);

      // 🛟 fallback (very important in production)
      parsed = {
        points: ["Unable to analyze properly", "Please consult a doctor"],
        details: cleaned,
        summary:
          "This information may be incomplete. Please consult a healthcare professional.",
      };
    }

    return NextResponse.json({
      response: parsed.points,
      summary: parsed.details, // markdown
      short: parsed.summary,
    });

  } catch (err) {
    console.error("Gemini error:", err);

    return NextResponse.json(
      { error: "Medical analysis failed." },
      { status: 500 }
    );
  }
}