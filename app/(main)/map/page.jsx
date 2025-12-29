"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Search,
  ChevronLeft,
  X,
  Menu,
} from "lucide-react";

// Configuration for the default view
const INITIAL_VIEW = {
  center: [-73.9857, 40.7484],
  zoom: 12,
};

const MOCK_ISSUES = [
  {
    id: 1,
    title: "Water Main Leak",
    category: "Utility",
    status: "Urgent",
    description:
      "Major water leak reported near the intersection. Significant flooding on the sidewalk.",
    lat: 40.7128,
    lng: -74.006,
    address: "Broadway & Wall St, NY",
    reportedAt: "2 hours ago",
  },
  {
    id: 2,
    title: "Pothole Damage",
    category: "Roads",
    status: "Pending",
    description: "Deep pothole causing tire damage to multiple vehicles.",
    lat: 40.725,
    lng: -73.995,
    address: "Queens Blvd, NY",
    reportedAt: "5 hours ago",
  },
  {
    id: 3,
    title: "Street Light Out",
    category: "Lighting",
    status: "In Progress",
    description: "Dark stretch of road due to non-functioning lamps.",
    lat: 40.715,
    lng: -73.96,
    address: "Bedford Ave, Brooklyn",
    reportedAt: "1 day ago",
  },
];

const App = () => {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);

  const [mapInstance, setMapInstance] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Initialize Map
  useEffect(() => {
    if (mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`,
      center: INITIAL_VIEW.center,
      zoom: INITIAL_VIEW.zoom,
    });

    map.addControl(new maplibregl.NavigationControl(), "bottom-right");

    map.on("load", () => {
      mapRef.current = map;
      setMapInstance(map);
    });

    return () => map.remove();
  }, []);

  // Handle zooming into a specific issue
  const handlePinSelection = (issue) => {
    setSelectedIssue(issue);
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [issue.lng, issue.lat],
        zoom: 15,
        essential: true,
        duration: 2000,
        curve: 1.5,
      });
    }
  };

  // Handle zooming out to original position
  const handleCloseDetails = () => {
    setSelectedIssue(null);
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: INITIAL_VIEW.center,
        zoom: INITIAL_VIEW.zoom,
        essential: true,
        duration: 1800, // Smooth transition back
        curve: 1.2,
        speed: 0.8,
      });
    }
  };

  const filteredIssues = useMemo(() => {
    return MOCK_ISSUES.filter((issue) =>
      issue.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Urgent":
        return "bg-rose-500";
      case "In Progress":
        return "bg-blue-500";
      case "Pending":
        return "bg-amber-500";
      default:
        return "bg-slate-500";
    }
  };

  return (
    <div className="relative h-screen w-full bg-slate-900 font-sans overflow-hidden text-slate-900">
      {/* MAP VIEWPORT */}
      <main className="absolute inset-0 z-0 bg-slate-800">
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

      {/* Floating Sidebar */}
      <div
        className={`absolute top-6 left-6 bottom-6 z-50 transition-all duration-500 ${
          isSidebarCollapsed ? "w-20" : "w-96"
        }`}
      >
        <aside className="h-full bg-white/90 backdrop-blur-xl border border-white/40 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden">
          <div
            className={`p-6 border-b flex items-center ${
              isSidebarCollapsed ? "justify-center" : "justify-between"
            }`}
          >
            {!isSidebarCollapsed && (
              <h1 className="text-xl font-black text-slate-800 flex items-center gap-2">
                <div className="bg-indigo-600 p-1.5 rounded-lg shadow-lg">
                  <AlertTriangle className="text-white" size={16} />
                </div>
                CityPulse
              </h1>
            )}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-2 hover:bg-slate-200 rounded-xl transition-colors"
            >
              {isSidebarCollapsed ? <Menu /> : <ChevronLeft />}
            </button>
          </div>

          {!isSidebarCollapsed && (
            <div className="flex-1 flex flex-col min-h-0">
              <div className="p-5">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Search reports..."
                    className="w-full pl-10 pr-4 py-3 bg-slate-100/50 rounded-2xl outline-none focus:ring-2 ring-indigo-500/20"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {filteredIssues.map((issue) => (
                  <div
                    key={issue.id}
                    onClick={() => handlePinSelection(issue)}
                    className={`p-4 rounded-3xl cursor-pointer transition-all border-2 ${
                      selectedIssue?.id === issue.id
                        ? "border-indigo-500 bg-white shadow-lg translate-x-1"
                        : "border-transparent bg-slate-50/50 hover:bg-white"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span
                        className={`px-2 py-0.5 rounded-lg text-[9px] font-bold text-white ${getStatusColor(
                          issue.status
                        )}`}
                      >
                        {issue.status}
                      </span>
                      <span className="text-[9px] text-slate-400 flex items-center gap-1">
                        <Clock size={10} />
                        {issue.reportedAt}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-800 text-sm leading-tight">
                      {issue.title}
                    </h3>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* Details Overlay */}
      {selectedIssue && (
        <div
          className={`absolute bottom-10 right-6 z-40 transition-all duration-500 animate-in slide-in-from-bottom-5 ${
            isSidebarCollapsed ? "left-28" : "left-[26rem]"
          }`}
        >
          <div className="bg-slate-900/95 backdrop-blur-2xl rounded-[3rem] p-8 border border-white/10 text-white shadow-2xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-black mb-1">
                  {selectedIssue.title}
                </h2>
                <p className="text-slate-400 text-sm flex items-center gap-1">
                  <MapPin size={14} className="text-indigo-400" />{" "}
                  {selectedIssue.address}
                </p>
              </div>
              {/* Updated Close Button */}
              <button
                onClick={handleCloseDetails}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-slate-300 text-sm max-w-xl opacity-90">
              {selectedIssue.description}
            </p>
            <div className="mt-6 flex gap-4">
              <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20 active:scale-95">
                <CheckCircle2 size={18} /> Deploy Team
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Sub-component to sync Pins with Map coordinates
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
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="absolute top-0 left-0 transition-transform duration-75 cursor-pointer z-10"
      style={{
        transform: `translate(${pos.x}px, ${pos.y}px) translate(-50%, -100%)`,
      }}
    >
      <div
        className={`relative flex items-center justify-center w-10 h-10 rounded-full border-4 shadow-xl transition-all duration-300 ${
          isSelected
            ? "bg-indigo-600 border-white scale-125 ring-8 ring-indigo-500/20"
            : "bg-white border-transparent hover:scale-110"
        }`}
      >
        <MapPin
          size={18}
          className={isSelected ? "text-white" : "text-indigo-600"}
        />
      </div>
    </div>
  );
};

export default App;
