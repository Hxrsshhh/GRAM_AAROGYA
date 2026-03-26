import React from "react";

export const Input = ({
  label,
  error,
  leftIcon,
  rightIcon,
  className = "",
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-2 ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        {leftIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-blue-500 transition-colors">
            {React.cloneElement(leftIcon, { size: 18 })}
          </div>
        )}
        <input
          className={`w-full bg-white/50 dark:bg-white/[0.03] backdrop-blur-md border border-neutral-200 dark:border-white/10 
          focus:border-blue-500/50 focus:bg-white dark:focus:bg-black/40 rounded-2xl py-3 px-4 outline-none transition-all duration-300
          text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 text-sm font-medium
          ${leftIcon ? "pl-12" : ""} 
          ${rightIcon ? "pr-12" : ""} 
          ${error ? "border-red-500/50 ring-2 ring-red-500/10" : ""} 
          ${className}`}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-blue-500 transition-colors">
            {React.cloneElement(rightIcon, { size: 18 })}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-2 text-[10px] font-bold text-red-500 uppercase tracking-wider ml-1">
          {error}
        </p>
      )}
    </div>
  );
};

export const InputField = ({ label, leftIcon, disabled, className = "", ...props }) => (
  <div className="w-full space-y-2">
    {label && (
      <label className="block text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-[0.2em] ml-1">
        {label}
      </label>
    )}
    <div className="relative group">
      {leftIcon && (
        <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300
          ${disabled ? "text-neutral-400" : "text-neutral-400 group-focus-within:text-blue-500"}
        `}>
          {React.cloneElement(leftIcon, { size: 18 })}
        </div>
      )}
      <input
        disabled={disabled}
        className={`w-full text-sm font-medium transition-all duration-300 outline-none
          bg-white/50 dark:bg-white/[0.02] backdrop-blur-xl border rounded-[1.25rem] py-3.5 px-4
          ${leftIcon ? "pl-12" : "px-6"}
          ${disabled 
            ? "border-transparent cursor-not-allowed text-neutral-500 dark:text-neutral-400/60 bg-neutral-100/50 dark:bg-white/[0.01]" 
            : "border-neutral-200 dark:border-white/10 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 dark:focus:bg-neutral-900/80 text-neutral-900 dark:text-white"
          } ${className}`}
        {...props}
      />
    </div>
  </div>
);