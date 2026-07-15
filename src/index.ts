import { applyFilters } from './filter-engine';
import { fetchMainData } from './api/fetch-main-data';
import { html } from './utils/html';
import { initializeConfig } from './config';
import { injectLayoutSkeleton } from './ui/skeleton';
import { renderAndOpenModal, hideModal } from './ui/modal';
import { renderCards } from './ui/cards';
import { renderFilters } from './ui/filters';
import { renderPagination } from './ui/pagination';
import { setupEventListeners } from './event-handlers';
import { updateSummary } from './ui/summary';

import styles from './styles/index.css?inline';
import type { AppState, ActiveFilters } from './types';

export class SheetsFacetsWidget extends HTMLElement {
    public state!: AppState;
    private root: HTMLElement | ShadowRoot;

    constructor() {
        super();
        if (this.hasAttribute('no-shadow')) {
            this.root = this;
        } else {
            this.root = this.attachShadow({ mode: 'open' });
        }
    }

    async connectedCallback() {
        try {
            const config = initializeConfig(this);

            const initialActiveFilters: ActiveFilters = {};
            Object.keys(config.availableFilters).forEach(label => {
                initialActiveFilters[label] = [];
            });

            this.state = {
                config,
                rawData: [],
                filteredData: [],
                availableFilters: config.availableFilters,
                activeFilters: initialActiveFilters,
                searchQuery: '',
                currentPage: 1,
                totalPages: 0,
                isLoading: true,
                error: null,
                lastFocusedElement: null
            };

            if (this.hasAttribute('no-shadow')) {
                Array.from(this.children).forEach(child => {
                    (child as HTMLElement).style.display = 'none';
                });
            }

            const styleTag = document.createElement('style');
            styleTag.textContent = styles;
            this.root.appendChild(styleTag);

            const hasFilters = Object.keys(this.state.availableFilters).length > 0;
            injectLayoutSkeleton(this.root as ShadowRoot, hasFilters);

            const mainData = await fetchMainData(this.state.config);

            this.state.rawData = mainData;
            this.state.filteredData = mainData;
            this.state.totalPages = Math.ceil(mainData.length / this.state.config.itemsPerPage);
            this.state.isLoading = false;

            renderFilters(this.state.availableFilters, this.state.activeFilters, this.root as ShadowRoot);
            this.updateView();
            setupEventListeners(this, this.root as ShadowRoot);

            if (this.hidden) this.hidden = false;

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
        const newFilteredData = applyFilters(
            this.state.rawData,
            this.state.activeFilters,
            this.state.availableFilters,
            this.state.searchQuery
        );

        this.state.filteredData = newFilteredData;
        this.state.totalPages = Math.ceil(newFilteredData.length / this.state.config.itemsPerPage) || 1;

        const startIndex = (this.state.currentPage - 1) * this.state.config.itemsPerPage;
        const endIndex = startIndex + this.state.config.itemsPerPage;
        const itemsToDisplay = this.state.filteredData.slice(startIndex, endIndex);

        renderCards(itemsToDisplay, this.root as ShadowRoot, this.state.config);
        renderPagination(this.state.currentPage, this.state.totalPages, this.root as ShadowRoot);
        updateSummary(this.state.filteredData.length, this.state.currentPage, this.state.config.itemsPerPage, this.root as ShadowRoot);
    }

    public toggleFilterInstance(category: keyof ActiveFilters, label: string, value: string) {
        const filterArray = this.state.activeFilters[category as string];
        const valueIndex = filterArray.findIndex(f => f.label === label);

        if (valueIndex === -1) {
            filterArray.push({ label, value });
        } else {
            filterArray.splice(valueIndex, 1);
        }
        this.state.currentPage = 1;
    }

    public scrollToResults() {
        const resultsHeading = this.root.querySelector('#search-results-heading');
        if (resultsHeading) {
            resultsHeading.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    public clearAllFilters() {
        Object.keys(this.state.activeFilters).forEach(category => {
            this.state.activeFilters[category] = [];
        });

        this.state.searchQuery = '';
        this.state.currentPage = 1;

        const checkboxes = this.root.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
        checkboxes.forEach(cb => {
            cb.checked = false;
        });

        const searchInput = this.root.querySelector<HTMLInputElement>('input[type="search"], input[type="text"]');
        if (searchInput) {
            searchInput.value = '';
        }

        this.updateView();
    }

    public openModal(itemId: string, triggerBtn: HTMLElement) {
        const item = this.state.filteredData.find(i => i.id === itemId);
        if (!item) return;
        this.state.lastFocusedElement = triggerBtn;
        renderAndOpenModal(item, this.root as ShadowRoot);
    }

    public closeModal() {
        hideModal(this.root as ShadowRoot);

        if (this.state.lastFocusedElement) {
            this.state.lastFocusedElement.focus();
            this.state.lastFocusedElement = null;
        }
    }
}

if (!customElements.get('sheets-facets')) {
    customElements.define('sheets-facets', SheetsFacetsWidget);
}