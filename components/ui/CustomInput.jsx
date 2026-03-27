import react from "react";

export const CustomInput = ({ label, icon: Icon, rightElement, ...props }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 pl-1">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
        <Icon size={18} />
      </div>
      <input
        className="w-full bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-11 pr-12 text-slate-900 dark:text-white font-semibold outline-none focus:border-blue-500 transition-all text-sm"
        {...props}
      />
      {rightElement && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          {rightElement}
        </div>
      )}
    </div>
  </div>
);
