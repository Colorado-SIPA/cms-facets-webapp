import { html } from "../utils/html";
import { t, type Language } from "../i18n";

export function injectLayoutSkeleton(root: ShadowRoot, hasFilters: boolean, lang: Language): void {
    const tempWrapper = document.createElement('div');

    // Conditionally generate the sidebar if filters exist
    const sidebarHtml = hasFilters ? html`
        <aside class="sidebar">
            <!-- Mobile Hamburger Toggle -->
            <button type="button" class="mobile-filter-toggle w-100" aria-expanded="false" aria-controls="filter-sidebar-content" data-action="toggle_accordion">
                <span class="accordion-title">${t(lang, 'filterResults')}</span>
                <span class="accordion-icon animated-hamburger" aria-hidden="true">
                    <span class="line top"></span>
                    <span class="line mid"></span>
                    <span class="line bot"></span>
                </span>
            </button>

            <!-- Collapsible Content Area -->
            <div id="filter-sidebar-content" class="filter-sidebar-content" hidden>
                <section class="search-filters" aria-labelledby="search-filters-heading">
                    <h2 id="search-filters-heading">${t(lang, 'searchFilters')}</h2>
                    <search>
                        <label for="search_text" class="visually-hidden">${t(lang, 'filterResults')}</label>
                        <div class="input-group">
                            <input type="search" class="form-control" name="search_text" id="search_text" placeholder="${t(lang, 'searchPlaceholder')}" autocomplete="off"/>
                            <button class="btn-primary" type="button" data-action="submit_search">${t(lang, 'searchButton')}</button>                          
                        </div>
                    </search>
                    <div class="filters"></div>
                    <button type="button" class="btn-clear" data-action="clear_filters">${t(lang, 'clearFilters')}</button>  
                </section>
            </div>
        </aside>
    ` : '';

    tempWrapper.innerHTML = html`
        <div class="main-page container ${hasFilters ? 'has-sidebar' : 'no-sidebar'}" id="main-page">
            
            ${sidebarHtml}
            
            <dialog id="details-modal" aria-labelledby="modal-title-id" aria-modal="true">
                <div class="modal-content-wrapper">
                    <div class="modal-header">
                        <h2 id="modal-title-id" class="modal-title" tabindex="-1"></h2>
                        <button type="button" class="btn-close" data-action="close_modal" aria-label="${t(lang, 'close')}">&times;</button>
                    </div>
                    <div class="modal-body"></div>
                </div>
            </dialog>                
            
            <div class="main-content">
                <section id="main-container" aria-labelledby="search-results-heading">
                    <h2 id="search-results-heading">${t(lang, 'searchResultsTitle')}</h2>
                    
                    <!-- The Spinner -->
                    <div id="loading-indicator" class="loader-container">
                        <div class="spinner"></div>
                        <p style="margin-top: 1rem; color: #6c757d;">${t(lang, 'loading')}</p>
                    </div>

                    <!-- The Data Wrapper (Hidden by default) -->
                    <div id="data-wrapper" class="hidden">
                        <div id="pagination-summary" role="status"></div>
                        <ul class="container_data facets-grid" aria-label="${t(lang, 'resultsAriaLabel')}"></ul>
                        <nav class="pagination-container" aria-label="${t(lang, 'paginationAria')}"></nav>
                    </div>
                    
                </section>
            </div>
        </div>
    `;

    if (tempWrapper.firstElementChild) {
        root.appendChild(tempWrapper.firstElementChild);
    }
}