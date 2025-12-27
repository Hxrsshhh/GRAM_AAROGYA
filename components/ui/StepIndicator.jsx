import { CheckCircle2 } from "lucide-react";
import react from "react";

export const StepIndicator = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex items-center justify-between mb-8">
      {[1, 2, 3].map((s) => (
        <div key={s} className="flex flex-col items-center flex-1 relative">
          <div
            className={`z-10 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 border-2 ${
              s < currentStep
                ? "bg-emerald-600 border-emerald-600 text-white"
                : s === currentStep
                ? "bg-white dark:bg-slate-900 border-emerald-500 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400"
            }`}
          >
            {s < currentStep ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <span className="font-black text-sm">{s}</span>
            )}
          </div>
          <span
            className={`mt-2 text-[10px] font-black uppercase tracking-widest ${
              s === currentStep ? "text-emerald-500" : "text-slate-400"
            }`}
          >
            {s === 1 ? "Category" : s === 2 ? "Details" : "Evidence"}
          </span>
          {s < totalSteps && (
            <div
              className={`absolute top-5 left-[60%] w-[80%] h-0.5 transition-colors duration-500 ${
                s < currentStep
                  ? "bg-emerald-600"
                  : "bg-slate-200 dark:bg-slate-800"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};
