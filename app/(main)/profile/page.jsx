"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Camera,
  ShieldCheck,
  Settings,
  Heart,
  Activity,
  Lock,
  Trophy,
  AlertCircle,
  Stethoscope,
  Fingerprint,
  HeartPulse,
} from "lucide-react";
import { motion } from "framer-motion";

import { ProfileCard as Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

import { InputField } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import useSWR, { mutate } from "swr";
import ErrorHandle from "@/components/layouts/ErrorHandle";

export default function Profile() {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(null);

  const { data: session, status } = useSession();

  const fetchProfile = async () => {
    const res = await fetch("/api/user/profile");
    if (!res.ok) throw new Error("Failed to load profile");
    return res.json();
  };

  const {
    data: profile,
    error,
    isLoading,
  } = useSWR(
    status === "authenticated" ? "/api/user/profile" : null,
    fetchProfile,
    { revalidateOnFocus: false, dedupingInterval: 5 * 60_000 },
  );

  useEffect(() => {
    if (profile) setFormData(profile);
  }, [profile]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Failed to update profile");
      const updatedUser = await response.json();
      mutate("/api/user/profile", updatedUser, false);
      setFormData(updatedUser);
      toast.success("Medical Dossier Synchronized");
      setEditing(false);
    } catch (error) {
      toast.error(error.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading" || isLoading || !formData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4 bg-white dark:bg-[#030303]">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-blue-500/10 rounded-full border-t-blue-500 animate-spin" />
          <Activity className="absolute w-6 h-6 text-blue-500 animate-pulse" />
        </div>
        <p className="text-neutral-500 font-black tracking-[0.4em] text-[10px] uppercase">
          Syncing Biometrics...
        </p>
      </div>
    );
  }

  if (error) return <ErrorHandle />;

  return (
    <div className="h-screen w-full bg-slate-50 dark:bg-[#030303] text-slate-900 dark:text-white selection:bg-blue-500/30 transition-colors duration-500 overflow-hidden flex flex-col">
      {/* Ambient Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[70%] h-[70%] bg-blue-600/10 dark:bg-blue-600/15 blur-[140px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 dark:bg-indigo-600/15 blur-[140px] rounded-full" />
      </div>

      {/* Main Content Area: Added pt-20 for navbar space and flex-1 with overflow-hidden */}
      <main className="relative z-10 container mx-auto px-6 pt-24 pb-8 max-w-7xl flex-1 flex flex-col overflow-hidden">
        {/* Header Section: Static height */}
        <header className="mb-8 shrink-0">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6"
          >
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-white/5 border border-blue-100 dark:border-white/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-widest">
                <Fingerprint size={12} className="animate-pulse" />
                <span>Encrypted Health Registry</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-b from-slate-900 via-slate-700 to-slate-500 dark:from-white dark:to-gray-500 bg-clip-text text-transparent">
                User <span className="italic">Dossier</span>
              </h1>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => setEditing(!editing)}
                className="flex-1 sm:flex-none px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 bg-slate-200/50 dark:bg-white/5 border border-slate-300/50 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-blue-400/50 flex items-center justify-center gap-2"
              >
                {editing ? (
                  "Discard Changes"
                ) : (
                  <>
                    <Settings size={14} /> Modify Parameters
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </header>

        {/* Dashboard Grid: Occupies remaining space, inner areas scroll if needed */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 overflow-hidden">
          {/* LEFT: Identity Summary */}
          <div className="lg:col-span-4 space-y-6 flex flex-col overflow-hidden">
            <div className="group relative bg-white/70 dark:bg-white/2 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-2 backdrop-blur-3xl shadow-2xl transition-all hover:border-blue-500/30 overflow-hidden shrink-0">
              <div className="bg-slate-50 dark:bg-black/40 rounded-[2.2rem] overflow-hidden border border-slate-100 dark:border-white/5">
                <div className="h-24 bg-gradient-to-br from-blue-600 to-indigo-700 relative" />
                <div className="pt-12 pb-8 px-8 text-center relative">
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                    <div className="w-24 h-24 rounded-[1.5rem] border-[4px] border-slate-50 dark:border-[#0d0d0d] shadow-2xl overflow-hidden bg-slate-200">
                      <Image
                        src={formData?.avatar || "/avatar.jpg"}
                        alt="Profile"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                    {formData?.name}
                  </h2>
                  <div className="mt-2 inline-block px-4 py-1 rounded-full border border-blue-500/30 text-blue-600 dark:text-blue-400 uppercase text-[9px] tracking-[0.2em] font-black bg-blue-500/5">
                    {formData?.role || "Citizen"}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white/50 dark:bg-white/2 border border-slate-200 dark:border-white/10 rounded-[2rem] backdrop-blur-xl group hover:border-rose-500/30 transition-all shrink-0">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 group-hover:scale-110 transition-transform">
                  <HeartPulse className="text-rose-500" size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    Vitality Index
                  </p>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    Verified Health Profile
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Form Data - This section is scrollable internally */}
          <div className="lg:col-span-8 flex flex-col overflow-hidden">
            <div className="group relative flex-1 bg-white/70 dark:bg-white/2 border border-slate-200 dark:border-white/10 rounded-[3rem] p-2 backdrop-blur-3xl shadow-2xl transition-all flex flex-col overflow-hidden">
              <div className="flex-1 bg-slate-50 dark:bg-black/40 rounded-[2.7rem] border border-slate-100 dark:border-white/5 flex flex-col overflow-hidden">
                <div className="px-10 py-6 border-b border-slate-200 dark:border-white/5 flex justify-between items-center shrink-0">
                  <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-3">
                    <span className="w-1.5 h-6 bg-blue-600 rounded-full animate-pulse" />
                    Core Parameters
                  </h2>
                  {editing && (
                    <button
                      onClick={handleSave}
                      className="bg-slate-900 dark:bg-white text-white dark:text-black px-6 py-2 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
                    >
                      Commit Sync
                    </button>
                  )}
                </div>

                {/* Scrollable Container for inputs */}
                <div className="p-10 space-y-10 overflow-y-auto custom-scrollbar">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <InputField
                      label="Full Legal Name"
                      value={formData.name || ""}
                      disabled={!editing}
                      leftIcon={<User size={18} className="text-blue-500" />}
                    />
                    <InputField
                      label="Primary Contact"
                      value={formData.phone || ""}
                      disabled={!editing}
                      leftIcon={<Phone size={18} className="text-blue-500" />}
                    />
                  </div>

                  <div className="space-y-8 pt-8 border-t border-slate-200 dark:border-white/5">
                    <h3 className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.3em] flex items-center gap-2">
                      <Stethoscope size={14} /> Medical Intelligence
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <InputField
                        label="Age"
                        type="number"
                        value={formData.healthProfile?.age || ""}
                        disabled={!editing}
                      />
                      <div className="flex flex-col gap-3">
                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase ml-2">
                          Gender Selection
                        </label>
                        <select
                          disabled={!editing}
                          className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 text-sm font-medium outline-none focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <InputField
                        label="City"
                        value={formData.location?.city || ""}
                        disabled={!editing}
                        leftIcon={
                          <MapPin size={18} className="text-blue-500" />
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] ml-2">
                      Professional Dossier
                    </label>
                    <textarea
                      disabled={!editing}
                      className={`w-full min-h-[120px] p-6 rounded-[2rem] border transition-all duration-500 outline-none leading-relaxed text-sm ${editing ? "bg-white dark:bg-white/5 border-blue-500/30" : "bg-slate-100/50 dark:bg-white/[0.02] border-transparent"}`}
                      placeholder="Summarize professional background..."
                      value={formData.bio}
                    />
                  </div>
                </div>

                {/* Footer Status Bar: Static at bottom */}
                <div className="px-10 py-5 bg-slate-100/50 dark:bg-white/[0.02] border-t border-slate-200 dark:border-white/5 flex flex-wrap gap-8 items-center text-slate-500 shrink-0">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-blue-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {formData.isVerified ? "ID Verified" : "Pending Sync"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock size={16} className="text-slate-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      AES-256 Security
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
