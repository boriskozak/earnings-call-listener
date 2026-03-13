'use client';

import { useState } from 'react';
import { fmtDate, fmtDateParts } from '@/lib/keywords';
import { COMPANIES, EARNINGS_CALENDAR } from '@/app/demoData';

export default function CalendarView({
    watchlist,
    liveCalendar,
    addToWatchlist,
}) {
    const [calendarFilter, setCalendarFilter] = useState('all');

    // Build calendar data — use live if available, else demo
    const calendarData = liveCalendar
        ? liveCalendar.map(item => ({
            ticker: item.symbol,
            date: item.date,
            time: item.time || 'TBD',
            quarter: `${item.fiscalDateEnding ? 'FY' : 'Q?'}`,
            status: 'upcoming',
            estimate_eps: item.eps !== null ? item.eps : item.epsEstimated,
            estimate_revenue: item.revenue !== null
                ? `$${(item.revenue / 1e9).toFixed(1)}B`
                : item.revenueEstimated !== null
                    ? `$${(item.revenueEstimated / 1e9).toFixed(1)}B`
                    : 'N/A',
            company: { name: item.symbol, ticker: item.symbol, exchange: '' },
        }))
        : EARNINGS_CALENDAR.map(cal => ({
            ...cal,
            company: COMPANIES.find(c => c.ticker === cal.ticker),
        }));

    const calendarItems = calendarData.filter(cal => {
        if (calendarFilter === 'all') return true;
        if (calendarFilter === 'watchlist') return watchlist.some(w => w.ticker === cal.ticker);
        return true;
    });

    return (
        <>
            <div className="page-header">
                <div className="page-header-top">
                    <h1 className="page-title">Earnings Calendar</h1>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        {liveCalendar && <span className="badge badge-green">LIVE DATA</span>}
                        {!liveCalendar && <span className="badge badge-amber">DEMO DATA</span>}
                        <div className="tab-bar">
                            <button className={`tab ${calendarFilter === 'all' ? 'active' : ''}`} onClick={() => setCalendarFilter('all')}>All</button>
                            <button className={`tab ${calendarFilter === 'watchlist' ? 'active' : ''}`} onClick={() => setCalendarFilter('watchlist')}>Watchlist</button>
                        </div>
                    </div>
                </div>
                <p className="page-subtitle">
                    {liveCalendar
                        ? `${calendarItems.length} upcoming earnings events from Financial Modeling Prep API.`
                        : 'Demo calendar data. Connect your FMP API key in Settings to see real earnings dates.'}
                </p>
            </div>

            <div className="card">
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Company</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Est. EPS</th>
                                <th>Est. Revenue</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {calendarItems.slice(0, 30).map((cal, i) => {
                                const isWatched = watchlist.some(w => w.ticker === cal.ticker);
                                return (
                                    <tr key={cal.ticker + cal.date + i}>
                                        <td>
                                            <div className="table-company">
                                                <div className="company-logo">{(cal.ticker || '??').substring(0, 3)}</div>
                                                <div className="company-info">
                                                    <span className="company-name">{cal.company?.name || cal.ticker}</span>
                                                    <span className="company-ticker">{cal.ticker}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ fontVariantNumeric: 'tabular-nums' }}>{fmtDate(cal.date)}</td>
                                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{cal.time || 'TBD'}</td>
                                        <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                                            {cal.estimate_eps !== undefined && cal.estimate_eps !== null ? `$${cal.estimate_eps}` : '—'}
                                        </td>
                                        <td style={{ fontFamily: 'var(--font-mono)' }}>
                                            {cal.estimate_revenue && cal.estimate_revenue !== 'N/A' ? cal.estimate_revenue : '—'}
                                        </td>
                                        <td>
                                            <span className="badge badge-amber">Upcoming</span>
                                        </td>
                                        <td>
                                            {isWatched
                                                ? <span className="badge badge-green">Watching</span>
                                                : <button className="btn btn-sm btn-ghost" onClick={() => addToWatchlist(cal.company || { ticker: cal.ticker, name: cal.ticker })}>+ Watch</button>
                                            }
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
