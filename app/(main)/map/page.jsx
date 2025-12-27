"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Search,
  Filter,
  Navigation,
  X,
  ArrowRight,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { generateMapIssueList, ISSUE_DETAILS as ISSUES } from "@/lib/mock-data";
import Link from "next/link";

const ISSUE_DETAILS = generateMapIssueList(ISSUES);

const COLORS = {
  infrastructure: "#2563eb",
  utilities: "#d97706",
  sanitation: "#059669",
};

const MapPage = () => {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false); // New state to track if map is ready

  const INDIA_CENTER = [22.9734, 78.6569];
  const INITIAL_ZOOM = 5;

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);

  const filteredIssues = useMemo(() => {
    return ISSUE_DETAILS.filter((issue) => {
      const matchesFilter = filter === "all" || issue.category === filter;
      const matchesSearch =
        issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.address.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [filter, searchQuery]);

  // 1. Initialize Map and Load Scripts
  useEffect(() => {
    const initMap = () => {
      if (typeof window === "undefined" || !window.L || mapInstanceRef.current)
        return;

      const map = window.L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView([22.9734, 78.6569], 5);

      window.L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        {
          maxZoom: 19,
        }
      ).addTo(map);

      mapInstanceRef.current = map;
      markersLayerRef.current = window.L.layerGroup().addTo(map);
      setMapLoaded(true); // Signal that map is ready for markers
    };

    // Load CSS
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    // Load JS
    if (!document.getElementById("leaflet-js")) {
      const script = document.createElement("script");
      script.id = "leaflet-js";
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.async = true;
      script.onload = initMap;
      document.head.appendChild(script);
    } else if (window.L) {
      initMap();
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 2. Sync Markers whenever filters OR the map readiness changes
  useEffect(() => {
    if (!mapLoaded || !markersLayerRef.current || !window.L) return;

    // Clear old markers to prevent memory leaks and duplication
    markersLayerRef.current.clearLayers();

    filteredIssues.forEach((issue) => {
      const isSelected = selectedIssue?._id === issue._id;

      // Ensure Lat/Lng exist before trying to plot
      if (issue.lat && issue.lng) {
        const marker = window.L.circleMarker([issue.lat, issue.lng], {
          radius: isSelected ? 14 : 10,
          fillColor: COLORS[issue.category] || "#666",
          fillOpacity: 0.9,
          color: "#ffffff",
          weight: 2,
        });

        marker.on("click", () => setSelectedIssue(issue));
        marker.addTo(markersLayerRef.current);
      }
    });
  }, [filteredIssues, selectedIssue, mapLoaded]); // Added mapLoaded as dependency

  // 3. Pan to selected
  useEffect(() => {
    if (selectedIssue && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([selectedIssue.lat, selectedIssue.lng], 16, {
        duration: 1.5,
      });
    }
  }, [selectedIssue]);

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans relative">
      {/* MAP ENGINE - Ensure it fills the screen and captures gestures */}
      <div
        ref={mapContainerRef}
        className="absolute inset-0 z-0 bg-slate-100 dark:bg-slate-900 cursor-grab active:cursor-grabbing"
      />

      {/* SEARCH INTERFACE - Integrated for fixed navbar projects */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 pointer-events-none z-[50]">
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="flex-1 relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Search local reports..."
              className="w-full pl-12 pr-12 py-3.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-2xl border border-slate-200 dark:border-slate-800 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all dark:text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all ${
                showFilters
                  ? "bg-emerald-600 text-white shadow-lg"
                  : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Filter size={18} />
            </button>

            {/* Filter Dropdown */}
            {showFilters && (
              <div className="absolute top-full mt-3 left-0 right-0 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 animate-in slide-in-from-top-2 duration-200">
                <p className="text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest px-1">
                  Categories
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {["all", "infrastructure", "utilities", "sanitation"].map(
                    (cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setFilter(cat);
                          setShowFilters(false);
                        }}
                        className={`px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all ${
                          filter === cat
                            ? "bg-blue-600 border-blue-600 text-white shadow-md"
                            : "bg-slate-50 dark:bg-slate-800 border-transparent text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                        }`}
                      >
                        {cat}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}
          </div>

          <button className="h-12 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-xl shadow-blue-500/20 transition-all flex items-center gap-2 shrink-0 active:scale-95">
            <Navigation size={18} />
            <span className="hidden sm:inline text-xs font-black uppercase tracking-wider">
              Report
            </span>
          </button>
        </div>

        {/* Dynamic Search Results Overlay */}
        {searchQuery && !selectedIssue && (
          <div className="mt-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[40vh] overflow-y-auto pointer-events-auto divide-y divide-slate-100 dark:divide-slate-800">
            {filteredIssues.length > 0 ? (
              filteredIssues.map((issue) => (
                <button
                  key={issue._id}
                  onClick={() => {
                    setSelectedIssue(issue);
                    setSearchQuery("");
                  }}
                  className="w-full text-left p-4 flex items-center gap-4 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-slate-200">
                    <img
                      src={issue.images[0]}
                      className="w-full h-full object-cover"
                      alt=""
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {issue.title}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {issue.address}
                    </p>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-8 text-center text-slate-400 text-sm">
                No reports found in this area
              </div>
            )}
          </div>
        )}
      </div>

      {/* DETAILED SELECTION CARD */}
      {selectedIssue && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[94%] max-w-xl z-[60] animate-in fade-in slide-in-from-bottom-8 duration-500">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col sm:flex-row">
            <div className="w-full sm:w-64 h-44 sm:h-auto shrink-0 relative">
              <img
                src={selectedIssue.images[0]}
                className="w-full h-full object-cover"
                alt=""
              />
              <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-widest text-blue-600 border border-blue-100 dark:border-blue-900/30">
                Verified Report
              </div>
            </div>
            <div className="p-6 sm:p-8 flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-2">
                    <span
                      className={`text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider ${
                        selectedIssue.priority === "Critical"
                          ? "bg-red-500 text-white"
                          : "bg-amber-500 text-white"
                      }`}
                    >
                      {selectedIssue.priority}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 ml-2">
                      <Calendar size={12} /> Today
                    </span>
                  </div>
                  {/* Inside the selection card component */}
                  <button
                    onClick={() => {
                      setSelectedIssue(null); // Clear the selection
                      if (mapInstanceRef.current) {
                        mapInstanceRef.current.flyTo(
                          INDIA_CENTER,
                          INITIAL_ZOOM,
                          {
                            duration: 2.5,
                            easeLinearity: 0.25,
                          }
                        );
                      }
                    }}
                    className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all"
                  >
                    <X size={16} />
                  </button>
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight mb-2 truncate">
                  {selectedIssue.title}
                </h3>
                <p className="text-sm text-slate-500 mb-6 truncate flex items-center gap-1.5">
                  <Navigation size={14} className="text-blue-500" />{" "}
                  {selectedIssue.address}
                </p>
              </div>
              <div className="flex gap-3">
               <Link href={`/issues/${selectedIssue._id}`}>
                <button className="w-[200px] flex-1 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-black uppercase tracking-widest rounded-2xl hover:opacity-90 transition-all flex items-center justify-center gap-2">
                  View Timeline <ArrowRight size={14} />
                </button>
               </Link>
                <button className="p-3.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-white rounded-2xl hover:bg-slate-200 transition-all">
                  <AlertCircle size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ZOOM CONTROLS */}
      <div className="absolute bottom-8 right-6 flex flex-col gap-2 z-[40]">
        <div className="flex flex-col bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <button
            onClick={() => mapInstanceRef.current?.zoomIn()}
            className="w-10 h-10 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border-b border-slate-100 dark:border-slate-800 transition-colors"
          >
            +
          </button>
          <button
            onClick={() => mapInstanceRef.current?.zoomOut()}
            className="w-10 h-10 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            -
          </button>
        </div>
      </div>

      {/* LEGEND / STATUS BAR */}
      <div className="absolute bottom-6 left-6 hidden lg:flex flex-col gap-2 z-[40]">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl">
          <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-3">
            Live Map Legend
          </p>
          <div className="space-y-3">
            {Object.entries(COLORS).map(([key, color]) => (
              <div key={key} className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-tighter">
                  {key}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
