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
  XCircle,
  ChevronRight,
  ExternalLink,
  Settings,
  Loader2,
  Award,
  Heart,
  Activity,
  Lock,
  Globe,
  Briefcase,
} from "lucide-react";

import { ProfileCard as Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

import { InputField } from "@/components/ui/input";
import { userData } from "@/lib/mock-data";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState(userData);

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setUser({
        role: "admin",
        createdAt: "2023-01-15T12:00:00Z",
        verified: true,
      });
      setLoading(false);
    }, 1000);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setEditing(false);
    }, 1200);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-12 h-12 text-slate-900 dark:text-emerald-500 animate-spin mb-4" />
        <p className="text-slate-500 font-bold tracking-widest uppercase text-xs">
          Authenticating Profile...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 mt-8 gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-[0.2em] mb-2">
              <Activity size={14} /> System Console
            </div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Professional{" "}
              <span className="text-emerald-600 dark:text-emerald-500">
                Identity
              </span>
            </h1>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="text-xs">
              <Globe size={14} /> Public View
            </Button>
            <Button variant="secondary" className="text-xs">
              <Settings size={14} /> Preferences
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN - Profile Card & Stats */}
          <div className="lg:col-span-4 space-y-6">
            <Card>
              <div className="h-24 bg-emerald-600 dark:bg-emerald-700 relative">
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                  <div className="relative group">
                    <img
                      src={formData.avatar}
                      className="w-28 h-28 rounded-2xl border-4 border-white dark:border-slate-900 shadow-2xl object-cover"
                      alt="Profile"
                    />
                    {editing && (
                      <button className="absolute -bottom-2 -right-2 p-2 bg-emerald-600 text-white rounded-xl shadow-lg hover:scale-110 transition-transform">
                        <Camera size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-16 pb-8 px-6 text-center">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  {formData.name}
                </h2>
                <p className="text-slate-400 font-medium text-sm mb-6">
                  {formData.email}
                </p>

                <div className="flex justify-center gap-2 mb-8">
                  <Badge variant="success">
                    <ShieldCheck size={12} className="mr-1.5" /> Verified
                  </Badge>
                  <Badge variant="blue">
                    <Award size={12} className="mr-1.5" /> Lead
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <div className="text-left">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Impact
                    </p>
                    <p className="text-lg font-black text-slate-900 dark:text-white">
                      1.2k pts
                    </p>
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Projects
                    </p>
                    <p className="text-lg font-black text-slate-900 dark:text-white">
                      14 Active
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-slate-100 text-emerald-800 dark:text-white dark:bg-slate-900">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3  rounded-xl">
                  <Heart className="text-rose-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-700 dark:text-white uppercase">
                    Community Karma
                  </p>
                  <p className="text-lg font-black text-slate-700 dark:text-white">
                    Top 5% Contributor
                  </p>
                </div>
              </div>
              <div className="w-full bg-slate-100 dark:bg-white/20  h-1.5 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-full w-[85%]" />
              </div>
            </Card>
          </div>

          {/* RIGHT COLUMN - Edit Information */}
          <div className="lg:col-span-8 space-y-6">
            <Card>
              <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/20">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-emerald-600 dark:bg-emerald-500 rounded-full" />
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">
                    Account Information
                  </h2>
                </div>

                {!editing ? (
                  <Button
                    variant="primary"
                    onClick={() => setEditing(true)}
                    className="px-4 py-2"
                  >
                    Modify Details
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => setEditing(false)}
                      className="px-4 py-2"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleSave}
                      isLoading={saving}
                      leftIcon={<Save size={16} />}
                      className="px-6 py-2"
                    >
                      Commit
                    </Button>
                  </div>
                )}
              </div>

              <div className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <InputField
                    label="Full Name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    leftIcon={<User />}
                    disabled={!editing}
                  />

                  <InputField
                    label="Official Email"
                    value={formData.email}
                    type="email"
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    leftIcon={<Mail />}
                    disabled={!editing}
                  />

                  <InputField
                    label="Contact Number"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    leftIcon={<Phone />}
                    disabled={!editing}
                  />

                  <InputField
                    label="Headquarters / Location"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    leftIcon={<MapPin />}
                    disabled={!editing}
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                    Professional Bio
                  </label>
                  <textarea
                    className={`w-full min-h-[140px] p-5 rounded-2xl border transition-all outline-none leading-relaxed text-sm font-medium
                      ${
                        editing
                          ? "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:border-slate-900 dark:focus:border-emerald-500 shadow-sm"
                          : "bg-slate-50 dark:bg-slate-800/50 border-transparent text-slate-500"
                      }`}
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    disabled={!editing}
                  />
                </div>
              </div>

              <div className="px-8 py-6 bg-slate-50 dark:bg-slate-800/20 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-6 items-center">
                <div className="flex items-center gap-2 text-slate-400">
                  <Calendar size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Enrolled since Jan 2023
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Lock size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Last audit: 2 days ago
                  </span>
                </div>
              </div>
            </Card>

            {/* Quick Actions / Integration Module */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-5 flex items-center justify-between group cursor-pointer hover:border-blue-200 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl">
                    <Briefcase size={20} />
                  </div>
                  <div>
                    <p className="font-black text-slate-900 dark:text-white">
                      Service History
                    </p>
                    <p className="text-xs text-slate-400">
                      Download report as PDF
                    </p>
                  </div>
                </div>
                <ChevronRight
                  size={18}
                  className="text-slate-300 group-hover:translate-x-1 transition-transform"
                />
              </Card>

              <Card className="p-5 flex items-center justify-between group cursor-pointer hover:border-emerald-200 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-xl">
                    <Award size={20} />
                  </div>
                  <div>
                    <p className="font-black text-slate-900 dark:text-white">
                      Badges & Awards
                    </p>
                    <p className="text-xs text-slate-400">4 new achievements</p>
                  </div>
                </div>
                <ChevronRight
                  size={18}
                  className="text-slate-300 group-hover:translate-x-1 transition-transform"
                />
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
