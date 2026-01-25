"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  Plus,
  ArrowRight,
  MapPin,
  Calendar,
  Eye,
  Shield,
  ChevronRight,
  Clock,
  CheckCircle2,
  Activity,
  ZapOff,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { DashboardCard } from "@/components/ui/DashboardCard";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { getDashboardData } from "@/lib/api/dashboard";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { fireOneTimeToast } from "@/lib/oneTimeToast";
import useSWR from "swr";
import ErrorHandle from "@/components/layouts/ErrorHandle";

const formatDate = (date) => {
  try {
    return new Date(date).toISOString().split("T")[0];
  } catch {
    return "N/A";
  }
};


export default function Dashboard() {
  const { data: session, status } = useSession();
const user = session?.user;

// FETCHER
const fetcher = () => getDashboardData();

// SWR (WAIT FOR AUTH)
const {
  data,
  error,
  isLoading,
} = useSWR(
  status === "authenticated" ? "/api/dashboard" : null,
  fetcher,
  {
    revalidateOnFocus: false,
    refreshInterval: 0,
    dedupingInterval: 30000,
    shouldRetryOnError: false,
  }
);

const stats = data?.stats ?? {};
const chartData = Array.isArray(data?.chartData) ? data.chartData : [];
const recentIssues = Array.isArray(data?.recentIssues)
  ? data.recentIssues
  : [];

  useEffect(() => {
    fireOneTimeToast("googleLoginSuccess", "Signed in with Google 🚀");
    fireOneTimeToast("signupSuccess", "Welcome to Pulse 🎉");
    fireOneTimeToast("signinSuccess", "Welcome Back to Pulse 🎉");
  }, []);

  const statsData = data
    ? [
        {
          title: "Total Reports",
          value: data.stats?.total || 0,
          change: `+${data.stats?.resolvedThisMonth || 0} resolved`,
          icon: <TrendingUp className="w-5 h-5" />,
          color: "text-blue-500",
          bg: "bg-blue-500/10",
        },
        {
          title: "Pending",
          value: data.stats?.pending || 0,
          change: "Action required",
          icon: <Clock className="w-5 h-5" />,
          color: "text-amber-500",
          bg: "bg-amber-500/10",
        },
        {
          title: "Resolved",
          value: data.stats?.resolved || 0,
          change: "High efficiency",
          icon: <CheckCircle2 className="w-5 h-5" />,
          color: "text-emerald-500",
          bg: "bg-emerald-500/10",
        },
        {
          title: "Active Pulse",
          value: data.stats?.inProgress || 0,
          change: "Live updates",
          icon: <Activity className="w-5 h-5" />,
          color: "text-rose-500",
          bg: "bg-rose-500/10",
        },
      ]
    : [];

  // const chartData = data?.chartData || [];
  // const recentIssues = data?.recentIssues || [];

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Skeleton */}
          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 animate-pulse">
            <div>
              <div className="h-10 w-64 bg-slate-200 dark:bg-slate-800 rounded-xl mb-3" />
              <div className="h-4 w-48 bg-slate-100 dark:bg-slate-800/50 rounded-lg" />
            </div>
            <div className="h-12 w-44 bg-emerald-500/20 rounded-2xl" />
          </div>

          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-32 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] animate-pulse"
              />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Chart Skeleton */}
            <div className="lg:col-span-2 h-[400px] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-8">
              <div className="flex justify-between mb-8">
                <div className="h-6 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
                <div className="h-4 w-12 bg-emerald-500/20 rounded-full animate-pulse" />
              </div>
              <div className="w-full h-64 bg-slate-100/50 dark:bg-slate-800/30 rounded-xl animate-pulse" />
            </div>
            {/* Hub Skeleton */}
            <div className="h-[400px] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-6 space-y-4">
              <div className="h-6 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg mb-4" />
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-14 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorHandle />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white">
              System{" "}
              <span className="text-emerald-600 dark:text-emerald-400">
                Overview
              </span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
              Welcome back,{" "}
              <span className="text-slate-900 dark:text-slate-100 font-bold">
                {user?.name}
              </span>
              . Network is stable.
            </p>
          </motion.div>
          <Link href="/issues/report">
            <Button className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all">
              <Plus className="w-5 h-5" />
              REPORT ANOMALY
            </Button>
          </Link>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsData.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <DashboardCard className="relative overflow-hidden group h-full">
                <div className="flex items-start justify-between relative z-10">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-black text-slate-900 dark:text-white">
                      {stat.value}
                    </p>
                    <p
                      className={`text-[11px] font-bold mt-2 ${stat.color} opacity-80`}
                    >
                      {stat.change}
                    </p>
                  </div>
                  <div
                    className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}
                  >
                    {stat.icon}
                  </div>
                </div>
                <div
                  className={`absolute -right-4 -bottom-4 w-20 h-20 rounded-full ${stat.bg} blur-2xl opacity-50`}
                />
              </DashboardCard>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Activity Chart */}
          <DashboardCard className="lg:col-span-2 overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                Regional Pulse
              </h2>
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">
                  Live
                </span>
              </div>
            </div>
            <div className="h-75 w-full min-h-75 relative">
              {chartData.length > 0 && (
              <ResponsiveContainer width="99%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorReports"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e2e8f0"
                    className="dark:stroke-slate-800"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: 700, fill: "#94a3b8" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: 700, fill: "#94a3b8" }}
                  />
                  <Tooltip
                    cursor={{ stroke: "#10b981", strokeWidth: 2 }}
                    contentStyle={{
                      backgroundColor: "rgba(15, 23, 42, 0.95)",
                      borderRadius: "16px",
                      border: "1px solid rgba(16, 185, 129, 0.2)",
                      color: "#fff",
                      fontSize: "12px",
                      fontWeight: "800",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="reports"
                    stroke="#10b981"
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#colorReports)"
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
              )}
            </div>
          </DashboardCard>

          {/* Access Hub */}
          <DashboardCard>
            <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white mb-6">
              Access Hub
            </h2>
            <div className="space-y-3">
              {[
                {
                  label: "Report Anomaly",
                  icon: Plus,
                  path: "/issues/report",
                  variant: "primary",
                },
                {
                  label: "Active Nodes",
                  icon: Eye,
                  path: "/issues",
                  variant: "secondary",
                },
                {
                  label: "Neural Identity",
                  icon: Shield,
                  path: "/profile",
                  variant: "outline",
                },
              ].map((action, i) => (
                <Link href={action.path} key={i} className="block group">
                  <div
                    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ${
                      action.variant === "primary"
                        ? "bg-slate-900 dark:bg-emerald-600 text-white"
                        : "bg-slate-50 dark:bg-slate-800/30 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-800"
                    } group-hover:translate-x-1 group-hover:shadow-lg group-hover:border-emerald-500/30`}
                  >
                    <div className="flex items-center gap-3">
                      <action.icon
                        className={`w-5 h-5 ${
                          action.variant === "primary"
                            ? "text-white"
                            : "text-emerald-500"
                        }`}
                      />
                      <span className="font-black text-xs uppercase tracking-tight">
                        {action.label}
                      </span>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${
                        action.variant === "primary"
                          ? "text-emerald-400"
                          : "text-slate-400"
                      }`}
                    />
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-8 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
              <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1">
                Security Status
              </p>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 leading-tight">
                All systems encrypted. Reports validated by the network.
              </p>
            </div>
          </DashboardCard>
        </div>

        {/* Recent Activity List */}
        <DashboardCard>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
              Recent Transmissions
            </h2>
            {recentIssues.length > 0 && (
              <Link href="/issues">
                <button className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition-colors">
                  View All Nodes
                </button>
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {recentIssues.length > 0 ? (
                recentIssues.slice(0, 4).map((issue) => (
                  <Link href={`/issues/${issue._id}`} key={issue._id}>
                    <motion.div
                      whileHover={{ y: -4, scale: 1.01 }}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="cursor-pointer group relative flex items-center gap-4 p-4 rounded-[2rem] border border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all duration-300"
                    >
                      <div className="relative w-16 h-16 shrink-0">
                        <div className="relative w-full h-full">
                          <Image
                            src={issue.images?.[0] || "/placeholder-issue.jpg"}
                            alt={issue.title}
                            fill
                            className="rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        </div>

                        <div
                          className={`absolute -top-1 -right-1 px-2 py-0.5 text-[7px] font-black text-white rounded-full uppercase tracking-tighter ${
                            issue.status === "resolved"
                              ? "bg-emerald-500"
                              : "bg-amber-500"
                          }`}
                        >
                          {issue.status}
                        </div>
                      </div>
                      <div className="grow">
                        <h3 className="font-black text-slate-800 dark:text-slate-100 text-sm mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1">
                          {issue.title}
                        </h3>
                        <div className="flex flex-wrap gap-x-4 gap-y-1">
                          <span className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400">
                            <MapPin className="w-3 h-3 text-emerald-500" />
                            {issue.location?.address?.split(",")[0] || "Global"}
                          </span>
                          <span className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400">
                            <Calendar className="w-3 h-3 text-emerald-500" />
                            {new Date(issue.createdAt).toISOString().split("T")[0]
}
                          </span>
                        </div>
                      </div>
                      <div className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    </motion.div>
                  </Link>
                ))
              ) : (
                /* RESPONSIVE EMPTY STATE DIV */
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="col-span-full py-16 flex flex-col items-center justify-center text-center bg-slate-50/50 dark:bg-slate-900/20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem]"
                >
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full animate-pulse" />
                    <div className="relative p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xl">
                      <ZapOff className="w-8 h-8 text-emerald-500/50" />
                    </div>
                  </div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-2">
                    Zero Transmissions Detected
                  </h3>
                  <p className="text-[11px] font-bold text-slate-400 max-w-60 leading-relaxed mb-8">
                    The network is currently clear. No anomalies have been
                    reported in your sector.
                  </p>
                  <Link href="/issues/report">
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-950 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-transform">
                      <Plus className="w-3.5 h-3.5" />
                      Initialize First Report
                    </button>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}
