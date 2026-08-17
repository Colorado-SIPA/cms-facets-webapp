/**
 * A dictionary of all localizable strings.
 * 'en' is the default language and fallback.
 * The keys here are used as identifiers in the component's templates.
 */
export const translations = {
  en: {
    about: 'about',
    appRegionAria: 'Faceted Search Application',
    clearFilters: 'Clear all filters',
    close: 'Close',
    closeDetails: 'Close Details',
    displayingSummary: 'Displaying <strong>{start}</strong> through <strong>{end}</strong> of <strong>{total}</strong> total results',
    displayingZero: 'Displaying 0 results',
    errorMessage: 'We are unable to load the data at this time. Please try refreshing the page later.',
    errorTitle: 'Data Unavailable',
    filterGroupAria: '{title} checkbox filters. Selecting a filter updates the search results.',
    filterResults: 'Filter Search Results',
    goToPage: 'Go to page {page}',
    loading: 'Loading data...',
    nextPageAria: 'Go to next page',
    nextText: 'Next',
    noResults: 'No results found. Please broaden your search criteria.',
    notAvailable: 'Not available',
    paginationAria: 'Pagination',
    prevPageAria: 'Go to previous page',
    prevText: 'Prev',
    resultsAriaLabel: 'Search results. Links open in a new tab.',
    searchButton: 'Search',
    searchFilters: 'Search Filters',
    searchPlaceholder: 'Search...',
    searchResultsTitle: 'Search Results',
  },
  es: {
    about: 'sobre',
    appRegionAria: 'Aplicación de Búsqueda Facetada',
    clearFilters: 'Borrar todos los filtros',
    close: 'Cerrar',
    closeDetails: 'Cerrar Detalles',
    displayingSummary: 'Mostrando <strong>{start}</strong> a <strong>{end}</strong> de <strong>{total}</strong> resultados totales',
    displayingZero: 'Mostrando 0 resultados',
    errorMessage: 'No podemos cargar los datos en este momento. Intente actualizar la página más tarde.',
    errorTitle: 'Datos No Disponibles',
    filterGroupAria: 'Filtros de {title}. Seleccionar un filtro actualiza los resultados de búsqueda.',
    filterResults: 'Filtrar Resultados de Búsqueda',
    goToPage: 'Ir a la página {page}',
    loading: 'Cargando datos...',
    nextPageAria: 'Ir a la página siguiente',
    nextText: 'Siguiente',
    noResults: 'No se encontraron resultados. Amplíe sus criterios de búsqueda.',
    notAvailable: 'No disponible',
    paginationAria: 'Paginación',
    prevPageAria: 'Ir a la página anterior',
    prevText: 'Anterior',
    resultsAriaLabel: 'Resultados de la búsqueda. Los enlaces se abren en una nueva pestaña.',
    searchButton: 'Buscar',
    searchFilters: 'Filtros de Búsqueda',
    searchPlaceholder: 'Buscar...',
    searchResultsTitle: 'Resultados de la Búsqueda',
  },
  // To add a new language, simply add a new entry here, e.g., de: { ... }
};

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations['en'];

/**
 * A helper function to get the correct translation string.
 * It falls back to English if the requested language or key is missing.
 */
export function t (lang: Language, key: TranslationKey, vars?: Record<string, string | number>): string {
  const langPack = translations[lang] || translations.en;
  let str = langPack[key] || translations.en[key];
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), v.toString());
    }
  }
  return str;
}

/**
 * A type guard to check if a string is a valid, supported language.
 */
export function isLanguage (lang: string): lang is Language {
  return lang in translations;
}
