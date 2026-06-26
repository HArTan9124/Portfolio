"use client";

import React from "react";
import { Cpu, Github, Linkedin, Heart } from "lucide-react";
import type { Profile } from "@/data/portfolio";
import { sanitizeUrl } from "@/lib/sanitizeUrl";

interface FooterProps {
  profile: Profile;
}

export default function Footer({ profile }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const { name, github, linkedin } = profile;
  const safeGithub   = sanitizeUrl(github);
  const safeLinkedin = sanitizeUrl(linkedin);

  return (
    <footer className="bg-[#030303] border-t border-zinc-900 py-12">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div className="flex items-center gap-2 text-zinc-500 text-sm font-mono">
          <Cpu className="w-4 h-4 text-purple-500" />
          <span>&copy; {currentYear} {name}. All rights reserved.</span>
        </div>

        {/* Philosophy tag */}
        <div className="flex items-center gap-1.5 text-zinc-500 text-xs font-mono">
          <span>Engineered with</span>
          <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
          <span>for Healthcare</span>
        </div>

        {/* Social Link Redirects */}
        <div className="flex items-center gap-4 text-zinc-500">
          <a
            href={safeGithub}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            href={safeLinkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            <Linkedin className="w-4 h-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
