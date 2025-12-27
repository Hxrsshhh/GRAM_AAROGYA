'use client'

import React, { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  MapPin,
  BarChart3,
  Shield,
  Zap,
  Users,
  Navigation,
  BookOpen,
  Scale,
  FileText,
  HelpCircle,
  Activity,
  ArrowRight,
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react";

import MouseGlow from "@/components/ui/MouseGlow";
import Button from "@/components/ui/Button";
import Accordion from "@/components/ui/Accordion";
import FeatureCard from "@/components/ui/FeatureCard";
import { useTheme } from "next-themes";
import Link from "next/link";

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState(0);
  const [mounted, setMounted] = useState(false);
  
  const { setTheme, resolvedTheme } = useTheme();

  // Prevent Hydration Mismatch (Crucial for Turbopack & Next.js)
  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    { icon: MapPin, title: "Hyper-Local Data", description: "Precise geo-spatial tracking that maps issues down to the specific meter of pavement." },
    { icon: Zap, title: "Edge Processing", description: "Instant AI categorization ensuring your report reaches the specific department in milliseconds." },
    { icon: BarChart3, title: "Impact Analytics", description: "Real-time civic dashboards that show the community exactly where progress is being made." },
    { icon: Shield, title: "Privacy First", description: "Zero-knowledge verification protocols that protect your identity while verifying your residence." },
    { icon: Users, title: "Consensus Building", description: "Voted-based prioritization tools that ensure the most critical needs get addressed first." },
    { icon: Navigation, title: "Smart Routing", description: "Dynamic dispatch algorithms that optimize city crew routes for maximum efficiency." },
  ];

  const accordionItems = [
    { icon: BookOpen, title: "The Civic Manifesto", content: "We believe in radical transparency where every dollar and every minute of city work is accountable to the citizens it serves." },
    { icon: Scale, title: "Regulatory Compliance", content: "Our platform is fully GDPR and local ordinance compliant, ensuring legally protected whistleblower paths for sensitive reports." },
    { icon: FileText, title: "Interoperability", content: "Open-source APIs allow seamless integration with existing smart city infrastructure and IoT sensor networks." },
    { icon: HelpCircle, title: "Onboarding & Support", content: "Dedicated community managers help organize local neighborhood watch and civic engagement groups." },
  ];

  const { scrollYProgress } = useScroll();
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  // Helper to toggle theme
  const handleThemeToggle = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  // Avoid rendering theme-specific UI until mounted to prevent hydration errors
  if (!mounted) return <div className="min-h-screen bg-slate-950" />;

  return (
    <div className={`min-h-screen transition-colors duration-500 ${resolvedTheme === 'dark' ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      <MouseGlow />

      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
          scrolled || isOpen
            ? "bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl py-4 border-b border-slate-200 dark:border-slate-800"
            : "bg-transparent py-8"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src='/logo.png' className="h-12 w-12" />
            <span className="text-xl font-black tracking-tight">
              Civic<span className="text-emerald-600">Pulse</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8 font-bold text-sm uppercase tracking-widest text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-4 pl-4 border-l border-slate-200 dark:border-slate-800">
              <button onClick={handleThemeToggle} className="p-2 hover:text-emerald-500 transition-colors">
                {resolvedTheme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            <Link href='/signup'>  <Button size="sm">Get Started</Button></Link>
            </div>
          </div>

          {/* Mobile Toggle */}
          <button className="lg:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 right-0 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 p-6 lg:hidden"
            >
              <div className="flex flex-col gap-6">
                <a href="#" className="text-xl font-bold">Features</a>
                <a href="#" className="text-xl font-bold">Impact</a>
                <a href="#" className="text-xl font-bold">Docs</a>
                 <Link href='/signup'>  <Button className="w-full">Get Started</Button></Link>
                <Button variant="outline" onClick={handleThemeToggle} className="flex items-center gap-2 font-bold py-4">
                  {resolvedTheme === 'dark' ? <><Sun size={20} /> Light Mode</> : <><Moon size={20} /> Dark Mode</>}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-44 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-emerald-500/10 blur-[120px] rounded-full opacity-50 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div style={{ scale: heroScale, opacity: heroOpacity }} className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-widest mb-8"
            >
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Revolutionizing Governance
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-[8rem] font-black leading-[0.85] tracking-tighter mb-10"
            >
              The OS for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-emerald-400 to-cyan-500">
                Livable Cities.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 mb-12 max-w-2xl font-medium leading-relaxed"
            >
              Close the feedback loop between administration and community. 
              Real-time reporting, transparent tracking, and AI-driven urban optimization.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap gap-4"
            >
              <Button size="lg">
                Deploy Pulse
                <ArrowRight size={20} className="ml-2" />
              </Button>
              <Button variant="outline" size="lg">Explore Network</Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Scrolling Tape */}
      <div className="relative py-14 bg-emerald-600 overflow-hidden shadow-2xl z-20">
        <div className="flex whitespace-nowrap animate-infinite-scroll">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-12 px-6">
              {["12,000 Reports Resolved", "150+ Cities Active", "89% Faster Response", "Citizen Verified"].map((text, idx) => (
                <div key={idx} className="flex items-center gap-12 text-white text-3xl font-black uppercase tracking-tighter italic">
                  {text} <div className="w-3 h-3 bg-white rounded-full opacity-30" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-20 text-center lg:text-left">
            <h2 className="text-emerald-500 font-black uppercase tracking-[0.3em] text-sm mb-4">Core Infrastructure</h2>
            <h3 className="text-4xl md:text-7xl font-black tracking-tighter">Everything you need <br /> to run a city.</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => <FeatureCard key={i} {...f} index={i} />)}
          </div>
        </div>
      </section>

      {/* Knowledge Hub */}
      <section className="py-32 bg-slate-100/50 dark:bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-emerald-500 font-black uppercase tracking-[0.3em] text-sm mb-4">Deep Learning</h2>
              <h3 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-none">
                Transparent <br /> By Design.
              </h3>
              <p className="text-xl text-slate-500 dark:text-slate-400 mb-10 max-w-md">
                Our architecture is built on open standards, ensuring that data is never siloed and always verifiable by the public.
              </p>
              <div className="p-8 rounded-3xl bg-emerald-600 text-white flex items-center justify-between shadow-2xl shadow-emerald-600/30">
                <div>
                  <span className="text-xs font-black uppercase tracking-widest opacity-60">Uptime Status</span>
                  <div className="text-2xl font-black">99.9% Operational</div>
                </div>
                <Activity size={40} className="animate-pulse opacity-40" />
              </div>
            </div>
            <Accordion items={accordionItems} activeIndex={activeAccordion} onItemClick={setActiveAccordion} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-32 pb-16 px-6 border-t border-slate-200 dark:border-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
                  <Activity className="text-white" />
                </div>
                <span className="text-2xl font-black tracking-tighter">CivicPulse</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                Building the digital trust layer for the physical world.
              </p>
            </div>
            {['Product', 'Community', 'Resources'].map((title) => (
              <div key={title}>
                <h5 className="font-black uppercase tracking-widest text-emerald-500 text-xs mb-6">{title}</h5>
                <ul className="space-y-4 font-bold text-slate-400">
                  <li><a href="#" className="hover:text-emerald-500 transition-colors">Platform</a></li>
                  <li><a href="#" className="hover:text-emerald-500 transition-colors">Security</a></li>
                  <li><a href="#" className="hover:text-emerald-500 transition-colors">API Docs</a></li>
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-8 border-t border-slate-200 dark:border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-sm font-bold">
            <p>© 2025 CivicPulse. All rights reserved.</p>
            <div className="flex gap-8">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Using standard Tailwind or a separate CSS file is better, but here it is fixed */}
      <style jsx global>{`
        @keyframes infinite-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-infinite-scroll {
          animation: infinite-scroll 40s linear infinite;
        }
      `}</style>
    </div>
  );
}