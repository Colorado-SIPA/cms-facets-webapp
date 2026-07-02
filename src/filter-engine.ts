import type { ParsedItem, ActiveFilters } from './types';

function escapeRegExp(text: string): string {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

function containsAny(itemString: string | undefined, selectedValues: string[]): boolean {
    if (!itemString) return false;
    const itemValues = itemString.split(',').map(val => val.trim());
    return selectedValues.some(selected => itemValues.includes(selected));
}

export function applyFilters(
    rawData: ParsedItem[],
    activeFilters: ActiveFilters,
    searchQuery: string
): ParsedItem[] {
    let result = rawData;

// 1. Text Search Filtering (Look across all metaData values)
    if (searchQuery.trim() !== '') {
        const regex = new RegExp(escapeRegExp(searchQuery), 'i');
        result = result.filter((item) => {
            // Map through the array of objects to extract just the values
            const metaValues = item.metaData.map(m => m.value).join(' ');
            const fullText = `${item.title} ${item.link} ${metaValues}`;
            return regex.test(fullText);
        });
    }

    // 2. Generic Checkbox Filtering
    // Loop through every dynamically generated filter category in our state
    for (const [filterLabel, selectedValues] of Object.entries(activeFilters)) {
        if (selectedValues.length > 0) {
            result = result.filter(item => {
                // Search the metaData array for the object matching our filter label
                const matchingMeta = item.metaData.find(m => m.label === filterLabel);
                
                // If found, grab its value string. If not, fallback to undefined.
                const itemValue = matchingMeta ? matchingMeta.value : undefined;
                
                return containsAny(itemValue, selectedValues);
            });
        }
    }

    return result;
}