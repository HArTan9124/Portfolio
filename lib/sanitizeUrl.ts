/**
 * sanitizeUrl.ts
 *
 * Validates Firestore-supplied URLs before rendering them in <a href>.
 * Only https: scheme is allowed. Anything else is replaced with "#"
 * so no clickable link is presented but the UI does not break.
 *
 * Rationale: Firestore admin-controlled URL fields could contain
 * javascript:, data:, or phishing URLs if the admin account is compromised.
 */

const ALLOWED_SCHEMES = ["https:"];

/**
 * Returns the URL if it is safe, otherwise returns "#".
 * Treats null/undefined/empty/"#" as intentionally absent links.
 */
export function sanitizeUrl(url: string | null | undefined): string {
  if (!url || url === "#") return "#";

  try {
    const parsed = new URL(url);
    if (!ALLOWED_SCHEMES.includes(parsed.protocol)) {
      console.warn("[sanitizeUrl] Blocked unsafe URL scheme:", parsed.protocol);
      return "#";
    }
    return url;
  } catch {
    // URL constructor throws on relative paths or malformed strings
    // Allow fragment-only (#section) and same-page anchors
    if (url.startsWith("#")) return url;
    console.warn("[sanitizeUrl] Blocked malformed URL:", url);
    return "#";
  }
}

/**
 * Returns true if the URL is valid and renderable as a link.
 */
export function isValidUrl(url: string | null | undefined): boolean {
  return sanitizeUrl(url) !== "#";
}
