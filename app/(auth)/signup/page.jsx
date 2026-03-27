"use client";

import React, { useState, Suspense } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  HeartPulse,
  ArrowRight,
  Chrome,
  Sparkles,
  Activity,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

// Shared Background Component for Visual Continuity
function FloatingPaths({ position }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${380 - i * 5 * position} -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${152 - i * 5 * position} ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${684 - i * 5 * position} ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.5 + i * 0.03,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden w-full h-full opacity-40">
      <svg
        className="w-full h-full"
        viewBox="0 0 696 316"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            className="text-blue-500/20 dark:text-white/10"
            initial={{ pathLength: 0.3, opacity: 0.4 }}
            animate={{
              pathLength: 1,
              opacity: [0.2, 0.5, 0.2],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 15 + path.id * 0.3,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleGoogleLogin = async () => {
    await signIn("google");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed");

      const loginRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (loginRes?.error) {
        router.push("/signin");
      } else {
        router.push("/home");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-white dark:bg-[#030303] selection:bg-blue-500/30 px-6 py-12">
      {/* 1. Atmospheric Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[70%] h-[70%] bg-blue-600/10 dark:bg-blue-600/15 blur-[140px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 dark:bg-indigo-600/15 blur-[140px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
        animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        className="w-full max-w-xl z-10"
      >
        {/* Brand Identity */}
        <div className="flex flex-col items-center mb-8 group">
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
          <h1 className="text-4xl font-bold tracking-tighter text-neutral-900 dark:text-white mb-2 text-center">
            Create Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
              Health ID
            </span>
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 font-medium text-center">
            Join the new standard in accessible rural care.
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
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                {error}
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                leftIcon={<User className="w-4 h-4 text-blue-500" />}
                required
                className="h-13 w-full bg-white dark:bg-black/20 border-neutral-200 dark:border-white/10 rounded-xl focus:ring-blue-500/50"
              />
              <Input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4 text-blue-500" />}
                required
                className="h-13 w-full bg-white dark:bg-black/20 border-neutral-200 dark:border-white/10 rounded-xl focus:ring-blue-500/50"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  leftIcon={<Lock className="w-4 h-4 text-blue-500" />}
                  required
                  className="h-13 w-full bg-white dark:bg-black/20 border-neutral-200 dark:border-white/10 rounded-xl focus:ring-blue-500/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-blue-500 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full relative group overflow-hidden rounded-xl py-7 bg-neutral-900 dark:bg-white text-white dark:text-black font-bold text-md transition-all active:scale-[0.98] mt-2"
            >
              <span className="flex items-center justify-center gap-2">
                Initialize Account
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </form>

          <div className="flex items-center my-8">
            <div className="grow border-t border-neutral-200 dark:border-white/5"></div>
            <span className="mx-4 text-neutral-400 text-[10px] font-bold uppercase tracking-widest">
              Direct Access
            </span>
            <div className="grow border-t border-neutral-200 dark:border-white/5"></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 p-4 border border-neutral-200 dark:border-white/10 rounded-xl hover:bg-neutral-50 dark:hover:bg-white/5 transition-all font-semibold text-neutral-700 dark:text-neutral-200"
          >
            <Chrome className="h-5 w-5 text-blue-500" />
            Continue with Google
          </button>

          <div className="mt-8 text-center">
            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
              Already a member?{" "}
              <Link
                href="/signin"
                className="text-blue-600 dark:text-blue-400 font-bold hover:underline underline-offset-4"
              >
                Sign in to Profile
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Disclaimer */}
        <p className="mt-8 text-center text-[10px] uppercase tracking-widest font-bold text-neutral-400 dark:text-neutral-500 px-4 leading-relaxed">
          By joining, you agree to our{" "}
          <Link
            href="/terms"
            className="text-neutral-900 dark:text-neutral-300 hover:text-blue-500"
          >
            Terms
          </Link>{" "}
          &{" "}
          <Link
            href="/privacy"
            className="text-neutral-900 dark:text-neutral-300 hover:text-blue-500"
          >
            Privacy Policy
          </Link>
        </p>
      </motion.div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-[#030303] to-transparent pointer-events-none" />
    </main>
  );
}
