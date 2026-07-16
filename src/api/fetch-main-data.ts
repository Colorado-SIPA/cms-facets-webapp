import type { AppConfig, ParsedItem, MetaDataValue, MetaDataDef } from '../types';
import { parseCSV } from './parse';

export async function fetchMainData(config: AppConfig): Promise<ParsedItem[]> {
    const url = `https://docs.google.com/spreadsheets/d/${config.sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(config.sheetName)}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const csvText = await response.text();
        const rawData = parseCSV(csvText);

        rawData.shift(); // Remove the header row

        if (config.sort === 'random') {
            for (let i = rawData.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [rawData[i], rawData[j]] = [rawData[j], rawData[i]];
            }
        } else if (config.sort === 'alphabetical') {
            rawData.sort((a, b) => {
                const valA = a[0] || '';
                const valB = b[0] || '';
                return valA.toLowerCase().localeCompare(valB.toLowerCase());
            });
        }

        const parsedData: ParsedItem[] = rawData.map((row, index) => {
            const metaData = mapMetaData(config.schema.cardMetaData, row);
            const modalMetaData = mapMetaData(config.schema.modalMetaData, row);

            // Handle optional links and titles gracefully
            const linkVal = config.schema.cardLinkColumn >= 0 ? (cleanCellData(row[config.schema.cardLinkColumn]) || 'Not available') : null;
            const titleVal = config.schema.cardTitleColumn >= 0 ? (cleanCellData(row[config.schema.cardTitleColumn]) || 'Not available') : 'Not available';
            const modalTitleVal = config.schema.modalTitleColumn >= 0 ? (cleanCellData(row[config.schema.modalTitleColumn]) || 'Not available') : titleVal;

            return {
                id: `item-${index}`,
                title: titleVal,
                link: linkVal,
                metaData,
                modalTitle: modalTitleVal,
                modalMetaData
            };
        });

        // If the user provided a custom sort, return it. Otherwise, use the fallback.
        return config.sort ? parsedData : sortItemsByTitle(parsedData);

    } catch (error) {
        console.error('[Climate Facets] Error fetching main data:', error);
        throw error;
    }
}

// Helper function to map schema definitions to populated values
function mapMetaData(schemaDefs: MetaDataDef[], row: string[]): MetaDataValue[] {
    return schemaDefs.map(def => ({
        label: def.label,
        value: cleanCellData(row[def.columnIndex]) || 'Not available',
        columnIndex: def.columnIndex,
        linkType: def.linkType,
        format: def.format,
        anchorText: def.anchorText,
        ariaLabel: def.ariaLabel
    }));
}

function sortItemsByTitle(items: ParsedItem[]): ParsedItem[] {
    return items.sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()));
}

function cleanCellData(val: string | undefined): string {
    if (!val) return 'Not available';
    return val.replace(/"/g, '');
}