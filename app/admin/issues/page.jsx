"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  RefreshCcw,
  Download,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";

import ConfirmIssueDeleteModal from "@/components/modals/confirmdeletIssueModal";

const CATEGORIES = [
  "All",
  "infrastructure",
  "utilities",
  "sanitation",
  "safety",
  "environment",
  "traffic",
  "other",
];
const STATUSES = ["All", "pending", "in-progress", "resolved"];

import { IncidentCard } from "@/components/layouts/IncidentCard";
import { getAllIssues } from "@/app/api/issues";
import Link from "next/link";
import { toast } from "sonner";

IncidentCard.displayName = "IncidentCard";

export default function Issues() {
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [filterStat, setFilterStat] = useState("All");
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true); // New Loading State

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true);
        const data = await getAllIssues();
        if (!data) throw new Error("Failed to fetch issues");
        setIssues(data.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to establish uplink with data vault.");
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, []);

  const filtered = useMemo(() => {
    return issues.filter((i) => {
      const title = i.title?.toLowerCase() || "";
      const id = (i.id || i._id || "").toString().toLowerCase();
      const searchTerm = search.toLowerCase();
      const matchSearch = title.includes(searchTerm) || id.includes(searchTerm);
      const matchCat = filterCat === "All" || i.category === filterCat;
      const matchStat = filterStat === "All" || i.status === filterStat;
      return matchSearch && matchCat && matchStat;
    });
  }, [search, filterCat, filterStat, issues]);

  const handleDeleteClick = (issue) => {
    setSelectedIssue(issue);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedIssue) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/issues/${selectedIssue._id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        setIssues((prevIssues) =>
          prevIssues.filter((issue) => issue._id !== selectedIssue._id)
        );
        setDeleteModalOpen(false);
        toast.success("Issue deleted Successfully");
      } else {
        const errorData = await res.json();
        toast.error(`Error: ${errorData.message || "Failed to delete"}`);
      }
    } catch (err) {
      console.error("Delete Error:", err);
      toast.error("System communication failure during purge.");
    } finally {
      setIsDeleting(false);
      setSelectedIssue(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-500 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Background patterns */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] bg-size-[32px_32px] opacity-20" />
      </div>

      <div className="relative z-10">
        {/* Header Section */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 pt-18 md:pt-12">
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 lg:gap-8">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2 group cursor-default">
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </div>
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 group-hover:text-emerald-500 transition-colors">
                  Security & Infrastructure // Live
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-[0.85] text-slate-900 dark:text-white">
                Incident{" "}
                <span className="text-emerald-500 italic drop-shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                  Vault.
                </span>
              </h1>

              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight max-w-md line-clamp-1 opacity-80">
                Centralized node management & encrypted record storage
              </p>
            </div>

            <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto">
              <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 md:px-6 py-3.5 rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:border-emerald-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all shadow-sm active:scale-95">
                <Download size={14} className="text-emerald-500" />
                <span className="hidden xs:inline">Export CSV</span>
                <span className="xs:hidden">Export</span>
              </button>

              <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 md:px-7 py-3.5 rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-emerald-600/20 active:scale-95 group">
                <RefreshCcw
                  size={14}
                  className="group-hover:rotate-180 transition-transform duration-500"
                />
                <span>Global Sync</span>
              </button>
            </div>
          </header>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent mt-8 opacity-50" />
        </div>

        <div className="sticky top-14 lg:top-0 z-50 py-4 px-6 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-transparent transition-all duration-300">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-4 lg:p-6 shadow-sm">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="relative flex-1 group">
                  <Search
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Search by ID, Title, or Keyword..."
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-3.5 pl-12 pr-6 outline-none focus:ring-4 ring-emerald-500/10 focus:border-emerald-500 transition-all text-xs font-semibold shadow-inner"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <div className="hidden lg:flex flex-wrap items-center gap-4">
                  <div className="flex flex-col gap-1.5 min-w-[140px]">
                    <span className="text-[8px] font-black uppercase text-slate-400 px-1 ml-1 tracking-wider">
                      Asset Domain
                    </span>
                    <select
                      className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-[10px] font-bold outline-none cursor-pointer hover:border-emerald-500 transition-all appearance-none"
                      value={filterCat}
                      onChange={(e) => setFilterCat(e.target.value)}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-[8px] font-black uppercase text-slate-400 px-1 ml-1 tracking-wider">
                      Current Protocol
                    </span>
                    <div className="flex bg-white dark:bg-slate-950 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto scrollbar-hide">
                      {STATUSES.map((s) => (
                        <button
                          key={s}
                          onClick={() => setFilterStat(s)}
                          className={`px-3 py-1.5 rounded-lg text-[9px] whitespace-nowrap font-black transition-all ${
                            filterStat === s
                              ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                              : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <main className="p-2 px-6 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {loading
                ? // LOADING SKELETON UI
                  [...Array(6)].map((_, i) => (
                    <div
                      key={`skeleton-${i}`}
                      className="h-64 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 animate-pulse"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="h-6 w-1/2 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                        <div className="h-6 w-12 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                      </div>
                      <div className="space-y-3">
                        <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded" />
                        <div className="h-3 w-5/6 bg-slate-200 dark:bg-slate-800 rounded" />
                      </div>
                      <div className="mt-8 flex gap-3">
                        <div className="h-8 w-20 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                        <div className="h-8 w-20 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                      </div>
                      <div className="mt-6 h-10 w-full bg-slate-100 dark:bg-slate-800/50 rounded-xl" />
                    </div>
                  ))
                : // REAL DATA
                  filtered.map((issue, idx) => (
                    <Link
                      href={`/admin/issues/${issue._id}`}
                      key={issue._id}
                      className="block transform transition-transform duration-300 hover:-translate-y-1"
                    >
                      <IncidentCard
                        issue={issue}
                        idx={idx}
                        onDelete={() => handleDeleteClick(issue)}
                      />
                    </Link>
                  ))}

              <ConfirmIssueDeleteModal
                open={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                loading={isDeleting}
                issueTitle={selectedIssue?.title}
              />
            </AnimatePresence>
          </div>

          {!loading && filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-32 flex flex-col items-center justify-center text-slate-300 dark:text-slate-700 text-center"
            >
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mb-6">
                <ShieldAlert size={40} strokeWidth={1} />
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2 uppercase tracking-tight">
                Zero Matches Found
              </h2>
              <p className="text-[10px] font-medium text-slate-500 max-w-xs uppercase tracking-widest leading-loose">
                Adjust your filter parameters or search query.
              </p>
            </motion.div>
          )}

          <footer className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-lg transition-colors">
            <div className="flex items-center gap-4">
              <div className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em]">
                Active Archive:{" "}
                <span className="text-emerald-500">
                  {loading ? "..." : filtered.length}
                </span>
              </div>
              <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800" />
              <div className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em]">
                Total: {loading ? "..." : issues.length}
              </div>
            </div>

            <div className="flex items-center gap-6">
              <span className="text-[9px] font-black text-slate-500 tracking-widest uppercase">
                Page 01 // 01
              </span>
              <div className="flex gap-2">
                <button
                  className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-emerald-500 hover:text-white transition-all text-slate-400 disabled:opacity-30 disabled:pointer-events-none"
                  disabled
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-emerald-500 hover:text-white transition-all text-slate-400 disabled:opacity-30 disabled:pointer-events-none"
                  disabled
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </footer>
        </main>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200..800&display=swap');
          
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }

          ::-webkit-scrollbar {
            width: 6px;
          }
          ::-webkit-scrollbar-track {
            background: transparent;
          }
          ::-webkit-scrollbar-thumb {
            background: #10b981;
            border-radius: 20px;
          }
        `,
        }}
      />
    </div>
  );
}
