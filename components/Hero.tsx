"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Check, Activity, Heart, RefreshCw, Layers } from "lucide-react";
import type { Profile } from "@/data/portfolio";

interface HeroProps {
  profile: Profile;
}

export default function Hero({ profile }: HeroProps) {
  const { tagline, bio } = profile;
  const [pulseVal, setPulseVal] = useState(72);
  const [activeTab, setActiveTab] = useState("model.py");

  // Simulate real-time heart rate update
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseVal((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2;
        const next = prev + delta;
        return next > 95 || next < 60 ? 72 : next;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // Split tagline to italicize the final words for the editorial layout
  const words = tagline.split(" ");
  const accentLength = 3;
  const prefix = words.slice(0, words.length - accentLength).join(" ");
  const suffix = words.slice(words.length - accentLength).join(" ");

  const researchPillars = [
    "On-device neural network deployment (TFLite, ONNX)",
    "Real-time biosignal telemetry (EEG, ECG, PPG)",
    "Ultra-low latency wearable mesh communication",
    "Clinical-grade sensor fusion & anomaly detection",
    "Energy-efficient WearOS & WatchOS compilation"
  ];

  const codeFiles = {
    "model.py": `import tensorflow as tf

class BiosignalNet(tf.keras.Model):
    def __init__(self):
        super().__init__()
        # Conv1D for temporal feature extraction
        self.conv1 = tf.keras.layers.Conv1D(32, 3, activation='relu')
        self.lstm = tf.keras.layers.LSTM(64)
        self.dense = tf.keras.layers.Dense(1, activation='sigmoid')

    def call(self, x):
        x = self.conv1(x)
        x = self.lstm(x)
        return self.dense(x)

# Model optimized for edge inference
model = BiosignalNet()
converter = tf.lite.TFLiteConverter.from_keras_model(model)
tflite_model = converter.convert()`,
    "wearos.kt": `package com.harshit.wearable.sensor

import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener

class WearSensorService : SensorEventListener {
    override fun onSensorChanged(event: SensorEvent) {
        if (event.sensor.type == Sensor.TYPE_ACCELEROMETER) {
            val (x, y, z) = event.values
            // Instantaneous vector magnitude
            val accMagnitude = Math.sqrt((x*x + y*y + z*z).toDouble())
            EdgeClassifier.push(accMagnitude)
        }
    }
}`
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center pt-32 pb-24 overflow-hidden cyber-grid radial-glow"
    >
      {/* Background radial overlays */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[140px] animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[140px] animate-pulse-slow pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center z-10 w-full">
        {/* Left Column: Title, Editorial Subtitle, Checkmarks, Tech Badges */}
        <div className="lg:col-span-6 flex flex-col items-start text-left">
          {/* Top Status Pill */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-300 mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            <span>Wearable Computing Researcher & Engineer</span>
          </motion.div>

          {/* Heading with Serif Italic font mix */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-4xl sm:text-5xl lg:text-[54px] font-bold tracking-tight leading-[1.1] text-white mb-6"
          >
            {prefix}{" "}
            <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 tracking-wide block sm:inline">
              {suffix}
            </span>
          </motion.h1>

          {/* Bio / Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
            className="text-base sm:text-lg text-zinc-400 mb-8 leading-relaxed max-w-xl"
          >
            {bio}
          </motion.p>

          {/* Features Checklist (Inspired by MacOS UI Kit Checklist) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="flex flex-col gap-3.5 mb-10 w-full"
          >
            {researchPillars.map((pillar, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mt-1 text-purple-400 flex-shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="text-zinc-300 text-sm sm:text-base leading-snug">{pillar}</span>
              </div>
            ))}
          </motion.div>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-10"
          >
            <a
              href="#projects"
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-black font-semibold hover:bg-zinc-200 transition-all duration-300 shadow-[0_4px_25px_rgba(168,85,247,0.25)] group"
            >
              Explore Systems
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a
              href="#contact"
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-semibold hover:bg-zinc-850 hover:border-zinc-700 transition-all duration-300"
            >
              Collaboration Request
            </a>
          </motion.div>

          {/* Circular Stack Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="flex flex-col gap-3"
          >
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">Core Stack</span>
            <div className="flex flex-wrap gap-3">
              {["Android", "PyTorch", "WearOS", "TensorFlow Lite", "Flutter", "Figma"].map((tech, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 text-xs font-mono rounded-full bg-zinc-950 border border-zinc-850 text-zinc-400 flex items-center gap-1.5 hover:border-purple-500/30 transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column: Premium Multi-Device Workspace Mockups (Laptop + Overlapping Phone + Floating Smartwatch) */}
        <div className="lg:col-span-6 flex items-center justify-center relative w-full h-[550px]">
          {/* Glowing Purple Spotlight behind mockup stack */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

          {/* 1. Device: Simulated macOS Laptop (Background Layer) */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute top-8 w-full max-w-[480px] sm:max-w-[540px] aspect-[1.6] rounded-2xl border border-white/10 bg-zinc-950/80 shadow-3xl overflow-hidden glass-panel"
          >
            {/* macOS title bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/60 border-b border-white/5 select-none">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab("model.py")}
                  className={`text-[10px] font-mono px-2 py-0.5 rounded transition-colors ${
                    activeTab === "model.py" ? "bg-zinc-850 text-purple-400 border border-zinc-700/50" : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  model.py
                </button>
                <button
                  onClick={() => setActiveTab("wearos.kt")}
                  className={`text-[10px] font-mono px-2 py-0.5 rounded transition-colors ${
                    activeTab === "wearos.kt" ? "bg-zinc-850 text-purple-400 border border-zinc-700/50" : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  wearos.kt
                </button>
              </div>
              <div className="w-12" />
            </div>

            {/* Simulated Editor Code Content */}
            <div className="p-5 font-mono text-[10px] sm:text-xs text-zinc-400 leading-relaxed overflow-y-auto h-[calc(100%-44px)] select-text">
              <pre className="whitespace-pre">
                {codeFiles[activeTab as keyof typeof codeFiles]}
              </pre>
            </div>
          </motion.div>

          {/* 2. Device: Simulated iPhone/Android Mobile (Overlapping Foreground Left) */}
          <motion.div
            initial={{ opacity: 0, x: -30, y: 40 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="absolute left-0 bottom-2 w-[160px] sm:w-[190px] aspect-[0.5] rounded-[36px] border-[6px] border-zinc-800 bg-[#09090b] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] overflow-hidden flex flex-col justify-between p-4 z-20"
          >
            {/* Speaker / Dynamic Island */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-4 rounded-full bg-zinc-900 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
            </div>

            {/* Phone Header */}
            <div className="flex justify-between items-center pt-4 font-mono text-[8px] text-zinc-500">
              <span>9:41</span>
              <div className="flex items-center gap-1">
                <Activity className="w-2.5 h-2.5 text-purple-400 animate-pulse" />
                <span>BT CONNECT</span>
              </div>
            </div>

            {/* Biosignal Telemetry Waveform */}
            <div className="my-3 flex-grow flex flex-col justify-center gap-4">
              <div>
                <div className="flex justify-between items-center mb-1 text-[8px] font-mono text-zinc-400">
                  <span>ECG MONITOR</span>
                  <span className="text-emerald-400">FILTERED</span>
                </div>
                <div className="h-12 bg-zinc-950 rounded-lg border border-zinc-900 flex items-center overflow-hidden relative">
                  <svg className="w-full h-full opacity-80" viewBox="0 0 100 40">
                    <path
                      d="M0,20 L15,20 L20,10 L25,30 L30,20 L50,20 L55,5 L60,35 L65,20 L80,20 L85,25 L90,15 L100,20"
                      fill="none"
                      stroke="#a855f7"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1 text-[8px] font-mono text-zinc-400">
                  <span>EEG ALPHA POWER</span>
                  <span className="text-blue-400">12.5 Hz</span>
                </div>
                <div className="h-12 bg-zinc-950 rounded-lg border border-zinc-900 flex items-center overflow-hidden relative">
                  <svg className="w-full h-full opacity-80" viewBox="0 0 100 40">
                    <path
                      d="M0,20 Q10,10 20,20 T40,20 T60,20 T80,20 T100,20"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Mini Dashboard Metrics */}
            <div className="grid grid-cols-2 gap-2 border-t border-zinc-900 pt-3">
              <div className="bg-zinc-950 p-1.5 rounded-lg border border-zinc-900 flex flex-col items-center">
                <Heart className="w-3.5 h-3.5 text-red-500 animate-pulse mb-1" />
                <span className="text-[10px] font-bold text-white">{pulseVal}</span>
                <span className="text-[6px] font-mono text-zinc-500">BPM</span>
              </div>
              <div className="bg-zinc-950 p-1.5 rounded-lg border border-zinc-900 flex flex-col items-center justify-center">
                <span className="text-[10px] font-bold text-purple-400">98.4%</span>
                <span className="text-[6px] font-mono text-zinc-500">ACCURACY</span>
              </div>
            </div>
          </motion.div>

          {/* 3. Device: Simulated WearOS Smartwatch (Floating Right) */}
          <motion.div
            initial={{ opacity: 0, x: 30, y: -20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="absolute right-0 bottom-12 w-[110px] sm:w-[130px] aspect-square rounded-full border-[6px] border-zinc-800 bg-[#09090b] shadow-[0_20px_45px_-8px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col items-center justify-center p-3 z-20 group hover:border-purple-500/40 transition-colors"
          >
            {/* Watch Screen Overlay */}
            <div className="flex flex-col items-center justify-center text-center">
              <Activity className="w-5 h-5 text-purple-400 animate-pulse mb-1" />
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">HARSHIT.AI</span>
              <span className="text-base font-bold text-white leading-none mt-1">4.2<span className="text-[8px] font-light text-zinc-500">ms</span></span>
              <span className="text-[6px] font-mono text-emerald-400 mt-1 flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-emerald-500" />
                CLASSIFIER OK
              </span>
            </div>
            {/* Simulated circular progress ring */}
            <div className="absolute inset-2 border-2 border-dashed border-zinc-800 rounded-full animate-[spin_20s_linear_infinite] pointer-events-none" />
          </motion.div>
        </div>
      </div>

      {/* Footer transition overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#030303] to-transparent pointer-events-none" />
    </section>
  );
}

