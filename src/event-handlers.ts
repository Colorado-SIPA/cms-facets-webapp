// src/event-handlers.ts
import type { ActiveFilters } from './types';
import type { SheetsFacetsWidget } from './index';

export function setupEventListeners(widget: SheetsFacetsWidget, root: ShadowRoot): void {
    // 1. Global Click Delegation (Attached to root)
    root.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const actionElement = target.closest('[data-action]');

        if (!actionElement) return;

        const action = actionElement.getAttribute('data-action');
        switch (action) {
            case 'toggle_filter':
                const checkbox = target as HTMLInputElement;
                const category = checkbox.getAttribute('data-category') as keyof ActiveFilters;
                widget.toggleFilterInstance(category, checkbox.value);
                widget.updateView();
                break;

            case 'submit_search':
                const searchInputClick = root.querySelector('#search_text') as HTMLInputElement;
                if (searchInputClick) {
                    widget.state.searchQuery = searchInputClick.value;
                    widget.state.currentPage = 1;
                    widget.updateView();
                }
                break;

            case 'prev_page':
                if (widget.state.currentPage > 1) {
                    widget.state.currentPage--;
                    widget.updateView();
                    widget.scrollToResults();
                }
                break;

            case 'next_page':
                if (widget.state.currentPage < widget.state.totalPages) {
                    widget.state.currentPage++;
                    widget.updateView();
                    widget.scrollToResults();
                }
                break;

            case 'go_to_page':
                const pageNum = Number(target.getAttribute('data-page'));
                if (pageNum >= 1 && pageNum <= widget.state.totalPages) {
                    widget.state.currentPage = pageNum;
                    widget.updateView();
                    widget.scrollToResults();
                }
                break;

            case 'toggle_accordion':
                const btn = target as HTMLButtonElement;
                const isExpanded = btn.getAttribute('aria-expanded') === 'true';
                btn.setAttribute('aria-expanded', (!isExpanded).toString());

                const controlsId = btn.getAttribute('aria-controls');
                if (controlsId) {
                    const panel = root.querySelector(`#${controlsId}`) as HTMLElement;
                    if (panel) {
                        panel.hidden = isExpanded;
                    }
                }
                break;

            case 'clear_filters':
                e.preventDefault();
                widget.clearAllFilters();
        }
    });

    // 2. Localized Keyboard Events (Querying inside root)
    const searchInput = root.querySelector('#search_text') as HTMLInputElement;
    if (searchInput) {
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                widget.state.searchQuery = searchInput.value;
                widget.state.currentPage = 1;
                widget.updateView();

                const resultsGrid = root.querySelector('.container_data') as HTMLElement;
                if (resultsGrid) {
                    resultsGrid.focus({ preventScroll: true });
                }
            }
        });
    }
}