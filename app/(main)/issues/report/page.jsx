"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit3, Cpu, ShieldCheck, Sparkles, RotateCcw } from "lucide-react";

import AiScan from "@/components/reportIssues/AiScan";
import ReportIssue from "@/components/reportIssues/ReportManual";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function App() {
  const [isAiMode, setIsAiMode] = useState(true);

  const router = useRouter();

  const [aiFile, setAiFile] = useState(null);
  const [manualData, setManualData] = useState({
    category: "",
    description: "",
  });

  const handleRefresh = () => {
    setAiFile(null);

    setManualData({ category: "", description: "" });
    router.refresh();
    console.log("Registry states cleared.");
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-500 selection:bg-emerald-500 selection:text-white font-['Plus_Jakarta_Sans'] overflow-hidden flex flex-col">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[15%] -right-[5%] w-[40%] h-[40%] bg-emerald-500/10 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute bottom-[15%] -left-[5%] w-[30%] h-[30%] bg-blue-500/10 blur-[100px] rounded-full" />
      </div>

      <div className="mt-20 px-6 py-4 flex items-center justify-between gap-4 shrink-0 max-w-2xl mx-auto w-full z-10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-tighter text-slate-500">
            Protocol Interface
          </span>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ rotate: -180 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleRefresh}
            className="p-2 rounded-xl bg-white dark:bg-slate-900 text-slate-400 hover:text-emerald-500 border border-slate-200 dark:border-slate-800 transition-colors shadow-sm"
            title="Refresh Fields"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </motion.button>

          <div className="flex items-center bg-slate-200/50 dark:bg-slate-900/50 backdrop-blur-md p-1 rounded-xl border border-white/50 dark:border-slate-800 shadow-sm">
            <button
              onClick={() => setIsAiMode(true)}
              className={`relative flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
                isAiMode
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-slate-500"
              }`}
            >
              {isAiMode && (
                <motion.div
                  layoutId="tab"
                  className="absolute inset-0 bg-white dark:bg-slate-800 shadow-sm ring-1 ring-black/5 rounded-lg"
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <Cpu
                  className={`w-3.5 h-3.5 ${
                    isAiMode ? "animate-spin-slow" : ""
                  }`}
                />
                AI
              </span>
            </button>
            <button
              onClick={() => setIsAiMode(false)}
              className={`relative flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
                !isAiMode
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-slate-500"
              }`}
            >
              {!isAiMode && (
                <motion.div
                  layoutId="tab"
                  className="absolute inset-0 bg-white dark:bg-slate-800 shadow-sm ring-1 ring-black/5 rounded-lg"
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <Edit3 className="w-3.5 h-3.5" />
                Manual
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className=" flex flex-col  items-center justify-start pt-4 lg:px-6  min-h-0 z-10">
        <div className="w-full max-w-7xl flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={isAiMode ? "ai" : "manual"}
              className="flex-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-black tracking-tight mb-1">
                  {isAiMode ? "Intelligent Asset Scan" : "Manual Reporting"}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] max-w-sm mx-auto uppercase tracking-wider font-bold opacity-60">
                  {isAiMode
                    ? "AI-Powered Infrastructure Diagnostic"
                    : "Direct Citizen-Lead Documentation"}
                </p>
              </div>

              {isAiMode ? (
                <AiScan file={aiFile} setFile={setAiFile} />
              ) : (
                <ReportIssue
                  formData={manualData}
                  setFormData={setManualData}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Inline Status (Replaces the larger bar for better space efficiency) */}
          <div className="mt-8 flex items-center justify-center gap-6 py-3 border-t border-slate-200/50 dark:border-slate-800/50">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1.5">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-5 h-5 rounded-full border border-white dark:border-slate-950 bg-slate-200 overflow-hidden"
                  >
                    <div className="relative w-10 h-10">
                      <Image
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${
                          i + 20
                        }`}
                        alt="User"
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                12 Active Nodes
              </p>
            </div>
            <div className="w-px h-3 bg-slate-200 dark:bg-slate-800" />
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                Verified Protocol
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Compact Floating Action */}
      <footer className="p-6 shrink-0 flex justify-end">
        <button className="w-10 h-10 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all">
          <Sparkles className="w-4 h-4" />
        </button>
      </footer>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200..800&display=swap');
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        body { 
          font-family: 'Plus Jakarta Sans', sans-serif; 
          margin: 0;
          padding: 0;
          overflow: hidden;
          height: 100vh;
        }
      `,
        }}
      />
    </div>
  );
}
