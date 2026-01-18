"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import {
  User,
  Activity,
  Cpu,
  ExternalLink,
  ChevronRight,
  Sun,
  Moon,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";
import VideoPlayer from "@/components/layouts/VideoPlayer";
import { useRouter } from "next/navigation";

export default function App() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white selection:bg-emerald-500/30 transition-colors duration-500">
      <div className="fixed top-6 left-6 z-50">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -4 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.back()}
          className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-slate-200 dark:border-white/10 hover:border-emerald-500/50 transition-all shadow-lg shadow-slate-200/20 dark:shadow-none"
        >
          <ArrowLeft size={16} className="text-slate-600 dark:text-slate-400 group-hover:text-emerald-500 transition-colors" />
          <span className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400 group-hover:text-emerald-500 transition-colors">
            Back
          </span>
        </motion.button>
      </div>

      {/* Dynamic Background Ambience */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Dark Mode Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100%] h-[50%] bg-emerald-500/10 blur-[120px] rounded-full opacity-0 dark:opacity-100 transition-opacity duration-700" />

        {/* Light Mode Glow */}
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-emerald-200/40 blur-[100px] rounded-full opacity-100 dark:opacity-0 transition-opacity duration-700" />

        {/* Grainy Texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay dark:invert-0 invert" />
      </div>

      {/* Theme Switcher Header */}

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-18 pb-32">
        {/* Refined Hero */}
        <div className="max-w-4xl mb-32">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-10"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <Activity size={20} />
            </div>
            <span className="text-sm font-bold tracking-[0.3em] uppercase text-emerald-600 dark:text-emerald-500">
              CivicPulse Console
            </span>
          </motion.div>

          <div className="max-w-4xl">
            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-6xl md:text-8xl font-extrabold tracking-tighter leading-none mb-10 text-slate-900 dark:text-white"
            >
              Real-time support <br />
              <span className="relative inline-block text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                & knowledge resources
                <motion.span
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.8, duration: 1 }}
                  className="absolute bottom-2 left-0 h-[4px] bg-emerald-500/20"
                />
              </span>
              <span className="block text-slate-500 dark:text-slate-400 text-4xl md:text-6xl mt-4">
                for critical city systems.
              </span>
            </motion.h1>
          </div>

          <p className="text-xl font-medium text-slate-500 dark:text-slate-400 max-w-2xl mb-12 leading-relaxed">
            Real-time support and knowledge resources designed to keep critical
            city systems running smoothly.
          </p>

          <div className="flex flex-wrap gap-5">
            <button className="px-8 py-5 bg-emerald-500 text-white dark:text-slate-950 rounded-2xl font-bold text-sm hover:bg-emerald-600 dark:hover:bg-emerald-400 transition-all flex items-center gap-3 shadow-xl shadow-emerald-500/20">
              Open Support Ticket <ChevronRight size={18} />
            </button>
            <button className="px-8 py-5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white rounded-2xl font-bold text-sm hover:bg-slate-200 dark:hover:bg-white/10 transition-all backdrop-blur-md">
              Technical Docs
            </button>
          </div>
        </div>

        {/* Video Grid Header */}
        <div className="flex items-end justify-between mb-12 border-b border-slate-200 dark:border-white/5 pb-8 ">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">
              Technical Masterclasses
            </h2>
            <p className="text-slate-500 font-medium">
              Step-by-step implementation guides for city-wide deployments.
            </p>
          </div>
          <div className="hidden md:block text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">
            Last updated: Jan 2026
          </div>
        </div>

        {/* Video List */}
        <div className="max-w-5xl mx-auto space-y-12 mb-40">
          <div className="rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-white/10 bg-white dark:bg-transparent shadow-2xl shadow-slate-200/50 dark:shadow-none transition-shadow">
            <VideoPlayer
              title="Operational User Workflow"
              description="Implementing zero-knowledge residency checks"
              src="https://res.cloudinary.com/dljnbvomg/video/upload/v1768728672/UserFlow1_1_1_et2vt9.mp4"
              icon={User}
            />
          </div>
          <div className="rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-white/10 bg-white dark:bg-transparent shadow-2xl shadow-slate-200/50 dark:shadow-none transition-shadow">
            <VideoPlayer
              title="Autonomous Logistics Operations"
              description="Routing and node management overview"
              src="https://res.cloudinary.com/dljnbvomg/video/upload/v1768727984/AdminFlow_d6e0u0.mp4"
              icon={Cpu}
            />
          </div>
        </div>

        {/* Call to Action Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="relative rounded-[3rem] bg-gradient-to-br from-emerald-500 to-emerald-800 p-[1px]"
        >
          <div className="bg-white dark:bg-slate-950 rounded-[2.9rem] p-12 md:p-24 flex flex-col md:flex-row items-center justify-between gap-12 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-3xl -mr-32 -mt-32" />

            <div className="max-w-xl text-center md:text-left relative z-10">
              <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-6">
                Need a custom <br />
                <span className="text-emerald-500">onboarding?</span>
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-lg mb-0 font-medium">
                Schedule a dedicated session with our infrastructure architects
                for city-specific configuration.
              </p>
            </div>

            <div className="flex flex-col gap-4 w-full md:w-auto shrink-0 relative z-10">
              <button className="px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-950 rounded-2xl font-bold text-sm tracking-tight hover:scale-105 transition-all shadow-xl">
                Book a Briefing
              </button>
              <button className="px-10 py-5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-3 hover:bg-slate-200 dark:hover:bg-white/10 transition-all">
                Community Slack <ExternalLink size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      </main>

      <footer className="py-20 px-6 border-t border-slate-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-md bg-emerald-500 flex items-center justify-center text-[10px] font-bold text-white dark:text-slate-950">
              CP
            </div>
            <span className="text-sm font-bold tracking-tight text-slate-500 dark:text-slate-300">
              CivicPulse Infrastructure
            </span>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600 mb-1">
                Network Status
              </span>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-500">
                  All Systems Online
                </span>
              </div>
            </div>
            <div className="w-[1px] h-8 bg-slate-200 dark:bg-white/5" />
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest italic">
              Encrypted Connection
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
