"use client";
import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css'; // Don't forget the CSS!

export default function IssueMap({ lat = 22.5726, lng = 88.3639 }) {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    // Prevent re-initialization if the map already exists
    if (map.current) return; 

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`,
      center: [lng, lat], // Note: MapLibre uses [lng, lat] order!
      zoom: 14
    });

    // Add navigation controls (zoom in/out)
    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    // Add a marker for the issue location
    new maplibregl.Marker({ color: "#FF0000" })
      .setLngLat([lng, lat])
      .addTo(map.current);

    // Cleanup on unmount
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [lat, lng]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0 rounded-[2rem]" />
    </div>
  );
}