"use client";

import React from "react";
import { ArrowUpRight, Calendar, Clock } from "lucide-react";
import type { BlogPost } from "@/data/portfolio";

interface BlogProps {
  blog: BlogPost[];
}

export default function Blog({ blog }: BlogProps) {
  const posts = blog;

  return (
    <section id="blog" className="py-24 relative overflow-hidden bg-[#030303]">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div>
            <h2 className="text-xs font-mono tracking-widest text-purple-400 uppercase mb-3">
              07 // Writing
            </h2>
            <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display">
              Research & Dev Logs
            </h3>
          </div>
          <p className="text-zinc-500 text-sm mt-4 md:mt-0 font-mono">
            // Documenting experiments and engineering patterns
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post, idx) => (
            <a
              key={idx}
              href="#"
              className="glass-panel p-8 rounded-3xl glow-card hover:border-zinc-700/80 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Meta details */}
                <div className="flex items-center gap-4 text-xs font-mono text-zinc-500 mb-6">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {post.readTime}
                  </span>
                </div>

                {/* Title */}
                <h4 className="text-lg font-bold text-white mb-3 group-hover:text-purple-400 transition-colors flex items-center justify-between">
                  {post.title}
                  <ArrowUpRight className="w-4 h-4 text-zinc-650 group-hover:text-purple-450 transition-colors" />
                </h4>

                {/* Description */}
                <p className="text-zinc-405 text-sm leading-relaxed mb-6">
                  {post.desc}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-zinc-900">
                {post.tags.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-2.5 py-1 rounded bg-zinc-950 border border-zinc-900 text-[10px] text-zinc-400 font-mono"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
