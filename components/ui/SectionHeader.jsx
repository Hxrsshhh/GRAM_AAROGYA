import react from "react";

export const SectionHeader = ({
  icon: Icon,
  title,
  description,
  colorClass = "text-blue-600 dark:text-blue-500",
}) => (
  <div className="flex items-center gap-4 mb-8">
    <div
      className={`p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 ${colorClass}`}
    >
      <Icon size={20} />
    </div>
    <div>
      <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
        {title}
      </h2>
      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
        {description}
      </p>
    </div>
  </div>
);
