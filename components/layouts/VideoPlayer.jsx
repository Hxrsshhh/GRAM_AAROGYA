import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, Pause, RotateCcw, Volume2, VolumeX, 
  Sparkles, Maximize, RotateCw, Minimize 
} from "lucide-react";

const VideoPlayer = ({ title, src, poster, icon: Icon, description }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const controlsTimeoutRef = useRef(null); // Ref for the auto-hide timer

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState("00:00");
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true); // New state for mobile visibility

  // --- Handlers ---
  
  // Function to handle showing/hiding controls on tap
  const handleContainerTouch = () => {
    setShowControls(true);
    
    // Clear existing timer
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    
    // Hide controls after 3 seconds if video is playing
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  const togglePlay = (e) => {
    e.stopPropagation(); // Prevent bubbling to container touch
    if (videoRef.current.paused) {
      videoRef.current.play();
      // Start hide timer when playing
      controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
    } else {
      videoRef.current.pause();
      setShowControls(true); // Keep controls visible when paused
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    }
  };

  const skip = (e, amount) => {
    e.stopPropagation();
    videoRef.current.currentTime += amount;
    handleContainerTouch(); // Refresh timer
  };

  const handleProgressChange = (e) => {
    const time = Number(e.target.value);
    videoRef.current.currentTime = time;
    setProgress(time);
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    const newMute = !isMuted;
    setIsMuted(newMute);
    videoRef.current.volume = newMute ? 0 : volume;
  };

  const toggleFullScreen = (e) => {
    e.stopPropagation();
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "00:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // --- Effects ---
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setProgress(video.currentTime);
      setCurrentTime(formatTime(video.currentTime));
    };
    
    const handleLoadedMetadata = () => setDuration(video.duration);
    const handlePlayState = () => setIsPlaying(true);
    const handlePauseState = () => setIsPlaying(false);
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("play", handlePlayState);
    video.addEventListener("pause", handlePauseState);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("play", handlePlayState);
      video.removeEventListener("pause", handlePauseState);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, []);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`relative group transition-all duration-500 overflow-hidden border border-white/10 
        ${isFullscreen 
            ? "fixed inset-0 z-[9999] bg-black border-none rounded-none" 
            : "bg-white/[0.03] backdrop-blur-3xl rounded-[2.5rem] hover:bg-white/[0.05] hover:border-emerald-500/30"
        }`}
    >
      {!isFullscreen && (
        <div className="p-6 md:p-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">
              <Icon size={24} className="md:w-7 md:h-7" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-1">{title}</h3>
              <p className="text-xs md:text-sm text-slate-400 font-medium flex items-center gap-2">
                <Sparkles size={14} className="text-emerald-500/60" />
                {description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Video Container */}
      <div 
        onClick={handleContainerTouch}
        className={`relative transition-all duration-500 bg-black group/video overflow-hidden 
          ${isFullscreen 
            ? "w-full h-full m-0 rounded-none" 
            : "mx-4 md:mx-12 mb-8 md:mb-12 rounded-[1.5rem] md:rounded-[2rem] aspect-video shadow-2xl ring-1 ring-white/10"
          }`}
      >
        <video
          ref={videoRef}
          className="w-full h-full object-contain cursor-pointer"
          poster={poster}
          playsInline // Important for mobile browsers
          onClick={togglePlay}
        >
          <source src={src} type="video/mp4" />
        </video>

        {/* Central Play Overlay */}
        <AnimatePresence>
          {!isPlaying && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] z-20"
              onClick={togglePlay}
            >
              <div className="w-16 h-16 md:w-24 md:h-24 bg-white text-black rounded-full flex items-center justify-center shadow-2xl transition-transform active:scale-95 md:hover:scale-110">
                <Play className="fill-black ml-1 w-6 h-6 md:w-8 md:h-8" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls Overlay */}
        <div className={`absolute bottom-0 left-0 right-0 p-4 md:p-8 bg-gradient-to-t from-black/95 via-black/50 to-transparent transition-all duration-500 z-30
          ${(showControls || !isPlaying) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"} 
          md:group-hover/video:opacity-100 md:group-hover/video:translate-y-0`}
        >
          
          {/* Progress Bar */}
          <div className="relative mb-4 md:mb-6 h-1.5 w-full bg-white/20 rounded-full">
            <input
              type="range"
              className="absolute w-full h-full opacity-0 z-40 cursor-pointer"
              min="0"
              max={duration || 0}
              step="0.1"
              value={progress}
              onChange={handleProgressChange}
              onClick={(e) => e.stopPropagation()}
            />
            <div 
              className="h-full bg-emerald-500 rounded-full relative"
              style={{ width: `${(progress / duration) * 100}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg" />
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 md:gap-6">
              <button onClick={togglePlay} className="text-white hover:text-emerald-400">
                {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
              </button>

              <div className="hidden xs:flex gap-2 md:gap-4">
                <button onClick={(e) => skip(e, -10)} className="text-white/60 hover:text-white"><RotateCcw size={20} /></button>
                <button onClick={(e) => skip(e, 10)} className="text-white/60 hover:text-white"><RotateCw size={20} /></button>
              </div>

              <span className="text-white text-[10px] md:text-[11px] font-bold tracking-widest tabular-nums whitespace-nowrap">
                {currentTime} <span className="mx-1 md:mx-2 text-emerald-500/50">/</span> {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-3 md:gap-6">
              {/* Volume - Hide slider on small mobile to save space */}
              <div className="flex items-center gap-2 md:gap-3 bg-white/10 px-2 md:px-4 py-2 rounded-xl md:rounded-2xl border border-white/10">
                <button onClick={toggleMute} className="text-white/60 hover:text-white">
                  {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    setVolume(e.target.value);
                    videoRef.current.volume = e.target.value;
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="hidden sm:block w-16 md:w-20 h-1 accent-emerald-500"
                />
              </div>

              <button onClick={toggleFullScreen} className="text-white/60 hover:text-white transition-colors">
                {isFullscreen ? <Minimize size={22} /> : <Maximize size={22} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default VideoPlayer;