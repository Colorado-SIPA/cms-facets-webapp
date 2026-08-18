import { t, type Language } from '../i18n';

export function updateSummary(totalItems: number, currentPage: number, itemsPerPage: number, root: ShadowRoot, lang: Language): void {
    let summaryText = '';

    // 1. Determine the correct translation string
    if (totalItems === 0) {
        summaryText = t(lang, 'displayingZero');
    } else {
        const start = ((currentPage - 1) * itemsPerPage) + 1;
        const end = Math.min(currentPage * itemsPerPage, totalItems);
        summaryText = t(lang, 'displayingSummary', { start, end, total: totalItems });
    }

    // 2. Apply it to the main desktop live region
    const mainSummary = root.querySelector('#pagination-summary');
    if (mainSummary) {
        mainSummary.innerHTML = summaryText;
    }

    // 3. Apply it to the silent mobile container
    const mobileSummary = root.querySelector('#mobile-pagination-summary');
    if (mobileSummary) {
        mobileSummary.innerHTML = summaryText;
    }
}