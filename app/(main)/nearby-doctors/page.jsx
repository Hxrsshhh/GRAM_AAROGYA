// app/page.js
"use client";

import React, { useState } from "react";
import { 
  Search, MapPin, Stethoscope, ExternalLink, Clock, 
  DollarSign, Sparkles, Loader2, AlertCircle, Navigation, 
  Star, ShieldCheck, HeartPulse 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const DoctorCard = ({ doctor, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="group relative bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 hover:bg-white/[0.05] hover:border-blue-500/50 transition-all duration-500 flex flex-col h-full shadow-xl"
  >
    <div className="flex justify-between items-start mb-6">
      <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
        <Stethoscope size={28} />
      </div>
      <div className="flex items-center gap-1 px-3 py-1 bg-white/5 rounded-full border border-white/10">
        <Star size={12} className="text-yellow-400 fill-yellow-400" />
        <span className="text-[10px] font-black text-white">{doctor.rating || "4.9"}</span>
      </div>
    </div>
    <div className="flex-grow">
      <h3 className="text-2xl font-bold text-white mb-2 leading-tight group-hover:text-blue-400 transition-colors">
        {doctor.name}
      </h3>
      <p className="text-blue-400 text-xs font-black uppercase tracking-[0.2em] mb-8 opacity-80">
        {doctor.specialization}
      </p>
      <div className="space-y-4 mb-10 text-sm">
        <div className="flex items-center gap-4 text-gray-300"><Clock size={18} className="text-blue-500" /> {doctor.experience}</div>
        <div className="flex items-center gap-4 text-blue-100 font-medium"><DollarSign size={18} className="text-blue-500" /> {doctor.fee}</div>
        <div className="flex items-start gap-4 text-gray-400"><MapPin size={18} className="text-blue-500 shrink-0" /> {doctor.address}</div>
      </div>
    </div>
    <a href={doctor.mapsLink} target="_blank" className="w-full flex items-center justify-center gap-3 py-5 rounded-[1.5rem] bg-white text-black font-black text-sm hover:bg-blue-600 hover:text-white transition-all duration-300">
      BOOK APPOINTMENT <ExternalLink size={16} />
    </a>
  </motion.div>
);

const EmptyState = ({ error }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-32 bg-white/[0.01] border-2 border-dashed border-white/5 rounded-[4rem]">
    {error ? (
      <div className="flex flex-col items-center p-6">
        <AlertCircle size={40} className="text-red-500 mb-6" />
        <h3 className="text-2xl font-bold text-red-400 mb-2 italic">Search Interrupted</h3>
        <p className="text-gray-500">{error}</p>
      </div>
    ) : (
      <div className="flex flex-col items-center p-6">
        <Search size={40} className="text-gray-700 mb-8 animate-pulse" />
        <h3 className="text-3xl font-black text-gray-400 mb-4 uppercase">System Standby</h3>
        <p className="text-gray-600 max-w-sm mx-auto text-lg font-light">Initialize scan to connect with local specialists.</p>
      </div>
    )}
  </motion.div>
);

// --- Main Page ---
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
      setApiResponse({ error: "System error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 overflow-x-hidden">
      
      {/* Visual background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[70%] h-[70%] bg-blue-600/10 blur-[140px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 blur-[140px] rounded-full" />
      </div>

      <main className="relative z-10 container mx-auto px-6 py-12 lg:py-24 max-w-7xl">
        <div className="text-center mt-14 mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-6 tracking-widest uppercase">
            <Navigation size={12} className="animate-pulse" /> AI-Powered Medical Locator
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter bg-gradient-to-b from-white to-white/30 bg-clip-text text-transparent leading-none mb-6">
            Elite Care. <br /> On Demand.
          </h1>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto font-light">
            Access our verified network of specialists instantly with neural-search precision.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-3xl shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="relative group">
                <Stethoscope className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400" size={22} />
                <input 
                  className="w-full pl-14 pr-6 py-6 rounded-3xl bg-white/[0.03] border border-white/5 outline-none focus:ring-2 focus:ring-blue-500/40 text-lg"
                  placeholder="Specialty (e.g. Cardiologist)"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                />
              </div>
              <div className="relative group">
                <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400" size={22} />
                <input 
                  className="w-full pl-14 pr-6 py-6 rounded-3xl bg-white/[0.03] border border-white/5 outline-none focus:ring-2 focus:ring-indigo-500/40 text-lg"
                  placeholder="City or Zip Code"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>
            <button 
              onClick={handleFindDoctors}
              disabled={loading || !condition || !location}
              className="w-full h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl font-black text-xl flex items-center justify-center gap-4 hover:opacity-90 disabled:opacity-50 transition-all"
            >
              {loading ? <Loader2 className="animate-spin" size={28} /> : <Search size={28} />}
              {loading ? "INITIALIZING SCAN..." : "SEARCH SPECIALISTS"}
            </button>
          </div>
        </div>

        <div className="mt-24">
          <AnimatePresence mode="wait">
            {apiResponse?.doctors ? (
              <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex justify-between items-end mb-12 px-4">
                  <div>
                    <h2 className="text-3xl font-bold flex gap-3"><Sparkles className="text-yellow-400" /> Matches Found</h2>
                    <p className="text-gray-500">Results for {condition} in {location}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {apiResponse.doctors.map((doc, i) => <DoctorCard key={i} doctor={doc} index={i} />)}
                </div>
              </motion.div>
            ) : <EmptyState error={apiResponse?.error} />}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}