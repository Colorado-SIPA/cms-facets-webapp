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
            <div class="card-body" role="group">
                <h3 class="card-title">
                    <a href="${sanitizeUrl(item.link)}" target="_blank" rel="noopener noreferrer" class="links">
                        ${sanitizeHTML(item.title)}
                    </a>
                </h3>
                <div class="card-properties">
                    <ul class="properties-list">
                        ${renderMetaData(item.metaData)}
                    </ul
                </div>
            </div>
        </li>
    `).join('');
}

const renderMetaData = (metaData: MetaDataValue[]): string => {
    return metaData.map(meta => {
        if (meta.label) {
            return html`<li><span>${sanitizeHTML(meta.label)}</span>: ${sanitizeHTML(meta.value)}</li>`;
        }
        return html`<li>${sanitizeHTML(meta.value)}</li>`;
    }).join('');
};