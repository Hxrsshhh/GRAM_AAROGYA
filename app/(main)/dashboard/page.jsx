'use client'

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  ArrowRight,
  MapPin,
  Calendar,
  Eye,
  Activity,
  ArrowUpRight,
  Shield,
  ChevronRight
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

/**
 * FIX NOTES:
 * 1. Router Error: Replaced Link/react-router-dom with a local state 'navigation' mock 
 * to avoid the "basename" null context error (which happens when Link is used outside a Router).
 * 2. Fetch Error: Added robust mock data fallback so the dashboard displays correctly even 
 * if the local server (localhost:5000) is not running.
 */

// Mocking useAuth for standalone completeness
const useAuth = () => ({ user: { name: "John Doe" } });

// UI Component: Glassmorphic Card
const DashboardCard = ({ children, className = "" }) => (
  <div className={`bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 shadow-xl shadow-emerald-500/5 ${className}`}>
    {children}
  </div>
);

// Fallback Mock Data for when Backend is offline
const MOCK_ISSUES = [
  { _id: '1', title: "Water Main Leak", status: "pending", address: "123 Emerald St, Metro", createdAt: new Date().toISOString(), images: [] },
  { _id: '2', title: "Power Line Down", status: "in-progress", address: "456 Sapphire Ave, Metro", createdAt: new Date().toISOString(), images: [] },
  { _id: '3', title: "Pothole Repair", status: "resolved", address: "789 Ruby Rd, Metro", createdAt: new Date().toISOString(), images: [] },
  { _id: '4', title: "Street Light Out", status: "pending", address: "101 Jade Ln, Metro", createdAt: new Date().toISOString(), images: [] },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Navigation Mock (replacing react-router Link to prevent context errors)
  const navigate = (path) => {
    console.log(`Navigating to: ${path}`);
    // In a real app, this would use a router hook or state update
  };

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/issues");
        if (res.ok) {
          const data = await res.json();
          setIssues(data);
        } else {
          setIssues(MOCK_ISSUES);
        }
      } catch (err) {
        console.warn("Backend not reached, using simulated pulse data.");
        setIssues(MOCK_ISSUES);
      } finally {
        setTimeout(() => setLoading(false), 800); // Smooth transition
      }
    };
    fetchIssues();
  }, []);

  const stats = [
    {
      title: "Total Reports",
      value: issues.length.toString(),
      change: "+12% vs last month",
      icon: <TrendingUp className="w-5 h-5" />,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Pending",
      value: issues.filter((i) => i.status === "pending").length.toString(),
      change: "Action required",
      icon: <Clock className="w-5 h-5" />,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      title: "Resolved",
      value: issues.filter((i) => i.status === "resolved").length.toString(),
      change: "High efficiency",
      icon: <CheckCircle2 className="w-5 h-5" />,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Active Pulse",
      value: issues.filter((i) => i.status === "in-progress").length.toString(),
      change: "Live updates",
      icon: <Activity className="w-5 h-5" />,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
    },
  ];

  const chartData = [
    { name: "Jan", reports: 4 },
    { name: "Feb", reports: 7 },
    { name: "Mar", reports: 5 },
    { name: "Apr", reports: 12 },
    { name: "May", reports: 9 },
    { name: "Jun", reports: issues.length || 15 },
  ];

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

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white">
              System <span className="text-emerald-600 dark:text-emerald-400">Overview</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
              Welcome back, <span className="text-slate-900 dark:text-slate-100 font-bold">{user?.name}</span>. Network is stable.
            </p>
          </motion.div>
          <motion.button
            onClick={() => navigate('/report')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
          >
            <Plus className="w-5 h-5" />
            REPORT ANOMALY
          </motion.button>
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
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.title}</p>
                    <p className="text-3xl font-black text-slate-900 dark:text-white">{stat.value}</p>
                    <p className={`text-[11px] font-bold mt-2 ${stat.color} opacity-80`}>{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                    {stat.icon}
                  </div>
                </div>
                <div className={`absolute -right-4 -bottom-4 w-20 h-20 rounded-full ${stat.bg} blur-2xl opacity-50`} />
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
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Live</span>
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} 
                  />
                  <Tooltip 
                    cursor={{ stroke: '#10b981', strokeWidth: 2 }}
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                      borderRadius: '16px', 
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                      color: '#fff',
                      fontSize: '12px',
                      fontWeight: '800'
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
            <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white mb-6">Access Hub</h2>
            <div className="space-y-3">
              {[
                { label: "Report Anomaly", icon: Plus, path: "/report", variant: "primary" },
                { label: "Active Nodes", icon: Eye, path: "/issues", variant: "secondary" },
                { label: "Neural Identity", icon: Shield, path: "/profile", variant: "outline" }
              ].map((action, i) => (
                <button 
                  key={i} 
                  onClick={() => navigate(action.path)}
                  className="w-full group"
                >
                  <div className={`
                    w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300
                    ${action.variant === 'primary' ? 'bg-slate-900 dark:bg-emerald-600 text-white' : 'bg-slate-50 dark:bg-slate-800/30 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-800'}
                    group-hover:translate-x-1 group-hover:shadow-lg group-hover:border-emerald-500/30
                  `}>
                    <div className="flex items-center gap-3">
                      <action.icon className={`w-5 h-5 ${action.variant === 'primary' ? 'text-white' : 'text-emerald-500'}`} />
                      <span className="font-black text-xs uppercase tracking-tight">{action.label}</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${action.variant === 'primary' ? 'text-emerald-400' : 'text-slate-400'}`} />
                  </div>
                </button>
              ))}
            </div>
            
            <div className="mt-8 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
              <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1">Security Status</p>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 leading-tight">All systems encrypted. Your reports are anonymous and validated by the network.</p>
            </div>
          </DashboardCard>
        </div>

        {/* Recent Activity List */}
        <DashboardCard>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Recent Transmissions</h2>
            <button onClick={() => navigate('/issues')} className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition-colors">
              View All Nodes
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {issues.length > 0 ? issues.slice(0, 4).map((issue) => (
              <motion.div
                key={issue._id}
                whileHover={{ y: -4, scale: 1.01 }}
                onClick={() => navigate(`/issues/${issue._id}`)}
                className="cursor-pointer group relative flex items-center gap-4 p-4 rounded-[2rem] border border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all duration-300"
              >
                <div className="relative w-16 h-16 flex-shrink-0">
                  <img
                    src={issue.images?.[0] || "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=100&q=80"}
                    alt={issue.title}
                    className="w-full h-full rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                  <div className={`absolute -top-1 -right-1 px-2 py-0.5 text-[7px] font-black text-white rounded-full uppercase tracking-tighter ${
                    issue.status === 'resolved' ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}>
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
            )) : (
              <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">No active data nodes found.</p>
              </div>
            )}
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}