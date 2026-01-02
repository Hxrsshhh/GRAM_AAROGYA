"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trash2, X, AlertOctagon, Info } from "lucide-react";

export default function ConfirmIssueDeleteModal({
  open,
  onClose,
  onConfirm,
  loading = false,
  issueTitle = "this issue",
}) {
  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-md flex items-center justify-center px-4"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          className="w-full max-w-[400px] bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        >
          {/* TOP DECORATIVE BAR */}
          <div className="h-1.5 w-full bg-rose-500" />

          {/* HEADER */}
          <div className="p-6 pb-0 flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500">
              <AlertOctagon size={28} />
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* CONTENT */}
          <div className="p-8 pt-6">
            <h2 className="text-xl font-black tracking-tight mb-2">
              Confirm Purge
            </h2>
            <p className="text-[13px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-6">
              You are about to permanently remove{" "}
              <span className="text-slate-900 dark:text-white font-bold underline decoration-rose-500/30">
                "{issueTitle}"
              </span>{" "}
              from the node cluster. This action cannot be synchronized back.
            </p>

            <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 mb-8">
              <Info size={16} className="text-blue-500 flex-shrink-0" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Data will be erased from all shards
              </p>
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col gap-3">
              <button
                onClick={onConfirm}
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-lg shadow-rose-600/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  "Executing Purge..."
                ) : (
                  <>
                    <Trash2 size={16} /> Purge Record
                  </>
                )}
              </button>

              <button
                onClick={onClose}
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 text-[11px] font-black uppercase tracking-[0.2em] transition-all"
              >
                Aborted Request
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
