"use client";
// app/page.tsx
// Converted to a Client Component so we can use the real-time
// usePortfolioData hook. Next.js still SSRs client components on first
// request, so SEO is preserved. After hydration, onSnapshot takes over
// and any admin save reflects here instantly.

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
import { usePortfolioData } from "@/lib/usePortfolioData";

export default function Home() {
  const data = usePortfolioData();

  return (
    <main className="relative min-h-screen bg-[#030303] overflow-x-hidden selection:bg-purple-500/20 selection:text-white">
      {/* Dynamic Background Noise/Mesh Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#1c1c1f_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

      <Navbar profile={data.profile} />
      <Hero profile={data.profile} />
      <About profile={data.profile} specialties={data.specialties} />
      <Experience experiences={data.experiences} />
      <Projects projects={data.projects} />
      <Research research={data.research} />
      <TechStack techStack={data.techStack} />
      <Achievements achievements={data.achievements} />
      <Blog blog={data.blog} />
      <Contact profile={data.profile} />
      <Footer profile={data.profile} />
    </main>
  );
}
