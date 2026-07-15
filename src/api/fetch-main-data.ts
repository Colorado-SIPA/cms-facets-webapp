import type { AppConfig, ParsedItem, MetaDataValue } from '../types';
import { parseCSV } from './parse';

export async function fetchMainData(config: AppConfig): Promise<ParsedItem[]> {
    const url = `https://docs.google.com/spreadsheets/d/${config.sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(config.sheetName)}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const csvText = await response.text();
        const rawData = parseCSV(csvText);

        rawData.shift(); // Remove the header row

        const parsedData: ParsedItem[] = rawData.map((row, index) => {
            const metaData: MetaDataValue[] = [];
            config.schema.cardMetaData.forEach(def => {
                metaData.push({
                    label: def.label,
                    value: cleanCellData(row[def.columnIndex]) || 'Not available',
                    columnIndex: def.columnIndex,
                    linkType: def.linkType,
                    format: def.format
                });
            });

            // Map the Modal Data
            const modalMetaData: MetaDataValue[] = [];
            config.schema.modalMetaData.forEach(def => {
                modalMetaData.push({
                    label: def.label,
                    value: cleanCellData(row[def.columnIndex]) || 'Not available',
                    columnIndex: def.columnIndex,
                    linkType: def.linkType,
                    format: def.format
                });
            });

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

        return sortItemsByTitle(parsedData);

    } catch (error) {
        console.error('[Climate Facets] Error fetching main data:', error);
        throw error;
    }
}

function sortItemsByTitle(items: ParsedItem[]): ParsedItem[] {
    return items.sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()));
}

function cleanCellData(val: string | undefined): string {
    if (!val) return 'Not available';
    return val.replace(/"/g, '');
}