"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  FileText,
  X,
  ChevronRight,
  ChevronLeft,
  Activity,
  Shield,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Camera,
  Layers,
  LocateFixed,
  Mic,
  Image as ImageIcon,
} from "lucide-react";

import { StepIndicator } from "@/components/ui/StepIndicator";
import { CustomInput } from "@/components/ui/CustomInput";
import { useSession } from "next-auth/react";
import { uploadToCloudinary } from "@/lib/cloudinary/cloudinaryUpload";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";

import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

/* ================= HELPERS & CONSTANTS ================= */
const countWords = (text = "") =>
  text.trim().split(/\s+/).filter(Boolean).length;

const categories = [
  { label: "Infrastructure", value: "infrastructure", icon: "🏗️" },
  { label: "Medical", value: "medical", icon: "🏥" },
  { label: "Safety", value: "safety", icon: "🛡️" },
  { label: "Environment", value: "environment", icon: "🌿" },
  { label: "Utilities", value: "utilities", icon: "💡" },
  { label: "Traffic", value: "traffic", icon: "🚦" },
  { label: "Waste", value: "waste", icon: "🗑️" },
  { label: "Other", value: "other", icon: "📁" },
];

const priorities = [
  { id: "Low", label: "Low", icon: Activity },
  { id: "Medium", label: "Medium", icon: AlertTriangle },
  { id: "High", label: "High", icon: Flame },
  { id: "Urgent", label: "Urgent", icon: Zap },
];

import LocationPicker from "../layouts/LocationPicker";

/* ================= MAIN REPORT COMPONENT ================= */
export default function ReportIssue() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isManualUpdate, setIsManualUpdate] = useState(false);
  const [showImageSourceModal, setShowImageSourceModal] = useState(false);

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [voiceBlob, setVoiceBlob] = useState(null);

  const router = useRouter();
  const { data: session } = useSession();
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "Medium",
    location: { address: "", lat: null, lng: null, coordinates: "" },
  });

  useEffect(() => {
    if (isManualUpdate) {
      setIsManualUpdate(false);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      if (formData.location.address && formData.location.address.length > 3) {
        geocodeAddress(formData.location.address);
      }
    }, 800);
    return () => clearTimeout(delayDebounceFn);
  }, [formData.location.address, isManualUpdate]);

  const updateLocationData = useCallback((lat, lng, address, fromPin = false) => {
    if (fromPin) setIsManualUpdate(true);
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        address: address || prev.location.address,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        coordinates: `${parseFloat(lat).toFixed(6)}, ${parseFloat(lng).toFixed(
          6
        )}`,
      },
    }));
  }, []);

  const geocodeAddress = async (address) => {
    try {
      const res = await fetch(
        `/api/geocoder/forward?address=${encodeURIComponent(address)}&limit=1`
      );
      if (!res.ok) return;
      const data = await res.json();
      if (data.lat && data.lon) {
        setFormData((prev) => ({
          ...prev,
          location: {
            ...prev.location,
            lat: parseFloat(data.lat),
            lng: parseFloat(data.lon),
          },
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleGetLocation = async () => {
    if (!navigator.geolocation) return toast.error("GPS not supported");
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const res = await fetch(
          `/api/geocoder?lat=${latitude}&lon=${longitude}&zoom=18`
        );
        const data = await res.json();
        updateLocationData(latitude, longitude, data.display_name, true);
        setIsLocating(false);
        toast.success("High-accuracy location detected");
      },
      () => {
        setIsLocating(false);
        toast.error("Location access denied. Please enable GPS.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const toggleListening = async () => {
    if (isListening) {
      mediaRecorderRef.current.stop();
      setIsListening(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];
      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setVoiceBlob(new File([blob], `voice-${Date.now()}.webm`));
        toast.success("Voice context recorded");
      };
      recorder.start();
      setIsListening(true);
    } catch {
      toast.error("Mic access denied");
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files).slice(0, 5 - imageFiles.length);
    if (imageFiles.length >= 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }
    
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () =>
        setImagePreviews((prev) => [...prev, reader.result]);
      reader.readAsDataURL(file);
    });
    setImageFiles((prev) => [...prev, ...files]);
    setShowImageSourceModal(false);
  };

  const handleEvidenceClick = () => {
    // Check if user is on mobile (width less than 768px)
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      setShowImageSourceModal(true);
    } else {
      fileInputRef.current?.click();
    }
  };

  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!session) return toast.error("Please login to submit");
    setIsSubmitting(true);
    try {
      const imageUrls = await Promise.all(
        imageFiles.map((f) => uploadToCloudinary(f, "image"))
      );
      const voiceUrl = voiceBlob
        ? await uploadToCloudinary(voiceBlob, "audio")
        : "";
      await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          images: imageUrls,
          voiceNote: voiceUrl,
        }),
      });
      toast.success("Report submitted successfully!");
      router.push("/issues");
    } catch {
      toast.error("Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="lg:h-[78vh] max-h-screen bg-transparent text-slate-900 dark:text-white transition-colors duration-700 selection:bg-emerald-500 selection:text-white">
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-10 dark:opacity-20">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/10 blur-[80px] rounded-full" />
      </div>

      <main className="relative z-10 max-w-3xl mx-auto px-6 py-4">
        <div className="bg-white dark:bg-slate-800/30 backdrop-blur-2xl border border-slate-200/60 dark:border-slate-800 rounded-[2rem] p-6 md:p-8 shadow-xl">
          <StepIndicator currentStep={step} totalSteps={3} />

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-black mb-4 flex items-center gap-2">
                    <Layers className="text-emerald-500 w-5 h-5" /> Domain
                  </h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {categories.map((cat) => (
                      <button
                        key={cat.value}
                        onClick={() =>
                          setFormData({ ...formData, category: cat.value })
                        }
                        className={`group lg:p-4 p-1 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center text-center gap-2 ${
                          formData.category === cat.value
                            ? "border-emerald-500 bg-emerald-500/10"
                            : "border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30"
                        }`}
                      >
                        <span className="lg:text-2xl text-lg group-hover:scale-110 transition-transform">
                          {cat.icon}
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-tight">
                          {cat.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-black mb-4 flex items-center gap-2">
                    <Zap className="text-emerald-500 w-5 h-5" /> Priority
                  </h3>
                  <div className="grid grid-cols-4 gap-2">
                    {priorities.map((p) => {
                      const Icon = p.icon;
                      return (
                        <button
                          key={p.id}
                          onClick={() =>
                            setFormData({ ...formData, priority: p.id })
                          }
                          className={`py-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${
                            formData.priority === p.id
                              ? "border-emerald-500 bg-emerald-500 text-white"
                              : "border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400"
                          }`}
                        >
                          <Icon size={16} />
                          <span className="text-[9px] font-black uppercase tracking-widest">
                            {p.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <CustomInput
                  label="Headline"
                  placeholder="Summarize the issue..."
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  icon={FileText}
                />
                <p className="text-[10px] text-slate-400 text-right mt-1">
                  {countWords(formData.title)} / 100 words
                </p>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 pl-1">
                    Description
                  </label>
                  <div className="relative group">
                    <textarea
                      rows={4}
                      className="w-full bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-200 dark:border-slate-800 rounded-xl p-4 pr-12 text-slate-900 dark:text-white font-semibold outline-none focus:border-emerald-500 transition-all resize-none text-sm"
                      placeholder="Provide context..."
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                    />
                    <button
                      type="button"
                      onClick={toggleListening}
                      className={`absolute bottom-4 right-2 p-2.5 rounded-lg border transition-all shadow-sm active:scale-95 ${
                        isListening
                          ? "bg-emerald-50 dark:bg-emerald-100/20 border-emerald-500 text-emerald-600 animate-pulse ring-4 ring-emerald-500/20"
                          : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      <Mic
                        className={`h-4 w-4 ${
                          isListening ? "fill-emerald-500" : ""
                        }`}
                      />
                      {isListening && (
                        <span className="absolute top-1 right-1 flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                      )}
                    </button>
                  </div>
                </div>

                <CustomInput
                  label="Address / Geo-Data"
                  placeholder="Street name or landmark"
                  value={formData.location.address || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      location: {
                        ...formData.location,
                        address: e.target.value,
                      },
                    })
                  }
                  icon={MapPin}
                  rightElement={
                    <button
                      onClick={handleGetLocation}
                      disabled={isLocating}
                      className="p-2 text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-colors"
                    >
                      <LocateFixed
                        size={18}
                        className={isLocating ? "animate-pulse" : ""}
                      />
                    </button>
                  }
                />

                {formData.location.lat && (
                  <LocationPicker
                    lat={formData.location.lat}
                    lng={formData.location.lng}
                    onLocationChange={updateLocationData}
                  />
                )}
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <AnimatePresence>
                  {showImageSourceModal && (
                    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
                      <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        onClick={() => setShowImageSourceModal(false)}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                      />
                      <motion.div 
                        initial={{ y: 100, opacity: 0 }} 
                        animate={{ y: 0, opacity: 1 }} 
                        exit={{ y: 100, opacity: 0 }}
                        className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl border border-slate-200 dark:border-slate-800"
                      >
                        <h3 className="text-xl font-black mb-6 text-center">Capture Evidence</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <button
                            onClick={() => cameraInputRef.current?.click()}
                            className="flex flex-col items-center gap-3 p-6 rounded-3xl bg-emerald-50 dark:bg-emerald-500/10 border-2 border-emerald-500/20 hover:border-emerald-500 transition-all group"
                          >
                            <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                              <Camera className="text-emerald-500" size={24} />
                            </div>
                            <span className="font-black text-[10px] uppercase tracking-widest text-emerald-600">Camera</span>
                          </button>
                          
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex flex-col items-center gap-3 p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition-all group"
                          >
                            <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                              <ImageIcon className="text-slate-500 group-hover:text-emerald-500" size={24} />
                            </div>
                            <span className="font-black text-[10px] uppercase tracking-widest text-slate-500 group-hover:text-emerald-600">Gallery</span>
                          </button>
                        </div>
                        <button 
                          onClick={() => setShowImageSourceModal(false)}
                          className="w-full mt-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                          Cancel
                        </button>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>

                <div 
                  onClick={handleEvidenceClick}
                  className="text-center p-8 rounded-2xl border-4 border-dashed border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30 group hover:border-emerald-500/30 transition-colors cursor-pointer"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-500/10 mx-auto rounded-2xl flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-105 transition-transform">
                    <Camera size={28} />
                  </div>
                  <h4 className="text-xl font-black mb-1">Evidence</h4>
                  <p className="text-slate-500 font-semibold text-xs mb-3">
                    Upload up to 5 validation photos
                  </p>
                  <div className="inline-block px-4 py-1.5 bg-white dark:bg-slate-800 rounded-lg text-[9px] font-black uppercase tracking-widest border border-slate-200 dark:border-slate-700">
                    {imagePreviews.length} / 5
                  </div>
                </div>

                {imagePreviews.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {imagePreviews.map((img, idx) => (
                      <div key={idx} className="relative w-16 h-16 group">
                        <div className="relative w-full h-full rounded-xl shadow-md overflow-hidden">
                          <Image
                            src={img}
                            alt="Preview"
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage(idx);
                          }}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-lg flex items-center justify-center shadow-lg"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900 text-white flex items-center gap-4">
                  <Shield className="w-8 h-8 text-emerald-500 shrink-0" />
                  <p className="text-slate-400 text-[10px] leading-relaxed">
                    Report will be cryptographically signed and added to the
                    municipal ledger for verification.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={step === 1}
              className="flex items-center gap-1 font-black uppercase tracking-widest text-[10px] text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all disabled:opacity-0"
            >
              <ChevronLeft size={16} /> Back
            </button>
            <button
              onClick={
                step === 3
                  ? handleSubmit
                  : async () => {
                      if (
                        step === 2 &&
                        formData.location.address &&
                        !formData.location.lat
                      )
                        await geocodeAddress(formData.location.address);
                      setStep((s) => s + 1);
                    }
              }
              disabled={
                isSubmitting ||
                (step === 1 && !formData.category) ||
                (step === 2 && !formData.location.address)
              }
              className="bg-emerald-600 text-white px-8 py-3.5 rounded-xl font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-emerald-500 disabled:grayscale disabled:opacity-50 transition-all"
            >
              {step === 3
                ? isSubmitting
                  ? "Transmitting..."
                  : "Finalize Report"
                : "Next"}
              {step === 3 ? (
                isSubmitting ? (
                  <Activity className="animate-spin" size={16} />
                ) : (
                  <CheckCircle2 size={16} />
                )
              ) : (
                <ChevronRight size={16} />
              )}
            </button>
          </div>
        </div>
      </main>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200..800&display=swap');
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
      `,
        }}
      />
    </div>
  );
}