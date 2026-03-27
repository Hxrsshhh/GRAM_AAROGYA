"use client";

import { useState, useRef } from "react";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Stethoscope,
  Send,
  RefreshCw,
  ChevronLeft,
  MapPin,
  Sparkles,
  AlertCircle,
  Play,
  Square,
  Mic,
  MicOff,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

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
    placeholder: "तुमच्या लक्षણાंचे वर्णन करा...",
  },
  {
    lang: "தமிழ்",
    code: "ta-IN",
    heading: "ஆரோக்கிய சோதனை",
    placeholder: "உங்கள் அறிகுறிகளை விவரிக்கவும்...",
  },
];

export default function HealthCheck() {
  const [input, setInput] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [langIndex, setLangIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const router = useRouter();
  const audioRef = useRef(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        setIsTranscribing(true); // ✅ Start converting effect
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("audio", blob);

        try {
          const res = await fetch("/api/speech", {
            method: "POST",
            body: formData,
          });
          const result = await res.json();
          setInput(result.text);
        } catch (err) {
          console.error("Transcription failed", err);
        } finally {
          setIsTranscribing(false); // ✅ Stop converting effect
        }
      };

      mediaRecorder.start();
      setIsListening(true);
    } catch (err) {
      console.error("Mic access denied", err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsListening(false);
  };

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
    if (isListening) {
      stopRecording();
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
    <div className="min-h-screen bg-slate-50 dark:bg-[#030303] text-slate-900 dark:text-white selection:bg-blue-500/30 transition-colors duration-500">
      {/* Ambient Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[70%] h-[70%] bg-blue-600/10 dark:bg-blue-600/15 blur-[140px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 dark:bg-indigo-600/15 blur-[140px] rounded-full" />
      </div>

      <main className="relative z-10 container mx-auto px-6 py-18 lg:py-20 max-w-7xl">
        {/* Language Selection Nav */}
        <nav className="flex flex-wrap justify-center gap-3 mt-8 mb-16">
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
              className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] border transition-all duration-500 ${
                langIndex === i
                  ? "bg-slate-900 dark:bg-white text-white dark:text-black border-slate-900 dark:border-white shadow-lg shadow-blue-500/20 scale-105"
                  : "bg-slate-200/50 dark:bg-white/5 border-slate-300/50 dark:border-white/10 text-slate-500 hover:border-blue-400/50"
              }`}
            >
              {t.lang}
            </button>
          ))}
        </nav>

        {/* Header Section */}
        <header className="text-center mb-16 space-y-4">
          <motion.div
            key={langIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-white/5 border border-blue-100 dark:border-white/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-tighter"
          >
            <Sparkles size={12} className="animate-pulse" />
            <span>Neural Analysis Engine • {translations[langIndex].lang}</span>
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-linear-to-b from-slate-900 via-slate-700 to-slate-500 dark:from-white dark:to-gray-500 bg-clip-text text-transparent">
            {translations[langIndex].heading}
          </h1>
        </header>

        {/* Input Console Container */}
        <div className="group relative bg-white/70 dark:bg-white/2 border border-slate-200 dark:border-white/10 rounded-[2rem] p-2 sm:p-3 backdrop-blur-3xl shadow-2xl transition-all hover:border-blue-500/30 mb-16">
          <div className="bg-slate-50 dark:bg-black/40 rounded-[1.7rem] p-6 border border-slate-100 dark:border-white/5 relative overflow-hidden">
            {/* Visual Wave Overlay for Voice Input */}
            <AnimatePresence>
              {isListening && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-30 bg-blue-500/10 backdrop-blur-[4px] pointer-events-none flex flex-col items-center justify-center gap-4"
                >
                  <div className="flex gap-2 items-end h-12">
                    {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ height: [10, 40, 15, 35, 10] }}
                        transition={{
                          repeat: Infinity,
                          duration: 0.8,
                          delay: i * 0.1,
                        }}
                        className="w-1.5 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                      />
                    ))}
                  </div>
                  <span className="text-blue-500 font-bold text-xs uppercase tracking-[0.2em] animate-pulse">
                    Capturing Vitals...
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Converting Effect Overlay */}
            <AnimatePresence>
              {isTranscribing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-30 bg-slate-50/80 dark:bg-black/80 backdrop-blur-[2px] pointer-events-none flex flex-col items-center justify-center p-8"
                >
                  <div className="w-full max-w-md space-y-4">
                    <motion.div
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="h-4 bg-blue-200 dark:bg-blue-900/40 rounded-full w-3/4"
                    />
                    <motion.div
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        delay: 0.2,
                      }}
                      className="h-4 bg-blue-200 dark:bg-blue-900/40 rounded-full w-full"
                    />
                    <motion.div
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        delay: 0.4,
                      }}
                      className="h-4 bg-blue-200 dark:bg-blue-900/40 rounded-full w-1/2"
                    />
                    <div className="pt-4 text-center">
                      <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest flex items-center justify-center gap-2">
                        <RefreshCw size={12} className="animate-spin" />{" "}
                        Transcribing Voice
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <textarea
              className={`w-full h-36 bg-transparent text-lg font-light focus:outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-gray-700 resize-none leading-relaxed relative z-20 ${isTranscribing ? "blur-sm" : ""}`}
              placeholder={translations[langIndex].placeholder}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />

            <div className="flex flex-col md:flex-row justify-between items-center mt-6 pt-6 border-t border-slate-200 dark:border-white/5 gap-6 relative z-50">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 px-4 py-2 bg-amber-100 dark:bg-white/5 rounded-xl border border-amber-100 dark:border-white/5">
                  <AlertCircle
                    size={14}
                    className="text-amber-600 dark:text-blue-500"
                  />
                  <p className="text-[10px] text-slate-500 dark:text-gray-400 font-medium">
                    Not a medical diagnosis. In emergencies, contact 911
                    immediately.
                  </p>
                </div>

                {/* Voice Input Toggle Button */}
                <button
                  onClick={isListening ? stopRecording : startRecording}
                  disabled={isTranscribing || loading}
                  className={`p-3 rounded-xl border transition-all duration-300 flex items-center gap-2 group relative z-50 ${
                    isListening
                      ? "bg-red-500 text-white border-red-400 shadow-lg shadow-red-500/20"
                      : "bg-white dark:bg-white/5 text-slate-400 hover:text-blue-500 border-slate-200 dark:border-white/10"
                  } ${isTranscribing || loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                  <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline">
                    {isListening ? "Stop" : "Voice Input"}
                  </span>
                </button>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={loading || !input.trim() || isTranscribing}
                className="w-full md:w-auto h-14 bg-slate-900 dark:bg-white text-white dark:text-black hover:scale-[1.02] px-8 rounded-xl font-bold gap-3 transition-all active:scale-95 shadow-xl disabled:opacity-50"
              >
                {loading ? (
                  <RefreshCw className="animate-spin" size={18} />
                ) : (
                  <Send size={18} />
                )}
                <span className="text-base">
                  {loading ? "Processing..." : "Analyze Engine"}
                </span>
              </Button>
            </div>
          </div>
        </div>

        {/* Results Sections */}
        <AnimatePresence>
          {data && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Voice Player Bar */}
              <div className="flex items-center justify-between bg-white dark:bg-blue-600/5 border border-slate-200 dark:border-blue-500/20 p-3 rounded-2xl shadow-sm backdrop-blur-md">
                <div className="flex items-center gap-3 pl-4">
                  <div
                    className={`w-2 h-2 rounded-full ${isSpeaking ? "bg-blue-500 animate-ping" : "bg-slate-300"}`}
                  />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-blue-400">
                    {isSpeaking ? "Narrating Report..." : "Analysis Complete"}
                  </span>
                </div>
                <Button
                  onClick={toggleSpeech}
                  size="sm"
                  className={`gap-2 px-6 rounded-xl h-10 transition-all font-bold text-xs ${
                    isSpeaking
                      ? "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30"
                      : "bg-slate-900 dark:bg-blue-600 text-white"
                  }`}
                >
                  {isSpeaking ? (
                    <Square size={14} fill="currentColor" />
                  ) : (
                    <Play size={14} fill="currentColor" />
                  )}
                  {isSpeaking ? "Stop Reading" : "Listen to Analysis"}
                </Button>
              </div>

              {/* Data Display Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <aside className="lg:col-span-1 space-y-4">
                  <div className="sticky top-8">
                    <h3 className="text-[10px] font-bold text-slate-400 dark:text-blue-400 uppercase tracking-widest mb-4 px-2">
                      Key Observations
                    </h3>
                    <div className="space-y-3">
                      {data.response?.map((point, i) => (
                        <div
                          key={i}
                          className="p-4 rounded-2xl bg-white dark:bg-white/3 border border-slate-200 dark:border-white/10 group hover:border-blue-400 transition-all"
                        >
                          <span className="text-[10px] font-bold text-blue-500 mb-1 block">
                            INSIGHT 0{i + 1}
                          </span>
                          <p className="text-xs text-slate-600 dark:text-gray-400 leading-relaxed">
                            {point}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </aside>

                <section className="lg:col-span-3 bg-white dark:bg-white/2 border border-slate-200 dark:border-white/10 p-6 md:p-12 rounded-[2.5rem] shadow-sm relative overflow-hidden">
                  <div className="absolute -top-24 -right-24 opacity-[0.02] dark:opacity-[0.03] pointer-events-none rotate-12">
                    <Stethoscope size={400} />
                  </div>

                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <ReactMarkdown
                      components={{
                        h2: ({ children }) => (
                          <h2 className="text-xl font-bold mt-10 mb-6 flex items-center gap-3 text-slate-900 dark:text-white group">
                            <span className="w-1 h-6 bg-blue-500 rounded-full group-hover:h-8 transition-all" />
                            {children}
                          </h2>
                        ),
                        p: ({ children }) => (
                          <p className="text-slate-600 dark:text-gray-400 leading-relaxed mb-6 font-normal text-base">
                            {children}
                          </p>
                        ),
                        li: ({ children }) => (
                          <li className="flex items-start gap-3 mb-2 text-sm text-slate-700 dark:text-gray-300">
                            <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                            {children}
                          </li>
                        ),
                        strong: ({ children }) => (
                          <strong className="text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-500/10 px-1 rounded">
                            {children}
                          </strong>
                        ),
                      }}
                    >
                      {data.summary}
                    </ReactMarkdown>
                  </div>

                  <div className="mt-12 pt-8 border-t border-slate-100 dark:border-white/5">
                    <div className="bg-slate-50 dark:bg-blue-600/3 p-6 rounded-2xl border border-slate-200 dark:border-blue-500/10">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-2">
                        Technical Abstract
                      </h4>
                      <div className="text-xs text-slate-500 dark:text-gray-400 leading-relaxed italic">
                        <ReactMarkdown>{data.short}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
