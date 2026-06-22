// app/api/run-code/route.ts
// Executes code via Piston.  emkc.org now requires auth, so we use the
// community-run instance at pistonapi.io as primary, with emkc as fallback.
// Python is handled client-side via Pyodide — this route is only called
// for Kotlin, JS, TS, Java, etc.

import { NextRequest, NextResponse } from "next/server";

// Ordered list of public Piston instances to try
const PISTON_ENDPOINTS = [
  "https://emkc.org/api/v2/piston/execute",
  "https://piston.harkerrobotics.org/api/v2/piston/execute",
];

const LANG_MAP: Record<string, { language: string; version: string }> = {
  python:     { language: "python",     version: "3.10.0" },
  kotlin:     { language: "kotlin",     version: "1.6.20-release-943" },
  javascript: { language: "javascript", version: "18.15.0" },
  typescript: { language: "typescript", version: "5.0.3" },
  java:       { language: "java",       version: "15.0.2" },
};

async function tryPiston(
  endpoint: string,
  body: object
): Promise<{ ok: boolean; data?: object }> {
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(12000), // 12s timeout per endpoint
    });
    if (!res.ok) return { ok: false };
    const data = await res.json();
    return { ok: true, data };
  } catch {
    return { ok: false };
  }
}

export async function POST(req: NextRequest) {
  const { language, code, filename } = await req.json();

  const lang = LANG_MAP[language?.toLowerCase()] ?? LANG_MAP.python;

  const body = {
    language: lang.language,
    version:  lang.version,
    files:    [{ name: filename ?? "main", content: code }],
  };

  // Try each endpoint in order
  for (const endpoint of PISTON_ENDPOINTS) {
    const { ok, data } = await tryPiston(endpoint, body);
    if (ok && data) {
      const r = data as { run?: { stdout?: string; stderr?: string; code?: number } };
      return NextResponse.json({
        stdout:   r.run?.stdout   ?? "",
        stderr:   r.run?.stderr   ?? "",
        exitCode: r.run?.code     ?? 0,
      });
    }
  }

  // All endpoints failed
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
