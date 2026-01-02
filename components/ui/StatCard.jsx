import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import react from "react";
import { motion } from "framer-motion";

export const StatCard = ({
  title,
  value,
  change,
  isPositive,
  icon: Icon,
  colorClass,
  index,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="relative group overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-500"
  >
    <div
      className={`absolute top-0 right-0 w-24 h-24 blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity rounded-full ${colorClass}`}
    />

    <div className="flex justify-between items-start relative z-10">
      <div
        className={`p-3 rounded-2xl ${colorClass.replace(
          "bg-",
          "bg-"
        )}/10 text-slate-700 dark:text-white`}
      >
        <Icon size={24} />
      </div>
      <div
        className={`flex items-center gap-1 text-xs font-black ${
          isPositive ? "text-emerald-500" : "text-rose-500"
        }`}
      >
        {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {change}
      </div>
    </div>

    <div className="mt-4 relative z-10">
      <h3 className="text-3xl font-black tracking-tighter dark:text-white">
        {value}
      </h3>
      <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mt-1">
        {title}
      </p>
    </div>
  </motion.div>
);
