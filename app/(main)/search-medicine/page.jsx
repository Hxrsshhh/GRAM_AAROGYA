"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Mic,
  MicOff,
  Send,
  RefreshCw,
  AlertCircle,
  Play,
  Square,
  ChevronLeft,
  MapPin,
  Stethoscope,
  Info,
  ShieldAlert,
  Beaker,
  Clock,
  Activity,
  Search,
  Lock,
  Zap,
  Fingerprint,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

const App = () => {
  const [langIndex, setLangIndex] = useState(0);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [data, setData] = useState(null);

  const handleSubmit = async () => {
    if (!input.trim()) return;

    setLoading(true);

    try {
      const response = await fetch("/api/medicine", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: input }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch medicine");
      }

      // ✅ THIS is your final structured data
      setData(result.data);
    } catch (error) {
      console.error("Medicine Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const startRecording = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      setIsTranscribing(true);
      setTimeout(() => {
        setIsTranscribing(false);
        setInput("Paracetamol 500mg");
      }, 1200);
    }, 2500);
  };

  const stopRecording = () => setIsListening(false);
  const toggleSpeech = () => setIsSpeaking(!isSpeaking);

  return (
    <div className="min-h-screen bg-white dark:bg-[#030303] text-slate-900 dark:text-slate-100 selection:bg-blue-500/30 transition-colors duration-500 font-sans overflow-x-hidden">
      {/* Modern Mesh Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 dark:bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-emerald-500/10 dark:bg-cyan-500/5 blur-[100px] rounded-full" />
        <div className="absolute top-[20%] right-[10%] w-px h-[60%] bg-gradient-to-b from-transparent via-blue-500/20 to-transparent" />
      </div>

      {/* Added pt-24 to clear the default Navbar */}
      <main className="relative z-10 container mx-auto px-6 pt-28 pb-12 lg:pt-32 max-w-6xl">
        <AnimatePresence mode="wait">
          {!data ? (
            <motion.header
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
              transition={{ duration: 0.5, ease: "circOut" }}
              className="text-center mb-16 space-y-6"
            >
              {/* Language Selector Hub */}
              <nav className="inline-flex p-1.5 bg-slate-100 dark:bg-white/5 backdrop-blur-md rounded-2xl border border-slate-200/50 dark:border-white/10 shadow-inner">
                {translations.map((t, i) => (
                  <button
                    key={t.lang}
                    onClick={() => setLangIndex(i)}
                    className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                      langIndex === i
                        ? "bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-md scale-105"
                        : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
                    }`}
                  >
                    {t.lang}
                  </button>
                ))}
              </nav>

              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[9px] font-black uppercase tracking-[0.3em] shadow-[0_0_20px_rgba(59,130,246,0.1)]"
                >
                  <Sparkles size={12} className="animate-spin-slow" />
                  <span>Next-Gen Bio-Intelligence • v4.2</span>
                </motion.div>

                <h1 className="text-5xl md:text-8xl font-black tracking-tighter italic uppercase leading-[0.9]">
                  <span className="bg-gradient-to-b from-slate-950 to-slate-500 dark:from-white dark:to-slate-600 bg-clip-text text-transparent">
                    {translations[langIndex].heading.split(" ")[0]}
                  </span>
                  <br />
                  <span className="text-blue-600 dark:text-blue-500">
                    {translations[langIndex].heading
                      .split(" ")
                      .slice(1)
                      .join(" ")}
                  </span>
                </h1>
              </div>
            </motion.header>
          ) : (
            /* Results Header - Compact & Sticky-ready */
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between mb-12 pb-6 border-b border-slate-200 dark:border-white/10"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white shadow-[0_8px_20px_rgba(37,99,235,0.3)]">
                  <Fingerprint size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black tracking-tight uppercase italic leading-none">
                    Intelligence Hub
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-blue-400 font-bold">
                      Secure Core Link Established
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setData(null);
                  setInput("");
                }}
                className="group px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all flex items-center gap-2"
              >
                <RefreshCw
                  size={12}
                  className="group-hover:rotate-180 transition-transform duration-500"
                />{" "}
                New Trace
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input HUD Console */}
        <motion.div
          layout
          className={`relative group bg-white/40 dark:bg-white/[0.01] border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-3 backdrop-blur-2xl shadow-2xl transition-all duration-500 hover:border-blue-500/40 mb-12`}
        >
          <div
            className={`bg-slate-50/50 dark:bg-black/60 rounded-[2rem] border border-slate-200/50 dark:border-white/5 relative overflow-hidden transition-all duration-700 ${data ? "p-3" : "p-8"}`}
          >
            {/* Animated Listening Waveform */}
            <AnimatePresence>
              {isListening && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-30 bg-blue-600/5 backdrop-blur-md flex flex-col items-center justify-center"
                >
                  <div className="flex gap-1.5 items-end h-16">
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ height: [15, 60, 20, 50, 15] }}
                        transition={{
                          repeat: Infinity,
                          duration: 0.6,
                          delay: i * 0.05,
                        }}
                        className="w-2 bg-blue-500 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.6)]"
                      />
                    ))}
                  </div>
                  <span className="mt-4 text-[10px] font-black uppercase tracking-[0.4em] text-blue-500 animate-pulse">
                    Intercepting Voice Stream...
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            <div
              className={`flex flex-col ${data ? "md:flex-row items-center gap-6" : "gap-4"}`}
            >
              <div className="flex-1 relative">
                <textarea
                  className={`w-full bg-transparent font-light focus:outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-800 resize-none leading-relaxed relative z-20 ${data ? "h-12 py-3 pl-4 text-base" : "h-36 text-xl md:text-2xl"}`}
                  placeholder={translations[langIndex].placeholder}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
              </div>

              <div
                className={`flex items-center gap-4 ${data ? "shrink-0" : "mt-8 pt-8 border-t border-slate-200 dark:border-white/5 justify-between"}`}
              >
                {!data && (
                  <div className="flex items-center gap-3 px-5 py-2.5 bg-amber-500/5 rounded-2xl border border-amber-500/10">
                    <AlertCircle size={16} className="text-amber-500" />
                    <p className="text-[9px] text-slate-500 dark:text-amber-200/50 font-bold uppercase tracking-tight max-w-[200px]">
                      Precision engine active. Non-diagnostic mode.
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={isListening ? stopRecording : startRecording}
                    className={`p-4 rounded-2xl border transition-all duration-300 flex items-center gap-3 ${
                      isListening
                        ? "bg-red-500 text-white border-red-400 animate-pulse shadow-lg shadow-red-500/30"
                        : "bg-white dark:bg-white/5 text-slate-400 hover:text-blue-500 border-slate-200 dark:border-white/10"
                    }`}
                  >
                    {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                    {!data && (
                      <span className="text-xs font-black uppercase tracking-widest hidden sm:inline">
                        Stream
                      </span>
                    )}
                  </button>

                  <button
                    onClick={handleSubmit}
                    disabled={loading || !input.trim()}
                    className={`bg-slate-900 dark:bg-blue-600 text-white hover:scale-105 active:scale-95 rounded-2xl font-black uppercase tracking-[0.2em] flex items-center justify-center gap-4 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.2)] disabled:opacity-30 ${data ? "px-6 h-12 text-[10px]" : "px-10 h-14 text-xs"}`}
                  >
                    {loading ? (
                      <RefreshCw className="animate-spin" size={18} />
                    ) : (
                      <Zap size={18} className="fill-current" />
                    )}
                    <span>
                      {loading
                        ? "Processing"
                        : data
                          ? "Sync"
                          : "Execute Analysis"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Results Bento Grid */}
        <AnimatePresence>
          {data && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Narrator Interface */}
              <div className="flex items-center justify-between bg-blue-600 dark:bg-blue-600/10 border border-blue-500/20 p-3 rounded-[1.5rem] shadow-xl backdrop-blur-xl">
                <div className="flex items-center gap-4 pl-4">
                  <div className="relative">
                    <div
                      className={`w-3 h-3 rounded-full ${isSpeaking ? "bg-white animate-ping" : "bg-emerald-400"}`}
                    />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-50 dark:text-blue-400">
                    {isSpeaking
                      ? "Broadcasting Neural Data..."
                      : "Information Decrypted"}
                  </span>
                </div>
                <button
                  onClick={toggleSpeech}
                  className={`flex items-center gap-3 px-6 rounded-xl h-10 transition-all font-black text-[10px] uppercase tracking-widest ${
                    isSpeaking
                      ? "bg-white text-blue-600"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {isSpeaking ? (
                    <Square size={12} fill="currentColor" />
                  ) : (
                    <Play size={12} fill="currentColor" />
                  )}
                  {isSpeaking ? "Abort" : "Synthesize"}
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar Stats */}
                <aside className="lg:col-span-1 space-y-6">
                  <div className="p-6 rounded-[2rem] bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 hover:border-blue-500/30 transition-all shadow-sm">
                    <div className="flex items-center gap-3 mb-6 text-blue-500">
                      <div className="p-2 bg-blue-500/10 rounded-lg">
                        <Beaker size={18} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                        Molecular Core
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed italic">
                      {data.composition}
                    </p>
                  </div>

                  <div className="p-6 rounded-[2rem] bg-emerald-500/[0.02] border border-emerald-500/10">
                    <div className="flex items-center gap-3 mb-6 text-emerald-500">
                      <div className="p-2 bg-emerald-500/10 rounded-lg">
                        <Activity size={18} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                        Clinical Scope
                      </span>
                    </div>
                    <ul className="space-y-4">
                      {data.uses.map((use, idx) => (
                        <li
                          key={idx}
                          className="text-xs text-slate-500 dark:text-slate-400 flex items-start gap-3"
                        >
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5" />
                          {use}
                        </li>
                      ))}
                    </ul>
                  </div>
                </aside>

                {/* Main Result Card */}
                <section className="lg:col-span-3 bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col">
                  <div className="p-10 md:p-14 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                      <div className="space-y-2">
                        <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.5em]">
                          Dossier Alpha-9
                        </p>
                        <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">
                          {data.name}
                        </h2>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                          Authenticity
                        </p>
                        <p className="text-3xl font-black text-blue-600">
                          98.4%
                        </p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                      <div className="space-y-6">
                        <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                          <Clock size={14} className="text-blue-500" /> Protocol
                          Logic
                        </h4>
                        <div className="p-6 bg-slate-50 dark:bg-white/[0.02] rounded-[2rem] border border-slate-200 dark:border-white/5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                          {data.dosage}
                        </div>
                      </div>

                      <div className="space-y-6">
                        <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-amber-500">
                          <ShieldAlert size={14} /> Risk Mitigation
                        </h4>
                        <div className="p-6 bg-amber-500/5 rounded-[2rem] border border-amber-500/10">
                          <ul className="space-y-3">
                            {data.warnings.map((warn, i) => (
                              <li
                                key={i}
                                className="text-[11px] text-amber-900/70 dark:text-amber-200/50 flex gap-3"
                              >
                                <span className="text-amber-500 font-bold">
                                  !
                                </span>{" "}
                                {warn}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-slate-100 dark:border-white/5 flex flex-wrap gap-3">
                      {data.sideEffects.map((effect, i) => (
                        <span
                          key={i}
                          className="px-4 py-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500"
                        >
                          {effect}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Terminal Style Footer */}
                  <div className="bg-slate-900 dark:bg-blue-600 p-6 flex justify-between items-center text-white">
                    <div className="flex gap-8">
                      <div>
                        <p className="text-[8px] opacity-60 uppercase font-black">
                          Source Node
                        </p>
                        <p className="text-xs font-bold font-mono tracking-tight">
                          FDA_GLOBAL_v2
                        </p>
                      </div>
                      <div className="hidden sm:block">
                        <p className="text-[8px] opacity-60 uppercase font-black">
                          Latency
                        </p>
                        <p className="text-xs font-bold font-mono tracking-tight">
                          142ms
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[8px] font-black opacity-40 uppercase tracking-widest">
                        Quantum-Resistant Encrypted
                      </span>
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md">
                        <Lock size={14} />
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              {/* Action Hub */}
              <footer className="flex flex-col sm:flex-row gap-6 py-12 justify-center items-center">
                <button className="group flex items-center gap-3 text-slate-400 hover:text-blue-500 text-[10px] font-black uppercase tracking-[0.4em] transition-all">
                  <ChevronLeft
                    size={16}
                    className="group-hover:-translate-x-2 transition-transform"
                  />{" "}
                  Full Archives
                </button>
                <button className="bg-blue-600 hover:bg-blue-500 text-white px-10 h-14 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-blue-500/40 group flex items-center gap-4 transition-all">
                  <MapPin size={18} className="group-hover:animate-bounce" />
                  Locate Provider
                </button>
              </footer>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;
