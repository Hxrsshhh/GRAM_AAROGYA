'use client'

import React, { useState, useEffect } from "react";
import { motion as fm, AnimatePresence } from "framer-motion";
import { 
  Camera, 
  Upload, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Edit3, 
  Plus,
  Send,
  Image as ImageIcon,
  Tag,
  AlertTriangle,
  FileText,
  AlignLeft,
  Activity,
  Circle,
  CheckCircle
} from "lucide-react";

// Firebase Imports
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";

// Environment Globals
const firebaseConfig = JSON.parse(__firebase_config);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'civic-pulse-v1';
const apiKey = ""; // Provided by environment at runtime

const CATEGORIES = ["Infrastructure", "Utility", "Sanitation", "Safety", "Traffic", "Other"];
const PRIORITIES = ["Low", "Medium", "High", "Critical"];

const App = () => {
  const [user, setUser] = useState(null);
  const [image, setImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("");
  const [detectedIssues, setDetectedIssues] = useState([]);
  const [selectedIssueIndex, setSelectedIssueIndex] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.error("Auth failed:", err);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        analyzeImage(reader.result.split(',')[1]); // Pass base64 data only
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async (base64Data) => {
    setIsAnalyzing(true);
    setStatus("AI is scanning the image for specific civic discrepancies...");
    setSelectedIssueIndex(null);

    const prompt = `Analyze this image for civic infrastructure issues. 
    Return a JSON object with a key "issues" containing an array of objects. 
    Each object must represent ONE distinct issue found.
    Fields for each object: 
    "title" (3-5 words summarizing the issue), 
    "category" (Infrastructure, Utility, Sanitation, Safety, Traffic), 
    "priority" (Low, Medium, High, Critical), 
    "observation" (A single comprehensive string explaining what is seen).`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              { inlineData: { mimeType: "image/png", data: base64Data } }
            ]
          }],
          generationConfig: { responseMimeType: "application/json" }
        })
      });

      const result = await response.json();
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
      const parsed = JSON.parse(text);
      const issues = (parsed.issues || []).map(issue => ({ ...issue, id: crypto.randomUUID() }));
      setDetectedIssues(issues);
      
      // Auto-select first if found
      if (issues.length > 0) setSelectedIssueIndex(0);
      
      setStatus("Analysis complete. Select the primary issue to report.");
    } catch (error) {
      console.error("AI Analysis Error:", error);
      setStatus("Analysis error. Please verify the image and try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const updateIssue = (index, field, value) => {
    const updated = [...detectedIssues];
    updated[index][field] = value;
    setDetectedIssues(updated);
  };

  const removeIssue = (index) => {
    const filtered = detectedIssues.filter((_, i) => i !== index);
    setDetectedIssues(filtered);
    if (selectedIssueIndex === index) {
      setSelectedIssueIndex(null);
    } else if (selectedIssueIndex > index) {
      setSelectedIssueIndex(selectedIssueIndex - 1);
    }
  };

  const submitReport = async () => {
    if (!user || selectedIssueIndex === null) return;
    setIsSubmitting(true);
    setStatus("Encrypting and dispatching report...");

    const issueToSubmit = detectedIssues[selectedIssueIndex];

    try {
      const reportRef = collection(db, 'artifacts', appId, 'public', 'data', 'reports');
      await addDoc(reportRef, {
        userId: user.uid,
        issue: issueToSubmit,
        imagePresent: !!image,
        timestamp: serverTimestamp(),
        status: "Active"
      });

      setStatus("Report committed to ledger successfully.");
      setDetectedIssues([]);
      setSelectedIssueIndex(null);
      setImage(null);
    } catch (error) {
      console.error("Submission Error:", error);
      setStatus("Submission failed. Database connection error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-slate-950 text-slate-100 p-6 md:p-12 overflow-x-hidden font-sans">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Left Side: Visual Input */}
        <div className="space-y-6 lg:sticky lg:top-12 self-start">
          <div>
            <h1 className="text-4xl font-black tracking-tighter mb-2 italic uppercase">Civic<span className="text-emerald-500">Scan</span></h1>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">Automated Issue Classification System</p>
          </div>

          <div className={`relative aspect-[4/3] rounded-[2.5rem] border-2 transition-all flex flex-col items-center justify-center overflow-hidden bg-slate-900/30 ${image ? 'border-emerald-500/30 shadow-2xl shadow-emerald-500/5' : 'border-slate-800'}`}>
            {image ? (
              <>
                <img src={image} alt="Evidence" className="w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent pointer-events-none" />
                <button 
                  onClick={() => {setImage(null); setDetectedIssues([]); setSelectedIssueIndex(null);}}
                  className="absolute top-6 right-6 p-4 bg-slate-900/80 backdrop-blur-md text-red-500 rounded-2xl border border-white/5 hover:bg-red-500 hover:text-white transition-all shadow-xl"
                >
                  <Trash2 size={18} />
                </button>
              </>
            ) : (
              <label className="cursor-pointer flex flex-col items-center gap-6 group p-12 text-center">
                <div className="w-24 h-24 bg-emerald-500/5 rounded-[2rem] border border-emerald-500/20 flex items-center justify-center text-emerald-500 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500">
                  <Upload size={32} />
                </div>
                <div>
                  <span className="text-sm font-black uppercase tracking-[0.3em] text-slate-200">Initialize Scanner</span>
                  <p className="text-[10px] font-bold text-slate-500 mt-2 uppercase">Drag and drop visual evidence files</p>
                </div>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            )}

            {isAnalyzing && (
              <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl flex flex-col items-center justify-center gap-6">
                <div className="relative">
                  <Loader2 className="text-emerald-500 animate-spin" size={64} strokeWidth={1} />
                  <Activity className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-500/50" size={24} />
                </div>
                <div className="text-center">
                  <p className="text-xs font-black uppercase tracking-[0.4em] text-emerald-500 animate-pulse">Running Neural Diagnostics</p>
                  <p className="text-[9px] font-bold text-slate-500 mt-2 uppercase">Identifying material fatigue and failures</p>
                </div>
              </div>
            )}
          </div>
          
          {status && (
            <fm.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-5 rounded-3xl flex items-center gap-4 text-[10px] font-black uppercase tracking-widest border ${status.includes('successfully') ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-500' : 'bg-slate-900/50 border-slate-800 text-slate-400'}`}
            >
              <div className={`w-2 h-2 rounded-full ${status.includes('successfully') ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`} />
              {status}
            </fm.div>
          )}
        </div>

        {/* Right Side: Structured Data Card */}
        <div className="bg-slate-900/20 border border-slate-800/60 rounded-[3rem] p-10 flex flex-col shadow-2xl h-fit backdrop-blur-sm">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-xl font-black tracking-tight uppercase italic">Issue Schema</h2>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Select one subject to proceed</p>
            </div>
            <div className="h-10 px-5 bg-slate-800/50 rounded-2xl flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-emerald-500 border border-emerald-500/20">
              {detectedIssues.length} Identified
            </div>
          </div>

          <div className="space-y-8 overflow-y-auto max-h-[65vh] pr-4 custom-scrollbar">
            <AnimatePresence mode="popLayout">
              {detectedIssues.length === 0 && !isAnalyzing && (
                <fm.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="py-24 flex flex-col items-center justify-center text-slate-800 gap-4"
                >
                  <div className="p-8 bg-slate-900/30 rounded-[2.5rem] border border-slate-800/50">
                    <ImageIcon size={48} strokeWidth={1} />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em]">No telemetry detected</p>
                </fm.div>
              )}
              {detectedIssues.map((issue, idx) => {
                const isSelected = selectedIssueIndex === idx;
                return (
                  <fm.div 
                    key={issue.id || idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ 
                      opacity: 1, 
                      scale: isSelected ? 1 : 0.98,
                      borderColor: isSelected ? "rgba(16, 185, 129, 0.4)" : "rgba(30, 41, 59, 0.5)"
                    }}
                    exit={{ opacity: 0, x: 20 }}
                    onClick={() => setSelectedIssueIndex(idx)}
                    className={`bg-slate-950/40 border p-8 rounded-[2.5rem] space-y-6 relative group transition-all duration-500 cursor-pointer ${isSelected ? 'shadow-2xl shadow-emerald-500/10 ring-1 ring-emerald-500/20' : 'hover:border-slate-700'}`}
                  >
                    {/* Selection Indicator */}
                    <div className="absolute top-8 left-[-12px] -translate-x-full lg:left-[-24px] flex items-center justify-center">
                      {isSelected ? (
                        <CheckCircle size={24} className="text-emerald-500" />
                      ) : (
                        <Circle size={24} className="text-slate-800 group-hover:text-slate-600 transition-colors" />
                      )}
                    </div>

                    {/* Title Section */}
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 flex items-center gap-2">
                        <FileText size={12} className={isSelected ? "text-emerald-500" : "text-slate-600"} /> Subject Identifier
                      </label>
                      <input 
                        className={`bg-transparent border-none outline-none font-black text-xl w-full placeholder:text-slate-800 transition-colors ${isSelected ? 'text-white' : 'text-slate-500'}`}
                        value={issue.title}
                        onChange={(e) => updateIssue(idx, 'title', e.target.value)}
                        placeholder="Define issue..."
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>

                    {/* Config Row */}
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 flex items-center gap-2">
                          <Tag size={12} /> Category
                        </label>
                        <select 
                          className="w-full bg-slate-900/50 border border-slate-800/50 text-[10px] font-black uppercase tracking-widest px-4 py-3 rounded-2xl outline-none focus:border-emerald-500/30 appearance-none cursor-pointer"
                          value={issue.category}
                          onChange={(e) => updateIssue(idx, 'category', e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 flex items-center gap-2">
                          <AlertTriangle size={12} /> Severity
                        </label>
                        <select 
                          className={`w-full bg-slate-900/50 border text-[10px] font-black uppercase tracking-widest px-4 py-3 rounded-2xl outline-none appearance-none cursor-pointer transition-colors ${
                            issue.priority === 'Critical' ? 'border-red-500/30 text-red-500' : 
                            issue.priority === 'High' ? 'border-orange-500/30 text-orange-500' : 'border-slate-800/50 text-slate-400'
                          }`}
                          value={issue.priority}
                          onChange={(e) => updateIssue(idx, 'priority', e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </div>
                    </div>

                    {/* Single Observation Field */}
                    <div className="space-y-3">
                      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 flex items-center gap-2">
                        <AlignLeft size={12} /> Observation Data
                      </label>
                      <textarea 
                        className={`w-full bg-slate-900/30 border border-slate-800/50 rounded-2xl p-5 text-sm outline-none focus:border-emerald-500/30 resize-none leading-relaxed min-h-[100px] transition-all ${isSelected ? 'text-slate-300' : 'text-slate-600'}`}
                        value={issue.observation}
                        onChange={(e) => updateIssue(idx, 'observation', e.target.value)}
                        placeholder="Provide specific situational context..."
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>

                    <button 
                      onClick={(e) => { e.stopPropagation(); removeIssue(idx); }}
                      className="absolute top-6 right-6 p-2 text-slate-800 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </fm.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="mt-10 pt-8 border-t border-slate-800/50 space-y-4">
            <button 
              onClick={() => {
                const newIdx = detectedIssues.length;
                setDetectedIssues([...detectedIssues, { id: crypto.randomUUID(), title: "MANUAL_ENTRY", category: "Other", priority: "Low", observation: "" }]);
                setSelectedIssueIndex(newIdx);
              }}
              className="w-full py-4 bg-slate-900/50 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-emerald-500 hover:bg-emerald-500/5 transition-all flex items-center justify-center gap-3 border border-slate-800/50"
            >
              <Plus size={14} /> Insert Manual Data
            </button>
            <button 
              onClick={submitReport}
              disabled={selectedIssueIndex === null || isSubmitting}
              className={`w-full font-black py-5 rounded-[1.5rem] flex items-center justify-center gap-4 shadow-2xl active:scale-[0.98] transition-all uppercase text-[11px] tracking-[0.2em] ${
                selectedIssueIndex !== null 
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/10' 
                : 'bg-slate-800 text-slate-600 cursor-not-allowed grayscale'
              }`}
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
              {isSubmitting ? "Processing..." : selectedIssueIndex !== null ? "Authorize Dispatch" : "Select Subject to Dispatch"}
            </button>
            {selectedIssueIndex !== null && (
              <p className="text-center text-[9px] font-black text-emerald-500/60 uppercase tracking-widest animate-pulse">
                Subject {selectedIssueIndex + 1} Selected for Central Command
              </p>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #10b98110; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #10b98130; }
        select {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23475569'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m19 9-7 7-7-7'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          background-size: 0.8rem;
        }
      `}</style>
    </div>
  );
};

export default App;