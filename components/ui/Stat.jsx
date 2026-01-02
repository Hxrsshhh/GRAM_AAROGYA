export const Stat = ({ icon, label, value }) => (
  <div>
    <div className="flex items-center gap-2 mb-1">
      {icon} <span className="text-2xl font-black">{value || 0}</span>
    </div>
    <p className="text-[9px] font-black uppercase opacity-70">{label}</p>
  </div>
);
