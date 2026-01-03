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
  Activity,
  ArrowRight,
  Chrome,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import Button from "@/components/ui/Button";
import MouseGlow from "@/components/ui/MouseGlow";

import { signIn } from "next-auth/react";

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
        setError("Invalid email or password");
        setIsLoading(false);
        return;
      }
      sessionStorage.setItem("signinSuccess", "true");
      router.refresh();
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Sign-in error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    localStorage.setItem("googleLoginSuccess", "true");
    await signIn("google");
  };

  return (
    <main className="h-[92vh] lg:h-screen sm:h-auto sm:min-h-screen relative w-full overflow-hidden bg-white dark:bg-slate-950 flex items-center justify-center px-6 py-12">
      {/* High-End Background Effects */}
      <MouseGlow />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-emerald-500/10 dark:bg-emerald-500/5 blur-[130px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 dark:bg-cyan-500/5 blur-[100px] rounded-full" />
      </div>

      <Suspense
        fallback={
          <div className="flex items-center gap-3 font-black text-emerald-500 animate-pulse">
            <Activity className="animate-bounce" /> INITIALIZING...
          </div>
        }
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md z-10"
        >
          {/* Brand Identity */}
          <div className="flex flex-col items-center mb-10">
            <Link href="/">
              <motion.div
                whileHover={{ rotate: 15, scale: 1.1 }}
                className="w-16 h-16 bg-slate-900 dark:bg-emerald-600 rounded-2xl flex items-center justify-center shadow-2xl mb-6 cursor-pointer"
              >
                <Activity className="text-white w-9 h-9" />
              </motion.div>
            </Link>
            <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white mb-2 text-center">
              Welcome{" "}
              <span className="text-emerald-600 dark:text-emerald-400">
                Back
              </span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-center">
              Access the DNA of your city.
            </p>
          </div>

          {/* Main Glassmorphic Card */}
          <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-800/50 rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-emerald-500/10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-600 dark:text-red-400 text-sm font-bold flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <Input
                  type="email"
                  label="Email Address"
                  placeholder="name@pulse.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  leftIcon={<Mail className="w-4 h-4 text-emerald-500" />}
                  required
                  className="h-12 w-full bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-emerald-500"
                />

                <div className="space-y-1">
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
                        className="text-slate-400 hover:text-emerald-500 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    }
                    required
                    className="h-12 w-full bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-emerald-500"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-slate-900 dark:bg-emerald-600 hover:bg-emerald-500 dark:hover:bg-emerald-500 text-white rounded-2xl py-7 font-black text-lg shadow-xl shadow-emerald-500/20 transition-all active:scale-[0.98]"
                isLoading={isLoading}
              >
                Authorize Session
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </form>

            <div className="flex items-center my-10">
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
              <span className="mx-4 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                O-Auth
              </span>
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 p-4 border-2 border-slate-100 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all font-bold text-slate-700 dark:text-slate-200 group"
            >
              <Chrome className="h-5 w-5 text-emerald-500 group-hover:rotate-12 transition-transform" />
              Sync with Google
            </button>

            <div className="mt-10 text-center">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Outside the pulse?{" "}
                <Link
                  href="/signup"
                  className="text-emerald-600 dark:text-emerald-400 font-black hover:text-emerald-500 transition-colors underline-offset-4 hover:underline"
                >
                  Join the Network
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </Suspense>
    </main>
  );
}
