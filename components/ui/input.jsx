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
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}
        <input
          className={`input-field ${leftIcon ? "pl-10" : ""} ${
            rightIcon ? "pr-10" : ""
          } ${error ? "border-red-500 focus:ring-red-500" : ""} ${className}`}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export const InputField = ({ label, leftIcon, disabled, ...props }) => (
  <div className="w-full space-y-2">
    {label && (
      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
        {label}
      </label>
    )}
    <div className="relative group">
      {leftIcon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 dark:group-focus-within:text-emerald-500 transition-colors">
          {React.cloneElement(leftIcon, { size: 18 })}
        </div>
      )}
      <input
        disabled={disabled}
        className={`w-full bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:border-slate-900 dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 rounded-xl py-3 px-4 outline-none transition-all ${
          leftIcon ? "pl-12" : ""
        } ${disabled ? "cursor-not-allowed opacity-75" : ""}`}
        {...props}
      />
    </div>
  </div>
);
