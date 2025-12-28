'use client'

import React, { useState, useEffect } from "react";
import { motion as fm, AnimatePresence } from "framer-motion";
import { 
  Activity, 
  Search, 
  Users, 
  MessageSquare, 
  Bell, 
  ShieldAlert, 
  MoreHorizontal, 
  Send,
  Plus,
  Filter,
  Megaphone,
  CheckCircle,
  MapPin,
  Clock,
  AlertTriangle,
  Wrench,
  Droplets,
  Zap,
  ChevronRight,
  LayoutGrid,
  FileText
} from "lucide-react";

const MouseGlow = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeMouseMoveListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
      style={{
        background: `radial-gradient(600px at ${mousePos.x}px ${mousePos.y}px, rgba(16, 185, 129, 0.08), transparent 80%)`,
      }}
    />
  );
};

const CommunityPage = () => {
  const [activeTab, setActiveTab] = useState("feed"); // 'feed' or 'reports'
  const [isAdmin, setIsAdmin] = useState(true);
  
  const [messages, setMessages] = useState([
    {
      id: 1,
      author: "City Admin",
      role: "Official",
      content: "Maintenance scheduled for Sector 7 water mains starting at 22:00 tonight. Please prepare for low pressure.",
      timestamp: "10m ago",
      type: "announcement",
      verified: true,
      upvotes: 24
    },
    {
      id: 2,
      author: "Sarah Jenkins",
      role: "Citizen",
      content: "Has anyone else noticed the street lights on Oak St are flickering? Reported it to the grid but no response yet.",
      timestamp: "1h ago",
      type: "report",
      verified: false,
      upvotes: 5
    }
  ]);

  const [activeReports, setActiveReports] = useState([
    {
      id: "REP-102",
      title: "Broken Water Pipe",
      location: "East District - 5th Ave",
      category: "Utility",
      status: "In Progress",
      priority: "High",
      icon: Droplets,
      color: "blue",
      time: "2h ago"
    },
    {
      id: "REP-098",
      title: "Pothole Emergency",
      location: "Industrial Zone",
      category: "Infrastructure",
      status: "Verified",
      priority: "Medium",
      icon: Wrench,
      color: "amber",
      time: "5h ago"
    },
    {
      id: "REP-110",
      title: "Power Surge Alert",
      location: "Residential Sector B",
      category: "Power",
      status: "Pending",
      priority: "Critical",
      icon: Zap,
      color: "red",
      time: "15m ago"
    }
  ]);

  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    const msg = {
      id: Date.now(),
      author: isAdmin ? "System Admin" : "User Name",
      role: isAdmin ? "Official" : "Citizen",
      content: newMessage,
      timestamp: "Just now",
      type: isAdmin ? "announcement" : "report",
      verified: isAdmin,
      upvotes: 0
    };
    
    setMessages([msg, ...messages]);
    setNewMessage("");
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'Critical': return 'text-red-600 bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20';
      case 'High': return 'text-orange-600 bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/20';
      default: return 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20';
    }
  };

  return (
    <div className="h-screen w-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white overflow-hidden font-sans flex flex-col relative">
      <MouseGlow />

      {/* FIXED TOP NAVIGATION BAR */}
      <nav className="fixed top-0 left-0 right-0 z-[100] h-20 bg-white/70 dark:bg-slate-950/70 backdrop-blur-2xl border-b border-slate-100 dark:border-slate-900 flex items-center justify-between px-8">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
            <Activity className="text-white w-6 h-6" />
          </div>
          <div>
             <span className="text-xl font-black tracking-tighter">CivicPulse</span>
             <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Hub Controller</p>
          </div>
        </div>

        {/* Floating Toggle Buttons */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center bg-slate-100 dark:bg-slate-900/80 p-1 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-inner">
          <button 
            onClick={() => setActiveTab("feed")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${activeTab === "feed" ? "bg-white dark:bg-slate-800 text-emerald-600 shadow-xl shadow-emerald-500/5 scale-[1.02]" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"}`}
          >
            <MessageSquare size={14} />
            Community Feed
          </button>
          <button 
            onClick={() => setActiveTab("reports")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${activeTab === "reports" ? "bg-white dark:bg-slate-800 text-emerald-600 shadow-xl shadow-emerald-500/5 scale-[1.02]" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"}`}
          >
            <LayoutGrid size={14} />
            Active Reports
          </button>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex -space-x-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-9 h-9 rounded-full border-4 border-white dark:border-slate-950 bg-slate-200 dark:bg-slate-800" />
            ))}
            <div className="w-9 h-9 rounded-full border-4 border-white dark:border-slate-950 bg-emerald-500 flex items-center justify-center text-[10px] font-black text-white">+12</div>
          </div>
          <button className="p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 hover:text-emerald-500 transition-colors">
            <Bell size={20} />
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT WRAPPER WITH TOP SPACING FOR FIXED NAV */}
      <div className="flex-grow mt-20 flex overflow-hidden max-w-[1600px] mx-auto w-full">
        
        {/* Left Sidebar */}
        <aside className="hidden lg:flex w-72 shrink-0 flex-col p-6 gap-6 border-r border-slate-100 dark:border-slate-900 overflow-y-auto">
          <div className="p-6 bg-emerald-600 rounded-[2.5rem] text-white shadow-2xl shadow-emerald-600/20 relative overflow-hidden group">
            <Megaphone className="absolute -bottom-2 -right-2 w-20 h-20 opacity-10 group-hover:scale-110 transition-transform" />
            <h3 className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Status</h3>
            <p className="text-xl font-black">Central Sector</p>
            <div className="mt-4 flex items-center gap-2 text-[10px] font-bold bg-white/20 w-fit px-3 py-1 rounded-full backdrop-blur-md">
              <CheckCircle size={12} /> Live Updates
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 ml-1">Browse Regions</h4>
            <div className="space-y-2">
              {['Downtown', 'North Park', 'Industrial', 'East Side'].map(tag => (
                <div key={tag} className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-all cursor-pointer group">
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-400 group-hover:text-emerald-500">{tag}</span>
                  <ChevronRight size={14} className="text-slate-300 group-hover:text-emerald-500" />
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-grow flex flex-col bg-slate-50/30 dark:bg-transparent overflow-hidden">
          
          <AnimatePresence mode="wait">
            {activeTab === "feed" ? (
              <fm.div 
                key="feed"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col h-full overflow-hidden"
              >
                <div className="p-8 flex items-center justify-between shrink-0">
                  <div>
                    <h2 className="text-3xl font-black tracking-tighter">Community Feed</h2>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Latest dispatches from verified citizens</p>
                  </div>
                  <button className="flex items-center gap-2 bg-white dark:bg-slate-900 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500 transition-all">
                    <Filter size={14} /> Newest First
                  </button>
                </div>

                <div className="flex-grow overflow-y-auto px-8 pb-8 space-y-6 custom-scrollbar">
                  {messages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`p-6 rounded-[2.5rem] border transition-all ${
                        msg.verified 
                          ? "bg-emerald-500/5 border-emerald-500/20 shadow-xl shadow-emerald-500/5" 
                          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg ${msg.verified ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>
                            {msg.author[0]}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-black text-base tracking-tight">{msg.author}</span>
                              {msg.verified && <CheckCircle size={16} className="text-emerald-500" />}
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{msg.role}</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-black text-slate-400 flex items-center gap-1.5 uppercase tracking-widest">
                          <Clock size={12} /> {msg.timestamp}
                        </span>
                      </div>
                      <p className="text-base font-medium leading-relaxed text-slate-700 dark:text-slate-300 px-1">{msg.content}</p>
                      <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800/50 flex items-center gap-4">
                        <button className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-500/10 px-4 py-2 rounded-xl hover:bg-emerald-500/20 transition-colors">
                          Upvote • {msg.upvotes}
                        </button>
                        <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-emerald-500 transition-colors">Reply</button>
                        <button className="ml-auto text-slate-400 hover:text-slate-600 transition-colors"><MoreHorizontal size={20} /></button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input form */}
                <div className="p-8 pt-2 shrink-0">
                  <form onSubmit={handleSendMessage} className="relative bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-2.5 flex items-center gap-3 shadow-2xl shadow-emerald-500/5">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                       <Plus size={20} />
                    </div>
                    <input 
                      type="text" 
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder={isAdmin ? "Issue a community alert..." : "Share community feedback..."}
                      className="flex-grow bg-transparent border-none outline-none px-2 font-bold text-sm"
                    />
                    <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-lg shadow-emerald-600/20 active:scale-95">
                      <Send size={18} />
                    </button>
                  </form>
                </div>
              </fm.div>
            ) : (
              <fm.div 
                key="reports"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col h-full overflow-hidden p-8"
              >
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <h2 className="text-3xl font-black tracking-tighter">Active Reports</h2>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Infrastructure resolution dashboard</p>
                  </div>
                  <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-3 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="flex -space-x-3">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full border-4 border-white dark:border-slate-950 bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black">
                          {i}
                        </div>
                      ))}
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] pr-2">
                      <span className="text-emerald-500 block">24 Online</span>
                      <span className="text-slate-400">Dispatchers</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto custom-scrollbar pr-2">
                  {activeReports.map((report) => (
                    <div key={report.id} className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-[2.5rem] hover:border-emerald-500/40 transition-all hover:shadow-2xl hover:shadow-emerald-500/5">
                      <div className="flex items-start justify-between mb-6">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm`}>
                          <report.icon size={26} />
                        </div>
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getPriorityColor(report.priority)}`}>
                          {report.priority}
                        </span>
                      </div>
                      <h3 className="font-black text-xl mb-1 tracking-tight">{report.title}</h3>
                      <div className="flex items-center gap-2 text-slate-400 mb-6">
                        <MapPin size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">{report.location}</span>
                      </div>
                      <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800/50">
                        <div className="flex items-center gap-3">
                          <div className={`w-2.5 h-2.5 rounded-full ${report.status === 'In Progress' ? 'bg-blue-500 animate-pulse' : report.status === 'Verified' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{report.status}</span>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">{report.time}</span>
                      </div>
                    </div>
                  ))}
                  
                  {/* Empty Report Slot / Add New */}
                  <button className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-6 flex flex-col items-center justify-center gap-4 text-slate-400 hover:text-emerald-500 hover:border-emerald-500 transition-all bg-transparent group">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center group-hover:bg-emerald-500/10 transition-colors">
                      <Plus size={32} />
                    </div>
                    <span className="text-xs font-black uppercase tracking-[0.3em]">Lodge New Report</span>
                  </button>
                </div>
              </fm.div>
            )}
          </AnimatePresence>
        </main>

        {/* Right Sidebar - System Stats */}
        <aside className="hidden xl:flex w-80 shrink-0 flex-col p-8 gap-8 border-l border-slate-100 dark:border-slate-900 overflow-y-auto">
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 ml-1">Live Statistics</h4>
            <div className="space-y-6">
              <div className="p-5 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-end">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Power Grid Load</p>
                  <span className="text-emerald-500 text-xs font-black uppercase tracking-widest">Stable</span>
                </div>
                <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full mt-3 overflow-hidden">
                  <div className="h-full w-2/3 bg-emerald-500 rounded-full" />
                </div>
              </div>
              <div className="p-5 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-end">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Water Reserve</p>
                  <span className="text-blue-500 text-xs font-black uppercase tracking-widest">94%</span>
                </div>
                <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full mt-3 overflow-hidden">
                  <div className="h-full w-[94%] bg-blue-500 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 bg-slate-900 dark:bg-white rounded-[3rem] text-white dark:text-slate-900 mt-auto shadow-2xl">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-3">Emergency Hub</h4>
            <p className="text-sm font-bold leading-relaxed mb-6">Direct secure line to civil defense and emergency dispatch.</p>
            <button className="w-full bg-emerald-600 text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-emerald-900/40 transition-transform active:scale-95">
              Contact Dispatch
            </button>
          </div>
        </aside>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #10b98115;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #10b98130;
        }
      `}</style>
    </div>
  );
};

export default CommunityPage;