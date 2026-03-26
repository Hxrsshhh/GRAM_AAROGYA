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
  ExternalLink 
} from "lucide-react";
import Navbar from "@/components/navbar";


export default function FindDoctorsPage() {
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState<HealthCenter | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  const mapRef = useRef<HTMLDivElement>(null);

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
        handleFallback("Using default location (enable GPS for better results)");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleFallback = async (msg) => {
    const fallback = { lat: 26.7271, lng: 88.3953 }; // Siliguri Default
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
        mapsLink: `https://www.google.com/maps/dir/?api=1&destination=${p.latitude},${p.longitude}`,
      }));

      setPlaces(formatted.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance)));
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
    if (window.innerWidth < 1024) {
      mapRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

 if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white">
        <div className="relative flex items-center justify-center">
          {/* Animated rings for that high-end feel */}
          <div className="absolute w-20 h-20 border-2 border-blue-500/10 rounded-full animate-[ping_2s_linear_infinite]"></div>
          <div className="absolute w-16 h-16 border-4 border-blue-500/20 rounded-full animate-pulse"></div>
          <Loader2 className="animate-spin w-10 h-10 text-blue-500 relative z-10" />
        </div>
        <div className="mt-6 text-center">
          <p className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Scanning for Facilities
          </p>
          <p className="text-gray-500 text-sm mt-1 animate-pulse tracking-wide uppercase font-bold">
            Locating Nearby Medical Help...
          </p>
        </div>
      </div>
    );
  }

  const mapCenterLat = selectedPlace?.latitude || location?.lat;
  const mapCenterLng = selectedPlace?.longitude || location?.lng;
  const offset = selectedPlace ? 0.005 : 0.03; 

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 font-sans selection:bg-blue-500/30">
      <Navbar />

      <main className="max-w-7xl mx-auto p-6 lg:pt-10">
        {/* Header section with refresh */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Nearby <span className="text-blue-500">Medical Centers</span>
            </h1>
            <p className="text-gray-400 text-sm mt-1">Based on your current location in Siliguri</p>
          </div>
          <button 
            onClick={initLocation}
            className="w-fit flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-sm font-medium"
          >
            <RefreshCcw className="w-4 h-4" />
            Refresh List
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Map View */}
          <div className="lg:col-span-7 space-y-6" ref={mapRef}>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative h-[500px] w-full rounded-2xl overflow-hidden border border-white/10 bg-[#111]">
                {location && (
                  <iframe
                    key={selectedPlace?.name || 'default'}
                    title="Location Map"
                    width="100%"
                    height="100%"
                    className=" opacity-100"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                      (mapCenterLng || 0) - offset
                    }%2C${(mapCenterLat || 0) - offset}%2C${
                      (mapCenterLng || 0) + offset
                    }%2C${(mapCenterLat || 0) + offset}&layer=mapnik&marker=${
                      mapCenterLat
                    }%2C${mapCenterLng}`}
                  />
                )}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-start gap-4">
              <div className="p-3 bg-blue-500/10 rounded-xl shrink-0">
                <Info className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-400 mb-1">Interactive Guidance</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Select a facility from the list to update the map view. Use the Directions button to open Google Maps for real-time navigation.
                </p>
                {selectedPlace && (
                  <button onClick={() => setSelectedPlace(null)} className="mt-2 text-sm text-blue-500 hover:underline flex items-center gap-1">
                    <RefreshCcw className="w-3 h-3" /> Reset to my location
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: List View */}
          <div className="lg:col-span-5 flex flex-col space-y-4 h-[700px]">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-500" />
                Available Facilities
              </h2>
              <span className="text-xs text-blue-400 bg-blue-500/10 px-2 py-1 rounded-lg border border-blue-500/20 font-mono">
                {places.length} FOUND
              </span>
            </div>

            {error && (
              <div className="bg-blue-500/5 border border-blue-500/20 text-blue-400 p-4 rounded-xl text-sm flex items-center gap-3">
                <Info className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              {places.map((p, i) => {
                const isSelected = selectedPlace?.name === p.name;
                return (
                  <div 
                    key={i} 
                    onClick={() => handleSelectPlace(p)}
                    className={`group cursor-pointer bg-[#161616] transition-all duration-300 p-5 rounded-2xl relative overflow-hidden border-2 
                      ${isSelected ? 'border-blue-500 bg-[#1c1c1c] translate-x-1' : 'border-transparent hover:border-white/10'}`}
                  >
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <h3 className={`font-bold text-lg transition-colors ${isSelected ? 'text-blue-400' : 'group-hover:text-blue-400'}`}>
                            {p.name}
                          </h3>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-500" />}
                        </div>
                        <span className="text-xs font-mono bg-white/5 px-2 py-1 rounded text-gray-400">
                          {p.distance} km
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-400 flex items-start gap-2 mb-5 line-clamp-2">
                        <MapPin className="w-4 h-4 mt-0.5 text-gray-600 shrink-0" />
                        {p.address}
                      </p>

                      <div className="flex gap-3">
                        <a
                          href={p.mapsLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold py-2.5 rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-600/20"
                        >
                          <Navigation className="w-4 h-4" />
                          Directions
                        </a>
                        {p.phone && (
                          <a 
                            href={`tel:${p.phone}`} 
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center justify-center px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all group"
                          >
                            <Phone className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                          </a>
                        )}
                      </div>
                    </div>
                    {isSelected && (
                      <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-blue-600/10 blur-3xl rounded-full" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}