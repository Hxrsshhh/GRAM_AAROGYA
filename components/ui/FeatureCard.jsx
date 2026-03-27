"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const FeatureCard = ({ icon: Icon, title, description, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group relative p-10 rounded-[3rem] bg-slate-50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 hover:border-blue-500/50 transition-all duration-500 overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] dark:opacity-[0.05] group-hover:opacity-10 group-hover:scale-150 transition-all duration-700">
        <Icon className="w-32 h-32" />
      </div>

      <div className="relative z-10">
        <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-xl border border-slate-100 dark:border-slate-700 mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 rotate-[-5deg] group-hover:rotate-0">
          <Icon className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 flex items-center gap-3">
          {title}
          <ArrowUpRight className="w-5 h-5 opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all text-blue-500" />
        </h3>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

export default FeatureCard;
