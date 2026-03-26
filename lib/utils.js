import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// ✅ Required for shadcn/ui
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// ✅ Clean markdown remover
export function removeMarkdown(text) {
  return text
    .replace(/\*\*.*?\*\*/g, "")
    .replace(/[\*\-] /g, "")
    .replace(/[#*_\\[\]()]/g, "")
    .replace(/\n+/g, "\n")
    .trim();
}

// ✅ Better formatting
export function formatText(text) {
  return text
    .split("\n")
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .join("\n\n");
}

export function cleanAIText(text) {
  if (!text) return "";

  let cleaned = text;

  // ❌ Remove markdown symbols (*, #, -, etc.)
  cleaned = cleaned.replace(/[#*`>-]/g, "");

  // ❌ Remove numbering (1. 2. 3. etc.)
  cleaned = cleaned.replace(/\d+\.\s*/g, "");

  // ❌ Remove extra brackets ()
  cleaned = cleaned.replace(/\((.*?)\)/g, "$1");

  // ❌ Remove multiple spaces
  cleaned = cleaned.replace(/\s+/g, " ").trim();

  // ✅ Add headings manually
  cleaned = cleaned
    .replace(/Detailed Answer/gi, "\n\n🧠 Detailed Answer\n")
    .replace(/Short Summary/gi, "\n\n📌 Summary\n")
    .replace(/What You Should Do/gi, "\n\n🩺 What You Should Do\n")
    .replace(/When You Should Act/gi, "\n\n🚨 Warning Signs\n");

  // ✅ Split into clean lines
  return cleaned.split("\n").map(line => line.trim()).filter(Boolean);
}