'use client'

import React, { useEffect, useState, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  FileText, 
  Clock, 
  CheckCircle2, 
  Filter, 
  MoreVertical, 
  ArrowUpRight, 
  ArrowDownRight,
  RefreshCcw,
  Search,
  Activity,
  Sun,
  Moon,
  LayoutDashboard,
  ShieldAlert,
  Map
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts";

// --- Theme Management ---
const ThemeContext = createContext({ theme: 'dark', setTheme: () => {} });
const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);
  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
};
const useTheme = () => useContext(ThemeContext);

// --- Mock Data ---
const MOCK_STATS = {
  totalUsers: 1420,
  totalReports: 842,
  resolvedReports: 612,
  avgResponseTime: 1.8,
};

const MOCK_MONTHLY = [
  { month: 'Jan', reports: 40, resolved: 35 },
  { month: 'Feb', reports: 55, resolved: 48 },
  { month: 'Mar', reports: 75, resolved: 60 },
  { month: 'Apr', reports: 60, resolved: 58 },
  { month: 'May', reports: 90, resolved: 70 },
  { month: 'Jun', reports: 110, resolved: 85 },
];

const MOCK_CATEGORIES = [
  { name: 'Infrastructure', value: 400, color: '#3b82f6' },
  { name: 'Sanitation', value: 300, color: '#10b981' },
  { name: 'Safety', value: 300, color: '#f59e0b' },
  { name: 'Utilities', value: 200, color: '#8b5cf6' },
];

const MOCK_ISSUES = [
  { id: 1, title: 'Broken Water Main', category: 'Infrastructure', status: 'In Progress', priority: 'High', date: '2023-06-25' },
  { id: 2, title: 'Illegal Dumping Site', category: 'Sanitation', status: 'Resolved', priority: 'Medium', date: '2023-06-24' },
  { id: 3, title: 'Flickering Street Light', category: 'Utilities', status: 'Pending', priority: 'Low', date: '2023-06-23' },
  { id: 4, title: 'Exposed Electrical Wires', category: 'Safety', status: 'Critical', priority: 'Emergency', date: '2023-06-22' },
];

// --- Enhanced UI Components ---
const StatCard = ({ title, value, change, isPositive, icon: Icon, colorClass, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="relative group overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-500"
  >
    <div className={`absolute top-0 right-0 w-24 h-24 blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity rounded-full ${colorClass}`} />
    
    <div className="flex justify-between items-start relative z-10">
      <div className={`p-3 rounded-2xl ${colorClass.replace('bg-', 'bg-')}/10 text-slate-700 dark:text-white`}>
        <Icon size={24} />
      </div>
      <div className={`flex items-center gap-1 text-xs font-black ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
        {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {change}
      </div>
    </div>
    
    <div className="mt-4 relative z-10">
      <h3 className="text-3xl font-black tracking-tighter dark:text-white">{value}</h3>
      <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mt-1">{title}</p>
    </div>
  </motion.div>
);

export const AdminDashboard = () => {
  const [loading, setLoading] = useState(false);
  const { theme, setTheme } = useTheme();

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-500">
      {/* Sidebar Overlay Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px]" />
      </div>

      <div className="relative z-10 flex">
        {/* Simple Sidebar */}
        <aside className="hidden lg:flex flex-col w-20 h-screen sticky top-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 items-center py-8 gap-8">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
            <Activity className="text-white w-6 h-6" />
          </div>
          <div className="flex flex-col gap-6 mt-10">
            {[LayoutDashboard, Map, Users, ShieldAlert].map((Icon, i) => (
              <button key={i} className={`p-3 rounded-xl transition-colors ${i === 0 ? 'bg-emerald-500/10 text-emerald-500' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                <Icon size={22} />
              </button>
            ))}
          </div>
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="mt-auto p-3 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </aside>

        <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <div>
              <h1 className="text-4xl font-black italic tracking-tight">System <span className="text-emerald-500 not-italic">Intel.</span></h1>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mt-1">Admin Control Environment v4.0</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2 pl-10 pr-4 outline-none focus:border-emerald-500 transition-all text-sm w-64" placeholder="Search incidents..." />
              </div>
              <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg">
                <RefreshCcw size={14} /> Refresh
              </button>
            </div>
          </header>

          {/* Stat Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <StatCard index={0} title="Civic Users" value={MOCK_STATS.totalUsers} change="12.5%" isPositive icon={Users} colorClass="bg-blue-500" />
            <StatCard index={1} title="Incidents Logged" value={MOCK_STATS.totalReports} change="8.2%" isPositive icon={FileText} colorClass="bg-emerald-500" />
            <StatCard index={2} title="Resolved" value={MOCK_STATS.resolvedReports} change="15.3%" isPositive icon={CheckCircle2} colorClass="bg-purple-500" />
            <StatCard index={3} title="Avg Response" value={`${MOCK_STATS.avgResponseTime}d`} change="0.4d" isPositive={false} icon={Clock} colorClass="bg-orange-500" />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
            <div className="lg:col-span-2 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black italic">Incident <span className="text-emerald-500 not-italic">Velocity</span></h2>
                <div className="flex gap-2">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Reports</div>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase"><div className="w-2 h-2 rounded-full bg-slate-300" /> Resolved</div>
                </div>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={MOCK_MONTHLY}>
                    <defs>
                      <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#059669" />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} dy={10} />
                    <YAxis hide />
                    <Tooltip cursor={{fill: 'rgba(16,185,129,0.05)'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                    <Bar dataKey="reports" fill="url(#barGrad)" radius={[6, 6, 0, 0]} barSize={24} />
                    <Bar dataKey="resolved" fill="#e2e8f0" radius={[6, 6, 0, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 flex flex-col">
              <h2 className="text-xl font-black italic mb-8">Incident <span className="text-emerald-500 not-italic">Domains</span></h2>
              <div className="flex-1 h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={MOCK_CATEGORIES}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {MOCK_CATEGORIES.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {MOCK_CATEGORIES.map((cat, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{backgroundColor: cat.color}} />
                    <span className="text-[10px] font-black uppercase text-slate-500">{cat.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Reports Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] overflow-hidden">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-xl font-black italic">Recent <span className="text-emerald-500 not-italic">Protocol Logs</span></h2>
              <button className="text-xs font-black uppercase tracking-widest text-emerald-500 hover:underline">View All Entries</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500">
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest">Incident</th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest">Domain</th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest">Status</th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest">Priority</th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {MOCK_ISSUES.map((issue) => (
                    <tr key={issue.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-8 py-5">
                        <div className="font-bold text-sm dark:text-white">{issue.title}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-1">Logged: {issue.date}</div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">
                          {issue.category}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            issue.status === 'Resolved' ? 'bg-emerald-500' : 
                            issue.status === 'In Progress' ? 'bg-blue-500' : 'bg-orange-500'
                          }`} />
                          <span className="text-xs font-bold">{issue.status}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${
                          issue.priority === 'Emergency' ? 'text-rose-500' : 
                          issue.priority === 'High' ? 'text-orange-500' : 'text-slate-400'
                        }`}>
                          {issue.priority}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400">
                          <MoreVertical size={16} />
                        </button>
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
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
      `}} />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AdminDashboard />
    </ThemeProvider>
  );
}