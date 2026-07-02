import { applyFilters } from './filter-engine';
import { fetchMainData } from './api/fetch-main-data';
import { html } from './utils/html';
import { initializeConfig } from './config';
import { injectLayoutSkeleton } from './ui/skeleton';
import { renderCards } from './ui/cards';
import { renderFilters } from './ui/filters';
import { renderPagination } from './ui/pagination';
import { setupEventListeners } from './event-handlers';
import { updateSummary } from './ui/summary';

import styles from './styles/index.css?inline';
import type { AppState, ActiveFilters } from './types';

export class SheetsFacetsWidget extends HTMLElement {
    public state!: AppState;
    public root: ShadowRoot;

    constructor() {
        super();
        this.root = this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {
        try {
            const config = initializeConfig(this);

            // Dynamically set up active filters based on what we parsed from the HTML
            const initialActiveFilters: ActiveFilters = {};
            Object.keys(config.availableFilters).forEach(label => {
                initialActiveFilters[label] = [];
            });

            this.state = {
                config,
                rawData: [],
                filteredData: [],
                availableFilters: config.availableFilters, // Pass the parsed filters directly to state!
                activeFilters: initialActiveFilters,
                searchQuery: '',
                currentPage: 1,
                totalPages: 0,
                isLoading: true,
                error: null,
            };

            const styleTag = document.createElement('style');
            styleTag.textContent = styles;
            this.root.appendChild(styleTag);

            injectLayoutSkeleton(this.root);

            // We now only have ONE network request!
            const mainData = await fetchMainData(this.state.config);

            this.state.rawData = mainData;
            this.state.filteredData = mainData;
            this.state.totalPages = Math.ceil(mainData.length / this.state.config.itemsPerPage);
            this.state.isLoading = false;

            renderFilters(this.state.availableFilters, this.state.activeFilters, this.root);
            this.updateView();
            setupEventListeners(this, this.root);

        } catch (error) {
            console.error('[Climate Facets] Failed to initialize widget:', error);

            const errorWrapper = document.createElement('div');
            errorWrapper.innerHTML = html`
                <div class="alert-danger" role="alert">
                    <h4>Data Unavailable</h4>
                    <p>We are unable to load the data at this time. Please try refreshing the page later.</p>
                </div>
            `;

            if (errorWrapper.firstElementChild) {
                this.root.appendChild(errorWrapper.firstElementChild);
            }
        }
    }

    public updateView() {
        const newFilteredData = applyFilters(this.state.rawData, this.state.activeFilters, this.state.searchQuery);

        this.state.filteredData = newFilteredData;
        this.state.totalPages = Math.ceil(newFilteredData.length / this.state.config.itemsPerPage) || 1;

        const startIndex = (this.state.currentPage - 1) * this.state.config.itemsPerPage;
        const endIndex = startIndex + this.state.config.itemsPerPage;
        const itemsToDisplay = this.state.filteredData.slice(startIndex, endIndex);

        // Pass this.root to UI renderers
        renderCards(itemsToDisplay, this.root);
        renderPagination(this.state.currentPage, this.state.totalPages, this.root);
        updateSummary(this.state.filteredData.length, this.state.currentPage, this.state.config.itemsPerPage, this.root);
    }

    public toggleFilterInstance(category: keyof ActiveFilters, value: string) {
        const filterArray = this.state.activeFilters[category];
        const valueIndex = filterArray.indexOf(value);

        if (valueIndex === -1) {
            filterArray.push(value);
        } else {
            filterArray.splice(valueIndex, 1);
        }
        this.state.currentPage = 1;
    }

    public scrollToResults() {
        // Query inside the shadow root
        const resultsHeading = this.root.querySelector('#search-results-heading');
        if (resultsHeading) {
            resultsHeading.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}

if (!customElements.get('sheets-facets')) customElements.define('sheets-facets', SheetsFacetsWidget);