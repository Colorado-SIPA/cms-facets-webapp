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
            // ✨ FIX: Use the imported interface instead of the inline type
            const metaData: MetaDataValue[] = []; 
            
            config.schema.cardMetaData.forEach(def => {
                metaData.push({
                    label: def.label,
                    value: row[def.columnIndex] || 'Not available',
                    columnIndex: def.columnIndex // ✨ FIX: Add this to the runtime object!
                });
            });

            return {
                id: `item-${index}`,
                title: row[config.schema.cardTitleColumn] || 'Not available',
                link: row[config.schema.cardLinkColumn] || 'Not available',
                metaData
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