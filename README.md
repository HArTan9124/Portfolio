# Harshit Tandon — Portfolio

> Futuristic, minimal, dark-mode portfolio for a Software Engineer, Mobile AI Developer, and Wearable Computing Researcher. Built with Next.js 15, TailwindCSS v4, Framer Motion, and Firebase.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Firebase Setup](#firebase-setup)
- [Content Management](#content-management)
- [Deployment](#deployment)
- [Known Issues](#known-issues)

---

## Overview

This is a full-stack, CMS-driven personal portfolio website. All content — including bio, projects, research, achievements, blog posts, and interactive code snippets — is managed via a companion **Admin Panel** and stored in **Cloud Firestore**. The portfolio performs **server-side rendering (SSR)** for SEO and instantly reflects admin edits via **Firestore real-time listeners** on the client.

**Live domains:** `http://localhost:3000` (local dev)

---

## Tech Stack

| Layer          | Technology                              |
|----------------|-----------------------------------------|
| Framework      | Next.js 15 (App Router)                 |
| Language       | TypeScript 5                            |
| Styling        | TailwindCSS v4 (beta)                   |
| Animations     | Framer Motion 12                        |
| Icons          | Lucide React                            |
| Database       | Cloud Firestore (Firebase v10)          |
| Auth           | Firebase Authentication (Google SSO)   |
| Code Execution | Piston API (sandboxed, open-source)     |
| Fonts          | Plus Jakarta Sans, Playfair Display     |

---

## Features

- **Dark-mode first** — premium glassmorphism, gradient accents, smooth micro-animations
- **Real-time sync** — `onSnapshot` listener; admin saves are reflected in ~200ms, no page refresh
- **SSR with static fallback** — Firestore content is fetched at request time; falls back to `data/portfolio.ts` if Firestore is unavailable
- **Interactive Hero** — Dynamic code snippet tabs (Python, Kotlin, JS…) with a ▶ Run button that executes code in a sandboxed terminal modal (macOS traffic-light window controls)
- **Live phone mockup** — Biosignal telemetry (ECG/EEG waveforms, BPM) syncs with code execution results in real time
- **All sections are fully prop-driven** — zero hardcoded strings in components; everything traces to Firestore
- **SEO-ready** — proper `<title>`, `<meta description>`, semantic HTML, single `<h1>` per page

### Portfolio Sections

| Section        | Description                                              |
|----------------|----------------------------------------------------------|
| Hero           | Animated code editor mockup with live biosignal phone UI |
| About          | Bento-grid dashboard with IoT telemetry log              |
| Experience     | Timeline of roles and research positions                 |
| Projects       | Glassmorphism cards (featured 2-col + secondary 3-col)  |
| Research       | Interest pillars with SVG node-mesh animations           |
| Tech Stack     | Categorised skill badges                                 |
| Achievements   | Award and publication cards                              |
| Blog           | Dev-log and article cards                                |
| Contact        | Animated form with success state                         |

---

## Project Structure

```
Portfolio/
├── app/
│   ├── api/
│   │   └── run-code/
│   │       └── route.ts          # Piston API proxy for code execution
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                  # Client component; uses usePortfolioData()
├── components/
│   ├── Hero.tsx                  # Code editor + phone mockup + terminal modal
│   ├── About.tsx
│   ├── Experience.tsx
│   ├── Projects.tsx
│   ├── Research.tsx
│   ├── TechStack.tsx
│   ├── Achievements.tsx
│   ├── Blog.tsx
│   ├── Contact.tsx
│   ├── Footer.tsx
│   ├── Navbar.tsx
│   └── IconMapper.tsx
├── data/
│   └── portfolio.ts              # Static seed data and TypeScript interfaces
├── lib/
│   ├── firebase.ts               # Firebase app initialisation
│   ├── getPortfolioData.ts       # SSR Firestore fetch with deep-merge fallback
│   └── usePortfolioData.ts       # Client-side onSnapshot real-time hook
├── .env.local                    # Firebase credentials (not committed)
├── .env.local.example            # Template for env vars
├── next.config.ts
├── tsconfig.json
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9
- A Firebase project (see [Firebase Setup](#firebase-setup))

### Installation

```bash
# Clone the repo
git clone <your-repo-url>
cd portfolio/Portfolio

# Install dependencies
npm install

# Copy env template and fill in your Firebase credentials
cp .env.local.example .env.local
# Edit .env.local with your values

# Start the development server
npm run dev
```

The portfolio is available at [http://localhost:3000](http://localhost:3000).

### Build for Production

```bash
npm run build
npm start
```

---

## Environment Variables

Create `.env.local` from the provided `.env.local.example`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

> **Never commit `.env.local` to version control.** It is already listed in `.gitignore`.

---

## Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a project (or use `portfolio-3f15a`).
2. Enable **Cloud Firestore** (Native mode, any region).
3. Enable **Google Sign-In** under **Authentication → Sign-in methods**.
4. Deploy Firestore Security Rules from `../firestore.rules`:
   - Open Firebase Console → Firestore → Rules
   - Paste the rules and click **Publish**
5. Copy your Web SDK config into `.env.local`.

### Firestore Data Model

```
Collection: portfolio
  Document: content          ← single document; holds all portfolio data
    Fields:
      profile    {}
      specialties[]
      experiences[]
      projects   []
      research   []
      techStack  []
      achievements[]
      blog       []
      codeSnippets[]
```

All content is seeded via the **Admin Panel** dashboard (Seed Firestore button).

---

## Content Management

All portfolio content is managed through the companion [Admin Panel](../admin%20pannel/README.md).

**Workflow:**
1. Start the admin panel: `cd "../admin pannel" && npm run dev` (runs on port `3001`)
2. Sign in with your authorised Google account
3. Edit any section and click **Save**
4. Changes appear on the portfolio within ~200ms (real-time via `onSnapshot`)

To reset content to the defaults in `data/portfolio.ts`, use the **Seed Firestore** button on the admin dashboard.

---

## Deployment

The project is a standard Next.js app and can be deployed to:

- **Vercel** (recommended) — connect the `Portfolio/` subdirectory as the root
- **Firebase App Hosting** — configure `apphosting.yaml`
- Any Node.js-capable host

Ensure all environment variables are configured in your hosting provider's dashboard.

---

## Known Issues

| Issue | Status | Workaround |
|-------|--------|------------|
| Piston API occasionally slow (~2–3s) or rate-limited | Open | Retry; no fix required for personal use |
| `codeSnippets` field absent if Firestore was seeded before v3 | Open | Re-seed via Admin Panel dashboard |
| Demo links in projects are `#` placeholders | Open | Update `demo` field in Admin → Projects editor |
