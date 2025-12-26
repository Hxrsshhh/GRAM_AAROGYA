'use client'

import React, { useState } from 'react';
import { 
  Bell, Lock, Shield, Palette, Globe, 
  ChevronRight, Smartphone, Mail, Info,
  Moon, Sun, Eye, Key, Laptop, Trash2,
  AlertTriangle
} from 'lucide-react';

// --- Custom Reusable Components for the Professional Theme ---

const Card = ({ children, className = "" }) => (
  <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden ${className}`}>
    {children}
  </div>
);

const Toggle = ({ enabled, onChange, label, description }) => (
  <div className="flex items-center justify-between py-4 px-2 group">
    <div className="flex-1 pr-4">
      <p className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-blue-600 dark:group-hover:text-emerald-500 transition-colors">
        {label}
      </p>
      {description && <p className="text-xs text-slate-400 font-medium mt-0.5">{description}</p>}
    </div>
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-emerald-500 
        ${enabled ? 'bg-slate-900 dark:bg-emerald-600' : 'bg-slate-200 dark:bg-slate-800'}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 shadow-sm
          ${enabled ? 'translate-x-6' : 'translate-x-1'}`}
      />
    </button>
  </div>
);

const SectionHeader = ({ icon: Icon, title, description, colorClass = "text-blue-600 dark:text-emerald-500" }) => (
  <div className="flex items-center gap-4 mb-8">
    <div className={`p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 ${colorClass}`}>
      <Icon size={20} />
    </div>
    <div>
      <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">{title}</h2>
      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{description}</p>
    </div>
  </div>
);

const ActionButton = ({ children, icon: Icon, variant = "default" }) => {
  const styles = {
    default: "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700",
    danger: "text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 border-rose-100 dark:border-rose-900/30"
  };
  
  return (
    <button className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all group font-bold text-sm ${styles[variant]}`}>
      <div className="flex items-center gap-3">
        {Icon && <Icon size={18} className="opacity-70 group-hover:opacity-100" />}
        {children}
      </div>
      <ChevronRight size={16} className="opacity-30 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
    </button>
  );
};

export default function Settings() {
  const [isDark, setIsDark] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    updates: true,
  });

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 py-12 selection:bg-blue-100">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Page Header */}
        <div className="mb-8 mt-14 flex justify-between items-end">
          <div>
            <div className="flex items-center gap-2 text-blue-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-[0.2em] mb-2">
              <Globe size={14} /> Global Preferences
            </div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Control <span className="text-blue-600 dark:text-emerald-500">Center</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Configure your workspace and security protocols.</p>
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-2 p-2 px-4 bg-white dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm text-[10px] font-black uppercase tracking-widest text-slate-400">
              <Info size={14} /> Cloud Sync Active
            </div>
          </div>
        </div>

        <div className="space-y-8">
          
          {/* Appearance Section */}
          <Card className="p-8">
            <SectionHeader 
              icon={Palette} 
              title="Interface Aesthetics" 
              description="Visual Workspace Configuration" 
            />
            <div className="bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
              <Toggle 
                label="Dark Mode Environment" 
                description="Reduce eye strain in low-light environments"
                enabled={isDark} 
                onChange={toggleTheme} 
              />
            </div>
            <div className="mt-4 flex items-center gap-4 px-2">
               <div className={`p-3 rounded-lg border ${!isDark ? 'border-blue-600 bg-blue-50' : 'border-slate-200'} transition-all`}>
                  <Sun size={20} className={!isDark ? 'text-blue-600' : 'text-slate-400'} />
               </div>
               <div className={`p-3 rounded-lg border ${isDark ? 'border-emerald-500 bg-emerald-900/20' : 'border-slate-200'} transition-all`}>
                  <Moon size={20} className={isDark ? 'text-emerald-400' : 'text-slate-400'} />
               </div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-auto">System Default: Auto</p>
            </div>
          </Card>

          {/* Notifications Section */}
          <Card className="p-8">
            <SectionHeader 
              icon={Bell} 
              title="Communications" 
              description="Inbound Signal Management" 
            />
            <div className="space-y-2 divide-y divide-slate-100 dark:divide-slate-800">
              <Toggle 
                label="Direct Email Alerts" 
                description="Official community reports and task updates"
                enabled={notifications.email} 
                onChange={() => setNotifications({...notifications, email: !notifications.email})} 
              />
              <Toggle 
                label="Push Infrastructure" 
                description="Real-time browser and mobile notifications"
                enabled={notifications.push} 
                onChange={() => setNotifications({...notifications, push: !notifications.push})} 
              />
              <Toggle 
                label="SMS Protocol" 
                description="Critical urgent updates via mobile carrier"
                enabled={notifications.sms} 
                onChange={() => setNotifications({...notifications, sms: !notifications.sms})} 
              />
            </div>
          </Card>

          {/* Security Section */}
          <Card className="p-8">
            <SectionHeader 
              icon={Lock} 
              title="Security & Access" 
              description="Credential and Encryption Settings" 
              colorClass="text-blue-600 dark:text-emerald-500"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ActionButton icon={Key}>Rotate Password</ActionButton>
              <ActionButton icon={Shield}>Configure 2FA</ActionButton>
              <ActionButton icon={Smartphone}>Authorized Devices</ActionButton>
              <ActionButton icon={Eye}>Privacy Audit</ActionButton>
            </div>
          </Card>

          {/* Danger Zone */}
          <Card className="p-8 border-rose-100 dark:border-rose-900/30">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 text-rose-500">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Danger Zone</h2>
                <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Irreversible Critical Actions</p>
              </div>
            </div>
            
            <p className="text-sm text-slate-500 font-medium mb-6 px-2">
              Deleting your account will purge all community points, project history, and personal data from our systems. This action cannot be undone.
            </p>

            <button className="w-full flex items-center justify-center gap-2 p-4 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 text-rose-600 font-black text-xs uppercase tracking-widest rounded-xl transition-all border border-rose-200 dark:border-rose-900/40">
              <Trash2 size={16} /> Deactivate Account Terminal
            </button>
          </Card>

          <div className="text-center pb-12">
            <p className="text-[10px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.4em]">
              CivicReport Console v2.4.0-Stable
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}