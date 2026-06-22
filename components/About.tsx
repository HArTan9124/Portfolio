"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Cpu, RefreshCw, Activity, Terminal, Shield, Sparkles } from "lucide-react";
import type { Profile, Specialty } from "@/data/portfolio";
import IconMapper from "@/components/IconMapper";

interface AboutProps {
  profile: Profile;
  specialties: Specialty[];
}

export default function About({ profile, specialties }: AboutProps) {
  const { researchPhilosophy, researchFocus, stats, name, heroSubtitle } = profile;

  // Signal filter state (Raw vs Filtered)
  const [isFiltered, setIsFiltered] = useState(false);

  // Live Terminal Log state
  const [logs, setLogs] = useState<string[]>([
    "INIT: Core sensor polling layer initialized.",
    "CONNECT: Handshake completed with WearOS node #092.",
    "BUFFER: Butterworth filter coefficients allocated.",
    "CLASSIFIER: Dynamic threshold set to 0.82 magnitude."
  ]);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Append new logs dynamically to simulate sensor activity
  useEffect(() => {
    const sensorEvents = [
      "CLASSIFICATION: Gait pattern classified as STABLE.",
      "TELEMETRY: Streamed 100Hz IMU packets (Packet loss: 0.0%)",
      "BATTERY: Current draw 4.2mA (Low power mode active)",
      "ANOMALY: Accelerometer vector spike detected (Transient impact - ignored)",
      "ALERT: Fall index check 0.14 (Threshold: 0.85)",
      "BUFFER: Clearing oldest 500 samples from sliding window."
    ];

    const interval = setInterval(() => {
      setLogs((prev) => {
        const nextLog = sensorEvents[Math.floor(Math.random() * sensorEvents.length)];
        const timestamp = new Date().toLocaleTimeString();
        const updated = [...prev.slice(-6), `[${timestamp}] ${nextLog}`];
        return updated;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Scroll to bottom of terminal
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <section id="about" className="py-32 relative overflow-hidden bg-[#030303]">
      {/* Dynamic Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Title Section with Serif Italic font mix */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-xs font-mono tracking-widest text-purple-400 uppercase mb-4">
            01 // Research overview
          </h2>
          <h3 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            {heroSubtitle?.split(" ").slice(0, -3).join(" ") || "Architecting Systems at the"}{" "}
            <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400">
              {heroSubtitle?.split(" ").slice(-3).join(" ") || "Edge of Care"}
            </span>
          </h3>
        </div>

        {/* Bento Grid Layout (Inspired by Bento Product Highlight) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          {/* Card 1: Research Philosophy (Spans 8 columns on large screens) */}
          <div className="lg:col-span-8 glass-panel p-8 sm:p-10 rounded-3xl glow-card flex flex-col justify-between min-h-[350px]">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                  <Award className="w-4 h-4 text-purple-400" />
                </div>
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-500">Core Mission</span>
              </div>
              <h4 className="text-xl sm:text-2xl font-bold text-white mb-5 leading-snug">
                Research Philosophy
              </h4>
              <p className="text-zinc-400 leading-relaxed text-base sm:text-lg max-w-3xl">
                {researchPhilosophy}
              </p>
            </div>
            {/* Embedded Live Stats Grid */}
            <div className="mt-8 pt-6 border-t border-zinc-900 grid grid-cols-1 sm:grid-cols-3 gap-6">
              {stats.map((stat, idx) => (
                <div key={idx} className="flex flex-col">
                  <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{stat.value}</p>
                  <p className="text-[10px] sm:text-xs text-zinc-500 font-mono tracking-wider mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Interactive Signal Filter Switcher (Spans 4 columns) */}
          <div className="lg:col-span-4 glass-panel p-8 rounded-3xl glow-card flex flex-col justify-between min-h-[350px]">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-mono text-zinc-400">SIGNAL PROCESSOR</span>
                </div>
                {/* Active Indicator */}
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>

              <h4 className="text-lg font-bold text-white mb-2">Live Waveform Mode</h4>
              <p className="text-zinc-500 text-xs leading-relaxed mb-6">
                Toggle the Butterworth low-pass filter to observe immediate high-frequency noise cancellation.
              </p>

              {/* Waveform Visualization Panel */}
              <div className="h-28 bg-zinc-950/80 border border-zinc-900 rounded-2xl flex items-center justify-center overflow-hidden relative p-2">
                <svg className="w-full h-full" viewBox="0 0 200 80">
                  <AnimatePresence mode="wait">
                    {isFiltered ? (
                      <motion.path
                        key="filtered"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        d="M0,40 Q25,10 50,40 T100,40 T150,40 T200,40"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2.5"
                      />
                    ) : (
                      <motion.path
                        key="raw"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        d="M0,40 L10,30 L15,50 L20,35 L25,55 L30,40 L40,10 L50,70 L60,40 L70,38 L75,45 L80,20 L85,60 L90,40 L100,40 L110,32 L115,48 L120,38 L125,52 L130,40 L140,15 L150,68 L160,40 L170,35 L175,42 L180,18 L185,62 L190,40 L200,40"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="1.5"
                      />
                    )}
                  </AnimatePresence>
                </svg>

                {/* Live label overlay */}
                <div className="absolute top-2 right-3 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[8px] font-mono">
                  {isFiltered ? (
                    <span className="text-emerald-400">FILTERED // BUTTERWORTH</span>
                  ) : (
                    <span className="text-red-400">RAW SENSOR IMPULSE</span>
                  )}
                </div>
              </div>
            </div>

            {/* Filter Toggle Controls (Inspired by Light/Dark switch layout) */}
            <div className="flex gap-2 bg-zinc-950 p-1.5 rounded-xl border border-zinc-900 mt-6 select-none">
              <button
                onClick={() => setIsFiltered(false)}
                className={`flex-1 py-2 text-center text-xs font-mono rounded-lg transition-all duration-300 ${
                  !isFiltered ? "bg-zinc-900 border border-zinc-800 text-red-400 shadow-sm" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                Raw Data
              </button>
              <button
                onClick={() => setIsFiltered(true)}
                className={`flex-1 py-2 text-center text-xs font-mono rounded-lg transition-all duration-300 ${
                  isFiltered ? "bg-zinc-900 border border-zinc-800 text-emerald-400 shadow-sm" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                Filtered
              </button>
            </div>
          </div>
        </div>

        {/* Bento Grid Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Card 3: Live Wearable IoT Dashboard Simulator (Spans 7 columns) */}
          <div className="lg:col-span-7 glass-panel p-8 rounded-3xl glow-card flex flex-col justify-between min-h-[350px]">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <Terminal className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-500">Node telemetry logs</span>
              </div>
              <h4 className="text-lg font-bold text-white mb-2">On-wrist Telemetry Terminal</h4>
              <p className="text-zinc-500 text-xs leading-relaxed mb-6">
                Live simulated stream from active ESP32 edge router node parsing accelerometer and bio-electric packets.
              </p>

              {/* Scrolling Terminal Output */}
              <div
                ref={logContainerRef}
                className="h-44 bg-zinc-950/90 border border-zinc-900 rounded-2xl p-4 font-mono text-[10px] sm:text-xs text-zinc-400 overflow-y-auto flex flex-col gap-1.5 scrollbar-thin scrollbar-thumb-zinc-800"
              >
                {logs.map((log, idx) => (
                  <div key={idx} className="flex gap-2">
                    <span className="text-purple-500 select-none">❯</span>
                    <span className="whitespace-pre-wrap select-text">{log}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Micro details at bottom */}
            <div className="flex justify-between items-center text-[10px] font-mono text-zinc-600 mt-6 border-t border-zinc-950 pt-4">
              <span>ACTIVE CONNECTED MESH: 3 NODES</span>
              <span>JNI BINDINGS: SECURE</span>
            </div>
          </div>

          {/* Card 4: Specialties/Research Focus (Spans 5 columns) */}
          <div className="lg:col-span-5 glass-panel p-8 rounded-3xl glow-card flex flex-col justify-between min-h-[350px]">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Cpu className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-500">Core Investigation</span>
              </div>
              <h4 className="text-lg font-bold text-white mb-3">Research Focus</h4>
              <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                {researchFocus}
              </p>
            </div>

            {/* Static Code Syntax Block (Matches structural block in reference) */}
            <div className="bg-zinc-950/80 border border-zinc-900 rounded-2xl p-5 font-mono text-[10px] sm:text-xs text-zinc-500 leading-relaxed select-text">
              <span className="text-purple-400">const</span> researcher = &#123;<br />
              &nbsp;&nbsp;name: <span className="text-emerald-400">"{name}"</span>,<br />
              &nbsp;&nbsp;focus: <span className="text-emerald-400">"Wearable Health AI"</span>,<br />
              &nbsp;&nbsp;stack: [<span className="text-emerald-400">"WearOS"</span>, <span className="text-emerald-400">"TFLite"</span>, <span className="text-emerald-400">"ESP-IDF"</span>]<br />
              &#125;;
            </div>
          </div>
        </div>

        {/* Specialized Capability Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {specialties.map((item, idx) => (
            <div
              key={idx}
              className="glass-panel glass-panel-hover p-6 rounded-2xl flex flex-col items-start text-left transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-850 flex items-center justify-center mb-5 text-purple-400">
                <IconMapper name={item.icon} className="w-5 h-5" />
              </div>
              <h5 className="text-base font-bold text-white mb-2">{item.title}</h5>
              <p className="text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

