import React, { forwardRef } from "react"; // 1. Capitalized React and imported forwardRef
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, MapPin, Trash2, User } from "lucide-react";
import { Badge } from "../ui/Issue-badge";
import Image from "next/image";

export const IncidentCard = forwardRef(
  ({ issue, idx, onDelete, ...props }, ref) => {
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
          <div className="relative w-full h-full overflow-hidden">
            <Image
              src={issue.images[0]}
              alt={issue.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          </div>

          <div className="absolute inset-0 bg-linear-to-t from-white dark:from-slate-900 via-transparent to-black/20" />
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <span className="font-mono text-[10px] font-black text-white bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
              {issue.id || issue._id}
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
                  <span className="truncate">{issue.location.address}</span>
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-tighter">
                  Reporter
                </span>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <User size={12} className="text-slate-400 shrink-0" />
                  <span className="truncate">
                    {issue.reportedBy?.name || "Unknown"}
                  </span>
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

              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete();
                }}
                className="p-2.5 hover:bg-rose-500/10 hover:text-rose-500 rounded-2xl text-slate-400 transition-all"
              >
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
  }
);

IncidentCard.displayName = "IncidentCard";
