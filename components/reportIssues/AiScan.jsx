"use client";

import React, { useState } from "react";
import {
  MapPin,
  CheckCircle2,
  Camera,
  Edit3,
  Lock,
  Radar,
  ShieldCheck,
  Zap,
  X,
  Scan,
  Navigation,
  Loader2,
  RefreshCw,
  Plus,
  Layers,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";
import { uploadToCloudinary } from "@/lib/cloudinary/cloudinaryUpload";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { InputWrapper } from "@/components/ui/InputWrapper";
import { toast } from "sonner";

const AiScan = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isEditingAI, setIsEditingAI] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [error, setError] = useState(null);

  const { data: session } = useSession();
  const router = useRouter();
  const [logs, setLogs] = useState([
    "SYSTEM INITIALIZED",
    "EMERALD CORE ACTIVE",
    "MULTI-SOURCE UPLINK READY",
  ]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "Medium",
    confidence: null,
    location: {
      address: "",
      lat: null,
      lng: null,
      coordinates: "",
    },
  });

  const isFormComplete = Boolean(
    formData.title?.trim() &&
      formData.description?.trim() &&
      formData.category &&
      formData.priority &&
      formData.location?.address?.trim() &&
      formData.location?.lat &&
      formData.location?.lng &&
      imageFiles.length > 0
  );

  const categories = [
    "infrastructure",
    "utilities",
    "sanitation",
    "safety",
    "environment",
    "traffic",
    "other",
  ];
  const priorities = ["Low", "Medium", "High", "Critical"];

  const addLog = (msg) => {
    setLogs((prev) => [msg, ...prev].slice(0, 4));
  };

  /* ---------------- IMAGE HANDLING ---------------- */
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const currentCount = imageFiles.length;
    const limited = files.slice(0, 5 - currentCount);

    if (limited.length === 0) {
      addLog("MAX PAYLOAD REACHED");
      return;
    }

    limited.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });

    setImageFiles((prev) => [...prev, ...limited]);
    addLog(`LOADED ${limited.length} IMAGE SEGMENTS`);
  };

  const removeImage = (index) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : 0));
    addLog("PAYLOAD SEGMENT DELETED");
  };

  const handleGetLocation = async () => {
    if (!navigator.geolocation) {
      toast.info("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        try {
          const res = await fetch(`/api/geocoder?lat=${lat}&lon=${lng}`);
          const data = await res.json();

          if (data && data.display_name) {
            setFormData((prev) => ({
              ...prev,
              location: {
                address: data.display_name,
                lat: lat,
                lng: lng,
                coordinates: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
              },
            }));
          } else {
            setFormData((prev) => ({
              ...prev,
              location: {
                address: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`,
                lat: lat,
                lng: lng,
              },
            }));
          }
        } catch (error) {
          console.error("Geocoding failed:", error);
          setError("Address lookup failed, but coordinates were captured.");
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        setError("Error getting coordinates: " + error.message);
      },
      { enableHighAccuracy: true }
    );
  };

  // /* ---------------- AI ANALYSIS ---------------- */
  // const analyzeWithAI = async () => {
  //   if (loadingAI || imagePreviews.length === 0) return;

  //   setLoadingAI(true);
  //   addLog("AI ENGINE ENGAGED");

  //   try {
  //     const imagesPayload = imagePreviews.map((img) => ({
  //       data: img.split(",")[1],
  //       mimeType: img.substring(img.indexOf(":") + 1, img.indexOf(";")),
  //     }));

  //     const res = await fetch("/api/ai/analyze", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ images: imagesPayload }),
  //     });

  //     const data = await res.json();

  //     if (!data || typeof data.confidence !== "number") {
  //       throw new Error("Invalid AI response");
  //     }

  //     setFormData((prev) => ({ ...prev, ...data }));
  //     addLog("AI CLASSIFICATION SUCCESS");
  //   } catch (err) {
  //     console.error(err);
  //     addLog("AI FALLBACK MODE");
  //     setFormData((prev) => ({
  //       ...prev,
  //       confidence: 85,
  //       category: "infrastructure",
  //       title: "Manual Entry Required",
  //       priority: "Medium",
  //     }));
  //   } finally {
  //     setLoadingAI(false);
  //   }
  // };

 const analyzeWithAI = async () => {
  if (loadingAI || imagePreviews.length === 0) return;

  setLoadingAI(true);
  addLog("G3-FLASH NEURAL LINK ACTIVE");

  try {
    const imagesPayload = imagePreviews.map((img) => ({
      data: img.split(",")[1],
      mimeType: img.split(";")[0].split(":")[1],
    }));

    addLog("STREAMING MULTIMODAL TELEMETRY...");

    const res = await fetch("/api/ai/analyzeG", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ images: imagesPayload }),
    });

    const data = await res.json();

    if (data.error) throw new Error(data.error);

    // Populate your form state
    setFormData((prev) => ({
      ...prev,
      title: data.title,
      description: data.description,
      category: data.category,
      priority: data.priority,
      confidence: data.confidence,
    }));

    addLog(`SCAN SUCCESSFUL: ${data.confidence}% ACCURACY`);

  } catch (err) {
    addLog("CRITICAL: NEURAL SCAN INTERRUPTED");
    console.error(err);
  } finally {
    setLoadingAI(false);
  }
};

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      if (!session) {
        alert("Login required");
        setIsSubmitting(false);
        return;
      }

      const imageUrls = await Promise.all(
        imageFiles.map((file) => uploadToCloudinary(file, "image"))
      );

      let voiceNote = "";

      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: formData.priority,
        location: formData.location,
        images: imageUrls,
        voiceNote,
      };

      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Submit failed");
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setIsSubmitting(false);
      sessionStorage.setItem("IssueAdded", "true");
      router.push("/issues");
    }
  };

  return (

    <div className=" max-h-screen py-4 lg:py-0 max-w-screen bg-slate-50/10 dark:bg-transparent text-slate-900 dark:text-slate-200 font-['Plus_Jakarta_Sans'] flex flex-col overflow-y-auto lg:overflow-hidden transition-colors duration-300">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/5 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/5 blur-[120px]" />
      </div>

      <main className=" mt-0 relative z-10 flex-1 w-full max-w-7xl px-6 lg:py-12 mb-10 lg:mb-60 lg:overflow-hidden flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full lg:overflow-hidden">
          {/* Left Panel */}
          <div className="lg:col-span-5   flex flex-col gap-6 lg:overflow-hidden">
            <div className="flex-1 bg-white/50 md:max-h-[27vh]  dark:bg-slate-900/20 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-[2.5rem] overflow-hidden md:overflow-hidden relative group min-h-50 max-h-75 lg:max-h-[65vh] lg:min-h-30 ring-1 ring-black/5 dark:ring-white/5 shadow-xl dark:shadow-inner">
              {imagePreviews.length === 0 ? (
                <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer transition-all duration-500 hover:bg-emerald-500/[0.02]">
                  <input
                    type="file"
                    hidden
                    multiple
                    onChange={handleImageUpload}
                    accept="image/*"
                  />
                  <div className="relative w-24 h-24 flex items-center justify-center mb-6 group">
                    <div className="absolute inset-0 bg-emerald-500/20 rounded-[2rem] rotate-45 scale-0 group-hover:scale-100 group-hover:rotate-90 transition-all duration-700 opacity-0 group-hover:opacity-100" />
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-200 dark:border-slate-700 group-hover:border-emerald-500/50 group-hover:bg-white dark:group-hover:bg-slate-900 transition-all duration-300 z-10 shadow-lg">
                      <Camera
                        className="text-slate-500 dark:text-slate-400 group-hover:text-emerald-500 transition-colors"
                        size={28}
                      />
                    </div>
                  </div>
                  <div className="text-center space-y-1 z-10">
                    <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      Upload Evidence
                    </p>
                    <p className="text-[9px] text-slate-400 dark:text-slate-500 font-mono tracking-tighter opacity-0 group-hover:opacity-100 transition-all">
                      SUPPORTED: JPG, PNG, HEIC
                    </p>
                  </div>
                </label>
              ) : (
                <div className="relative h-full w-full">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={activeImageIndex}
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      src={imagePreviews[activeImageIndex]}
                      className="w-full h-full object-cover"
                      alt="Civic Report Source"
                    />
                  </AnimatePresence>
                  {loadingAI && (
                    <div className="absolute inset-0 z-20 pointer-events-none">
                      <motion.div
                        initial={{ top: "-10%" }}
                        animate={{ top: "110%" }}
                        transition={{
                          duration: 2.5,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="absolute left-0 right-0 h-[2px] bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.8)]"
                      />
                      <div className="absolute inset-0 bg-emerald-950/10 backdrop-contrast-125" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <label className="p-2 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl rounded-xl hover:bg-emerald-500 hover:text-white dark:hover:text-slate-950 transition-all border border-slate-200 dark:border-white/10 cursor-pointer shadow-lg">
                      <input
                        type="file"
                        hidden
                        multiple
                        onChange={handleImageUpload}
                        accept="image/*"
                      />
                      <Plus size={16} />
                    </label>
                    <button
                      onClick={() => removeImage(activeImageIndex)}
                      className="p-2 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl rounded-xl hover:bg-red-500/20 hover:text-red-500 transition-all border border-slate-200 dark:border-white/10 shadow-lg text-slate-500 dark:text-slate-400"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2.5 bg-white/80 dark:bg-slate-950/80 backdrop-blur-2xl px-4 py-2 rounded-full border border-slate-200 dark:border-white/5 shadow-2xl">
                    {imagePreviews.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImageIndex(i)}
                        className={`transition-all duration-300 rounded-full ${
                          i === activeImageIndex
                            ? "w-5 h-1.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"
                            : "w-1.5 h-1.5 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="hidden lg:block h-44 bg-white/60 dark:bg-slate-950/60 backdrop-blur-md border border-slate-200 dark:border-slate-800/50 rounded-3xl p-5 font-mono text-[11px] shadow-xl dark:shadow-2xl shrink-0 overflow-hidden group">
              <div className="flex items-center justify-between mb-3 border-b border-slate-100 dark:border-slate-800/50 pb-2">
                <div className="flex items-center gap-2.5">
                  <div className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </div>
                  <span className="uppercase font-black tracking-[0.15em] text-slate-500 dark:text-slate-400 text-[10px]">
                    CivicPulse Live Feed
                  </span>
                </div>
                <div className="text-[9px] text-slate-500 dark:text-slate-600 bg-slate-50 dark:bg-slate-900 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-800">
                  SYSTEM_ACTIVE
                </div>
              </div>
              <div className="overflow-y-auto h-24 no-scrollbar space-y-1.5">
                {logs.map((log, i) => (
                  <div
                    key={i}
                    className={`flex gap-3 leading-tight transition-all duration-300 ${
                      i === 0
                        ? "text-emerald-600 dark:text-emerald-400 translate-x-1"
                        : "text-slate-400 dark:text-slate-500 opacity-80"
                    }`}
                  >
                    <span className="shrink-0 opacity-40 font-bold">
                      {new Date().toLocaleTimeString([], {
                        hour12: false,
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span className="truncate">
                      <span className="opacity-40 mr-1">&gt;</span>
                      {log}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="lg:col-span-7 md:h-[60vh]  bg-white/50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] flex flex-col lg:overflow-hidden backdrop-blur-sm min-h-0 shadow-xl">
            <div className="px-8 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white/80 dark:bg-slate-900/50 shrink-0">
              <div className="flex items-center gap-3">
                <Layers
                  size={18}
                  className="text-emerald-600 dark:text-emerald-400"
                />
                <span className="text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-200">
                  Aggregate Registry
                </span>
              </div>
              {formData.confidence !== null && (
                <button
                  onClick={() => setIsEditingAI(!isEditingAI)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${
                    isEditingAI
                      ? "bg-emerald-500 text-white dark:text-slate-950 shadow-[0_0_15px_#10b98144]"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {isEditingAI ? <Lock size={12} /> : <Edit3 size={12} />}
                  {isEditingAI ? "Lock Data" : "Override"}
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto lg:p-8 p-2 lg:space-y-8 space-y-4 no-scrollbar min-h-0">
              {loadingAI ? (
                <div className="h-full flex flex-col items-center justify-center space-y-8 min-h-[400px]">
                  <Loader2
                    size={40}
                    className="animate-spin text-emerald-500"
                  />
                  <p className="text-[11px] font-black uppercase tracking-[0.4em] text-emerald-600 dark:text-emerald-400 animate-pulse text-center">
                    Synthesizing Matrix
                  </p>
                </div>
              ) : formData.confidence === null ? (
                <div className="h-full flex flex-col items-center justify-center opacity-40 dark:opacity-20 text-center space-y-6 min-h-[200px]">
                  <div className="p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-[3rem]">
                    <Radar
                      size={64}
                      className="animate-pulse text-emerald-500"
                    />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] max-w-50 text-slate-600 dark:text-slate-400">
                    System standby. Upload multiple angles.
                  </p>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8 pb-4"
                >
                  <div className="flex flex-col gap-6">
                    <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl space-y-4 shadow-md dark:shadow-xl w-full">
                      <div className="flex justify-between items-end">
                        <div className="flex items-center gap-2">
                          <ShieldCheck
                            size={14}
                            className="text-emerald-600 dark:text-emerald-400"
                          />
                          <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
                            Confidence Score
                          </span>
                        </div>
                        <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                          {formData.confidence}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-900 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${formData.confidence}%` }}
                          className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col p-5 shadow-md dark:shadow-xl relative overflow-hidden group justify-center">
                        <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest mb-2 px-2">
                          Urgency Level
                        </span>
                        <div className="relative">
                          <select
                            disabled={!isEditingAI}
                            value={formData.priority}
                            onChange={(e) =>
                              setFormData((p) => ({
                                ...p,
                                priority: e.target.value,
                              }))
                            }
                            className={`w-full bg-transparent appearance-none outline-none text-[13px] font-black uppercase italic px-2 py-1 pr-8 cursor-pointer disabled:cursor-default ${
                              formData.priority === "Critical"
                                ? "text-red-500"
                                : "text-emerald-600 dark:text-emerald-400"
                            }`}
                          >
                            {priorities.map((opt) => (
                              <option
                                key={opt}
                                value={opt}
                                className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200"
                              >
                                {opt}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            size={16}
                            className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"
                          />
                        </div>
                      </div>

                      <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col p-5 shadow-md dark:shadow-xl relative overflow-hidden group justify-center">
                        <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest mb-2 px-2">
                          Classification
                        </span>
                        <div className="relative">
                          <select
                            disabled={!isEditingAI}
                            value={formData.category}
                            onChange={(e) =>
                              setFormData((p) => ({
                                ...p,
                                category: e.target.value,
                              }))
                            }
                            className="w-full bg-transparent appearance-none outline-none text-[13px] font-black text-slate-700 dark:text-slate-300 uppercase italic px-2 py-1 pr-8 truncate cursor-pointer disabled:cursor-default"
                          >
                            {categories.map((opt) => (
                              <option
                                key={opt}
                                value={opt}
                                className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200"
                              >
                                {opt}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            size={16}
                            className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <InputWrapper
                    label="Integrated Designation"
                    icon={ShieldCheck}
                  >
                    <input
                      value={formData.title}
                      readOnly={!isEditingAI}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, title: e.target.value }))
                      }
                      className="w-full bg-white dark:bg-slate-950 p-4 rounded-2xl text-[13px] font-black text-slate-900 dark:text-white outline-none border border-slate-200 dark:border-slate-800 focus:border-emerald-500/30 transition-all shadow-sm"
                    />
                  </InputWrapper>

                  <InputWrapper label="Unified Assessment" icon={Zap}>
                    <textarea
                      value={formData.description}
                      readOnly={!isEditingAI}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          description: e.target.value,
                        }))
                      }
                      className="w-full bg-white dark:bg-slate-950 p-4 rounded-2xl text-xs font-medium text-slate-600 dark:text-slate-400 h-28 resize-none outline-none border border-slate-200 dark:border-slate-800 leading-relaxed focus:border-emerald-500/30 transition-all shadow-sm"
                    />
                  </InputWrapper>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between px-1">
                      <div className="flex items-center gap-2">
                        <Navigation
                          size={14}
                          className="text-emerald-600 dark:text-emerald-400"
                        />
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                          Deployment Site
                        </label>
                      </div>
                      <button
                        onClick={handleGetLocation}
                        disabled={isLocating}
                        className="text-[8px] font-black uppercase text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-white transition-all flex items-center gap-2 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20 active:scale-95"
                      >
                        {isLocating ? (
                          <RefreshCw size={10} className="animate-spin" />
                        ) : (
                          <MapPin size={10} />
                        )}
                        {isLocating ? "Locating..." : "Auto-Locate"}
                      </button>
                    </div>
                    <input
                      value={formData.location.address}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          location: { ...p.location, address: e.target.value },
                        }))
                      }
                      className="w-full bg-white dark:bg-slate-950 p-4 rounded-2xl text-[12px] font-mono font-black text-emerald-600 dark:text-emerald-400 outline-none border border-slate-200 dark:border-slate-800 shadow-sm"
                    />
                  </div>
                </motion.div>
              )}
            </div>

            <div className="p-8 bg-white/80 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 shrink-0">
              {!formData.confidence ? (
                <Button
                  disabled={imagePreviews.length === 0 || loadingAI}
                  onClick={analyzeWithAI}
                  className="w-full"
                >
                  {loadingAI ? (
                    "Processing Streams..."
                  ) : (
                    <>
                      <Scan size={18} /> Engage Neural Engine
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  disabled={
                    !isFormComplete || formData.confidence < 40 || isSubmitting
                  }
                  onClick={handleSubmit}
                  className="w-full"
                >
                  {isSubmitting ? (
                    "Transmitting..."
                  ) : (
                    <>
                      <CheckCircle2 size={18} /> Commit to Registry
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200..800&display=swap');
            
            /* DESKTOP: Keep original rigid layout */
            @media (min-width: 1024px) {
              html, body { margin: 0; height: 100%; overflow: hidden !important; }
            }

            /* MOBILE: Allow natural scrolling */
            @media (max-width: 1023px) {
              html, body { margin: 0; height: auto; overflow: visible !important; }
            }

            .no-scrollbar::-webkit-scrollbar { display: none; }
            .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            select option { background-color: #ffffff; color: #0f172a; }
            .dark select option { background-color: #0f172a; color: #e2e8f0; }
            ::selection { background: rgba(16, 185, 129, 0.4); color: white; }
        `,
        }}
      />
    </div>

  );
};

export default AiScan;
