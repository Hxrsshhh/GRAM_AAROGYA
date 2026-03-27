import { askGemini } from "@/lib/askGemini";
import connectDB from "@/lib/db";
import Prescription from "@/models/Prescription";

export async function POST(req) {
  try {
    await connectDB();

    const { imageBase64, userId } = await req.json();

    if (!imageBase64) {
      return Response.json({ error: "Image required" }, { status: 400 });
    }

    // 🧠 Prompt (same as frontend but secured)
    const prompt = `
You are a medical OCR and pharmacology specialist.

Analyze this prescription image and extract medicines.

Return STRICT JSON array:

[
  {
    "name": "",
    "dosage": "",
    "frequency": "",
    "timing": "",
    "duration": "",
    "use": "",
    "instructions": "",
    "confidenceScore": 0,
    "isEstimated": false
  }
]
`;

    // 🤖 Call Gemini (image + text)
    const aiResponse = await askGemini([
      { text: prompt },
      {
        inlineData: {
          mimeType: "image/png",
          data: imageBase64,
        },
      },
    ]);

    // 🧠 Clean response
    let parsed;
    try {
      const clean = aiResponse.replace(/```json|```/g, "").trim();
      parsed = JSON.parse(clean);
    } catch (err) {
      console.error("Parsing error:", aiResponse);
      return Response.json(
        { error: "Failed to parse AI response" },
        { status: 500 },
      );
    }

    // 💾 Save to DB
    const saved = await Prescription.create({
      userId,
      extractedText: aiResponse,
      medicines: parsed,
    });

    return Response.json({
      success: true,
      data: parsed,
      id: saved._id,
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
