import { motion } from "framer-motion";
import React from "react";
import { DashboardCard } from "../ui/DashboardCard";
import { ZapOff } from "lucide-react";
import Button from "../ui/Button";

const ErrorHandle = () => {
  return (
    <div className="py-24 px-6 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <DashboardCard className="border-red-500/20 bg-red-500/20 backdrop-blur-xl text-center p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-red-500/50 to-transparent" />

          <div className="relative mb-6 flex justify-center">
            <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full" />
            <div className="relative p-5 bg-white dark:bg-slate-900 rounded-3xl border border-red-500/20 shadow-2xl">
              <ZapOff className="w-10 h-10 text-red-500" />
            </div>
          </div>

          <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-3">
            Terminal <span className="text-red-500">Offline</span>
          </h2>

          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
            The neural link to the central pulse was severed. <br />
            Internal Error Code:{" "}
            <span className="text-red-500/80 font-mono">500_LINK_FAILURE</span>
          </p>

          <div className="flex flex-col gap-3">
            <Button
              onClick={() => window.location.reload()}
              className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-950 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-slate-900/10"
            >
              Re-Initialize Neural Link
            </Button>

            <button
              onClick={() => {
                import("next-auth/react").then((mod) =>
                  mod.signOut({ callbackUrl: "/login" })
                );
              }}
              className="w-full py-3 text-slate-400 hover:text-red-500 font-black text-[9px] uppercase tracking-[0.25em] transition-colors"
            >
              ← Terminate Session & Exit
            </button>
          </div>
        </DashboardCard>
      </motion.div>
    </div>
  );
};

export default ErrorHandle;
