"use client";

import React from "react";
import type { AchievementItem } from "@/data/portfolio";
import IconMapper from "@/components/IconMapper";

interface AchievementsProps {
  achievements: AchievementItem[];
}

export default function Achievements({ achievements }: AchievementsProps) {

  return (
    <section id="achievements" className="py-24 relative overflow-hidden bg-[#030303]">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-mono tracking-widest text-purple-400 uppercase mb-3">
            06 // Recognition
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display">
            Honors & Publications
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {achievements.map((ach, idx) => (
            <div
              key={idx}
              className="glass-panel p-8 rounded-3xl glow-card hover:border-zinc-700/80 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Category Header */}
                <div className="flex items-center justify-between mb-6">
                  <span className="px-2.5 py-1 rounded bg-zinc-950 border border-zinc-900 text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                    {ach.category}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-850 flex items-center justify-center text-purple-400">
                    <IconMapper name={ach.icon} className="w-5 h-5" />
                  </div>
                </div>

                {/* Title */}
                <h4 className="text-base font-bold text-white mb-3">
                  {ach.title}
                </h4>

                {/* Description */}
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {ach.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
