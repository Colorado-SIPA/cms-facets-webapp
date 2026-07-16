import { html } from '../utils/html';
import { renderMetaData } from './cards';
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
                ${renderMetaData(item.modalMetaData, item.modalTitle)} 
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