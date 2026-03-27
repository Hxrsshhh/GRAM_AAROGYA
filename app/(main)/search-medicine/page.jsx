"use client";

import React, { useState } from "react";
import {
  Mic,
  MicOff,
  RefreshCw,
  Play,
  ShieldAlert,
  Clock,
  Zap,
  Search,
  Sparkles,
  AlertCircle,
  Square,
  Stethoscope,
  Send,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const translations = [
  {
    lang: "English",
    code: "en-US",
    heading: "Neural Health Scan",
    placeholder: "Identify pharmaceutical or symptoms...",
  },
  {
    lang: "हिन्दी",
    code: "hi-IN",
    heading: "न्यूरल स्वास्थ्य जाँच",
    placeholder: "दवा या लक्षणों की पहचान करें...",
  },
  {
    lang: "বাংলা",
    code: "bn-IN",
    heading: "নিউরাল স্বাস্থ্য পরীক্ষা",
    placeholder: "ওষুধ বা উপসর্গ চিহ্নিত করুন...",
  },
];

const App = () => {
  const [langIndex, setLangIndex] = useState(0);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [data, setData] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSubmit = async () => {
    if (!input.trim()) return;
    setLoading(true);
    // Mock API simulation
    setTimeout(() => {
      setLoading(false);
      setData({
        name: input,
        composition: "Complex Molecular Chain C8H9NO2",
        uses: ["Rapid Analgesic", "Antipyretic Regulator"],
        dosage: "500mg every 6 hours as per neural response.",
        warnings: ["Hepatic toxicity risk", "Avoid alcohol interference"],
        response: [
          "Direct neural pathway inhibition",
          "Metabolic stabilization active",
          "No critical anomalies detected",
        ],
        summary:
          "## Analysis Overview \n This compound acts as a **central nervous system** agent. It is primarily used for the management of acute pain and temperature regulation.",
        short:
          "Molecular structure consistent with established analgesic protocols.",
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#030303] text-slate-900 dark:text-white selection:bg-blue-500/30 transition-colors duration-500 font-sans">
      {/* Ambient Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[70%] h-[70%] bg-blue-600/10 dark:bg-blue-600/15 blur-[140px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 dark:bg-indigo-600/15 blur-[140px] rounded-full" />
      </div>

      <main className="relative z-10 container mx-auto px-6 pt-32 pb-24 max-w-7xl">
        {/* Header Section */}
        <header className="text-center mb-16 space-y-6">
          <motion.div
            key={langIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest"
          >
            <Sparkles size={12} className="animate-pulse" />
            <span>Neural Analysis Engine • {translations[langIndex].lang}</span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tighter bg-linear-to-b from-slate-900 via-slate-800 to-slate-600 dark:from-white dark:to-gray-500 bg-clip-text text-transparent uppercase italic">
            {translations[langIndex].heading}
          </h1>
          <p className="max-w-2xl mx-auto text-slate-500 dark:text-gray-400 text-lg font-light leading-relaxed">
            High-fidelity molecular tracing and physiological symptom synthesis.
            Analyze bio-metric data with real-time neural processing.
          </p>
        </header>

        {/* Input Console Container */}
        <div className="group relative bg-white/70 dark:bg-white/2 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-3 backdrop-blur-3xl shadow-2xl transition-all hover:border-blue-500/30 mb-20 max-w-4xl mx-auto">
          <div className="bg-slate-50 dark:bg-black/40 rounded-[2rem] p-6 border border-slate-100 dark:border-white/5 relative overflow-hidden">
            {/* Listening Wave Overlay */}
            <AnimatePresence>
              {isListening && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-30 bg-blue-500/5 dark:bg-blue-500/10 backdrop-blur-md flex flex-col items-center justify-center gap-4"
                >
                  <div className="flex gap-2 items-end h-10">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ height: [10, 30, 10] }}
                        transition={{
                          repeat: Infinity,
                          duration: 0.6,
                          delay: i * 0.1,
                        }}
                        className="w-1.5 bg-blue-500 rounded-full"
                      />
                    ))}
                  </div>
                  <span className="text-blue-500 font-black text-[10px] uppercase tracking-[0.3em]">
                    Capturing Vitals...
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Simplified Input Field */}
            <div className="flex items-center gap-4 relative z-20">
              <Search
                className="text-slate-400 dark:text-gray-700 shrink-0"
                size={24}
              />
              <input
                type="text"
                autoComplete="off"
                className="w-full bg-transparent text-2xl font-light focus:outline-none placeholder:text-slate-300 dark:placeholder:text-gray-800 py-4 tracking-tight"
                placeholder={translations[langIndex].placeholder}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center mt-6 pt-6 border-t border-slate-200 dark:border-white/5 gap-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 px-4 py-2 bg-amber-50 dark:bg-white/5 rounded-xl border border-amber-100 dark:border-white/5">
                  <AlertCircle
                    size={14}
                    className="text-amber-600 dark:text-blue-500"
                  />
                  <p className="text-[10px] text-slate-500 dark:text-gray-500 font-bold uppercase tracking-tight">
                    Not a medical diagnosis.
                  </p>
                </div>

                <button
                  onClick={() => setIsListening(!isListening)}
                  className={`p-4 rounded-2xl border transition-all ${
                    isListening
                      ? "bg-red-500 text-white border-red-400 shadow-lg shadow-red-500/20"
                      : "bg-white dark:bg-white/5 text-slate-400 border-slate-200 dark:border-white/10 hover:border-blue-500/50"
                  }`}
                >
                  {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                </button>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading || !input.trim()}
                className="w-full md:w-auto h-16 bg-slate-900 dark:bg-white text-white dark:text-black hover:scale-[1.02] px-10 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95 shadow-2xl disabled:opacity-20"
              >
                {loading ? (
                  <RefreshCw className="animate-spin" size={20} />
                ) : (
                  <Zap size={20} className="fill-current" />
                )}
                <span>{loading ? "Processing" : "Analyze Engine"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Results Sections */}
        <AnimatePresence>
          {data && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-10"
            >
              {/* Voice Player Bar */}
              <div className="flex items-center justify-between bg-white dark:bg-blue-600/5 border border-slate-200 dark:border-blue-500/20 p-4 rounded-3xl shadow-xl backdrop-blur-md">
                <div className="flex items-center gap-4 pl-4">
                  <div
                    className={`w-3 h-3 rounded-full ${isSpeaking ? "bg-blue-500 animate-ping" : "bg-slate-200 dark:bg-blue-900"}`}
                  />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-blue-400">
                    Analysis Stream Secure
                  </span>
                </div>
                <button
                  onClick={() => setIsSpeaking(!isSpeaking)}
                  className={`flex items-center gap-3 px-8 h-12 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                    isSpeaking
                      ? "bg-red-500 text-white"
                      : "bg-slate-900 dark:bg-blue-600 text-white"
                  }`}
                >
                  {isSpeaking ? (
                    <Square size={14} fill="currentColor" />
                  ) : (
                    <Play size={14} fill="currentColor" />
                  )}
                  {isSpeaking ? "Terminating Audio" : "Synthesize Report"}
                </button>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <aside className="lg:col-span-1 space-y-4">
                  <h3 className="text-[10px] font-black text-slate-400 dark:text-blue-500 uppercase tracking-[0.3em] mb-6 px-2">
                    Diagnostic Insights
                  </h3>
                  {data.response?.map((point, i) => (
                    <div
                      key={i}
                      className="p-6 rounded-3xl bg-white dark:bg-white/3 border border-slate-200 dark:border-white/10 hover:border-blue-500/30 transition-all"
                    >
                      <span className="text-[9px] font-black text-blue-500 mb-2 block">
                        TRACE_LOG_0{i + 1}
                      </span>
                      <p className="text-xs text-slate-600 dark:text-gray-400 leading-relaxed italic">
                        {point}
                      </p>
                    </div>
                  ))}
                </aside>

                <section className="lg:col-span-3 bg-white dark:bg-white/2 border border-slate-200 dark:border-white/10 p-10 md:p-16 rounded-[3rem] shadow-sm relative overflow-hidden">
                  <div className="absolute -top-24 -right-24 opacity-[0.03] dark:opacity-[0.05] pointer-events-none rotate-12 text-slate-900 dark:text-white">
                    <Stethoscope size={450} />
                  </div>

                  <div className="relative z-10 space-y-8">
                    <div className="flex justify-between items-start border-b border-slate-100 dark:border-white/5 pb-10">
                      <div>
                        <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.5em] mb-4">
                          Identification Complete
                        </p>
                        <h2 className="text-6xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white">
                          {data.name}
                        </h2>
                      </div>
                      <div className="text-right bg-blue-500/10 p-4 rounded-2xl border border-blue-500/20">
                        <p className="text-[10px] font-black text-slate-500 dark:text-blue-400 uppercase mb-1">
                          Confidence
                        </p>
                        <p className="text-3xl font-black text-blue-600 dark:text-blue-400">
                          99.8%
                        </p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                      <div className="space-y-6">
                        <div className="flex items-center gap-3 text-[10px] font-black uppercase text-slate-400 dark:text-blue-400 tracking-widest">
                          <Clock size={16} /> Protocol
                        </div>
                        <p className="text-xl text-slate-600 dark:text-slate-300 font-light italic leading-relaxed bg-slate-50 dark:bg-white/5 p-8 rounded-3xl border border-slate-100 dark:border-white/5">
                          {data.dosage}
                        </p>
                      </div>
                      <div className="space-y-6">
                        <div className="flex items-center gap-3 text-[10px] font-black uppercase text-amber-600 dark:text-amber-500 tracking-widest">
                          <ShieldAlert size={16} /> Risk Factors
                        </div>
                        <ul className="space-y-4">
                          {data.warnings.map((w, i) => (
                            <li
                              key={i}
                              className="text-sm text-slate-500 dark:text-gray-400 flex items-center gap-4"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                              {w}
                            </li>
                          ))}
                        </ul>
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
};

export default App;
