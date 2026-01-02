"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  MapPin,
  ArrowUpRight,
  ChevronDown,
} from "lucide-react";

import { Badge } from "@/components/ui/Issue-badge";
import { Card } from "@/components/ui/Issue-card";

import Link from "next/link";
import { getAllIssues } from "@/app/api/issues";
import Image from "next/image";
import { fireOneTimeToast } from "@/lib/oneTimeToast";

export default function App() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {

    fireOneTimeToast('IssueAdded','Issue Added Successfully');

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
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans overflow-hidden">
      <header className="hidden pt-16 md:block flex-shrink-0 z-50 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-md ">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
                  Live Community Feed
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-slate-900 dark:text-white">
                Public{" "}
                <span className="text-emerald-500 underline decoration-emerald-500/30 underline-offset-8">
                  Issues
                </span>
              </h1>
            </div>

            <div className="flex gap-3">
              <div className="flex-1 md:flex-none bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-5 py-2 text-center min-w-[100px]">
                <p className="text-lg md:text-xl font-black text-emerald-600 leading-none mb-1">
                  {issues.length}
                </p>
                <p className="text-[8px] font-black uppercase text-emerald-600/60 tracking-widest">
                  Reports
                </p>
              </div>
              <div className="flex-1 md:flex-none bg-amber-500/10 border border-amber-500/20 rounded-xl px-5 py-2 text-center min-w-[100px]">
                <p className="text-lg md:text-xl font-black text-amber-600 leading-none mb-1">
                  {issues.filter((i) => i.status === "pending").length}
                </p>
                <p className="text-[8px] font-black uppercase text-amber-600/60 tracking-widest">
                  Awaiting
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 min-h-0 max-w-7xl mx-auto w-full px-4 md:px-6 overflow-y-auto no-scrollbar lg:overflow-hidden">
        <style
          dangerouslySetInnerHTML={{
            __html: `
      .no-scrollbar::-webkit-scrollbar { display: none; }
      .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    `,
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
          {/* MOBILE SEARCH - Enhanced look only for small screens */}
          <aside className="lg:col-span-4 sticky top-16 md:top-0 z-40 lg:relative lg:top-0 md:py-4 pt-4 pb-2">
            <div className="lg:hidden absolute inset-0 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md -mx-4 h-full pointer-events-none" />

            <Card className="relative border-emerald-500/20 lg:border-emerald-500/10 p-1.5 md:p-4 lg:p-6 shadow-xl lg:shadow-none bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm lg:bg-white dark:lg:bg-slate-900 rounded-2xl lg:rounded-3xl">
              {/* Desktop Filter Title (Hidden on Mobile) */}
              <div className="hidden lg:flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-emerald-500" />
                  <h3 className="font-black uppercase tracking-widest text-sm">
                    Refine Feed
                  </h3>
                </div>
              </div>

              <div className="flex flex-col gap-4 lg:gap-6">
                <div className="w-full">
                  <label className="hidden lg:block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">
                    Search
                  </label>
                  <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500 lg:text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                    <input
                      type="text"
                      placeholder="Find an issue..."
                      className="w-full pl-11 pr-4 py-3.5 lg:py-3 bg-slate-100/50 lg:bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl lg:rounded-xl focus:ring-2 focus:ring-emerald-500/50 outline-none text-sm font-bold transition-all placeholder:text-slate-400"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                {/* Hidden on mobile, original layout on desktop */}
                <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-1 gap-4 lg:space-y-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">
                      Category
                    </label>
                    <div className="relative">
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl appearance-none outline-none text-sm font-bold capitalize"
                      >
                        {categories.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="md:col-span-2 lg:col-span-1">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">
                      Status
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {statuses.map((status) => (
                        <button
                          key={status}
                          onClick={() => setSelectedStatus(status)}
                          className={`px-3 py-2 rounded-lg text-[9px] font-black uppercase border transition-all ${
                            selectedStatus === status
                              ? "bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-500/30"
                              : "bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 text-slate-500"
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </aside>

          {/* FEED LIST */}
          <section className="lg:col-span-8 flex flex-col min-h-0 mt-8 md:mt-[-20px] ">
            <div className="flex-1 lg:overflow-y-auto no-scrollbar lg:py-8">
              <div className="space-y-4 pb-24">
                <AnimatePresence mode="popLayout">
                  {filteredIssues.map((issue, index) => (
                    <motion.div
                      key={issue._id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.03 }}
                    >
                      <Link href={`/issues/${issue._id}`}>
                        <Card
                          hover
                          className="group overflow-hidden border-l-4 border-l-transparent hover:border-l-emerald-500 p-4 md:p-5 bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800"
                        >
                          <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
                            <div className="relative w-full sm:w-32 h-44 sm:h-32 flex-shrink-0">
                              <div className="relative w-full h-full">
                                <Image
                                  src={
                                    issue.images?.[0] ||
                                    `https://ui-avatars.com/api/?name=${issue.category}`
                                  }
                                  alt={issue.category || "issue image"}
                                  fill
                                  className="rounded-xl object-cover"
                                  sizes="(max-width: 768px) 100vw, 200px"
                                />
                              </div>

                              <div className="absolute top-2 left-2 lg:hidden">
                                <Badge
                                  variant={issue.status}
                                  className="shadow-lg"
                                >
                                  {issue.status}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                              <div className="flex items-start justify-between gap-4 mb-2">
                                <h3 className="font-black text-lg tracking-tight text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors line-clamp-1">
                                  {issue.title}
                                </h3>
                                <div className="hidden lg:block">
                                  <Badge variant={issue.status}>
                                    {issue.status}
                                  </Badge>
                                </div>
                              </div>
                              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium line-clamp-2 mb-4">
                                {issue.description}
                              </p>
                              <div className="flex flex-wrap items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                                  <MapPin className="w-3.5 h-3.5 text-emerald-500" />{" "}
                                  {issue.address?.split(",")[0]}
                                </span>
                                <span className="flex items-center gap-1.5 text-emerald-600 font-black">
                                  View <ArrowUpRight className="w-3 h-3" />
                                </span>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
