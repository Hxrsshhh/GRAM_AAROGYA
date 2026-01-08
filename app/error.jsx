"use client";

import { motion } from "framer-motion";
import { RefreshCw, Activity, Home, ShieldAlert } from "lucide-react";
import MouseGlow from "@/components/ui/MouseGlow";
import Button from "@/components/ui/Button";

const ErrorPage = () => {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="h-screen w-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white selection:bg-emerald-500/30 overflow-hidden font-sans flex flex-col">
      <MouseGlow />

      {/* Header - Scaled padding for mobile */}
      <nav className="shrink-0 z-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-emerald-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
              <Activity className="text-white w-4 h-4 md:w-5 md:h-5" />
            </div>
            <span className="text-lg md:text-xl font-black tracking-tight">
              Civic<span className="text-emerald-600">Pulse</span>
            </span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative grow flex items-center justify-center px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm md:max-w-2xl aspect-square bg-emerald-500/10 blur-[80px] md:blur-[120px] rounded-full" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", damping: 20 }}
            className="relative inline-block mb-4 md:mb-12"
          >
            <div className="text-[18vw] md:text-[clamp(6rem,20vh,15rem)] font-black leading-none tracking-tighter text-slate-100 dark:text-slate-900/50 select-none drop-shadow-sm uppercase">
              Error
            </div>

            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: [12, 10, 12],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 bg-emerald-600 rounded-2xl md:rounded-[2.2rem] flex items-center justify-center shadow-2xl shadow-emerald-600/40 rotate-12 group">
                <ShieldAlert className="text-white w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 -rotate-12 transition-transform group-hover:scale-110" />
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-sm md:max-w-lg"
          >
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter mb-3 md:mb-4">
              System Disruption.
            </h1>

            <p className="text-sm md:text-lg text-slate-500 dark:text-slate-400 mb-8 font-medium leading-relaxed px-4 md:px-0">
              Our civic infrastructure encountered an unexpected glitch. The
              administration has been notified and is investigating the pulse.
            </p>

            {/* Stacked on mobile, side-by-side on tablet (sm) and up */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center px-4 sm:px-0">
              <button
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition-all text-sm md:text-base"
                onClick={handleReload}
              >
                <RefreshCw size={18} />
                Retry Connection
              </button>
              <button
                className="w-full sm:w-auto flex items-center justify-center gap-2 border-2 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 px-6 py-3 rounded-xl font-bold transition-all text-sm md:text-base"
                onClick={() => (window.location.href = "/")}
              >
                <Home size={18} />
                Return to Base
              </button>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer - Smaller text on mobile */}
      <footer className="shrink-0 pb-6 md:pb-8 text-center">
        <p className="text-[8px] md:text-[11px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-slate-400 dark:text-slate-700">
          Status: 500_INTERNAL_SERVER_FAILURE
        </p>
      </footer>
    </div>
  );
};

export default ErrorPage;
