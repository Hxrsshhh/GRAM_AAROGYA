"use client";

import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import {
  Menu,
  X,
  Sun,
  Moon,
  Activity,
  ChevronRight,
  User,
  LogOut,
  Settings,
  LayoutDashboard,
  Globe,
  Info,
  Zap,
  Phone
} from "lucide-react";
import Button from "@/components/ui/Button";

const Navbar = ({ onNavigate = () => {} }) => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);

  /* ---------------- LOGIC ---------------- */

  useEffect(() => {
    setMounted(true);
    const onScroll = () => {
      if (!isOpen) setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", onScroll);
    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
  }, [isOpen]);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  // New Navigation Links
  const navLinks = [
    { label: "Dashboard", icon: Zap, action: () => onNavigate("solutions") },
    { label: "Issues", icon: Globe, action: () => onNavigate("community") },
    { label: "Report New Issue", icon: Info, action: () => onNavigate("about") },
  ];

  const userMenuItems = [
    { label: "Dashboard", icon: LayoutDashboard, action: () => onNavigate("dashboard") },
    { label: "Profile", icon: User, action: () => onNavigate("profile") },
    { label: "Settings", icon: Settings, action: () => onNavigate("settings") },
  ];

  /* ---------------- UI ---------------- */

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ease-in-out ${
        scrolled || isOpen
          ? "bg-white/80 dark:bg-slate-950/80 backdrop-blur-md py-3 border-b border-slate-200/60 dark:border-slate-800/60 shadow-sm"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-[86rem] mx-auto px-6 lg:px-12 flex items-center justify-between">
        
        {/* Left: Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer group shrink-0"
          onClick={() => {
            setIsOpen(false);
            onNavigate("home");
          }}
        >
          <div className="relative">
            <div className="absolute -inset-1 bg-emerald-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
            <div className="relative w-10 h-10 bg-slate-900 dark:bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
              <Activity className="text-white w-5 h-5" />
            </div>
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white hidden sm:block">
            Civic<span className="text-emerald-600 dark:text-emerald-400">Pulse</span>
          </span>
        </div>

        {/* Center: Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-1 bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50 p-1 rounded-2xl backdrop-blur-sm">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={link.action}
              className="px-5 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-all"
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 relative shrink-0">
          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="hidden sm:flex w-10 h-10 items-center justify-center rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-emerald-500 transition-colors shadow-sm"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Desktop Profile */}
          <div className="relative hidden md:block" ref={profileMenuRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1.5 pr-4 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-md transition-all active:scale-95"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white font-bold text-xs shadow-inner">
                JD
              </div>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Account</span>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-4 w-60 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-1.5">
                  {userMenuItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => { setShowProfileMenu(false); item.action(); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                    >
                      <item.icon className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.label}</span>
                    </button>
                  ))}
                </div>
                <div className="p-1.5 border-t border-slate-100 dark:border-slate-800">
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors font-medium text-sm">
                    <LogOut className="w-4 h-4" /> Log Out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 bg-white dark:bg-slate-950 z-[90] lg:hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full"
        }`}
        style={{ paddingTop: "80px" }}
      >
        <div className="p-8 flex flex-col h-full overflow-y-auto">
          {/* Mobile Nav Links Section */}
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">Navigation</p>
          <div className="grid grid-cols-2 gap-3 mb-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => { setIsOpen(false); link.action(); }}
                className="flex flex-col items-start gap-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-emerald-500 transition-all"
              >
                <link.icon className="w-5 h-5 text-emerald-500" />
                <span className="font-bold text-sm text-slate-700 dark:text-slate-200">{link.label}</span>
              </button>
            ))}
          </div>

          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">Account</p>
          <div className="space-y-3">
            {userMenuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => { setIsOpen(false); item.action(); }}
                className="w-full flex justify-between items-center p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <item.icon className="w-5 h-5 text-slate-400 group-hover:text-emerald-500" />
                  <span className="font-bold text-slate-700 dark:text-slate-200">{item.label}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:translate-x-1 transition-transform" />
              </button>
            ))}
          </div>

          <div className="mt-auto pt-10 pb-8">
            <Button variant="outline" className="w-full py-7 border-red-100 dark:border-red-900/30 text-red-500 bg-red-50/30 rounded-2xl font-bold">
              <LogOut className="w-5 h-5 mr-3" /> Log Out
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;