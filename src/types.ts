// 1. Core Configuration Types
// --------------------------------------------------------
export interface MetaDataDef {
    columnIndex: number;
    label?: string;
    linkType?: string;
    format?: string;
}

export interface SchemaConfig {
    cardActionText: string | null;
    cardLinkColumn: number;
    cardMetaData: MetaDataDef[];
    cardTitleColumn: number;
    modalMetaData: MetaDataDef[];
    modalTitleColumn: number;
}

export interface AppConfig {
    availableFilters: FilterOptions;
    itemsPerPage: number;
    schema: SchemaConfig;
    sheetId: string;
    sheetName: string;
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
    link: string | null;
    metaData: MetaDataValue[];
    modalMetaData: MetaDataValue[];
    modalTitle: string;
    title: string;
}

export interface MetaDataValue {
    columnIndex: number;
    label?: string;
    value: string;
    linkType?: string;
    format?: string;
}

export interface FilterItemDef {
    label: string;
    value: string;
}

export type ParsedItem = GenericDataItem;

// 4. Filter Types
// --------------------------------------------------------
export type FilterOptions = Record<string, FilterGroupDef>;
export type ActiveFilters = Record<string, FilterItemDef[]>;
export interface FilterGroupDef {
    items: FilterItemDef[];
    targetColumns: number[];
    operator?: 'any' | 'all';
}

// 5. Application State
// --------------------------------------------------------
export interface AppState {
    activeFilters: ActiveFilters;
    availableFilters: FilterOptions;
    config: AppConfig;
    currentPage: number;
    error: string | null;
    filteredData: ParsedItem[];
    isLoading: boolean;
    lastFocusedElement: HTMLElement | null;
    rawData: ParsedItem[];
    searchQuery: string;
    totalPages: number;
}