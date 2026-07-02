/**
 * Converts potentially malicious HTML characters into safe string entities.
 */
export function sanitizeHTML(text: string): string {
    if (!text) return '';
    return text.replace(/[&<>"']/g, (match) => {
        const escapeMap: Record<string, string> = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };
        return escapeMap[match];
    });
}