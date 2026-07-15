import { html } from '../utils/html';
import { sanitizeHTML } from '../utils/sanitize-html';
import { sanitizeUrl } from '../utils/sanitize-url';
import type { ParsedItem, MetaDataValue, AppConfig } from '../types';

export function renderCards(items: ParsedItem[], root: ShadowRoot, config: AppConfig): void {
    const container = root.querySelector('.container_data');
    if (!container) return;

    if (items.length === 0) {
        container.innerHTML = html`
            <li class="text-center w-100 card"><h3>Nothing Found</h3></li>
        `;
        return;
    }

    container.innerHTML = items.map(item => {

        // 1. Conditionally render the title as plain text or a link
        const titleHtml = (() => {
            if (item.link && item.link !== 'Not available') {

                // verify URL is fully formed
                const https = /^https:\/\//i;
                if (https.test(item.link) === false) {
                    item.link = 'https://' + item.link;
                }

                return html`
                    <a href="${sanitizeUrl(item.link)}" target="_blank" class="links">${sanitizeHTML(item.title)}</a>
                `;
            }
            else return `${sanitizeHTML(item.title)}`;
        })();

        // 2. Generate the Action Button with hidden A11y text
        const actionHtml = (() => {
            if (config.schema.cardActionText) {
                return html`
                    <button type="button" class="modal-button" data-action="open_modal" data-id="${item.id}">
                        ${sanitizeHTML(config.schema.cardActionText)} <span class="visually-hidden">about ${sanitizeHTML(item.title)}</span>
                   </button>`;
            }
            else return '';
        })();

        return html`
            <li class="card">
                <div class="card-body">
                    <h3 class="card-title">${titleHtml}</h3>
                    <div class="card-properties">
                        <ul class="properties-list">
                            ${renderMetaData(item.metaData, item.title)}
                        </ul>
                    </div>
                    ${actionHtml}
                </div>
            </li>
        `}).join('');
}

const renderMetaData = (metaData: MetaDataValue[], _title: string): string => {
    return metaData.map(meta => {
        let displayValue = sanitizeHTML(meta.value);

        // Format Pills
        if (meta.format === 'pills' && meta.value !== 'Not available') {
            const rawItems = meta.value.split(',');
            const uniqueItems: string[] = [];
            const seen = new Set<string>();

            rawItems.forEach(item => {
                // 1. Trim whitespace and remove a leading "and "
                let cleanItem = item.trim().replace(/^and\s+/i, '').trim();

                if (cleanItem.length > 0) {
                    // 2. Track the lowercase version to prevent duplicates
                    const lowerItem = cleanItem.toLowerCase();

                    if (!seen.has(lowerItem)) {
                        seen.add(lowerItem);

                        // Capitalize the first letter of the string for the UI
                        const displayItem = cleanItem.charAt(0).toUpperCase() + cleanItem.slice(1);

                        uniqueItems.push(displayItem);
                    }
                }
            });

            const pills = uniqueItems
                .map(item => html`<span class="pill">${sanitizeHTML(item)}</span>`)
                .join('');

            displayValue = html`<div class="pill-container">${pills}</div>`;
        }
        // Handle Links
        if (meta.linkType && meta.value !== 'Not available') {
            if (meta.linkType === 'mailto') {
                displayValue = html`
                    <a href="mailto:${sanitizeHTML(meta.value)}"  target="_blank" class="links">
                        Send a Message
                        <span class="visually-hidden"> to ${_title}</span>
                    </a>
                `;
            } else if (meta.linkType === 'tel') {
                displayValue = html`
                    <a href="tel:${sanitizeHTML(meta.value)}" target="_blank" class="links">
                        ${sanitizeHTML(meta.value)}
                    </a>
                `;
            } else if (meta.linkType === 'web') {
                displayValue = html`
                    <a href="${sanitizeUrl(meta.value)}" target="_blank" target="_blank" class="links">${sanitizeHTML(meta.value)}</a>
                `;
            }
        }

        // Add a specific class to the list item if it contains pills for styling flexibility
        const liClass = meta.format === 'pills' ? 'class="has-pills"' : '';

        if (meta.label) {
            return html`
                <li ${liClass}><span class="label">${sanitizeHTML(meta.label)}:</span> ${displayValue}</li>
            `;
        }
        return html`<li ${liClass}>${displayValue}</li>`;
    }).join('');
};