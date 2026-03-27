"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
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
  { name: "Find Med", href: "/search-medicine" },
  { name: "Med Scanner", href: "/scanner" },
  { name: "Mitra Connect", href: "/nearby-doctors" },
  { name: "AarogyaMap", href: "/arogya-map" },
  { name: "Mitra Pulse", href: "/news" },
];

const greetings = ["Hello", "नमस्ते", "নমস্কার", "வணக்கம்", "नमस्कार"];

export default function Navbar() {
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

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
      className={`fixed top-0 z-50 w-full transition-all duration-500 ease-in-out px-4 sm:px-6 py-4 ${
        scrolled ? "sm:py-3" : "sm:py-5"
      }`}
    >
      <div
        className={`mx-auto max-w-7xl transition-all duration-500 rounded-[2.5rem] border flex items-center justify-between px-4 py-2 ${
          scrolled
            ? "bg-white/70 dark:bg-[#030303]/70 backdrop-blur-2xl border-neutral-200 dark:border-white/10 shadow-2xl shadow-blue-500/5"
            : "bg-transparent border-transparent"
        }`}
      >
        {/* Logo Section */}
        <Link href="/" className="group flex items-center gap-3 pl-2">
          <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl border border-blue-500/20 bg-blue-500/10 transition-all duration-500 group-hover:bg-blue-500 group-hover:rotate-[10deg]">
            <Activity className="w-5 h-5 text-blue-600 transition-colors duration-500 group-hover:text-white" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-baseline gap-0.5 leading-none">
              <span className="text-lg font-black tracking-tight text-neutral-900 dark:text-white">
                Gram
              </span>
              <span className="text-lg font-medium tracking-tight text-blue-500">
                Aarogya
              </span>
            </div>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500">
              Rural Precision
            </p>
          </div>
        </Link>

        {/* Enhanced Desktop Navigation */}
        <nav className="hidden xl:flex items-center bg-neutral-100/80 dark:bg-white/5 p-1.5 rounded-full border border-neutral-200/50 dark:border-white/5">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative px-4 py-2 text-[11px] font-bold uppercase tracking-wider transition-colors duration-300 rounded-full ${
                  isActive
                    ? "text-blue-600 dark:text-white"
                    : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 bg-white dark:bg-blue-600 shadow-sm rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Animated Greeting - Cleaner look */}
          <div className="hidden lg:flex items-center px-4 py-2 bg-neutral-100/50 dark:bg-white/5 rounded-full border border-neutral-200/50 dark:border-white/5 h-10 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.span
                key={greetingIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400"
              >
                {greetings[greetingIndex]}
              </motion.span>
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-1.5">
            <Link href="/settings" className="hidden sm:block">
              <button className="p-2.5 rounded-2xl border border-neutral-200 dark:border-white/10 text-neutral-500 hover:bg-white dark:hover:bg-white/5 transition-all">
                <Settings size={18} />
              </button>
            </Link>

            <Link href="/profile">
              <button className="flex items-center gap-2.5 p-1 pr-4 rounded-2xl border border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 transition-all">
                <div className="w-8 h-8 rounded-xl bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                  <UserCircle size={20} />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider hidden md:block">
                  Profile
                </span>
              </button>
            </Link>

            <button
              onClick={handleLogout}
              className="hidden md:flex p-2.5 rounded-2xl border border-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300"
              title="Logout"
            >
              <LogOut size={18} />
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/5 text-neutral-900 dark:text-white xl:hidden"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Improved Spacing & Icons */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 w-full px-4 mt-3 xl:hidden"
          >
            <div className="bg-white dark:bg-[#0a0a0a] backdrop-blur-3xl border border-neutral-200 dark:border-white/10 rounded-[2.5rem] p-3 shadow-2xl">
              <div className="grid grid-cols-1 gap-1.5">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-between p-4 rounded-[1.5rem] bg-neutral-50 dark:bg-white/5 text-neutral-600 dark:text-neutral-300 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-600 transition-all"
                  >
                    <span className="text-xs font-bold uppercase tracking-widest">
                      {link.name}
                    </span>
                    <ChevronRight size={16} className="opacity-50" />
                  </Link>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2 mt-3">
                <Link
                  href="/settings"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-neutral-100 dark:bg-white/5 text-[10px] font-bold uppercase tracking-widest"
                >
                  <Settings size={14} /> Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-red-500/10 text-red-600 text-[10px] font-bold uppercase tracking-widest"
                >
                  <LogOut size={14} /> Logout
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}