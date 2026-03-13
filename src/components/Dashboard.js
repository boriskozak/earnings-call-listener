'use client';

import { matchKeywords } from '@/lib/keywords';
import { fmtDateParts } from '@/lib/keywords';
import { IBM_TRANSCRIPT, COMPANIES } from '@/app/demoData';

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

export default function Dashboard({
    isStreaming,
    selectedCompany,
    watchlist,
    globalKeywords,
    alerts,
    transcriptLines,
    transcriptRef,
    calendarItems,
    getActiveKeywords,
    startStream,
    stopStream,
    addToWatchlist,
    setActiveNav,
}) {
    const activeKws = getActiveKeywords();

    return (
        <>
            <div className="page-header">
                <div className="page-header-top">
                    <h1 className="page-title">Dashboard</h1>
                    <div style={{ display: 'flex', gap: 8 }}>
                        {!isStreaming ? (
                            <button className="btn btn-primary" onClick={() => startStream(COMPANIES.find(c => c.ticker === 'IBM'))}>
                                ▶ Start Demo Stream
                            </button>
                        ) : (
                            <button className="btn btn-danger" onClick={stopStream}>■ Stop Stream</button>
                        )}
                    </div>
                </div>
                <p className="page-subtitle">
                    {isStreaming
                        ? `Monitoring ${selectedCompany?.name} (${selectedCompany?.ticker}) · Live transcript streaming`
                        : 'Set up your watchlist and keywords, then connect to a live earnings call.'}
                </p>
            </div>

            <div className="stats-row">
                <div className="stat-card blue">
                    <div className="stat-label">Watchlist</div>
                    <div className="stat-value blue">{watchlist.length}</div>
                    <div className="stat-detail">companies tracked</div>
                </div>
                <div className="stat-card green">
                    <div className="stat-label">Keywords</div>
                    <div className="stat-value green">{globalKeywords.length}</div>
                    <div className="stat-detail">active triggers</div>
                </div>
                <div className="stat-card amber">
                    <div className="stat-label">Matches</div>
                    <div className="stat-value amber">{alerts.length}</div>
                    <div className="stat-detail">this session</div>
                </div>
                <div className="stat-card red">
                    <div className="stat-label">Upcoming</div>
                    <div className="stat-value red">{calendarItems.length}</div>
                    <div className="stat-detail">earnings events</div>
                </div>
            </div>

            <div className="content-grid wide-left">
                {/* Transcript */}
                <div className="card">
                    <div className="card-header">
                        <div className="card-title">
                            {isStreaming && <span className="status-dot live"></span>}
                            Transcript
                            {isStreaming && <span className="badge badge-green" style={{ marginLeft: 4 }}>LIVE</span>}
                        </div>
                        {isStreaming && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ fontSize: 11, color: 'var(--text-2)', fontFamily: 'var(--font-mono)' }}>
                                    {transcriptLines.length}/{IBM_TRANSCRIPT.length}
                                </span>
                                <button className="btn btn-sm btn-danger" onClick={stopStream}>■ Stop</button>
                            </div>
                        )}
                    </div>
                    <div className="transcript-viewer" ref={transcriptRef}>
                        {transcriptLines.length === 0 && !isStreaming && (
                            <div className="empty-state">
                                <div className="empty-state-icon">◈</div>
                                <div className="empty-state-text">
                                    No active stream. Click &quot;Start Demo Stream&quot; to simulate an IBM earnings call with live keyword detection.
                                </div>
                            </div>
                        )}
                        {transcriptLines.map((line, i) => (
                            <div key={i} className="transcript-line" style={{
                                borderLeftColor: matchKeywords(line.text, activeKws).length > 0 ? 'var(--amber)' : 'transparent'
                            }}>
                                <span className="timestamp">{line.time}</span>
                                <span className="speaker">{line.speaker}{line.role ? ` (${line.role})` : ''}</span>{' '}
                                {highlightText(line.text, activeKws)}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Alert Feed */}
                <div className="card">
                    <div className="card-header">
                        <div className="card-title">⚡ Signal Feed</div>
                        <span className="card-subtitle">{alerts.length} matches</span>
                    </div>
                    <div className="alert-list">
                        {alerts.length === 0 && (
                            <div className="empty-state">
                                <div className="empty-state-icon">⚡</div>
                                <div className="empty-state-text">
                                    {isStreaming ? 'Scanning for keyword matches...' : 'Start a stream to begin monitoring.'}
                                </div>
                            </div>
                        )}
                        {alerts.map(alert => (
                            <div key={alert.id} className="alert-item new">
                                <div className="alert-body">
                                    <div className="alert-title">
                                        {alert.keywords.map(k => (
                                            <span key={k} className="badge badge-amber">{k}</span>
                                        ))}
                                    </div>
                                    <div className="alert-context">
                                        <strong>{alert.speaker}:</strong>{' '}
                                        {highlightText(alert.text, alert.keywords)}
                                    </div>
                                    <div className="alert-meta">
                                        <span>{alert.ticker}</span>
                                        <span>{alert.time}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Upcoming preview */}
            <div className="card" style={{ marginTop: 4 }}>
                <div className="card-header">
                    <div className="card-title">▦ Upcoming Calls</div>
                    <button className="btn btn-sm btn-ghost" onClick={() => setActiveNav('calendar')}>View All →</button>
                </div>
                {calendarItems.slice(0, 5).map((cal, i) => {
                    const dp = fmtDateParts(cal.date);
                    const isWatched = watchlist.some(w => w.ticker === cal.ticker);
                    return (
                        <div key={cal.ticker + cal.date + i} className="calendar-item">
                            <div className="calendar-date">
                                <span className="calendar-date-month">{dp.month}</span>
                                <span className="calendar-date-day">{dp.day}</span>
                            </div>
                            <div className="calendar-info">
                                <div className="calendar-company">{cal.company?.name || cal.ticker} ({cal.ticker})</div>
                                <div className="calendar-details">
                                    {cal.quarter} · {cal.time} ET
                                    {cal.estimate_eps !== undefined && cal.estimate_eps !== null && ` · EPS $${cal.estimate_eps}`}
                                </div>
                            </div>
                            <div className="calendar-actions">
                                {isWatched
                                    ? <span className="badge badge-green">Watching</span>
                                    : <button className="btn btn-sm btn-ghost" onClick={() => addToWatchlist(cal.company || { ticker: cal.ticker, name: cal.ticker })}>+ Watch</button>
                                }
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}
