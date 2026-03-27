"use client";

import React, { useState, useRef } from "react";
import {
  Camera,
  Upload,
  Sparkles,
  FileText,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  Eye,
  Trash2,
  Activity,
  ClipboardList,
  Clock,
  Pill,
  Calendar,
  Zap,
  ShieldCheck,
  Search,
  ExternalLink,
  Target,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const App = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
      setResults(null);
      setError(null);
    }
  };

  const handleMedicineSearch = (medName) => {
    window.open(
      `https://www.google.com/search?q=${encodeURIComponent(medName + " medication uses dosage")}`,
      "_blank",
    );
  };

  const analyzePrescription = async () => {
    if (!image) return;

    setLoading(true);
    setError(null);

    try {
      const base64Data = image.split(",")[1];

      const response = await fetch("/api/prescription/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageBase64: base64Data,
          userId: "USER_ID_HERE", // from session
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error);
      }

      setResults(result.data);
    } catch (err) {
      setError("Failed to process image");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-h-screen bg-white dark:bg-[#030303]/1 text-slate-900 dark:text-slate-100 transition-colors duration-500 font-sans pb-32">
      {/* Top Blank Spacer */}
      <div className="h-12 md:h-20" />

      {/* Background Accents */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[70%] h-[70%] bg-blue-600/10 dark:bg-blue-600/15 blur-[140px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 dark:bg-indigo-600/15 blur-[140px] rounded-full" />
      </div>

      <main className="relative z-10 container mx-auto px-6 max-w-5xl">
        {/* Header Section */}
        <header className="text-center mb-12 space-y-6 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.25em]"
          >
            <Target size={12} />
            <span>Neural Perception v3.0</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black tracking-tighter bg-linear-to-b from-slate-950 via-slate-800 to-slate-500 dark:from-white dark:to-slate-600 bg-clip-text text-transparent"
          >
            Vision Script
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-slate-500 dark:text-slate-400 text-sm md:text-lg max-w-2xl mx-auto font-medium"
          >
            Bridge the gap between handwriting and digital care.
          </motion.p>
        </header>

        {/* Upload Container (Immediately after heading) */}
        <div className="max-w-2xl mx-auto mb-20 space-y-6">
          <motion.div
            layout
            className={`relative group overflow-hidden bg-white/40 dark:bg-white/2 border-2 border-dashed transition-all rounded-[3rem] shadow-2xl shadow-blue-500/5 ${image ? "border-blue-500/50" : "border-slate-200 dark:border-white/10 hover:border-blue-400/50"}`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
              accept="image/*"
            />
            {!image ? (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full aspect-video flex flex-col items-center justify-center p-12 text-center group"
              >
                <div className="w-16 h-16 mb-4 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-blue-500 group-hover:scale-110 transition-all border border-slate-200 dark:border-white/5">
                  <Camera size={32} />
                </div>
                <h3 className="text-xl font-bold mb-1 tracking-tight">
                  Upload Prescription
                </h3>
                <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 opacity-60">
                  Handwritten or Digital
                </p>
              </button>
            ) : (
              <div className="relative aspect-video">
                <Image
                  src={image}
                  alt="Prescription"
                  fill
                  className="object-cover rounded-[2.8rem] p-2"
                />
                <div className="absolute inset-2 bg-slate-950/60 backdrop-blur-sm rounded-[2.6rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <button
                    onClick={() => setImage(null)}
                    className="p-4 bg-red-500 text-white rounded-2xl hover:scale-110 transition-all shadow-xl"
                  >
                    <Trash2 size={24} />
                  </button>
                </div>
              </div>
            )}
          </motion.div>

          <button
            onClick={analyzePrescription}
            disabled={!image || loading}
            className={`w-full h-16 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-4 transition-all active:scale-[0.98] shadow-2xl ${
              !image
                ? "bg-slate-100 dark:bg-white/5 text-slate-400 cursor-not-allowed"
                : "bg-slate-900 dark:bg-white text-white dark:text-black hover:shadow-blue-500/20"
            }`}
          >
            {loading ? (
              <RefreshCw size={20} className="animate-spin" />
            ) : (
              <>
                <Sparkles size={20} />
                <span>Run Diagnosis Engine</span>
              </>
            )}
          </button>
        </div>

        {/* Results Section */}
        <section className="space-y-8">
          {error && (
            <div className="p-5 rounded-2xl bg-red-50 dark:bg-red-500/5 border border-red-100 dark:border-red-500/10 flex gap-4 text-red-600 dark:text-red-400 max-w-2xl mx-auto">
              <AlertCircle className="shrink-0" size={20} />
              <p className="text-xs font-bold leading-relaxed">{error}</p>
            </div>
          )}

          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-64 rounded-[2.5rem] bg-slate-50 dark:bg-white/5 animate-pulse border border-slate-100 dark:border-white/5"
                />
              ))}
            </div>
          )}

          <AnimatePresence>
            {results && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {results.map((med, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => handleMedicineSearch(med.name)}
                    className="group relative cursor-pointer p-6 rounded-[2.5rem] bg-white dark:bg-white/3 border border-slate-200 dark:border-white/10 hover:border-blue-500/50 hover:shadow-[0_20px_50px_rgba(59,130,246,0.1)] transition-all duration-500 overflow-hidden"
                  >
                    {/* Hover Search Overlay Hint */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-[10px] font-bold text-blue-500">
                      <Search size={12} />
                      <span className="uppercase tracking-widest">
                        Search Med
                      </span>
                      <ExternalLink size={10} />
                    </div>

                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-500/10 shrink-0">
                        <Pill size={24} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-black text-xl tracking-tight text-slate-900 dark:text-white truncate">
                            {med.name}
                          </h3>
                          {med.isEstimated && (
                            <span className="bg-amber-500/10 text-amber-600 text-[7px] px-1.5 py-0.5 rounded font-black border border-amber-500/10 uppercase">
                              EST
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase flex items-center gap-1">
                            <ShieldCheck size={10} /> {med.use}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Correctness Percentage */}
                    <div className="mb-6 p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                      <div className="flex justify-between items-end mb-1.5">
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                          Neural Match Probability
                        </span>
                        <span
                          className={`text-xs font-black ${med.confidenceScore > 80 ? "text-emerald-500" : "text-amber-500"}`}
                        >
                          {med.confidenceScore}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${med.confidenceScore}%` }}
                          className={`h-full rounded-full ${med.confidenceScore > 80 ? "bg-emerald-500" : "bg-amber-500"}`}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/2 border border-slate-100 dark:border-white/5">
                        <p className="text-[8px] font-black uppercase opacity-50 mb-1 flex items-center gap-1">
                          <Zap size={10} /> Dosage
                        </p>
                        <p className="text-xs font-bold truncate">
                          {med.dosage}
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/2 border border-slate-100 dark:border-white/5">
                        <p className="text-[8px] font-black uppercase opacity-50 mb-1 flex items-center gap-1">
                          <Clock size={10} /> Timing
                        </p>
                        <p className="text-xs font-bold truncate">
                          {med.timing}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50/30 dark:bg-blue-500/3 border border-blue-100/30 dark:border-blue-500/10 rounded-2xl group-hover:bg-blue-500/10 transition-colors">
                      <p className="text-[9px] font-black uppercase tracking-widest text-blue-600/60 mb-1">
                        Clinical Instruction
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium italic truncate">
                        {med.instructions}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      {/* Warning Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-black/80 backdrop-blur-2xl border-t border-slate-200/60 dark:border-white/5 py-5 z-50">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle size={16} className="text-amber-500" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
              NEURAL CORE v3.0 • Automated Perception Mode
            </p>
          </div>
          <p className="text-[9px] text-slate-400 dark:text-slate-600 text-center md:text-right max-w-md font-medium">
            Confidence scores indicate character match probability. Clicking
            cards will open external medical registries for verification.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
