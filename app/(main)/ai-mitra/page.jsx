"use client";

import { useState, useEffect, useRef } from "react";
import  Button  from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Stethoscope,
  Send,
  RefreshCw,
  ChevronLeft,
  Search,
  Volume2,
  MessageSquare,
  MapPin,
  Sparkles,
  AlertCircle,
  Play,
  Square,
  Activity,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import Navbar from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer";

const translations = [
  {
    lang: "English",
    code: "en-US",
    heading: "AI Health Check",
    placeholder: "Describe your symptoms in detail...",
  },
  {
    lang: "हिन्दी",
    code: "hi-IN",
    heading: "स्वास्थ्य जाँच",
    placeholder: "अपने लक्षणों का वर्णन करें...",
  },
  {
    lang: "ગુજરાતી",
    code: "gu-IN",
    heading: "આરોગ્ય ચકાસણી",
    placeholder: "તમારા લક્ષણો વર્ણવો...",
  },
  {
    lang: "বাংলা",
    code: "bn-IN",
    heading: "স্বাস্থ্য পরীক্ষা",
    placeholder: "আপনার উপসর্গ বর্ণনা করুন...",
  },
  {
    lang: "मराठी",
    code: "mr-IN",
    heading: "आरोग्य तपासणी",
    placeholder: "तुमच्या लक्षणांचे वर्णन करा...",
  },
  {
    lang: "தமிழ்",
    code: "ta-IN",
    heading: "ஆரோக்கிய சோதனை",
    placeholder: "உங்கள் அறிகுறிகளை விवரிக்கவும்...",
  },
];

const loadingMessages = [
  "Analyzing symptoms...",
  "Consulting medical database...",
  "Formatting advice...",
];

export default function HealthCheck() {
  const [input, setInput] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [langIndex, setLangIndex] = useState(0);
  const [loadMsgIndex, setLoadMsgIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const router = useRouter();
  const audioRef = useRef(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadMsgIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [loading]);

  const toggleSpeech = async () => {
    if (isSpeaking && audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsSpeaking(false);
      return;
    }
    if (!data) return;

    const cleanForSpeech = (text) => {
      if (!text) return "";
      return text
        .replace(/^#{1,6}\s*/gm, "")
        .replace(/[*_`~]/g, "")
        .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1")
        .replace(/---/g, "")
        .replace(/\n+/g, ". ")
        .replace(/\s+/g, " ")
        .trim();
    };

    const text = cleanForSpeech(
      `${data.response?.join(". ")}. ${data.summary}. ${data.short}`,
    );
    setIsSpeaking(true);

    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          lang: translations[langIndex].code.split("-")[0],
        }),
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.play();
      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(url);
      };
    } catch (err) {
      setIsSpeaking(false);
    }
  };

  const handleSubmit = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setData(null);
    if (isSpeaking) {
      audioRef.current?.pause();
      setIsSpeaking(false);
    }

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: input,
          language: translations[langIndex].lang,
        }),
      });
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white selection:bg-blue-500/30">

      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full" />
      </div>

      <main className="relative z-10  container mx-auto px-4 py-12 lg:py-20 max-w-5xl">
        {/* Language Selection */}
        <div className="flex flex-wrap justify-center gap-2 mt-14 mb-12">
          {translations.map((t, i) => (
            <button
              key={t.lang}
              onClick={() => {
                setLangIndex(i);
                if (isSpeaking) {
                  audioRef.current?.pause();
                  setIsSpeaking(false);
                }
              }}
              className={`px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest border transition-all duration-300 ${
                langIndex === i
                  ? "bg-white text-black border-white scale-105"
                  : "bg-white/5 border-white/10 text-gray-500 hover:text-white"
              }`}
            >
              {t.lang}
            </button>
          ))}
        </div>

        {/* Header */}
        <div className="text-center mb-12 ">
          <motion.div
            key={langIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-blue-400 text-xs font-medium mb-6"
          >
            <Sparkles size={14} className="animate-pulse" />
            <span>AI Neural Checkup • {translations[langIndex].lang}</span>
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
            {translations[langIndex].heading}
          </h1>
        </div>

        {/* Input Console */}
        <div className="group relative bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-4 sm:p-8 backdrop-blur-2xl shadow-2xl transition-all hover:border-white/20 mb-16">
          <textarea
            className="w-full h-40 p-6 bg-black/40 border border-white/5 rounded-[1.5rem] text-xl font-light focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder:text-gray-700 resize-none leading-relaxed"
            placeholder={translations[langIndex].placeholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="flex flex-col md:flex-row justify-between items-center mt-8 gap-6">
            <div className="flex items-start gap-3 bg-white/5 p-4 rounded-2xl border border-white/5 max-w-md">
              <AlertCircle
                size={18}
                className="text-blue-500 shrink-0 mt-0.5"
              />
              <p className="text-[11px] text-gray-400 leading-normal font-light">
                Not a medical diagnosis. In emergencies, contact local
                authorities immediately.
              </p>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={loading || !input.trim()}
              className="w-full md:w-auto h-16 bg-white text-black hover:bg-blue-50 px-10 rounded-2xl font-bold gap-3 transition-all active:scale-95 shadow-2xl"
            >
              {loading ? (
                <RefreshCw className="animate-spin" size={20} />
              ) : (
                <Send size={20} />
              )}
              <span className="text-lg">
                {loading ? "Analyzing..." : "Analyze Now"}
              </span>
            </Button>
          </div>
        </div>

        {/* Results Sections - Stacked Layout */}
        <AnimatePresence>
          {data && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-10"
            >
              {/* Voice Bar */}
              <div className="flex items-center justify-between bg-blue-600/10 border border-blue-500/20 p-4 rounded-3xl backdrop-blur-md">
                <div className="flex items-center gap-4 pl-4 text-blue-400">
                  <Activity
                    size={18}
                    className={isSpeaking ? "animate-pulse" : ""}
                  />
                  <span className="text-xs font-bold uppercase tracking-widest">
                    {isSpeaking ? "AI Narrating..." : "Report Ready"}
                  </span>
                </div>
                <Button
                  onClick={toggleSpeech}
                  className={`gap-3 px-8 rounded-2xl h-12 transition-all font-bold ${isSpeaking ? "bg-red-500/20 text-red-400 border border-red-500/50" : "bg-blue-600 text-white"}`}
                >
                  {isSpeaking ? (
                    <>
                      <Square size={16} fill="currentColor" /> Stop Reading
                    </>
                  ) : (
                    <>
                      <Play size={16} fill="currentColor" /> Listen to Analysis
                    </>
                  )}
                </Button>
              </div>

              {/* 1. INSIGHT SUMMARY - Full Width Grid */}
              <section>
                <div className="flex items-center gap-3 mb-6 px-4">
                  <Search size={18} className="text-blue-400" />
                  <h3 className="text-blue-400 text-xs font-bold uppercase tracking-[0.2em]">
                    Insight Summary
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {data.response?.map((point, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-white/[0.03] border border-white/10 p-6 rounded-3xl hover:bg-white/[0.06] transition-all group"
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-500 text-xs font-bold mb-4 group-hover:scale-110 transition-transform">
                        0{i + 1}
                      </div>
                      <p className="text-sm text-gray-400 leading-relaxed font-light group-hover:text-gray-200">
                        {point}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* 2. DETAILED GUIDANCE - Full Width Container */}
              <section className="bg-white/[0.03] border border-white/10 p-8 md:p-14 rounded-[3rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                  <Stethoscope size={240} />
                </div>

                <div className="flex items-center gap-4 mb-10">
                  <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                    <MessageSquare size={24} className="text-emerald-400" />
                  </div>
                  <h3 className="text-3xl font-bold tracking-tight">
                    Detailed Guidance
                  </h3>
                </div>

                <article className="prose prose-invert max-w-none">
                  <ReactMarkdown
                    components={{
                      // Custom Heading 2: Section Breaks
                      h2: ({ children }) => (
                        <motion.h2
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          className="text-2xl font-bold mt-12 mb-6 flex items-center gap-3 text-white border-l-4 border-blue-500 pl-4 tracking-tight"
                        >
                          {children}
                        </motion.h2>
                      ),
                      // Custom Heading 3: Sub-sections
                      h3: ({ children }) => (
                        <h3 className="text-sm font-bold mt-8 mb-3 uppercase tracking-[0.2em] text-blue-400/90">
                          {children}
                        </h3>
                      ),
                      // Paragraphs: Better readability
                      p: ({ children }) => (
                        <p className="text-gray-400 leading-[1.8] mb-6 font-light text-lg selection:bg-blue-500/30">
                          {children}
                        </p>
                      ),
                      // Lists: Structured Guidance
                      ul: ({ children }) => (
                        <ul className="grid grid-cols-1 gap-3 mb-8 ml-0 list-none">
                          {children}
                        </ul>
                      ),
                      li: ({ children }) => (
                        <li className="flex items-start gap-3 bg-white/[0.02] border border-white/5 p-4 rounded-2xl text-gray-300 hover:border-blue-500/30 transition-colors">
                          <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-2.5 shrink-0 shadow-[0_0_8px_#3b82f6]" />
                          <span className="text-base">{children}</span>
                        </li>
                      ),
                      // Strong/Bold: Highlighting Symptoms
                      strong: ({ children }) => (
                        <strong className="text-blue-400 font-semibold px-1.5 py-0.5 bg-blue-500/10 rounded-md border border-blue-500/20">
                          {children}
                        </strong>
                      ),
                      // Blockquote: Warning or Key Advice
                      blockquote: ({ children }) => (
                        <div className="my-8 p-6 bg-amber-500/5 border border-amber-500/20 rounded-3xl flex gap-4 items-center">
                          <AlertCircle
                            className="text-amber-500 shrink-0"
                            size={24}
                          />
                          <div className="italic text-amber-200/80 text-sm italic">
                            {children}
                          </div>
                        </div>
                      ),
                    }}
                  >
                    {data.summary}
                  </ReactMarkdown>
                </article>

                <div className="mt-16 pt-10 border-t border-white/10">
                  <div className="bg-blue-600/[0.04] border border-blue-500/10 p-8 rounded-[2rem] relative">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-400 block mb-4">
                      Clinical Brief
                    </span>
                    <div className="text-gray-400 font-light leading-relaxed">
                      <ReactMarkdown>{data.short}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mt-20 justify-center items-center">
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="w-full sm:w-auto gap-2 text-gray-500 hover:text-white h-14 px-8 rounded-2xl"
          >
            <ChevronLeft size={18} /> Back to Dashboard
          </Button>
          <Button
            onClick={() => router.push("/find-doctor")}
            className="w-full sm:w-auto gap-3 bg-blue-600 hover:bg-blue-700 h-14 px-10 rounded-2xl font-bold shadow-xl shadow-blue-500/20 group"
          >
            <MapPin
              size={18}
              className="transition-transform group-hover:scale-125"
            />
            Connect with a Specialist
          </Button>
        </div>
      </main>
    </div>
  );
}
