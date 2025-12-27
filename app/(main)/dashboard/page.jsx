"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Plus,
  ArrowRight,
  MapPin,
  Calendar,
  Eye,
  Shield,
  ChevronRight,
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

// Mocking useAuth for standalone completeness
const useAuth = () => ({ user: { name: "Harsh Singh" } });

import { calculateIssueStats, generateIssuePreviewList, generateMonthlyChartData, ISSUE_DETAILS } from "@/lib/mock-data";

const MOCK_ISSUES = generateIssuePreviewList(ISSUE_DETAILS);
console.log(MOCK_ISSUES);

const stats = calculateIssueStats(MOCK_ISSUES);

const chartData = generateMonthlyChartData(MOCK_ISSUES);

import Button from "@/components/ui/Button";
import Link from "next/link";

export default function Dashboard() {
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIssues = async () => {
      setIssues(MOCK_ISSUES);
      setTimeout(() => setLoading(false), 200);
    };
    fetchIssues();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4 bg-white dark:bg-slate-950">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-emerald-500/20 rounded-full border-t-emerald-500 animate-spin"></div>
          <Shield className="absolute w-6 h-6 text-emerald-500 animate-pulse" />
        </div>
        <p className="text-slate-500 font-black tracking-widest text-[10px] uppercase animate-pulse">
          Syncing Neural Pulse...
        </p>
      </div>
    );
  }

  // console.log(issues);

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
          {stats.map((stat, index) => (
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
          <DashboardCard className="lg:col-span-2">
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
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
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
            </div>
          </DashboardCard>

          {/* Quick Hub Navigation */}
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
                <button key={i} className="w-full group">
                  <Link href={`${action.path}`}>
                    <div
                      className={`
                    w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300
                    ${
                      action.variant === "primary"
                        ? "bg-slate-900 dark:bg-emerald-600 text-white"
                        : "bg-slate-50 dark:bg-slate-800/30 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-800"
                    }
                    group-hover:translate-x-1 group-hover:shadow-lg group-hover:border-emerald-500/30
                  `}
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
                </button>
              ))}
            </div>

            <div className="mt-8 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
              <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1">
                Security Status
              </p>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 leading-tight">
                All systems encrypted. Your reports are anonymous and validated
                by the network.
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
            <Link href="/issues">
              <button className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition-colors">
                View All Nodes
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {issues.length > 0 ? (
              issues.slice(0, 4).map((issue) => (
                <Link href={`/issues/${issue._id}`} key={issue._id}>
                  <motion.div
                    whileHover={{ y: -4, scale: 1.01 }}
                    className="cursor-pointer group relative flex items-center gap-4 p-4 rounded-[2rem] border border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all duration-300"
                  >
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <img
                        src={
                          issue.images?.[0] ||
                          "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=100&q=80"
                        }
                        alt={issue.title}
                        className="w-full h-full rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      />
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
                    <div className="flex-grow">
                      <h3 className="font-black text-slate-800 dark:text-slate-100 text-sm mb-1 group-hover:text-emerald-600 transition-colors">
                        {issue.title}
                      </h3>
                      <div className="flex flex-wrap gap-x-4 gap-y-1">
                        <span className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400">
                          <MapPin className="w-3 h-3 text-emerald-500" />
                          {issue.address?.split(",")[0] || "Global"}
                        </span>
                        <span className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400">
                          <Calendar className="w-3 h-3 text-emerald-500" />
                          {new Date(issue.createdAt).toLocaleDateString()}
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
              <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">
                  No active data nodes found.
                </p>
              </div>
            )}
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}
