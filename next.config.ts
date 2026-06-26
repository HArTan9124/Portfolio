import type { NextConfig } from "next";

/**
 * Security headers applied to every response.
 *
 * CSP accounts for:
 *  - Firebase SDK         → *.googleapis.com, *.firebaseio.com
 *  - Google Fonts         → fonts.googleapis.com, fonts.gstatic.com
 *  - Pyodide (CDN)        → cdn.jsdelivr.net
 *  - Piston execution     → emkc.org, piston.harkerrobotics.org  (connect-src only)
 *  - Framer Motion/React  → 'unsafe-inline' style (framer injects inline styles)
 *
 * Adjust CSP directives whenever you add new third-party origins.
 */
const securityHeaders = [
  // Prevent clickjacking
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  // Prevent MIME-type sniffing
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // Control referrer information
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  // Restrict browser features
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  // XSS protection (legacy browsers)
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  // Content Security Policy
  {
    key: "Content-Security-Policy",
    value: [
      // Base
      "default-src 'self'",
      // Scripts: self + CDN Pyodide + Firebase compat SDKs
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://www.gstatic.com https://apis.google.com",
      // Styles: self + Google Fonts + inline (Framer Motion)
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Fonts: self + Google Fonts CDN
      "font-src 'self' https://fonts.gstatic.com",
      // Images: self + data URIs (icons/svgs) + Firebase Storage
      "img-src 'self' data: https://*.googleapis.com https://*.gstatic.com https://firebasestorage.googleapis.com",
      // Fetch/XHR: self + Firebase + Piston endpoints + Pyodide WASM
      "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://firebasestorage.googleapis.com wss://*.firebaseio.com https://emkc.org https://piston.harkerrobotics.org https://cdn.jsdelivr.net",
      // Workers/WASM: needed for Pyodide
      "worker-src 'self' blob:",
      // Frames: none
      "frame-src 'none'",
      // Objects: none
      "object-src 'none'",
      // Manifest: self
      "manifest-src 'self'",
      // Base URI: self
      "base-uri 'self'",
      // Form action: self only
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,

  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
