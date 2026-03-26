"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Camera,
  Save,
  ShieldCheck,
  Settings,
  Loader2,
  Heart,
  Activity,
  Lock,
  ChevronLeft,
  Trophy,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

// SVG Path Background for theme continuity
function FloatingPaths({ position }) {
  const paths = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${380 - i * 5 * position} -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${152 - i * 5 * position} ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${684 - i * 5 * position} ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.4 + i * 0.03,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden w-full h-full opacity-10 dark:opacity-20">
      <svg className="w-full h-full" viewBox="0 0 696 316" preserveAspectRatio="xMidYMid slice" fill="none">
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            className="text-blue-500/40 dark:text-white/10"
            initial={{ pathLength: 0.3, opacity: 0.4 }}
            animate={{ pathLength: 1, opacity: [0.1, 0.3, 0.1], pathOffset: [0, 1, 0] }}
            transition={{ duration: 20 + path.id * 0.5, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </svg>
    </div>
  );
}

export default function Profile() {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(null);

  const router = useRouter();
  const { data: session, status } = useSession();

  const fetchProfile = async () => {
    const res = await fetch("/api/user/profile");
    if (!res.ok) throw new Error("Failed to load profile");
    return res.json();
  };

  const { data: profile, error, isLoading } = useSWR(
    status === "authenticated" ? "/api/user/profile" : null,
    fetchProfile,
    { revalidateOnFocus: false, dedupingInterval: 5 * 60_000 }
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
      toast.success("Identity updated successfully");
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
          Initializing Identity...
        </p>
      </div>
    );
  }

  if (error) return <ErrorHandle />;

  return (
    <div className="relative min-h-screen bg-white dark:bg-[#030303] overflow-x-hidden">
      {/* Safety space for fixed default navbar */}
      <div className="h-24 md:h-28" />

      {/* Background Decor */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <FloatingPaths position={-1} />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Header Branding */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-[10px] uppercase tracking-[0.3em]">
                <ShieldCheck size={14} /> Profile Verification Hub
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-neutral-900 dark:text-white tracking-tight">
                Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Identity</span>
              </h1>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button 
                variant="secondary" 
                onClick={() => setEditing(!editing)}
                className="flex-1 sm:flex-none bg-neutral-100 dark:bg-white/5 border-neutral-200 dark:border-white/10"
              >
                {editing ? "Cancel" : <><Settings size={14} className="mr-2" /> Configure</>}
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: User Summary */}
          <div className="lg:col-span-4 space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="overflow-hidden bg-white/50 dark:bg-neutral-900/50 backdrop-blur-3xl border-neutral-200 dark:border-white/5 rounded-[2.5rem] shadow-2xl">
                {/* Profile Banner */}
                <div className="h-32 bg-gradient-to-br from-blue-600 to-cyan-700 relative">
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="absolute -bottom-14 left-1/2 -translate-x-1/2">
                    <div className="relative group">
                      <div className="w-32 h-32 rounded-[2.5rem] border-[6px] border-white dark:border-[#0d0d0d] shadow-2xl overflow-hidden bg-neutral-200">
                        <Image
                          src={formData?.avatar || "/avatar.jpg"}
                          alt="Profile"
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      {editing && (
                        <button className="absolute bottom-1 right-1 p-2.5 bg-blue-600 text-white rounded-2xl shadow-lg hover:bg-blue-500 transition-all">
                          <Camera size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Profile Metadata */}
                <div className="pt-16 pb-8 px-8 text-center">
                  <h2 className="text-2xl font-black text-neutral-900 dark:text-white tracking-tight">
                    {formData?.name}
                  </h2>
                  <p className="text-neutral-400 font-medium text-sm mt-1">{formData?.email}</p>
                  
                  <div className="flex flex-wrap justify-center gap-2 mt-6">
                    <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                      <Trophy size={12} className="mr-2" /> Top Contributor
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-neutral-100 dark:border-white/5">
                    <div className="text-left">
                      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Global Pts</p>
                      <p className="text-2xl font-black text-neutral-900 dark:text-white tracking-tighter">1.2k</p>
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Nodes Active</p>
                      <p className="text-2xl font-black text-neutral-900 dark:text-white tracking-tighter">{session?.user.reportsCount || 0}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Loyalty/Karma Card */}
            <Card className="p-8 bg-gradient-to-br from-blue-600/5 via-transparent to-cyan-500/5 border-blue-500/10 rounded-[2.5rem]">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-2xl bg-white dark:bg-white/5 border border-blue-500/10">
                  <Heart className="text-rose-500 fill-rose-500/10" size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-end mb-1">
                    <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Karma Level</span>
                    <span className="text-xs font-bold text-blue-500">85%</span>
                  </div>
                  <div className="w-full bg-neutral-200 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: "85%" }} 
                      className="h-full bg-gradient-to-r from-blue-600 to-cyan-400" 
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* RIGHT COLUMN: Parameters Form */}
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-white/70 dark:bg-neutral-900/40 backdrop-blur-3xl border-neutral-200 dark:border-white/5 rounded-[2.5rem] overflow-hidden">
                <div className="px-8 py-6 border-b border-neutral-100 dark:border-white/5 flex justify-between items-center bg-white/40 dark:bg-white/[0.01]">
                  <h2 className="text-lg font-bold text-neutral-800 dark:text-white flex items-center gap-3">
                    <span className="w-1.5 h-6 bg-blue-600 rounded-full" />
                    Account Parameters
                  </h2>
                  {editing && (
                    <Button 
                      variant="primary" 
                      onClick={handleSave} 
                      isLoading={saving}
                      className="bg-blue-600 hover:bg-blue-700 rounded-xl px-6 text-xs"
                    >
                      Commit Sync
                    </Button>
                  )}
                </div>

                <div className="p-8 space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <InputField
                      label="Public Alias"
                      value={formData.name || ""}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      leftIcon={<User className={editing ? "text-blue-500" : "text-neutral-400"} />}
                      disabled={!editing}
                      className="rounded-2xl transition-all"
                    />
                    <InputField
                      label="Registry Email"
                      value={formData.email || ""}
                      type="email"
                      disabled={true}
                      leftIcon={<Mail className="text-neutral-400" />}
                      className="rounded-2xl bg-neutral-100/50 dark:bg-white/[0.02] cursor-not-allowed"
                    />
                    <InputField
                      label="Contact Frequency"
                      value={formData.phone || ""}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      leftIcon={<Phone className={editing ? "text-blue-500" : "text-neutral-400"} />}
                      disabled={!editing}
                      className="rounded-2xl"
                    />
                    <InputField
                      label="Operation Node (City)"
                      value={formData.location?.city || ""}
                      onChange={(e) => setFormData({ ...formData, location: { ...formData.location, city: e.target.value } })}
                      leftIcon={<MapPin className={editing ? "text-blue-500" : "text-neutral-400"} />}
                      disabled={!editing}
                      className="rounded-2xl"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] ml-2">
                      Professional Dossier
                    </label>
                    <textarea
                      value={formData.bio || ""}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      disabled={!editing}
                      placeholder="Enter your professional summary here..."
                      className={`w-full min-h-[180px] p-6 rounded-[2rem] border transition-all outline-none leading-relaxed text-sm
                        ${editing 
                          ? "bg-white dark:bg-white/5 border-blue-500/20 focus:border-blue-500 shadow-xl" 
                          : "bg-neutral-50 dark:bg-white/[0.02] border-transparent text-neutral-500 resize-none"
                        }`}
                    />
                  </div>
                </div>

                <div className="px-8 py-6 bg-neutral-100/50 dark:bg-white/[0.02] border-t border-neutral-100 dark:border-white/5 flex flex-wrap gap-8 items-center text-neutral-400">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Enrolled: Jan 2023</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">AES-256 Encrypted</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

        </div>
      </main>
    </div>
  );
}