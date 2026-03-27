"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Lock,
  Shield,
  Palette,
  Globe,
  Smartphone,
  Info,
  Moon,
  Sun,
  Eye,
  Key,
  Trash2,
  AlertTriangle,
  HeartPulse,
} from "lucide-react";

import { SettingsCard as Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Toggle } from "@/components/ui/Toggle";
import { ActionButton } from "@/components/ui/ActionButton";
import { useTheme } from "next-themes";

import ConfirmDeleteModal from "@/components/modals/confirmDeleteModal";
import { deleteUserAccount } from "@/lib/api/user";
import { signOut } from "next-auth/react";

// Reusing FloatingPaths for visual continuity
function FloatingPaths({ position }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${380 - i * 5 * position} -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${152 - i * 5 * position} ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${684 - i * 5 * position} ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.5 + i * 0.03,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden w-full h-full opacity-30">
      <svg className="w-full h-full" viewBox="0 0 696 316" preserveAspectRatio="xMidYMid slice" fill="none">
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            className="text-blue-500/20 dark:text-white/10"
            initial={{ pathLength: 0.3, opacity: 0.4 }}
            animate={{ pathLength: 1, opacity: [0.2, 0.5, 0.2], pathOffset: [0, 1, 0] }}
            transition={{ duration: 15 + path.id * 0.3, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </svg>
    </div>
  );
}

export default function Settings() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    updates: true,
  });

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { setTheme, resolvedTheme } = useTheme();

  const toggleTheme = () =>
    setTheme(resolvedTheme === "dark" ? "light" : "dark");

  const handleDelete = async () => {
    try {
      setLoading(true);
      localStorage.setItem("AccountDeleted", "true");
      await deleteUserAccount();
      await signOut({ callbackUrl: "/" });
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-white dark:bg-[#030303] py-12 selection:bg-blue-500/30 overflow-hidde ">
      {/* Background Decor */}

       <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[70%] h-[70%] bg-blue-600/10 dark:bg-blue-600/15 blur-[140px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 dark:bg-indigo-600/15 blur-[140px] rounded-full" />
      </div>

      <div className="relative z-10  max-w-4xl mx-auto px-6">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12 mt-14 flex flex-col md:flex-row md:items-end justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-[0.2em] mb-2 mt-4">
              <Globe size={14} /> Global Preferences
            </div>
            <h1 className="text-5xl font-bold text-neutral-950 dark:text-white tracking-tighter">
              Control{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                Center
              </span>
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 mt-3 font-medium text-lg">
              Manage your secure health environment and synchronization.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-white/5 backdrop-blur-md border border-neutral-200 dark:border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-neutral-400">
            <Info size={14} className="text-blue-500" /> Biometric Sync Active
          </div>
        </motion.div>

        <div className="space-y-6">
          {/* Interface Aesthetics */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="p-8 bg-white/70 dark:bg-white/[0.02] backdrop-blur-2xl border-neutral-200 dark:border-white/10 rounded-[2rem] shadow-xl shadow-blue-500/5">
              <SectionHeader
                icon={Palette}
                title="Interface Aesthetics"
                description="Customizing your visual care workspace"
                colorClass="text-blue-500"
              />

              <div className="bg-neutral-50/50 dark:bg-black/20 rounded-2xl p-6 border border-neutral-100 dark:border-white/5">
                <Toggle
                  label="Dynamic Dark Mode"
                  description="Optimizes interface for low-light medical environments"
                  enabled={resolvedTheme === "dark"}
                  onChange={toggleTheme}
                />
              </div>

              <div className="mt-6 flex items-center gap-4 px-2">
                <button 
                  onClick={() => setTheme("light")}
                  className={`p-4 rounded-2xl border transition-all ${
                    resolvedTheme === "light" ? "border-blue-500 bg-blue-50/50 shadow-lg shadow-blue-500/10" : "border-neutral-200 dark:border-white/10 opacity-50"
                  }`}
                >
                  <Sun size={20} className={resolvedTheme === "light" ? "text-blue-600" : "text-neutral-400"} />
                </button>

                <button 
                  onClick={() => setTheme("dark")}
                  className={`p-4 rounded-2xl border transition-all ${
                    resolvedTheme === "dark" ? "border-blue-500 bg-blue-900/20 shadow-lg shadow-blue-500/10" : "border-neutral-200 dark:border-white/10 opacity-50"
                  }`}
                >
                  <Moon size={20} className={resolvedTheme === "dark" ? "text-blue-400" : "text-neutral-400"} />
                </button>

                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest ml-auto">
                  Precision Engine: v2.0
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Communications */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="p-8 bg-white/70 dark:bg-white/[0.02] backdrop-blur-2xl border-neutral-200 dark:border-white/10 rounded-[2rem]">
              <SectionHeader
                icon={Bell}
                title="Signal Management"
                description="Managing inbound health telemetry and alerts"
                colorClass="text-cyan-500"
              />

              <div className="space-y-2 divide-y divide-neutral-100 dark:divide-white/5">
                <Toggle
                  label="Health Telemetry Alerts"
                  description="Direct updates regarding your medical status and reports"
                  enabled={notifications.email}
                  onChange={() => setNotifications({ ...notifications, email: !notifications.email })}
                />
                <Toggle
                  label="Cloud Push Infrastructure"
                  description="Real-time browser notifications for urgent patient care"
                  enabled={notifications.push}
                  onChange={() => setNotifications({ ...notifications, push: !notifications.push })}
                />
              </div>
            </Card>
          </motion.div>

          {/* Security */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="p-8 bg-white/70 dark:bg-white/[0.02] backdrop-blur-2xl border-neutral-200 dark:border-white/10 rounded-[2rem]">
              <SectionHeader
                icon={Lock}
                title="Vault & Security"
                description="End-to-end encryption and access protocols"
                colorClass="text-blue-600"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ActionButton icon={Key} className="hover:border-blue-500/50 transition-colors">Rotate Access Keys</ActionButton>
                <ActionButton icon={Shield} className="hover:border-blue-500/50">Multi-Factor Vault</ActionButton>
                <ActionButton icon={Smartphone} className="hover:border-blue-500/50">Registered Terminals</ActionButton>
                <ActionButton icon={Eye} className="hover:border-blue-500/50">Audit Logs</ActionButton>
              </div>
            </Card>
          </motion.div>

          {/* Danger Zone */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="p-8 border-rose-500/20 bg-rose-500/[0.02] dark:bg-rose-500/[0.01] backdrop-blur-2xl rounded-[2rem]">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-neutral-950 dark:text-white tracking-tight">
                    Danger Zone
                  </h2>
                  <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">
                    Irreversible Core Procedures
                  </p>
                </div>
              </div>

              <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium mb-6">
                Deactivating this terminal will purge all encrypted medical records and synchronized health IDs.
              </p>

              <button
                onClick={() => setOpen(true)}
                className="w-full flex items-center justify-center gap-2 p-5 bg-white dark:bg-rose-950/20 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 font-bold text-xs uppercase tracking-[0.2em] rounded-2xl transition-all border border-rose-200 dark:border-rose-900/40 shadow-sm shadow-rose-500/5"
              >
                <Trash2 size={16} /> Decommission Profile
              </button>
            </Card>
          </motion.div>

          <ConfirmDeleteModal
            open={open}
            onClose={() => setOpen(false)}
            onConfirm={handleDelete}
            loading={loading}
          />

          <div className="text-center pt-8 pb-12">
            <p className="text-[10px] font-bold text-neutral-300 dark:text-neutral-700 uppercase tracking-[0.6em]">
              RuralCare OS v4.2.0-Alpha.Secure
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}