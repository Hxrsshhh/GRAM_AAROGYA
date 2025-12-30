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
  Map,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Link from "next/link";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

function getInitials(name) {
  if (!name) return "";

  const parts = name.trim().split(/\s+/);

  if (parts.length === 1) {
    return parts[0][0].toUpperCase();
  }

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const Navbar = ( ) => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);
  const router = useRouter();

  const { data: session } = useSession();

  useEffect(() => {
    setMounted(true);
    const onScroll = () => {
      if (!isOpen) setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", onScroll);

    const handleClickOutside = (e) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(e.target)
      ) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
  }, [isOpen]);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  const navLinks = [
    { label: "Dashboard", icon: Zap, path: "/dashboard" },
    { label: "Issues", icon: Globe, path: "/issues" },
    { label: "Report New Issue", icon: Info, path: "/issues/report" },
    { label: "Map", icon: Map, path: "/map" },
  ];

  const userMenuItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { label: "Profile", icon: User, path: "/profile" },
    { label: "Settings", icon: Settings, path: "/settings" },
  ];

  const handleLogout = async () => {
    await signOut({
      redirect: false,
    });

    router.push("/");
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-500 transition-all duration-300 ease-in-out ${
          scrolled || isOpen
            ? "bg-white/90 dark:bg-slate-950/90 backdrop-blur-md py-3 border-b border-slate-200 dark:border-slate-800 shadow-sm"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-[86rem] mx-auto px-6 lg:px-12 flex items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center gap-3 cursor-pointer group shrink-0 relative z-110">
            <Link href="/">
              {" "}
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
                <Activity className="text-white w-5 h-5" />
              </div>
            </Link>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Civic
              <span className="text-emerald-600 dark:text-emerald-400">
                Pulse
              </span>
            </span>
          </div>

          {/* Center: Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50 p-1 rounded-2xl">
            {navLinks.map((link) => (
              <Link href={`${link.path}`} key={link.label}>
                <button className="px-5 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-all">
                  {link.label}
                </button>
              </Link>
            ))}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3 relative z-110">
            <div className="hidden lg:flex items-center gap-3">
              <button
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-emerald-500 transition-colors shadow-sm"
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 p-1.5 pr-4 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-all active:scale-95"
                >
                  <div className="w-8 h-8 rounded-full  flex bg-emerald-500 items-center justify-center text-white font-bold text-xs">
                    {getInitials(`${session?.user.name}`)}
                  </div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Account
                  </span>
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-4 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-2 overflow-hidden">
                    {userMenuItems.map((item) => (
                      <Link
                        href={`${item.path}`}
                        key={item.label}
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <button className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors">
                          <item.icon size={16} /> {item.label}
                        </button>
                      </Link>
                    ))}
                    <div className="border-t border-slate-100 dark:border-slate-800 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 text-sm font-medium"
                      >
                        <LogOut size={16} /> Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button
              className="lg:hidden p-2 text-slate-600 dark:text-slate-300 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle Menu"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Side Menu */}
      <div
        className={`fixed inset-0 bg-white dark:bg-slate-950 z-[90] lg:hidden transition-transform duration-500 ease-in-out ${
          isOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex flex-col h-full pt-24 pb-8 px-6 overflow-y-auto">
          <div className="space-y-8">
            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-2">
                Main Navigation
              </p>
              <div className="grid grid-cols-1 gap-2">
                {navLinks.map((link) => (
                  <Link
                    href={`${link.path}`}
                    key={link.label}
                    onClick={() => setIsOpen(false)} // FIX: Closes menu on click
                  >
                    <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-emerald-500 shadow-sm">
                          <link.icon size={20} />
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {link.label}
                        </span>
                      </div>
                      <ChevronRight size={18} className="text-slate-300" />
                    </button>
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-2">
                Account
              </p>
              <div className="grid grid-cols-1 gap-2">
                {userMenuItems.map((item) => (
                  <Link
                    href={`${item.path}`}
                    key={item.label}
                    onClick={() => setIsOpen(false)} // FIX: Closes menu on click
                  >
                    <button className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                      <item.icon size={20} className="text-slate-400" />
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        {item.label}
                      </span>
                    </button>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-auto space-y-4">
            <button
              onClick={() => {
                setTheme(isDark ? "light" : "dark");
                setIsOpen(false); // Optional: Close menu after theme change
              }}
              className="w-full flex items-center justify-between p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
                  {isDark ? <Sun size={20} /> : <Moon size={20} />}
                </div>
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                </span>
              </div>
            </button>

            <Button
              onClick={handleLogout}
              variant="danger"
              className="w-full py-6 border-red-100 dark:border-red-900/30 text-red-500 bg-red-500/50 hover:bg-red-500/80 rounded-2xl font-bold"
            >
              <LogOut className="w-5 h-5 mr-3" /> Log Out
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
