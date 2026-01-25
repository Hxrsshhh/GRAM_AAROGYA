"use client";

import React, { useState } from "react";
import {
  MapPin,
  Calendar,
  Eye,
  ThumbsUp,
  MessageSquare,
  Clock,
  CheckCircle2,
  Share2,
  User,
  ShieldCheck,
  AlertTriangle,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Mic,
  Loader2,
} from "lucide-react";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { createComment, getIssueById, toggleUpvote } from "@/app/api/issues";
import { IssueMap } from "@/components/layouts/MapComponent";
import { Badge } from "@/components/ui/Issue-badge";
import { Card } from "@/components/ui/Issue-card";
import Button from "@/components/ui/Button";
import Image from "next/image";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import useSWR, { mutate } from "swr";

const STATUS_STEPS = [
  {
    id: "pending",
    label: "Case Acknowledged",
    sub: "Verified by authorities",
    icon: CheckCircle2,
  },
  {
    id: "in-progress",
    label: "Operational Phase",
    sub: "Work in progress",
    icon: Clock,
  },
  {
    id: "resolved",
    label: "Issue Resolved",
    sub: "Case successfully closed",
    icon: CheckCircle2,
  },
];

export default function App() {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [comment, setComment] = useState("");
  const audioRef = React.useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fetcher = () => getIssueById(id);
  const router = useRouter();
  const { data: session } = useSession();

  const params = useParams();
  const id = params?.id;

  const {
    data: issue,
    error,
    isLoading,
  } = useSWR(id ? `/api/issues/${id}` : null, fetcher, {
    refreshInterval: 30000,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  });

  const localComments =
    issue?.comments?.map((c) => ({
      id: c._id,
      name: c.createdBy?.name || "Anonymous Citizen",
      text: c.text,
      time: new Date(c.createdAt).toLocaleDateString(),
      image: c.createdBy?.image,
    })) || [];

  const handlePostComment = async () => {
    if (!comment.trim()) return;

    setIsSubmitting(true);
    try {
      await createComment(issue._id, comment);
      setComment("");
      toast.success("Comment added");

      mutate(`/api/issues/${id}`);
    } catch (err) {
      toast.error(err.message || "Failed to post");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextImage = () => {
    if (issue?.images?.length) {
      setCurrentImgIndex((prev) => (prev + 1) % issue.images.length);
    }
  };

  const prevImage = () => {
    if (issue?.images?.length) {
      setCurrentImgIndex(
        (prev) => (prev - 1 + issue.images.length) % issue.images.length
      );
    }
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;

    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleUpvote = async () => {
    if (!session) {
      toast.error("Please login to upvote");
      return;
    }

    const key = `/api/issues/${id}`;
    mutate(
      key,
      (prev) => {
        if (!prev) return prev;

        const alreadyUpvoted = prev.upvotedBy?.includes(session.user.id);

        return {
          ...prev,
          upvotes: Math.max((prev.upvotes ?? 0) + (alreadyUpvoted ? -1 : 1), 0),
          upvotedBy: alreadyUpvoted
            ? prev.upvotedBy.filter((u) => u !== session.user.id)
            : [...(prev.upvotedBy || []), session.user.id],
        };
      },
      false
    );

    try {
      const res = await toggleUpvote(id);
      toast.success(res.hasUpvoted ? "Upvoted" : "Upvote removed");
      mutate(key);
    } catch (err) {
      toast.error(err.message || "Unable to upvote");

      mutate(key);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-20 pb-20 px-6">
        <style>{`
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          .shimmer-wrapper {
            position: relative;
            overflow: hidden;
          }
          .shimmer-wrapper::after {
            content: "";
            position: absolute;
            inset: 0;
            transform: translateX(-100%);
            background: linear-gradient(
              90deg,
              transparent,
              rgba(255, 255, 255, 0.08),
              transparent
            );
            animation: shimmer 2s infinite;
          }
        `}</style>
        <div className="max-w-332 mx-auto">
          <div className="mb-8 mt-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 shimmer-wrapper" />
            <div className="space-y-2">
              <div className="h-2 w-16 bg-slate-200 dark:bg-slate-800 rounded shimmer-wrapper" />
              <div className="h-3 w-24 bg-slate-300 dark:bg-slate-700 rounded shimmer-wrapper" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-8">
              <div className="space-y-6">
                <div className="flex gap-3">
                  <div className="h-6 w-20 bg-emerald-500/10 rounded-full shimmer-wrapper" />
                  <div className="h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded-full shimmer-wrapper" />
                </div>
                <div className="space-y-4">
                  <div className="h-14 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-2xl shimmer-wrapper" />
                  <div className="h-14 w-1/2 bg-slate-200 dark:bg-slate-800 rounded-2xl shimmer-wrapper" />
                </div>
                <div className="h-14 w-full border-y border-slate-200 dark:border-slate-800 flex items-center gap-8">
                  <div className="h-3 w-24 bg-slate-100 dark:bg-slate-800 rounded shimmer-wrapper" />
                  <div className="h-3 w-24 bg-slate-100 dark:bg-slate-800 rounded shimmer-wrapper" />
                </div>
              </div>

              <div className="aspect-[16/9] w-full bg-slate-200 dark:bg-slate-900 rounded-[3rem] shimmer-wrapper shadow-2xl shadow-emerald-900/5" />

              <div className="space-y-4 pl-6 border-l-2 border-slate-200 dark:border-slate-800">
                <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded-lg shimmer-wrapper" />
                <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded-lg shimmer-wrapper" />
                <div className="h-4 w-2/3 bg-slate-200 dark:bg-slate-800 rounded-lg shimmer-wrapper" />
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <div className="h-[340px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-6 flex flex-col gap-6">
                <div className="h-4 w-1/3 bg-slate-100 dark:bg-slate-800 rounded shimmer-wrapper" />
                <div className="flex-1 w-full bg-slate-50 dark:bg-slate-800/40 rounded-[2rem] shimmer-wrapper" />
              </div>

              <div className="h-[420px] bg-emerald-600 rounded-[2.5rem] p-8 space-y-10 relative overflow-hidden">
                <div className="h-3 w-24 bg-emerald-400/30 rounded shimmer-wrapper" />
                <div className="space-y-8">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-4 items-center">
                      <div className="w-6 h-6 rounded-full bg-emerald-400/20 shimmer-wrapper" />
                      <div className="space-y-2">
                        <div className="h-3 w-32 bg-emerald-400/20 rounded shimmer-wrapper" />
                        <div className="h-2 w-20 bg-emerald-400/10 rounded shimmer-wrapper" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !issue) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-500/10 blur-[120px] rounded-full pointer-events-none" />
        <Card className="relative text-center max-w-lg border-2 border-rose-500/10 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl p-12! rounded-[3rem] shadow-2xl shadow-rose-500/5">
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-rose-500 blur-2xl opacity-20 animate-pulse" />
            <div className="relative w-20 h-20 rounded-3xl bg-rose-500/10 border-2 border-rose-500/20 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-10 h-10 text-rose-500" />
            </div>
          </div>
          <div className="space-y-4 mb-10">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-rose-500">
              System Error: 404
            </h3>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-slate-900 dark:text-white leading-none">
              Report Not <br /> Found
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold max-w-70 mx-auto leading-relaxed uppercase tracking-tight">
              {error ||
                "The requested civic incident record is missing or has been restricted by authorities."}
            </p>
          </div>
          <div className="flex flex-col items-center gap-4">
            <Link href="/issues" className="w-full">
              <Button
                variant="primary"
                className="w-full h-14 rounded-2xl bg-rose-500 hover:bg-rose-600 border-none shadow-lg shadow-rose-500/20 text-[11px] font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95"
              >
                Return to Incident Feed
              </Button>
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-emerald-500 transition-colors"
            >
              Re-attempt Connection
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-emerald-500/30 pt-4 pb-20">
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(16, 185, 129, 0.4); }
      `}</style>

      <main className="max-w-332 mx-auto px-6 py-12">
        <div className="mb-8 mt-6">
          <button
            onClick={handleBack}
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-full border-2 border-slate-200 dark:border-slate-800 flex items-center justify-center group-hover:bg-emerald-500 group-hover:border-emerald-500 transition-all duration-300">
              <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
            </div>
            <div className="flex flex-col items-start text-left">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-0.5">
                Return to
              </span>
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                Incident Feed
              </span>
            </div>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-8">
            <header className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant={issue.status}>{issue.status}</Badge>
                <Badge variant="default">{issue.category}</Badge>
                <Badge variant="default">{issue.priority} Priority</Badge>
              </div>

              <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.9] text-slate-900 dark:text-white">
                {issue.title}
              </h1>

              <div className="flex flex-wrap items-center gap-x-8 gap-y-4 py-6 border-y border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {new Date(issue.createdAt).toLocaleDateString(undefined, {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-emerald-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {issue.viewCount || 0} Views
                  </span>
                </div>

                <button
                  onClick={handleUpvote}
                  className="flex items-center gap-2 hover:opacity-70 transition-opacity"
                >
                  <ThumbsUp
                    className={`w-4 h-4 transition-all ${
                      hasUpvoted ? "text-emerald-500" : "text-emerald-500"
                    }`}
                    fill={hasUpvoted ? "currentColor" : "none"}
                    strokeWidth={hasUpvoted ? 0 : 2}
                  />

                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {issue?.upvotes ?? 0} Upvotes
                  </span>
                </button>

                <button className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-emerald-500 hover:text-white transition-all text-slate-400">
                  <Share2 className="w-3 h-3" />
                  <span className="text-[9px] font-black uppercase tracking-widest">
                    Share Case
                  </span>
                </button>
              </div>
            </header>

            {issue.images?.length > 0 && (
              <div className="relative group overflow-hidden rounded-[3rem] shadow-2xl shadow-emerald-900/10 bg-slate-200 dark:bg-slate-900 aspect-video ">
                <div className="relative w-full h-full overflow-hidden">
                  <Image
                    src={issue.images[currentImgIndex]}
                    alt={`Evidence ${currentImgIndex + 1}`}
                    fill
                    className="object-cover transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 600px"
                    priority
                  />
                </div>

                {issue.images.length > 1 && (
                  <div className="absolute inset-0 flex items-center justify-between px-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={prevImage}
                      className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/40 transition-all"
                    >
                      <ChevronLeft className="text-white" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/40 transition-all"
                    >
                      <ChevronRight className="text-white" />
                    </button>
                  </div>
                )}

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                  {issue.images.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 rounded-full transition-all ${
                        i === currentImgIndex
                          ? "w-8 bg-emerald-500"
                          : "w-2 bg-white/50"
                      }`}
                    />
                  ))}
                </div>

                <div className="absolute top-6 right-6 bg-black/40 backdrop-blur-md text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                  IMG {currentImgIndex + 1} / {issue.images.length}
                </div>
              </div>
            )}

            <section className="space-y-3">
              <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-500">
                Official Complaint
              </h3>
              <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 font-semibold leading-relaxed pl-6 border-l-2 border-slate-200 dark:border-slate-800">
                {issue.description}
              </p>
            </section>

            <div className="mt-12 pt-12 border-t-2 border-slate-100 dark:border-slate-900">
              <div className="flex items-center gap-2 mb-6">
                <MessageSquare className="w-4 h-4 text-emerald-500" />
                <h2 className="text-xs font-black uppercase tracking-[0.2em]">
                  Contribute Context
                </h2>
              </div>
              <Card className="bg-slate-50/50 dark:bg-slate-900/50 border-dashed border-2 p-6!">
                <div className="space-y-4">
                  <textarea
                    placeholder="Share evidence, updates, or personal experience regarding this incident..."
                    className="w-full min-h-30 p-5 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-3xl text-sm font-bold focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-300"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <div className="flex justify-end">
                    <Button
                      onClick={handlePostComment}
                      disabled={isSubmitting || !comment.trim()}
                      className=" h-12 w-full disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Post Comment"
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <Card className="p-6! border-emerald-500/10 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
              </div>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-500" /> Precise Location
              </h3>
              <p className="text-sm font-black uppercase tracking-tighter mb-4">
                {issue.address}
              </p>
              <div className="h-56 w-full rounded-[2rem] overflow-hidden">
                <IssueMap lat={issue.location?.lat} lng={issue.location?.lng} />
              </div>
            </Card>

            <Card className="p-0! overflow-hidden bg-emerald-600 text-white border-none shadow-2xl shadow-emerald-600/30 rounded-[2.5rem]">
              <div className="p-6 sm:p-8 space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-emerald-300/80">
                    Official Response
                  </h3>
                  <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400 opacity-50" />
                </div>
                <div className="space-y-8 relative">
                  <div className="absolute left-2.75 top-2 bottom-2 w-0.5 bg-white/10" />
                  {(() => {
                    const currentIdx = STATUS_STEPS.findIndex(
                      (s) => s.id === issue.status
                    );
                    return STATUS_STEPS.map((step, index) => {
                      const isCompleted = index <= currentIdx;
                      const isCurrent = index === currentIdx;
                      const Icon = step.icon;
                      return (
                        <div
                          key={step.id}
                          className={`relative flex gap-4 sm:gap-6 transition-all duration-500 ${
                            isCompleted ? "opacity-100" : "opacity-30"
                          }`}
                        >
                          <div
                            className={`
                              w-6 h-6 rounded-full flex items-center justify-center z-10 ring-4 ring-emerald-600 transition-all duration-500
                              ${
                                isCompleted
                                  ? "bg-white scale-110"
                                  : "bg-emerald-700"
                              }
                            `}
                          >
                            <Icon
                              className={`w-3.5 h-3.5 ${
                                isCompleted
                                  ? "text-emerald-600"
                                  : "text-emerald-400"
                              }`}
                            />
                            {isCurrent && issue.status !== "resolved" && (
                              <span className="absolute inset-0 rounded-full bg-white animate-ping opacity-40" />
                            )}
                          </div>
                          <div className="flex-1 pt-0.5">
                            <p
                              className={`text-xs font-black uppercase tracking-tight ${
                                isCompleted
                                  ? "text-white"
                                  : "text-emerald-300/50"
                              }`}
                            >
                              {step.label}
                            </p>
                            <p
                              className={`text-[10px] font-bold ${
                                isCompleted
                                  ? "text-emerald-300"
                                  : "text-emerald-500"
                              }`}
                            >
                              {step.sub}
                            </p>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
              <div className="bg-emerald-700/50 p-3 sm:p-4 text-center">
                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-emerald-200/60 flex items-center justify-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-emerald-400" />
                  Case ID: {issue._id}
                  <span className="w-1 h-1 rounded-full bg-emerald-400" />
                </p>
              </div>
            </Card>

            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Activity Log
                </h3>
                <span className="text-[9px] font-black text-emerald-500">
                  {localComments.length} Records
                </span>
              </div>
              <div className="space-y-3 max-h-90 overflow-y-auto pr-2 custom-scrollbar transition-all">
                {localComments.map((c) => (
                  <div
                    key={c.id}
                    className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[1.5rem] shadow-sm mb-3"
                  >
                    <div className="flex justify-between items-start mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                          <User className="w-2.5 h-2.5 text-slate-400" />
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-tight">
                          {c.name}
                        </span>
                      </div>
                      <span className="text-[7px] font-black uppercase text-slate-400 tracking-widest">
                        {c.time}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-[11px] font-medium leading-snug pl-7">
                      {c.text}
                    </p>
                  </div>
                ))}
                {localComments.length === 0 && (
                  <p className="text-[10px] text-center py-8 text-slate-400 font-black uppercase tracking-widest italic">
                    No records yet
                  </p>
                )}
              </div>
            </div>

            {issue.voiceNote && (
              <Card className="border-l-4 border-l-emerald-500 p-3! sm:p-4! bg-linear-to-r from-emerald-500/5 to-transparent overflow-hidden">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.15em] text-emerald-600 dark:text-emerald-500 flex items-center gap-1.5">
                      <Mic className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Voice
                      Testimony
                    </span>
                    <span className="text-[10px] sm:text-xs font-bold text-slate-400">
                      Citizen Audio
                    </span>
                  </div>
                  <audio
                    ref={audioRef}
                    src={issue.voiceNote}
                    onEnded={() => setIsPlaying(false)}
                  />
                  <div className="flex items-center gap-3 sm:gap-5">
                    <button
                      onClick={toggleAudio}
                      className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all"
                      aria-label={isPlaying ? "Pause audio" : "Play audio"}
                    >
                      {isPlaying ? (
                        <Pause className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      ) : (
                        <Play className="w-4 h-4 sm:w-5 sm:h-5 text-white ml-0.5" />
                      )}
                    </button>
                    <div className="flex-1 h-8 sm:h-10 flex items-end gap-0.5 sm:gap-1 overflow-hidden">
                      {[...Array(40)].map((_, i) => (
                        <div
                          key={i}
                          className={`flex-1 min-w-0.5 rounded-full transition-all duration-300 ${
                            isPlaying
                              ? "animate-pulse bg-emerald-500"
                              : "bg-slate-300 dark:bg-slate-700"
                          }`}
                          style={{
                            height: `${25 + (Math.sin(i * 1.5) * 20 + 20)}%`,
                            animationDelay: isPlaying ? `${i * 0.05}s` : "0s",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            )}

            <Card className="p-6!">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">
                Citizen Reporter
              </h3>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-2 border-white dark:border-slate-700 shadow-lg">
                  <User className="w-6 h-6 text-slate-400" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-tighter text-slate-900 dark:text-white">
                    {issue.reportedBy?.name || "Anonymous Citizen"}
                  </p>
                  <p className="text-[8px] font-black uppercase text-emerald-500 tracking-widest">
                    Trust Rating: {issue.reportedBy?.trustRating || 0}%
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
