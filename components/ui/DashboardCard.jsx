import react from "react";

export const DashboardCard = ({ children, className = "" }) => (
  <div
    className={`bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 shadow-xl shadow-blue-500/5 ${className}`}
  >
    {children}
  </div>
);
