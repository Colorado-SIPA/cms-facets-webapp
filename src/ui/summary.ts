export function updateSummary(totalItems: number, currentPage: number, itemsPerPage: number, root: ShadowRoot): void {
    const container = root.querySelector('#pagination-summary');
    if (!container) return;

    if (totalItems === 0) {
        container.innerHTML = "Displaying 0 results";
        return;
    }

    const start = ((currentPage - 1) * itemsPerPage) + 1;
    const end = Math.min(currentPage * itemsPerPage, totalItems);

    container.innerHTML = `Displaying <strong>${start}</strong> through <strong>${end}</strong> of <strong>${totalItems}</strong> total results`;
}