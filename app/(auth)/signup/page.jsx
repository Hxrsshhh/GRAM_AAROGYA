"use client";

import React, { Suspense, useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Activity,
  ArrowRight,
  Chrome,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import Button from "@/components/ui/Button";
import MouseGlow from "@/components/ui/MouseGlow";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

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
    localStorage.setItem("googleLoginSuccess", "true");
    await signIn("google");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong during signup");
      }

      if (res.ok) {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const loginRes = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (loginRes?.error) {
          setError(
            "Account created, but login failed. Please try the login page."
          );
        }
        sessionStorage.setItem("signupSuccess", "true");
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err.message);
      console.error("Auth Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen sm:h-auto sm:min-h-screen relative w-full overflow-hidden bg-white dark:bg-slate-950 flex items-center justify-center px-4 sm:px-6 py-12 selection:bg-emerald-500 selection:text-white">
      {/* Background Decor matching Home */}
      <MouseGlow />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-full sm:w-[50%] h-[50%] bg-emerald-500/10 dark:bg-emerald-500/5 blur-[80px] sm:blur-[120px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg z-10"
      >
        <div className="flex flex-row sm:flex-col items-center justify-center sm:items-center gap-4 sm:gap-0 mb-8 sm:mb-10 group">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <Link href="/">
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 bg-slate-900 dark:bg-emerald-600 rounded-2xl flex items-center justify-center shadow-2xl mb-0 sm:mb-6 transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                <Activity className="text-white w-7 h-7 sm:w-9 sm:h-9" />
              </div>
            </Link>
          </div>

          {/* Text Content */}
          <div className="flex flex-col items-start sm:items-center">
            <h1 className="text-2xl sm:text-4xl font-black tracking-tighter text-slate-900 dark:text-white leading-tight">
              Join the{" "}
              <span className="text-emerald-600 dark:text-emerald-400 inline-block">
                Pulse
              </span>
            </h1>
            <p className="text-xs sm:text-base text-slate-500 dark:text-slate-400 font-semibold tracking-wide sm:tracking-normal sm:text-center uppercase sm:normal-case opacity-80 sm:opacity-100">
              Urban Infrastructure{" "}
              <span className="hidden sm:inline">of an engaged society.</span>
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl shadow-emerald-500/5">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 sm:p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-xs sm:text-sm font-semibold flex items-center gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                {error}
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="text"
                label="Full Name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                leftIcon={<User className="w-4 h-4 text-emerald-500" />}
                required
                className="h-12 w-full bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl"
              />
              <Input
                type="email"
                label="Email Address"
                placeholder="you@pulse.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4 text-emerald-500" />}
                required
                className="h-12 w-full bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type={showPassword ? "text" : "password"}
                label="Password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4 text-emerald-500" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-slate-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                }
                required
                className="h-12 w-full bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl"
              />

              <Input
                type={showPassword ? "text" : "password"}
                label="Confirm"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4 text-emerald-500" />}
                required
                className="h-12 w-full bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl py-6 sm:py-7 font-bold shadow-lg shadow-emerald-500/20 mt-2"
              isLoading={isLoading}
            >
              Initialize Account
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6 sm:my-8">
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            <span className="mx-4 text-slate-400 text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
              Direct Access
            </span>
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          </div>

          {/* Social Buttons */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 p-3.5 sm:p-4 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all font-bold text-sm sm:text-base text-slate-700 dark:text-slate-200"
          >
            <Chrome className="h-5 w-5 text-emerald-500" />
            Continue with Google
          </button>

          <div className="mt-6 sm:mt-8 text-center text-sm font-medium text-slate-500 dark:text-slate-400">
            Already a member?{" "}
            <Link
              href="/signin"
              className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
            >
              Sign in to Pulse
            </Link>
          </div>
        </div>

        {/* Footer Links */}
        <p className="mt-6 sm:mt-8 text-center text-[9px] sm:text-[10px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500 px-4 leading-relaxed">
          By joining, you agree to our{" "}
          <Link
            href="/terms"
            className="text-slate-900 dark:text-slate-300 hover:text-emerald-500 transition-colors"
          >
            Terms
          </Link>{" "}
          &{" "}
          <Link
            href="/privacy"
            className="text-slate-900 dark:text-slate-300 hover:text-emerald-500 transition-colors"
          >
            Privacy Policy
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
