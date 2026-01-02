import react from "react";

export const ToggleButton = ({
  label,
  active,
  onClick,
  ActiveIcon,
  InactiveIcon,
  activeClass,
}) => (
  <div className="flex flex-col items-center gap-2">
    <button
      onClick={onClick}
      className={`p-4 rounded-2xl border-2 transition-all ${
        active
          ? activeClass
          : "border-slate-200 dark:border-slate-800 text-slate-300 hover:border-slate-400"
      }`}
    >
      {active ? <ActiveIcon size={24} /> : <InactiveIcon size={24} />}
    </button>
    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
      {label}
    </span>
  </div>
);
