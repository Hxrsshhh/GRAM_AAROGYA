import react from "react";

export const InputWrapper = ({ label, children, icon: Icon }) => (
  <div className="space-y-1.5 w-full">
    <div className="flex items-center gap-2 px-1">
      {Icon && (
        <Icon size={12} className="text-emerald-600 dark:text-emerald-400" />
      )}
      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
        {label}
      </label>
    </div>
    <div className="relative group">
      {children}
      <div className="absolute inset-0 border border-slate-200 dark:border-slate-700/50 rounded-xl pointer-events-none group-focus-within:border-emerald-500/50 transition-colors" />
    </div>
  </div>
);