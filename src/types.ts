// 1. Core Configuration Types
// --------------------------------------------------------
export interface MetaDataDef {
    label?: string;
    columnIndex: number; 
}

export interface SchemaConfig {
    cardTitleColumn: number;
    cardLinkColumn: number;
    cardMetaData: MetaDataDef[];
}

export interface AppConfig {
    sheetId: string;
    sheetName: string;
    itemsPerPage: number;
    schema: SchemaConfig;
    availableFilters: FilterOptions; 
}

// 2. Raw Data Types
// --------------------------------------------------------
export type RawSheetRow = string[];
export type RawSheetData = RawSheetRow[];

export interface GoogleSheetsResponse {
    values: RawSheetData;
}

// 3. Parsed Data Models (GENERIC)
// --------------------------------------------------------
export interface GenericDataItem {
    id: string;
    title: string;
    link: string;
    metaData: MetaDataValue[];
}

export interface MetaDataValue {
    label?: string;
    value: string;
    columnIndex: number;
}

export type ParsedItem = GenericDataItem;

// 4. Filter Types
// --------------------------------------------------------
export type FilterOptions = Record<string, FilterGroupDef>; 
export type ActiveFilters = Record<string, string[]>;
export interface FilterGroupDef {
    items: string[];
    targetColumns: number[];
}

// 5. Application State
// --------------------------------------------------------
export interface AppState {
    config: AppConfig;
    rawData: ParsedItem[];       
    filteredData: ParsedItem[];  
    availableFilters: FilterOptions;
    activeFilters: ActiveFilters;
    searchQuery: string;
    currentPage: number;
    totalPages: number;
    isLoading: boolean;
    error: string | null;
}