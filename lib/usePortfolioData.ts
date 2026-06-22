"use client";
// lib/usePortfolioData.ts
// Real-time Firestore listener hook.
// Starts with static seed data so the page is never blank,
// then subscribes to Firestore and updates instantly on any admin save.

import { useState, useEffect } from "react";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "./firebase";
import { portfolioData, type PortfolioData } from "@/data/portfolio";

export function mergePortfolioData(local: PortfolioData, remote: Partial<PortfolioData>): PortfolioData {
  return {
    profile: remote.profile
      ? {
          ...local.profile,
          ...remote.profile,
          stats: remote.profile.stats ?? local.profile.stats,
          codeSnippets: remote.profile.codeSnippets ?? local.profile.codeSnippets,
          researchPillars: remote.profile.researchPillars ?? local.profile.researchPillars,
          coreStack: remote.profile.coreStack ?? local.profile.coreStack,
        }
      : local.profile,
    specialties: remote.specialties ?? local.specialties,
    experiences: remote.experiences ?? local.experiences,
    projects: remote.projects ?? local.projects,
    research: remote.research ?? local.research,
    techStack: remote.techStack ?? local.techStack,
    achievements: remote.achievements ?? local.achievements,
    blog: remote.blog ?? local.blog,
  };
}

export function usePortfolioData(): PortfolioData {
  const [data, setData] = useState<PortfolioData>(portfolioData);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) return;

    const unsub = onSnapshot(
      doc(db, "portfolio", "content"),
      (snap) => {
        if (snap.exists()) {
          // Deep-merge: Firestore data wins; static data fills any missing fields/keys
          setData(mergePortfolioData(portfolioData, snap.data() as Partial<PortfolioData>));
        }
      },
      (err) => console.error("[portfolio] Realtime listener error:", err)
    );

    return unsub; // cleanup on unmount
  }, []);

  return data;
}
