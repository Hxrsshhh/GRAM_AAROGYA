"use client";

import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Sparkles, ArrowRight } from "lucide-react";

const translations = [
  { lang: "English", text: "Your Health, Our Priority" },
  { lang: "हिन्दी", text: "आपका स्वास्थ्य, हमारी प्राथमिकता" },
  { lang: "ગુજરાતી", text: "તમારું સ્વાસ્થ્ય, અમારી પ્રાથમિકતા" },
  { lang: "বাংলা", text: "আপনার স্বাস্থ্য, আমাদের অগ্রাধিকার" },
  { lang: "मराठी", text: "तुमचे आरोग्य, आमची प्राधान्यता" },
  { lang: "தமிழ்", text: "உங்கள் ஆரோக்கியம், எங்கள் முன்னுரிமை" },
];

function FloatingPaths({ position }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${380 - i * 5 * position} -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${152 - i * 5 * position} ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${684 - i * 5 * position} ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.5 + i * 0.03,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden w-full h-full">
      <svg
        className="w-full h-full"
        viewBox="0 0 696 316"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            initial={{ pathLength: 0.3, opacity: 0.4 }}
            animate={{
              pathLength: 1,
              opacity: [0.2, 0.5, 0.2],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 15 + path.id * 0.3,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

export default function HeroSection() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % translations.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-white dark:bg-[#030303] selection:bg-blue-500/30">
      {/* 1. Atmospheric Background Elements */}
      <div className="absolute inset-0 z-0">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
        {/* Soft Radial Gradient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 dark:bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
      </div>

      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[70%] h-[70%] bg-blue-600/10 dark:bg-blue-600/15 blur-[140px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 dark:bg-indigo-600/15 blur-[140px] rounded-full" />
      </div>

      <div className="relative z-10 container mx-auto px-6 md:px-12">
        <div className="max-w-5xl mx-auto text-center">
          {/* 2. Top Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-10 rounded-full border border-neutral-200 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span className="text-xs font-medium tracking-widest uppercase text-neutral-500 dark:text-neutral-400">
              New Standard in Rural Care
            </span>
          </motion.div>

          {/* 3. Main Heading with Animated Text */}
          <div className="h-[200px] sm:h-[280px] md:h-[320px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.h1
                key={index}
                initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                exit={{ opacity: 0, filter: "blur(10px)", y: -20 }}
                transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-tight"
              >
                <span className="inline-block text-transparent bg-clip-text bg-gradient-to-b from-neutral-950 to-neutral-700 dark:from-white dark:to-neutral-500">
                  {translations[index].text}
                </span>
              </motion.h1>
            </AnimatePresence>
          </div>

          {/* 4. Subtext / Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mt-8 mb-12 text-lg text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed"
          >
            Bridging the gap between modern technology and rural accessibility.
            Experience healthcare that understands you.
          </motion.p>

          {/* 5. Enhanced CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <Link href="/home" className="inline-block group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
              <Button
                variant="ghost"
                className="relative rounded-2xl px-10 py-8 text-lg font-medium backdrop-blur-xl bg-white/90 dark:bg-black/90 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white transition-all duration-300 group-hover:-translate-y-1 shadow-2xl"
              >
                <span className="flex items-center gap-3">
                  Discover Excellence
                  <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* 6. Bottom Fade for scrolling smoothness */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-[#030303] to-transparent pointer-events-none" />
    </div>
  );
}
