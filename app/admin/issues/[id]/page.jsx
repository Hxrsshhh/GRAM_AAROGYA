"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Save,
  ShieldCheck,
  ShieldAlert,
  Archive,
  MessageSquare,
  MapPin,
  Clock,
  User,
  AlertTriangle,
  Send,
  ThumbsUp,
  Eye,
  Trash2,
  Mic,
  Image as ImageIcon,
  ExternalLink,
  History,
  Lock,
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

// --- Mock Data representing a Mongoose Document ---
const INITIAL_ISSUE = {
  _id: "64a2f1b2c9e4b30012345678",
  title: "Critical Water Main Rupture - Sector 7",
  description:
    "A major water line has burst near the central intersection, causing significant flooding and loss of pressure to approximately 200 residential units. Immediate excavation required.",
  category: "infrastructure",
  priority: "High",
  status: "in-progress", // enum: ["pending", "in-progress", "resolved"]
  isVerified: false,
  isArchived: false,
  location: {
    address: "123 North Sector Blvd, Metro City",
    lat: 12.9716,
    lng: 77.5946,
    coordinates: "12.9716, 77.5946",
  },
  images: [
    "https://images.unsplash.com/photo-1584464431734-601962383c27?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1542044896530-05d85be9b11a?auto=format&fit=crop&q=80&w=800",
  ],
  voiceNote: "https://example.com/audio/voice_note_01.mp3",
  upvotes: 42,
  viewCount: 158,
  reportedBy: {
    _id: "u123",
    name: "Alex Rivera",
    email: "arivera@city.gov",
  },
  comments: [
    {
      _id: "c1",
      text: "Excavation team dispatched at 0800 hrs.",
      createdBy: { name: "John Foreman" },
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      _id: "c2",
      text: "Traffic police notified to redirect vehicles.",
      createdBy: { name: "Sarah Traffic" },
      createdAt: new Date(Date.now() - 43200000).toISOString(),
    },
  ],
  createdAt: new Date(Date.now() - 172800000).toISOString(),
  updatedAt: new Date().toISOString(),
};

const CATEGORIES = [
  "infrastructure",
  "utilities",
  "sanitation",
  "safety",
  "environment",
  "traffic",
  "other",
];
const STATUSES = ["pending", "in-progress", "resolved"];
const PRIORITIES = ["Low", "Medium", "High", "Critical"];

export const IssueDetail = () => {
  const { theme } = useTheme();
  const [issue, setIssue] = useState(INITIAL_ISSUE);
  const [commentText, setCommentText] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdate = (field, value) => {
    setIssue((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call to backend Mongoose endpoint
    setTimeout(() => {
      setIsSaving(false);
    }, 1200);
  };

  const addComment = () => {
    if (!commentText.trim()) return;
    const newComment = {
      _id: Math.random().toString(),
      text: commentText,
      createdBy: { name: "Admin Manager" },
      createdAt: new Date().toISOString(),
    };
    setIssue((prev) => ({ ...prev, comments: [...prev.comments, newComment] }));
    setCommentText("");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-500 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              <ArrowLeft size={20} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">
                  Admin Oversight
                </p>
                {issue.isArchived && (
                  <span className="bg-amber-500/10 text-amber-500 text-[8px] font-black uppercase px-2 py-0.5 rounded border border-amber-500/20">
                    Archived
                  </span>
                )}
              </div>
              <h2 className="text-sm font-bold truncate max-w-[200px] md:max-w-md">
                ID: {issue._id}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-600/20"
            >
              {isSaving ? (
                "Syncing..."
              ) : (
                <>
                  <Save size={14} /> Update Record
                </>
              )}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Editor & Logs */}
        <div className="lg:col-span-2 space-y-8">
          {/* TOP ADMIN BAR: Status, Verify, Archive */}
          <section className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
              {/* Status Switcher (Maps to Mongoose enum) */}
              <div className="w-full md:w-auto flex-1">
                <label className="text-[9px] font-black uppercase text-slate-400 mb-2 block tracking-widest flex items-center gap-2">
                  <History size={10} /> Lifecycle Status
                </label>
                <div className="flex bg-slate-100 dark:bg-slate-950 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                  {STATUSES.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleUpdate("status", s)}
                      className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${
                        issue.status === s
                          ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Boolean Toggles: Verify and Archive */}
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-center gap-2">
                  <button
                    onClick={() =>
                      handleUpdate("isVerified", !issue.isVerified)
                    }
                    className={`p-4 rounded-2xl border-2 transition-all ${
                      issue.isVerified
                        ? "bg-blue-500/10 border-blue-500 text-blue-500"
                        : "border-slate-200 dark:border-slate-800 text-slate-300 hover:border-blue-500/50"
                    }`}
                  >
                    {issue.isVerified ? (
                      <ShieldCheck size={24} />
                    ) : (
                      <ShieldAlert size={24} />
                    )}
                  </button>
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                    Verify
                  </span>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <button
                    onClick={() =>
                      handleUpdate("isArchived", !issue.isArchived)
                    }
                    className={`p-4 rounded-2xl border-2 transition-all ${
                      issue.isArchived
                        ? "bg-amber-500/10 border-amber-500 text-amber-500"
                        : "border-slate-200 dark:border-slate-800 text-slate-300 hover:border-amber-500/50"
                    }`}
                  >
                    <Archive size={24} />
                  </button>
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                    Archive
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Issue Content Detail */}
          <section className="bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm relative">
            {issue.isArchived && (
              <div className="absolute inset-0 bg-slate-950/10 backdrop-blur-[1px] z-10 pointer-events-none flex items-center justify-center">
                <div className="bg-amber-500 text-white px-6 py-2 rounded-full font-black uppercase tracking-[0.2em] text-xs flex items-center gap-2 shadow-2xl">
                  <Lock size={14} /> Read Only Mode (Archived)
                </div>
              </div>
            )}

            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex flex-col gap-1">
                  <label className="text-[8px] font-black uppercase text-slate-400 tracking-widest">
                    Priority Tier
                  </label>
                  <select
                    value={issue.priority}
                    onChange={(e) => handleUpdate("priority", e.target.value)}
                    className="bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-xs font-bold px-3 py-1 outline-none"
                  >
                    {PRIORITIES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[8px] font-black uppercase text-slate-400 tracking-widest">
                    Category
                  </label>
                  <select
                    value={issue.category}
                    onChange={(e) => handleUpdate("category", e.target.value)}
                    className="bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-xs font-bold px-3 py-1 outline-none"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <h1 className="text-3xl font-black mb-4 leading-tight">
                {issue.title}
              </h1>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm mb-8 bg-slate-50 dark:bg-slate-950/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                {issue.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-emerald-500 mb-1">
                    <MapPin size={14} />
                    <span className="text-[10px] font-black uppercase">
                      Address
                    </span>
                  </div>
                  <p className="text-xs font-bold">{issue.location.address}</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-blue-500 mb-1">
                    <Clock size={14} />
                    <span className="text-[10px] font-black uppercase">
                      Reported
                    </span>
                  </div>
                  <p className="text-xs font-bold">
                    {new Date(issue.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Evidence Gallery */}
            <div className="px-8 pb-8">
              <label className="text-[9px] font-black uppercase text-slate-400 mb-4 block tracking-widest">
                Attached Evidence
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {issue.images.map((img, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 group relative"
                  >
                    <img
                      src={img}
                      className="w-full h-full object-cover"
                      alt="Evidence"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <ExternalLink className="text-white" size={20} />
                    </div>
                  </div>
                ))}
                <button className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-slate-400 hover:border-emerald-500 hover:text-emerald-500 transition-all">
                  <ImageIcon size={24} />
                  <span className="text-[9px] font-black uppercase mt-2">
                    Upload
                  </span>
                </button>
              </div>
            </div>
          </section>

          {/* Activity / Comments Feed */}
          <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <MessageSquare className="text-emerald-500" />
                <h3 className="text-lg font-black tracking-tight">
                  Case Activity
                </h3>
              </div>
              <span className="text-xs font-bold text-slate-400">
                {issue.comments.length} Comments
              </span>
            </div>

            <div className="space-y-6 mb-8">
              <AnimatePresence mode="popLayout">
                {issue.comments.map((comment) => (
                  <motion.div
                    key={comment._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex gap-4"
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                      <User size={18} className="text-slate-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-black uppercase">
                          {comment.createdBy.name}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-sm border border-slate-100 dark:border-slate-800">
                        {comment.text}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="relative">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Log internal update or citizen response..."
                className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 pr-16 text-sm font-semibold outline-none focus:ring-2 ring-emerald-500/20 focus:border-emerald-500 min-h-[120px] transition-all"
              />
              <button
                onClick={addComment}
                className="absolute right-4 bottom-4 p-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-600/20 transition-all"
              >
                <Send size={18} />
              </button>
            </div>
          </section>
        </div>

        {/* Right Sidebar: Analytics & User Context */}
        <div className="space-y-8">
          {/* Engagement Card */}
          <div className="bg-emerald-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-emerald-600/20 relative overflow-hidden">
            <div className="grid grid-cols-2 gap-8 relative z-10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <ThumbsUp size={16} />
                  <span className="text-2xl font-black">{issue.upvotes}</span>
                </div>
                <p className="text-[9px] font-black uppercase opacity-70">
                  Upvotes
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Eye size={16} />
                  <span className="text-2xl font-black">{issue.viewCount}</span>
                </div>
                <p className="text-[9px] font-black uppercase opacity-70">
                  Total Views
                </p>
              </div>
            </div>
          </div>

          {/* Reporter Info */}
          <section className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h4 className="text-[10px] font-black uppercase text-slate-400 mb-6 tracking-[0.2em]">
              Reporter Identity
            </h4>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center">
                <User size={28} />
              </div>
              <div>
                <p className="text-sm font-black">{issue.reportedBy.name}</p>
                <p className="text-[10px] font-bold text-slate-400">
                  {issue.reportedBy.email}
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <button className="w-full py-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all">
                Internal Message
              </button>
              <button className="w-full py-3 border border-slate-200 dark:border-slate-800 rounded-xl text-[9px] font-black uppercase tracking-widest hover:border-emerald-500 transition-all">
                View User Profile
              </button>
            </div>
          </section>

          {/* Risk Actions */}
          <section className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="p-4 bg-rose-500/5 border border-rose-500/10 rounded-2xl mb-4 flex items-center gap-3">
              <AlertTriangle className="text-rose-500" size={18} />
              <span className="text-[10px] font-black uppercase text-rose-500">
                Hazardous Operations
              </span>
            </div>
            <button className="w-full py-3 rounded-xl bg-rose-500/10 text-rose-500 text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center gap-2">
              <Trash2 size={14} /> Purge This Record
            </button>
          </section>
        </div>
      </main>

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
      <IssueDetail />
    </ThemeProvider>
  );
}
