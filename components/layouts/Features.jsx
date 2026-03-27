"use client";

import { motion } from "framer-motion";
import {
  HeartPulse,
  Languages,
  MapPin,
  Stethoscope,
  Sparkles,
} from "lucide-react";

const features = [
  {
    name: "AI-Powered Assistance",
    description:
      "Advanced neural networks analyze symptoms in seconds, providing a clear path toward professional diagnosis.",
    icon: HeartPulse,
    color: "text-blue-500",
  },
  {
    name: "Multilingual Support",
    description:
      "Bridging the communication gap with real-time translation in over 6 Indian regional languages.",
    icon: Languages,
    color: "text-emerald-500",
  },
  {
    name: "Precision Matching",
    description:
      "Smart geolocation to find specialized facilities tailored to your specific medical requirements.",
    icon: MapPin,
    color: "text-cyan-500",
  },
  {
    name: "Seamless Connection",
    description:
      "Direct, secure encrypted channels for instant consultation with verified healthcare professionals.",
    icon: Stethoscope,
    color: "text-indigo-500",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

export default function Features() {
  return (
    <section className="relative  px-6 py-24 sm:py-32 overflow-hidden bg-white dark:bg-[#030303]/1 w-screen">
      {/* Background Accent */}

      <div className="relative z-10 mx-auto max-w-[64rem] text-center mb-20">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-neutral-200 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-md"
        >
          <Sparkles className="w-3 h-3 text-blue-500" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
            Core Technologies
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, tracking: "-0.05em" }}
          whileInView={{ opacity: 1, tracking: "-0.02em" }}
          viewport={{ once: true }}
          className="font-bold text-4xl sm:text-5xl md:text-6xl tracking-tighter bg-gradient-to-b from-neutral-950 to-neutral-600 dark:from-white dark:to-neutral-500 bg-clip-text text-transparent"
        >
          Revolutionizing Rural Healthcare
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-neutral-500 dark:text-neutral-400 max-w-[42rem] mx-auto text-lg font-light leading-relaxed"
        >
          Empowering communities with AI-driven medical solutions, multilingual
          accessibility, and instant specialist connectivity.
        </motion.p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mx-auto grid max-w-5xl grid-cols-1 sm:grid-cols-2 gap-6"
      >
        {features.map((feature) => (
          <motion.div
            key={feature.name}
            variants={itemVariants}
            whileHover={{ y: -8, scale: 1.02 }}
            className="group relative overflow-hidden rounded-[2.5rem] border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] p-1 backdrop-blur-3xl transition-all duration-500 hover:shadow-[0_32px_64px_-15px_rgba(59,130,246,0.2)]"
          >
            {/* Inner Container to maintain padding and style consistency */}
            <div className="relative h-full w-full rounded-[2.3rem] bg-slate-50 dark:bg-black/40 p-8 border border-slate-100 dark:border-white/5 overflow-hidden">
              {/* Animated Radial Background Glow on Hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[radial-gradient(circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(59,130,246,0.15),transparent_70%)] pointer-events-none" />

              {/* Top-Right Accent Light */}
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-blue-500/10 blur-3xl rounded-full group-hover:bg-blue-500/20 transition-colors" />

              <div className="relative z-10 flex flex-col gap-6">
                {/* Icon Wrapper with Glass Effect */}
                <div
                  className={`relative p-4 rounded-2xl w-fit transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm group-hover:shadow-blue-500/20 ${feature.color}`}
                >
                  <feature.icon
                    size={28}
                    strokeWidth={1.5}
                    className="relative z-10"
                  />
                  {/* Subtle Icon Glow */}
                  <div className="absolute inset-0 bg-blue-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="space-y-3">
                  {/* Indicator Pill */}
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                      Active Protocol
                    </span>
                  </div>

                  <h3 className="font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white">
                    {feature.name}
                  </h3>

                  <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400 font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                    {feature.description}
                  </p>
                </div>
              </div>

              {/* The Large Background Watermark Icon */}
              <div className="absolute -bottom-6 -right-6 text-slate-200 dark:text-white/[0.02] transform -rotate-12 transition-all duration-700 group-hover:scale-125 group-hover:rotate-0 group-hover:text-blue-500/[0.05]">
                <feature.icon size={140} strokeWidth={0.5} />
              </div>

              {/* Interactive Border Beam (Optional) */}
              <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent group-hover:w-full transition-all duration-1000" />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
