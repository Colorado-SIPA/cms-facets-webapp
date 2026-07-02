import { html } from '../utils/html';
import { sanitizeHTML } from '../utils/sanitize-html';
import type { FilterOptions, ActiveFilters } from '../types';

export function renderFilters(available: FilterOptions, active: ActiveFilters, root: ShadowRoot): void {
    const container = root.querySelector('.filters');
    if (!container) return;
    const uniqueInstanceId = generateInstanceId();

    const html = Object.entries(available).map(([label, options], index) => {
        return createFilterGroup(label, label, options, active, uniqueInstanceId, index + 1);
    }).join('');

    container.innerHTML = html;
}

const createFilterGroup = (
    title: string,
    category: string,
    options: string[],
    active: ActiveFilters,
    instanceId: string,
    filterId: number
): string => {
    if (!options || options.length === 0) return '';

    const listItems = options.map((opt, index) => {
        const isChecked = active[category]?.includes(opt) ? 'checked' : '';
        const inputId = `filter_${instanceId}_${filterId}_${index}`;

        return html`
            <li>
                <input type="checkbox" class="filter_items" value="${sanitizeHTML(opt)}" id="${inputId}"
                       data-action="toggle_filter" data-category="${category}" ${isChecked}>
                <label for="${inputId}">${sanitizeHTML(opt)}</label>
            </li>
        `;
    }).join('');

    const buttonId = `accordion_btn_${instanceId}_${filterId}`;
    const panelId = `accordion_panel_${instanceId}_${filterId}`;

    return html`
        <div>
            <div class="card accordion-item">
                <h3 class="card-header p-0 mb-0">
                    <button type="button" id="${buttonId}" class="accordion-trigger" 
                            aria-expanded="false" aria-controls="${panelId}" 
                            data-action="toggle_accordion">
                        <span class="accordion-title">${title}</span>
                        <span class="accordion-icon" aria-hidden="true">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                            </svg>
                        </span>
                    </button>
                </h3>
                <div id="${panelId}" aria-labelledby="${buttonId}" class="filter-collapse" hidden>
                    <div class="card-body">
                        <ul>${listItems}</ul>
                    </div>
                </div>
            </div>
        </div>
    `;
};

// Generate a unique ID for the component instance.
const generateInstanceId = (): string => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }
    return Math.random().toString(36).substring(2, 9);
};