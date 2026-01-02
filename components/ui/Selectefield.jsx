import react from "react";

export const SelectField = ({ label, value, options, onChange }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[8px] font-black uppercase text-slate-400 tracking-widest">
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-xs font-bold px-3 py-1 outline-none"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  </div>
);
