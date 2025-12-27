'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ArrowRight, Loader2 } from 'lucide-react'

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  isLoading = false,
  disabled,
  ...props   // ✅ safe props only
}) => {
  const variants = {
    primary:
      "bg-emerald-600 text-white hover:bg-emerald-500 shadow-[0_20px_40px_-15px_rgba(16,185,129,0.5)] dark:shadow-[0_20px_40px_-20px_rgba(16,185,129,0.3)]",
    secondary:
      "bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 hover:border-emerald-500/50",
    outline:
      "border-2 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-emerald-500 hover:text-emerald-600 dark:hover:border-emerald-400 dark:hover:text-emerald-400 backdrop-blur-md",
    glass:
      "bg-white/10 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white hover:bg-white/20 dark:hover:bg-slate-800/60",
      danger:
      "bg-red dark:bg-red-500/40 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 text-slate-900 dark:text-white hover:bg-red/20 dark:hover:bg-red-800/60",
  }

  const sizes = {
    sm: "px-6 py-2.5 text-sm",
    md: "px-8 py-4 text-base",
    lg: "px-10 py-5 text-lg",
  }

  return (
    <motion.button
      type="button"
      whileHover={!isLoading ? { scale: 1.02 } : undefined}
      whileTap={!isLoading ? { scale: 0.98 } : undefined}
      disabled={isLoading || disabled}
      className={cn(
        "relative inline-flex items-center justify-center font-black tracking-tight transition-all duration-300 rounded-[1.25rem] focus:outline-none overflow-hidden group",
        variants[variant],
        sizes[size],
        (isLoading || disabled) && "opacity-60 cursor-not-allowed",
        className
      )}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">
        {isLoading && (
          <Loader2 className="w-4 h-4 animate-spin" />
        )}
        {children}
      </span>

      {!isLoading && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      )}
    </motion.button>
  )
}

export default Button
