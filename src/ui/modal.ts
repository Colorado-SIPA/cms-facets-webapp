// src/ui/modal.ts
import { html } from '../utils/html';
import { sanitizeHTML } from '../utils/sanitize-html';
import { sanitizeUrl } from '../utils/sanitize-url';
import type { ParsedItem } from '../types';

export function renderAndOpenModal(item: ParsedItem, root: ShadowRoot): void {
    const dialog = root.querySelector<HTMLDialogElement>('#details-modal');
    if (!dialog) return;

    const titleEl = dialog.querySelector('.modal-title');
    const bodyEl = dialog.querySelector('.modal-body');

    // 1. Set the Title
    if (titleEl) {
        titleEl.textContent = item.modalTitle;
    }

    // 2. Render the Data
    if (bodyEl) {
        bodyEl.innerHTML = html`
            <ul class="properties-list">
                ${item.modalMetaData.map(meta => {
            let displayValue = sanitizeHTML(meta.value);

            if (meta.format === 'pills' && meta.value !== 'Not available') {
                const rawItems = meta.value.split(',');
                const uniqueItems: string[] = [];
                const seen = new Set<string>();

                rawItems.forEach(item => {
                    let cleanItem = item.trim().replace(/^and\s+/i, '').trim();

                    if (cleanItem.length > 0) {
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

            // Handle formatting links for the modal
            if (meta.linkType && meta.value !== 'Not available') {
                if (meta.linkType === 'mailto') {
                    displayValue = html`
                                <a href="mailto:${sanitizeHTML(meta.value)}"  target="_blank" class="links">
                                    Send a Message to ${item.modalTitle}
                                </a>
                            `;
                } else if (meta.linkType === 'tel') {
                    displayValue = html`
                                <a href="tel:${sanitizeHTML(meta.value)}" class="links">
                                    ${sanitizeHTML(meta.value)}
                                </a>
                            `;
                } else if (meta.linkType === 'web') {
                    displayValue = html`
                                <a href="${sanitizeUrl(meta.value)}" target="_blank" class="links">
                                    ${item.modalTitle} Website
                                </a>
                            `;
                }
            }

            const liClass = meta.format === 'pills' ? 'class="has-pills"' : '';

            if (meta.label) {
                return html`<li ${liClass}><span class="label">${sanitizeHTML(meta.label)}:</span> ${displayValue}</li>`;
            }
            return html`<li ${liClass}>${displayValue}</li>`;
        }).join('')}
            </ul>
        `;
    }

    // 3. Open the Modal and Shift Focus
    dialog.showModal();
    if (titleEl) {
        (titleEl as HTMLElement).focus();
    }
}

export function hideModal(root: ShadowRoot): void {
    const dialog = root.querySelector<HTMLDialogElement>('#details-modal');
    if (dialog) dialog.close();
}