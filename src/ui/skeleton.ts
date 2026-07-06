import { html } from "../utils/html";

export function injectLayoutSkeleton(root: ShadowRoot): void {
    const tempWrapper = document.createElement('div');

    tempWrapper.innerHTML = html`
        <div class="main-page container" id="main-page">
            <div class="sidebar">
                <section class="search-filters" aria-labelledby="search-filters-heading">
                    <h2 id="search-filters-heading">Search Filters</h2>
                    <div>
                        <label for="search_text" class="visually-hidden">Filter Search Results</label>
                        <div class="input-group">
                            <input type="text" class="form-control" name="search_text" id="search_text" placeholder="Filter Search Results"/>
                            <button class="btn-primary" type="button" data-action="submit_search">Search</button>                          
                        </div>
                    </div>
                    <div class="filters"></div>
                    <button type="button" class="btn-clear" data-action="clear_filters">Clear all filters</button>  
                </section>
            </div>
            <div class="main-content">
                <section id="main-container">
                    <h2 id="search-results-heading">Search Results</h2>
                    <div id="pagination-summary" role="status"></div>
                    <ul class="container_data facets-grid" tabindex="-1"></ul>
                    <div class="pagination-container"></div>
                </section>
            </div>
        </div>
    `;

    if (tempWrapper.firstElementChild) {
        root.appendChild(tempWrapper.firstElementChild);
    }
}