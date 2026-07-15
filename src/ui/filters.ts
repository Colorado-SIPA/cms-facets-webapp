import { html } from '../utils/html';
import { sanitizeHTML } from '../utils/sanitize-html';
import { getUniqueId } from '../utils/get-unique-id';
import type { FilterOptions, ActiveFilters, FilterItemDef } from '../types';

export function renderFilters(available: FilterOptions, active: ActiveFilters, root: ShadowRoot): void {
    const container = root.querySelector('.filters');
    if (!container) return;
    const uniqueInstanceId = getUniqueId();

    const htmlContent = Object.entries(available).map(([label, groupDef], index) => {
        return createFilterGroup(label, label, groupDef.items, active, uniqueInstanceId, index + 1);
    }).join('');

    container.innerHTML = htmlContent;
}

const createFilterGroup = (
    title: string,
    category: string,
    options: FilterItemDef[],
    active: ActiveFilters,
    instanceId: string,
    filterId: number
): string => {
    if (!options || options.length === 0) return '';

    const listItems = options.map((opt, index) => {
        const isChecked = active[category]?.some(f => f.label === opt.label) ? 'checked' : '';
        const inputId = `filter_${instanceId}_${filterId}_${index}`;

        return html`
            <li>
                <input 
                    type="checkbox" 
                    class="filter_items" 
                    value="${sanitizeHTML(opt.value)}" 
                    id="${inputId}" 
                    data-action="toggle_filter" 
                    data-category="${sanitizeHTML(category)}" 
                    data-label="${sanitizeHTML(opt.label)}"
                    ${isChecked}
                >
                <label for="${inputId}">${sanitizeHTML(opt.label)}</label>
            </li>
        `;
    }).join('');

    return html`
        <div class="filter-group-block">
            <h3 class="filter-group-title">${sanitizeHTML(title)}</h3>
            <ul aria-label="${sanitizeHTML(title)} checkbox filters. Selecting a filter updates the search results.">
                ${listItems}
            </ul>
        </div>
    `;
};