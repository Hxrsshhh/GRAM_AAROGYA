"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  MapPin,
  Navigation,
  Phone,
  Info,
  Loader2,
  CheckCircle2,
  RefreshCcw,
  ExternalLink,
  Compass,
} from "lucide-react";

export default function FindDoctorsPage() {
  const [location, setLocation] = useState(null);
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const mapRef = useRef(null);

  useEffect(() => {
    initLocation();
  }, []);

  const initLocation = () => {
    setLoading(true);
    if (!navigator.geolocation) {
      handleFallback("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setLocation(coords);
        await fetchPlaces(coords.lat, coords.lng);
        setLoading(false);
      },
      async () => {
        handleFallback("Using default location (enable GPS for accuracy)");
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const handleFallback = async (msg) => {
    const fallback = { lat: 26.7271, lng: 88.3953 };
    setLocation(fallback);
    setError(msg);
    await fetchPlaces(fallback.lat, fallback.lng);
    setLoading(false);
  };

  const fetchPlaces = async (lat, lng) => {
    try {
      const res = await fetch("/api/health-centers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latitude: lat, longitude: lng }),
      });

      const data = await res.json();

      if (!data?.nearest_health_centers?.length) {
        setError("No healthcare centers found in your area.");
        return;
      }

      const formatted = data.nearest_health_centers.map((p) => ({
        ...p,
        distance: getDistance(lat, lng, p.latitude, p.longitude),
        mapsLink: `https://www.google.com/maps/search/?api=1&query=${p.latitude},${p.longitude}`,
      }));

      setPlaces(
        formatted.sort(
          (a, b) => parseFloat(a.distance) - parseFloat(b.distance),
        ),
      );
    } catch {
      setError("Unable to connect to the healthcare database.");
    }
  };

  const getDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2;
    return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1);
  };

  const handleSelectPlace = (place) => {
    setSelectedPlace(place);
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-[#0a0a0a]">
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-[70%] h-[70%] bg-blue-600/10 dark:bg-blue-600/15 blur-[140px] rounded-full" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 dark:bg-indigo-600/15 blur-[140px] rounded-full" />
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-blue-500/20 blur-3xl animate-pulse rounded-full"></div>
          <Loader2 className="animate-spin w-12 h-12 text-blue-600 dark:text-blue-400 relative z-10" />
        </div>
        <p className="mt-6 text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent animate-pulse">
          Syncing Satellite Data...
        </p>
      </div>
    );
  }

  const mapCenterLat = selectedPlace?.latitude || location?.lat;
  const mapCenterLng = selectedPlace?.longitude || location?.lng;
  const offset = selectedPlace ? 0.005 : 0.03;

  return (
    <div className="h-screen w-full bg-slate-50 dark:bg-[#0a0a0a] text-slate-900 dark:text-gray-100 flex flex-col overflow-hidden transition-colors duration-500">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[70%] h-[70%] bg-blue-600/10 dark:bg-blue-600/15 blur-[140px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 dark:bg-indigo-600/15 blur-[140px] rounded-full" />
      </div>

      {/* 1. Fixed Header Area (No Scroll) */}
      <header className="flex-none pt-24 pb-6 px-6 md:px-12 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest border border-blue-500/20">
              <Compass className="w-3 h-3" /> Real-time Radar
            </div>
            <h1 className="text-4xl font-black tracking-tight">
              Medical{" "}
              <span className="text-blue-600 dark:text-blue-500">Locator</span>
            </h1>
          </div>

          <button
            onClick={initLocation}
            className="group flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/10 transition-all font-bold text-xs"
          >
            <RefreshCcw className="w-4 h-4 group-active:rotate-180 transition-transform duration-500" />
            Recalibrate
          </button>
        </div>
      </header>

      {/* 2. Main Content Area (Flexible & Non-Scrolling) */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 pt-0 grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-0">
        {/* Left Column: Map (Takes full height of flex container) */}
        <div className="lg:col-span-7 flex flex-col min-h-0 space-y-4">
          <div className="relative flex-1 group">
            <div className="absolute -inset-1 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-[2.5rem] blur opacity-20 transition duration-1000"></div>
            <div className="relative h-full w-full rounded-[2rem] overflow-hidden border border-white/20 shadow-2xl bg-white dark:bg-slate-900">
              <iframe
                title="Map View"
                width="100%"
                height="100%"
                className="grayscale-[20%] contrast-[1.1] dark:invert-[90%] dark:hue-rotate-180"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${(mapCenterLng || 0) - offset}%2C${(mapCenterLat || 0) - offset}%2C${(mapCenterLng || 0) + offset}%2C${(mapCenterLat || 0) + offset}&layer=mapnik&marker=${mapCenterLat}%2C${mapCenterLng}`}
              />
            </div>
          </div>

          <div className="flex-none bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-600 rounded-xl shadow-lg">
              <Navigation className="w-5 h-5 text-white" />
            </div>
            <p className="text-xs text-slate-500 dark:text-gray-400 leading-tight">
              <strong>Pro Tip:</strong> Select a facility from the list to
              update the satellite view instantly.
            </p>
          </div>
        </div>

        {/* Right Column: List (Internal Scroll only) */}
        <div className="lg:col-span-5 flex flex-col min-h-0">
          <div className="flex-none flex items-center justify-between mb-4 px-2">
            <h2 className="text-lg font-bold flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <MapPin className="w-5 h-5" />
              Available Centers
            </h2>
            <span className="text-[10px] font-black bg-slate-900 dark:bg-blue-600 text-white px-3 py-1 rounded-full uppercase">
              {places.length} Total
            </span>
          </div>

          {/* This is the only scrollable area */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-3 custom-scrollbar pb-8">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-xs font-bold uppercase tracking-wider">
                {error}
              </div>
            )}

            {places.map((p, i) => {
              const isSelected = selectedPlace?.name === p.name;
              return (
                <div
                  key={i}
                  onClick={() => handleSelectPlace(p)}
                  className={`group cursor-pointer transition-all duration-300 p-5 rounded-[1.8rem] border-2 relative 
                    ${
                      isSelected
                        ? "border-blue-500 bg-white dark:bg-[#151515] shadow-xl scale-[0.98]"
                        : "border-slate-200 dark:border-white/5 bg-white/40 dark:bg-white/5 hover:border-blue-400/30"
                    }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="space-y-0.5">
                      <h3
                        className={`font-black text-base leading-tight ${isSelected ? "text-blue-600 dark:text-blue-400" : ""}`}
                      >
                        {p.name}
                      </h3>
                      <div className="flex items-center gap-1 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                        <Navigation className="w-3 h-3" />
                        {p.distance} km
                      </div>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-blue-500" />
                    )}
                  </div>

                  <p className="text-xs text-slate-500 dark:text-gray-400 mb-4 line-clamp-1 italic">
                    {p.address}
                  </p>

                  <div className="flex gap-2">
                    <a
                      href={p.mapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black uppercase py-2.5 rounded-xl transition-all shadow-md active:scale-95"
                    >
                      Nav <ExternalLink className="w-3 h-3" />
                    </a>
                    {p.phone && (
                      <a
                        href={`tel:${p.phone}`}
                        className="flex items-center justify-center px-4 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 rounded-xl transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-slate-600 dark:text-white" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <style jsx global>{`
        /* Prevent body scroll */
        body {
          overflow: hidden;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #3b82f644;
          border-radius: 20px;
        }
      `}</style>
    </div>
  );
}
