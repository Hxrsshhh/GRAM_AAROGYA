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
  Info,
  AlertCircle,
} from "lucide-react";

// Translations mapping
const translations = {
  English: {
    heading: "Health News",
    subheading: "Stay updated with the latest medical breakthroughs and health tips.",
    placeholder: "Select a language...",
    buttonText: "Get News",
    loadingText: "Fetching news...",
    responseTitle: "Top Stories",
    homeButtonText: "Back to Home",
    readMore: "Read Full Article",
  },
  Hindi: {
    heading: "स्वास्थ्य समाचार",
    subheading: "नवीनतम चिकित्सा सफलताओं और स्वास्थ्य युक्तियों के साथ अपडेट रहें।",
    placeholder: "भाषा चुनें...",
    buttonText: "समाचार प्राप्त करें",
    loadingText: "समाचार लोड हो रहे हैं...",
    responseTitle: "मुख्य समाचार",
    homeButtonText: "होम पेज पर वापस जाएं",
    readMore: "पूरा पढ़ें",
  },
  // ... adding Gujarati, Bengali, Marathi, Tamil logic below in the component for brevity
};

const languages = [
  "English", "Hindi", "Marathi", "Bengali", "Tamil", 
  "Telugu", "Gujarati", "Punjabi", "Malayalam", "Kannada", "Odia",
];

export default function Page() {
  const [language, setLanguage] = useState("English");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Memoize translation to prevent recalculation on every render
  const t = useMemo(() => {
    const found = translations[language];
    if (found) return found;
    // Fallback logic for languages not fully translated yet
    return translations["English"];
  }, [language]);

  const handleGetNews = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to connect to the news server.");
      }

      const data = await res.json();

      if (data.articles && data.articles.length > 0) {
        setArticles(data.articles);
      } else {
        setError("No news found for the selected language at this moment.");
        setArticles([]);
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 font-sans selection:bg-blue-500/30 overflow-x-hidden">




      {/* Background Decorative Blobs */}
      <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full -z-10 animate-pulse" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto p-6 lg:pt-26">
        {/* Header Section */}
        <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <button
              onClick={() => window.history.back()}
              className="group flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              {t.homeButtonText}
            </button>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white">
              {t.heading.split(" ")[0]}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                {t.heading.split(" ")[1] || ""}
              </span>
            </h1>
            <p className="text-gray-400 max-w-xl text-lg leading-relaxed">
              {t.subheading}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch gap-4 w-full md:w-auto">
            <div className="relative group">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full sm:w-52 pl-11 pr-10 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer hover:bg-white/10 backdrop-blur-md"
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang} className="bg-[#111] text-white">
                    {lang}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                <ChevronRight className="w-4 h-4 rotate-90" />
              </div>
            </div>
            
            <button
              onClick={handleGetNews}
              disabled={loading}
              className="group relative flex items-center justify-center gap-3 px-10 py-3.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold rounded-2xl transition-all shadow-xl shadow-blue-500/25 active:scale-[0.98]"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Newspaper className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              )}
              {loading ? t.loadingText : t.buttonText}
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="min-h-[400px]">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 rounded-2xl bg-white/5 animate-pulse border border-white/5" />
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-500/5 border border-red-500/20 rounded-3xl p-12 text-center max-w-2xl mx-auto backdrop-blur-sm">
              <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Something went wrong</h3>
              <p className="text-gray-400 mb-8 leading-relaxed">{error}</p>
              <button
                onClick={handleGetNews}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white font-semibold transition-all"
              >
                <RefreshCcw className="w-4 h-4" />
                Retry Search
              </button>
            </div>
          ) : articles.length > 0 ? (
            <div className="space-y-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-8 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full" />
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    {t.responseTitle}
                  </h2>
                </div>
                <div className="px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold">
                  {articles.length} Articles
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map((article, i) => (
                  <article
                    key={i}
                    className="group flex flex-col bg-white/[0.03] border border-white/5 rounded-[2rem] p-7 hover:bg-white/[0.06] hover:border-blue-500/30 transition-all duration-500 hover:-translate-y-2 relative"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-[11px] font-black uppercase tracking-wider text-blue-400 bg-blue-400/10 px-3 py-1 rounded-lg">
                        {article.source || "Medical Journal"}
                      </span>
                      <div className="flex items-center gap-1.5 text-gray-500 text-xs font-medium">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(article.date || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors line-clamp-2 leading-tight">
                      {article.title}
                    </h3>

                    <p className="text-gray-400 text-sm mb-8 line-clamp-3 leading-relaxed flex-grow">
                      {article.description || (article.content ? article.content.substring(0, 120) + "..." : "No description available.")}
                    </p>

                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/link flex items-center justify-center gap-2 w-full py-4 bg-white/5 rounded-2xl text-sm font-bold text-white hover:bg-blue-600 transition-all shadow-lg shadow-black/20"
                    >
                      {t.readMore}
                      <ExternalLink className="w-4 h-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                    </a>
                  </article>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="relative mb-10">
                <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full" />
                <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center border border-white/10 rotate-6 relative backdrop-blur-sm">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Discover Health Updates</h2>
              <p className="text-gray-500 max-w-md mx-auto text-lg">
                Choose your preferred language and hit the button to fetch verified medical news and breakthroughs.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}