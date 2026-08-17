import { t, type Language } from '../i18n';

export function updateSummary(totalItems: number, currentPage: number, itemsPerPage: number, root: ShadowRoot, lang: Language): void {
    const container = root.querySelector('#pagination-summary');
    if (!container) return;

    if (totalItems === 0) {
        container.innerHTML = t(lang, 'displayingZero');
        return;
    }

    const start = ((currentPage - 1) * itemsPerPage) + 1;
    const end = Math.min(currentPage * itemsPerPage, totalItems);

    const summaryText = t(lang, 'displayingSummary', { start, end, total: totalItems });

    const mainSummary = root.querySelector('#pagination-summary');

    if (mainSummary) {
        mainSummary.innerHTML = summaryText;
    }
    const mobileSummary = root.querySelector('#mobile-pagination-summary');
    if (mobileSummary) {
        mobileSummary.innerHTML = summaryText;
    }
}