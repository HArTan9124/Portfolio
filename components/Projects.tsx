"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, ExternalLink, CheckCircle2, Zap, Clock, ChevronRight } from "lucide-react";
import type { ProjectItem } from "@/data/portfolio";
import IconMapper from "@/components/IconMapper";

// ─── Status badge config ────────────────────────────────────────────────────
const STATUS_CONFIG = {
  Active: {
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/25",
    dot: "bg-emerald-400",
    icon: Zap,
  },
  Completed: {
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/25",
    dot: "bg-blue-400",
    icon: CheckCircle2,
  },
  "In Development": {
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/25",
    dot: "bg-amber-400",
    icon: Clock,
  },
} as const;

// ─── Tag accent colours (cycles) ────────────────────────────────────────────
const TAG_PALETTE = [
  "bg-purple-500/10 border-purple-500/25 text-purple-300",
  "bg-cyan-500/10 border-cyan-500/25 text-cyan-300",
  "bg-blue-500/10 border-blue-500/25 text-blue-300",
  "bg-emerald-500/10 border-emerald-500/25 text-emerald-300",
  "bg-amber-500/10 border-amber-500/25 text-amber-300",
];

// ─── Card component ──────────────────────────────────────────────────────────
function ProjectCard({
  project,
  index,
  isFeatured,
}: {
  project: ProjectItem;
  index: number;
  isFeatured: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const status = STATUS_CONFIG[project.status];
  const StatusIcon = status.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative group flex flex-col rounded-2xl border transition-all duration-500 overflow-hidden
        ${isFeatured
          ? "border-purple-500/20 bg-gradient-to-br from-zinc-900/90 via-zinc-900/70 to-purple-950/20"
          : "border-zinc-800/50 bg-zinc-900/40"
        }
        backdrop-blur-xl
        hover:border-purple-500/40
        hover:shadow-[0_0_60px_rgba(168,85,247,0.08),0_20px_60px_rgba(0,0,0,0.4)]
      `}
    >
      {/* Animated gradient overlay on hover */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-2xl"
        animate={{
          opacity: hovered ? 1 : 0,
          background: hovered
            ? "radial-gradient(ellipse at 0% 0%, rgba(168,85,247,0.07) 0%, transparent 60%)"
            : "transparent",
        }}
        transition={{ duration: 0.4 }}
      />

      {/* Featured accent bar */}
      {isFeatured && (
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/60 to-transparent" />
      )}

      {/* Card content */}
      <div className="relative z-10 flex flex-col h-full p-7">
        {/* ── Header row ── */}
        <div className="flex items-start justify-between gap-4 mb-6">
          {/* Icon + Category */}
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 transition-all duration-300
                ${isFeatured
                  ? "bg-purple-500/15 border-purple-500/30 text-purple-400 group-hover:bg-purple-500/25"
                  : "bg-zinc-800/60 border-zinc-700/50 text-zinc-400 group-hover:text-purple-400 group-hover:border-purple-500/30"
                }`}
            >
              <IconMapper name={project.icon} className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase mb-0.5">
                {project.category}
              </p>
              <h4 className="text-lg font-bold text-white leading-snug">
                {project.title}
              </h4>
            </div>
          </div>

          {/* Status badge */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-mono shrink-0 ${status.bg} ${status.color}`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full shrink-0 ${status.dot} ${
                project.status === "Active" ? "animate-pulse" : ""
              }`}
            />
            {project.status}
          </div>
        </div>

        {/* ── Description ── */}
        <p className="text-zinc-400 text-sm leading-relaxed mb-6">
          {project.desc}
        </p>

        {/* ── Highlights ── */}
        <div className="mb-6">
          <p className="text-[10px] font-mono tracking-widest text-zinc-600 uppercase mb-3">
            Key Achievements
          </p>
          <ul className="grid grid-cols-1 gap-2">
            {project.highlights.map((h, i) => (
              <li key={i} className="flex items-center gap-2.5 text-sm text-zinc-300">
                <ChevronRight className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                {h}
              </li>
            ))}
          </ul>
        </div>

        {/* ── Spacer pushes footer to bottom ── */}
        <div className="flex-1" />

        {/* ── Tech tags ── */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map((tag, i) => (
            <span
              key={i}
              className={`px-2.5 py-1 rounded-md border text-[11px] font-mono ${TAG_PALETTE[i % TAG_PALETTE.length]}`}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* ── Footer links ── */}
        <div className="flex items-center gap-3 pt-5 border-t border-zinc-800/60">
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800/60 hover:bg-zinc-700/60 border border-zinc-700/50 hover:border-zinc-600/60 text-zinc-300 hover:text-white text-xs font-mono transition-all duration-200"
          >
            <Github className="w-3.5 h-3.5" />
            GitHub
          </a>
          {project.demo !== "#" ? (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 hover:border-purple-500/50 text-purple-300 hover:text-purple-200 text-xs font-mono transition-all duration-200"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Live Demo
            </a>
          ) : (
            <span className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800/30 border border-zinc-800/40 text-zinc-600 text-xs font-mono cursor-default">
              <ExternalLink className="w-3.5 h-3.5" />
              Demo Soon
            </span>
          )}

          {/* Featured pill */}
          {isFeatured && (
            <span className="ml-auto text-[10px] font-mono tracking-widest text-purple-400/70 uppercase">
              ★ Featured
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Section ─────────────────────────────────────────────────────────────────
interface ProjectsProps {
  projects: ProjectItem[];
}

export default function Projects({ projects }: ProjectsProps) {
  const featured = projects.filter((p) => p.featured);
  const others = projects.filter((p) => !p.featured);

  return (
    <section id="projects" className="py-28 relative overflow-hidden bg-[#030303]">
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[120px]" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6"
        >
          <div>
            <p className="text-[10px] font-mono tracking-[0.25em] text-purple-400 uppercase mb-3">
              03 // Engineering
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
              Featured{" "}
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Projects
              </span>
            </h2>
          </div>
          <p className="text-zinc-500 text-sm font-mono max-w-xs leading-relaxed">
            // Systems built at the intersection of AI, hardware and human health
          </p>
        </motion.div>

        {/* ── Featured row (2 cols on md+) ── */}
        {featured.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {featured.map((project, i) => (
              <ProjectCard
                key={project.title}
                project={project}
                index={i}
                isFeatured
              />
            ))}
          </div>
        )}

        {/* ── Secondary row (3 cols on lg+) ── */}
        {others.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {others.map((project, i) => (
              <ProjectCard
                key={project.title}
                project={project}
                index={featured.length + i}
                isFeatured={false}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
