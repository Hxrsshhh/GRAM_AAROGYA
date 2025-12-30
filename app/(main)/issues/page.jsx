"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";

import { Badge } from "@/components/ui/Issue-badge";
import { Card } from "@/components/ui/Issue-card";

import Link from "next/link";
import { getAllIssues } from "@/app/api/issues";

export default function App() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    async function loadIssues() {
      try {
        setLoading(true);
        const res = await getAllIssues();
        setIssues(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadIssues();
  }, []);

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch =
      issue.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || issue.status === selectedStatus;
    const matchesCategory =
      selectedCategory === "all" || issue.category === selectedCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const statuses = ["all", "pending", "in-progress", "resolved", "rejected"];
  const categories = [
    "all",
    "infrastructure",
    "sanitation",
    "safety",
    "environment",
    "utilities",
    "traffic",
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-slate-950">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-emerald-500/20 rounded-full"></div>
            <div className="absolute top-0 w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
              Syncing Pulse
            </h2>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-1">
              Accessing Community Data...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen  flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden">
      {/* HEADER SECTION - Fixed Height */}
      <div className="bg-white  dark:bg-slate-950/30 border-b border-slate-200 dark:border-slate-800 pt-12 pb-8 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-6 mt-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
                  Live Community Feed
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900 dark:text-white">
                Public{" "}
                <span className="text-emerald-500 underline decoration-emerald-500/30 underline-offset-8">
                  Issues
                </span>
              </h1>
            </div>

            <div className="flex gap-3">
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-5 py-2 text-center">
                <p className="text-xl font-black text-emerald-600">
                  {issues.length}
                </p>
                <p className="text-[8px] font-black uppercase text-emerald-600/60 tracking-widest">
                  Reports
                </p>
              </div>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl px-5 py-2 text-center">
                <p className="text-xl font-black text-amber-600">
                  {issues.filter((i) => i.status === "pending").length}
                </p>
                <p className="text-[8px] font-black uppercase text-amber-600/60 tracking-widest">
                  Awaiting
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA - Fills remaining height, no body scroll */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 h-full py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
            {/* LEFT: FILTERS - Static */}
            <div className="lg:col-span-4 hidden lg:block">
              <Card className="border-emerald-500/10 h-auto">
                <div className="flex items-center gap-2 mb-6">
                  <Filter className="w-5 h-5 text-emerald-500" />
                  <h3 className="font-black uppercase tracking-widest text-sm">
                    Refine Feed
                  </h3>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">
                      Search
                    </label>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Keyword..."
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm font-bold"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">
                      Category
                    </label>
                    <div className="relative group">
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl appearance-none focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm font-bold capitalize cursor-pointer"
                      >
                        {categories.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 rotate-90 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">
                      Status
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {statuses.map((status) => (
                        <button
                          key={status}
                          onClick={() => setSelectedStatus(status)}
                          className={`px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                            selectedStatus === status
                              ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/30"
                              : "bg-slate-50 dark:bg-slate-800/50 text-slate-500 hover:bg-slate-100"
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* RIGHT: LIST - Independently Scrollable */}
            <div className="lg:col-span-8 flex flex-col h-full overflow-hidden">
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <div className="grid grid-cols-1 gap-4 pb-12">
                  <AnimatePresence mode="popLayout">
                    {filteredIssues.map((issue, index) => (
                      <motion.div
                        key={issue._id}
                        layout
                        initial={{ opacity: 0, scale: 0.98, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2, delay: index * 0.03 }}
                      >
                        <Link href={`/issues/${issue._id}`}>
                          <Card
                            hover
                            className="group overflow-hidden border-l-4 border-l-transparent hover:border-l-emerald-500"
                          >
                            <div className="flex flex-col sm:flex-row gap-6">
                              <div className="relative w-full sm:w-28 h-28 flex-shrink-0">
                                <img
                                  src={
                                    issue.images?.[0] ||
                                    `https://ui-avatars.com/api/?name=${issue.category}&background=random&size=128`
                                  }
                                  alt=""
                                  className="w-full h-full rounded-2xl object-cover"
                                />
                              </div>

                              <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                                <div>
                                  <div className="flex items-start justify-between gap-4 mb-2">
                                    <h3 className="font-black text-base tracking-tight text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors line-clamp-1">
                                      {issue.title}
                                    </h3>
                                    <Badge variant={issue.status}>
                                      {issue.status}
                                    </Badge>
                                  </div>
                                  <p className="text-slate-500 dark:text-slate-400 text-xs font-medium line-clamp-2 mb-4">
                                    {issue.description}
                                  </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-[9px] font-black uppercase tracking-widest text-slate-400">
                                  <span className="flex items-center gap-1.5">
                                    <MapPin className="w-3 h-3 text-emerald-500" />
                                    {issue.address?.split(",")[0] || "Zone A"}
                                  </span>
                                  <span className="flex items-center gap-1.5">
                                    <Calendar className="w-3 h-3 text-emerald-500" />
                                    {new Date(
                                      issue.createdAt
                                    ).toLocaleDateString()}
                                  </span>
                                  <span className="flex items-center gap-1.5 ml-auto text-emerald-600 font-black">
                                    Details{" "}
                                    <ArrowUpRight className="w-2.5 h-2.5" />
                                  </span>
                                </div>
                              </div>
                            </div>
                          </Card>
                        </Link>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {filteredIssues.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <Card className="text-center py-20 bg-slate-50/50 dark:bg-slate-900/50 border-dashed border-2">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                          <Search className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                          Empty Feed
                        </h3>
                        <p className="text-slate-500 font-bold text-xs mt-2">
                          Try changing your filters.
                        </p>
                      </Card>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e293b;
        }
      `}</style>
    </div>
  );
}
