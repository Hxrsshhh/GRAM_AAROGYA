"use client";

import React, { useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
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
import { toast } from "sonner";
import { fireOneTimeToast } from "@/lib/oneTimeToast";

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState(0);
  const [mounted, setMounted] = useState(false);

  const { setTheme, resolvedTheme } = useTheme();


  useEffect(() => {
     fireOneTimeToast('logoutSuccess','Logged Out Successfully');
     fireOneTimeToast('AccountDeleted','Account Deleted Successfully');
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: MapPin,
      title: "Hyper-Local Data",
      description:
        "Precise geo-spatial tracking that maps issues down to the specific meter of pavement.",
    },
    {
      icon: Zap,
      title: "Edge Processing",
      description:
        "Instant AI categorization ensuring your report reaches the specific department in milliseconds.",
    },
    {
      icon: BarChart3,
      title: "Impact Analytics",
      description:
        "Real-time civic dashboards that show the community exactly where progress is being made.",
    },
    {
      icon: Shield,
      title: "Privacy First",
      description:
        "Zero-knowledge verification protocols that protect your identity while verifying your residence.",
    },
    {
      icon: Users,
      title: "Consensus Building",
      description:
        "Voted-based prioritization tools that ensure the most critical needs get addressed first.",
    },
    {
      icon: Navigation,
      title: "Smart Routing",
      description:
        "Dynamic dispatch algorithms that optimize city crew routes for maximum efficiency.",
    },
  ];

  const accordionItems = [
    {
      icon: BookOpen,
      title: "The Civic Manifesto",
      content:
        "We believe in radical transparency where every dollar and every minute of city work is accountable to the citizens it serves.",
    },
    {
      icon: Scale,
      title: "Regulatory Compliance",
      content:
        "Our platform is fully GDPR and local ordinance compliant, ensuring legally protected whistleblower paths for sensitive reports.",
    },
    {
      icon: FileText,
      title: "Interoperability",
      content:
        "Open-source APIs allow seamless integration with existing smart city infrastructure and IoT sensor networks.",
    },
    {
      icon: HelpCircle,
      title: "Onboarding & Support",
      content:
        "Dedicated community managers help organize local neighborhood watch and civic engagement groups.",
    },
  ];

  const { scrollYProgress } = useScroll();
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const handleThemeToggle = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  if (!mounted) return <div className="min-h-screen bg-slate-950" />;

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        resolvedTheme === "dark"
          ? "bg-slate-950 text-white"
          : "bg-white text-slate-900"
      }`}
    >
      <MouseGlow />

      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
          scrolled || isOpen
            ? "bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl py-4 border-b border-slate-200 dark:border-slate-800"
            : "bg-transparent py-4 md:py-8"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-emerald-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
              <Activity className="text-white w-4 h-4 md:w-5 md:h-5" />
            </div>
            <span className="text-lg md:text-xl font-black tracking-tight">
              Civic<span className="text-emerald-600">Pulse</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8 font-bold text-sm uppercase tracking-widest text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-4 pl-4 border-l border-slate-200 dark:border-slate-800">
              <button
                onClick={handleThemeToggle}
                className="p-2 hover:text-emerald-500 transition-colors"
              >
                {resolvedTheme === "dark" ? (
                  <Sun size={20} />
                ) : (
                  <Moon size={20} />
                )}
              </button>
              <Link href="/signup">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </div>

          {/* Mobile Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <button onClick={handleThemeToggle} className="p-2 text-slate-500">
              {resolvedTheme === "dark" ? (
                <Sun size={20} />
              ) : (
                <Moon size={20} />
              )}
            </button>
            <button className="p-2" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
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
                <a href="#" className="text-xl font-bold">
                  Features
                </a>
                <a href="#" className="text-xl font-bold">
                  Impact
                </a>
                <a href="#" className="text-xl font-bold">
                  Docs
                </a>
                <Link href="/signup">
                  <Button className="w-full py-6 text-lg">Get Started</Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 md:pt-44 pb-20 md:pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[400px] md:h-[600px] bg-emerald-500/10 blur-[80px] md:blur-[120px] rounded-full opacity-50 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            style={{ scale: heroScale, opacity: heroOpacity }}
            className="max-w-4xl"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] md:text-xs font-black uppercase tracking-widest mb-6 md:mb-8"
            >
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Revolutionizing Governance
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-[8rem] font-black leading-[0.9] md:leading-[0.85] tracking-tighter mb-8 md:mb-10"
            >
              The OS for <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-emerald-400 to-cyan-500">
                Livable Cities.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg md:text-xl lg:text-2xl text-slate-500 dark:text-slate-400 mb-10 md:mb-12 max-w-2xl font-medium leading-relaxed"
            >
              Close the feedback loop between administration and community.
              Real-time reporting, transparent tracking, and AI-driven urban
              optimization.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button size="lg" className="w-full sm:w-auto">
                Deploy Pulse
                <ArrowRight size={20} className="ml-2" />
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Explore Network
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Scrolling Tape */}
      <div className="relative py-8 md:py-14 bg-emerald-600 overflow-hidden shadow-2xl z-20">
        <div className="flex whitespace-nowrap animate-infinite-scroll">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-8 md:gap-12 px-4 md:px-6"
            >
              {[
                "12,000 Reports Resolved",
                "150+ Cities Active",
                "89% Faster Response",
                "Citizen Verified",
              ].map((text, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-8 md:gap-12 text-white text-xl md:text-3xl font-black uppercase tracking-tighter italic"
                >
                  {text}
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-white rounded-full opacity-30" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12 md:mb-20 text-center lg:text-left">
            <h2 className="text-emerald-500 font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-xs mb-4">
              Core Infrastructure
            </h2>
            <h3 className="text-3xl sm:text-4xl md:text-7xl font-black tracking-tighter leading-tight">
              Everything you need <br className="hidden md:block" /> to run a
              city.
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <FeatureCard key={i} {...f} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Knowledge Hub */}
      <section className="py-20 md:py-32 bg-slate-100/50 dark:bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
            <div>
              <h2 className="text-emerald-500 font-black uppercase tracking-[0.3em] text-sm mb-4">
                Deep Learning
              </h2>
              <h3 className="text-3xl md:text-6xl font-black tracking-tighter mb-6 md:mb-8 leading-none">
                Transparent <br /> By Design.
              </h3>
              <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 mb-8 md:mb-10 max-w-md">
                Our architecture is built on open standards, ensuring that data
                is never siloed and always verifiable by the public.
              </p>
              <div className="p-6 md:p-8 rounded-2xl md:rounded-3xl bg-emerald-600 text-white flex items-center justify-between shadow-2xl shadow-emerald-600/30">
                <div>
                  <span className="text-[10px] md:text-xs font-black uppercase tracking-widest opacity-60">
                    Uptime Status
                  </span>
                  <div className="text-xl md:text-2xl font-black">
                    99.9% Operational
                  </div>
                </div>
                <Activity
                  size={32}
                  className="animate-pulse opacity-40 md:w-10 md:h-10"
                />
              </div>
            </div>
            <div className="mt-8 lg:mt-0">
              <Accordion
                items={accordionItems}
                activeIndex={activeAccordion}
                onItemClick={setActiveAccordion}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-16 md:pt-32 pb-8 md:pb-16 px-4 sm:px-6 border-t border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:grid lg:grid-cols-4 gap-10 lg:gap-8 mb-12 md:mb-20">
            {/* Brand Column */}
            <div className="flex flex-col items-center lg:items-start">
              <div className="flex items-center gap-2 mb-4 group cursor-pointer">
                <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:rotate-6 transition-transform duration-300">
                  <Activity className="text-white w-4 h-4" />
                </div>
                <span className="text-lg font-black tracking-tighter text-slate-900 dark:text-white">
                  CivicPulse
                </span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-medium leading-tight max-w-[250px] text-center lg:text-left text-[11px] md:text-sm">
                Building the digital trust layer for the physical world.
              </p>
            </div>

            {/* 3-Column Single Row Mobile Grid */}
            <div className="col-span-3">
              <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-8">
                {[
                  { title: "Product", links: ["Platform", "Security", "Docs"] },
                  { title: "Community", links: ["Events", "Discord", "Forum"] },
                  {
                    title: "Resources",
                    links: ["Network", "Support", "Privacy"],
                  },
                ].map((section) => (
                  <div
                    key={section.title}
                    className="flex flex-col items-center lg:items-start"
                  >
                    <h5 className="font-black uppercase tracking-[0.15em] text-emerald-600 dark:text-emerald-500 text-[9px] md:text-xs mb-3">
                      {section.title}
                    </h5>
                    <ul className="space-y-2 md:space-y-3 font-bold text-slate-400 dark:text-slate-500 text-[10px] md:text-sm">
                      {section.links.map((link) => (
                        <li key={link}>
                          <a
                            href="#"
                            className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors whitespace-nowrap"
                          >
                            {link}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Compact Bottom Bar */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-900/50 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 dark:text-slate-500 text-[9px] font-bold tracking-widest uppercase">
              © 2026 CivicPulse
            </p>
            <div className="flex gap-4 md:gap-6">
              <a
                href="#"
                className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-500 transition-colors"
              >
                Terms
              </a>
              <a
                href="#"
                className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-500 transition-colors"
              >
                Privacy
              </a>
            </div>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes infinite-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        .animate-infinite-scroll {
          animation: infinite-scroll 30s linear infinite;
        }
        @media (max-width: 768px) {
          .animate-infinite-scroll {
            animation-duration: 20s;
          }
        }
      `}</style>
    </div>
  );
}
