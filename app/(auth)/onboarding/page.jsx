"use client";

import React, { useState } from "react";
import { motion as fm, AnimatePresence, motion } from "framer-motion";
import {
  User,
  MapPin,
  Phone,
  Camera,
  ChevronRight,
  ArrowLeft,
  Check,
  Activity,
  Map,
  Loader2,
  HeartPulse,
  ShieldCheck,
  Stethoscope,
  Info,
  Sparkles,
} from "lucide-react";

import MouseGlow from "@/components/ui/MouseGlow";
import { InputGroup } from "@/components/ui/InputGroup";
import { useRouter } from "next/navigation";
import { uploadToCloudinary } from "@/lib/cloudinary/cloudinaryUpload";
import Button from "@/components/ui/Button";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useTransition } from "react";

const MitraOnboarding = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSkipping, setIsSkipping] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    avatar: null,
    bio: "",
    city: "",
    state: "",
    pincode: "",
    gpsEnabled: false,
    age: "",
    gender: "",
    conditions: [],
    allergies: "",
    phone: "",
    emergencyContact: "",
    consent: false,
    interests: [],
    doctorPreference: "General",
  });

  const conditionsOptions = [
    "Diabetes",
    "BP",
    "Asthma",
    "Heart issues",
    "None",
  ];
  const interestOptions = ["Fitness", "Nutrition", "Mental Health", "Diseases"];

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.username.trim().length >= 3;
      case 2:
        return (
          formData.city.length > 1 &&
          formData.state.length > 1 &&
          formData.pincode.length === 6
        );
      case 3:
        return (
          formData.age !== "" &&
          formData.gender !== "" &&
          formData.conditions.length > 0
        );
      case 4:
        return formData.phone.length >= 10 && formData.consent === true;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const toggleSelection = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      //@ts-ignore
      [field]: prev[field].includes(value)
        ? //@ts-ignore
          prev[field].filter((i) => i !== value)
        : //@ts-ignore
          [...prev[field], value],
    }));
  };

  const handleSkip = async () => {
  try {
    await fetch("/api/user/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "skipped" }),
    });

    router.replace("/home");
  } catch (err) {
    console.error(err);
  }
};

const handleComplete = async () => {
  setIsSubmitting(true);

  try {
    const res = await fetch("/api/user/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "completed", profile: formData }),
    });

    if (!res.ok) throw new Error("Failed");

    router.replace("/home"); // ✅ AFTER update
  } catch (err) {
    console.error(err);
  } finally {
    setIsSubmitting(false);
  }
};

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const url = await uploadToCloudinary(file, "image");
      setFormData((prev) => ({ ...prev, avatar: url }));
    } catch (err) {
      alert("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const steps = [
    { id: 1, title: "Profile", icon: User },
    { id: 2, title: "Location", icon: MapPin },
    { id: 3, title: "Health", icon: HeartPulse },
    { id: 4, title: "Safety", icon: ShieldCheck },
    { id: 5, title: "Prefs", icon: Stethoscope },
  ];

  return (
    <div className="relative min-h-screen w-full flex flex-col overflow-hidden bg-white dark:bg-[#030303] selection:bg-blue-500/30 font-sans transition-colors duration-500">
      <MouseGlow />

      {/* 2. Nav */}
      <nav className="relative z-50 p-6 md:p-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Activity className="text-white w-6 h-6" />
            </div>
            <span className="text-lg font-bold tracking-tighter dark:text-white uppercase">
              Mitra <span className="text-blue-500">AI</span>
            </span>
          </div>
          <button
            onClick={handleSkip}
            disabled={isSkipping}
            className="px-5 py-2 text-[10px] font-bold tracking-widest uppercase rounded-full border border-neutral-200 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-md text-neutral-500 hover:text-blue-500 transition-all"
          >
            {isSkipping ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Skip Setup"
            )}
          </button>
        </div>
      </nav>

      {/* 3. Content */}
      <main className="relative z-10 grow flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-xl">
          {/* 4. Progress */}
          <div className="flex items-center justify-between mb-12 px-4">
            {steps.map((s, idx) => (
              <React.Fragment key={s.id}>
                <div className="flex flex-col items-center gap-2.5">
                  <motion.div
                    animate={{
                      backgroundColor:
                        step >= s.id ? "rgb(37 99 235)" : "transparent",
                      borderColor:
                        step >= s.id ? "rgb(37 99 235)" : "currentColor",
                    }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                      step >= s.id
                        ? "text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                        : "text-neutral-400 border-neutral-200 dark:border-neutral-800"
                    }`}
                  >
                    {step > s.id ? (
                      <Check size={18} strokeWidth={3} />
                    ) : (
                      <s.icon size={18} />
                    )}
                  </motion.div>
                  <span
                    className={`text-[9px] font-black uppercase tracking-[0.15em] ${step >= s.id ? "text-blue-600 dark:text-blue-400" : "text-neutral-400"}`}
                  >
                    {s.title}
                  </span>
                </div>
                {idx !== steps.length - 1 && (
                  <div className="h-[1px] grow mx-2 bg-neutral-200 dark:bg-neutral-800 relative overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-blue-500"
                      initial={{ x: "-100%" }}
                      animate={{ x: step > s.id ? "0%" : "-100%" }}
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* 5. Card */}
          <AnimatePresence mode="wait">
            <fm.div
              key={step}
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
              className="relative group"
            >
              <div className="absolute -inset-[1px] bg-gradient-to-b from-blue-500/20 to-transparent rounded-[2.5rem] blur-sm opacity-50" />
              <div className="relative bg-white/70 dark:bg-neutral-900/80 backdrop-blur-3xl border border-neutral-200 dark:border-white/10 p-8 md:p-12 rounded-[2.5rem] shadow-2xl">
                {step === 1 && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="relative inline-block mb-6">
                        <input
                          type="file"
                          hidden
                          id="avatar"
                          onChange={handleAvatarUpload}
                        />
                        <div
                          onClick={() =>
                            document.getElementById("avatar")?.click()
                          }
                          className="w-24 h-24 rounded-3xl bg-neutral-100 dark:bg-white/5 flex items-center justify-center border-2 border-dashed border-neutral-300 dark:border-white/10 cursor-pointer overflow-hidden relative group transition-all hover:border-blue-500/50"
                        >
                          {formData.avatar ? (
                            <Image
                              src={formData.avatar}
                              alt="Avatar"
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <Camera className="group-hover:text-blue-500 transition-colors text-neutral-400" />
                          )}
                          {isUploading && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                              <Loader2 className="animate-spin text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                      <h2 className="text-3xl font-bold tracking-tight dark:text-white">
                        Create Identity
                      </h2>
                      <p className="text-sm text-neutral-500 mt-2">
                        How should Mitra address you?
                      </p>
                    </div>
                    <InputGroup
                      label="Username"
                      icon={User}
                      placeholder="Full name or alias"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                    />
                    <textarea
                      placeholder="Bio or health journey (optional)"
                      className="w-full bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded-2xl p-4 min-h-[100px] outline-none focus:ring-2 focus:ring-blue-500/20 transition-all dark:text-white"
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData({ ...formData, bio: e.target.value })
                      }
                    />
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-center dark:text-white">
                      Location Details
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                      <InputGroup
                        label="City"
                        icon={Map}
                        value={formData.city}
                        onChange={(e) =>
                          setFormData({ ...formData, city: e.target.value })
                        }
                      />
                      <InputGroup
                        label="State"
                        icon={MapPin}
                        value={formData.state}
                        onChange={(e) =>
                          setFormData({ ...formData, state: e.target.value })
                        }
                      />
                    </div>
                    <InputGroup
                      label="PIN Code"
                      icon={MapPin}
                      placeholder="6-digit code"
                      value={formData.pincode}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pincode: e.target.value.slice(0, 6),
                        })
                      }
                    />
                    <button
                      onClick={() =>
                        setFormData({
                          ...formData,
                          gpsEnabled: !formData.gpsEnabled,
                        })
                      }
                      className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between ${formData.gpsEnabled ? "bg-blue-500/10 border-blue-500 text-blue-500" : "border-neutral-200 dark:border-white/10 text-neutral-500"}`}
                    >
                      <span className="text-sm font-bold">
                        Enable Precision GPS
                      </span>
                      <div
                        className={`w-10 h-5 rounded-full relative transition-colors ${formData.gpsEnabled ? "bg-blue-500" : "bg-neutral-300 dark:bg-neutral-700"}`}
                      >
                        <div
                          className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${formData.gpsEnabled ? "left-6" : "left-1"}`}
                        />
                      </div>
                    </button>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-center dark:text-white">
                      Health Profile
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                      <InputGroup
                        label="Age"
                        icon={Info}
                        type="number"
                        value={formData.age}
                        onChange={(e) =>
                          setFormData({ ...formData, age: e.target.value })
                        }
                      />
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase text-neutral-400 ml-1">
                          Gender
                        </label>
                        <select
                          className="w-full bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded-2xl p-3 outline-none dark:text-white"
                          value={formData.gender}
                          onChange={(e) =>
                            setFormData({ ...formData, gender: e.target.value })
                          }
                        >
                          <option value="" className="dark:bg-neutral-900">
                            Select
                          </option>
                          <option value="Male" className="dark:bg-neutral-900">
                            Male
                          </option>
                          <option
                            value="Female"
                            className="dark:bg-neutral-900"
                          >
                            Female
                          </option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase text-neutral-400">
                        Conditions
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {conditionsOptions.map((c) => (
                          <button
                            key={c}
                            onClick={() => toggleSelection("conditions", c)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${formData.conditions.includes(c) ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "bg-neutral-100 dark:bg-white/5 text-neutral-500 hover:bg-neutral-200 dark:hover:bg-white/10"}`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-center dark:text-white">
                      Safety & Verification
                    </h2>
                    <InputGroup
                      label="Phone Number"
                      icon={Phone}
                      placeholder="10-digit mobile"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phone: e.target.value.replace(/\D/g, "").slice(0, 10),
                        })
                      }
                    />
                    <label className="flex items-start gap-4 p-5 bg-blue-500/5 border border-blue-500/10 rounded-3xl cursor-pointer group">
                      <input
                        type="checkbox"
                        className="mt-1 accent-blue-500 w-4 h-4"
                        checked={formData.consent}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            consent: e.target.checked,
                          })
                        }
                      />
                      <span className="text-xs text-neutral-500 leading-relaxed group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors">
                        I agree to share my health data securely with Mitra AI
                        for personalized healthcare insights and emergency
                        assistance.
                      </span>
                    </label>
                  </div>
                )}

                {step === 5 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-center dark:text-white">
                      Final Preferences
                    </h2>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase text-neutral-400">
                        Interests
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {interestOptions.map((i) => (
                          <button
                            key={i}
                            onClick={() => toggleSelection("interests", i)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${formData.interests.includes(i) ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "bg-neutral-100 dark:bg-white/5 text-neutral-500"}`}
                          >
                            {i}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {["General", "Specialist"].map((t) => (
                        <button
                          key={t}
                          onClick={() =>
                            setFormData({ ...formData, doctorPreference: t })
                          }
                          className={`p-4 rounded-2xl border-2 font-bold text-sm transition-all ${formData.doctorPreference === t ? "border-blue-500 bg-blue-500/5 text-blue-500" : "border-neutral-100 dark:border-white/10 text-neutral-400"}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 6. Action Buttons */}
                <div className="flex gap-4 mt-10">
                  {step > 1 && (
                    <button
                      onClick={() => setStep((s) => s - 1)}
                      className="p-4 rounded-2xl border border-neutral-200 dark:border-white/10 hover:bg-neutral-100 dark:hover:bg-white/5 text-neutral-500 transition-all active:scale-95"
                    >
                      <ArrowLeft size={20} />
                    </button>
                  )}
                  <button
                    onClick={
                      step === 5 ? handleComplete : () => setStep((s) => s + 1)
                    }
                    disabled={!isStepValid() || isSubmitting}
                    className={`grow py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all duration-300 ${
                      isStepValid()
                        ? "bg-neutral-950 dark:bg-white text-white dark:text-black hover:shadow-xl active:scale-[0.98]"
                        : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed"
                    }`}
                  >
                    {isSubmitting ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <>
                        <span className="tracking-tight">
                          {step === 5 ? "Initialize Mitra AI" : "Continue"}
                        </span>
                        <ChevronRight
                          size={18}
                          className={isStepValid() ? "text-blue-500" : ""}
                        />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </fm.div>
          </AnimatePresence>
        </div>
      </main>

      <footer className="relative z-10 p-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/5 border border-blue-500/10">
          <ShieldCheck size={14} className="text-blue-500" />
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
            Secure HIPAA-compliant data vault
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MitraOnboarding;
