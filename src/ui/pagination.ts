import { html } from '../utils/html';

export function renderPagination(currentPage: number, totalPages: number, root: ShadowRoot): void {
    const container = root.querySelector('.pagination-container');
    if (!container) return;

    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }

    const MAX_VISIBLE_BUTTONS = 10;
    let startPage = 1;
    let endPage = totalPages;

    if (totalPages > MAX_VISIBLE_BUTTONS) {
        const halfWindow = Math.floor(MAX_VISIBLE_BUTTONS / 2);
        startPage = currentPage - halfWindow;
        endPage = currentPage + (MAX_VISIBLE_BUTTONS - halfWindow - 1);

        if (startPage < 1) {
            startPage = 1;
            endPage = MAX_VISIBLE_BUTTONS;
        }

        if (endPage > totalPages) {
            endPage = totalPages;
            startPage = totalPages - MAX_VISIBLE_BUTTONS + 1;
        }
    }

    const buttonsHtml: string[] = [];

    buttonsHtml.push(html`
        <button type="button" class="page-link prev-btn" data-action="prev_page" aria-label="Go to previous page" ${currentPage === 1 ? 'disabled' : ''}>
            <span aria-hidden="true">&laquo;</span> Prev
        </button>
    `);

    for (let i = startPage; i <= endPage; i++) {
        const isActive = i === currentPage ? 'active' : '';
        const ariaCurrent = i === currentPage ? 'aria-current="page"' : '';

        buttonsHtml.push(html`
            <button type="button" class="page-link ${isActive}" data-action="go_to_page" data-page="${i}" aria-label="Go to page ${i}" ${ariaCurrent}>
                ${i}
            </button>
        `);
    }

    buttonsHtml.push(html`
        <button type="button" class="page-link next-btn" data-action="next_page" aria-label="Go to next page" ${currentPage === totalPages ? 'disabled' : ''}>
            Next <span aria-hidden="true">&raquo;</span>
        </button>
    `);

    container.innerHTML = html`
        <div class="facets-pagination pagination-flex">
            ${buttonsHtml.join('')}
        </div>
    `;
}