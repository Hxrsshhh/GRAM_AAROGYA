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
    fireOneTimeToast("logoutSuccess", "Logged Out Successfully");
    fireOneTimeToast("AccountDeleted", "Account Deleted Successfully");
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: MapPin,
      title: "Precision Mapping",
      description:
        "Pinpoint city issues with meter-accurate gesopatial tracking.",
    },
    {
      icon: Zap,
      title: "Instant Dispatch",
      description:
        "AI-driven categorization that routes reports to the right team in milliseconds.",
    },
    {
      icon: BarChart3,
      title: "Public Accountability",
      description:
        "Transport dashboard that prove to the community exactly where work is getting done.",
    },
    {
      icon: Shield,
      title: "Secure Identity",
      description:
        "Advanced zero knowledge protocols that verify residency without compromising personal data.",
    },
    {
      icon: Users,
      title: "Smart Prioritization",
      description:
        "Community voted tools to ensure the most urgent city needs are fixed first.",
    },
    {
      icon: Navigation,
      title: "Route Optimization",
      description:
        "Algorithmic dispatch that cuts travel times and maximizes crew efficiency.",
    },
  ];

  const accordionItems = [
    {
      icon: BookOpen,
      title: "The Civic Blueprint",
      content:
        "The core framework for city management believe in radical transparency where every minute of city work is accountable to the citizens it serves.",
    },
    {
      icon: Scale,
      title: "Regulatory Framework",
      content:
        "Our platform is fully under  General Data Protection Regulation act and local ordinance compliant, ensuring every action meets local laws.",
    },
    {
      icon: FileText,
      title: "Seamless Integration",
      content:
        "Open-source APIs allow seamless integration with existing smart city infrastructure and IoT sensor networks , connecting your existing tools into none hub.",
    },
    {
      icon: HelpCircle,
      title: "Onboarding & Support",
      content:
        "Dedicated community managers help organize local neighborhood watch and civic engagement groups, the human side of getting your team ready.",
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
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute top-full left-0 right-0 z-50 overflow-hidden bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 lg:hidden"
            >
              <nav className="flex flex-col gap-2 p-6">
                {[
                  { name: "Features", href: "#" },
                  { name: "Impact", href: "#" },
                  { name: "Docs", href: "#" },
                ].map((item, idx) => (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 + idx * 0.1 }}
                    className="group flex items-center justify-between py-3 text-lg font-medium text-slate-600 dark:text-slate-300 transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    {item.name}
                    <span className="opacity-0 transition-transform group-hover:translate-x-1 group-hover:opacity-100">
                      →
                    </span>
                  </motion.a>
                ))}

                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="pt-4"
                >
                  <Link href="/signup">
                    <Button className="w-full py-3  text-lg shadow-lg shadow-blue-500/20 active:scale-95 transition-transform">
                      Join the Pulse
                    </Button>
                  </Link>
                </motion.div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-28 md:pt-60 pb-20 md:pb-28 overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-500">
        {/* 1. Refined Ambient Lighting - Adjusted for both modes */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[450px] bg-emerald-500/10 dark:bg-emerald-500/10 blur-[120px] rounded-full opacity-60 pointer-events-none" />
        <div className="absolute top-20 right-[10%] w-[300px] h-[300px] bg-cyan-500/10 dark:bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            style={{ scale: heroScale, opacity: heroOpacity }}
            className="max-w-5xl"
          >
            {/* 2. Enhanced Floating Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-100/80 dark:bg-slate-900/50 border border-emerald-500/20 dark:border-emerald-500/30 backdrop-blur-xl text-emerald-600 dark:text-emerald-400 text-[11px] font-bold uppercase tracking-[0.15em] mb-8 shadow-sm dark:shadow-inner dark:shadow-emerald-500/10"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Revolutionizing Governance
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
              }}
            >
              {/* 3. Heading - Dynamic Text Colors */}
              <motion.h1
                variants={{
                  hidden: { opacity: 0, y: 25 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
                  },
                }}
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.95] md:leading-[0.9] tracking-tighter mb-8 text-slate-900 dark:text-white"
              >
                Powering Transparent <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-br from-emerald-600 via-emerald-500 to-cyan-500 dark:from-emerald-500 dark:via-emerald-300 dark:to-cyan-400 drop-shadow-sm">
                  City Governance.
                </span>
              </motion.h1>

              {/* 4. Tagline */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, x: -15 },
                  visible: { opacity: 1, x: 0 },
                }}
                className="flex items-center gap-5 mb-8"
              >
                <p className="text-xl md:text-2xl font-light text-slate-600 dark:text-slate-400 tracking-tight">
                  Your city.{" "}
                  <span className="font-semibold text-slate-900 dark:text-white">
                    Your voice.
                  </span>
                  <span className="hidden sm:inline-flex items-center justify-center w-1.5 h-1.5 rounded-full bg-emerald-500/40 mx-3" />
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                    Real change.
                  </span>
                </p>
                <div className="h-[1px] flex-grow bg-gradient-to-r from-emerald-500/30 via-emerald-500/5 to-transparent hidden md:block" />
              </motion.div>

              {/* 5. Supporting Description */}
              <motion.p
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl font-medium leading-relaxed"
              >
                Connecting communities and government through{" "}
                <span className="text-slate-900 dark:text-white border-b border-emerald-500/30">
                  instant reporting
                </span>{" "}
                and data-driven optimization.
              </motion.p>

              {/* 6. Action Buttons */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-4 w-full max-w-md sm:max-w-none"
              >
                <Link href="/signup" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="group w-full h-14 px-8 bg-emerald-600 hover:bg-emerald-500 text-white border-none transition-all duration-300 hover:shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] active:scale-95"
                  >
                    <span className="relative flex items-center justify-center font-semibold tracking-wide">
                      Join the Pulse
                      <ArrowRight
                        size={20}
                        className="ml-2 group-hover:translate-x-1.5 transition-transform duration-300"
                      />
                    </span>
                  </Button>
                </Link>

                <Link href="/signin" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full h-14 px-8 border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/40 backdrop-blur-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200 transition-all duration-300 active:scale-95"
                  >
                    <span className="font-semibold tracking-wide">
                      Activate Pulse
                    </span>
                  </Button>
                </Link>
              </motion.div>
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
