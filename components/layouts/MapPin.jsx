"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin } from "lucide-react";

/**
 * Enhanced Category Theme Mapping with deeper colors for 3D effect
 */
const getCategoryStyles = (category, isSelected) => {
  const cat = category?.toLowerCase();
  
  const themes = {
    infrastructure: { color: "#3b82f6", shadow: "rgba(59, 130, 246, 0.5)" },
    utilities: { color: "#f59e0b", shadow: "rgba(245, 158, 11, 0.5)" },
    sanitation: { color: "#10b981", shadow: "rgba(16, 185, 129, 0.5)" },
    safety: { color: "#f43f5e", shadow: "rgba(244, 63, 94, 0.5)" },
    environment: { color: "#14b8a6", shadow: "rgba(20, 184, 166, 0.5)" },
    traffic: { color: "#6366f1", shadow: "rgba(99, 102, 241, 0.5)" },
    other: { color: "#64748b", shadow: "rgba(100, 116, 139, 0.5)" }
  };

  return themes[cat] || themes.other;
};

const MarkerOverlay = ({ map, issue, isSelected, onClick }) => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const theme = getCategoryStyles(issue.category, isSelected);

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
      className="absolute top-0 left-0 cursor-pointer z-10"
      style={{
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        perspective: "1000px"
      }}
    >
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
            scale: isSelected ? 1.2 : 1, 
            opacity: 1,
            y: isSelected ? -12 : 0 
        }}
        whileHover={{ y: -5 }}
        className="relative flex flex-col items-center"
        style={{ transformOrigin: "bottom center" }}
      >
        {/* Floating Tooltip */}
        <AnimatePresence>
          {isSelected && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: -15 }}
              exit={{ opacity: 0, y: 5 }}
              className="absolute -top-14 whitespace-nowrap px-3 py-1 bg-slate-900 text-white rounded-lg text-xs font-bold shadow-xl border border-white/10"
            >
              {issue.title}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Real 3D Pin Head */}
        <div className="relative group">
          {/* The Teardrop Shape */}
          <div 
            className="relative w-10 h-10 rounded-full rounded-bl-none rotate-[-45deg] flex items-center justify-center shadow-lg transition-colors duration-300"
            style={{ 
                backgroundColor: theme.color,
                boxShadow: `inset -4px -4px 8px rgba(0,0,0,0.2), inset 4px 4px 8px rgba(255,255,255,0.3)`
            }}
          >
            {/* Inner "Lens" or White Circle */}
            <div 
                className="w-7 h-7 bg-white rounded-full rotate-[45deg] flex items-center justify-center shadow-inner overflow-hidden"
            >
                {/* Glossy Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/60 pointer-events-none" />
                
                <MapPin 
                    size={16} 
                    style={{ color: theme.color }} 
                    fill={theme.color} 
                    fillOpacity={0.1}
                    strokeWidth={2.5}
                />
            </div>
          </div>

          {/* Selection Pulse Ring */}
          {isSelected && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute inset-0 rounded-full border-2"
              style={{ borderColor: theme.color }}
            />
          )}
        </div>

        {/* Dynamic Shadow on Ground */}
        <motion.div 
          animate={{ 
            scale: isSelected ? 1.4 : 1,
            opacity: isSelected ? 0.3 : 0.5,
            y: isSelected ? 10 : 0
          }}
          className="w-5 h-1.5 bg-black rounded-[100%] blur-[3px] -mt-1"
        />

        {/* Extended Click Area */}
        <div className="absolute inset-[-10px] z-20" />
      </motion.div>
    </div>
  );
};

export default MarkerOverlay;