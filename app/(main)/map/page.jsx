"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import {
  MapPin,
  Clock,
  Search,
  ChevronLeft,
  X,
  Menu,
  Sun,
  Moon,
  Activity,
  PlusCircle,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";

// --- API UTILS ---
const formatRelativeTime = (dateString) => {
  if (!dateString) return "Recently";
  const now = new Date();
  const reported = new Date(dateString);
  if (isNaN(reported.getTime())) return "Recently";
  const diffInMs = now - reported;
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  if (diffInHours < 1) {
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    return diffInMins <= 1 ? "Just now" : `${diffInMins} mins ago`;
  }
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return diffInDays === 1 ? "Yesterday" : `${diffInDays} days ago`;
};

export const fetchCivicIssues = async () => {
  try {
    const response = await fetch("/api/issues", {
      method: "GET",
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Failed to fetch");
    const result = await response.json();
    const rawIssues = Array.isArray(result) ? result : result.data || [];

    return rawIssues
      .map((issue) => {
        const lat = parseFloat(issue.location.latitude || issue.location.lat);
        const lng = parseFloat(issue.location.longitude || issue.location.lng);
        if (isNaN(lat) || isNaN(lng)) return null;

        return {
          id: issue._id,
          title: issue.title,
          category: issue.category,
          status: issue.status,
          description: issue.description || "",
          lat: lat,
          lng: lng,
          address: issue.location.address,
          reportedAt: formatRelativeTime(issue.created_at),
          images: Array.isArray(issue.images) ? issue.images : issue.images ? [issue.images] : [],
        };
      })
      .filter((issue) => issue !== null);
  } catch (error) {
    console.error("Fetch Error:", error);
    return [];
  }
};

const INITIAL_VIEW = {
  center: [78.9629, 20.5937],
  zoom: 5,
};

// --- MAIN COMPONENT ---
const App = () => {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mapInstance, setMapInstance] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const data = await fetchCivicIssues();
        setIssues(data);
      } finally {
        setLoading(false);
      }
    };
    if (mounted) loadInitialData();
  }, [mounted]);

  useEffect(() => {
    if (!mounted || mapRef.current) return;
    const style =
      resolvedTheme === "dark"
        ? "https://api.maptiler.com/maps/darkmatter/style.json"
        : "https://api.maptiler.com/maps/streets-v2/style.json";

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: `${style}?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`,
      center: INITIAL_VIEW.center,
      zoom: INITIAL_VIEW.zoom,
    });

    map.addControl(new maplibregl.NavigationControl(), "bottom-right");
    map.on("load", () => {
      mapRef.current = map;
      setMapInstance(map);
    });
    return () => map.remove();
  }, [mounted]);

  useEffect(() => {
    if (mapRef.current && issues.length > 0) {
      const bounds = new maplibregl.LngLatBounds();
      issues.forEach((is) => bounds.extend([is.lng, is.lat]));
      mapRef.current.fitBounds(bounds, { padding: 80, maxZoom: 10 });
    }
  }, [issues]);

  useEffect(() => {
    if (mapRef.current) {
      const style =
        resolvedTheme === "dark"
          ? "https://api.maptiler.com/maps/darkmatter/style.json"
          : "https://api.maptiler.com/maps/streets-v2/style.json";
      mapRef.current.setStyle(`${style}?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`);
    }
  }, [resolvedTheme]);

  const handlePinSelection = (issue) => {
    if (isNaN(issue.lng) || isNaN(issue.lat)) return;
    setSelectedIssue({ ...issue });
    mapRef.current?.flyTo({
      center: [issue.lng, issue.lat],
      zoom: 16,
      essential: true,
      duration: 2000,
    });
  };

  const handleCloseDetails = () => {
    setSelectedIssue(null);
    mapRef.current?.flyTo({
      center: INITIAL_VIEW.center,
      zoom: INITIAL_VIEW.zoom,
      duration: 1800,
    });
  };

  const filteredIssues = useMemo(() => {
    return issues.filter((issue) =>
      issue.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, issues]);

  if (!mounted) return null;

  return (
    <div className={`relative h-screen w-full font-sans overflow-hidden transition-colors duration-500 ${resolvedTheme === "dark" ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"}`}>
      <main className="absolute inset-0 z-0">
        <div ref={mapContainer} className="h-full w-full" />
        {mapInstance && filteredIssues.map((issue) => (
          <MarkerOverlay
            key={issue.id}
            map={mapInstance}
            issue={issue}
            isSelected={selectedIssue?.id === issue.id}
            onClick={() => handlePinSelection(issue)}
          />
        ))}
      </main>

      <div className="absolute top-6 right-6 z-50">
        <button onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")} className="p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl hover:scale-105 transition-all">
          {resolvedTheme === "dark" ? <Sun size={20} className="text-emerald-400" /> : <Moon size={20} className="text-emerald-600" />}
        </button>
      </div>

      <motion.div animate={{ width: isSidebarCollapsed ? "80px" : "384px" }} className="absolute top-6 left-6 bottom-6 z-50">
        <aside className="h-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden">
          <div className={`p-6 border-b border-slate-200 dark:border-slate-800 flex items-center ${isSidebarCollapsed ? "justify-center" : "justify-between"}`}>
            {!isSidebarCollapsed && (
              <div className="flex items-center gap-3">
                <div className="bg-emerald-600 p-2 rounded-xl"><Activity className="text-white" size={18} /></div>
                <h1 className="text-xl font-black tracking-tighter">Civic<span className="text-emerald-600">Pulse</span></h1>
              </div>
            )}
            <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
              {isSidebarCollapsed ? <Menu /> : <ChevronLeft />}
            </button>
          </div>

          {!isSidebarCollapsed && (
            <div className="flex-1 flex flex-col min-h-0">
              <div className="p-5 pb-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="text" placeholder="Search reports..." className="w-full pl-10 pr-4 py-3 bg-slate-100/50 dark:bg-slate-800/50 rounded-2xl outline-none" value={searchQuery || ''} onChange={(e) => setSearchQuery(e.target.value)} />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {loading ? <div className="text-center p-8 text-slate-400 animate-pulse font-bold text-xs">Loading Civic Data...</div> : 
                  filteredIssues.map((issue) => (
                    <div key={issue.id} onClick={() => handlePinSelection(issue)} className={`group relative p-3 rounded-[1.5rem] cursor-pointer transition-all flex gap-4 items-center ${selectedIssue?.id === issue.id ? "bg-white dark:bg-slate-800/20 ring-1 ring-slate-500/20 scale-[1.02]" : "bg-slate-50/80 dark:bg-slate-900/40 hover:bg-white"}`}>
                      <div className="relative w-14 h-14 flex-shrink-0 rounded-2xl overflow-hidden bg-slate-200">
                        <img src={issue.images?.[0] || "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=200"} className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700" alt="" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[7px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600">● {issue.status}</span>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1"><Clock size={10} />{issue.reportedAt}</span>
                        </div>
                        <h3 className="font-bold text-sm truncate">{issue.title}</h3>
                      </div>
                    </div>
                  ))
                }
              </div>

              {/* ACTION AREA - AS REQUESTED */}
              <div className="p-4 space-y-3 bg-slate-50/30 dark:bg-slate-800/20 border-t border-slate-200 dark:border-slate-800">
                <Link href="/issues/report">
                  <button className="w-full p-4 mb-2 rounded-2xl border-2 border-dashed border-emerald-500/30 hover:border-emerald-500/60 transition-all text-emerald-600 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                    <PlusCircle size={16} /> Report New Issue
                  </button>
                </Link>

                <div className="flex gap-2">
                  <Link href="/map" className="flex-1">
                    <button className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-sm text-emerald-600 border border-slate-200 dark:border-slate-700 font-black uppercase text-[10px]">
                      <MapPin size={16} /> Map
                    </button>
                  </Link>
                  <Link href="/dashboard" className="flex-1">
                    <button className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl text-slate-400 hover:text-emerald-500 bg-white/50 dark:bg-slate-800/50 border border-transparent transition-all font-black uppercase text-[10px]">
                      <LayoutDashboard size={16} /> Dashboard
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </aside>
      </motion.div>

      <AnimatePresence mode="wait">
        {selectedIssue && (
          <motion.div key={selectedIssue.id} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className={`absolute bottom-8 right-6 z-40 transition-all ${isSidebarCollapsed ? "left-28" : "left-[26.5rem]"}`}>
            <div className="bg-white/90 dark:bg-slate-900/95 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col md:flex-row max-w-3xl">
              <div className="relative w-full md:w-64 h-32 md:h-auto overflow-hidden">
                <img src={selectedIssue.images?.[0] || "https://images.unsplash.com/photo-1584467735815-f778f274e296?w=800"} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 p-8 relative">
                <button onClick={handleCloseDetails} className="absolute top-5 right-5 p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-rose-500 hover:text-white transition-all"><X size={18} /></button>
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 rounded-full text-[11px] font-black uppercase">{selectedIssue.category || "General"}</span>
                </div>
                <h2 className="text-3xl font-black mb-2 tracking-tight">{selectedIssue.title}</h2>
                <div className="flex items-center gap-1.5 mb-4 text-slate-500 text-sm font-medium"><MapPin size={16} className="text-rose-500" /> {selectedIssue.address}</div>
                <p className="text-slate-600 dark:text-slate-300 text-sm mb-6 line-clamp-3 leading-relaxed">{selectedIssue.description}</p>
                <div className="flex gap-3">
                  <Link href={`/issues/${selectedIssue.id}`} className="flex-1">
                    <button className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-emerald-500/20">View Detailed Analytics</button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- RED GOOGLE-STYLE PIN ---
const MarkerOverlay = ({ map, issue, isSelected, onClick }) => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  useEffect(() => {
    if (!map) return;
    const updatePosition = () => {
      const canvasPos = map.project([issue.lng, issue.lat]);
      setPos({ x: canvasPos.x, y: canvasPos.y });
    };
    map.on("move", updatePosition);
    map.on("zoom", updatePosition);
    updatePosition();
    return () => {
      map.off("move", updatePosition);
      map.off("zoom", updatePosition);
    };
  }, [map, issue]);

  if (pos.x < -50 || pos.y < -50) return null;

  return (
    <div
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className="absolute top-0 left-0 cursor-pointer z-10 transition-transform duration-300"
      style={{ transform: `translate(${pos.x}px, ${pos.y}px) translate(-50%, -100%)` }}
    >
      <div className="relative group">
        {/* The Google Map style drop shape */}
        <div className={`
          relative flex items-center justify-center transition-all duration-300
          ${isSelected ? "scale-125 mb-1" : "hover:scale-110"}
        `}>
          {/* Main Pin Vector Shape */}
          <div className={`
            w-10 h-10 rounded-full rounded-bl-none rotate-[-45deg] 
            flex items-center justify-center shadow-xl
            ${isSelected ? "bg-gradient-to-tr from-rose-700 to-rose-500" : "bg-gradient-to-tr from-rose-600 to-rose-400"}
          `}>
             {/* The White Center Circle */}
             <div className="w-4 h-4 bg-white rounded-full rotate-[45deg] shadow-inner shadow-black/20" />
          </div>
          
          {/* Pulsing effect when selected */}
          {isSelected && (
            <div className="absolute inset-0 w-10 h-10 rounded-full bg-rose-500/30 animate-ping -z-10" />
          )}
        </div>
        
        {/* Soft shadow below the pin tip */}
        <div className="w-4 h-1 bg-black/20 blur-[2px] rounded-full mx-auto -mt-1" />
      </div>
    </div>
  );
};

export default App;