// ===== Keyword Matching Engine =====
// Extracted from page.js for reuse across components and API routes

/**
 * Find all keyword matches in a text string.
 * Returns array of { keyword, index, length } objects.
 */
export function matchKeywords(text, keywords) {
    const matches = [];
    if (!text || !keywords || keywords.length === 0) return matches;
    const lowerText = text.toLowerCase();
    for (const keyword of keywords) {
        const lowerKeyword = keyword.toLowerCase();
        let idx = lowerText.indexOf(lowerKeyword);
        while (idx !== -1) {
            matches.push({ keyword, index: idx, length: keyword.length });
            idx = lowerText.indexOf(lowerKeyword, idx + 1);
        }
    }
    return matches;
}

/**
 * Format a date string (YYYY-MM-DD) to readable form.
 */
export function fmtDate(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' });
}

/**
 * Get month/day parts from a date string.
 */
export function fmtDateParts(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    return {
        month: d.toLocaleDateString('en', { month: 'short' }),
        day: d.getDate(),
    };
}
