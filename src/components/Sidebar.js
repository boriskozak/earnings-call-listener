'use client';

import { useAuth } from './AuthProvider';

export default function Sidebar({
    activeNav,
    setActiveNav,
    isStreaming,
    selectedCompany,
    alerts,
    apiStatus,
    startStream,
    stopStream,
    companies,
    user,
}) {
    const { signOut } = useAuth();

    // Get user initials for avatar fallback
    const initials = user?.user_metadata?.full_name
        ? user.user_metadata.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : user?.email?.[0]?.toUpperCase() || 'U';

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    <div className="sidebar-logo-icon">CS</div>
                    <div className="sidebar-logo-text">
                        <div className="sidebar-logo-title">CallSignal</div>
                        <div className="sidebar-logo-subtitle">Earnings Monitor</div>
                    </div>
                </div>
            </div>

            {isStreaming && (
                <div className="live-indicator">
                    <div className="live-dot"></div>
                    LIVE — {selectedCompany?.ticker || 'IBM'}
                </div>
            )}

            <nav className="sidebar-nav">
                <div className="nav-section-title">Monitor</div>
                {[
                    { id: 'dashboard', icon: '◈', label: 'Dashboard' },
                    { id: 'calendar', icon: '▦', label: 'Calendar' },
                    { id: 'watchlist', icon: '◉', label: 'Watchlist' },
                    { id: 'keywords', icon: '⌘', label: 'Keywords' },
                    { id: 'alerts', icon: '⚡', label: 'Alerts', badge: alerts.length || null },
                ].map(item => (
                    <div
                        key={item.id}
                        className={`nav-item ${activeNav === item.id ? 'active' : ''}`}
                        onClick={() => setActiveNav(item.id)}
                    >
                        <span className="nav-item-icon">{item.icon}</span>
                        {item.label}
                        {item.badge ? <span className="nav-badge">{item.badge}</span> : null}
                    </div>
                ))}

                <div className="nav-section-title" style={{ marginTop: 12 }}>Actions</div>
                {!isStreaming ? (
                    <div
                        className="nav-item"
                        onClick={() => startStream(companies.find(c => c.ticker === 'IBM'))}
                    >
                        <span className="nav-item-icon">▶</span>
                        Demo: IBM Call
                    </div>
                ) : (
                    <div className="nav-item" onClick={stopStream}>
                        <span className="nav-item-icon">■</span>
                        Stop Stream
                    </div>
                )}
                <div
                    className="nav-item"
                    onClick={() => setActiveNav('settings')}
                >
                    <span className="nav-item-icon">⚙</span>
                    API Settings
                </div>
            </nav>

            <div className="sidebar-footer">
                {user && (
                    <div className="sidebar-user">
                        {user.user_metadata?.avatar_url ? (
                            <img
                                src={user.user_metadata.avatar_url}
                                alt=""
                                className="sidebar-user-avatar"
                                referrerPolicy="no-referrer"
                            />
                        ) : (
                            <div className="sidebar-user-avatar sidebar-user-avatar-fallback">
                                {initials}
                            </div>
                        )}
                        <div className="sidebar-user-info">
                            <div className="sidebar-user-name">
                                {user.user_metadata?.full_name || user.email?.split('@')[0]}
                            </div>
                            <div className="sidebar-user-email">{user.email}</div>
                        </div>
                        <button
                            className="sidebar-signout-btn"
                            onClick={signOut}
                            title="Sign out"
                        >
                            ↪
                        </button>
                    </div>
                )}
                <div className="sidebar-footer-info">
                    <span className={`api-status ${apiStatus}`}>
                        <span className="status-dot" style={{
                            background: apiStatus === 'connected' ? 'var(--green)' : 'var(--text-3)',
                            width: 5, height: 5, borderRadius: '50%', display: 'inline-block'
                        }}></span>
                        {apiStatus === 'connected' ? ' FMP Connected' : ' API Not Connected'}
                    </span>
                </div>
            </div>
        </aside>
    );
}

