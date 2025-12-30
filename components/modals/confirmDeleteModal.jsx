"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

export default function ConfirmDeleteModal({
  open,
  onClose,
  onConfirm,
  loading = false,
}) {
  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4"
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-red-500/10 text-red-600">
                <AlertTriangle size={20} />
              </div>
              <h2 className="text-lg font-black">Delete Account</h2>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Are you sure you want to delete your account?
            </p>

            <p className="text-sm text-red-600 font-semibold">
              This action is permanent and cannot be undone.
            </p>
          </div>

          {/* Actions */}
          <div className="p-6 pt-0 flex gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-800 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              Cancel
            </button>

            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition disabled:opacity-60"
            >
              {loading ? "Deleting..." : "Yes, Delete"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
