"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Activity, Home, ShieldAlert } from "lucide-react";

const MouseGlow = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
      style={{
        background: `radial-gradient(600px at ${mousePos.x}px ${mousePos.y}px, rgba(16, 185, 129, 0.08), transparent 80%)`,
      }}
    />
  );
};

const Button = ({
  children,
  variant = "primary",
  className = "",
  ...props
}) => {
  const variants = {
    primary:
      "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/20",
    outline:
      "border border-slate-200 dark:border-slate-800 hover:border-emerald-500 text-slate-900 dark:text-white hover:bg-emerald-500/5",
  };

  return (
    <button
      className={`font-bold px-8 py-3.5 rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const ErrorPage = () => {
  const handleReload = () => {
    window.location.reload();
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

      {/* Main Content */}
      <main className="relative flex-grow flex items-center justify-center px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl aspect-square bg-red-500/5 dark:bg-emerald-500/5 blur-[100px] rounded-full" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", damping: 20 }}
            className="relative inline-block mb-4 md:mb-8"
          >
            {/* Background Text */}
            <div className="text-[clamp(6rem,20vh,15rem)] font-black leading-none tracking-tighter text-slate-100 dark:text-slate-900 select-none drop-shadow-sm uppercase">
              Error
            </div>

            {/* Floating Icon Box */}
            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: [12, 10, 12],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-20 h-20 md:w-28 md:h-28 bg-emerald-600 rounded-[1.5rem] md:rounded-[2.2rem] flex items-center justify-center shadow-2xl shadow-emerald-600/40 rotate-12 group">
                <ShieldAlert className="text-white w-10 h-10 md:w-14 md:h-14 -rotate-12 transition-transform group-hover:scale-110" />
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
              System Disruption.
            </h1>

            <p className="text-sm md:text-lg text-slate-500 dark:text-slate-400 mb-6 md:mb-8 font-medium leading-relaxed">
              Our civic infrastructure encountered an unexpected glitch. The
              administration has been notified and is currently investigating
              the pulse.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Button
                className="w-full sm:w-auto text-sm md:text-base"
                onClick={handleReload}
              >
                <RefreshCw size={18} />
                Retry Connection
              </Button>
              <Button
                className="w-full sm:w-auto text-sm md:text-base"
                variant="outline"
                onClick={() => (window.location.href = "/")}
              >
                <Home size={18} />
                Return to Base
              </Button>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="shrink-0 pb-6 md:pb-8 text-center">
        <p className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-700">
          Status: 500_INTERNAL_SERVER_FAILURE
        </p>
      </footer>
    </div>
  );
};

export default ErrorPage;
