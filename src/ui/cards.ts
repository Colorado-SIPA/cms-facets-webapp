import { html } from '../utils/html'; 
import { sanitizeHTML } from '../utils/sanitize-html';
import { sanitizeUrl } from '../utils/sanitize-url';
import type { ParsedItem, MetaDataValue } from '../types';

export function renderCards(items: ParsedItem[], root: ShadowRoot): void {
    const container = root.querySelector('.container_data');
    if (!container) return;

    if (items.length === 0) {
        container.innerHTML = html`<li class="text-center w-100 card"><h3>Nothing Found</h3></li>`;
        return;
    }

    container.innerHTML = items.map(item => html`
        <li class="card">
            <div class="card-body">
                <a href="${sanitizeUrl(item.link)}" target="_blank" class="links">
                    <h3 class="card-title">${sanitizeHTML(item.title)}</h3>
                </a>
                <div class="p_items">
                    ${renderMetaData(item.metaData)}
                </div>
            </div>
        </li>
    `).join('');
}

const renderMetaData = (metaData: MetaDataValue[]): string => {
    return metaData.map(meta => {
        if (meta.label) {
            return html`<p><span>${meta.label}</span>: ${sanitizeHTML(meta.value)}</p>`;
        }
        return html`<p>${sanitizeHTML(meta.value)}</p>`;
    }).join('');
};