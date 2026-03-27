
"use client";

import React, { useState } from "react";
import {
  Search,
  MapPin,
  Stethoscope,
  ExternalLink,
  Clock,
  DollarSign,
  Sparkles,
  Loader2,
  AlertCircle,
  Star,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const DoctorCard = ({ doctor, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileHover={{ y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
    className="group relative bg-white/50 dark:bg-white/[0.02] border border-black/5 dark:border-white/10 rounded-[2.5rem] p-8 hover:bg-white dark:hover:bg-white/[0.05] hover:border-blue-500/50 transition-all duration-500 flex flex-col h-full shadow-xl dark:shadow-2xl backdrop-blur-md"
  >
    <div className="flex justify-between items-start mb-6">
      <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-inner">
        <Stethoscope size={28} />
      </div>
      <div className="flex items-center gap-1 px-3 py-1 bg-black/5 dark:bg-white/5 rounded-full border border-black/5 dark:border-white/10">
        <Star size={12} className="text-yellow-500 fill-yellow-500" />
        <span className="text-[10px] font-black text-gray-800 dark:text-white">
          {doctor.rating || "4.9"}
        </span>
      </div>
    </div>

    <div className="flex-grow">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {doctor.name}
      </h3>
      <p className="text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-[0.2em] mb-8 opacity-80 flex items-center gap-2">
        <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />{" "}
        {doctor.specialization}
      </p>

      <div className="space-y-4 mb-10 text-sm">
        <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
          <Clock size={18} className="text-blue-500" /> {doctor.experience}
        </div>
        <div className="flex items-center gap-4 text-gray-900 dark:text-blue-100 font-semibold">
          <DollarSign size={18} className="text-blue-500" /> {doctor.fee}
        </div>
        <div className="flex items-start gap-4 text-gray-500 dark:text-gray-400 leading-relaxed">
          <MapPin size={18} className="text-blue-500 shrink-0" />{" "}
          {doctor.address}
        </div>
      </div>
    </div>

    <a
      href={doctor.mapsLink}
      target="_blank"
      className="w-full flex items-center justify-center gap-3 py-5 rounded-[1.5rem] bg-gray-900 dark:bg-white text-white dark:text-black font-black text-sm hover:bg-blue-600 dark:hover:bg-blue-600 dark:hover:text-white transition-all duration-300 active:scale-95 shadow-lg"
    >
      BOOK APPOINTMENT <ExternalLink size={16} />
    </a>
  </motion.div>
);

export default function Page() {
  const [condition, setCondition] = useState("");
  const [location, setLocation] = useState("");
  const [apiResponse, setApiResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFindDoctors = async () => {
    if (!condition.trim() || !location.trim()) return;
    setLoading(true);
    setApiResponse(null);

    try {
      const res = await fetch("/api/doctors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ condition, location }),
      });
      const data = await res.json();
      setApiResponse(data);
    } catch (err) {
      setApiResponse({ error: "Network protocols failed." });
    } finally {
      setLoading(false);
    }
  };

  const hasResults = apiResponse?.doctors && apiResponse.doctors.length > 0;

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-[#050505] text-gray-900 dark:text-white transition-colors duration-500 ${!hasResults ? 'h-screen overflow-hidden' : 'overflow-x-hidden'}`}>
      
      {/* Dynamic Background Mesh */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[70%] h-[70%] bg-blue-600/10 dark:bg-blue-600/15 blur-[140px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 dark:bg-indigo-600/15 blur-[140px] rounded-full" />
      </div>

      <main className="relative z-10 container mx-auto px-6 pt-20 lg:pt-32 pb-24 max-w-7xl">
        <div className="text-center mb-8 lg:mb-12">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/5 dark:bg-blue-400/10 border border-blue-500/10 dark:border-blue-400/20 text-blue-600 dark:text-blue-400 text-[9px] font-black mb-6 tracking-[0.3em] uppercase backdrop-blur-sm"
          >
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </div>
            Precision Network
          </motion.div>

          <h1 className="text-5xl md:text-[5.5rem] font-black tracking-tighter leading-[0.9] mb-6 bg-gradient-to-b from-gray-900 via-gray-700 to-gray-500 dark:from-white dark:via-white dark:to-white/30 bg-clip-text text-transparent">
            Expert Care. <br /> 
            <span className="italic">In Seconds.</span>
          </h1>
        </div>

        {/* Search Console */}
        <div className="max-w-4xl mx-auto group relative bg-white/70 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-[3rem] p-2 sm:p-3 backdrop-blur-3xl shadow-2xl transition-all hover:border-blue-500/30">
          <div className="bg-slate-50 dark:bg-black/40 rounded-[2.7rem] p-6 md:p-10 border border-slate-100 dark:border-white/5 relative overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="relative group/input">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-3 pointer-events-none">
                  <Stethoscope className="text-slate-400 group-focus-within/input:text-blue-500 transition-colors" size={22} />
                  <div className="h-4 w-[1px] bg-slate-200 dark:bg-white/10" />
                </div>
                <input
                  className="w-full pl-20 pr-6 py-6 rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 text-lg transition-all"
                  placeholder="Specialty (e.g. Cardiologist)"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                />
              </div>

              <div className="relative group/input">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-3 pointer-events-none">
                  <MapPin className="text-slate-400 group-focus-within/input:text-indigo-500 transition-colors" size={22} />
                  <div className="h-4 w-[1px] bg-slate-200 dark:bg-white/10" />
                </div>
                <input
                  className="w-full pl-20 pr-6 py-6 rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 text-lg transition-all"
                  placeholder="City or Zip Code"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-6 border-t border-slate-200 dark:border-white/5">
              <div className="flex items-center gap-2 text-amber-600 dark:text-blue-500">
                <AlertCircle size={14} />
                <p className="text-[10px] italic">Verify medical details with providers.</p>
              </div>

              <button
                onClick={handleFindDoctors}
                disabled={loading || !condition || !location}
                className="w-full md:w-auto min-w-[240px] h-16 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl font-black text-sm tracking-widest flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 disabled:opacity-30 transition-all shadow-xl"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
                {loading ? "SCANNING..." : "EXECUTE SEARCH"}
              </button>
            </div>
          </div>
        </div>

        {/* Results Section - Only appears if data exists */}
        <AnimatePresence>
          {hasResults && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-24"
            >
              <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 px-4 gap-4">
                <div className="text-center md:text-left">
                  <h2 className="text-4xl font-bold flex items-center justify-center md:justify-start gap-3">
                    <Sparkles className="text-yellow-500" /> Matches Found
                  </h2>
                </div>
                <div className="text-[10px] font-black bg-blue-500 text-white px-4 py-2 rounded-full">
                  {apiResponse.doctors.length} RESULTS TOTAL
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {apiResponse.doctors.map((doc, i) => (
                  <DoctorCard key={i} doctor={doc} index={i} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}