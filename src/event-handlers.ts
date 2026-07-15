import type { SheetsFacetsWidget } from './index';

export function setupEventListeners(widget: SheetsFacetsWidget, root: ShadowRoot): void {
    // 1. Global Click Delegation (Attached to root)
    root.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (target.tagName === 'DIALOG') {
            widget.closeModal();
            return;
        }

        const actionElement = target.closest('[data-action]') as HTMLElement;
        if (!actionElement) return;

        const action = actionElement.getAttribute('data-action');

        switch (action) {
            case 'toggle_filter':
                const checkbox = target as HTMLInputElement;
                const category = checkbox.getAttribute('data-category') as string;
                const itemLabel = checkbox.getAttribute('data-label') || '';
                widget.toggleFilterInstance(category, itemLabel, checkbox.value);
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
                const btn = actionElement as HTMLButtonElement;
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
                break;

            case 'open_modal':
                const itemId = actionElement.getAttribute('data-id');
                if (itemId) widget.openModal(itemId, actionElement as HTMLElement);
                break;

            case 'close_modal':
                widget.closeModal();
                break;
        }

        // Close modal if user clicks on the backdrop (outside the inner wrapper)
        const dialog = target.closest('dialog');
        if (dialog && e.target === dialog) {
            widget.closeModal();
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
            }
        });
    }
}