import { html } from "../utils/html";

export function injectLayoutSkeleton(root: ShadowRoot, hasFilters: boolean): void {
    const tempWrapper = document.createElement('div');

    // Conditionally generate the sidebar if filters exist
    const sidebarHtml = hasFilters ? html`
        <div class="sidebar">
            <!-- Mobile Hamburger Toggle -->
            <button type="button" class="mobile-filter-toggle btn-primary w-100" aria-expanded="false" aria-controls="filter-sidebar-content" data-action="toggle_accordion">
                <span class="accordion-title">Filter Results</span>
                <span class="accordion-icon animated-hamburger" aria-hidden="true">
                    <span class="line top"></span>
                    <span class="line mid"></span>
                    <span class="line bot"></span>
                </span>
            </button>

            <!-- Collapsible Content Area -->
            <div id="filter-sidebar-content" class="filter-sidebar-content" hidden>
                <section class="search-filters" aria-labelledby="search-filters-heading">
                    <h2 id="search-filters-heading">Search Filters</h2>
                    <div>
                        <label for="search_text" class="visually-hidden">Filter Search Results</label>
                        <div class="input-group">
                            <input type="text" class="form-control" name="search_text" id="search_text" placeholder="Search..." autocomplete="off"/>
                            <button class="btn-primary" type="button" data-action="submit_search">Search</button>                          
                        </div>
                    </div>
                    <div class="filters"></div>
                    <button type="button" class="btn-clear" data-action="clear_filters">Clear all filters</button>  
                </section>
            </div>
        </div>
    ` : '';

    tempWrapper.innerHTML = html`
        <div class="main-page container ${hasFilters ? 'has-sidebar' : 'no-sidebar'}" id="main-page">
            
            ${sidebarHtml}
            
            <dialog id="details-modal" aria-labelledby="modal-title-id" aria-modal="true">
                <div class="modal-content-wrapper">
                    <div class="modal-header">
                        <h2 id="modal-title-id" class="modal-title" tabindex="-1"></h2>
                        <button type="button" class="btn-close" data-action="close_modal" aria-label="Close dialog">&times;</button>
                    </div>
                    <div class="modal-body"></div>
                </div>
            </dialog>                
            
            <div class="main-content">
                <section id="main-container" aria-labelledby="search-results-heading">
                    <h2 id="search-results-heading">Search Results</h2>
                    
                    <!-- The Spinner -->
                    <div id="loading-indicator" class="loader-container">
                        <div class="spinner"></div>
                        <p style="margin-top: 1rem; color: #6c757d;">Loading data...</p>
                    </div>

                    <!-- The Data Wrapper (Hidden by default) -->
                    <div id="data-wrapper" class="hidden">
                        <div id="pagination-summary" role="status"></div>
                        <ul class="container_data facets-grid" aria-label="Search results. Links open in a new tab."></ul>
                        <div class="pagination-container"></div>
                    </div>
                    
                </section>
            </div>
        </div>
    `;

    if (tempWrapper.firstElementChild) {
        root.appendChild(tempWrapper.firstElementChild);
    }
}