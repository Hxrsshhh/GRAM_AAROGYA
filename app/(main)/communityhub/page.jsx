"use client";

import React, { Activity } from "react";
import useSWR, { mutate } from "swr";
import { motion as fm, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  Clock,
  Vote,
  Heart,
  ThumbsDown,
  ShieldAlert,
  AlertCircle,
  Info,
  ArrowDown,
  MessageSquare,
  Link as LinkIcon,
} from "lucide-react";
import MouseGlow from "@/components/ui/MouseGlow";
import { toast } from "sonner";
import ErrorHandle from "@/components/layouts/ErrorHandle";
import Image from "next/image";

const fetcher = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch");
  const data = await res.json();

  const localLikes = JSON.parse(localStorage.getItem("citizen_likes") || "[]");
  const localDislikes = JSON.parse(
    localStorage.getItem("citizen_dislikes") || "[]"
  );
  const localVotes = JSON.parse(localStorage.getItem("citizen_votes") || "{}");

  return data.map((msg) => ({
    ...msg,
    hasLiked: localLikes.includes(msg.id),
    hasDisliked: localDislikes.includes(msg.id),
    selectedOption:
      localVotes[msg.id] !== undefined ? localVotes[msg.id] : null,
    hasVoted: localVotes[msg.id] !== undefined,
  }));
};

const CommuniHubLoader = () => (
  <div className="flex flex-col items-center dark:bg-slate-950 h-screen justify-center py-20 w-full">
    <div className="relative flex items-center justify-center">
      {/* Outer Pulse Rings */}
      <div className="absolute w-16 h-16 bg-emerald-500/20 rounded-full animate-ping" />
      <div className="absolute w-24 h-24 bg-emerald-500/10 rounded-full animate-[ping_2s_linear_infinite]" />
      
      {/* Core Icon */}
      <div className="relative w-12 h-12 bg-white dark:bg-slate-950 border-2 border-emerald-500 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.2)]">
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
      </div>
    </div>
    
    {/* Loading Text */}
    <div className="mt-8 flex flex-col items-center gap-1">
      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 animate-pulse">
        Establishing Link
      </span>
      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest opacity-50">
        Syncing Secure Feed...
      </span>
    </div>
  </div>
);

const CitizenNewsFeed = () => {
  const {
    data: messages,
    error,
    isLoading,
  } = useSWR("/api/feed", fetcher, {
    refreshInterval: 5000,
    revalidateOnFocus: true,
    shouldRetryOnError: false,
    dedupingInterval: 5000,
  });

  const levels = {
    Emergency: {
      icon: <ShieldAlert size={12} />,
      color: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-50 dark:bg-rose-500/10",
      border: "border-rose-100 dark:border-rose-500/20",
    },
    Urgent: {
      icon: <AlertCircle size={12} />,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-500/10",
      border: "border-amber-100 dark:border-amber-500/20",
    },
    Normal: {
      icon: <Info size={12} />,
      color: "text-sky-600 dark:text-sky-400",
      bg: "bg-sky-50 dark:bg-sky-500/10",
      border: "border-sky-100 dark:border-sky-100/20",
    },
    Low: {
      icon: <ArrowDown size={12} />,
      color: "text-slate-600 dark:text-slate-400",
      bg: "bg-slate-50 dark:bg-slate-500/10",
      border: "border-slate-200 dark:border-slate-500/20",
    },
  };

  const likePost = async (id) => {
    try {
      await fetch(`/api/feed/${id}/like`, { method: "POST" });
      let likes = JSON.parse(localStorage.getItem("citizen_likes") || "[]");

      if (likes.includes(id)) {
        likes = likes.filter((itemId) => itemId !== id);
      } else {
        likes.push(id);
        let dislikes = JSON.parse(
          localStorage.getItem("citizen_dislikes") || "[]"
        );
        localStorage.setItem(
          "citizen_dislikes",
          JSON.stringify(dislikes.filter((i) => i !== id))
        );
      }

      localStorage.setItem("citizen_likes", JSON.stringify(likes));
      mutate("/api/feed"); // Tell SWR to re-fetch and update UI
      toast.success("Reaction updated");
    } catch (error) {
      toast.error("Failed to sync");
    }
  };

  const dislikePost = async (id) => {
    try {
      await fetch(`/api/feed/${id}/dislike`, { method: "POST" });
      let dislikes = JSON.parse(
        localStorage.getItem("citizen_dislikes") || "[]"
      );

      if (dislikes.includes(id)) {
        dislikes = dislikes.filter((itemId) => itemId !== id);
      } else {
        dislikes.push(id);
        let likes = JSON.parse(localStorage.getItem("citizen_likes") || "[]");
        localStorage.setItem(
          "citizen_likes",
          JSON.stringify(likes.filter((i) => i !== id))
        );
      }

      localStorage.setItem("citizen_dislikes", JSON.stringify(dislikes));
      mutate("/api/feed"); // Trigger SWR revalidation
      toast.info("Feedback recorded");
    } catch (error) {
      toast.error("Action failed");
    }
  };

  const votePoll = async (postId, optionIndex) => {
    try {
      let localVotes = JSON.parse(
        localStorage.getItem("citizen_votes") || "{}"
      );
      const isRemoving = localVotes[postId] === optionIndex;

      if (isRemoving) {
        delete localVotes[postId];
      } else {
        localVotes[postId] = optionIndex;
      }

      const res = await fetch(`/api/feed/${postId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionIndex: isRemoving ? null : optionIndex }),
      });

      if (res.ok) {
        localStorage.setItem("citizen_votes", JSON.stringify(localVotes));
        mutate("/api/feed"); // Refresh via SWR
        toast.success(isRemoving ? "Vote removed" : "Vote recorded");
      }
    } catch (error) {
      toast.error("Voting failed");
    }
  };

  if (isLoading) {
    return (
    <CommuniHubLoader />
    );
  }

  if (error) {
    return <ErrorHandle />;
  }

  return (

    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] text-slate-900 dark:text-slate-100 font-sans relative overflow-x-hidden selection:bg-emerald-500/30">
      <MouseGlow />

      <div className="container mx-auto max-w-5xl px-4 py-20 relative z-40">
        <div className="mb-10">
          <h1 className="text-3xl font-black tracking-tight uppercase leading-none text-slate-900 dark:text-white">
            Citizen <span className="text-emerald-500">News Feed</span>
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                Live Broadcast
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <AnimatePresence initial={false}>
            {messages?.map((msg) => {
              const currentLvl = levels[msg.level] || levels.Normal;

              // Calculate Sentiment Percentage
              const totalReactions = (msg.likes || 0) + (msg.dislikes || 0);
              const sentiment =
                totalReactions > 0
                  ? Math.round((msg.likes / totalReactions) * 100)
                  : 0;

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
                    {/* Header */}
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
                            {msg.author?.[0] || "?"}
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

                    {/* Content */}
                    <div className="space-y-2 mb-8">
                      {msg.linkedIssue && (
                        <button
                          onClick={() =>
                            toast.info(
                              `Viewing linked report: REF-${msg.linkedIssue.id}`
                            )
                          }
                          className="flex items-center gap-2 mb-3 bg-emerald-50 dark:bg-emerald-500/5 hover:bg-emerald-100 dark:hover:bg-emerald-500/10 transition-colors w-fit px-3 py-1.5 rounded-lg border border-emerald-100 dark:border-emerald-500/20"
                        >
                          <LinkIcon size={12} className="text-emerald-500" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                            Linked to Report REF-{msg.linkedIssue.id}
                          </span>
                        </button>
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

                    {/* Poll Section */}
                    {msg.type === "poll" && (
                      <div className="bg-slate-50 dark:bg-slate-950/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/50 mb-8 space-y-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Vote size={14} className="text-emerald-500" />
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                            {msg.hasVoted ? "Voice Recorded" : "Public Poll"}
                          </span>
                        </div>
                        {msg.options.map((opt, idx) => {
                          const total = msg.votes.reduce((a, b) => a + b, 0);
                          const perc =
                            total > 0 ? (msg.votes[idx] / total) * 100 : 0;
                          const isSelected = msg.selectedOption === idx;

                          return (
                            <fm.button
                              key={idx}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => votePoll(msg.id, idx)}
                              className={`relative w-full h-12 bg-white dark:bg-slate-900 rounded-2xl border overflow-hidden transition-all flex items-center cursor-pointer ${
                                isSelected
                                  ? "border-emerald-500 ring-1 ring-emerald-500/20"
                                  : "border-slate-100 dark:border-slate-800"
                              }`}
                            >
                              <fm.div
                                animate={{ width: `${perc}%` }}
                                className={`absolute inset-y-0 left-0 border-r-2 ${
                                  isSelected
                                    ? "bg-emerald-500/10 border-emerald-500"
                                    : "bg-emerald-500/5 border-emerald-500/10"
                                }`}
                              />
                              <div className="relative z-10 w-full flex items-center justify-between px-5">
                                <span
                                  className={`text-[11px] font-bold ${
                                    isSelected
                                      ? "text-emerald-600 dark:text-emerald-400"
                                      : "text-slate-700 dark:text-slate-300"
                                  }`}
                                >
                                  {opt} {isSelected && "✓"}
                                </span>
                                <span className="text-[11px] font-black text-emerald-600">
                                  {perc.toFixed(1)}%
                                </span>
                              </div>
                            </fm.button>
                          );
                        })}
                      </div>
                    )}

                    {/* Footer Actions */}
                    <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex gap-2">
                        <div className="flex items-center bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 p-1">
                          {/* Like Button */}
                          <fm.button
                            whileTap={{ scale: 0.8 }}
                            onClick={() => likePost(msg.id)}
                            className={`p-2.5 rounded-xl transition-all flex items-center gap-2 ${
                              msg.hasLiked
                                ? "text-rose-500 bg-rose-50 dark:bg-rose-500/10 shadow-sm"
                                : "text-slate-400 hover:text-rose-500"
                            }`}
                          >
                            <Heart
                              size={18}
                              fill={msg.hasLiked ? "currentColor" : "none"}
                            />
                            <span className="text-[11px] font-black">
                              {msg.likes}
                            </span>
                          </fm.button>

                          <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1" />

                          {/* Dislike Button */}
                          <fm.button
                            whileTap={{ scale: 0.8 }}
                            onClick={() => dislikePost(msg.id)}
                            className={`p-2.5 rounded-xl transition-all flex items-center gap-2 ${
                              msg.hasDisliked
                                ? "text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-700 shadow-sm"
                                : "text-slate-400 hover:text-slate-600"
                            }`}
                          >
                            <ThumbsDown
                              size={18}
                              fill={msg.hasDisliked ? "currentColor" : "none"}
                            />
                            <span className="text-[11px] font-black">
                              {msg.dislikes || 0}
                            </span>
                          </fm.button>
                        </div>

                        {/* Sentiment Indicator */}
                        <div className="hidden sm:flex items-center gap-2 px-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                          <span
                            className={`text-[10px] font-black ${
                              sentiment > 50
                                ? "text-emerald-500"
                                : "text-amber-500"
                            }`}
                          >
                            {sentiment}%{" "}
                            <span className="text-[8px] opacity-60 ml-0.5">
                              SCORE
                            </span>
                          </span>
                        </div>

                        <button className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-900 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-slate-100 dark:border-slate-800 hover:border-emerald-500/50 transition-all">
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

export default CitizenNewsFeed;
