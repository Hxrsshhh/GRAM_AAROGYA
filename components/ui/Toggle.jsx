import react from "react";

export const Toggle = ({ enabled, onChange, label, description }) => (
  <div className="flex items-center justify-between py-4 px-2 group">
    <div className="flex-1 pr-4">
      <p className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors">
        {label}
      </p>
      {description && (
        <p className="text-xs text-slate-400 font-medium mt-0.5">
          {description}
        </p>
      )}
    </div>
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-500 
        ${
          enabled
            ? "bg-slate-900 dark:bg-blue-600"
            : "bg-slate-200 dark:bg-slate-800"
        }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 shadow-sm
          ${enabled ? "translate-x-6" : "translate-x-1"}`}
      />
    </button>
  </div>
);
