import type { AppConfig, MetaDataDef, FilterGroupDef } from './types';

export function initializeConfig(element: HTMLElement): AppConfig {
    const sheetId = element.getAttribute('sheet-id');
    const sheetName = element.getAttribute('sheet-name');
    const itemsPerPage = parseInt(element.getAttribute('items-per-page') || '20', 10);

// Read the sort attribute (validate it matches our expected values)
    const rawSort = element.getAttribute('sort');
    const sort = (rawSort === 'random' || rawSort === 'alphabetical') ? rawSort : undefined;    

    if (!sheetId || !sheetName) {
        throw new Error(`[Climate Facets] Critical Error: Missing 'sheet-id' or 'sheet-name' attributes.`);
    }

    // 1. Parse Filters from the DOM
    const availableFilters: Record<string, FilterGroupDef> = {};
    const filterGroups = element.querySelectorAll('filter-group');

    filterGroups.forEach(group => {
        const titleEl = group.querySelector('filter-title');
        if (!titleEl || !titleEl.textContent) return;

        const title = titleEl.textContent.trim();
        const itemEls = group.querySelectorAll('filter-item');

        const items = Array.from(itemEls).map(el => {
            const label = el.textContent?.trim() || '';
            const value = el.getAttribute('value') || label;
            return { label, value };
        }).filter(item => item.label !== '');

        const colsAttr = group.getAttribute('cols');
        const targetColumns = (() => {
            if (colsAttr) {
                return colsAttr.split(',').map(str => parseInt(str.trim(), 10)).filter(num => !isNaN(num))
            }
            return []
        })();

        const matchAttr = group.getAttribute('match');
        const operator = matchAttr && matchAttr.toLowerCase() === 'all' ? 'all' : 'any';

        if (items.length > 0) {
            availableFilters[title] = {
                items,
                targetColumns,
                operator
            };
        }
    });
    
    // 2. Parse Card Layout from the DOM
    const titleEl = element.querySelector('card-title');
    const linkEl = element.querySelector('card-link');
    const actionEl = element.querySelector('card-action[trigger="modal"]');

    const cardTitleColumn = titleEl ? parseInt(titleEl.getAttribute('column') || '-1', 10) : -1;
    const cardLinkColumn = linkEl ? parseInt(linkEl.getAttribute('column') || '-1', 10) : -1;
    const cardActionText = actionEl ? actionEl.textContent?.trim() || 'View Details' : null;
    const cardMetaData: MetaDataDef[] = parseMetaDataElements(element, 'card-content');

    // 3. Parse Modal Layout from the DOM
    const modalTitleEl = element.querySelector('modal-title');
    const modalTitleColumn = modalTitleEl ? parseInt(modalTitleEl.getAttribute('column') || '-1', 10) : -1;
    const modalMetaData: MetaDataDef[] = parseMetaDataElements(element, 'modal-content');

    return {
        sheetId,
        sheetName,
        itemsPerPage,
        sort,
        availableFilters,
        schema: {
            cardTitleColumn,
            cardLinkColumn,
            cardMetaData,
            cardActionText,
            modalTitleColumn,
            modalMetaData
        }
    };
}

// Helper function to parse metadata for cards and modals
function parseMetaDataElements(rootElement: HTMLElement, selector: string): MetaDataDef[] {
    const metaData: MetaDataDef[] = [];
    
    rootElement.querySelectorAll(selector).forEach(meta => {
        const colStr = meta.getAttribute('column');
        if (colStr) {
            metaData.push({
                anchorText: meta.getAttribute('anchor-text') || undefined,
                ariaLabel: meta.getAttribute('aria-label') || undefined,
                columnIndex: parseInt(colStr, 10),
                format: meta.getAttribute('format') || undefined,
                label: meta.getAttribute('label') || undefined,
                linkType: meta.getAttribute('link-type') || undefined,
            });
        }
    });
    
    return metaData;
}