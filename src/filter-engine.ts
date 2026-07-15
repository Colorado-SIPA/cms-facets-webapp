import type { ParsedItem, ActiveFilters, FilterOptions } from './types';

function escapeRegExp(text: string): string {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

function containsAny(itemString: string | undefined, selectedValues: string[]): boolean {
    if (!itemString) return false;
    const normalizedItemString = itemString.toLowerCase();
    return selectedValues.some(selected =>
        normalizedItemString.includes(selected.toLowerCase())
    );
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
            const modalValues = item.modalMetaData.map(m => m.value).join(' ');
            const fullText = `${item.title} ${item.link} ${metaValues} ${modalValues}`;
            return regex.test(fullText);
        });
    }
    
    // 2. Generic Checkbox Filtering
    for (const [filterGroupLabel, selectedItems] of Object.entries(activeFilters)) {
        if (selectedItems.length > 0) {

            const targetCols = availableFilters[filterGroupLabel]?.targetColumns || [];

            // Retrieve the operator from the configuration (default to 'or')
            const operator = availableFilters[filterGroupLabel]?.operator || 'any';

            result = result.filter(item => {

                // Extract the evaluation logic into a helper function
                const isMatch = (selected: typeof selectedItems[0]) => {
                    // If the HTML specified columns (e.g. cols="1, 3")
                    if (targetCols.length > 0) {
                        return targetCols.some(colIndex => {
                            const metaDataField = item.metaData.find(m => m.columnIndex === colIndex)
                                || item.modalMetaData.find(m => m.columnIndex === colIndex);
                            return containsAny(metaDataField?.value, [selected.value]);
                        });
                    }

                    // Dynamic Fallback Mapping
                    let matchingMeta = item.metaData.find(m => m.label?.toLowerCase() === filterGroupLabel.toLowerCase())
                        || item.modalMetaData.find(m => m.label?.toLowerCase() === filterGroupLabel.toLowerCase());

                    if (!matchingMeta) {
                        matchingMeta = item.metaData.find(m => m.label?.toLowerCase() === selected.label.toLowerCase())
                            || item.modalMetaData.find(m => m.label?.toLowerCase() === selected.label.toLowerCase());
                    }

                    const itemValue = matchingMeta ? matchingMeta.value : undefined;
                    return containsAny(itemValue, [selected.value]);
                };

                // Apply either AND (.every) or OR (.some) based on the config
                return operator === 'all' ? selectedItems.every(isMatch) : selectedItems.some(isMatch);
            });
        }
    }
    return result;
}