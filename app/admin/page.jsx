"use client";

import React, { useEffect, useState } from "react";
import {
  Users,
  FileText,
  Clock,
  CheckCircle2,
  MoreVertical,
  LogOut,
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";
import { StatCard } from "@/components/ui/StatCard";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { fireOneTimeToast } from "@/lib/oneTimeToast";
import { useRouter } from "next/navigation";

const CATEGORY_COLORS = {
  infrastructure: "#3b82f6", // Blue – stability, structure
  utilities: "#8b5cf6", // Violet – systems, energy
  sanitation: "#10b981", // Emerald – cleanliness, health
  safety: "#f59e0b", // Amber – warning, attention
  environment: "#22c55e", // Green – nature, sustainability
  traffic: "#ef4444", // Red – urgency, congestion
  other: "#64748b", // Slate – neutral, uncategorized
};

export default function AdminDashboard() {
  const [loading, setLoading] = useState(false);

  const [dashboard, setDashboard] = useState({
    stats: {
      totalUsers: 0,
      activeUsers: 0,
      blockedUsers: 0,
      totalReports: 0,
      resolvedReports: 0,
      avgResponseTime: 0,
    },
    charts: {
      monthly: [],
      categories: [], // pie chart
    },
    recentIssuess: [], // 👈 NEW
  });

  const [barSize, setBarSize] = useState(24);
  const router = useRouter();

  useEffect(() => {
    requestAnimationFrame(() => {
      fireOneTimeToast("signinSuccess", "Welcome back!");
      fireOneTimeToast("googleLoginSuccess", "Welcome back!");
    });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        if (!res.ok) {
          throw new Error("Failed to fetch dashboard data");
        }
        const data = await res.json();
        setDashboard(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const update = () => {
      setBarSize(window.innerWidth < 640 ? 12 : 24);
    };

    update();
    window.addEventListener("resize", update);

    return () => window.removeEventListener("resize", update);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const categoriesWithColors = dashboard.charts.categories.map((cat) => ({
    ...cat,
    color: CATEGORY_COLORS[cat.name?.toLowerCase()] || "#64748b",
  }));

  const handleClick = (id) => {
    router.push(`/admin/issues/${id}`);
  };
  return (


   <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-500 font-['Plus_Jakarta_Sans',sans-serif] overflow-x-hidden">
  <div className="fixed inset-0 pointer-events-none opacity-30">
    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px]" />
  </div>

  <div className="relative z-10 flex flex-col lg:flex-row">
    <main className="flex-1 p-4 md:p-10 max-w-7xl mx-auto w-full pb-24 lg:pb-10 overflow-x-hidden">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pt-20 md:pt-12 lg:pt-6 md:mb-12 px-2">
        <div className="relative">
          <div className="hidden md:block absolute -left-4 top-1 bottom-1 w-1 bg-emerald-500 rounded-full opacity-50" />
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter text-slate-900 dark:text-white leading-none">
                System{" "}
                <span className="text-emerald-500 not-italic drop-shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                  Intel.
                </span>
              </h1>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[8px] font-black uppercase tracking-tighter text-emerald-600">
                  Active
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
                Admin Control Environment
              </p>
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
                v4.0
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="group relative w-full md:w-auto overflow-hidden flex items-center justify-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-rose-500/50 px-6 py-4 md:py-3 rounded-2xl transition-all duration-300 active:scale-95 shadow-sm hover:shadow-rose-500/5"
          >
            <div className="absolute inset-0 bg-rose-500 opacity-0 group-hover:opacity-[0.03] transition-opacity" />
            <LogOut size={16} className="text-slate-400 group-hover:text-rose-500 transition-colors" />
            <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 group-hover:text-rose-500 transition-colors">
              Terminate Session
            </span>
          </button>
        </div>
      </header>

      {/* Stat Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-10">
        <StatCard index={0} title="Civic Users" value={dashboard?.stats.totalUsers} change="12.5%" isPositive icon={Users} colorClass="bg-blue-500" />
        <StatCard index={1} title="Incidents Logged" value={dashboard?.stats.totalReports} change="8.2%" isPositive icon={FileText} colorClass="bg-emerald-500" />
        <StatCard index={2} title="Resolved" value={dashboard?.stats.resolvedReports} change="15.3%" isPositive icon={CheckCircle2} colorClass="bg-purple-500" />
        <StatCard index={3} title="Avg Response" value={`${dashboard?.stats.avgResponseTime}d`} change="0.4d" isPositive={false} icon={Clock} colorClass="bg-orange-500" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-10">
        {/* BAR CHART SECTION */}
        <div className="lg:col-span-2 min-w-0 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-[1.5rem] md:rounded-[2.5rem] p-5 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h2 className="text-lg md:text-xl font-black italic">
              Incident <span className="text-emerald-500 not-italic">Velocity</span>
            </h2>
            <div className="flex gap-4 bg-slate-50 dark:bg-slate-800/40 p-2 rounded-xl">
              <div className="flex items-center gap-2 text-[9px] md:text-[10px] font-black uppercase px-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500" /> Reports
              </div>
              <div className="flex items-center gap-2 text-[9px] md:text-[10px] font-black uppercase px-1">
                <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600" /> Resolved
              </div>
            </div>
          </div>
          
          <div className="w-full h-[320px] md:h-[380px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart data={dashboard.charts.monthly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                  <linearGradient id="resGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#94a3b8" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#94a3b8" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#94a3b8" opacity={0.1} />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 700 }}
                  dy={10}
                />
                <YAxis hide domain={[0, 'auto']} />
                <Tooltip
                  cursor={{ fill: "rgba(16,185,129,0.05)" }}
                  contentStyle={{
                    borderRadius: "16px",
                    border: "none",
                    backgroundColor: "#0f172a",
                    color: "#fff",
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.2)",
                  }}
                />
                <Bar dataKey="reports" fill="url(#barGrad)" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="resolved" fill="url(#resGrad)" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PIE CHART SECTION */}
        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-[1.5rem] md:rounded-[2.5rem] p-5 md:p-8 flex flex-col">
          <h2 className="text-lg md:text-xl font-black italic mb-6">
            Incident <span className="text-emerald-500 not-italic">Domains</span>
          </h2>
          <div className="flex-1 min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <PieChart>
                <Pie
                  data={categoriesWithColors}
                  innerRadius="60%"
                  outerRadius="80%"
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {categoriesWithColors.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {categoriesWithColors.map((cat, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                <span className="text-[9px] font-black uppercase text-slate-500 truncate">
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Reports Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-lg md:text-xl font-black italic">
            Recent <span className="text-emerald-500 not-italic">Protocol Logs</span>
          </h2>
          <Link href="/admin/issues">
            <button className="text-[10px] md:text-xs font-black uppercase tracking-widest text-emerald-500 hover:underline">
              View All
            </button>
          </Link>
        </div>

        {/* MOBILE VIEW Cards */}
        <div className="block md:hidden">
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {dashboard.recentIssuess.map((issue) => (
              <div key={issue.id} onClick={() => handleClick(issue.id)} className="p-5 active:bg-slate-50 dark:active:bg-slate-800/50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div className="max-w-[70%]">
                    <div className="font-bold text-sm dark:text-white leading-tight">{issue.title}</div>
                    <div className="text-[9px] text-slate-400 font-bold uppercase mt-1">
                      ID: {issue.id.slice(0, 8)} • {issue.date}
                    </div>
                  </div>
                  <button className="p-1 text-slate-400"><MoreVertical size={16} /></button>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex gap-2">
                    <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[9px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400">{issue.category}</span>
                    <span className={`text-[9px] font-black uppercase tracking-widest self-center ${issue.priority === "Critical" ? "text-rose-500" : issue.priority === "High" ? "text-orange-500" : "text-slate-400"}`}>{issue.priority}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${issue.status === "resolved" ? "bg-emerald-500" : issue.status === "in-progress" ? "bg-blue-500" : "bg-orange-500"}`} />
                    <span className="text-[10px] font-bold">{issue.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DESKTOP VIEW Table */}
        <div className="hidden md:block overflow-x-auto no-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500">
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest">Incident</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest">Domain</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest">Status</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest">Priority</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {dashboard.recentIssuess.map((issue) => (
                <tr key={issue.id} onClick={() => handleClick(issue.id)} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer">
                  <td className="px-8 py-5">
                    <div className="font-bold text-sm dark:text-white">{issue.title}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase mt-1">Logged: {issue.date}</div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">{issue.category}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${issue.status === "resolved" ? "bg-emerald-500" : issue.status === "in-progress" ? "bg-blue-500" : "bg-orange-500"}`} />
                      <span className="text-xs font-bold">{issue.status}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${issue.priority === "Critical" ? "text-rose-500" : issue.priority === "High" ? "text-orange-500" : "text-slate-400"}`}>{issue.priority}</span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400"><MoreVertical size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>

  <style dangerouslySetInnerHTML={{ __html: `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200..800&display=swap');
    body { overflow-x: hidden !important; font-family: 'Plus Jakarta Sans', sans-serif; }
    .no-scrollbar::-webkit-scrollbar { display: none !important; }
    .no-scrollbar { -ms-overflow-style: none !important; scrollbar-width: none !important; }
    ::-webkit-scrollbar { width: 6px; height: 0px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #10b981; border-radius: 20px; }
  `}} />
</div>

    
  );
}
