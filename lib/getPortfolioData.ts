// lib/getPortfolioData.ts
// Server-side data fetching utility.
// Fetches portfolio content from Firestore at request time (SSR).
// Falls back gracefully to the static data/portfolio.ts if Firestore is
// unavailable (env vars missing, network error, or during local development
// before Firebase is configured).

import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import { portfolioData, type PortfolioData } from "@/data/portfolio";

const COLLECTION = "portfolio";
const DOCUMENT = "content";

export async function getPortfolioData(): Promise<PortfolioData> {
  // Skip Firestore fetch if Firebase is not yet configured
  if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    console.warn("[portfolio] Firebase not configured — using static data.");
    return portfolioData;
  }

  try {
    const ref = doc(db, COLLECTION, DOCUMENT);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      const data = snap.data() as PortfolioData;
      // Merge with static data as a safety net for any missing keys
      return { ...portfolioData, ...data };
    }

    console.warn("[portfolio] Firestore document not found — using static data.");
    return portfolioData;
  } catch (error) {
    console.error("[portfolio] Firestore fetch failed — falling back to static data:", error);
    return portfolioData;
  }
}
