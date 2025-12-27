"use client";

import React, { useState, useEffect } from "react";
import {
  MapPin,
  Calendar,
  Eye,
  ThumbsUp,
  MessageSquare,
  Clock,
  CheckCircle2,
  Send,
  Share2,
  User,
  ShieldCheck,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Issue-detail-card";

import Button from "@/components/ui/Button";

import Link from "next/link";
import { getIssueById,ISSUE_DETAILS } from "@/lib/mock-data";
import { useParams } from "next/navigation";

export default function App() {
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [comment, setComment] = useState("");
  const [hasUpvoted, setHasUpvoted] = useState(false);

  const params = useParams();

  const id = params.id;

  const Issue = getIssueById(ISSUE_DETAILS,id);

  // Simulated Fetch
  useEffect(() => {
    const fetchIssue = async () => {
      setIssue(Issue);
      setLoading(false);
    };
    fetchIssue();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          Syncing Civic Data...
        </p>
      </div>
    );
  }

  if (error || !issue) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
        <Card className="text-center max-w-md border-rose-500/20">
          <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">
            Report Not Found
          </h2>
          <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed">
            {error ||
              "The requested issue ID does not exist in our public database."}
          </p>
          <Button variant="primary">Return to Feed</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-emerald-500/30 pt-4">
      <main className="max-w-[83rem] mx-auto px-6 py-12">
        {/* BACK BUTTON / BREADCRUMB - Positioned below your fixed navbar */}
        <div className="mb-8 mt-6">
          <Link href="/issues">
            <button className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full border-2 border-slate-200 dark:border-slate-800 flex items-center justify-center group-hover:bg-emerald-500 group-hover:border-emerald-500 transition-all duration-300">
                <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-0.5">
                  Return to
                </span>
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                  Incident Feed
                </span>
              </div>
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* LEFT: PRIMARY CONTENT */}
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

              <div className="flex flex-wrap items-center gap-8 py-6 border-y border-slate-200 dark:border-slate-800">
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
                    {issue.viewCount} Engagements
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <ThumbsUp className="w-4 h-4 text-emerald-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {issue.upvotes} Citizens Supported
                  </span>
                </div>
              </div>
            </header>

            {/* GALLERY */}
            {issue.images?.length > 0 && (
              <div className="group relative overflow-hidden rounded-[3rem] shadow-2xl shadow-emerald-900/10">
                <img
                  src={issue.images[0]}
                  className="w-full aspect-[16/9] object-cover transition-transform duration-700 group-hover:scale-105"
                  alt="Issue visual evidence"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
            )}

            {/* DESCRIPTION */}
            <section className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">
                Official Complaint
              </h3>
              <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                {issue.description}
              </p>
            </section>

            {/* ACTION FOOTER */}
            <div className="flex flex-wrap items-center gap-4 pt-8 border-t border-slate-200 dark:border-slate-800">
              <Button
                variant={hasUpvoted ? "primary" : "outline"}
                onClick={() => setHasUpvoted(!hasUpvoted)}
                leftIcon={<ThumbsUp className="w-5 h-5" />}
              >
                {hasUpvoted ? "Upvoted" : "Support this Case"}
              </Button>
              <Button
                variant="outline"
                leftIcon={<Share2 className="w-5 h-5" />}
              >
                Share Data
              </Button>
            </div>

            {/* COMMENTS SECTION */}
            <Card className="mt-16 bg-slate-50/50 dark:bg-slate-900/50 border-dashed border-2">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-emerald-500" />{" "}
                  Community Discussion
                </h2>
                <span className="text-[10px] font-black uppercase text-slate-400 bg-white dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                  0 Comments
                </span>
              </div>

              <div className="space-y-4">
                <textarea
                  placeholder="Share your experience or offer additional context..."
                  className="w-full min-h-[120px] p-6 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-3xl text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-300"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <div className="flex justify-end">
                  <Button
                    variant="primary"
                    leftIcon={<Send className="w-4 h-4" />}
                  >
                    Post Comment
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* RIGHT: SIDEBAR DATA */}
          <div className="lg:col-span-4 space-y-6">
            {/* LOCATION CARD */}
            <Card className="!p-6 border-emerald-500/10">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-500" /> Precise Location
              </h3>
              <p className="text-sm font-black uppercase tracking-tighter mb-4">
                {issue.address}
              </p>
              <div className="relative h-56 w-full rounded-[2rem] bg-slate-100 dark:bg-slate-800 overflow-hidden group border border-slate-200 dark:border-slate-700">
                <div className="absolute inset-0 bg-emerald-500/5"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-full shadow-2xl flex items-center justify-center animate-bounce">
                    <MapPin className="w-6 h-6 text-emerald-500" />
                  </div>
                </div>
              </div>
            </Card>

            {/* REPORTER INFO */}
            <Card className="!p-6">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">
                Citizen Reporter
              </h3>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-2 border-white dark:border-slate-700 shadow-lg">
                  <User className="w-7 h-7 text-slate-400" />
                </div>
                <div>
                  <p className="text-sm font-black uppercase tracking-tighter text-slate-900 dark:text-white">
                    {issue.user.name}
                  </p>
                  <p className="text-[9px] font-black uppercase text-emerald-500 tracking-widest">
                    Trust Rating: 98%
                  </p>
                </div>
              </div>
            </Card>

            {/* OFFICIAL TIMELINE */}
            <Card className="!p-0 overflow-hidden bg-emerald-600 text-white border-none shadow-2xl shadow-emerald-600/30">
              <div className="p-8 space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                    Official Response
                  </h3>
                  <ShieldCheck className="w-6 h-6 text-emerald-400 opacity-50" />
                </div>

                <div className="space-y-8 relative">
                  <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-white/20"></div>

                  <div className="relative flex gap-6">
                    <div className="w-6 h-6 rounded-full bg-emerald-600/40 flex items-center justify-center ring-4 ring-emerald-600 z-10">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-black uppercase tracking-tight">
                        Case Acknowledged
                      </p>
                      <p className="text-[10px] text-emerald-400 font-bold">
                        24 Dec, 09:12 AM
                      </p>
                    </div>
                  </div>

                  <div className="relative flex gap-6">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-emerald-600 z-10 ${
                        issue.status === "in-progress"
                          ? "bg-white"
                          : "bg-white/20"
                      }`}
                    >
                      <Clock
                        className={`w-3.5 h-3.5 ${
                          issue.status === "in-progress"
                            ? "text-emerald-600"
                            : "text-white"
                        }`}
                      />
                    </div>
                    <div
                      className={`flex-1 ${
                        issue.status !== "in-progress" && "opacity-50"
                      }`}
                    >
                      <p className="text-xs font-black uppercase tracking-tight">
                        Crew Assigned
                      </p>
                      <p className="text-[10px] text-emerald-400 font-bold">
                        24 Dec, 02:45 PM
                      </p>
                    </div>
                  </div>

                  <div className="relative flex gap-6 opacity-30">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center ring-4 ring-emerald-600 z-10">
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-black uppercase tracking-tight">
                        Field Verification
                      </p>
                      <p className="text-[10px] text-emerald-400 font-bold italic">
                        Estimated: 26 Dec
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-700/50 p-6 text-center">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-200">
                  Official Tracking ID: CP-0842-OAK
                </p>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
