"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Newspaper,
  ExternalLink,
  Search,
  RefreshCcw,
  Loader2,
  Globe,
  ArrowLeft,
  Calendar,
  ChevronRight,
  AlertCircle,
  Sparkles,
} from "lucide-react";

const translations = {
  English: {
    heading: "Medical Insights",
    subheading:
      "Curated breakthroughs and health news from global verified sources.",
    buttonText: "Fetch News",
    loadingText: "Scanning...",
    responseTitle: "Top Stories",
    homeButtonText: "Back",
    readMore: "Full Article",
  },
  Hindi: {
    heading: "चिकित्सा समाचार",
    subheading:
      "वैश्विक सत्यापित स्रोतों से नवीनतम चिकित्सा खोजें और स्वास्थ्य समाचार।",
    buttonText: "समाचार प्राप्त करें",
    loadingText: "खोज रहे हैं...",
    responseTitle: "मुख्य समाचार",
    homeButtonText: "पीछे",
    readMore: "पूरा पढ़ें",
  },
  Bengali: {
    heading: "স্বাস্থ্য সংবাদ",
    subheading: "বিশ্বজুড়ে যাচাইকৃত উৎস থেকে চিকিৎসা বিজ্ঞানের সর্বশেষ তথ্য।",
    buttonText: "খবর পান",
    loadingText: "খোঁজা হচ্ছে...",
    responseTitle: "সেরা খবর",
    homeButtonText: "ফিরে যান",
    readMore: "পুরো পড়ুন",
  },
};

const languages = [
  "English",
  "Hindi",
  "Bengali",
  "Marathi",
  "Tamil",
  "Telugu",
  "Gujarati",
  "Punjabi",
  "Malayalam",
  "Kannada",
  "Odia",
];

export default function HealthNewsPage() {
  const [language, setLanguage] = useState("English");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const t = useMemo(
    () => translations[language] || translations["English"],
    [language],
  );

  const handleGetNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language }),
      });
      if (!res.ok) throw new Error("Server communication failed.");
      const data = await res.json();
      if (data.articles?.length > 0) {
        setArticles(data.articles);
      } else {
        setError("No recent news found for this language.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] text-slate-900 dark:text-gray-100 transition-colors duration-500 overflow-x-hidden">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[70%] h-[70%] bg-blue-600/10 dark:bg-blue-600/15 blur-[140px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 dark:bg-indigo-600/15 blur-[140px] rounded-full" />
      </div>

      {/* Spacer for Navbar */}
      <div className="h-20 md:h-24 w-full" />

      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <header className="mb-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4">
            <button
              onClick={() => window.history.back()}
              className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-blue-500 transition-all"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              {t.homeButtonText}
            </button>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter">
              {t.heading.split(" ")[0]}{" "}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                {t.heading.split(" ")[1] || ""}
              </span>
            </h1>
            <p className="text-slate-500 dark:text-gray-400 max-w-lg text-lg font-medium leading-relaxed">
              {t.subheading}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 p-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2rem] backdrop-blur-xl shadow-2xl shadow-blue-500/5">
            <div className="relative w-full sm:w-auto">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full sm:w-48 pl-11 pr-10 py-3 bg-transparent text-sm font-bold outline-none appearance-none cursor-pointer"
              >
                {languages.map((lang) => (
                  <option
                    key={lang}
                    value={lang}
                    className="bg-white dark:bg-[#111]"
                  >
                    {lang}
                  </option>
                ))}
              </select>
              <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 rotate-90 text-slate-400 pointer-events-none" />
            </div>

            <button
              onClick={handleGetNews}
              disabled={loading}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-black text-sm rounded-2xl transition-all shadow-lg shadow-blue-600/30 active:scale-95"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Newspaper className="w-4 h-4" />
              )}
              {loading ? t.loadingText : t.buttonText}
            </button>
          </div>
        </header>

        {/* Main Feed */}
        <main className="min-h-[500px]">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-[400px] rounded-[2.5rem] bg-slate-200/50 dark:bg-white/5 animate-pulse border border-slate-200 dark:border-white/10"
                />
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mb-6">
                <AlertCircle className="w-10 h-10 text-red-500" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Sync Interrupted</h3>
              <p className="text-slate-500 dark:text-gray-400 mb-8 max-w-xs mx-auto">
                {error}
              </p>
              <button
                onClick={handleGetNews}
                className="flex items-center gap-2 px-6 py-3 bg-slate-200 dark:bg-white/10 rounded-xl font-bold hover:bg-slate-300 transition-all"
              >
                <RefreshCcw className="w-4 h-4" /> Retry
              </button>
            </div>
          ) : articles.length > 0 ? (
            <div className="space-y-16">
              {/* Section Divider with Kinetic Line */}
              <div className="relative flex items-center justify-center py-4">
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-slate-300 dark:via-blue-500/30 to-transparent" />
                </div>
                <div className="relative flex flex-col items-center bg-slate-50 dark:bg-[#0a0a0a] px-8 transition-colors duration-500">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                    <span className="text-[11px] font-black uppercase tracking-[0.5em] text-blue-600 dark:text-blue-400">
                      {t.responseTitle}
                    </span>
                  </div>
                  <div className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    Live Verification Active
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pb-32">
                {articles.map((article, i) => (
                  <article
                    key={i}
                    className="group relative flex flex-col bg-white dark:bg-[#0f1115] border border-slate-200 dark:border-white/[0.06] rounded-[3rem] p-9 transition-all duration-700 hover:-translate-y-4 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] overflow-hidden"
                  >
                    {/* The "Neural" Glow Overlay */}
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-600/5 blur-[100px] group-hover:bg-blue-600/20 transition-all duration-700" />
                    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-cyan-600/5 blur-[100px] group-hover:bg-cyan-600/20 transition-all duration-700" />

                    {/* Header: Source and Date */}
                    <div className="flex items-center justify-between mb-10 relative z-10">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
                          {article.source || "Verified Source"}
                        </span>
                        <div className="h-0.5 w-6 bg-blue-600/40 rounded-full" />
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase">
                          <Calendar className="w-3 h-3" />
                          {new Date(
                            article.date || Date.now(),
                          ).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="relative z-10 flex-grow">
                      <h3 className="text-2xl font-black mb-6 leading-[1.15] text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors duration-300">
                        {article.title}
                      </h3>

                      <div className="relative">
                        {/* Elegant Side Border for Quote-style feeling */}
                        <div className="absolute -left-4 top-0 bottom-0 w-[2px] bg-gradient-to-b from-blue-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <p className="text-slate-500 dark:text-slate-400 text-[15px] leading-relaxed font-medium line-clamp-4 group-hover:line-clamp-none transition-all duration-500">
                          {article.description ||
                            article.content?.substring(0, 160) ||
                            "Comprehensive medical analysis and breakthrough data awaiting retrieval..."}
                        </p>
                      </div>
                    </div>

                    {/* Interactive Footer */}
                    <div className="mt-12 relative z-10">
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/link flex items-center justify-between w-full p-5 bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.05] rounded-[2rem] transition-all duration-300 hover:bg-blue-600 hover:border-blue-600"
                      >
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-600 dark:text-slate-300 group-hover/link:text-white transition-colors">
                          {t.readMore}
                        </span>
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-white/10 group-hover/link:bg-white/20 text-blue-600 dark:text-blue-400 group-hover/link:text-white transition-all duration-300 shadow-sm">
                          <ExternalLink className="w-4 h-4 group-hover/link:scale-110 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 transition-transform" />
                        </div>
                      </a>
                    </div>

                    {/* Subtle Index Number (Watermark) */}
                    <span className="absolute bottom-6 right-10 text-[60px] font-black text-slate-900/[0.03] dark:text-white/[0.02] pointer-events-none select-none transition-all group-hover:text-blue-600/5">
                      {i + 1 < 10 ? `0${i + 1}` : i + 1}
                    </span>
                  </article>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center space-y-8">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full animate-pulse" />
                <div className="w-24 h-24 bg-white dark:bg-white/5 rounded-[2.5rem] flex items-center justify-center border border-slate-200 dark:border-white/10 relative backdrop-blur-sm">
                  <Search className="w-10 h-10 text-slate-300 dark:text-gray-500" />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-black">Stay Ahead.</h2>
                <p className="text-slate-500 dark:text-gray-400 max-w-xs mx-auto text-sm font-medium">
                  Select your language above to fetch the latest global medical
                  intelligence.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
