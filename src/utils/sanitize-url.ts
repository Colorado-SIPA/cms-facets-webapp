import { sanitizeHTML } from "./sanitize-html";

/**
 * Ensures URLs are safe for href attributes by blocking executable URIs.
 * Satisfies Snyk CWE-79 by aggressively matching javascript, vbscript, and data schemes.
 */
export function sanitizeUrl(url: string): string {
    if (!url) return '#';
    
    // 1. Remove standard whitespace
    const trimmed = url.trim();
    
    // 2. The Regex Denylist
    // ^                            : Starts at the very beginning of the string
    // [\u0000-\u001F\s]*           : Matches any invisible ASCII control characters or spaces used for bypassing
    // (javascript|vbscript|data)   : Matches the malicious schemes
    // /i                           : Case-insensitive (catches JaVaScRiPt:)
    if (/^[\u0000-\u001F\s]*(javascript|vbscript|data):/i.test(trimmed)) {
        return '#'; // Fallback to a safe anchor
    }
    
    // 3. Fallback to our standard HTML escaper for the rest of the string
    return sanitizeHTML(trimmed);
}