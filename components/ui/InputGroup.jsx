
export const InputGroup = ({ label, icon: Icon, placeholder, value, onChange, type = "text" }) => (
  <div className="mb-6">
    <label className="block text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
        <Icon size={18} />
      </div>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all font-medium text-slate-900 dark:text-white"
      />
    </div>
  </div>
);