import React from "react";

export const Card = ({ children, className = "", hover = false }) => (
  <div
    className={`bg-white  dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 transition-all duration-300 ${
      hover
        ? "hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 cursor-pointer"
        : ""
    } ${className}`}
  >
    {children}
  </div>
);
