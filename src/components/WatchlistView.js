'use client';

import { useState } from 'react';
import { COMPANIES } from '@/app/demoData';

export default function WatchlistView({
    watchlist,
    globalKeywords,
    addToWatchlist,
    removeFromWatchlist,
    toggleWatchlistKeyword,
}) {
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchTicker, setSearchTicker] = useState('');

    const filteredCompanies = COMPANIES.filter(c =>
        (c.ticker.toLowerCase().includes(searchTicker.toLowerCase()) ||
            c.name.toLowerCase().includes(searchTicker.toLowerCase())) &&
        !watchlist.find(w => w.ticker === c.ticker)
    );

    return (
        <>
            <div className="page-header">
                <div className="page-header-top">
                    <h1 className="page-title">Watchlist</h1>
                    <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>+ Add Company</button>
                </div>
                <p className="page-subtitle">Companies you&apos;re monitoring. Assign specific keywords per company for targeted alerts.</p>
            </div>

            <div className="card">
                {watchlist.length === 0 && (
                    <div className="empty-state">
                        <div className="empty-state-icon">◉</div>
                        <div className="empty-state-text">Your watchlist is empty.</div>
                        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>+ Add Company</button>
                    </div>
                )}
                {watchlist.map(w => {
                    const company = COMPANIES.find(c => c.ticker === w.ticker);
                    return (
                        <div key={w.ticker} className="watchlist-item">
                            <div className="watchlist-left">
                                <div className="company-logo">{w.ticker.substring(0, 3)}</div>
                                <div>
                                    <div className="company-info">
                                        <span className="company-name">{w.name}</span>
                                        <span className="company-ticker">{w.ticker}{company ? ` · ${company.exchange}` : ''}</span>
                                    </div>
                                    <div className="watchlist-keywords">
                                        {w.keywords.map(k => (
                                            <span key={k} className="keyword-tag">
                                                {k}
                                                <span className="remove-keyword" onClick={() => toggleWatchlistKeyword(w.ticker, k)}>×</span>
                                            </span>
                                        ))}
                                        {globalKeywords.filter(gk => !w.keywords.includes(gk)).length > 0 && (
                                            <select
                                                className="input"
                                                style={{ padding: '2px 8px', fontSize: 10, width: 'auto', minWidth: 90 }}
                                                value=""
                                                onChange={(e) => {
                                                    if (e.target.value) toggleWatchlistKeyword(w.ticker, e.target.value);
                                                }}
                                            >
                                                <option value="">+ keyword</option>
                                                {globalKeywords.filter(gk => !w.keywords.includes(gk)).map(gk => (
                                                    <option key={gk} value={gk}>{gk}</option>
                                                ))}
                                            </select>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="watchlist-actions">
                                <button className="btn btn-sm btn-danger" onClick={() => removeFromWatchlist(w.ticker)}>Remove</button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Add Watchlist Modal */}
            {showAddModal && (
                <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">Add to Watchlist</h3>
                            <button className="modal-close" onClick={() => setShowAddModal(false)}>✕</button>
                        </div>
                        <div className="modal-body">
                            <input
                                className="input"
                                placeholder="Search ticker or company name..."
                                value={searchTicker}
                                onChange={(e) => setSearchTicker(e.target.value)}
                                autoFocus
                            />
                            <div style={{ maxHeight: 280, overflowY: 'auto' }}>
                                {filteredCompanies.map(c => (
                                    <div key={c.ticker} className="calendar-item" onClick={() => { addToWatchlist(c); setShowAddModal(false); setSearchTicker(''); }}>
                                        <div className="company-logo">{c.ticker.substring(0, 3)}</div>
                                        <div className="calendar-info">
                                            <div className="calendar-company">{c.name}</div>
                                            <div className="calendar-details">{c.ticker} · {c.exchange} · {c.sector}</div>
                                        </div>
                                        <button className="btn btn-sm btn-primary">+ Add</button>
                                    </div>
                                ))}
                                {filteredCompanies.length === 0 && (
                                    <div className="empty-state" style={{ padding: 16 }}>
                                        <div className="empty-state-text">No companies found.</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
