import type { ParsedItem, ActiveFilters, FilterOptions } from './types';

function escapeRegExp(text: string): string {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

function containsAny(itemString: string | undefined, selectedValues: string[]): boolean {
    if (!itemString) return false;
    // Keep the comma splitting in case a single cell has multiple values (e.g., "Adaptation, Mitigation")
    const itemValues = itemString.split(',').map(val => val.trim());
    return selectedValues.some(selected => itemValues.includes(selected));
}

export function applyFilters(
    rawData: ParsedItem[],
    activeFilters: ActiveFilters,
    availableFilters: FilterOptions,
    searchQuery: string
): ParsedItem[] {
    let result = rawData;

    // 1. Text Search Filtering (Look across all metaData values)
    if (searchQuery.trim() !== '') {
        const regex = new RegExp(escapeRegExp(searchQuery), 'i');
        result = result.filter((item) => {
            const metaValues = item.metaData.map(m => m.value).join(' ');
            const fullText = `${item.title} ${item.link} ${metaValues}`;
            return regex.test(fullText);
        });
    }

    // 2. Generic Checkbox Filtering
    for (const [filterLabel, selectedValues] of Object.entries(activeFilters)) {
        if (selectedValues.length > 0) {
            
            // Grab the specific columns this group is allowed to search from our config
            const targetCols = availableFilters[filterLabel]?.targetColumns || [];

            result = result.filter(item => {
                
                // ✨ If the HTML specified columns (e.g. cols="1, 3"), ONLY search those columns!
                if (targetCols.length > 0) {
                    return targetCols.some(colIndex => {
                        const metaDataField = item.metaData.find(m => m.columnIndex === colIndex);
                        return containsAny(metaDataField?.value, selectedValues);
                    });
                }
                
                // Fallback: If no columns were specified in HTML, do exactly what it did before
                const matchingMeta = item.metaData.find(m => m.label === filterLabel);
                const itemValue = matchingMeta ? matchingMeta.value : undefined;
                
                return containsAny(itemValue, selectedValues);
            });
        }
    }

    return result;
}