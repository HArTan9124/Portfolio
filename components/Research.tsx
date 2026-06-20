"use client";

import React from "react";
import { BookOpen } from "lucide-react";
import type { ResearchItem } from "@/data/portfolio";

interface ResearchProps {
  research: ResearchItem[];
}

export default function Research({ research }: ResearchProps) {
  const researchInterests = research;

  // Custom premium illustrations for each research card
  const illustrations = [
    // Card 1: Bio-Sensing (Pulsing heart sensor)
    <svg key="1" className="w-20 h-20 text-purple-400 opacity-80 mb-6 drop-shadow-[0_0_15px_rgba(168,85,247,0.3)] animate-pulse" viewBox="0 0 100 100" fill="none">
      <path d="M10 50 H35 L42 20 L48 80 L55 50 H90" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="48" cy="80" r="4" fill="currentColor" />
      <circle cx="42" cy="20" r="4" fill="currentColor" />
    </svg>,
    // Card 2: Edge ML (Neural Network Node Graph)
    <svg key="2" className="w-20 h-20 text-blue-400 opacity-80 mb-6 drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]" viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="20" r="6" stroke="currentColor" strokeWidth="2" />
      <circle cx="25" cy="50" r="6" stroke="currentColor" strokeWidth="2" />
      <circle cx="75" cy="50" r="6" stroke="currentColor" strokeWidth="2" />
      <circle cx="50" cy="80" r="6" stroke="currentColor" strokeWidth="2" />
      <line x1="50" y1="26" x2="25" y2="44" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
      <line x1="50" y1="26" x2="75" y2="44" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
      <line x1="25" y1="56" x2="50" y2="74" stroke="currentColor" strokeWidth="2" />
      <line x1="75" y1="56" x2="50" y2="74" stroke="currentColor" strokeWidth="2" />
      <line x1="50" y1="26" x2="50" y2="74" stroke="currentColor" strokeWidth="2" />
      {/* Blinking signal nodes */}
      <circle cx="50" cy="50" r="3" fill="#a855f7" className="animate-ping" />
    </svg>,
    // Card 3: IoT Mesh (Wireless Hub network nodes)
    <svg key="3" className="w-20 h-20 text-pink-400 opacity-80 mb-6 drop-shadow-[0_0_15px_rgba(236,72,153,0.3)]" viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="8" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="50" cy="50" r="2" fill="currentColor" />
      <circle cx="50" cy="50" r="22" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="animate-[spin_40s_linear_infinite]" />
      <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="0.5" />
      {/* Remote node links */}
      <circle cx="20" cy="30" r="4" fill="currentColor" />
      <circle cx="80" cy="35" r="4" fill="currentColor" />
      <circle cx="35" cy="80" r="4" fill="currentColor" />
      <line x1="50" y1="50" x2="20" y2="30" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
      <line x1="50" y1="50" x2="80" y2="35" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
      <line x1="50" y1="50" x2="35" y2="80" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
    </svg>
  ];

  return (
    <section id="research" className="py-32 relative overflow-hidden bg-[#030303]">
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Title Section with Serif Italic font mix */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-xs font-mono tracking-widest text-purple-400 uppercase mb-4">
            04 // Academics
          </h2>
          <h3 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Scientific Pillars &{" "}
            <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400">
              Investigation Areas
            </span>
          </h3>
        </div>

        {/* 3 editorial columns (Inspired by Image 2) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {researchInterests.map((interest, idx) => (
            <div
              key={idx}
              className="glass-panel p-8 sm:p-10 rounded-3xl glow-card hover:border-zinc-800 transition-all duration-500 flex flex-col justify-between relative overflow-hidden group"
            >
              {/* Subtle backglow unique to each card */}
              <div className={`absolute -bottom-20 -left-20 w-44 h-44 rounded-full blur-[80px] pointer-events-none transition-opacity duration-500 opacity-40 group-hover:opacity-75 ${
                idx === 0 ? "bg-purple-500/10" : idx === 1 ? "bg-blue-500/10" : "bg-pink-500/10"
              }`} />

              <div>
                {/* Premium Editorial Bracketed Badge */}
                <div className="font-serif italic text-purple-400 text-sm sm:text-base mb-6 tracking-wide font-normal">
                  [ {interest.title.split(" & ")[0]} ]
                </div>

                {/* Floating Vector Illustration */}
                <div className="flex justify-start">
                  {illustrations[idx]}
                </div>

                {/* Subtitle / Label */}
                <h5 className="text-[10px] text-zinc-500 font-mono tracking-wider mb-2">
                  {interest.subtitle}
                </h5>

                {/* Main Heading */}
                <h4 className="text-lg sm:text-xl font-bold text-white leading-snug mb-4">
                  {interest.title}
                </h4>

                {/* Description */}
                <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                  {interest.desc}
                </p>
              </div>

              {/* Research Status footer */}
              <div className="mt-8 pt-4 border-t border-zinc-950 flex items-center justify-between text-zinc-500 text-xs font-mono">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-purple-400/80" />
                  Active Investigation
                </span>
                <span>{interest.id}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

