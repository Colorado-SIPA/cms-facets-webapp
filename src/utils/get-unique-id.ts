/**
 * Creates a random unique string for use in element IDs
 */

export function getUniqueId (): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }
    return Math.random().toString(36).substring(2, 9);
};