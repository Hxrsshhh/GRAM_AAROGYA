"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  Chrome,
  HeartPulse,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import Button from "@/components/ui/Button";
import { signIn } from "next-auth/react";

// Consistency: Reusing the FloatingPaths from your Hero
function FloatingPaths({ position }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${380 - i * 5 * position} -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${152 - i * 5 * position} ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${684 - i * 5 * position} ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.5 + i * 0.03,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden w-full h-full opacity-40">
      <svg className="w-full h-full" viewBox="0 0 696 316" preserveAspectRatio="xMidYMid slice" fill="none">
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            className="text-blue-500/20 dark:text-white/10"
            initial={{ pathLength: 0.3, opacity: 0.4 }}
            animate={{ pathLength: 1, opacity: [0.2, 0.5, 0.2], pathOffset: [0, 1, 0] }}
            transition={{ duration: 15 + path.id * 0.3, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </svg>
    </div>
  );
}

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid credentials. Please try again.");
        setIsLoading(false);
        return;
      }
      sessionStorage.setItem("signinSuccess", "true");
      router.refresh();
      router.push("/dashboard"); // Or your desired redirect
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    await signIn("google");
  };

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-white dark:bg-[#030303] selection:bg-blue-500/30 px-6">
      {/* 1. Atmospheric Background (Matching Hero) */}
      <div className="absolute inset-0 z-0">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
      </div>

      <Suspense fallback={<div className="text-blue-500 animate-pulse">Loading Access...</div>}>
        <motion.div
          initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="w-full max-w-md z-10"
        >
          {/* Brand Identity */}
          <div className="flex flex-col items-center mb-8">
            <Link href="/">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-14 h-14 bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-xl mb-6 cursor-pointer"
              >
                <HeartPulse className="text-blue-600 dark:text-blue-500 w-8 h-8" />
              </motion.div>
            </Link>
            <h1 className="text-4xl font-bold tracking-tighter text-neutral-900 dark:text-white mb-2 text-center">
              Welcome{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                Back
              </span>
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 font-medium text-center">
              Secure access to your health records.
            </p>
          </div>

          {/* Glassmorphic Card */}
          <div className="bg-white/80 dark:bg-white/[0.02] backdrop-blur-2xl border border-neutral-200 dark:border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-blue-500/5">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }}
                  className="p-3 bg-red-500/5 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold flex items-center gap-2"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                  {error}
                </motion.div>
              )}

              <div className="space-y-4">
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  leftIcon={<Mail className="w-4 h-4 text-blue-500" />}
                  required
                  className="h-13 w-full bg-white dark:bg-black/20 border-neutral-200 dark:border-white/10 rounded-xl focus:ring-blue-500/50"
                />

                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    leftIcon={<Lock className="w-4 h-4 text-blue-500" />}
                    required
                    className="h-13 w-full bg-white dark:bg-black/20 border-neutral-200 dark:border-white/10 rounded-xl focus:ring-blue-500/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-blue-500 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full relative group overflow-hidden rounded-xl py-6 bg-neutral-900 dark:bg-white text-white dark:text-black font-bold text-md transition-all active:scale-[0.98]"
              >
                <span className="flex items-center justify-center gap-2">
                  Authorize Session
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </form>

            <div className="flex items-center my-8">
              <div className="grow border-t border-neutral-200 dark:border-white/5"></div>
              <span className="mx-4 text-neutral-400 text-[10px] font-bold uppercase tracking-widest">
                Secure OAuth
              </span>
              <div className="grow border-t border-neutral-200 dark:border-white/5"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 p-4 border border-neutral-200 dark:border-white/10 rounded-xl hover:bg-neutral-50 dark:hover:bg-white/5 transition-all font-semibold text-neutral-700 dark:text-neutral-200"
            >
              <Chrome className="h-5 w-5 text-blue-500" />
              Sync with Google
            </button>

            <div className="mt-8 text-center">
              <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                New to the platform?{" "}
                <Link
                  href="/signup"
                  className="text-blue-600 dark:text-blue-400 font-bold hover:underline underline-offset-4"
                >
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </Suspense>
      
      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-[#030303] to-transparent pointer-events-none" />
    </main>
  );
}