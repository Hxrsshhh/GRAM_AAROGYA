"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Save,
  ShieldCheck,
  ShieldAlert,
  Archive,
  MapPin,
  Clock,
  User,
  Send,
  ThumbsUp,
  Eye,
  Trash2,
  ExternalLink,
  Lock,
  ChevronRight,
  Activity,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { InfoCard } from "@/components/ui/InfoCard";
import { Stat } from "@/components/ui/Stat";
import { ToggleButton } from "@/components/ui/ToggleButton";
import { SelectField } from "@/components/ui/Selectefield";

import ConfirmIssueDeleteModal from "@/components/modals/confirmdeletIssueModal";
import Image from "next/image";
import { toast } from "sonner";

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

export default function IssueDetail() {
  const [issue, setIssue] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/issues/${id}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setIssue(data);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchIssue();
  }, [id]);

  const handleUpdateLocal = (field, value) => {
    setIssue((prev) => ({ ...prev, [field]: value }));
  };

  const addComment = async () => {
    if (!commentText.trim() || !issue) return;
    const adminId = session?.user?.id;
    try {
      const res = await fetch(`/api/admin/issues/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comment: {
            text: commentText,
            createdBy: adminId,
            createdAt: new Date(),
          },
        }),
      });
      if (res.ok) {
        const updatedData = await res.json();
        setIssue(updatedData);
        setCommentText("");
        toast.success('Comment Added Successfully');
      }
    } catch (err) {
      console.error("Comment Error:", err);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const res = await fetch(`/api/admin/issues/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: issue.status,
          priority: issue.priority,
          category: issue.category,
          isVerified: issue.isVerified,
          isArchived: issue.isArchived,
        }),
      });
      if (!res.ok) throw new Error("Update failed");
      toast.success("Database synced successfully");
    } catch (err) {
      toast.error("Error updating record");
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!confirm("CRITICAL: Permanently delete this record?")) return;
    try {
      const res = await fetch(`/api/admin/issues/${id}`, { method: "DELETE" });
      if (res.ok) router.push("/admin/issues");
      setDeleteModalOpen(false);
    } catch (err) {
      console.error("Delete Error:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading)
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-4 border-emerald-500/10 border-t-emerald-500 animate-spin" />
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">
            Loading Intelligence
          </p>
        </div>
      </div>
    );

  if (!issue)
    return (
      <div className="h-screen flex items-center justify-center font-bold">
        Record Missing.
      </div>
    );

  return (
    <div className="h-screen w-full flex flex-col bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]">
      {/* --- HEADER / MOBILE BOTTOM DOCK --- */}
      {/* Fixed to bottom on mobile, stays at top on desktop */}
      <header className="fixed bottom-0 left-0 z-100 right-0 lg:relative lg:bottom-auto h-16 lg:h-14 flex-shrink-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t lg:border-t-0 lg:border-b border-slate-200 dark:border-slate-800  shadow-[0_-10px_25px_rgba(0,0,0,0.1)] lg:shadow-none">
        <div className="max-w-7xl mx-auto h-full px-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2.5 bg-slate-100 dark:bg-slate-800 lg:bg-transparent hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all active:scale-90"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="hidden md:block">
              <div className="flex items-center gap-2">
                <p className="text-[8px] font-black uppercase tracking-widest text-emerald-500">
                  Node Cluster
                </p>
                <ChevronRight size={8} className="text-slate-400" />
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                  ID: {issue._id}
                </p>
              </div>
              <h2 className="text-xs font-black truncate leading-none mt-1">
                Issue Management Console
              </h2>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-5 lg:px-4 py-2.5 lg:py-2 rounded-xl lg:rounded-lg text-[10px] lg:text-[9px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
          >
            {isSaving ? (
              "Syncing..."
            ) : (
              <>
                <Save size={14} />{" "}
                <span className="hidden xs:inline">Sync Database</span>
                <span className="xs:hidden">Sync...</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* --- DASHBOARD VIEWPORT --- */}
      <div className="flex-1 overflow-y-auto lg:overflow-hidden pb-24 lg:pb-0">
        <main className="max-w-7xl mx-auto h-full flex flex-col lg:flex-row p-4 md:p-6 gap-6">
          <div className="w-full lg:flex-2 flex flex-col gap-6 lg:overflow-y-auto lg:pr-2 custom-scrollbar">
            <section className="bg-white mt-16 dark:bg-slate-900/50 rounded-2xl p-2 md:p-3 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0 shadow-sm">
              <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl w-full sm:w-auto overflow-x-auto scrollbar-hide">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleUpdateLocal("status", s)}
                    className={`flex-1 sm:flex-none px-4 md:px-6 py-2 rounded-lg text-[9px] font-black uppercase transition-all whitespace-nowrap ${
                      issue.status === s
                        ? "bg-white dark:bg-slate-800 text-emerald-500 shadow-sm"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-center">
                <ToggleButton
                  label="Verified"
                  active={issue.isVerified}
                  onClick={() =>
                    handleUpdateLocal("isVerified", !issue.isVerified)
                  }
                  ActiveIcon={ShieldCheck}
                  InactiveIcon={ShieldAlert}
                  activeClass="bg-blue-500/10 border-blue-500/30 text-blue-500"
                />
                <ToggleButton
                  label="Archive"
                  active={issue.isArchived}
                  onClick={() =>
                    handleUpdateLocal("isArchived", !issue.isArchived)
                  }
                  ActiveIcon={Archive}
                  InactiveIcon={Archive}
                  activeClass="bg-amber-500/10 border-amber-500/30 text-amber-500"
                />
              </div>
            </section>

            {/* DETAIL CARD */}
            <section className="bg-white dark:bg-slate-900 rounded-[1.5rem] lg:rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden shrink-0">
              {issue.isArchived && (
                <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[2px] z-10 flex items-center justify-center pointer-events-none">
                  <div className="bg-amber-500 text-white px-6 py-2 rounded-full font-black uppercase tracking-[0.2em] text-[9px] shadow-2xl flex items-center gap-2">
                    <Lock size={14} /> Locked Record
                  </div>
                </div>
              )}

              <div className="p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <SelectField
                    label="Priority"
                    value={issue.priority}
                    options={PRIORITIES}
                    onChange={(v) => handleUpdateLocal("priority", v)}
                  />
                  <SelectField
                    label="Category"
                    value={issue.category}
                    options={CATEGORIES}
                    onChange={(v) => handleUpdateLocal("category", v)}
                  />
                </div>
                <h1 className="text-2xl lg:text-3xl font-black mb-4 tracking-tight leading-tight">
                  {issue.title}
                </h1>
                <div className="p-4 lg:p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800/50 mb-6">
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-xs lg:text-sm">
                    {issue.description}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InfoCard
                    icon={<MapPin size={14} />}
                    label="Location"
                    value={issue.location?.address}
                    color="text-emerald-500"
                  />
                  <InfoCard
                    icon={<Clock size={14} />}
                    label="Timestamp"
                    value={new Date(issue.createdAt).toLocaleString()}
                    color="text-blue-500"
                  />
                </div>
              </div>

              {/* IMAGES */}
              <div className="px-6 lg:px-8 pb-8">
                <p className="text-[9px] font-black uppercase text-slate-400 mb-4 tracking-widest">
                  Attachments
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {issue.images?.map((img, i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 group relative"
                    >
                      <div className="relative w-full h-full overflow-hidden">
                        <Image
                          src={img}
                          alt="Evidence"
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 400px"
                        />
                      </div>

                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <ExternalLink className="text-white" size={16} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT ACTIVITY COLUMN */}
          <aside className="w-full lg:w-[380px] flex flex-col gap-6 lg:overflow-hidden">
            <section className="bg-emerald-600 rounded-[1.5rem] p-5 text-white grid grid-cols-2 gap-2 shadow-xl shadow-emerald-600/20 flex-shrink-0">
              <Stat
                icon={<ThumbsUp size={14} />}
                label="Upvotes"
                value={issue.upvotes}
              />
              <Stat
                icon={<Eye size={14} />}
                label="Views"
                value={issue.viewCount}
              />
            </section>

            {/* CHAT/LOGS - Constrained height on mobile for 3-4 comments visibility */}
            <section className="h-105 lg:h-auto lg:flex-1 bg-white dark:bg-slate-900 rounded-[1.5rem] lg:rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden">
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shrink-0">
                <div className="flex items-center gap-2">
                  <Activity size={16} className="text-emerald-500" />
                  <h3 className="text-[9px] font-black uppercase tracking-widest">
                    Internal Activity
                  </h3>
                </div>
                <span className="text-[8px] font-bold bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                  {issue.comments?.length || 0} LOGS
                </span>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
                <AnimatePresence mode="popLayout">
                  {issue.comments?.map((comment, idx) => (
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={idx}
                      className="flex gap-3"
                    >
                      <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 border border-slate-200 dark:border-slate-700">
                        <User size={12} className="text-slate-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[11px] leading-relaxed p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                          {comment.text}
                        </p>
                        <div className="flex justify-between items-center mt-1.5 px-1">
                          <span className="text-[8px] font-black text-emerald-500 uppercase">
                            {comment.createdBy?.name || "System"}
                          </span>
                          <span className="text-[8px] font-bold text-slate-400">
                            {new Date(comment.createdAt).toLocaleTimeString(
                              [],
                              { hour: "2-digit", minute: "2-digit" }
                            )}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 flex-shrink-0">
                <div className="relative">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a log entry..."
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 pr-10 text-[11px] font-bold outline-none focus:ring-4 ring-emerald-500/10 transition-all resize-none h-[50px]"
                  />
                  <button
                    onClick={addComment}
                    disabled={!commentText.trim()}
                    className="absolute right-1 bottom-3 p-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white rounded-lg transition-all"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </div>
            </section>

            {/* ACTION FOOTER */}
            <section className="bg-white mb-20 dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 flex-shrink-0">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-emerald-500/10 text-emerald-500 rounded-lg flex items-center justify-center">
                  <User size={16} />
                </div>
                <div>
                  <p className="text-[9px] font-black">
                    {issue.reportedBy?.name || "Reporter"}
                  </p>
                  <p className="text-[8px] font-bold text-slate-400">
                    {issue.reportedBy?.email || "No email"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDeleteModalOpen(true)}
                className="w-full py-2.5 rounded-xl bg-rose-500/10 text-rose-500 text-[9px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <Trash2 size={12} /> Purge
              </button>

              <ConfirmIssueDeleteModal
                open={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                loading={isDeleting}
                issueTitle={issue?.title}
              />
            </section>
          </aside>
        </main>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200..800&display=swap');
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #10b981; border-radius: 10px; }
        
        @media (min-width: 1024px) {
          body { overflow: hidden; }
        }

        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `,
        }}
      />
    </div>
  );
}
