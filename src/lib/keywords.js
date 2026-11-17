// ===== Keyword Matching Engine =====
// Extracted from page.js for reuse across components and API routes

/**
 * Find all keyword matches in a text string.
 * Returns array of { keyword, index, length } objects.
 */
export function matchKeywords(text, keywords) {
    const matches = [];
    if (!text || !keywords || keywords.length === 0) return matches;
    for (const keyword of keywords) {
        if (!keyword) continue;
        // Escape regex metacharacters so a keyword like "c++" is matched literally.
        const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        // Whole-word match only: "ai" must not fire inside "said" or "again".
        // Lookarounds (not \b) so keywords ending in punctuation still match.
        const re = new RegExp(`(?<!\\w)${escaped}(?!\\w)`, 'gi');
        let m;
        while ((m = re.exec(text)) !== null) {
            matches.push({ keyword, index: m.index, length: m[0].length });
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
