
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Lock, Eye, EyeOff, Activity, ArrowRight, Chrome } from "lucide-react";
import { Input } from "@/components/ui/input";
import Button from "@/components/ui/Button"; // Using your themed button
import MouseGlow from "@/components/ui/MouseGlow";
import Link from "next/link";


export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");


  const handleGoogleLogin = () => {
    console.log("signup")
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
   
   console.log("signup")
  };

  return (
    <div className="min-h-screen relative w-full overflow-hidden bg-white dark:bg-slate-950 flex items-center justify-center px-6 py-12 selection:bg-emerald-500 selection:text-white">
      {/* Background Decor matching Home */}
      <MouseGlow />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 dark:bg-emerald-500/5 blur-[120px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg z-10"
      >
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-14 h-14 bg-slate-900 dark:bg-emerald-600 rounded-2xl flex items-center justify-center shadow-2xl mb-6">
            <Activity className="text-white w-8 h-8" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white mb-2 text-center">
            Join the <span className="text-emerald-600 dark:text-emerald-400">Pulse</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-center">
            The infrastructure of an engaged society.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-8 shadow-2xl shadow-emerald-500/5">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm font-semibold flex items-center gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
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
                className= " h-12 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl"
              />
              <Input
                type="email"
                label="Email Address"
                placeholder="you@pulse.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4 text-emerald-500" />}
                required
                className= "h-12 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl"
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
                  <button type="button" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                required
                className= "h-12 w-[225px] bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl "
              />
             
              <Input
                type={showPassword ? "text" : "password"}
                label="Confirm"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4 text-emerald-500" />}
                required
                className= "h-12  bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl py-6 font-bold shadow-lg shadow-emerald-500/20"
              isLoading={isLoading}
            >
              Initialize Account
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-8">
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            <span className="mx-4 text-slate-400 text-xs font-black uppercase tracking-widest">
              Direct Access
            </span>
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          </div>

          {/* Social Buttons */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 p-4 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all font-bold text-slate-700 dark:text-slate-200"
          >
            <Chrome className="h-5 w-5 text-emerald-500" />
            Continue with Google
          </button>

          <div className="mt-8 text-center text-sm font-medium text-slate-500 dark:text-slate-400">
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
        <p className="mt-8 text-center text-[10px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500">
          By joining, you agree to our{" "}
          <Link href="/terms" className="text-slate-900 dark:text-slate-300 hover:text-emerald-500">
            Terms
          </Link>{" "}
          &{" "}
          <Link href="/privacy" className="text-slate-900 dark:text-slate-300 hover:text-emerald-500">
            Privacy Policy
          </Link>
        </p>
      </motion.div>
    </div>
  );
};