"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, Cpu, Github, Linkedin } from "lucide-react";
import { portfolioData, type Profile } from "@/data/portfolio";

interface NavbarProps {
  profile?: Profile;
}

export default function Navbar({ profile }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      
      const sections = ["hero", "about", "experience", "projects", "research", "stack", "contact"];
      const current = sections.find(section => {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          return rect.top <= 120 && rect.bottom >= 120;
        }
        return false;
      });
      if (current) {
        setActiveSection(current);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "About", href: "#about", id: "about" },
    { label: "Experience", href: "#experience", id: "experience" },
    { label: "Projects", href: "#projects", id: "projects" },
    { label: "Research", href: "#research", id: "research" },
    { label: "Tech Stack", href: "#stack", id: "stack" },
    { label: "Contact", href: "#contact", id: "contact" },
  ];

  const { name, github, linkedin } = profile || portfolioData.profile;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#030303]/70 backdrop-blur-md border-b border-zinc-800/50 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#hero"
          className="flex items-center gap-2 group text-white font-medium text-lg tracking-tight"
        >
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 overflow-hidden">
            <Cpu className="w-4 h-4 text-purple-400 transition-transform duration-500 group-hover:rotate-180" />
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <span className="bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent group-hover:text-white transition-colors duration-300">
            {name}
          </span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1 bg-zinc-950/40 border border-zinc-800/40 rounded-full px-1.5 py-1 backdrop-blur-sm">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeSection === item.id
                  ? "bg-zinc-800 text-white shadow-sm border border-zinc-700/50"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Social Icons (Desktop) */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-850 hover:border-zinc-700 hover:text-white transition-all text-zinc-400"
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-850 hover:border-zinc-700 hover:text-white transition-all text-zinc-400"
          >
            <Linkedin className="w-4 h-4" />
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#030303]/95 border-b border-zinc-800 py-6 px-6 backdrop-blur-lg flex flex-col gap-4 animate-in fade-in slide-in-from-top-5 duration-350">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`text-base font-medium py-2 transition-colors ${
                activeSection === item.id ? "text-purple-400" : "text-zinc-400 hover:text-white"
              }`}
            >
              {item.label}
            </a>
          ))}
          <div className="h-px bg-zinc-800 my-2" />
          <div className="flex gap-4">
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-zinc-400 hover:text-white text-sm"
            >
              <Github className="w-4 h-4" /> GitHub
            </a>
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-zinc-400 hover:text-white text-sm"
            >
              <Linkedin className="w-4 h-4" /> LinkedIn
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
