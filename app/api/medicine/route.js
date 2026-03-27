import connectDB from "@/lib/db";
import Medicine from "@/models/Medicine";
import { askGemini } from "@/lib/gemini"; // 👈 your function

export async function POST(req) {
  try {
    await connectDB();
    const { name } = await req.json();

    if (!name) {
      return Response.json({ error: "Medicine name required" }, { status: 400 });
    }

    // 🔎 1. Check DB first
    let med = await Medicine.findOne({
      name: { $regex: name, $options: "i" },
    });

    if (med) {
      return Response.json({ source: "db", data: med });
    }

    // 🤖 2. Ask Gemini for structured data
    const prompt = `
Give detailed information about the medicine "${name}".

Return STRICT JSON only in this format:
{
  "name": "",
  "composition": "",
  "uses": [],
  "dosage": "",
  "sideEffects": [],
  "warnings": []
}

Keep it medically accurate but simple.
`;

    const aiResponse = await askGemini(prompt);

    // 🧠 3. Parse AI response safely
    let parsed;
    try {
      // remove possible markdown formatting
      const clean = aiResponse.replace(/```json|```/g, "").trim();
      parsed = JSON.parse(clean);
    } catch (err) {
      console.error("AI parsing error:", aiResponse);

      return Response.json(
        { error: "Failed to parse AI response" },
        { status: 500 }
      );
    }

    // 🧾 4. Save to DB
    const newMed = await Medicine.create({
      name: parsed.name || name,
      composition: parsed.composition,
      uses: parsed.uses || [],
      dosage: parsed.dosage,
      sideEffects: parsed.sideEffects || [],
      warnings: parsed.warnings || [],
    });

    return Response.json({ source: "ai", data: newMed });

  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}