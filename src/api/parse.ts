import type { RawSheetData } from '../types';

export function parseCSV(text: string): RawSheetData {
    const result: string[][] = [];
    let row: string[] = [];
    let cell = '';
    let insideQuotes = false;
    
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const nextChar = text[i + 1];
        
        if (char === '"' && insideQuotes && nextChar === '"') {
            cell += '"';
            i++; 
        } else if (char === '"') {
            insideQuotes = !insideQuotes;
        } else if (char === ',' && !insideQuotes) {
            row.push(cell.trim());
            cell = '';
        } else if (char === '\n' && !insideQuotes) {
            row.push(cell.trim());
            result.push(row);
            row = [];
            cell = '';
        } else if (char === '\r' && !insideQuotes) {
            continue;
        } else {
            cell += char;
        }
    }
    
    if (cell || row.length > 0) {
        row.push(cell.trim());
        result.push(row);
    }
    
    return result.filter(r => r.length > 0 && r.some(c => c !== ''));
}