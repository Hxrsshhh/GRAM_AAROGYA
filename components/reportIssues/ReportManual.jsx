"use client";

import React, { useState } from "react";
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
  Clock,
  Camera,
  Layers,
  LocateFixed,
  Map,
  Mic,
} from "lucide-react";

import { StepIndicator } from "@/components/ui/StepIndicator";
import { CustomInput } from "@/components/ui/CustomInput";
import { useSession } from "next-auth/react";
import { uploadToCloudinary } from "@/lib/cloudinary/cloudinaryUpload";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ReportIssue() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState("");

  const [isListening, setIsListening] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [voiceBlob, setVoiceBlob] = useState(null);

  const router = useRouter();

  const { data: session, status } = useSession();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "Medium",
    location: {
      address: "",
      lat: null,
      lng: null,
      coordinates: "",
    },
  });

  const categories = [
    { value: "infrastructure", label: "Infra", icon: "🏗️" },
    { value: "sanitation", label: "Waste", icon: "🗑️" },
    { value: "safety", label: "Safety", icon: "⚠️" },
    { value: "environment", label: "Eco", icon: "🌳" },
    { value: "utilities", label: "Power", icon: "💡" },
    { value: "traffic", label: "Traffic", icon: "🚦" },
    { value: "other", label: "Other", icon: "📋" },
  ];

  const priorities = [
    { id: "Low", icon: Clock, label: "Standard" },
    { id: "Medium", icon: Activity, label: "Urgent" },
    { id: "High", icon: AlertTriangle, label: "Critical" },
    { id: "Critical", icon: Flame, label: "SOS" },
  ];

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const limited = files.slice(0, 5 - imageFiles.length);

    limited.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });

    setImageFiles((prev) => [...prev, ...limited]);
  };

  const handleGetLocation = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
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
          console.log(data);

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

  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
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
      if (voiceBlob) {
        voiceNote = await uploadToCloudinary(voiceBlob, "audio");
      }

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
      router.push("/issues");
    }
  };

  const mediaRecorderRef = React.useRef(null);
  const chunksRef = React.useRef([]);

  const toggleListening = async () => {
    if (isListening) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());

      setIsListening(false);
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);

    mediaRecorderRef.current = recorder;
    chunksRef.current = [];

    recorder.ondataavailable = (e) => chunksRef.current.push(e.data);

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      setVoiceBlob(blob);
      chunksRef.current = [];
    };

    recorder.start();
    setIsListening(true);
  };

  return (
    <div className="lg:h-[70vh] max-h-screen bg-transparent text-slate-900 dark:text-white transition-colors duration-700 selection:bg-emerald-500 selection:text-white">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-10 dark:opacity-20">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/10 blur-[80px] rounded-full" />
      </div>

      <main className="relative  z-10 max-w-3xl mx-auto px-6 py-4">
        <div className="bg-white  dark:bg-slate-800/30 backdrop-blur-2xl border border-slate-200/60 dark:border-slate-800 rounded-[2rem] p-6 md:p-8 shadow-xl  ">
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

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 pl-1">
                    Description
                  </label>

                  {/* Relative wrapper to contain the absolute button */}
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

                    {/* Voice Button UI */}
                    <button
                      type="button"
                      onClick={toggleListening}
                      className={`absolute bottom-4 right-2 p-2.5 rounded-lg border transition-all shadow-sm active:scale-95
                      ${
                        isListening
                          ? "bg-emerald-50 dark:bg-emerald-100/20 border-emerald-500 text-emerald-600 animate-pulse ring-4               ring-emerald-500/20"
                          : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700               text-slate-500 dark:text-slate-400"
                      } 
                    hover:text-emerald-500 hover:border-emerald-500 transition-all`}
                      title={isListening ? "Stop Listening" : "Voice Input"}
                    >
                      <Mic
                        className={`h-4 w-4 ${
                          isListening ? "fill-emerald-500" : ""
                        }`}
                      />

                      {/* Optional: Add a small red dot indicator */}
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
                      className="p-2 text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-colors disabled:opacity-50"
                      title="Detect Live Location"
                    >
                      <LocateFixed
                        size={18}
                        className={isLocating ? "animate-pulse" : ""}
                      />
                    </button>
                  }
                />
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
                <div className="text-center p-8 rounded-2xl border-4 border-dashed border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30 group hover:border-emerald-500/30 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="upload"
                  />
                  <label
                    htmlFor="upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-105 transition-transform">
                      <Camera size={28} />
                    </div>
                    <h4 className="text-xl font-black mb-1">Evidence</h4>
                    <p className="text-slate-500 font-semibold text-xs mb-3">
                      Upload up to 5 validation photos
                    </p>
                    <div className="px-4 py-1.5 bg-white dark:bg-slate-800 rounded-lg text-[9px] font-black uppercase tracking-widest border border-slate-200 dark:border-slate-700">
                      {imagePreviews.length} / 5
                    </div>
                  </label>
                </div>

                {imagePreviews.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {imagePreviews.map((img, idx) => (
                      <div key={idx} className="relative w-16 h-16 group">
                        <div className="relative w-full h-full rounded-xl shadow-md overflow-hidden">
                          <Image
                            src={img}
                            alt="Report preview"
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 400px"
                          />
                        </div>

                        <button
                          onClick={() => removeImage(idx)}
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
              className="flex items-center gap-1 font-black uppercase tracking-widest text-[10px] text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-0 transition-all"
            >
              <ChevronLeft size={16} /> Back
            </button>

            {step < 3 ? (
              <button
                disabled={
                  (step === 1 && !formData.category) ||
                  (step === 2 &&
                    (!formData.title || !formData.location.address))
                }
                onClick={() => setStep((s) => s + 1)}
                className="bg-emerald-600 text-white px-8 py-3.5 rounded-xl font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-emerald-500 disabled:grayscale disabled:opacity-50 transition-all"
              >
                Next <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || imagePreviews.length === 0}
                className={`relative px-10 py-3.5 rounded-xl font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-xl transition-all ${
                  isSubmitting
                    ? "bg-emerald-800 text-slate-100"
                    : "bg-emerald-600 text-white hover:bg-emerald-500"
                }`}
              >
                {isSubmitting ? "Transmitting..." : "Finalize Report"}
                {!isSubmitting && <CheckCircle2 size={16} />}
              </button>
            )}
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
