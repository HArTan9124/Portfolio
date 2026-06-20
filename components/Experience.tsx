"use client";

import React from "react";
import { Calendar, MapPin } from "lucide-react";
import type { ExperienceItem } from "@/data/portfolio";
import IconMapper from "@/components/IconMapper";

interface ExperienceProps {
  experiences: ExperienceItem[];
}

export default function Experience({ experiences }: ExperienceProps) {

  return (
    <section id="experience" className="py-24 relative overflow-hidden bg-[#030303]">
      {/* Subtle timeline track overlay */}
      <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-zinc-800/60 hidden md:block" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-xs font-mono tracking-widest text-purple-400 uppercase mb-3">
            02 // Journey
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display">
            Professional Timeline
          </h3>
        </div>

        <div className="flex flex-col gap-12 relative">
          {experiences.map((exp, idx) => (
            <div
              key={idx}
              className={`flex flex-col md:flex-row md:justify-between items-stretch gap-6 md:gap-0 ${
                idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Card Container */}
              <div className="w-full md:w-[46%]">
                <div className="glass-panel p-8 rounded-3xl glow-card hover:border-zinc-700/80 transition-all duration-300">
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                    <div>
                      <h4 className="text-lg font-bold text-white leading-tight">
                        {exp.role}
                      </h4>
                      <p className="text-zinc-400 text-sm mt-1">{exp.company}</p>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-950 border border-zinc-800 text-xs text-zinc-400 self-start font-mono">
                      <Calendar className="w-3.5 h-3.5" />
                      {exp.duration}
                    </div>
                  </div>

                  {/* Highlights list */}
                  <ul className="space-y-3.5 text-zinc-400 text-sm">
                    {exp.highlights.map((highlight, hIdx) => (
                      <li key={hIdx} className="flex gap-2.5 items-start leading-relaxed">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Metadata location */}
                  <div className="mt-6 pt-4 border-t border-zinc-800/60 flex items-center gap-1.5 text-zinc-500 text-xs font-mono">
                    <MapPin className="w-3.5 h-3.5" />
                    {exp.location}
                  </div>
                </div>
              </div>

              {/* Timeline Center Node */}
              <div className="hidden md:flex items-center justify-center w-12 z-20">
                <div className="w-8 h-8 rounded-full bg-[#030303] border-2 border-zinc-800 flex items-center justify-center shadow-lg text-purple-400">
                  <IconMapper name={exp.icon} className="w-4 h-4" />
                </div>
              </div>

              {/* Empty space for design symmetry */}
              <div className="hidden md:block w-[46%]" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
