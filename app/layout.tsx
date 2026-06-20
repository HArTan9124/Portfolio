import type { Metadata } from "next";
import "./globals.css";
import { portfolioData } from "@/data/portfolio";

const { name, tagline, bio } = portfolioData.profile;

export const metadata: Metadata = {
  title: `${name} | Wearable AI Researcher & Software Engineer`,
  description: bio,
  keywords: [
    name,
    "Wearable AI",
    "WearOS",
    "Android AI",
    "AI Healthcare",
    "IoT Systems",
    "Embedded ML",
    "Human-Computer Interaction",
    "Software Engineer Portfolio"
  ],
  authors: [{ name: name }],
  creator: name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://harshittandon.com",
    title: `${name} | Wearable AI Researcher & Software Engineer`,
    description: tagline,
    siteName: `${name} Portfolio`,
  },
  twitter: {
    card: "summary_large_image",
    title: `${name} | Wearable AI Researcher & Software Engineer`,
    description: tagline,
  },
};

export default function RootLayout({
  children,
  
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="antialiased bg-[#030303] text-zinc-100 selection:bg-purple-500/20 selection:text-white">
        {children}
      </body>
    </html>
  );
}
