'use client';

import { useNotifications } from '@/hooks/useNotifications';

export default function SettingsView({
    apiKey,
    setApiKey,
    apiStatus,
    liveCalendar,
    loadingCalendar,
    handleApiKeySubmit,
    hasSupabase,
    benzingaKey,
    setBenzingaKey,
    handleBenzingaKeySubmit,
}) {
    const { permission, isSupported, subscribe, subscription } = useNotifications();

    return (
        <>
            <div className="page-header">
                <h1 className="page-title">Settings</h1>
                <p className="page-subtitle">Connect to live data providers and configure notifications.</p>
            </div>

            {/* Supabase Status */}
            <div className="card">
                <div className="card-header">
                    <div className="card-title">Supabase (Database)</div>
                    <span className={`badge ${hasSupabase ? 'badge-green' : 'badge-amber'}`}>
                        {hasSupabase ? 'Connected' : 'Not Configured'}
                    </span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-1)', lineHeight: 1.6 }}>
                    {hasSupabase
                        ? 'Supabase is connected. Your watchlist, keywords, and alerts are being persisted to the database.'
                        : 'Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local to enable persistent storage.'}
                </p>
                {!hasSupabase && (
                    <p style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 8 }}>
                        Create a free project at{' '}
                        <a href="https://supabase.com" target="_blank" rel="noopener noreferrer"
                            style={{ color: 'var(--blue)', textDecoration: 'none' }}>
                            supabase.com ↗
                        </a>
                        {' '}then run the schema.sql in the SQL Editor.
                    </p>
                )}
            </div>

            {/* Push Notifications */}
            <div className="card" style={{ marginTop: 16 }}>
                <div className="card-header">
                    <div className="card-title">🔔 Push Notifications</div>
                    <span className={`badge ${permission === 'granted' ? 'badge-green' : permission === 'denied' ? 'badge-red' : 'badge-amber'}`}>
                        {permission === 'granted' ? 'Enabled' : permission === 'denied' ? 'Blocked' : 'Not Enabled'}
                    </span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-1)', lineHeight: 1.6, marginBottom: 12 }}>
                    Get browser push notifications when keyword matches are detected during live earnings calls.
                </p>
                {isSupported && permission !== 'granted' && permission !== 'denied' && (
                    <button className="btn btn-primary" onClick={subscribe}>
                        🔔 Enable Push Notifications
                    </button>
                )}
                {permission === 'granted' && (
                    <div style={{ padding: 10, background: 'var(--green-soft)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(0,196,140,0.15)' }}>
                        <p style={{ fontSize: 12, color: 'var(--green)', fontWeight: 600 }}>
                            ✓ Push notifications enabled — you&apos;ll get alerts for keyword matches
                        </p>
                    </div>
                )}
                {permission === 'denied' && (
                    <div style={{ padding: 10, background: 'var(--red-soft)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,71,87,0.15)' }}>
                        <p style={{ fontSize: 12, color: 'var(--red)', fontWeight: 600 }}>
                            ✗ Notifications blocked — enable them in your browser settings
                        </p>
                    </div>
                )}
                {!isSupported && (
                    <p style={{ fontSize: 12, color: 'var(--text-2)' }}>Push notifications are not supported in this browser.</p>
                )}
            </div>

            {/* FMP API Key */}
            <div className="card" style={{ marginTop: 16 }}>
                <div className="card-header">
                    <div className="card-title">Financial Modeling Prep</div>
                    <span className={`api-status ${apiStatus}`}>
                        {apiStatus === 'connected' ? '● Connected' : '○ Not Connected'}
                    </span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-1)', marginBottom: 12, lineHeight: 1.6 }}>
                    FMP provides earnings calendar data, company profiles, and historical transcripts.
                    The free tier includes 250 API calls per day.
                </p>
                <p style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 16 }}>
                    Get a free API key at{' '}
                    <a href="https://financialmodelingprep.com/register" target="_blank" rel="noopener noreferrer"
                        style={{ color: 'var(--blue)', textDecoration: 'none' }}>
                        financialmodelingprep.com/register ↗
                    </a>
                </p>
                <form onSubmit={(e) => { e.preventDefault(); handleApiKeySubmit(apiKey); }} className="input-with-btn">
                    <input
                        className="input"
                        type="password"
                        placeholder="Enter your FMP API key..."
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary" disabled={loadingCalendar}>
                        {loadingCalendar ? 'Connecting...' : 'Connect'}
                    </button>
                </form>
                {apiStatus === 'connected' && (
                    <div style={{ marginTop: 12, padding: 10, background: 'var(--green-soft)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(0,196,140,0.15)' }}>
                        <p style={{ fontSize: 12, color: 'var(--green)', fontWeight: 600 }}>
                            ✓ Connected — {liveCalendar?.length || 0} earnings events loaded
                        </p>
                    </div>
                )}
            </div>

            {/* Benzinga */}
            <div className="card" style={{ marginTop: 16 }}>
                <div className="card-header">
                    <div className="card-title">Benzinga (Live Transcripts)</div>
                    <span className="badge badge-amber">Free Trial</span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-1)', lineHeight: 1.6, marginBottom: 12 }}>
                    Benzinga&apos;s WebSocket API enables real-time transcript streaming during live earnings calls.
                    Sign up for a free trial to replace the demo stream with actual live data.
                </p>
                <form onSubmit={(e) => { e.preventDefault(); handleBenzingaKeySubmit(benzingaKey); }} className="input-with-btn">
                    <input
                        className="input"
                        type="password"
                        placeholder="Enter your Benzinga API key..."
                        value={benzingaKey}
                        onChange={(e) => setBenzingaKey(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary">Save Key</button>
                </form>
                <p style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 8 }}>
                    Sign up at{' '}
                    <a href="https://www.benzinga.com/apis/conference-call-transcripts" target="_blank" rel="noopener noreferrer"
                        style={{ color: 'var(--blue)', textDecoration: 'none' }}>
                        benzinga.com/apis ↗
                    </a>
                </p>
            </div>
        </>
    );
}
