"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Search,
  ShieldCheck,
  Ban,
  LayoutGrid,
  Clock,
  Award,
  UserCog,
  Save,
  Trash2,
  Fingerprint,
  X,
} from "lucide-react";
import Image from "next/image";

import ConfirmDeleteModal from "@/components/modals/confirmDeleteModal";
import { toast } from "sonner";

// --- Loading Skeleton Component ---
const SkeletonCard = () => (
  <div className="p-6 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 animate-pulse">
    <div className="flex justify-between items-start mb-6">
      <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-800" />
      <div className="flex flex-col gap-2 items-end">
        <div className="w-12 h-4 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="w-16 h-2 bg-slate-100 dark:bg-slate-800 rounded-full" />
      </div>
    </div>
    <div className="mb-6 space-y-2">
      <div className="w-3/4 h-5 bg-slate-200 dark:bg-slate-800 rounded-lg" />
      <div className="w-1/2 h-3 bg-slate-100 dark:bg-slate-800 rounded-lg" />
    </div>
    <div className="grid grid-cols-2 gap-3 mb-6">
      <div className="h-12 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800" />
      <div className="h-12 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800" />
    </div>
    <div className="w-full h-10 bg-slate-200 dark:bg-slate-800 rounded-xl" />
  </div>
);

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialFetch, setInitialFetch] = useState(true); // New state for initial load
  const [open, setOpen] = useState(false);

  const [editDraft, setEditDraft] = useState({
    bio: "",
    isBlocked: false,
    isVerified: false,
    role: "",
  });

  const MAX_BIO_LENGTH = 100;

  useEffect(() => {
    const FetchData = async () => {
      try {
        setInitialFetch(true);
        const res = await fetch("/api/admin/users");
        if (!res.ok) throw new Error("Failed to fetch data");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        toast.error("Could not load users");
      } finally {
        setInitialFetch(false);
      }
    };
    FetchData();
  }, []);

  const updateDraft = (key, value) => {
    setEditDraft((prev) => ({ ...prev, [key]: value }));
  };

  const handleFinalUpdate = async () => {
    if (!selectedUser) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/admin/users/${selectedUser._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editDraft),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");

      setUsers((prev) =>
        prev.map((u) =>
          u._id === selectedUser._id ? { ...u, ...editDraft } : u
        )
      );

      setSelectedUser((prev) => ({ ...prev, ...editDraft }));

      toast.success("Identity synchronized with database");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete user");
      }
      setUsers((prev) => prev.filter((u) => u._id !== id));
      setSelectedUser(null);
      setOpen(false);
      toast.success("Deleted successfully");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    {
      label: "Total Accounts",
      value: users.length,
      icon: Users,
      color: "text-blue-500",
    },
    {
      label: "Active Admins",
      value: users.filter((u) => u.role === "admin").length,
      icon: ShieldCheck,
      color: "text-emerald-500",
    },
    {
      label: "Pending Review",
      value: users.filter((u) => u.onboardingStatus === "pending").length,
      icon: Clock,
      color: "text-amber-500",
    },
    {
      label: "Blocked",
      value: users.filter((u) => u.isBlocked).length,
      icon: Ban,
      color: "text-rose-500",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-500 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Navigation */}
      <div className="fixed hidden lg:block top-2 left-0 right-0 z-50 px-4 pointer-events-none">
        <div className="max-w-5xl mx-auto pointer-events-auto">
          <nav className="relative overflow-hidden rounded-[2rem] border border-white/20 dark:border-slate-800/50 bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] transition-all duration-500 hover:shadow-emerald-500/10 hover:border-emerald-500/20">
            <div className="absolute -left-20 -top-20 w-40 h-40 bg-emerald-500/10 blur-[100px] pointer-events-none" />
            <div className="flex items-center justify-between px-6 py-3 gap-6">
              <div className="flex items-center gap-4 shrink-0">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white leading-none">
                    User<span className="text-emerald-500">.</span>Directory
                  </h1>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">
                      {initialFetch ? "..." : users?.length || 0} Entities
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                    <span className="text-[8px] font-black text-emerald-500 uppercase tracking-tighter">
                      Node_Active
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex-1 max-w-md group relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                  <Search size={14} strokeWidth={3} />
                </div>
                <input
                  type="text"
                  placeholder="Search Identity..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-100/40 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl py-2.5 pl-11 pr-4 text-[11px] font-bold placeholder:text-slate-400 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white dark:focus:bg-slate-950 outline-none transition-all duration-300"
                />
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2 hidden xs:block" />
                <button className="p-2.5 text-slate-400 hover:text-emerald-500 hover:bg-emerald-500/5 rounded-xl transition-all active:scale-90">
                  <LayoutGrid size={18} />
                </button>
                <button className="hidden xs:flex p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/5 rounded-xl transition-all active:scale-90">
                  <UserCog size={18} />
                </button>
              </div>
            </div>
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto p-6 mt-14 lg:mt-16">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {initialFetch
            ? Array(4)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 animate-pulse"
                  >
                    <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 mb-4" />
                    <div className="w-20 h-2 bg-slate-100 dark:bg-slate-800 mb-2 rounded" />
                    <div className="w-12 h-6 bg-slate-200 dark:bg-slate-800 rounded" />
                  </div>
                ))
            : stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={i}
                    className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm"
                  >
                    <div
                      className={`p-2 w-fit rounded-lg bg-slate-50 dark:bg-slate-800 mb-4 ${stat.color}`}
                    >
                      <Icon size={20} />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                      {stat.label}
                    </p>
                    <h3 className="text-2xl font-black">{stat.value}</h3>
                  </div>
                );
              })}
        </div>

        {/* User Grid */}
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">
              Identity Registry
            </h2>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <LayoutGrid size={14} /> Grid Layout Active
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {initialFetch ? (
                // Show 6 skeleton cards during initial fetch
                Array(6)
                  .fill(0)
                  .map((_, i) => <SkeletonCard key={`skeleton-${i}`} />)
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={user._id}
                    className={`p-6 rounded-[2rem] bg-slate-50 dark:bg-slate-950/50 border flex flex-col group relative overflow-hidden transition-all ${
                      user.isBlocked
                        ? "grayscale opacity-60 border-rose-500/20"
                        : "border-slate-100 dark:border-slate-800 hover:border-emerald-500/30"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 rounded-xl overflow-hidden relative shrink-0">
                        <Image
                          src={user.avatar || "/avatar.jpg"}
                          alt={user.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${
                            user.role === "admin"
                              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                              : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                          }`}
                        >
                          {user.role}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${
                              user.status === "active"
                                ? "bg-emerald-500"
                                : user.status === "suspended"
                                ? "bg-rose-500"
                                : "bg-amber-500"
                            }`}
                          />
                          <span className="text-[9px] font-black uppercase text-slate-400">
                            {user.isBlocked ? "Blocked" : user.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-black text-base truncate group-hover:text-emerald-500 transition-colors">
                          {user.name}
                        </h4>
                        {user.isVerified && (
                          <ShieldCheck size={14} className="text-blue-500" />
                        )}
                      </div>
                      <p className="text-[11px] font-bold text-slate-400 truncate">
                        @{user.username || user.email.split("@")[0]}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <p className="text-[8px] font-black uppercase text-slate-400 mb-1 flex items-center gap-1">
                          <Award size={10} /> Reputation
                        </p>
                        <p className="text-sm font-black">{user.reputation}</p>
                      </div>
                      <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <p className="text-[8px] font-black uppercase text-slate-400 mb-1">
                          Reports
                        </p>
                        <p className="text-sm font-black">
                          {user.reportsCount}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-auto">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setEditDraft({
                            bio: user.bio || "",
                            isBlocked: user.isBlocked,
                            isVerified: user.isVerified,
                            role: user.role,
                          });
                        }}
                        className="flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:scale-[1.02] shadow-xl shadow-slate-900/10"
                      >
                        View Profile
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center">
                  <p className="text-slate-400 font-black uppercase tracking-widest text-xs">
                    No identities found matching search criteria
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Slide-over Sidebar */}
      <AnimatePresence>
        {selectedUser && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedUser(null)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-50"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="fixed top-0 right-0 h-full w-full max-w-xl bg-white dark:bg-slate-900 shadow-2xl z-50 overflow-y-auto border-l border-slate-200 dark:border-slate-800 mt-10"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <UserCog className="text-emerald-500" size={18} />
                      <h3 className="font-black uppercase tracking-widest text-[10px] text-slate-400">
                        Identity Editor
                      </h3>
                    </div>
                    <p className="text-[9px] font-bold text-slate-400 italic">
                      Modifying as:{" "}
                      <span className="text-emerald-600 dark:text-emerald-400">
                        {selectedUser.name}
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-950/50 dark:to-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 mb-6 shadow-sm">
                  <div className="flex items-center gap-6 mb-8">
                    <div className="relative group">
                      <div className="w-24 h-24 rounded-3xl overflow-hidden relative shrink-0 ring-4 ring-white dark:ring-slate-800 shadow-xl">
                        <Image
                          src={selectedUser.avatar || "/avatar.jpg"}
                          alt={selectedUser.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      {editDraft.isVerified && (
                        <div className="absolute -bottom-2 -right-2 p-2 bg-blue-500 text-white rounded-2xl border-4 border-white dark:border-slate-900 shadow-lg">
                          <ShieldCheck size={16} />
                        </div>
                      )}
                    </div>
                    <div>
                      <h2 className="text-2xl font-black tracking-tight mb-1 dark:text-white">
                        {selectedUser.name}
                      </h2>
                      <p className="text-sm font-bold text-emerald-500 mb-3">
                        @
                        {selectedUser.username ||
                          selectedUser.email.split("@")[0]}
                      </p>
                      <div className="flex gap-2">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${
                            editDraft.role === "admin"
                              ? "bg-emerald-500 text-white"
                              : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                          }`}
                        >
                          {editDraft.role}
                        </span>
                        <span
                          className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${
                            editDraft.isBlocked
                              ? "bg-rose-100 text-rose-600"
                              : "bg-blue-100 text-blue-600"
                          }`}
                        >
                          {editDraft.isBlocked ? "Restricted" : "Active"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mt-4">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Citizen Biography
                      </label>
                      <span
                        className={`text-[9px] font-bold ${
                          editDraft.bio.length > MAX_BIO_LENGTH
                            ? "text-rose-500"
                            : "text-slate-400"
                        }`}
                      >
                        {editDraft.bio.length}/{MAX_BIO_LENGTH}
                      </span>
                    </div>
                    <textarea
                      value={editDraft.bio}
                      onChange={(e) => updateDraft("bio", e.target.value)}
                      placeholder="Tell the community about this user..."
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all resize-none min-h-25"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-8">
                  {[
                    {
                      label: "Reputation",
                      val: selectedUser.reputation,
                      color: "text-amber-500",
                    },
                    {
                      label: "Reports",
                      val: selectedUser.reportsCount,
                      color: "text-rose-500",
                    },
                    {
                      label: "Upvotes",
                      val: selectedUser.upvotesGiven,
                      color: "text-blue-500",
                    },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="p-4 bg-slate-50 dark:bg-slate-950/30 rounded-2xl border border-slate-100 dark:border-slate-800"
                    >
                      <p className="text-[8px] font-black uppercase text-slate-400 mb-1 tracking-widest">
                        {stat.label}
                      </p>
                      <p className={`text-xl font-black ${stat.color}`}>
                        {stat.val}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      disabled={loading}
                      onClick={() =>
                        updateDraft("isBlocked", !editDraft.isBlocked)
                      }
                      className={`flex items-center justify-center gap-2 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                        editDraft.isBlocked
                          ? "bg-rose-500 text-white border-transparent shadow-lg shadow-rose-500/20"
                          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:border-rose-200 hover:text-rose-500"
                      }`}
                    >
                      <Ban size={14} />{" "}
                      {editDraft.isBlocked ? "Will Suspend" : "Suspend User"}
                    </button>
                    <button
                      disabled={loading}
                      onClick={() =>
                        updateDraft("isVerified", !editDraft.isVerified)
                      }
                      className={`flex items-center justify-center gap-2 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                        editDraft.isVerified
                          ? "bg-blue-600 text-white border-transparent shadow-lg shadow-blue-500/20"
                          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:border-blue-200 hover:text-blue-500"
                      }`}
                    >
                      <ShieldCheck size={14} />{" "}
                      {editDraft.isVerified ? "Verified" : "Verify Citizen"}
                    </button>
                  </div>

                  <div className="p-6 bg-slate-900 dark:bg-black rounded-[2rem] text-white">
                    <h5 className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                      <Fingerprint size={12} className="text-emerald-500" />{" "}
                      Digital Trace
                    </h5>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-[11px] border-b border-white/5 pb-2">
                        <span className="font-bold text-slate-400">
                          Account Created
                        </span>
                        <span className="font-mono">
                          {new Date(selectedUser.joinedAt).toDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="font-bold text-slate-400">
                          Current Role
                        </span>
                        <span className="font-mono text-emerald-400 uppercase">
                          {editDraft.role}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex gap-3 mb-12">
                    <button
                      disabled={loading}
                      onClick={handleFinalUpdate}
                      className="flex-1 py-4 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 disabled:opacity-50"
                    >
                      <Save size={16} />{" "}
                      {loading ? "Syncing..." : "Update Identity"}
                    </button>
                    <button
                      onClick={() => setOpen(true)}
                      className="w-16 py-4 border-2 border-dashed border-rose-500/20 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white hover:border-transparent transition-all flex items-center justify-center"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <ConfirmDeleteModal
                    open={open}
                    onClose={() => setOpen(false)}
                    onConfirm={() => handleDelete(selectedUser._id)}
                    loading={loading}
                  />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200..800&display=swap');
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: #10b981; border-radius: 10px; }
      `,
        }}
      />
    </div>
  );
}
