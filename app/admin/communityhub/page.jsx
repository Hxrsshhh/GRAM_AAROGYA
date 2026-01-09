"use client";

import React, { useState } from "react";
import useSWR, { mutate } from "swr";
import { motion as fm, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  Clock,
  Vote,
  Heart,
  ThumbsDown,
  Plus,
  Send,
  X,
  ShieldAlert,
  AlertCircle,
  Info,
  ArrowDown,
  MessageSquare,
  Link as LinkIcon,
} from "lucide-react";

import MouseGlow from "@/components/ui/MouseGlow";
import Image from "next/image";

const fetcher = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

const AdminCommandCenter = () => {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [postType, setPostType] = useState("post");
  const [selectedLevel, setSelectedLevel] = useState("Normal");
  const [newContent, setNewContent] = useState("");
  const [pollOptions, setPollOptions] = useState([]);
  const [linkedIssueId, setLinkedIssueId] = useState(null);
  const {
    data: messages = [],
    mutate: mutateFeed,
    isLoading: feedLoading,
  } = useSWR("/api/admin/feed", fetcher, {
    refreshInterval: 5000,
    revalidateOnFocus: true,
    keepPreviousData: true,
  });

  const { data: issues = [], isLoading: issuesLoading } = useSWR(
    "/api/admin/feed/issues",
    fetcher,
    {
      refreshInterval: 60000,
    }
  );

  const levels = [
    {
      id: "Emergency",
      icon: <ShieldAlert size={12} />,
      color: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-50 dark:bg-rose-500/10",
      border: "border-rose-100 dark:border-rose-500/20",
    },
    {
      id: "Urgent",
      icon: <AlertCircle size={12} />,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-500/10",
      border: "border-amber-100 dark:border-amber-500/20",
    },
    {
      id: "Normal",
      icon: <Info size={12} />,
      color: "text-sky-600 dark:text-sky-400",
      bg: "bg-sky-50 dark:bg-sky-500/10",
      border: "border-sky-100 dark:border-sky-500/20",
    },
    {
      id: "Low",
      icon: <ArrowDown size={12} />,
      color: "text-slate-600 dark:text-slate-400",
      bg: "bg-slate-50 dark:bg-slate-500/10",
      border: "border-slate-200 dark:border-slate-500/20",
    },
  ];

  const addPollOption = () => {
    if (pollOptions.length < 5) {
      setPollOptions([...pollOptions, ""]);
    }
  };

  const removePollOption = (index) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async () => {
    if (!newContent.trim()) return;

    const filteredOptions = pollOptions.filter((opt) => opt.trim() !== "");

    const payload = {
      content: newContent,
      type: postType ,
      level: selectedLevel,
      linkedIssueId,
      ...(postType === "poll" && { options: filteredOptions }),
    };

    try {
      const response = await fetch("/api/admin/feed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        // This fixes the UI bug by telling SWR to refetch immediately
        mutateFeed();

        setNewContent("");
        setPollOptions(["", ""]);
        setLinkedIssueId(null);
        setIsAdminOpen(false);
      } else {
        let errorMessage = "Something went wrong";
        try {
          const errData = await response.json();
          errorMessage = errData?.error || errorMessage;
        } catch {}
        alert(errorMessage);
      }
    } catch (error) {
      console.error("Submission failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] text-slate-900 dark:text-slate-100 font-sans relative overflow-x-hidden selection:bg-emerald-500/30">
      <MouseGlow />

      <div className="container mx-auto max-w-5xl px-4 py-12 relative z-40">
        <div className="flex items-end justify-between pt-8 mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight uppercase leading-none text-slate-900 dark:text-white">
              Command <span className="text-emerald-500">Center</span>
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                  Live Operations
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsAdminOpen(!isAdminOpen)}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 active:scale-95 ${
              isAdminOpen
                ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg"
                : "bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500"
            }`}
          >
            {isAdminOpen ? <X size={20} /> : <Plus size={20} />}
          </button>
        </div>

        <AnimatePresence>
          {isAdminOpen && (
            <fm.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="mb-10"
            >
              <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />

                <div className="relative z-10 space-y-6">
                  <div className="flex gap-1.5 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl w-fit">
                    {["post", "poll"].map((type) => (
                      <button
                        key={type}
                        onClick={() => setPostType(type)}
                        className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          postType === type
                            ? "bg-white dark:bg-slate-700 shadow-sm text-emerald-600 ring-1 ring-black/5"
                            : "text-slate-400 hover:text-slate-600"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>

                  <textarea
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Describe the operational directive..."
                    className="w-full h-32 bg-slate-50 dark:bg-slate-950 border-none rounded-2xl p-5 text-sm font-medium text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:ring-1 focus:ring-emerald-500/50 outline-none resize-none transition-all"
                  />

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 px-1">
                        Link to Active Issue / Report
                      </label>
                      <select
                        value={linkedIssueId || ""}
                        onChange={(e) =>
                          setLinkedIssueId(e.target.value || null)
                        }
                        className="w-full bg-slate-50 dark:bg-slate-950 p-4 rounded-xl text-xs font-bold outline-none border-none focus:ring-1 focus:ring-emerald-500/50 appearance-none cursor-pointer"
                      >
                        <option value="">No linked issue</option>
                        {issues?.map((issue) => (
                          <option key={issue.id} value={issue.id}>
                            {issue.title} • {issue.priority}
                          </option>
                        ))}
                      </select>
                    </div>

                    {postType === "poll" && (
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 px-1">
                          Poll Options
                        </label>
                        <div className="grid grid-cols-1 gap-3">
                          {pollOptions.map((opt, i) => (
                            <fm.div
                              layout
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="flex items-center gap-2"
                            >
                              <input
                                value={opt}
                                onChange={(e) => {
                                  let next = [...pollOptions];
                                  next[i] = e.target.value;
                                  setPollOptions(next);
                                }}
                                placeholder={`Choice ${i + 1}`}
                                className="flex-1 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl text-xs font-bold outline-none border-none focus:ring-1 focus:ring-emerald-500/50"
                              />
                              {pollOptions.length > 2 && (
                                <button
                                  onClick={() => removePollOption(i)}
                                  className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-rose-500 transition-colors"
                                >
                                  <X size={16} />
                                </button>
                              )}
                            </fm.div>
                          ))}
                        </div>
                        {pollOptions.length < 6 && (
                          <button
                            onClick={addPollOption}
                            className="flex items-center gap-2 px-4 py-2 text-[9px] font-black uppercase tracking-widest text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/5 rounded-lg transition-all"
                          >
                            <Plus size={12} /> Add Option
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <div className="px-1">
                      <label className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-3 block">
                        Priority Protocol
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {levels.map((lvl) => (
                          <button
                            key={lvl.id}
                            onClick={() => setSelectedLevel(lvl.id)}
                            className={`flex flex-col items-center justify-center gap-1.5 py-3 rounded-2xl border transition-all ${
                              selectedLevel === lvl.id
                                ? `${lvl.bg} ${lvl.color} ${lvl.border} shadow-sm ring-1 ring-current/10`
                                : "bg-transparent border-slate-100 dark:border-slate-800 text-slate-400 opacity-60 hover:opacity-100"
                            }`}
                          >
                            {lvl.icon}
                            <span className="text-[9px] font-black uppercase tracking-tighter">
                              {lvl.id}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleSubmit}
                      className="w-full py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-emerald-500/20 hover:bg-emerald-500 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                      Execute Broadcast <Send size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </fm.div>
          )}
        </AnimatePresence>

        <div className="space-y-6">
          <AnimatePresence initial={false}>
            {messages.map((msg) => {
              const currentLvl =
                levels.find((l) => l.id === msg.level) || levels[2];

              return (
                <fm.div
                  layout
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group"
                >
                  <div
                    className={`p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200 dark:hover:shadow-none ${
                      msg.role === "Admin"
                        ? "border-emerald-500/10 shadow-sm"
                        : "border-slate-100 dark:border-slate-800 shadow-sm"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner relative group-hover:scale-105 transition-transform ${
                            msg.role === "Admin"
                              ? "bg-emerald-600 text-white"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                          }`}
                        >
                          <span className="font-black text-lg">
                            {msg.author?.[0]}
                          </span>
                          {msg.role === "Admin" && (
                            <div className="absolute -top-1 -right-1 bg-white dark:bg-slate-900 rounded-full p-0.5">
                              <CheckCircle
                                size={14}
                                className="text-emerald-500"
                              />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-[13px] tracking-tight text-slate-900 dark:text-slate-100">
                              {msg.author}
                            </span>
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-300 dark:text-slate-600">
                              •
                            </span>
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                              {msg.role}
                            </span>
                          </div>
                          <div
                            className={`inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${currentLvl.bg} ${currentLvl.color} border ${currentLvl.border}`}
                          >
                            {currentLvl.icon} {msg.level}
                          </div>
                        </div>
                      </div>
                      <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-xl">
                        <Clock size={12} className="opacity-70" />{" "}
                        {msg.timestamp}
                      </div>
                    </div>

                    <div className="space-y-2 mb-8">
                      {msg.linkedIssueId && (
                        <div className="flex items-center gap-2 mb-3 bg-slate-50 dark:bg-slate-800/50 w-fit px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700">
                          <LinkIcon size={12} className="text-emerald-500" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                            Linked to REF-{msg.linkedIssueId}
                          </span>
                        </div>
                      )}
                      <p
                        className={`text-[15px] font-semibold leading-[1.6] ${
                          msg.role === "Admin"
                            ? "text-slate-800 dark:text-slate-200"
                            : "text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        {msg.content}
                      </p>
                    </div>

                    {msg.type === "poll" && (
                      <div className="bg-slate-50 dark:bg-slate-950/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/50 mb-8 space-y-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Vote size={14} className="text-emerald-500" />
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                            Consensus poll
                          </span>
                        </div>
                        {msg.options?.map((opt, idx) => {
                          const total =
                            msg.votes?.reduce((a, b) => a + b, 0) || 0;
                          const perc =
                            total > 0 ? (msg.votes[idx] / total) * 100 : 0;
                          return (
                            <div
                              key={idx}
                              className="relative h-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden"
                            >
                              <fm.div
                                initial={{ width: 0 }}
                                animate={{ width: `${perc}%` }}
                                className="absolute inset-y-0 left-0 bg-emerald-500/5 dark:bg-emerald-500/10 border-r-2 border-emerald-500/20"
                              />
                              <div className="absolute inset-0 flex items-center justify-between px-5">
                                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                                  {opt}
                                </span>
                                <span className="text-[11px] font-black text-emerald-600">
                                  {Math.round(perc)}%
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex gap-2">
                        <div className="flex items-center bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 p-1">
                          <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-400 cursor-default">
                            <Heart size={16} className="text-rose-500" />
                            <span className="text-[11px] font-black">
                              {msg.likes ?? 0}
                            </span>
                          </div>
                          <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1" />
                          <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-400 cursor-default">
                            <ThumbsDown size={16} className="text-slate-500" />
                            <span className="text-[11px] font-black">
                              {msg.dislikes ?? 0}
                            </span>
                          </div>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-100 dark:border-slate-800 hover:border-emerald-500/50 transition-all">
                          <MessageSquare size={14} /> Discuss
                        </button>
                      </div>
                    </div>
                  </div>
                </fm.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AdminCommandCenter;
