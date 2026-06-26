// app/api/run-code/route.ts
//
// Executes code via Piston.  Python is handled client-side via Pyodide —
// this route is only called for Kotlin, JS, TS, Java, etc.
//
// Security hardening (2026-06):
//   • Rate-limited: max 10 requests per IP per minute (in-process sliding window)
//   • Body-size cap: 16 KB max
//   • Strict language allowlist — only pre-approved languages may be submitted
//   • Request schema validated — unknown keys are ignored; required fields asserted
//   • Abuse logging: every request logs IP + language for operational visibility
//   • Code-length cap: 8 000 chars to prevent oversized payloads

import { NextRequest, NextResponse } from "next/server";

// ── Constants ────────────────────────────────────────────────────────────────

const MAX_BODY_BYTES   = 16_384;   // 16 KB
const MAX_CODE_CHARS   = 8_000;    // char limit on submitted code
const RATE_LIMIT_MAX   = 10;       // max requests per window
const RATE_LIMIT_MS    = 60_000;   // 60-second sliding window

// Ordered list of public Piston instances to try
const PISTON_ENDPOINTS = [
  "https://emkc.org/api/v2/piston/execute",
  "https://piston.harkerrobotics.org/api/v2/piston/execute",
];

// Only these languages may be submitted — prevents unknown resource abuse.
// Python is explicitly excluded here because it runs via Pyodide client-side.
const LANG_MAP: Record<string, { language: string; version: string }> = {
  kotlin:     { language: "kotlin",     version: "1.6.20-release-943" },
  javascript: { language: "javascript", version: "18.15.0" },
  typescript: { language: "typescript", version: "5.0.3" },
  java:       { language: "java",       version: "15.0.2" },
};

// ── In-process rate limiter (sliding window per IP) ──────────────────────────
// NOTE: This is a per-instance in-memory store. For a horizontally-scaled
// deployment, replace this with Redis/Upstash.

const ipWindows = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (ipWindows.get(ip) ?? []).filter(
    (t) => now - t < RATE_LIMIT_MS
  );
  if (timestamps.length >= RATE_LIMIT_MAX) return true;
  timestamps.push(now);
  ipWindows.set(ip, timestamps);
  return false;
}

// ── Piston helper ─────────────────────────────────────────────────────────────

async function tryPiston(
  endpoint: string,
  body: object
): Promise<{ ok: boolean; data?: object }> {
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(12000), // 12 s timeout per endpoint
    });
    if (!res.ok) return { ok: false };
    const data = await res.json();
    return { ok: true, data };
  } catch {
    return { ok: false };
  }
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // ── 1. IP extraction for rate limiting + logging
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  // ── 2. Rate limit check
  if (isRateLimited(ip)) {
    console.warn(`[run-code] Rate limit exceeded — ip=${ip}`);
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment." },
      { status: 429 }
    );
  }

  // ── 3. Body-size check (read raw text first)
  const rawText = await req.text();
  if (rawText.length > MAX_BODY_BYTES) {
    console.warn(`[run-code] Oversized body — ip=${ip} bytes=${rawText.length}`);
    return NextResponse.json(
      { error: "Request body too large." },
      { status: 413 }
    );
  }

  // ── 4. Parse + schema validation
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return NextResponse.json({ error: "Invalid request shape." }, { status: 400 });
  }

  const body = parsed as Record<string, unknown>;
  const language = typeof body.language === "string" ? body.language.toLowerCase().trim() : "";
  const code     = typeof body.code     === "string" ? body.code     : "";
  const filename = typeof body.filename === "string" ? body.filename : "main";

  // ── 5. Language allowlist
  const lang = LANG_MAP[language];
  if (!lang) {
    console.warn(`[run-code] Rejected language="${language}" — ip=${ip}`);
    return NextResponse.json(
      { error: `Language "${language}" is not supported. Allowed: ${Object.keys(LANG_MAP).join(", ")}` },
      { status: 400 }
    );
  }

  // ── 6. Code-length guard
  if (code.length > MAX_CODE_CHARS) {
    return NextResponse.json(
      { error: `Code exceeds maximum length of ${MAX_CODE_CHARS} characters.` },
      { status: 400 }
    );
  }

  // ── 7. Sanitize filename (strip path traversal, keep extension)
  const safeFilename = filename.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 64);

  console.info(`[run-code] Execute — ip=${ip} lang=${language} codeLen=${code.length}`);

  const pistonBody = {
    language: lang.language,
    version:  lang.version,
    files:    [{ name: safeFilename, content: code }],
  };

  // ── 8. Try each Piston endpoint in order
  for (const endpoint of PISTON_ENDPOINTS) {
    const { ok, data } = await tryPiston(endpoint, pistonBody);
    if (ok && data) {
      const r = data as { run?: { stdout?: string; stderr?: string; code?: number } };
      return NextResponse.json({
        stdout:   r.run?.stdout   ?? "",
        stderr:   r.run?.stderr   ?? "",
        exitCode: r.run?.code     ?? 0,
      });
    }
  }

  // ── 9. All endpoints failed
  return NextResponse.json(
    {
      stdout: "",
      stderr:
        "⚠ Sandbox unavailable — all execution endpoints are offline or rate-limited.\n" +
        "Tip: paste this code into https://play.kotlinlang.org or https://repl.it to run it.",
      exitCode: 1,
    },
    { status: 503 }
  );
}
