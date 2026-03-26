import { Buffer } from "buffer";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const audio = formData.get("audio");

    if (!audio) {
      return Response.json({ error: "No audio file" }, { status: 400 });
    }

    const arrayBuffer = await audio.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const response = await fetch(
      "https://api.deepgram.com/v1/listen?model=nova-2&smart_format=true&detect_language=true&punctuate=true",
      {
        method: "POST",
        headers: {
          Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
          "Content-Type": audio.type || "audio/webm",
        },
        body: buffer,
      }
    );

    const result = await response.json();

    const transcript =
      result?.results?.channels?.[0]?.alternatives?.[0]?.transcript;

    return Response.json({
      text: transcript?.trim() || "No speech detected",
    });
  } catch (error) {
    console.error("Speech API error:", error);

    return Response.json(
      { error: "Speech processing failed" },
      { status: 500 }
    );
  }
}