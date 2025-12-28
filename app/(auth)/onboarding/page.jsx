'use client';

import React, { useState, useEffect } from "react";
import { motion as fm, AnimatePresence } from "framer-motion";
import { 
  User, 
  MapPin, 
  Phone, 
  FileText, 
  Camera, 
  ChevronRight, 
  ArrowLeft,
  Check,
  Activity,
  Map,
  Plus
} from "lucide-react";

const MouseGlow = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
      style={{
        background: `radial-gradient(600px at ${mousePos.x}px ${mousePos.y}px, rgba(16, 185, 129, 0.08), transparent 80%)`,
      }}
    />
  );
};

const InputGroup = ({ label, icon: Icon, placeholder, value, onChange, type = "text" }) => (
  <div className="mb-6">
    <label className="block text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
        <Icon size={18} />
      </div>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all font-medium text-slate-900 dark:text-white"
      />
    </div>
  </div>
);

const App = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: "",
    avatar: null,
    city: "",
    state: "",
    phone: "",
    bio: ""
  });

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);
  const handleSkip = () => {
    console.log("User skipped onboarding");
  };

  const steps = [
    { id: 1, title: "Identity", icon: User },
    { id: 2, title: "Location", icon: MapPin },
    { id: 3, title: "Contact", icon: Phone }
  ];

  return (
    <div className="h-screen w-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white overflow-hidden font-sans flex flex-col">
      <MouseGlow />

      {/* Header */}
      <nav className="shrink-0 z-50 p-6 md:p-8 ">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-600/20">
              <Activity className="text-white w-4 h-4" />
            </div>
            <span className="text-lg font-black tracking-tight uppercase">Onboarding</span>
          </div>
          <button 
            onClick={handleSkip}
            className="text-sm font-bold text-slate-400 hover:text-emerald-500 transition-colors tracking-widest uppercase"
          >
            Skip for now
          </button>
        </div>
      </nav>

      {/* Main Container */}
      <main className="flex-grow flex items-center justify-center px-6 relative">
        <div className="w-full max-w-xl">
          
          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-4 mb-12">
            {steps.map((s, idx) => (
              <React.Fragment key={s.id}>
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                    step >= s.id ? "bg-emerald-600 border-emerald-600 text-white" : "border-slate-200 dark:border-slate-800 text-slate-400"
                  }`}>
                    {step > s.id ? <Check size={18} /> : <s.icon size={18} />}
                  </div>
                </div>
                {idx !== steps.length - 1 && (
                  <div className={`h-[2px] w-12 transition-colors duration-500 ${step > s.id ? "bg-emerald-600" : "bg-slate-200 dark:bg-slate-800"}`} />
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
                      <div className="w-24 h-24 rounded-[2rem] bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 group-hover:border-emerald-500 transition-colors cursor-pointer">
                        <Camera className="text-slate-400 group-hover:text-emerald-500" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-600/20">
                        <Plus size={16} />
                      </div>
                    </div>
                    <h2 className="text-2xl font-black tracking-tight">Public Profile</h2>
                    <p className="text-slate-500 text-sm">How you'll appear in the civic network.</p>
                  </div>

                  <InputGroup 
                    label="Username" 
                    icon={User} 
                    placeholder="e.g. citizen_kane" 
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                  />
                  
                  <div className="mb-2">
                    <label className="block text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1">Bio (Optional)</label>
                    <textarea 
                      placeholder="Tell us about your community interests..."
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all font-medium text-slate-900 dark:text-white h-24 resize-none"
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-black tracking-tight">Your District</h2>
                    <p className="text-slate-500 text-sm">Help us route the right reports to your area.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <InputGroup 
                      label="City" 
                      icon={Map} 
                      placeholder="New York" 
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                    />
                    <InputGroup 
                      label="State" 
                      icon={MapPin} 
                      placeholder="NY" 
                      value={formData.state}
                      onChange={(e) => setFormData({...formData, state: e.target.value})}
                    />
                  </div>
                  <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-start gap-3">
                    <Activity size={18} className="text-emerald-600 mt-1 shrink-0" />
                    <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium leading-relaxed">
                      Setting your city helps us verify community reports and prioritize local infrastructure improvements.
                    </p>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-black tracking-tight">Verification</h2>
                    <p className="text-slate-500 text-sm">Used for emergency alerts and secure updates.</p>
                  </div>

                  <InputGroup 
                    label="Phone Number" 
                    icon={Phone} 
                    placeholder="+1 (555) 000-0000" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                  <div className="text-center p-8 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800/50">
                    <div className="w-12 h-12 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check size={24} />
                    </div>
                    <h3 className="font-bold mb-1">Almost there!</h3>
                    <p className="text-sm text-slate-500">Your profile will be secured via encrypted storage.</p>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-4 mt-8">
                {step > 1 && (
                  <button 
                    onClick={handleBack}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:border-emerald-500 hover:text-emerald-500 transition-all"
                  >
                    <ArrowLeft size={20} />
                  </button>
                )}
                <button 
                  onClick={step === 3 ? handleSkip : handleNext}
                  className="flex-grow bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {step === 3 ? "Complete Setup" : "Continue"}
                  <ChevronRight size={20} />
                </button>
              </div>
            </fm.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="shrink-0 pb-8 text-center px-6">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-600 max-w-sm mx-auto">
          Your data is protected by civic-grade encryption protocols
        </p>
      </footer>
    </div>
  );
};

export default App;