import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Research from "@/components/Research";
import TechStack from "@/components/TechStack";
import Achievements from "@/components/Achievements";
import Blog from "@/components/Blog";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { getPortfolioData } from "@/lib/getPortfolioData";

// This is an async Server Component — data is fetched server-side (SSR).
// Falls back to static data/portfolio.ts if Firestore is unavailable.
export default async function Home() {
  const data = await getPortfolioData();

  return (
    <main className="relative min-h-screen bg-[#030303] overflow-x-hidden selection:bg-purple-500/20 selection:text-white">
      {/* Dynamic Background Noise/Mesh Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#1c1c1f_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

      {/* Interactive HUD Floating Bar */}
      <Navbar />

      {/* Hero Header Presentation */}
      <Hero profile={data.profile} />

      {/* Bento-style Philosophy & Key Metrics Grid */}
      <About profile={data.profile} specialties={data.specialties} />

      {/* Professional Journey & Project Milestones */}
      <Experience experiences={data.experiences} />

      {/* Showcase of WearOS, Flutter, and IoT Mesh Telemetry Projects */}
      <Projects projects={data.projects} />

      {/* Detailed Research Streams & Biosignal Pipelines */}
      <Research research={data.research} />

      {/* Categorized Stack of Hardware, Languages, & ML Frameworks */}
      <TechStack techStack={data.techStack} />

      {/* Academic Publications & Industry Rewards */}
      <Achievements achievements={data.achievements} />

      {/* Educational Write-ups & Technical Optimization Logs */}
      <Blog blog={data.blog} />

      {/* Interactive Collaboration & Intake Form */}
      <Contact profile={data.profile} />

      {/* System Footer & Redirect Links */}
      <Footer profile={data.profile} />
    </main>
  );
}
