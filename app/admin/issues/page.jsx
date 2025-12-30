"use client";

import React, {
  useState,
  useMemo,
  useContext,
  useEffect,
  forwardRef,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  RefreshCcw,
  Download,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  MapPin,
  User,
  Sun,
  Moon,
  Trash2,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

// // --- Theme Management ---
// const ThemeContext = createContext({ theme: "dark", setTheme: () => {} });
// const ThemeProvider = ({ children }) => {
//   const [theme, setTheme] = useState("dark");
//   useEffect(() => {
//     document.documentElement.classList.remove("light", "dark");
//     document.documentElement.classList.add(theme);
//   }, [theme]);
//   return (
//     <ThemeContext.Provider value={{ theme, setTheme }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };
// const useTheme = () => useContext(ThemeContext);

// --- Mock Data ---
const MOCK_ISSUES = [
  {
    id: "INC-9021",
    title: "Main Line Water Leak",
    category: "Infrastructure",
    status: "In Progress",
    priority: "High",
    date: "2023-06-25",
    reporter: "Alex Rivera",
    location: "Sector 7, North",
    description:
      "Significant pressure drop reported in the main conduit. Possible fissure detected near substation.",
    image:
      "https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "INC-9022",
    title: "Commercial Dumping",
    category: "Sanitation",
    status: "Resolved",
    priority: "Medium",
    date: "2023-06-24",
    reporter: "Sarah Chen",
    location: "Industrial Zone B",
    description:
      "Unidentified chemical waste containers found behind the logistics hub.",
    image:
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "INC-9023",
    title: "Grid-4 Street Failure",
    category: "Utilities",
    status: "Pending",
    priority: "Low",
    date: "2023-06-23",
    reporter: "Mike Ross",
    location: "West Riverside",
    description:
      "Intermittent lighting failure across four blocks. Potential wiring degradation.",
    image:
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "INC-9024",
    title: "Exposed HV Cabling",
    category: "Safety",
    status: "Critical",
    priority: "Emergency",
    date: "2023-06-22",
    reporter: "Janet Doe",
    location: "Central Plaza",
    description:
      "High voltage cable exposed after construction accident. Area cordoned off.",
    image:
      "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "INC-9025",
    title: "Damaged Pavement",
    category: "Infrastructure",
    status: "Pending",
    priority: "Medium",
    date: "2023-06-21",
    reporter: "Kevin Hart",
    location: "Market St",
    description:
      "Large pothole causing traffic delays. Urgent repair required for safety.",
    image:
      "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "INC-9026",
    title: "Sewage Overflow",
    category: "Sanitation",
    status: "In Progress",
    priority: "High",
    date: "2023-06-20",
    reporter: "Olivia Wild",
    location: "East Port",
    description:
      "Heavy rainfall causing backflow in the maritime district processing unit.",
    image:
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "INC-9027",
    title: "Illegal Signage",
    category: "Sanitation",
    status: "Resolved",
    priority: "Low",
    date: "2023-06-19",
    reporter: "Brian May",
    location: "Old Town",
    description:
      "Non-compliant advertising structures blocking public walkways.",
    image:
      "https://images.unsplash.com/photo-1536431311719-398b6704d400?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "INC-9028",
    title: "Suspected Gas Leak",
    category: "Safety",
    status: "Critical",
    priority: "Emergency",
    date: "2023-06-18",
    reporter: "David Tennant",
    location: "Block 4 Residences",
    description:
      "Multiple reports of gas odor in residential hallway. Emergency crew dispatched.",
    image:
      "https://images.unsplash.com/photo-1581094288338-2314dddb7e8b?auto=format&fit=crop&w=800&q=80",
  },
];

const CATEGORIES = [
  "All",
  "Infrastructure",
  "Sanitation",
  "Safety",
  "Utilities",
];
const STATUSES = ["All", "Pending", "In Progress", "Resolved", "Critical"];

const Badge = ({ children, variant }) => {
  const variants = {
    Emergency: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    High: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    Medium: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    Low: "bg-slate-500/10 text-slate-500 border-slate-500/20",
    Critical: "bg-rose-600/20 text-rose-600 border-rose-600/30",
    "In Progress": "bg-sky-500/10 text-sky-500 border-sky-500/20",
    Resolved: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    Pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border backdrop-blur-md ${
        variants[children] || variants[variant]
      }`}
    >
      {children}
    </span>
  );
};

const IncidentCard = forwardRef(({ issue, idx, ...props }, ref) => {
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: idx * 0.05 }}
      {...props}
      className="group relative flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] hover:shadow-2xl hover:shadow-emerald-500/10 hover:border-emerald-500/30 transition-all duration-500 overflow-hidden"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={issue.image}
          alt={issue.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800&q=80";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-900 via-transparent to-black/20" />
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <span className="font-mono text-[10px] font-black text-white bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
            {issue.id}
          </span>
          <Badge variant={issue.priority}>{issue.priority}</Badge>
        </div>
        <div className="absolute bottom-4 left-4">
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-500 bg-white/90 dark:bg-slate-900/90 px-3 py-1.5 rounded-full shadow-lg">
            {issue.category}
          </span>
        </div>
      </div>

      <div className="p-6 pt-2 flex-1 flex flex-col">
        <div
          className={`absolute top-48 right-0 w-16 h-16 blur-3xl opacity-10 transition-opacity group-hover:opacity-30 -mr-8 -mt-8 rounded-full ${
            issue.status === "Critical"
              ? "bg-rose-500"
              : issue.status === "Resolved"
              ? "bg-emerald-500"
              : "bg-blue-500"
          }`}
        />

        <div className="flex-1">
          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 group-hover:text-emerald-500 transition-colors line-clamp-1 leading-tight">
            {issue.title}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 mb-6">
            {issue.description}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="space-y-1">
              <span className="text-[9px] font-black uppercase text-slate-400 tracking-tighter">
                Location
              </span>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                <MapPin size={12} className="text-emerald-500 shrink-0" />
                <span className="truncate">{issue.location}</span>
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] font-black uppercase text-slate-400 tracking-tighter">
                Reporter
              </span>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                <User size={12} className="text-slate-400 shrink-0" />
                <span className="truncate">{issue.reporter}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                issue.status === "Critical"
                  ? "bg-rose-500 animate-pulse"
                  : issue.status === "Resolved"
                  ? "bg-emerald-500"
                  : "bg-blue-500"
              }`}
            />
            <span className="text-[10px] font-black uppercase tracking-tight text-slate-500">
              {issue.status}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button className="p-2.5 hover:bg-emerald-500/10 hover:text-emerald-500 rounded-2xl text-slate-400 transition-all">
              <CheckCircle size={18} />
            </button>
            <button className="p-2.5 hover:bg-rose-500/10 hover:text-rose-500 rounded-2xl text-slate-400 transition-all">
              <Trash2 size={18} />
            </button>
            <button className="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-500 hover:text-white rounded-2xl text-slate-500 dark:text-slate-400 transition-all ml-1 group/btn">
              <ArrowRight
                size={18}
                className="transition-transform group-hover/btn:translate-x-1"
              />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

// Set display name for IncidentCard to resolve linting warning
IncidentCard.displayName = "IncidentCard";

export const IssueArchive = () => {
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [filterStat, setFilterStat] = useState("All");

  const filtered = useMemo(() => {
    return MOCK_ISSUES.filter((i) => {
      const matchSearch =
        i.title.toLowerCase().includes(search.toLowerCase()) ||
        i.id.toLowerCase().includes(search.toLowerCase());
      const matchCat = filterCat === "All" || i.category === filterCat;
      const matchStat = filterStat === "All" || i.status === filterStat;
      return matchSearch && matchCat && matchStat;
    });
  }, [search, filterCat, filterStat]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-500 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Background patterns */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] opacity-20" />
      </div>

      <div className="relative z-10">
        {/* Header Section (Not fixed) */}
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 pt-12">
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                  Security & Infrastructure
                </span>
              </div>
              <h1 className="text-5xl font-black tracking-tight leading-none">
                Incident <span className="text-emerald-500 italic">Vault.</span>
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-emerald-500 hover:border-emerald-500/50 transition-all shadow-sm"
              >
                {"dark" === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-emerald-500 hover:shadow-lg transition-all shadow-sm">
                <Download size={14} /> Export CSV
              </button>
              <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-2xl shadow-emerald-600/30">
                <RefreshCcw size={14} /> Global Sync
              </button>
            </div>
          </header>
        </div>

        {/* Fixed Filtering Controls Container */}
        <div className="sticky top-0 z-50 py-4 px-6 md:px-12 lg:px-16 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-transparent transition-all duration-300 [.is-scrolled_&]:border-slate-200 [.is-scrolled_&]:dark:border-slate-800">
          <div className="max-w-[1440px] mx-auto">
            <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-4 lg:p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="relative flex-1 group">
                  <Search
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search by ID, Title, or Keyword..."
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl py-4 pl-14 pr-6 outline-none focus:ring-4 ring-emerald-500/10 focus:border-emerald-500 transition-all text-sm font-semibold shadow-inner"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex flex-col gap-1.5 min-w-[160px]">
                    <span className="text-[9px] font-black uppercase text-slate-400 px-1 ml-1">
                      Asset Domain
                    </span>
                    <select
                      className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 text-xs font-bold outline-none cursor-pointer hover:border-emerald-500 transition-all appearance-none"
                      value={filterCat}
                      onChange={(e) => setFilterCat(e.target.value)}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-[9px] font-black uppercase text-slate-400 px-1 ml-1">
                      Current Protocol
                    </span>
                    <div className="flex bg-white dark:bg-slate-950 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-x-auto scrollbar-hide">
                      {STATUSES.map((s) => (
                        <button
                          key={s}
                          onClick={() => setFilterStat(s)}
                          className={`px-4 py-2 rounded-xl text-[10px] whitespace-nowrap font-black transition-all ${
                            filterStat === s
                              ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                              : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid Content */}
        <main className="p-6 md:p-12 lg:p-16 max-w-[1440px] mx-auto w-full">
          {/* Card Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-10">
            <AnimatePresence mode="popLayout">
              {filtered.map((issue, idx) => (
                <IncidentCard key={issue.id} issue={issue} idx={idx} />
              ))}
            </AnimatePresence>
          </div>

          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-32 flex flex-col items-center justify-center text-slate-300 dark:text-slate-700 text-center"
            >
              <div className="w-24 h-24 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mb-6">
                <ShieldAlert size={48} strokeWidth={1} />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Zero Matches Found
              </h2>
              <p className="text-sm font-medium text-slate-500 max-w-xs uppercase tracking-widest leading-loose">
                Adjust your filter parameters or search query to find relevant
                records.
              </p>
            </motion.div>
          )}

          {/* Footer Controls */}
          <footer className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none transition-colors">
            <div className="flex items-center gap-4">
              <div className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
                Active Archive Count:{" "}
                <span className="text-emerald-500">{filtered.length}</span>
              </div>
              <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800" />
              <div className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
                Total Database: {MOCK_ISSUES.length}
              </div>
            </div>

            <div className="flex items-center gap-6">
              <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase">
                Page 01 // 01
              </span>
              <div className="flex gap-2">
                <button
                  className="w-12 h-12 flex items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-emerald-500 hover:text-white transition-all text-slate-400 disabled:opacity-30 disabled:pointer-events-none"
                  disabled
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  className="w-12 h-12 flex items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-emerald-500 hover:text-white transition-all text-slate-400 disabled:opacity-30 disabled:pointer-events-none"
                  disabled
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </footer>
        </main>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200..800&display=swap');
          
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }

          ::-webkit-scrollbar {
            width: 6px;
          }
          ::-webkit-scrollbar-track {
            background: transparent;
          }
          ::-webkit-scrollbar-thumb {
            background: #10b981;
            border-radius: 20px;
          }
        `,
        }}
      />
    </div>
  );
};

export default function App() {
  return <IssueArchive />;
}
