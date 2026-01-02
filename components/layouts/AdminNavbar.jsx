"use client";

import React, { useEffect, useState } from "react";
import {
  Activity,
  LayoutDashboard,
  Users,
  ShieldAlert,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";

const AdminNavbar = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  const buttons = [
    {
      Icon: LayoutDashboard,
      idx: 0,
      path: "/admin",
    },
    // {
    //   Icon: Map,
    //   idx: 1,
    //   path: "/map",
    // },
    {
      Icon: ShieldAlert,
      idx: 2,
      path: "/admin/issues",
    },
    {
      Icon: Users,
      idx: 3,
      path: "/admin/users",
    },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <aside className="hidden lg:flex flex-col w-20 h-screen sticky top-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 items-center py-8 gap-8 z-50">
        <Link href="/">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
            <Activity className="text-white w-6 h-6" />
          </div>
        </Link>

        <div className="flex flex-col gap-6 mt-10">
          {buttons.map((button) => {
            const isActive = pathname === button.path;
            return (
              <Link href={`${button.path}`} key={button.idx}>
                <div
                  className={`p-3 rounded-xl transition-colors cursor-pointer ${
                    isActive
                      ? "bg-emerald-500/10 text-emerald-500"
                      : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <button.Icon size={22} />
                </div>
              </Link>
            );
          })}
        </div>

        <button
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className="mt-auto p-3 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          {resolvedTheme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </aside>

      <nav className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <Link href="/">
          <div className="w-9 h-9 bg-emerald-600 rounded-lg flex items-center justify-center shadow-md">
            <Activity className="text-white w-5 h-5" />
          </div>
        </Link>

        <div className="flex items-center gap-1 sm:gap-4">
          {buttons.map((button) => {
            const isActive = pathname === button.path;
            return (
              <Link href={`${button.path}`} key={button.idx}>
                <div
                  className={`p-2.5 rounded-lg transition-colors cursor-pointer ${
                    isActive
                      ? "bg-emerald-500/10 text-emerald-500"
                      : "text-slate-400 active:bg-slate-100 dark:active:bg-slate-800"
                  }`}
                >
                  <button.Icon size={20} />
                </div>
              </Link>
            );
          })}
        </div>

        <button
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className="p-2.5 rounded-lg text-slate-400 active:bg-slate-100 dark:active:bg-slate-800"
        >
          {resolvedTheme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </nav>
    </>
  );
};

export default AdminNavbar;
