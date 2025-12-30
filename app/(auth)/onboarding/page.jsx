"use client";

import React, { useEffect, useState } from "react";
import { motion as fm, AnimatePresence } from "framer-motion";
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
  Plus,
  Loader2,
} from "lucide-react";

import MouseGlow from "@/components/ui/MouseGlow";
import { InputGroup } from "@/components/ui/InputGroup";
import { useRouter } from "next/navigation";
import { uploadToCloudinary } from "@/lib/cloudinary/cloudinaryUpload";
import Button from "@/components/ui/Button";
import { useSession } from "next-auth/react";

const App = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSkipping, setIsSkipping] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    avatar: null,
    city: "",
    state: "",
    phone: "",
    bio: "",
  });

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!session?.user) {
    router.replace("/login");
    return null;
  }

  if (session.user.onboardingCompleted) {
    router.replace("/dashboard");
    return null;
  }

  const handleNext = () => {
    if (isStepValid()) setStep((s) => s + 1);
  };

  const handleBack = () => setStep((s) => s - 1);

  // Requirement: Button is blocked until data is filled
  const isStepValid = () => {
    if (step === 1) {
      return formData.username.trim().length >= 3 && formData.avatar !== null;
    }
    if (step === 2) {
      return (
        formData.city.trim().length >= 2 && formData.state.trim().length >= 2
      );
    }
    if (step === 3) {
      return formData.phone.trim().length >= 10;
    }
    return true;
  };

  const handleSkip = async () => {
    setIsSkipping(true);
    try {
      const response = await fetch("/api/user/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "skipped",
          skippedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error("Failed to update onboarding status");

      // 🔥 Force NextAuth session refresh
      await fetch("/api/auth/session");

      // 🔥 Replace, do not push
      router.replace("/dashboard");
    } catch (err) {
      console.error("Skip failed:", err);
    } finally {
      setIsSkipping(false);
    }
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      await fetch("/api/user/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "completed",
          profile: formData,
        }),
      });
      await fetch("/api/auth/session");

      router.replace("/dashboard");
    } catch (err) {
      console.error("Completion failed", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be under 2MB");
      return;
    }

    setIsUploading(true);
    try {
      const url = await uploadToCloudinary(file, "image");
      setFormData((prev) => ({
        ...prev,
        avatar: url,
      }));
    } catch (err) {
      console.error(err);
      alert("Avatar upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const steps = [
    { id: 1, title: "Identity", icon: User },
    { id: 2, title: "Location", icon: MapPin },
    { id: 3, title: "Contact", icon: Phone },
  ];

  return (
    <div className="h-screen w-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white overflow-hidden font-sans flex flex-col">
      <MouseGlow />

      <nav className="shrink-0 z-50 p-6 md:p-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-600/20">
              <Activity className="text-white w-4 h-4" />
            </div>
            <span className="text-lg font-black tracking-tight uppercase text-slate-900 dark:text-white">
              Onboarding
            </span>
          </div>

          <Button
            variant="secondary"
            onClick={handleSkip}
            disabled={isSkipping}
            className="h-12 w-42"
          >
            {isSkipping ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Skip for now"
            )}
          </Button>
        </div>
      </nav>

      <main className="flex-grow flex items-center justify-center px-6 relative">
        <div className="w-full max-w-xl">
          <div className="flex items-center justify-center gap-4 mb-12">
            {steps.map((s, idx) => (
              <React.Fragment key={s.id}>
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                      step >= s.id
                        ? "bg-emerald-600 border-emerald-600 text-white"
                        : "border-slate-200 dark:border-slate-800 text-slate-400"
                    }`}
                  >
                    {step > s.id ? <Check size={18} /> : <s.icon size={18} />}
                  </div>
                </div>
                {idx !== steps.length - 1 && (
                  <div
                    className={`h-[2px] w-12 transition-colors duration-500 ${
                      step > s.id
                        ? "bg-emerald-600"
                        : "bg-slate-200 dark:bg-slate-800"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <fm.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-2xl shadow-emerald-500/5"
            >
              {step === 1 && (
                <div>
                  <div className="text-center mb-8">
                    <div className="relative inline-block group mb-4">
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        id="avatarUpload"
                        onChange={handleAvatarUpload}
                        disabled={isUploading}
                      />
                      <div
                        onClick={() =>
                          !isUploading &&
                          document.getElementById("avatarUpload")?.click()
                        }
                        className="w-24 h-24 rounded-[2rem] bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 group-hover:border-emerald-500 transition-colors overflow-hidden cursor-pointer relative"
                      >
                        {isUploading ? (
                          <div className="flex flex-col items-center gap-1">
                            <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
                            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">
                              Uploading
                            </span>
                          </div>
                        ) : formData.avatar ? (
                          <img
                            src={formData.avatar}
                            alt="avatar"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Camera className="text-slate-400 group-hover:text-emerald-500" />
                        )}
                      </div>
                      {!isUploading && (
                        <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-600/20 pointer-events-none">
                          <Plus size={16} />
                        </div>
                      )}
                    </div>
                    <h2 className="text-2xl font-black tracking-tight">
                      Public Profile
                    </h2>
                    <p className="text-slate-500 text-sm">
                      Upload a photo and choose a username.
                    </p>
                  </div>

                  <InputGroup
                    label="Username"
                    icon={User}
                    placeholder="e.g. citizen_kane"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                  />

                  <div className="mb-2">
                    <label className="block text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1">
                      Bio (Optional)
                    </label>
                    <textarea
                      placeholder="Tell us about your community interests..."
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all font-medium text-slate-900 dark:text-white h-24 resize-none"
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData({ ...formData, bio: e.target.value })
                      }
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-black tracking-tight">
                      Your District
                    </h2>
                    <p className="text-slate-500 text-sm">
                      Help us route reports to your area.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <InputGroup
                      label="City"
                      icon={Map}
                      placeholder="e.g. Siliguri"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                    />
                    <InputGroup
                      label="State"
                      icon={MapPin}
                      placeholder="e.g. WB"
                      value={formData.state}
                      onChange={(e) =>
                        setFormData({ ...formData, state: e.target.value })
                      }
                    />
                  </div>
                  <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-start gap-3">
                    <Activity
                      size={18}
                      className="text-emerald-600 mt-1 shrink-0"
                    />
                    <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium leading-relaxed">
                      Setting your city helps us verify community reports and
                      prioritize local improvements.
                    </p>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-black tracking-tight">
                      Verification
                    </h2>
                    <p className="text-slate-500 text-sm">
                      Used for emergency alerts and secure updates.
                    </p>
                  </div>
                  <InputGroup
                    label="Phone Number"
                    icon={Phone}
                    placeholder="+91 00000-00000"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                  <div className="text-center p-8 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800/50">
                    <div className="w-12 h-12 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check size={24} />
                    </div>
                    <h3 className="font-bold mb-1">Almost there!</h3>
                    <p className="text-sm text-slate-500">
                      Your profile will be secured via encrypted storage.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-4 mt-8">
                {step > 1 && (
                  <button
                    onClick={handleBack}
                    disabled={isSubmitting}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:border-emerald-500 hover:text-emerald-500 transition-all disabled:opacity-50"
                  >
                    <ArrowLeft size={20} />
                  </button>
                )}

                <button
                  onClick={step === 3 ? handleComplete : handleNext}
                  disabled={!isStepValid() || isUploading || isSubmitting}
                  className={`flex-grow font-bold py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 
                    ${
                      !isStepValid() || isUploading || isSubmitting
                        ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-200 dark:border-slate-700 shadow-none"
                        : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 active:scale-[0.98]"
                    }`}
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      {step === 3 ? "Complete Setup" : "Continue"}
                      <ChevronRight size={20} />
                    </>
                  )}
                </button>
              </div>
            </fm.div>
          </AnimatePresence>
        </div>
      </main>

      <footer className="shrink-0 pb-8 text-center px-6">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-600 max-w-sm mx-auto">
          Your data is protected by civic-grade encryption protocols
        </p>
      </footer>
    </div>
  );
};

export default App;
