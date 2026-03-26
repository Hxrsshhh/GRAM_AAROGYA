"use client";

import React from "react";
import { motion } from "framer-motion";
import { RefreshCw, Activity, Home, ShieldAlert, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

// Continuity with the Profile/Settings theme background
function FloatingPaths({ position }) {
  const paths = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${380 - i * 5 * position} -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${152 - i * 5 * position} ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${684 - i * 5 * position} ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.4 + i * 0.03,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden w-full h-full opacity-20">
      <svg className="w-full h-full" viewBox="0 0 696 316" preserveAspectRatio="xMidYMid slice" fill="none">
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            className="text-blue-500/30 dark:text-white/10"
            initial={{ pathLength: 0.3, opacity: 0.4 }}
            animate={{ pathLength: 1, opacity: [0.1, 0.3, 0.1], pathOffset: [0, 1, 0] }}
            transition={{ duration: 20 + path.id * 0.5, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </svg>
    </div>
  );
}

const ErrorPage = () => {
  const router = useRouter();

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="relative h-screen w-screen bg-white dark:bg-[#030303] text-neutral-900 dark:text-white overflow-hidden font-sans flex flex-col">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <FloatingPaths position={-1} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl aspect-square bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
      </div>

      {/* Header - Matches Profile Breadcrumb Style */}
      <nav className="relative z-50 p-6 md:p-10 shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Activity className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-black tracking-tighter">
              Civic<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Pulse</span>
            </span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative grow flex items-center justify-center px-6 z-10">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", damping: 20 }}
            className="relative inline-block mb-8 md:mb-16"
          >
            {/* Background "ERROR" Text with Identity Theme Typography */}
            <div className="text-[18vw] md:text-[clamp(6rem,20vh,15rem)] font-black leading-none tracking-tighter text-neutral-100 dark:text-white/[0.02] select-none uppercase">
              Glitched
            </div>

            {/* Floating Icon Container - Matches Profile Card Style */}
            <motion.div
              animate={{
                y: [0, -12, 0],
                rotate: [12, 8, 12],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-20 h-20 md:w-32 md:h-32 bg-white dark:bg-white/5 backdrop-blur-2xl border-4 border-white dark:border-white/10 rounded-[2.5rem] flex items-center justify-center shadow-2xl rotate-12 group">
                <ShieldAlert className="text-blue-600 dark:text-blue-500 w-10 h-10 md:w-16 md:h-16 -rotate-12 transition-transform group-hover:scale-110" />
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-sm md:max-w-lg"
          >
            <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-[10px] uppercase tracking-[0.3em] mb-4">
              <Activity size={14} /> System Disruption Detected
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 text-neutral-900 dark:text-white">
              Pulse <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Interrupted.</span>
            </h1>

            <p className="text-sm md:text-base text-neutral-500 dark:text-neutral-400 mb-10 font-medium leading-relaxed px-4 md:px-0">
              Your identity synchronization was interrupted by a geospatial node timeout. 
              The administration has been notified to restore the biosphere link.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4 sm:px-0">
              <Button
                variant="primary"
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px]"
                onClick={handleReload}
              >
                <RefreshCw size={16} className="mr-2" />
                Retry Sync
              </Button>
              <Button
                variant="secondary"
                className="w-full sm:w-auto bg-white/50 dark:bg-white/5 border-neutral-200 dark:border-white/10 px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px]"
                onClick={() => router.push("/")}
              >
                <Home size={16} className="mr-2" />
                Return to Base
              </Button>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer - Matches the Terminal Style */}
      <footer className="relative z-50 shrink-0 pb-8 text-center">
        <div className="inline-flex items-center gap-3 px-6 py-2 bg-neutral-100 dark:bg-white/5 rounded-full border border-neutral-200 dark:border-white/10">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 dark:text-neutral-500">
            Node Status: 500_INTERNAL_SERVER_FAILURE
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ErrorPage;