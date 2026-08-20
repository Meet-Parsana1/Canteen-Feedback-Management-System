import React, { useState, useEffect } from "react";
import { FaStar, FaUtensils, FaCheckCircle } from "react-icons/fa";

const CANTEEN_SLOGANS = [
  { text: "Simmering today's canteen insights...", icon: "🍲", detail: "Aggregating student dining feedback" },
  { text: "Setting the dining table...", icon: "🍽️", detail: "Organizing taste & hygiene metrics" },
  { text: "Gathering student ratings...", icon: "⭐", detail: "Calculating category benchmarks" },
  { text: "Plating fresh analytics...", icon: "📊", detail: "Compiling real-time dashboard data" },
  { text: "Refining the campus experience...", icon: "✨", detail: "Serving actionable improvements" },
];

export default function CanteenLoader({
  fullScreen = true,
  text = null,
  subtext = null,
  size = "md", // "sm" | "md" | "lg"
}) {
  const [sloganIndex, setSloganIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSloganIndex((prev) => (prev + 1) % CANTEEN_SLOGANS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const currentSlogan = CANTEEN_SLOGANS[sloganIndex];
  const displayText = text || currentSlogan.text;
  const displaySubtext = subtext || currentSlogan.detail;

  return (
    <div
      className={`${
        fullScreen
          ? "fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md"
          : "w-full py-12 flex items-center justify-center"
      } transition-all duration-300 animate-fadeIn`}
    >
      <div className="relative mx-4 max-w-sm sm:max-w-md w-full bg-white/95 backdrop-blur-xl rounded-3xl p-7 sm:p-9 shadow-2xl border border-teal-100 text-center flex flex-col items-center animate-pulse-subtle">
        
        {/* Decorative soft glowing back-aura */}
        <div className="absolute -top-8 -left-8 w-32 h-32 bg-teal-300/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-emerald-300/20 rounded-full blur-2xl pointer-events-none" />

        {/* TOP BRAND PILL */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/80 text-teal-700 text-[11px] font-bold uppercase tracking-wider mb-5">
          <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
          <span>Canteen<span className="text-teal-900">IQ</span> Live</span>
        </div>

        {/* STEAMING CLOCHE / SERVING DOME ILLUSTRATION */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 mb-4 flex items-center justify-center">
          
          {/* Steam particle ribbons */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-2 pointer-events-none z-10">
            <span className="text-teal-400 font-bold text-lg animate-steam-1 select-none">~</span>
            <span className="text-teal-500 font-bold text-2xl animate-steam-2 select-none">~</span>
            <span className="text-emerald-400 font-bold text-lg animate-steam-3 select-none">~</span>
          </div>

          {/* SVG Animated Canteen Cloche & Tray */}
          <div className="relative w-full h-full flex items-center justify-center">
            
            {/* Cloche Lid (Bouncing / Wobbling) */}
            <div className="animate-cloche">
              <svg viewBox="0 0 100 80" className="w-24 h-20 sm:w-28 sm:h-24 drop-shadow-md">
                <defs>
                  {/* Metallic Teal Gradient */}
                  <linearGradient id="clocheGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#14b8a6" />
                    <stop offset="50%" stopColor="#0d9488" />
                    <stop offset="100%" stopColor="#0f766e" />
                  </linearGradient>
                  {/* Metallic Handle Gradient */}
                  <linearGradient id="handleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#fef08a" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                </defs>

                {/* Handle / Knob */}
                <circle cx="50" cy="18" r="5" fill="url(#handleGrad)" stroke="#d97706" strokeWidth="1" />
                <rect x="47.5" y="22" width="5" height="4" rx="1.5" fill="#d97706" />

                {/* Dome Lid */}
                <path
                  d="M 16 54 C 16 28, 84 28, 84 54 Z"
                  fill="url(#clocheGrad)"
                  stroke="#115e59"
                  strokeWidth="1.5"
                />

                {/* Cloche rim highlight */}
                <path
                  d="M 18 48 C 30 35, 70 35, 82 48"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.45)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                {/* Crossed Utensil / Chef Badge on Dome */}
                <circle cx="50" cy="42" r="7" fill="rgba(255, 255, 255, 0.2)" />
                <path
                  d="M 46 38 L 54 46 M 54 38 L 46 46"
                  stroke="#ffffff"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Serving Plate / Base Tray (Glowing) */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 sm:w-32 h-4 bg-gradient-to-r from-slate-300 via-teal-100 to-slate-300 rounded-full border border-teal-300/80 shadow-md animate-plate-glow flex items-center justify-center">
              <div className="w-16 h-1 bg-teal-500/40 rounded-full" />
            </div>
          </div>
        </div>

        {/* ANIMATED 5-STAR FEEDBACK POPPERS */}
        <div className="flex items-center justify-center gap-1.5 text-amber-400 text-sm mb-4">
          <span className="animate-star-1 inline-block"><FaStar /></span>
          <span className="animate-star-2 inline-block"><FaStar /></span>
          <span className="animate-star-3 inline-block"><FaStar /></span>
          <span className="animate-star-4 inline-block"><FaStar /></span>
          <span className="animate-star-5 inline-block"><FaStar /></span>
        </div>

        {/* DYNAMIC CANTEEN MESSAGE */}
        <div className="space-y-1 mb-5 min-h-[52px] flex flex-col justify-center">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl animate-bounce">{currentSlogan.icon}</span>
            <h3 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight transition-all duration-300">
              {displayText}
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            {displaySubtext}
          </p>
        </div>

        {/* PROGRESS SHIMMER BAR */}
        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden mb-3">
          <div className="w-full h-full animate-progress-shimmer rounded-full" />
        </div>

        {/* FOOTER HINT */}
        <div className="flex items-center justify-between w-full text-[11px] text-slate-400 font-medium pt-1">
          <span className="flex items-center gap-1">
            <FaUtensils className="text-[10px] text-teal-600" />
            <span>Serving Quality</span>
          </span>
          <span className="text-teal-600 font-semibold">Loading...</span>
        </div>

      </div>
    </div>
  );
}
