import type { AppConfig, MetaDataDef } from './types';

export function initializeConfig(element: HTMLElement): AppConfig {
    const sheetId = element.getAttribute('sheet-id');
    const sheetName = element.getAttribute('sheet-name');
    const itemsPerPage = parseInt(element.getAttribute('items-per-page') || '20', 10);

    if (!sheetId || !sheetName) {
        throw new Error(`[Climate Facets] Critical Error: Missing 'sheet-id' or 'sheet-name' attributes.`);
    }

    // 1. Parse Filters from the DOM
    const availableFilters: Record<string, string[]> = {};
    // Querying the clean, non-prefixed tags
    const filterGroups = element.querySelectorAll('filter-group');
    
    filterGroups.forEach(group => {
        const titleEl = group.querySelector('filter-title');
        if (!titleEl || !titleEl.textContent) return;
        
        const title = titleEl.textContent.trim();
        const itemEls = group.querySelectorAll('filter-item');
        const items = Array.from(itemEls).map(el => el.textContent?.trim() || '').filter(Boolean);
        
        if (items.length > 0) {
            availableFilters[title] = items;
        }
    });

    // 2. Parse Card Layout from the DOM
    const titleEl = element.querySelector('card-title');
    const linkEl = element.querySelector('card-link');
    
    const cardTitleColumn = titleEl ? parseInt(titleEl.getAttribute('column') || '-1', 10) : -1;
    const cardLinkColumn = linkEl ? parseInt(linkEl.getAttribute('column') || '-1', 10) : -1;

    const cardMetaData: MetaDataDef[] = [];
    const metaEls = element.querySelectorAll('card-content');
    
    metaEls.forEach(meta => {
        const colStr = meta.getAttribute('column');
        if (colStr) {
            cardMetaData.push({
                columnIndex: parseInt(colStr, 10),
                label: meta.getAttribute('label') || undefined
            });
        }
    });

    return {
        sheetId,
        sheetName,
        itemsPerPage,
        availableFilters,
        schema: {
            cardTitleColumn,
            cardLinkColumn,
            cardMetaData
        }
    };
}