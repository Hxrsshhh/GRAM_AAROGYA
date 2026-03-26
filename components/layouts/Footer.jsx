"use client";

import Link from "next/link";
import { Github, Twitter, Linkedin, Activity, Heart, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const footerLinks = {
  solutions: [
    { name: "AarogyaMitra AI", href: "/health-check" },
    { name: "AarogyaConnect", href: "/find-doctor" },
    { name: "AarogyaMap", href: "/g-map" },
    { name: "AarogyaPulse", href: "/news-help" },
    { name: "AarogyaView", href: "/health-insights" },
  ],
  company: [
    { name: "AarogyaParivar", href: "/our-team" },
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="relative border-t border-neutral-200 dark:border-white/5 bg-white dark:bg-[#030303] transition-colors duration-300">
      {/* Subtle Top Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

      <div className="container mx-auto px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          
          {/* Brand Column */}
          <div className="flex flex-col items-start space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 transition-transform group-hover:scale-110">
                <Activity size={20} />
              </div>
              <span className="text-xl font-bold tracking-tighter text-neutral-900 dark:text-white">
                Gram<span className="text-blue-500">Aarogya</span>
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-neutral-500 dark:text-neutral-400 font-light">
              Redefining the medical landscape for rural communities through 
              neural intelligence and compassionate connectivity.
            </p>
            <div className="flex items-center gap-4">
              {[
                { icon: Github, href: "https://github.com/Sid3503" },
                { icon: Linkedin, href: "https://www.linkedin.com/in/siddharth-mishra-0a5227228/" },
                { icon: Twitter, href: "#" }
              ].map((social, i) => (
                <Link 
                  key={i} 
                  href={social.href} 
                  className="p-2.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/5 text-neutral-600 dark:text-neutral-400 hover:text-blue-500 dark:hover:text-white hover:border-blue-500/50 transition-all"
                >
                  <social.icon size={18} />
                </Link>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="grid grid-cols-2 gap-8 lg:col-span-2">
            <div className="space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-900 dark:text-white">
                Solutions
              </h3>
              <ul className="space-y-4">
                {footerLinks.solutions.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href} 
                      className="group flex items-center text-sm font-light text-neutral-500 dark:text-neutral-400 hover:text-blue-500 dark:hover:text-white transition-colors"
                    >
                      {link.name}
                      <ArrowUpRight size={12} className="ml-1 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-900 dark:text-white">
                Organization
              </h3>
              <ul className="space-y-4">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href} 
                      className="group flex items-center text-sm font-light text-neutral-500 dark:text-neutral-400 hover:text-blue-500 dark:hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-neutral-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[11px] font-medium uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
            © {new Date().getFullYear()} GramAarogya Excellence System
          </p>
          <div className="flex items-center gap-1.5 text-xs text-neutral-400">
            <span>Made with</span>
            <Heart size={12} className="text-red-500 fill-red-500" />
            <span>for Rural India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}