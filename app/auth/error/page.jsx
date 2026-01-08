"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldAlert, ArrowLeft, Activity, Home, UserX } from "lucide-react";
import Link from "next/link";
import MouseGlow from "@/components/ui/MouseGlow";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const isBlocked = error === "ACCESS_DENIED_BLOCKED";
  const isDeleted = error === "USER_DELETED";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md z-10"
    >
      <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-[2.5rem] p-8 md:p-12 shadow-2xl text-center">
        <div className="flex justify-center mb-6">
          <div
            className={`p-4 rounded-2xl ${
              isBlocked || isDeleted ? "bg-rose-500/10" : "bg-emerald-500/10"
            }`}
          >
            {isDeleted ? (
              <UserX size={48} className="text-rose-600" />
            ) : (
              <ShieldAlert
                size={48}
                className={isBlocked ? "text-rose-600" : "text-emerald-600"}
              />
            )}
          </div>
        </div>

        {/* TITLE */}
        <h1 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white mb-4">
          {isDeleted
            ? "Account Removed"
            : isBlocked
            ? "Access Revoked"
            : "Auth Error"}
        </h1>

        {/* DESCRIPTION */}
        <p className="text-slate-500 dark:text-slate-400 font-medium mb-8 leading-relaxed">
          {isDeleted
            ? "Your account and all associated data have been permanently removed from the Pulse network as requested."
            : isBlocked
            ? "Your account has been blocked by an administrator for violating community guidelines. Access is restricted."
            : "An unexpected error occurred during authentication. Please try again or contact support."}
        </p>

        {/* ACTIONS */}
        <div className="space-y-4">
          <Link href="/signup" className="block">
            <button className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20">
              <ArrowLeft size={16} />{" "}
              {isDeleted ? "Create New Account" : "Back to Sign In"}
            </button>
          </Link>

          <Link href="/" className="block">
            <button className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2">
              <Home size={16} /> Home Page
            </button>
          </Link>
        </div>
      </div>

      <div className="mt-8 flex justify-center items-center gap-2 opacity-50">
        <Activity size={16} className="text-emerald-600" />
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
          CivicPulse Security
        </span>
      </div>
    </motion.div>
  );
}

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen relative w-full overflow-hidden bg-white dark:bg-slate-950 flex items-center justify-center px-6">
      <MouseGlow />
      <Suspense
        fallback={
          <div className="flex flex-col items-center gap-4 z-10">
            <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
            <p className="font-black text-[10px] uppercase tracking-widest text-emerald-600">
              Verifying Identity...
            </p>
          </div>
        }
      >
        <ErrorContent />
      </Suspense>
    </div>
  );
}
