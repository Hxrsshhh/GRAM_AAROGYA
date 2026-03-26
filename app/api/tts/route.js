import gTTS from "gtts";

export async function POST(req) {
  try {
    const { text, lang = "en" } = await req.json();

    if (!text) {
      return new Response("No text provided", { status: 400 });
    }

    // 🔥 Language fix
    const mapLang = (lang) => {
      const code = lang.split("-")[0];

      if (code === "bn") return "hi"; // fallback
      if (code === "gu") return "hi";

      return ["en", "hi", "ta", "mr"].includes(code) ? code : "en";
    };

    const langCode = mapLang(lang);

    const tts = new gTTS(text, langCode);

    // 🔥 Convert stream → buffer (FIX)
    const chunks = [];

    await new Promise((resolve, reject) => {
      const stream = tts.stream();

      stream.on("data", (chunk) => chunks.push(chunk));
      stream.on("end", resolve);
      stream.on("error", reject);
    });

    const buffer = Buffer.concat(chunks);

    return new Response(buffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
      },
    });

  } catch (err) {
    console.error("gTTS Error:", err);
    return new Response("TTS failed", { status: 500 });
  }
}