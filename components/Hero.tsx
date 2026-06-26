"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Check, Activity, Heart, Play, X, Terminal, Copy, RotateCcw } from "lucide-react";
import type { Profile, CodeSnippet } from "@/data/portfolio";

// ── Security: only filenames matching this allowlist may be executed via Pyodide.
// If a Firestore-sourced snippet has a filename NOT in this set, the run button
// shows a static demo output instead of executing untrusted code.
// Update this set whenever you intentionally add a new vetted demo snippet.
const VETTED_PYODIDE_FILENAMES = new Set([
  "biosignal.py",
  "fall_detect.py",
  "ecg_filter.py",
  "hrv_analysis.py",
]);

interface HeroProps { profile: Profile; }

interface RunResult { stdout: string; stderr: string; exitCode: number; }
type RunState = "idle" | "running" | "done" | "error";

export default function Hero({ profile }: HeroProps) {
  const { tagline, bio, researchPillars, coreStack, role, codeSnippets } = profile;

  // ── Biosignal Metrics linked to Code Runs ──────────────────────────────────
  const [phoneMetrics, setPhoneMetrics] = useState({
    bpmBase: 72,
    accuracy: "98.4%",
    status: "IDLE" as "IDLE" | "RUNNING" | "STABLE" | "ANOMALY",
    ecgWave: "M0,20 L15,20 L20,10 L25,30 L30,20 L50,20 L55,5 L60,35 L65,20 L80,20 L85,25 L90,15 L100,20",
    eegWave: "M0,20 Q10,10 20,20 T40,20 T60,20 T80,20 T100,20",
    label: "ECG MONITOR",
    labelColor: "text-emerald-400"
  });

  const [pulseVal, setPulseVal] = useState(72);
  useEffect(() => {
    const t = setInterval(() => {
      setPulseVal(p => {
        const offset = Math.floor(Math.random() * 5) - 2;
        let next = p + offset;
        const minBpm = phoneMetrics.bpmBase - 8;
        const maxBpm = phoneMetrics.bpmBase + 8;
        if (next < minBpm || next > maxBpm) {
          next = phoneMetrics.bpmBase + offset;
        }
        return next;
      });
    }, 1500);
    return () => clearInterval(t);
  }, [phoneMetrics.bpmBase]);

  // ── Active code tab ──────────────────────────────────────────────────────────
  const snippets: CodeSnippet[] = codeSnippets?.length
    ? codeSnippets
    : [{ filename: "biosignal.py", language: "python", code: "# No snippets configured" }];

  const [activeIdx, setActiveIdx] = useState(0);
  const activeSnippet = snippets[activeIdx] ?? snippets[0];

  // ── Terminal modal ───────────────────────────────────────────────────────────
  const [termOpen, setTermOpen]       = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [runState, setRunState]       = useState<RunState>("idle");
  const [result, setResult]       = useState<RunResult>({ stdout: "", stderr: "", exitCode: 0 });
  const outputRef = useRef<HTMLDivElement>(null);

  // ── Emulator / Client-side Exec States ──────────────────────────────────────
  const [emulatorLogs, setEmulatorLogs] = useState<string[]>([]);
  const [showEmulatorWatch, setShowEmulatorWatch] = useState(false);
  const [watchState, setWatchState] = useState<"boot" | "stable" | "fall">("boot");
  const pyodideRef = useRef<any>(null);
  const [isPyodideLoading, setIsPyodideLoading] = useState(false);

  // ── Sync biosignal/execution outputs to mobile mockup ──────────────────────
  useEffect(() => {
    if (watchState === "fall") {
      setPhoneMetrics({
        bpmBase: 128,
        accuracy: "99.4%",
        status: "ANOMALY",
        ecgWave: "M0,20 L5,20 L8,2 L12,38 L15,8 L20,32 L25,2 L30,38 L35,20 L50,20 L55,1 L60,39 L65,8 L70,32 L75,2 L80,38 L85,20 L100,20",
        eegWave: "M0,20 Q5,3 10,20 T20,20 T30,20 T40,20 T50,20 T60,20 T70,20 T80,20 T90,20 T100,20",
        label: "FALL DETECTED",
        labelColor: "text-red-500 font-bold animate-bounce"
      });
      return;
    }

    if (runState === "running") {
      setPhoneMetrics(prev => ({
        ...prev,
        status: "RUNNING",
        label: "ANALYZING...",
        labelColor: "text-purple-400 animate-pulse",
        ecgWave: "M0,20 L5,20 L8,15 L12,25 L15,18 L20,22 L25,15 L30,25 L35,20 L50,20 L55,10 L60,30 L65,18 L70,22 L75,15 L80,25 L85,20 L100,20"
      }));
    } else if (runState === "done") {
      const stdoutLower = (result.stdout || "").toLowerCase();
      const hasAnomaly = stdoutLower.includes("anomaly") || stdoutLower.includes("critical") || stdoutLower.includes("fall");
      
      if (hasAnomaly) {
        setPhoneMetrics({
          bpmBase: 120,
          accuracy: "99.1%",
          status: "ANOMALY",
          ecgWave: "M0,20 L5,20 L8,5 L12,35 L15,10 L20,30 L25,5 L30,35 L35,20 L50,20 L55,2 L60,38 L65,10 L70,30 L75,5 L80,35 L85,20 L100,20",
          eegWave: "M0,20 Q5,5 10,20 T20,20 T30,20 T40,20 T50,20 T60,20 T70,20 T80,20 T90,20 T100,20",
          label: "ANOMALY DETECTED",
          labelColor: "text-red-500 font-bold animate-pulse"
        });
      } else {
        setPhoneMetrics({
          bpmBase: 72,
          accuracy: "98.4%",
          status: "STABLE",
          ecgWave: "M0,20 L15,20 L20,10 L25,30 L30,20 L50,20 L55,5 L60,35 L65,20 L80,20 L85,25 L90,15 L100,20",
          eegWave: "M0,20 Q10,10 20,20 T40,20 T60,20 T80,20 T100,20",
          label: "FILTERED & STABLE",
          labelColor: "text-emerald-400 font-semibold"
        });
      }
    } else if (runState === "error") {
      setPhoneMetrics(prev => ({
        ...prev,
        status: "ANOMALY",
        label: "EXEC ERROR",
        labelColor: "text-red-400 animate-pulse",
        bpmBase: 60
      }));
    }
  }, [runState, result, watchState]);

  async function handleRun() {
    setTermOpen(true);
    setIsMinimized(false);
    setIsMaximized(false);
    setRunState("running");
    setResult({ stdout: "", stderr: "", exitCode: 0 });
    setShowEmulatorWatch(false);
    setEmulatorLogs([]);
    setWatchState("boot");

    const isKotlin = activeSnippet.filename?.toLowerCase().endsWith(".kt") || 
                     activeSnippet.language?.toLowerCase() === "kotlin";

    if (isKotlin) {
      const logSequence = [
        "❯ run " + activeSnippet.filename,
        "[SYSTEM] Initializing WearOS Emulator sandbox...",
        "[SYSTEM] Loading WearOS System Image (API Level 33)...",
        "[SYSTEM] Starting Android Virtual Device (AVD)...",
        "[EMULATOR] Booting virtual WearOS device...",
        "[EMULATOR] Graphic driver: Vulkan 1.3",
        "[EMULATOR] Device screen layout: Round AVD (454x454, 320dpi)",
        "[EMULATOR] Booting WearOS launcher... [||||||||||] 50%",
        "[EMULATOR] Booting WearOS launcher... [||||||||||||||||||||] 100%",
        "[EMULATOR] WearOS Device boot completed successfully.",
        "[ADB] Connecting to virtual port localhost:5554...",
        "[ADB] Verifying system signature...",
        "[ADB] Installing APK package: com.harshit.wearos.watchapp...",
        "[ADB] Success. Launching MainActivity...",
        "[WearOS] Launching wearable window content..."
      ];

      let i = 0;
      const interval = setInterval(() => {
        if (i < logSequence.length) {
          setEmulatorLogs(prev => [...prev, logSequence[i]!]);
          i++;
        } else {
          clearInterval(interval);
          setShowEmulatorWatch(true);
          setWatchState("stable");
          setRunState("done");
          setResult({
            stdout: "WearOS IMU Telemetry Stream\n--------------------------------------\nPacket #1  mag=9.80 m/s²  [STABLE]\nPacket #2  mag=9.70 m/s²  [STABLE]\nPacket #3  mag=15.54 m/s²  [ANOMALY]\n\nSimulation completed.",
            stderr: "",
            exitCode: 0
          });
        }
      }, 180);
      return;
    }

    const isPython = activeSnippet.filename?.toLowerCase().endsWith(".py") || 
                     activeSnippet.language?.toLowerCase() === "python";

    if (isPython) {
      // ── Security check: only run snippets whose filename is in the vetted set.
      // This prevents a compromised Firestore/admin account from pushing arbitrary
      // Python code that would execute in every visitor's browser.
      if (!VETTED_PYODIDE_FILENAMES.has(activeSnippet.filename ?? "")) {
        setResult({
          stdout:
            "[Demo output — live execution disabled for unvetted snippets]\n\n" +
            "This snippet is shown as a static demo.\n" +
            "To enable execution, add the filename to VETTED_PYODIDE_FILENAMES in Hero.tsx.",
          stderr: "",
          exitCode: 0,
        });
        setRunState("done");
        return;
      }

      setIsPyodideLoading(true);
      try {
        if (typeof window !== "undefined" && !Object.prototype.hasOwnProperty.call(window, "loadPyodide")) {
          const script = document.createElement("script");
          script.src = "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js";
          await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
          });
        }
        if (typeof window !== "undefined" && !pyodideRef.current) {
          // @ts-ignore
          pyodideRef.current = await window.loadPyodide({
            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/"
          });
        }

        let stdoutBuffer = "";
        let stderrBuffer = "";
        pyodideRef.current.setStdout({
          batched: (text: string) => {
            stdoutBuffer += text + "\n";
          }
        });
        pyodideRef.current.setStderr({
          batched: (text: string) => {
            stderrBuffer += text + "\n";
          }
        });

        await pyodideRef.current.runPythonAsync(activeSnippet.code);
        setResult({
          stdout: stdoutBuffer.trim() || "Script finished running.",
          stderr: stderrBuffer.trim(),
          exitCode: 0
        });
        setRunState("done");
      } catch (err: any) {
        setResult({
          stdout: "",
          stderr: err.message || err.toString(),
          exitCode: 1
        });
        setRunState("error");
      } finally {
        setIsPyodideLoading(false);
      }
      return;
    }

    // Default fallback to API
    try {
      const res = await fetch("/api/run-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: activeSnippet.language,
          code:     activeSnippet.code,
          filename: activeSnippet.filename,
        }),
      });
      const data: RunResult = await res.json();
      setResult(data);
      setRunState(data.exitCode === 0 ? "done" : "error");
    } catch {
      setResult({ stdout: "", stderr: "Failed to reach execution engine.", exitCode: 1 });
      setRunState("error");
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(activeSnippet.code).catch(() => {});
  }

  // Scroll output to bottom when new content arrives
  useEffect(() => {
    if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight;
  }, [result, emulatorLogs]);

  // ── Tagline split ────────────────────────────────────────────────────────────
  const words = tagline.split(" ");
  const prefix = words.slice(0, words.length - 3).join(" ");
  const suffix = words.slice(words.length - 3).join(" ");

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center pt-32 pb-24 overflow-hidden cyber-grid radial-glow">
      {/* Background glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[140px] animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[140px] animate-pulse-slow pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center z-10 w-full">
        {/* ── Left column ──────────────────────────────────────────────────────── */}
        <div className="lg:col-span-6 flex flex-col items-start text-left">
          {/* Status pill */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-300 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500" />
            </span>
            <span>{role}</span>
          </motion.div>

          {/* Heading */}
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-[54px] font-bold tracking-tight leading-[1.1] text-white mb-6">
            {prefix}{" "}
            <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 tracking-wide block sm:inline">
              {suffix}
            </span>
          </motion.h1>

          {/* Bio */}
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15 }}
            className="text-base sm:text-lg text-zinc-400 mb-8 leading-relaxed max-w-xl">
            {bio}
          </motion.p>

          {/* Research pillars checklist */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col gap-3.5 mb-10 w-full">
            {(researchPillars ?? []).map((pillar, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mt-1 text-purple-400 flex-shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="text-zinc-300 text-sm sm:text-base leading-snug">{pillar}</span>
              </div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.25 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-10">
            <a href="#projects" className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-black font-semibold hover:bg-zinc-200 transition-all duration-300 shadow-[0_4px_25px_rgba(168,85,247,0.25)] group">
              Explore Systems
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a href="#contact" className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-semibold hover:bg-zinc-850 hover:border-zinc-700 transition-all duration-300">
              Collaboration Request
            </a>
          </motion.div>

          {/* Core stack badges */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.35 }}
            className="flex flex-col gap-3">
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">Core Stack</span>
            <div className="flex flex-wrap gap-3">
              {(coreStack ?? []).map((tech, idx) => (
                <span key={idx} className="px-3 py-1 text-xs font-mono rounded-full bg-zinc-950 border border-zinc-850 text-zinc-400 flex items-center gap-1.5 hover:border-purple-500/30 transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Right column: code mockup ─────────────────────────────────────── */}
        <div className="lg:col-span-6 flex items-center justify-center relative w-full h-[550px]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

          {/* Laptop mockup */}
          <motion.div initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1 }}
            className="absolute top-8 w-full max-w-[480px] sm:max-w-[540px] aspect-[1.6] rounded-2xl border border-white/10 bg-zinc-950/80 shadow-3xl overflow-hidden glass-panel">
            {/* Title bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/60 border-b border-white/5 select-none">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
              </div>
              {/* File tabs */}
              <div className="flex items-center gap-1">
                {snippets.map((s, idx) => (
                  <button key={idx} onClick={() => setActiveIdx(idx)}
                    className={`text-[10px] font-mono px-2 py-0.5 rounded transition-colors ${activeIdx === idx ? "bg-zinc-850 text-purple-400 border border-zinc-700/50" : "text-zinc-500 hover:text-zinc-300"}`}>
                    {s.filename}
                  </button>
                ))}
              </div>
              {/* Action buttons */}
              <div className="flex items-center gap-1.5">
                <button onClick={handleCopy} title="Copy code"
                  className="p-1 rounded text-zinc-600 hover:text-zinc-300 transition-colors">
                  <Copy className="w-3 h-3" />
                </button>
                <button onClick={handleRun}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-500/20 border border-purple-500/30 text-purple-400 text-[10px] font-mono hover:bg-purple-500/30 transition-all">
                  <Play className="w-2.5 h-2.5 fill-purple-400" /> Run
                </button>
              </div>
            </div>

            {/* Code content */}
            <div className="p-5 font-mono text-[10px] sm:text-xs text-zinc-400 leading-relaxed overflow-y-auto h-[calc(100%-44px)] select-text">
              <pre className="whitespace-pre">{activeSnippet.code}</pre>
            </div>
          </motion.div>

          {/* Phone mockup */}
          <motion.div initial={{ opacity: 0, x: -30, y: 40 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ duration: 1, delay: 0.2 }}
            className="absolute left-0 bottom-2 w-[160px] sm:w-[190px] aspect-[0.5] rounded-[36px] border-[6px] border-zinc-800 bg-[#09090b] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] overflow-hidden flex flex-col justify-between p-4 z-20">
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-4 rounded-full bg-zinc-900 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
            </div>
            <div className="flex justify-between items-center pt-4 font-mono text-[8px] text-zinc-500">
              <span>9:41</span>
              <div className="flex items-center gap-1">
                <Activity className="w-2.5 h-2.5 text-purple-400 animate-pulse" />
                <span>BT CONNECT</span>
              </div>
            </div>
            {termOpen && isMinimized ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                onClick={() => setIsMinimized(false)}
                className="my-auto flex-grow flex flex-col justify-between bg-zinc-950/90 border border-purple-500/30 rounded-2xl p-2.5 cursor-pointer hover:border-purple-400 hover:shadow-[0_0_15px_rgba(168,85,247,0.2)] transition-all font-mono select-none"
              >
                {/* Mini macOS control bar */}
                <div className="flex items-center justify-between border-b border-zinc-900 pb-1.5 mb-1.5">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff5f56]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ffbd2e]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#27c93f]" />
                  </div>
                  <span className="text-[6px] text-zinc-500 truncate max-w-[70px]">{activeSnippet.filename}</span>
                </div>
                
                {/* Mini Console Output */}
                <div className="flex-grow flex flex-col justify-center text-[7px] text-zinc-400 leading-tight overflow-hidden">
                  <div className="flex items-center gap-1 text-[6px] text-purple-400 mb-1">
                    <span className="animate-pulse">●</span>
                    <span>{runState === "running" ? "EXECUTING..." : runState === "done" ? "EXIT OK" : "ERROR"}</span>
                  </div>
                  <div className="truncate text-zinc-300">❯ run {activeSnippet.filename}</div>
                  <div className="truncate text-emerald-400 mt-1 font-semibold">
                    {runState === "running" 
                      ? "Analyzing biosignals..." 
                      : result.stdout 
                      ? result.stdout.split("\n")[0] 
                      : result.stderr 
                      ? result.stderr.split("\n")[0] 
                      : "Finished."
                    }
                  </div>
                </div>

                {/* Footer action hint */}
                <div className="text-[5px] text-zinc-600 text-center border-t border-zinc-900 pt-1 mt-1.5">
                  TAP TO RESTORE CONSOLE
                </div>
              </motion.div>
            ) : (
              <>
                <div className="my-3 flex-grow flex flex-col justify-center gap-4">
                  <div>
                    <div className="flex justify-between items-center mb-1 text-[8px] font-mono text-zinc-400">
                      <span>{phoneMetrics.label}</span>
                      <span className={phoneMetrics.labelColor}>
                        {phoneMetrics.status === "RUNNING" ? "ANALYZING..." : phoneMetrics.status === "IDLE" ? "FILTERED" : phoneMetrics.status}
                      </span>
                    </div>
                    <div className="h-12 bg-zinc-950 rounded-lg border border-zinc-900 flex items-center overflow-hidden">
                      <svg className="w-full h-full opacity-80" viewBox="0 0 100 40">
                        <path 
                          d={phoneMetrics.ecgWave} 
                          fill="none" 
                          stroke={phoneMetrics.status === "ANOMALY" ? "#ef4444" : phoneMetrics.status === "RUNNING" ? "#a855f7" : "#10b981"} 
                          strokeWidth="1.5" 
                          className={phoneMetrics.status === "RUNNING" ? "animate-pulse" : ""} 
                        />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1 text-[8px] font-mono text-zinc-400">
                      <span>EEG ALPHA POWER</span>
                      <span className={phoneMetrics.status === "ANOMALY" ? "text-red-400" : "text-blue-400"}>
                        {phoneMetrics.status === "ANOMALY" ? "CHAOTIC" : "12.5 Hz"}
                      </span>
                    </div>
                    <div className="h-12 bg-zinc-950 rounded-lg border border-zinc-900 flex items-center overflow-hidden">
                      <svg className="w-full h-full opacity-80" viewBox="0 0 100 40">
                        <path 
                          d={phoneMetrics.eegWave} 
                          fill="none" 
                          stroke={phoneMetrics.status === "ANOMALY" ? "#ef4444" : "#3b82f6"} 
                          strokeWidth="1.5" 
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 border-t border-zinc-900 pt-3">
                  <div className="bg-zinc-950 p-1.5 rounded-lg border border-zinc-900 flex flex-col items-center">
                    <Heart className={`w-3.5 h-3.5 mb-1 ${phoneMetrics.status === "ANOMALY" ? "text-red-500 animate-[ping_1s_infinite]" : "text-red-500 animate-pulse"}`} />
                    <span className="text-[10px] font-bold text-white">{pulseVal}</span>
                    <span className="text-[6px] font-mono text-zinc-500">BPM</span>
                  </div>
                  <div className="bg-zinc-950 p-1.5 rounded-lg border border-zinc-900 flex flex-col items-center justify-center">
                    <span className="text-[10px] font-bold text-purple-400">{phoneMetrics.accuracy}</span>
                    <span className="text-[6px] font-mono text-zinc-500">ACCURACY</span>
                  </div>
                </div>
              </>
            )}
          </motion.div>

          {/* Watch mockup */}
          <motion.div initial={{ opacity: 0, x: 30, y: -20 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ duration: 1, delay: 0.3 }}
            className="absolute right-0 bottom-12 w-[110px] sm:w-[130px] aspect-square rounded-full border-[6px] border-zinc-800 bg-[#09090b] shadow-[0_20px_45px_-8px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col items-center justify-center p-3 z-20 group hover:border-purple-500/40 transition-colors">
            <div className="flex flex-col items-center justify-center text-center">
              <Activity className="w-5 h-5 text-purple-400 animate-pulse mb-1" />
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">HARSHIT.AI</span>
              <span className="text-base font-bold text-white leading-none mt-1">4.2<span className="text-[8px] font-light text-zinc-500">ms</span></span>
              <span className="text-[6px] font-mono text-emerald-400 mt-1 flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-emerald-500" /> CLASSIFIER OK
              </span>
            </div>
            <div className="absolute inset-2 border-2 border-dashed border-zinc-800 rounded-full animate-[spin_20s_linear_infinite] pointer-events-none" />
          </motion.div>
        </div>
      </div>

      {/* Footer fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#030303] to-transparent pointer-events-none" />

      {/* ── Terminal Modal ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {termOpen && !isMinimized && (
          <motion.div
            key="terminal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-4"
            onClick={() => { setTermOpen(false); setIsMinimized(false); }}
          >
            <motion.div
              key="terminal-window"
              initial={{ y: 60, opacity: 0, scale: 0.97 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 60, opacity: 0, scale: 0.97 }}
              transition={{ type: "spring", damping: 22, stiffness: 300 }}
              className={`w-full transition-all duration-500 bg-[#0c0c0e] border border-zinc-800 rounded-2xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.8)] ${
                isMaximized 
                  ? "max-w-5xl h-[550px]" 
                  : showEmulatorWatch 
                  ? "max-w-4xl h-[450px]" 
                  : "max-w-2xl h-[340px]"
              }`}
              onClick={e => e.stopPropagation()}
            >
              {/* Terminal title bar */}
              <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/70 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => { setTermOpen(false); setIsMinimized(false); }} 
                    className="w-3 h-3 rounded-full bg-[#ff5f56] hover:brightness-75 transition-all cursor-pointer border-0 outline-none" 
                    title="Close"
                  />
                  <button 
                    onClick={() => setIsMinimized(true)} 
                    className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:brightness-75 transition-all cursor-pointer border-0 outline-none" 
                    title="Minimize"
                  />
                  <button 
                    onClick={() => setIsMaximized(!isMaximized)} 
                    className="w-3 h-3 rounded-full bg-[#27c93f] hover:brightness-75 transition-all cursor-pointer border-0 outline-none" 
                    title={isMaximized ? "Restore" : "Maximize"}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-zinc-500" />
                  <span className="text-xs font-mono text-zinc-400">
                    {activeSnippet.filename} — {activeSnippet.language}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {runState === "done" || runState === "error" ? (
                    <button onClick={handleRun}
                      className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-mono text-zinc-400 hover:text-white transition-colors">
                      <RotateCcw className="w-3 h-3" /> Re-run
                    </button>
                  ) : null}
                </div>
              </div>

              {/* Terminal body */}
              <div ref={outputRef} className={`p-5 overflow-y-auto font-mono text-sm bg-[#0c0c0e] transition-all duration-300 ${
                isMaximized 
                  ? "h-[506px]" 
                  : showEmulatorWatch 
                  ? "h-[406px]" 
                  : "h-[296px]"
              }`}>
                {showEmulatorWatch ? (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full items-stretch">
                    {/* Left: Terminal Logs */}
                    <div className={`md:col-span-7 flex flex-col bg-black/40 border border-zinc-900 rounded-xl p-4 overflow-y-auto h-full text-xs transition-all duration-300 ${
                      isMaximized 
                        ? "max-h-[460px]" 
                        : "max-h-[350px]"
                    }`}>
                      {emulatorLogs.map((log, idx) => {
                        if (typeof log !== "string") return null;
                        const isSystem = log.startsWith("[SYSTEM]");
                        const isEmulator = log.startsWith("[EMULATOR]");
                        const isAdb = log.startsWith("[ADB]");
                        const isCmd = log.startsWith("❯");
                        
                        const textColor = isSystem 
                          ? "text-blue-400" 
                          : isEmulator 
                          ? "text-yellow-400" 
                          : isAdb 
                          ? "text-purple-400" 
                          : isCmd 
                          ? "text-zinc-300" 
                          : "text-zinc-400";

                        return (
                          <div key={idx} className={textColor}>
                            {log}
                          </div>
                        );
                      })}
                      
                      {runState === "done" && result.stdout && (
                        <pre className="text-emerald-400 whitespace-pre-wrap leading-relaxed mt-4 pt-4 border-t border-zinc-900">{result.stdout}</pre>
                      )}
                      {runState === "done" && (
                        <div className="mt-3 pt-3 border-t border-zinc-900 text-[10px] font-mono flex items-center gap-2 text-emerald-500">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Process exited with code 0
                        </div>
                      )}
                    </div>

                    {/* Right: Smartwatch Emulator Visual */}
                    <div className="md:col-span-5 flex flex-col items-center justify-center h-full border-t md:border-t-0 md:border-l border-zinc-900 pt-6 md:pt-0 md:pl-6 select-none">
                      {/* Watch Case */}
                      <div className="relative w-52 h-52 rounded-full bg-zinc-900 border-4 border-zinc-700 shadow-2xl flex items-center justify-center transition-all duration-300 hover:border-purple-500/50">
                        {/* Metallic gloss */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none" />
                        
                        {/* Side Button */}
                        <button 
                          onClick={() => setWatchState(prev => prev === "stable" ? "fall" : "stable")}
                          className="absolute -right-2 top-1/2 -translate-y-1/2 w-2.5 h-8 bg-zinc-800 border-l border-zinc-700 rounded-r-md hover:bg-zinc-750 transition-colors shadow-md"
                          title="Simulate Event / Button Press"
                        />

                        {/* Screen */}
                        <div className={`w-44 h-44 rounded-full border relative overflow-hidden flex flex-col items-center justify-between p-4 transition-all duration-500 ${watchState === "fall" ? "bg-red-950/90 border-red-500/50 animate-pulse" : "bg-[#070709] border-zinc-800"}`}>
                          
                          {/* Watch Header Status */}
                          <div className="flex justify-between items-center w-full px-2 text-[8px] font-mono text-zinc-500 border-b border-zinc-900/40 pb-1 z-10">
                            <span>10:08 AM</span>
                            <div className="flex items-center gap-1">
                              <Activity className={`w-2.5 h-2.5 ${watchState === "fall" ? "text-red-400 animate-ping" : "text-purple-400 animate-pulse"}`} />
                              <span>{watchState === "fall" ? "ALERT" : "WearOS"}</span>
                            </div>
                          </div>

                          {/* Watch Main View */}
                          <div className="flex-grow flex flex-col items-center justify-center text-center px-1 z-10">
                            {watchState === "stable" ? (
                              <>
                                <span className="text-[8px] font-mono text-purple-400 uppercase tracking-widest mb-0.5">HARSHIT.AI</span>
                                <h4 className="text-xs font-bold text-zinc-100 tracking-wide font-sans animate-fade-in leading-snug">Hello everyone!</h4>
                                <span className="text-[7px] text-zinc-400 mt-0.5 max-w-[90px] leading-tight">Smart Wearable Hub Connected</span>
                              </>
                            ) : (
                              <>
                                <span className="text-[8px] font-mono text-red-400 uppercase tracking-widest font-bold mb-0.5 animate-pulse">FALL DETECTED</span>
                                <h4 className="text-[10px] font-bold text-red-200 tracking-wide font-mono leading-tight">mag=15.54 m/s²</h4>
                                <span className="text-[6px] text-red-300/80 mt-0.5 max-w-[80px] leading-tight">Sending emergency alert to caregiver...</span>
                              </>
                            )}
                          </div>

                          {/* Heart rate & interactive button */}
                          <div className="w-full flex flex-col items-center gap-1 pb-1 z-10">
                            {/* Heartbeat Waveform SVG */}
                            <svg className="w-20 h-5 opacity-60" viewBox="0 0 100 30">
                              <path 
                                d={watchState === "fall" 
                                  ? "M0,15 L10,15 L13,5 L16,25 L19,15 L25,15 L28,5 L31,25 L34,15 L50,15 L53,2 L56,28 L59,15 L70,15 L73,5 L76,25 L79,15 L100,15"
                                  : "M0,15 L20,15 L25,5 L30,25 L35,15 L60,15 L65,10 L70,20 L75,15 L100,15"} 
                                fill="none" 
                                stroke={watchState === "fall" ? "#ef4444" : "#a855f7"} 
                                strokeWidth="1.5" 
                              />
                            </svg>
                            
                            <button 
                              onClick={() => setWatchState(prev => prev === "stable" ? "fall" : "stable")}
                              className={`px-2 py-0.5 rounded-full text-[8px] font-mono font-bold tracking-wide border transition-all duration-300 ${watchState === "fall" ? "bg-red-500/20 border-red-500 text-red-400 hover:bg-red-500/30" : "bg-purple-500/10 border-purple-500/30 text-purple-400 hover:bg-purple-500/20"}`}
                            >
                              {watchState === "fall" ? "⚠️ RESET" : "TEST SENSOR"}
                            </button>
                          </div>

                          {/* Watch screen overlay glow */}
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.4)_100%)] pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Command echo */}
                    <div className="flex items-center gap-2 text-zinc-500 mb-2">
                      <span className="text-purple-500">❯</span>
                      <span>run {activeSnippet.filename}</span>
                    </div>

                    {runState === "running" && (
                      <div className="flex items-center gap-3 text-zinc-400 mt-2">
                        <div className="w-3.5 h-3.5 border border-purple-400 border-t-transparent rounded-full animate-spin" />
                        <span>
                          {isPyodideLoading ? "Loading local Pyodide interpreter..." : "Executing via Piston sandbox…"}
                        </span>
                      </div>
                    )}

                    {(runState === "done" || runState === "error") && (
                      <>
                        {result.stdout && (
                          <pre className="text-emerald-400 whitespace-pre-wrap leading-relaxed">{result.stdout}</pre>
                        )}
                        {result.stderr && (
                          <pre className="text-red-400 whitespace-pre-wrap leading-relaxed mt-1">{result.stderr}</pre>
                        )}
                        <div className={`mt-3 pt-3 border-t border-zinc-900 text-xs font-mono flex items-center gap-2 ${result.exitCode === 0 ? "text-emerald-500" : "text-red-500"}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${result.exitCode === 0 ? "bg-emerald-500" : "bg-red-500"}`} />
                          Process exited with code {result.exitCode}
                        </div>
                      </>
                    )}

                    {runState === "idle" && (
                      <span className="text-zinc-600 text-xs">Waiting for execution…</span>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
