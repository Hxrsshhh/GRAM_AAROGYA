import react from "react";

export const Badge = ({ children, variant = "pending" }) => {
  const styles = {
    pending:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    "in-progress":
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    resolved:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    rejected:
      "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800",
  };
  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
        styles[variant] || styles.pending
      }`}
    >
      {children}
    </span>
  );
};
