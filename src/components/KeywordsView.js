'use client';

import { useState } from 'react';

const SUGGESTED_KEYWORDS = [
    'revenue guidance', 'share buyback', 'operating margin', 'restructuring', 'headcount reduction',
    'pricing pressure', 'competitive landscape', 'inventory build', 'order backlog', 'organic growth',
    'regulatory risk', 'dividend increase', 'debt reduction', 'market share', 'product launch',
    'gross margin', 'capex', 'cost cutting', 'cash flow', 'acquisition'
];

export default function KeywordsView({ globalKeywords, addKeyword, removeKeyword }) {
    const [newKeyword, setNewKeyword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        addKeyword(newKeyword);
        setNewKeyword('');
    };

    return (
        <>
            <div className="page-header">
                <h1 className="page-title">Keywords</h1>
                <p className="page-subtitle">Global keywords monitored across all earnings calls. Add company-specific keywords from the Watchlist.</p>
            </div>

            <div className="card">
                <div className="card-header">
                    <div className="card-title">⌘ Active Keywords</div>
                    <span className="card-subtitle">{globalKeywords.length} triggers</span>
                </div>
                <form onSubmit={handleSubmit} className="input-with-btn" style={{ marginBottom: 16 }}>
                    <input
                        className="input"
                        placeholder="Type a keyword or phrase to track..."
                        value={newKeyword}
                        onChange={(e) => setNewKeyword(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary">+ Add</button>
                </form>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {globalKeywords.map(kw => (
                        <span key={kw} className="keyword-tag">
                            {kw}
                            <span className="remove-keyword" onClick={() => removeKeyword(kw)}>×</span>
                        </span>
                    ))}
                </div>
            </div>

            <div className="card" style={{ marginTop: 16 }}>
                <div className="card-header">
                    <div className="card-title">Suggested Keywords</div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {SUGGESTED_KEYWORDS.filter(s => !globalKeywords.includes(s)).map(s => (
                        <button key={s} className="btn btn-sm btn-ghost" onClick={() => addKeyword(s)}>+ {s}</button>
                    ))}
                </div>
            </div>
        </>
    );
}
