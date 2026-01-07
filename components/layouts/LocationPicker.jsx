import React, { useState, useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Loader2, Layers } from "lucide-react";
import { AnimatePresence } from "framer-motion";

export default function LocationPicker({ lat, lng, address, onLocationChange }) {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);
  const [isResolving, setIsResolving] = useState(false);
  const [viewMode, setViewMode] = useState("streets-v2");
  const isDragging = useRef(false);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapInstance.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/${viewMode}/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`,
      center: [lng || 78.9629, lat || 20.5937],
      zoom: 16,
      pitch: 45,
    });

    markerRef.current = new maplibregl.Marker({
      draggable: true,
      color: "#ea4335",
    })
      .setLngLat([lng || 78.9629, lat || 20.5937])
      .addTo(mapInstance.current);

    markerRef.current.on("dragstart", () => { isDragging.current = true; });
    markerRef.current.on("dragend", async () => {
      const { lat: newLat, lng: newLng } = markerRef.current.getLngLat();
      await fetchNewAddress(newLat, newLng);
      setTimeout(() => { isDragging.current = false; }, 500);
    });

    return () => mapInstance.current?.remove();
  }, []);

  useEffect(() => {
    if (mapInstance.current && markerRef.current && lat && lng && !isDragging.current) {
      markerRef.current.setLngLat([lng, lat]);
      mapInstance.current.flyTo({ center: [lng, lat], zoom: 17, essential: true });
    }
  }, [lat, lng]);

  useEffect(() => {
    if (mapInstance.current) {
      mapInstance.current.setStyle(`https://api.maptiler.com/maps/${viewMode}/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`);
    }
  }, [viewMode]);

  const fetchNewAddress = async (lt, lg) => {
    setIsResolving(true);
    try {
      const res = await fetch(`https://api.maptiler.com/geocoding/${lg},${lt}.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`);
      const data = await res.json();
      onLocationChange(lt, lg, data.features?.[0]?.place_name || "Custom Point", true);
    } finally { setIsResolving(false); }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Geospatial Target</span>
      </div>

      <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl h-64 group">
        <div ref={mapContainer} className="h-full w-full" />
        
        {/* COMPACT COORDINATE PILL (Top Left) */}
        <div className="absolute top-3 left-3 z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm border border-slate-200/50 dark:border-slate-700/50 pointer-events-none">
          <p className="text-[9px] font-bold text-slate-700 dark:text-slate-200 tabular-nums">
            {lat?.toFixed(5)}°, {lng?.toFixed(5)}°
          </p>
        </div>

        {/* MINIMIZED STYLE TOGGLE (Bottom Left) */}
        <button 
          onClick={() => setViewMode(viewMode === "streets-v2" ? "hybrid" : "streets-v2")}
          className="absolute bottom-3 left-3 z-10 w-10 h-10 rounded-xl border-2 border-white dark:border-slate-800 shadow-lg overflow-hidden transition-transform active:scale-95"
        >
          <div className="relative w-full h-full">
             <img 
              src={viewMode === "streets-v2" ? "https://api.maptiler.com/maps/hybrid/static/0,0,1/80x80.png" : "https://api.maptiler.com/maps/streets-v2/static/0,0,1/80x80.png"}
              className="w-full h-full object-cover"
              alt="style"
             />
             <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                <Layers size={12} className="text-white drop-shadow-md" />
             </div>
          </div>
        </button>

        {/* COMPACT ZOOM CONTROLS (Bottom Right) */}
        <div className="absolute bottom-3 right-3 z-10 flex flex-col bg-white dark:bg-slate-900 rounded-lg shadow-md border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
           <button onClick={() => mapInstance.current.zoomIn()} className="w-7 h-7 flex items-center justify-center text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">+</button>
           <button onClick={() => mapInstance.current.zoomOut()} className="w-7 h-7 flex items-center justify-center text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">-</button>
        </div>

        <AnimatePresence>
          {isResolving && (
            <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px] z-20 flex items-center justify-center">
              <Loader2 size={16} className="animate-spin text-emerald-500" />
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}