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

            result = result.filter(item => {

                // If the HTML specified columns (e.g. cols="1, 3"), ONLY search those columns
                if (targetCols.length > 0) {
                    return selectedItems.some(selected => {
                        return targetCols.some(colIndex => {
                            const metaDataField = item.metaData.find(m => m.columnIndex === colIndex)
                                || item.modalMetaData.find(m => m.columnIndex === colIndex);
                            return containsAny(metaDataField?.value, [selected.value]);
                        });
                    });
                }

                // Dynamic Fallback Mapping
                return selectedItems.some(selected => {
                    // Try to map the search to the Group Title (e.g., standard "Services Offered" column)
                    let matchingMeta = item.metaData.find(m => m.label?.toLowerCase() === filterGroupLabel.toLowerCase())
                        || item.modalMetaData.find(m => m.label?.toLowerCase() === filterGroupLabel.toLowerCase());

                    // If the group column doesn't exist, map it to the Checkbox Label (e.g., "Service In Spanish" column)
                    if (!matchingMeta) {
                        matchingMeta = item.metaData.find(m => m.label?.toLowerCase() === selected.label.toLowerCase())
                            || item.modalMetaData.find(m => m.label?.toLowerCase() === selected.label.toLowerCase());
                    };

                    const itemValue = matchingMeta ? matchingMeta.value : undefined;
                    return containsAny(itemValue, [selected.value]);
                });
            });
        }
    }

    return result;
}