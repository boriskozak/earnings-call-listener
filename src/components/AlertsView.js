'use client';

import { matchKeywords } from '@/lib/keywords';
import { COMPANIES } from '@/app/demoData';

function highlightText(text, keywords) {
    if (!keywords || keywords.length === 0) return text;
    const matches = matchKeywords(text, keywords);
    if (matches.length === 0) return text;
    matches.sort((a, b) => a.index - b.index);

    const parts = [];
    let lastIdx = 0;
    for (const m of matches) {
        if (m.index < lastIdx) continue;
        if (m.index > lastIdx) {
            parts.push(<span key={`t-${lastIdx}`}>{text.slice(lastIdx, m.index)}</span>);
        }
        parts.push(
            <span key={`h-${m.index}`} className="keyword-highlight">
                {text.slice(m.index, m.index + m.length)}
            </span>
        );
        lastIdx = m.index + m.length;
    }
    if (lastIdx < text.length) {
        parts.push(<span key={`t-${lastIdx}`}>{text.slice(lastIdx)}</span>);
    }
    return parts;
}

export default function AlertsView({ alerts, clearAlerts, startStream, isStreaming }) {
    return (
        <>
            <div className="page-header">
                <div className="page-header-top">
                    <h1 className="page-title">Alert History</h1>
                    {alerts.length > 0 && (
                        <button className="btn btn-sm btn-secondary" onClick={clearAlerts}>Clear All</button>
                    )}
                </div>
                <p className="page-subtitle">All keyword matches detected during monitoring sessions.</p>
            </div>

            <div className="card">
                <div className="alert-list" style={{ maxHeight: 'none' }}>
                    {alerts.length === 0 && (
                        <div className="empty-state">
                            <div className="empty-state-icon">⚡</div>
                            <div className="empty-state-text">No alerts yet. Run a stream to see keyword matching in action.</div>
                            <button className="btn btn-primary" onClick={() => startStream(COMPANIES.find(c => c.ticker === 'IBM'))}>
                                ▶ Start Demo Stream
                            </button>
                        </div>
                    )}
                    {alerts.map(alert => (
                        <div key={alert.id} className="alert-item">
                            <div className="alert-body">
                                <div className="alert-title">
                                    {alert.keywords.map(k => (
                                        <span key={k} className="badge badge-amber">{k}</span>
                                    ))}
                                </div>
                                <div className="alert-context">
                                    <strong>{alert.speaker}{alert.role ? ` (${alert.role})` : ''}:</strong>{' '}
                                    {highlightText(alert.text, alert.keywords)}
                                </div>
                                <div className="alert-meta">
                                    <span>{alert.ticker}</span>
                                    <span>{alert.time}</span>
                                    <span>{alert.company}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
