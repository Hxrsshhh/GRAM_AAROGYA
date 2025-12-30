"use client";

import React, { useState } from "react";
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
} from "lucide-react";

import { SettingsCard as Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Toggle } from "@/components/ui/Toggle";
import { ActionButton } from "@/components/ui/ActionButton";
import { useTheme } from "next-themes";
import Link from "next/link";

import ConfirmDeleteModal from "@/components/modals/confirmDeleteModal";
import { deleteUserAccount } from "@/lib/api/user";
import { signOut } from "next-auth/react";

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
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 py-12 selection:bg-blue-100">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-8 mt-14 flex justify-between items-end">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-[0.2em] mb-2">
              <Globe size={14} /> Global Preferences
            </div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Control{" "}
              <span className="text-emerald-600 dark:text-emerald-500">
                Center
              </span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
              Configure your workspace and security protocols.
            </p>
          </div>

          <div className="hidden sm:block">
            <div className="flex items-center gap-2 p-2 px-4 bg-white dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm text-[10px] font-black uppercase tracking-widest text-slate-400">
              <Info size={14} /> Cloud Sync Active
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <Card className="p-8">
            <SectionHeader
              icon={Palette}
              title="Interface Aesthetics"
              description="Visual Workspace Configuration"
            />

            <div className="bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
              <Toggle
                label="Dark Mode Environment"
                description="Reduce eye strain in low-light environments"
                onChange={toggleTheme}
              />
            </div>

            <div className="mt-4 flex items-center gap-4 px-2">
              <div
                className={`p-3 rounded-lg border transition-all ${
                  resolvedTheme === "light"
                    ? "border-emerald-600 bg-emerald-50"
                    : "border-slate-200"
                }`}
              >
                <Sun
                  size={20}
                  className={
                    resolvedTheme === "light"
                      ? "text-emerald-600"
                      : "text-slate-400"
                  }
                />
              </div>

              <div
                className={`p-3 rounded-lg border transition-all ${
                  resolvedTheme === "dark"
                    ? "border-emerald-500 bg-emerald-900/20"
                    : "border-slate-200"
                }`}
              >
                <Moon
                  size={20}
                  className={
                    resolvedTheme === "dark"
                      ? "text-emerald-400"
                      : "text-slate-400"
                  }
                />
              </div>

              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-auto">
                System Default: Auto
              </p>
            </div>
          </Card>

          <Card className="p-8">
            <SectionHeader
              icon={Bell}
              title="Communications"
              description="Inbound Signal Management"
            />

            <div className="space-y-2 divide-y divide-slate-100 dark:divide-slate-800">
              <Toggle
                label="Direct Email Alerts"
                description="Official community reports and task updates"
                enabled={notifications.email}
                onChange={() =>
                  setNotifications({
                    ...notifications,
                    email: !notifications.email,
                  })
                }
              />
              <Toggle
                label="Push Infrastructure"
                description="Real-time browser and mobile notifications"
                enabled={notifications.push}
                onChange={() =>
                  setNotifications({
                    ...notifications,
                    push: !notifications.push,
                  })
                }
              />
              <Toggle
                label="SMS Protocol"
                description="Critical urgent updates via mobile carrier"
                enabled={notifications.sms}
                onChange={() =>
                  setNotifications({
                    ...notifications,
                    sms: !notifications.sms,
                  })
                }
              />
            </div>
          </Card>

          <Card className="p-8">
            <SectionHeader
              icon={Lock}
              title="Security & Access"
              description="Credential and Encryption Settings"
              colorClass="text-blue-600 dark:text-emerald-500"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ActionButton icon={Key}>Rotate Password</ActionButton>
              <ActionButton icon={Shield}>Configure 2FA</ActionButton>
              <ActionButton icon={Smartphone}>Authorized Devices</ActionButton>
              <ActionButton icon={Eye}>Privacy Audit</ActionButton>
            </div>
          </Card>

          <Card className="p-8 border-rose-100 dark:border-rose-900/30">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 text-rose-500">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  Danger Zone
                </h2>
                <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest">
                  Irreversible Critical Actions
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-500 font-medium mb-6 px-2">
              Deleting your account will permanently remove all data.
            </p>

            <button
              onClick={() => setOpen(true)}
              className="w-full flex items-center justify-center gap-2 p-4 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 text-rose-600 font-black text-xs uppercase tracking-widest rounded-xl transition-all border border-rose-200 dark:border-rose-900/40"
            >
              <Trash2 size={16} /> Deactivate Account Terminal
            </button>
          </Card>

          <ConfirmDeleteModal
            open={open}
            onClose={() => setOpen(false)}
            onConfirm={handleDelete}
            loading={loading}
          />

          <div className="text-center pb-12">
            <p className="text-[10px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.4em]">
              CivicReport Console v2.4.0-Stable
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
