"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import {
  MapPin,
  Search,
  ChevronLeft,
  X,
  Menu,
  Sun,
  Moon,
  Activity,
  PlusCircle,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import useSWR from "swr";

import MarkerOverlay from "@/components/layouts/MapPin";

// --- UTILS ---
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
          images: Array.isArray(issue.images)
            ? issue.images
            : issue.images
            ? [issue.images]
            : [],
        };
      })
      .filter((issue) => issue !== null);
  } catch (error) {
    console.error("Fetch Error:", error);
    return [];
  }
};

const INITIAL_VIEW = {
  center: [81.9629, 20.5937],
  zoom: 4.5,
};

const MAP_STYLE = "https://api.maptiler.com/maps/streets-v2/style.json";

const App = () => {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mapInstance, setMapInstance] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Starting with sidebar open by default on desktop, but collapsible
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const fetcher = fetchCivicIssues;

  const {
    data: issues = [],
    isLoading,
    isValidating,
  } = useSWR("/api/issues/map", fetcher, {
    // 🚀 FAST LOAD SETTINGS
    keepPreviousData: true, // do NOT clear old data
    dedupingInterval: 60_000, // 1 min: avoid refetch spam
    revalidateOnFocus: false, // don't refetch on tab switch
    revalidateIfStale: true,

    // 🔄 BACKGROUND UPDATE (DB sync)
    refreshInterval: 30_000, // every 30s (adjustable)
  });

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: `${MAP_STYLE}?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`,
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

  const hasFittedBounds = useRef(false);

  useEffect(() => {
    if (!mapRef.current || issues.length === 0 || hasFittedBounds.current)
      return;

    const bounds = new maplibregl.LngLatBounds();
    issues.forEach((is) => bounds.extend([is.lng, is.lat]));
    mapRef.current.fitBounds(bounds, { padding: 80, maxZoom: 10 });

    hasFittedBounds.current = true;
  }, [issues]);

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
    <div
      className={`relative h-screen w-full font-sans overflow-hidden transition-colors duration-500 ${
        resolvedTheme === "dark"
          ? "bg-slate-950 text-white"
          : "bg-slate-50 text-slate-900"
      }`}
    >
      <AnimatePresence>
        {isLoading && issues.length === 0 && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-white dark:bg-slate-950"
          >
            <div className="flex flex-col items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-emerald-500/20 border-t-emerald-600 rounded-full animate-spin" />
                <Activity
                  className="absolute inset-0 m-auto text-emerald-600 animate-pulse"
                  size={32}
                />
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-black tracking-tighter mb-1">
                  Civic<span className="text-emerald-600">Pulse</span>
                </h2>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 animate-pulse">
                  Syncing City Data...
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="absolute inset-0 z-0">
        <div ref={mapContainer} className="h-full w-full" />
        {mapInstance &&
          filteredIssues.map((issue) => (
            <MarkerOverlay
              key={issue.id}
              map={mapInstance}
              issue={issue}
              isSelected={selectedIssue?.id === issue.id}
              onClick={() => handlePinSelection(issue)}
            />
          ))}
      </main>

      {/* FLOATING MENU BUTTON - Visible on ALL screens when menu is closed */}
      <AnimatePresence>
        {isSidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="absolute top-4 left-4 md:top-6 md:left-6 z-[60]"
          >
            <button
              onClick={() => setIsSidebarCollapsed(false)}
              className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl text-emerald-600 hover:scale-105 transition-transform"
            >
              <Menu size={24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* THEME TOGGLE */}
      <div className="absolute top-4 right-4 md:top-6 md:right-6 z-50">
        <button
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className="p-3 md:p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl"
        >
          {resolvedTheme === "dark" ? (
            <Sun size={18} className="text-emerald-400" />
          ) : (
            <Moon size={18} className="text-emerald-600" />
          )}
        </button>
      </div>

      {/* SIDEBAR */}
      <motion.div
        initial={false}
        animate={{
          x: isSidebarCollapsed ? -500 : 0,
          // Sidebar takes full width on mobile, 384px on desktop
          width:
            typeof window !== "undefined" && window.innerWidth < 768
              ? "calc(100% - 32px)"
              : "384px",
        }}
        transition={{ type: "spring", damping: 25, stiffness: 150 }}
        className="absolute top-4 left-4 bottom-4 md:top-6 md:left-6 md:bottom-6 z-50"
      >
        <aside className="h-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200 dark:border-slate-800 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-600 p-2 rounded-xl">
                <Activity className="text-white" size={18} />
              </div>
              <h1 className="text-xl font-black tracking-tighter">
                Civic<span className="text-emerald-600">Pulse</span>
              </h1>
            </div>

            {/* CLOSE BUTTON INSIDE MENU (Active for both mobile and desktop) */}
            <button
              onClick={() => setIsSidebarCollapsed(true)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors group"
            >
              <div className="md:hidden">
                <X size={24} className="text-rose-500" />
              </div>
              <div className="hidden md:block">
                <ChevronLeft
                  size={24}
                  className="text-slate-400 group-hover:text-rose-500 transition-colors"
                />
              </div>
            </button>
          </div>

          <div className="flex-1 flex flex-col min-h-0">
            <div className="p-5 pb-2">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search reports..."
                  className="w-full pl-10 pr-4 py-3 bg-slate-100/50 dark:bg-slate-800/50 rounded-2xl outline-none text-sm"
                  value={searchQuery || ""}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filteredIssues.map((issue) => (
                <div
                  key={issue.id}
                  onClick={() => {
                    handlePinSelection(issue);
                    if (window.innerWidth < 768) setIsSidebarCollapsed(true);
                  }}
                  className={`group relative p-3 rounded-[1.5rem] cursor-pointer transition-all flex gap-4 items-center ${
                    selectedIssue?.id === issue.id
                      ? "bg-emerald-50 dark:bg-slate-800 ring-1 ring-emerald-500/20 scale-[1.02]"
                      : "bg-slate-50/20 dark:bg-slate-900/20 hover:bg-slate-100/40 dark:hover:bg-slate-800/20"
                  }`}
                >
                  <div className="relative w-14 h-14 flex-shrink-0 rounded-2xl overflow-hidden bg-slate-300">
                    <Image
                      src={
                        issue.images?.[0] ||
                        "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=200"
                      }
                      alt="issue"
                      fill
                      className="object-cover group-hover:scale-125 transition-transform duration-700"
                      sizes="56px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[7px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 mb-1 inline-block">
                      ● {issue.status}
                    </span>
                    <h3 className="font-bold text-sm truncate">
                      {issue.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 space-y-3 bg-slate-50/30 dark:bg-slate-800/20 border-t border-slate-200 dark:border-slate-800">
              <Link href="/issues/report">
                <button className="w-full mb-3 p-4 rounded-2xl border-2 border-dashed border-emerald-500/30 hover:border-emerald-500/60 transition-all text-emerald-600 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                  <PlusCircle size={16} /> Report New Issue
                </button>
              </Link>
              <Link href="/dashboard" className="w-full">
                <button className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-sm text-emerald-600 border border-slate-200 dark:border-slate-700 font-black uppercase text-[10px]">
                  Dashboard
                </button>
              </Link>
            </div>
          </div>
        </aside>
      </motion.div>

      {/* DETAIL CARD */}
      <AnimatePresence mode="wait">
        {selectedIssue && (
          <motion.div
            key={selectedIssue.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`absolute bottom-6 left-4 right-4 md:bottom-8 md:right-6 z-40 transition-all ${
              isSidebarCollapsed ? "md:left-28" : "md:left-[26.5rem]"
            }`}
          >
            <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col md:flex-row max-w-3xl">
              <div className="relative w-full md:w-64 h-32 md:h-auto overflow-hidden">
                <Image
                  src={
                    selectedIssue.images?.[0] ||
                    "https://images.unsplash.com/photo-1584467735815-f778f274e296?w=800"
                  }
                  alt="issue"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 400px"
                  priority
                />
              </div>
              <div className="flex-1 p-6 md:p-8 relative">
                <button
                  onClick={handleCloseDetails}
                  className="absolute top-5 right-5 p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-rose-500 hover:text-white transition-all"
                >
                  <X size={18} />
                </button>
                <h2 className="text-2xl md:text-3xl font-black mb-2 tracking-tight">
                  {selectedIssue.title}
                </h2>
                <div className="flex items-center gap-1.5 mb-4 text-slate-500 text-sm font-medium">
                  <MapPin size={16} className="text-rose-500" />{" "}
                  {selectedIssue.address}
                </div>
                <Link href={`/issues/${selectedIssue.id}`}>
                  <button className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em]">
                    View Details
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
