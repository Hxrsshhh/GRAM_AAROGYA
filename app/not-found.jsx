'use client'

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Home, Activity, ArrowLeft } from "lucide-react";
import MouseGlow from "@/components/ui/MouseGlow";

import Button from "@/components/ui/Button";

const NotFoundPage = () => {
  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "/";
    }
  };

  return (
    <div className="h-screen w-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white selection:bg-emerald-500/30 overflow-hidden font-sans flex flex-col">
      <MouseGlow />

      {/* Minimal Header */}
      <nav className="shrink-0 z-50 p-6 md:p-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
              <Activity className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-black tracking-tight">
              Civic<span className="text-emerald-600">Pulse</span>
            </span>
          </div>
        </div>
      </nav>

      {/* Main Content - Centered strictly within remaining height */}
      <main className="relative flex-grow flex items-center justify-center px-6 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl aspect-square bg-emerald-500/5 blur-[100px] rounded-full" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", damping: 20 }}
            className="relative inline-block mb-4 md:mb-6"
          >
            {/* Massive background text - sized responsively to fit viewport */}
            <div className="text-[clamp(8rem,25vh,18rem)] font-black leading-none tracking-tighter text-slate-100 dark:text-slate-900 select-none drop-shadow-sm">
              404
            </div>
            
            {/* Floating Icon Box */}
            <motion.div 
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-16 h-16 md:w-24 md:h-24 bg-emerald-600 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center shadow-2xl shadow-emerald-600/40 rotate-12 group">
                <Search className="text-white w-8 h-8 md:w-12 md:h-12 -rotate-12 transition-transform group-hover:scale-110" />
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-lg"
          >
            <h1 className="text-2xl md:text-5xl font-black tracking-tighter mb-3 md:mb-4">
              District Not Found.
            </h1>

            <p className="text-sm md:text-lg text-slate-500 dark:text-slate-400 mb-6 md:mb-8 font-medium leading-relaxed">
              We've scanned the urban grid, but this sector doesn't exist. 
              It may have been rerouted or scheduled for demolition.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Button className="w-full sm:w-auto text-sm md:text-base" onClick={() => window.location.href = "/"}>
                <Home size={18} />
                Return Home
              </Button>
              <Button className="w-full sm:w-auto text-sm md:text-base" variant="outline" onClick={handleBack}>
                <ArrowLeft size={18} />
                Go Back
              </Button>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer - Fixed distance from bottom */}
      <footer className="shrink-0 pb-6 md:pb-8 text-center">
        <p className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-700">
          Error Code: 0x404_CIVIC_PULSE_LOST
        </p>
      </footer>
    </div>
  );
};

export default NotFoundPage;