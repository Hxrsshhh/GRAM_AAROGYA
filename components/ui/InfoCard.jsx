export const InfoCard = ({ icon, label, value, color }) => (
  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
    <div className={`flex items-center gap-2 ${color} mb-1`}>
      {icon} <span className="text-[10px] font-black uppercase">{label}</span>
    </div>
    <p className="text-xs font-bold">{value || "N/A"}</p>
  </div>
);
