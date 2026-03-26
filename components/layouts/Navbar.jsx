"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Menu,
  X,
  ChevronRight,
  Settings,
  UserCircle,
  Activity,
  LogOut, 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
 import { signOut } from "next-auth/react";

const navLinks = [
  { name: "Home", href: "/home" },
  { name: "Mitra AI", href: "/ai-mitra" },
  { name: "Mitra Connect", href: "/nearby-doctors" },
  { name: "AarogyaMap", href: "/arogya-map" },
  { name: "Mitra Pulse", href: "/news" },
];

const greetings = ["Hello", "नमस्ते", "নমস্কার", "வணக்கம்", "नमस्कार"];

export default function Navbar() {
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    const interval = setInterval(() => {
      setGreetingIndex((prev) => (prev + 1) % greetings.length);
    }, 4000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-500 ease-in-out px-4 sm:px-8 py-4 ${
        scrolled ? "sm:py-3" : "sm:py-6"
      }`}
    >
      <div
        className={`mx-auto max-w-7xl transition-all duration-500 rounded-[2rem] border flex items-center justify-between px-6 py-3 ${
          scrolled
            ? "bg-white/80 dark:bg-[#030303]/70 backdrop-blur-2xl border-neutral-200 dark:border-white/10 shadow-2xl shadow-blue-500/10"
            : "bg-transparent border-transparent"
        }`}
      >
        {/* Logo Section */}
        <Link href="/hero" className="group flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-neutral-200/50 bg-white/50 backdrop-blur-md transition-all duration-500 group-hover:scale-110 dark:border-white/10 dark:bg-white/5 shadow-sm">
            <Activity className="w-5 h-5 text-blue-500 transition-transform duration-500 group-hover:rotate-12" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-baseline gap-0.5">
              <span className="text-lg font-bold tracking-tighter text-neutral-900 dark:text-white transition-colors duration-300">
                Gram
              </span>
              <span className="text-lg font-light tracking-tighter text-neutral-500 dark:text-neutral-400 transition-all duration-300 group-hover:text-blue-500">
                Aarogya
              </span>
            </div>
            <div className="relative h-3 overflow-hidden">
              <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-neutral-400 transition-all duration-500 group-hover:-translate-y-full">
                Rural Care
              </p>
              <p className="absolute top-0 text-[8px] font-bold uppercase tracking-[0.3em] text-blue-500 translate-y-full transition-all duration-500 group-hover:translate-y-0">
                Precision
              </p>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 bg-neutral-100/50 dark:bg-white/5 p-1 rounded-2xl border border-neutral-200 dark:border-white/5">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="relative px-5 py-2 text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400 transition-all hover:text-blue-500 dark:hover:text-white rounded-xl hover:bg-white dark:hover:bg-white/5 group"
            >
              {link.name}
              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-blue-500 transition-all group-hover:w-4" />
            </Link>
          ))}
        </nav>

        {/* Action Buttons: Greeting, Settings, Profile, Logout */}
        <div className="flex items-center gap-3">
          {/* Animated Greeting */}
          <div className="hidden md:flex items-center px-4 py-2 bg-blue-500/5 rounded-full border border-blue-500/10 h-9 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.span
                key={greetingIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-[10px] font-black uppercase tracking-widest text-blue-500"
              >
                {greetings[greetingIndex]}
              </motion.span>
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/settings" className="hidden sm:block">
              <button className="p-2.5 rounded-xl border border-neutral-200 dark:border-white/10 text-neutral-500 hover:text-blue-500 hover:bg-blue-500/5 transition-all">
                <Settings size={18} />
              </button>
            </Link>

            <Link href="/profile">
              <button className="flex items-center gap-2 p-1 pr-3 rounded-xl border border-blue-500/20 bg-blue-500/5 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 transition-all">
                <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center text-white">
                  <UserCircle size={18} />
                </div>
                <span className="text-xs font-bold uppercase tracking-tighter">
                  Profile
                </span>
              </button>
            </Link>

            {/* Desktop Logout Button */}
            <button
              onClick={handleLogout}
              className="hidden md:flex p-2.5 rounded-xl border border-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300"
              title="Logout"
            >
              <LogOut size={18} />
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/5 text-neutral-900 dark:text-white lg:hidden"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="absolute top-full left-0 w-full px-4 mt-2 lg:hidden"
          >
            <div className="bg-white dark:bg-[#0a0a0a] backdrop-blur-3xl border border-neutral-200 dark:border-white/10 rounded-[2rem] p-4 shadow-2xl overflow-hidden">
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-between p-4 rounded-2xl bg-neutral-50 dark:bg-white/5 text-neutral-600 dark:text-neutral-300 hover:text-blue-500 transition-all border border-transparent hover:border-blue-500/20"
                  >
                    <span className="text-sm font-bold uppercase tracking-widest">
                      {link.name}
                    </span>
                    <ChevronRight size={16} />
                  </Link>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4">
                <Link
                  href="/settings"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-neutral-100 dark:bg-white/5 text-xs font-bold uppercase tracking-widest"
                >
                  <Settings size={14} /> Settings
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-blue-500 text-white text-xs font-bold uppercase tracking-widest"
                >
                  <UserCircle size={14} /> Profile
                </Link>
              </div>

              {/* Mobile Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full mt-2 flex items-center justify-center gap-2 p-4 rounded-2xl bg-red-500/10 text-red-500 text-xs font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
              >
                <LogOut size={14} /> Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
