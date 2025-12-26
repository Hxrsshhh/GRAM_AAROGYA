'use client'

import React, { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  FileText,
  Upload,
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
  Navigation,
  Camera,
  Layers,
  Sun,
  Moon,
  LocateFixed
} from 'lucide-react';

// --- Theme Management ---
const ThemeContext = createContext({ theme: 'dark', setTheme: () => {} });
const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);
  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
};
const useTheme = () => useContext(ThemeContext);

// --- Enhanced UI Components ---
const StepIndicator = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex items-center justify-between mb-8">
      {[1, 2, 3].map((s) => (
        <div key={s} className="flex flex-col items-center flex-1 relative">
          <div className={`z-10 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 border-2 ${
            s < currentStep ? 'bg-emerald-600 border-emerald-600 text-white' : 
            s === currentStep ? 'bg-white dark:bg-slate-900 border-emerald-500 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 
            'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
          }`}>
            {s < currentStep ? <CheckCircle2 className="w-5 h-5" /> : <span className="font-black text-sm">{s}</span>}
          </div>
          <span className={`mt-2 text-[10px] font-black uppercase tracking-widest ${s === currentStep ? 'text-emerald-500' : 'text-slate-400'}`}>
            {s === 1 ? 'Category' : s === 2 ? 'Details' : 'Evidence'}
          </span>
          {s < totalSteps && (
            <div className={`absolute top-5 left-[60%] w-[80%] h-0.5 transition-colors duration-500 ${s < currentStep ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-slate-800'}`} />
          )}
        </div>
      ))}
    </div>
  );
};

const CustomInput = ({ label, icon: Icon, rightElement, ...props }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 pl-1">{label}</label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
        <Icon size={18} />
      </div>
      <input 
        className="w-full bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-11 pr-12 text-slate-900 dark:text-white font-semibold outline-none focus:border-emerald-500 transition-all text-sm"
        {...props}
      />
      {rightElement && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          {rightElement}
        </div>
      )}
    </div>
  </div>
);

const ReportIssue = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const { theme, setTheme } = useTheme();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "medium",
    location: "",
    images: [],
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
    { id: 'low', icon: Clock, label: 'Standard' },
    { id: 'medium', icon: Activity, label: 'Urgent' },
    { id: 'high', icon: AlertTriangle, label: 'Critical' },
    { id: 'critical', icon: Flame, label: 'SOS' }
  ];

  const handleImageUpload = (e) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, reader.result].slice(0, 5),
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // Mocking a reverse geocode address for the UI demo
        setTimeout(() => {
          setFormData(prev => ({ 
            ...prev, 
            location: `${latitude.toFixed(4)}, ${longitude.toFixed(4)} (Detected Address)` 
          }));
          setIsLocating(false);
        }, 1200);
      },
      () => {
        setIsLocating(false);
        alert("Unable to retrieve your location");
      }
    );
  };

  const removeImage = (index) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Report Submitted Successfully!");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-700 selection:bg-emerald-500 selection:text-white">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-10 dark:opacity-20">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/10 blur-[80px] rounded-full" />
      </div>



      <main className="relative  z-10 max-w-3xl mx-auto px-6 py-4">
        <div className="text-center mt-22 mb-8">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-2 italic">File <span className="text-emerald-500 not-italic">Report.</span></h1>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-[0.2em]">Municipal Sync Protocol</p>
        </div>

        <div className="bg-white dark:bg-slate-900/50 backdrop-blur-2xl border border-slate-200/60 dark:border-slate-800 rounded-[2rem] p-6 md:p-8 shadow-xl">
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
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {categories.map((cat) => (
                      <button
                        key={cat.value}
                        onClick={() => setFormData({ ...formData, category: cat.value })}
                        className={`group p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center text-center gap-2 ${
                          formData.category === cat.value
                            ? "border-emerald-500 bg-emerald-500/10"
                            : "border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30"
                        }`}
                      >
                        <span className="text-2xl group-hover:scale-110 transition-transform">{cat.icon}</span>
                        <span className="text-[10px] font-black uppercase tracking-tight">{cat.label}</span>
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
                          onClick={() => setFormData({ ...formData, priority: p.id })}
                          className={`py-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${
                            formData.priority === p.id
                              ? "border-emerald-500 bg-emerald-500 text-white"
                              : "border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400"
                          }`}
                        >
                          <Icon size={16} />
                          <span className="text-[9px] font-black uppercase tracking-widest">{p.label}</span>
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
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  icon={FileText}
                />

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 pl-1">Description</label>
                  <textarea
                    rows={4}
                    className="w-full bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-200 dark:border-slate-800 rounded-xl p-4 text-slate-900 dark:text-white font-semibold outline-none focus:border-emerald-500 transition-all resize-none text-sm"
                    placeholder="Provide context..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <CustomInput 
                  label="Address / Geo-Data"
                  placeholder="Street name or landmark"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  icon={MapPin}
                  rightElement={
                    <button
                      onClick={handleGetLocation}
                      disabled={isLocating}
                      className="p-2 text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-colors disabled:opacity-50"
                      title="Detect Live Location"
                    >
                      <LocateFixed size={18} className={isLocating ? "animate-pulse" : ""} />
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
                  <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" id="upload" />
                  <label htmlFor="upload" className="cursor-pointer flex flex-col items-center">
                    <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-105 transition-transform">
                      <Camera size={28} />
                    </div>
                    <h4 className="text-xl font-black mb-1">Evidence</h4>
                    <p className="text-slate-500 font-semibold text-xs mb-3">Upload up to 5 validation photos</p>
                    <div className="px-4 py-1.5 bg-white dark:bg-slate-800 rounded-lg text-[9px] font-black uppercase tracking-widest border border-slate-200 dark:border-slate-700">
                      {formData.images.length} / 5
                    </div>
                  </label>
                </div>

                {formData.images.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="relative w-16 h-16 group">
                        <img src={img} className="w-full h-full object-cover rounded-xl shadow-md" alt="Report preview" />
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

                <div className="p-4 rounded-xl bg-slate-900 text-white flex items-center gap-4">
                  <Shield className="w-8 h-8 text-emerald-500 shrink-0" />
                  <p className="text-slate-400 text-[10px] leading-relaxed">Report will be cryptographically signed and added to the municipal ledger for verification.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button 
              onClick={() => setStep(s => Math.max(1, s - 1))}
              disabled={step === 1}
              className="flex items-center gap-1 font-black uppercase tracking-widest text-[10px] text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-0 transition-all"
            >
              <ChevronLeft size={16} /> Back
            </button>

            {step < 3 ? (
              <button 
                disabled={(step === 1 && !formData.category) || (step === 2 && (!formData.title || !formData.location))}
                onClick={() => setStep(s => s + 1)}
                className="bg-emerald-600 text-white px-8 py-3.5 rounded-xl font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-emerald-500 disabled:grayscale disabled:opacity-50 transition-all"
              >
                Next <ChevronRight size={16} />
              </button>
            ) : (
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting || formData.images.length === 0}
                className={`relative px-10 py-3.5 rounded-xl font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-xl transition-all ${
                  isSubmitting ? 'bg-slate-200 text-slate-500' : 'bg-emerald-600 text-white hover:bg-emerald-500'
                }`}
              >
                {isSubmitting ? 'Transmitting...' : 'Finalize Report'}
                {!isSubmitting && <CheckCircle2 size={16} />}
              </button>
            )}
          </div>
        </div>
      </main>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200..800&display=swap');
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
      `}} />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <ReportIssue />
    </ThemeProvider>
  );
}