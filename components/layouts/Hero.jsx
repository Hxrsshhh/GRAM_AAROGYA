"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";
import { ArrowRight, Activity, ShieldCheck } from "lucide-react";

const translations = [
  { lang: "English", text: "AI-Powered Healthcare Support" },
  { lang: "हिन्दी", text: "एआई-पावर्ड स्वास्थ्य समर्थन" },
  { lang: "ગુજરાતી", text: "એઆઈ-સંપન્ન આરોગ્ય સહાય" },
  { lang: "বাংলা", text: "এআই-চালিত স্বাস্থ্য সহায়তা" },
  { lang: "मराठी", text: "एआय-सक्षम आरोग्य मदत" },
  { lang: "தமிழ்", text: "ஏஐ இயக்கப்படும் ஆரோக்கிய ஆதரவு" },
];

export default function Hero() {
  const [index, setIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % translations.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] w-full flex-col items-center justify-center overflow-hidden bg-white dark:bg-[#030303]/1 px-6 py-24 text-center selection:bg-blue-500/30">
      {/* 1. Subtle Background Elements for Theme Consistency */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[70%] h-[70%] bg-blue-600/10 dark:bg-blue-600/15 blur-[140px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 dark:bg-indigo-600/15 blur-[140px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto space-y-12">
        {/* 2. Top Badge - Matching the "Excellence" theme */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-200 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-md shadow-sm"
        >
          <Activity className="w-3.5 h-3.5 text-blue-500" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
            Aarogya Excellence System
          </span>
        </motion.div>

        {/* 3. Main Animated Heading - Fixed height to prevent jumpiness */}
        <div className="flex flex-col items-center justify-center">
          <div className="h-[120px] sm:h-[160px] md:h-[220px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.h1
                key={index}
                initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                exit={{ opacity: 0, filter: "blur(10px)", y: -20 }}
                transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-tight"
              >
                <span className="inline-block text-transparent bg-clip-text bg-gradient-to-b from-neutral-950 to-neutral-700 dark:from-white dark:to-neutral-500">
                  {translations[index].text}
                </span>
              </motion.h1>
            </AnimatePresence>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="mx-auto mt-10 max-w-[42rem] text-sm sm:text-lg text-neutral-500 dark:text-neutral-400 leading-relaxed font-light"
          >
            Experience instant AI-driven health intelligence. Bridge the gap
            between your symptoms and the nearest professional care.
          </motion.p>
        </div>

        {/* 4. Action Buttons - Matching the "Discover Excellence" glow style */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          {/* Primary CTA with Underglow */}
          <div className="group relative w-full sm:w-auto">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
            <Button
              size="lg"
              onClick={() => router.push("/ai-mitra")}
              className="relative w-full sm:w-auto h-14 px-8 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold transition-transform hover:-translate-y-1 active:scale-95 shadow-xl"
            >
              Check Your Health
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>

          {/* Secondary Ghost CTA */}
          <Button
            variant="ghost"
            size="lg"
            onClick={() => router.push("/nearby-doctors")}
            className="w-full sm:w-auto h-14 px-8 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-md text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/10 transition-all"
          >
            Find Nearby Doctors
          </Button>
        </motion.div>

        {/* 5. Trust Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="flex items-center justify-center gap-6 pt-10 border-t border-neutral-100 dark:border-white/5"
        >
          <div className="flex items-center gap-2 grayscale opacity-50">
            <ShieldCheck className="w-5 h-5 text-blue-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              Secure & Confidential
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
