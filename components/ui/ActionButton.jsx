import { ChevronRight } from "lucide-react";
import react from "react";


export const ActionButton = ({ children, icon: Icon, variant = "default" }) => {
  const styles = {
    default: "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700",
    danger: "text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 border-rose-100 dark:border-rose-900/30"
  };
  
  return (
    <button className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all group font-bold text-sm ${styles[variant]}`}>
      <div className="flex items-center gap-3">
        {Icon && <Icon size={18} className="opacity-70 group-hover:opacity-100" />}
        {children}
      </div>
      <ChevronRight size={16} className="opacity-30 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
    </button>
  );
};
