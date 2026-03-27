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


    <div className="relative min-h-screen bg-white dark:bg-[#030303] overflow-x-hidden">
      <div className="h-24 md:h-28" />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-[10px] uppercase tracking-[0.3em]">
                <Fingerprint size={14} /> Encrypted Health Registry
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-neutral-900 dark:text-white tracking-tight">
                User <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Dossier</span>
              </h1>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button 
                variant="secondary" 
                onClick={() => setEditing(!editing)}
                className="flex-1 sm:flex-none bg-neutral-100 dark:bg-white/5 border-neutral-200 dark:border-white/10"
              >
                {editing ? "Discard Changes" : <><Settings size={14} className="mr-2" /> Modify Parameters</>}
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: Identity Summary */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="overflow-hidden bg-white/50 dark:bg-neutral-900/50 backdrop-blur-3xl border-neutral-200 dark:border-white/5 rounded-[2.5rem] shadow-2xl">
              <div className="h-32 bg-gradient-to-br from-blue-600 to-cyan-700 relative">
                <div className="absolute -bottom-14 left-1/2 -translate-x-1/2">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-[2.5rem] border-[6px] border-white dark:border-[#0d0d0d] shadow-2xl overflow-hidden bg-neutral-200">
                      <Image src={formData?.avatar || "/avatar.jpg"} alt="Profile" fill className="object-cover" />
                    </div>
                    {editing && (
                      <button className="absolute bottom-1 right-1 p-2.5 bg-blue-600 text-white rounded-2xl shadow-lg hover:bg-blue-500">
                        <Camera size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-16 pb-8 px-8 text-center">
                <h2 className="text-2xl font-black text-neutral-900 dark:text-white tracking-tight">{formData?.name}</h2>
                <Badge variant="outline" className="mt-2 border-blue-500/30 text-blue-500 uppercase text-[9px] tracking-widest font-bold">
                  {formData?.role || "Citizen"}
                </Badge>
                
                {/* <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-neutral-100 dark:border-white/5">
                  <div className="text-left">
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Reputation</p>
                    <p className="text-2xl font-black text-neutral-900 dark:text-white">{formData?.reputation || 0}</p>
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Reports</p>
                    <p className="text-2xl font-black text-neutral-900 dark:text-white">{formData?.reportsCount || 0}</p>
                  </div>
                </div> */}

              </div>
            </Card>

            {/* Health Status Quick View */}
            <Card className="p-8 bg-gradient-to-br from-rose-500/5 via-transparent to-transparent border-rose-500/10 rounded-[2.5rem]">
               <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                    <Heart className="text-rose-500" size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Vitality Index</p>
                    <p className="text-sm font-bold text-neutral-700 dark:text-neutral-300">Verified Health Profile</p>
                  </div>
               </div>
            </Card>
          </div>

          {/* RIGHT: Form Data */}
          <div className="lg:col-span-8 space-y-8">
            <Card className="bg-white/70 dark:bg-neutral-900/40 backdrop-blur-3xl border-neutral-200 dark:border-white/5 rounded-[2.5rem] overflow-hidden">
              <div className="px-8 py-6 border-b border-neutral-100 dark:border-white/5 flex justify-between items-center">
                <h2 className="text-lg font-bold text-neutral-800 dark:text-white flex items-center gap-3">
                  <span className="w-1.5 h-6 bg-blue-600 rounded-full" />
                  Core Parameters
                </h2>
                {editing && (
                  <Button onClick={handleSave} isLoading={saving} className="bg-blue-600 hover:bg-blue-700 rounded-xl px-6 text-xs">
                    Commit Sync
                  </Button>
                )}
              </div>

              <div className="p-8 space-y-10">
                {/* Section 1: Basic & Contact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField label="Full Legal Name" value={formData.name || ""} onChange={(e) => setFormData({ ...formData, name: e.target.value })} disabled={!editing} leftIcon={<User size={16}/>} />
                  <InputField label="Registered Email" value={formData.email || ""} disabled={true} leftIcon={<Mail size={16}/>} />
                  <InputField label="Primary Contact" value={formData.phone || ""} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} disabled={!editing} leftIcon={<Phone size={16}/>} />
                  <InputField label="Emergency Contact" value={formData.emergencyContact || ""} onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })} disabled={!editing} leftIcon={<AlertCircle className="text-rose-500" size={16}/>} />
                </div>

                {/* Section 2: Health Profile (New) */}
                <div className="space-y-6 pt-6 border-t border-neutral-100 dark:border-white/5">
                  <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Stethoscope size={14} /> Medical Intelligence
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <InputField label="Age" type="number" value={formData.healthProfile?.age || ""} onChange={(e) => setFormData({ ...formData, healthProfile: { ...formData.healthProfile, age: e.target.value }})} disabled={!editing} />
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black text-neutral-400 uppercase ml-2">Gender</label>
                        <select 
                          disabled={!editing}
                          value={formData.healthProfile?.gender || ""}
                          onChange={(e) => setFormData({ ...formData, healthProfile: { ...formData.healthProfile, gender: e.target.value }})}
                          className="bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded-2xl p-3 text-sm outline-none focus:border-blue-500"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                    </div>
                    <InputField label="City" value={formData.location?.city || ""} onChange={(e) => setFormData({ ...formData, location: { ...formData.location, city: e.target.value } })} disabled={!editing} leftIcon={<MapPin size={16}/>} />
                  </div>
                  
                  <InputField 
                    label="Allergies & Critical Notes" 
                    value={formData.healthProfile?.allergies || ""} 
                    onChange={(e) => setFormData({ ...formData, healthProfile: { ...formData.healthProfile, allergies: e.target.value }})} 
                    disabled={!editing} 
                    placeholder="e.g. Penicillin, Peanuts..."
                  />
                </div>

                {/* Section 3: Bio */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] ml-2">Professional Dossier</label>
                  <textarea
                    value={formData.bio || ""}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    disabled={!editing}
                    className={`w-full min-h-[120px] p-6 rounded-[2rem] border transition-all outline-none leading-relaxed text-sm ${editing ? "bg-white dark:bg-white/5 border-blue-500/20 focus:border-blue-500" : "bg-neutral-50 dark:bg-white/[0.02] border-transparent"}`}
                  />
                </div>
              </div>

              <div className="px-8 py-6 bg-neutral-100/50 dark:bg-white/[0.02] border-t border-neutral-100 dark:border-white/5 flex flex-wrap gap-8 items-center text-neutral-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-green-500" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">{formData.isVerified ? "Identity Verified" : "Verification Pending"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">AES-256 Health Encryption</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>

    
  );
}