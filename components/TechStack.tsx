"use client";

import React from "react";
import type { TechCategory } from "@/data/portfolio";
import IconMapper from "@/components/IconMapper";

interface TechStackProps {
  techStack: TechCategory[];
}

export default function TechStack({ techStack }: TechStackProps) {
  const categories = techStack;

  return (
    <section id="stack" className="py-24 relative overflow-hidden bg-[#030303]">
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-mono tracking-widest text-purple-400 uppercase mb-3">
            05 // Toolkit
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display">
            Technical Capabilities
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, idx) => (
            <div
              key={idx}
              className="glass-panel p-8 rounded-3xl glow-card hover:border-zinc-700/80 transition-all duration-300"
            >
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-purple-400">
                  <IconMapper name={category.icon} className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-white text-sm tracking-wide uppercase">
                  {category.title}
                </h4>
              </div>

              {/* Skills Tags list */}
              <div className="flex flex-wrap gap-2.5">
                {category.skills.map((skill, sIdx) => (
                  <span
                    key={sIdx}
                    className="px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-900 text-xs font-mono text-zinc-300 hover:text-white hover:border-zinc-800 transition-colors cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
