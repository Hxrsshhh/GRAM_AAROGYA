"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Search,
  UserPlus,
  ShieldCheck,
  Ban,
  Mail,
  Filter,
  ChevronRight,
  ChevronLeft,
  LayoutGrid,
  Clock,
  MessageSquare,
  MapPin,
  Phone,
  Award,
  ThumbsUp,
  UserCog,
  Save,
  Trash2,
  Info,
  Fingerprint,
  X,
} from "lucide-react";

// --- Theme Management ---
const ThemeContext = createContext({ theme: "dark", setTheme: () => {} });
const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("dark");
  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
const useTheme = () => useContext(ThemeContext);

// --- Mock Data ---
const MOCK_USERS = [
  {
    _id: "u1",
    username: "arivera_admin",
    name: "Alex Rivera",
    email: "arivera@city.gov",
    avatar: "/avatar1.jpg",
    phone: "+91 98765 43210",
    bio: "Chief Administrative Officer with over 10 years of experience in municipal governance.",
    role: "admin",
    status: "active",
    reputation: 150,
    reportsCount: 12,
    upvotesGiven: 450,
    location: { city: "New Delhi", state: "Delhi", country: "India" },
    isVerified: true,
    isBlocked: false,
    onboardingStatus: "completed",
    joinedAt: "2023-10-12T10:00:00Z",
    lastLoginAt: "2024-05-20T15:30:00Z",
    authProviders: [{ provider: "google" }],
  },
  {
    _id: "u2",
    username: "schen_user",
    name: "Sarah Chen",
    email: "schen@gmail.com",
    avatar: "/avatar2.jpg",
    phone: "+91 88888 77777",
    bio: "Community advocate interested in urban planning and green spaces.",
    role: "citizen",
    status: "active",
    reputation: 45,
    reportsCount: 5,
    upvotesGiven: 120,
    location: { city: "Mumbai", state: "Maharashtra", country: "India" },
    isVerified: false,
    isBlocked: false,
    onboardingStatus: "completed",
    joinedAt: "2023-11-05T08:20:00Z",
    lastLoginAt: "2024-05-18T09:15:00Z",
    authProviders: [],
  },
];

export const UserManagement = () => {
  const { theme } = useTheme();
  const [users, setUsers] = useState(MOCK_USERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const toggleStatus = (userId) => {
    setUsers(
      users.map((u) => {
        if (u._id === userId) {
          const nextStatus = u.status === "active" ? "suspended" : "active";
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  const handleUpdateUser = (updates) => {
    setUsers(
      users.map((u) => (u._id === selectedUser._id ? { ...u, ...updates } : u))
    );
    setSelectedUser((prev) => ({ ...prev, ...updates }));
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
      <nav className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 p-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500 rounded-xl text-white shadow-lg shadow-emerald-500/20">
              <Users size={24} />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight">
                User Directory
              </h1>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Governance & Permissions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search identity..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl py-2 pl-10 pr-4 text-xs font-semibold focus:ring-2 ring-emerald-500/20 outline-none transition-all"
              />
            </div>
            <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-600/20">
              <UserPlus size={14} /> Add Member
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => {
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
              {filteredUsers.map((user) => (
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
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-2xl font-black shadow-lg shadow-emerald-500/20 relative z-10">
                      {user.name.charAt(0)}
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
                      <p className="text-sm font-black">{user.reportsCount}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-auto">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:scale-[1.02] shadow-xl shadow-slate-900/10`}
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => toggleStatus(user._id)}
                      className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      <Ban size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Slide-over Detail Sidebar */}
      <AnimatePresence>
        {selectedUser && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedUser(null)}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-xl bg-white dark:bg-slate-900 shadow-2xl z-50 overflow-y-auto border-l border-slate-200 dark:border-slate-800"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    <UserCog className="text-emerald-500" size={20} />
                    <h3 className="font-black uppercase tracking-widest text-xs">
                      Identity Editor
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 mb-8">
                  <div className="flex items-center gap-6 mb-8">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-3xl bg-emerald-500 text-white flex items-center justify-center text-3xl font-black shadow-xl shadow-emerald-500/20">
                        {selectedUser.name.charAt(0)}
                      </div>
                      {selectedUser.isVerified && (
                        <div className="absolute -bottom-1 -right-1 p-1.5 bg-blue-500 text-white rounded-full border-4 border-white dark:border-slate-900 shadow-lg">
                          <ShieldCheck size={16} />
                        </div>
                      )}
                    </div>
                    <div>
                      <h2 className="text-xl font-black mb-1">
                        {selectedUser.name}
                      </h2>
                      <p className="text-sm font-bold text-slate-400">
                        @{selectedUser.username || "n/a"}
                      </p>
                      <div className="mt-2 flex gap-1.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                            selectedUser.role === "admin"
                              ? "bg-emerald-500 text-white"
                              : "bg-blue-500 text-white"
                          }`}
                        >
                          {selectedUser.role}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[8px] font-black uppercase text-slate-500">
                          {selectedUser.isBlocked
                            ? "Blocked"
                            : selectedUser.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3 text-sm font-bold text-slate-500">
                      <Mail size={16} className="text-slate-400" />{" "}
                      {selectedUser.email}
                    </div>
                    <div className="flex items-center gap-3 text-sm font-bold text-slate-500">
                      <MapPin size={16} className="text-slate-400" />{" "}
                      {selectedUser.location.city},{" "}
                      {selectedUser.location.state}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <p className="text-[8px] font-black uppercase text-slate-400 mb-1">
                      Reputation
                    </p>
                    <p className="text-lg font-black">
                      {selectedUser.reputation}
                    </p>
                  </div>
                  <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <p className="text-[8px] font-black uppercase text-slate-400 mb-1">
                      Reports
                    </p>
                    <p className="text-lg font-black">
                      {selectedUser.reportsCount}
                    </p>
                  </div>
                  <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <p className="text-[8px] font-black uppercase text-slate-400 mb-1">
                      Upvotes
                    </p>
                    <p className="text-lg font-black">
                      {selectedUser.upvotesGiven}
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">
                      System Role
                    </label>
                    <select
                      value={selectedUser.role}
                      onChange={(e) =>
                        handleUpdateUser({ role: e.target.value })
                      }
                      className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-3 text-xs font-bold outline-none"
                    >
                      <option value="citizen">Citizen</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() =>
                        handleUpdateUser({ isBlocked: !selectedUser.isBlocked })
                      }
                      className={`flex items-center justify-center gap-2 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                        selectedUser.isBlocked
                          ? "bg-rose-500 text-white border-transparent"
                          : "border-slate-200 dark:border-slate-800 text-slate-500"
                      }`}
                    >
                      <Ban size={14} />{" "}
                      {selectedUser.isBlocked ? "Unblock" : "Block User"}
                    </button>
                    <button
                      onClick={() =>
                        handleUpdateUser({
                          isVerified: !selectedUser.isVerified,
                        })
                      }
                      className={`flex items-center justify-center gap-2 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                        selectedUser.isVerified
                          ? "bg-blue-500 text-white border-transparent"
                          : "border-slate-200 dark:border-slate-800 text-slate-500"
                      }`}
                    >
                      <ShieldCheck size={14} />{" "}
                      {selectedUser.isVerified ? "Revoke Verified" : "Verify"}
                    </button>
                  </div>

                  <div className="p-6 bg-slate-50 dark:bg-slate-950/50 rounded-3xl border border-slate-200 dark:border-slate-800">
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                      <Fingerprint size={12} /> Registry Info
                    </h5>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="font-bold text-slate-500">Joined</span>
                        <span className="font-mono font-black">
                          {new Date(selectedUser.joinedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="font-bold text-slate-500">
                          Last Activity
                        </span>
                        <span className="font-mono font-black">
                          {new Date(
                            selectedUser.lastLoginAt
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button className="flex-1 py-3 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-500 transition-all flex items-center justify-center gap-2">
                      <Save size={14} /> Save Changes
                    </button>
                    <button className="p-3 border-2 border-dashed border-rose-500/30 text-rose-500 rounded-xl hover:bg-rose-500/10">
                      <Trash2 size={16} />
                    </button>
                  </div>
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
};

export default function App() {
  return (
    <ThemeProvider>
      <UserManagement />
    </ThemeProvider>
  );
}
