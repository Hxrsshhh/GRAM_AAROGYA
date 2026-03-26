"use client";

import { motion } from "framer-motion";
import { HeartPulse, Languages, MapPin, Stethoscope, Sparkles } from "lucide-react";

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
    <section className="relative  px-6 py-24 sm:py-32 overflow-hidden bg-white dark:bg-[#030303] w-screen">
      
      {/* Background Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-500/5 dark:bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

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
          Empowering communities with AI-driven medical solutions, multilingual accessibility, and instant specialist connectivity.
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
            whileHover={{ y: -5 }}
            className="group relative overflow-hidden rounded-3xl border border-neutral-200 dark:border-white/10 bg-white/50 dark:bg-white/5 p-8 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:bg-white/[0.08]"
          >
            {/* Hover Gradient Glow */}
            <div className="absolute -inset-px bg-gradient-to-br from-blue-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10 flex flex-col gap-4">
              <div className={`p-3 rounded-2xl bg-neutral-100 dark:bg-white/5 w-fit transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 ${feature.color}`}>
                <feature.icon size={28} strokeWidth={1.5} />
              </div>
              
              <div className="space-y-2">
                <h3 className="font-bold text-xl tracking-tight text-neutral-900 dark:text-white">
                  {feature.name}
                </h3>
                <p className="text-sm leading-relaxed text-neutral-500 dark:text-neutral-400 font-light">
                  {feature.description}
                </p>
              </div>
            </div>
            
            {/* Subtle corner accent */}
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-20 transition-opacity">
               <feature.icon size={64} strokeWidth={1} />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}