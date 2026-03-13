'use client';

import { useState } from 'react';
import { useCallSignal } from '@/hooks/useCallSignal';
import { COMPANIES, EARNINGS_CALENDAR } from './demoData';
import AuthProvider, { useAuth } from '@/components/AuthProvider';
import LoginPage from '@/components/LoginPage';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import CalendarView from '@/components/CalendarView';
import WatchlistView from '@/components/WatchlistView';
import KeywordsView from '@/components/KeywordsView';
import AlertsView from '@/components/AlertsView';
import SettingsView from '@/components/SettingsView';
import ToastContainer from '@/components/ToastContainer';

function AppContent() {
  const { user, loading } = useAuth();
  const [activeNav, setActiveNav] = useState('dashboard');
  const cs = useCallSignal();

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="login-page">
        <div className="login-card" style={{ textAlign: 'center', padding: '60px 40px' }}>
          <div className="sidebar-logo-icon" style={{ width: 44, height: 44, fontSize: 16, margin: '0 auto 16px' }}>CS</div>
          <p style={{ color: 'var(--text-2)' }}>Loading...</p>
        </div>
      </div>
    );
  }

  // Show login page when not authenticated
  if (!user) {
    return <LoginPage />;
  }

  // Build calendar items for dashboard
  const calendarData = cs.liveCalendar
    ? cs.liveCalendar.map(item => ({
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

  return (
    <div className="app-container">
      <Sidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        isStreaming={cs.isStreaming}
        selectedCompany={cs.selectedCompany}
        alerts={cs.alerts}
        apiStatus={cs.apiStatus}
        startStream={cs.startStream}
        stopStream={cs.stopStream}
        companies={COMPANIES}
        user={user}
      />

      <main className="main-content">
        <ToastContainer toasts={cs.toasts} removeToast={cs.removeToast} />

        {activeNav === 'dashboard' && (
          <Dashboard
            isStreaming={cs.isStreaming}
            selectedCompany={cs.selectedCompany}
            watchlist={cs.watchlist}
            globalKeywords={cs.globalKeywords}
            alerts={cs.alerts}
            transcriptLines={cs.transcriptLines}
            transcriptRef={cs.transcriptRef}
            calendarItems={calendarData}
            getActiveKeywords={cs.getActiveKeywords}
            startStream={cs.startStream}
            stopStream={cs.stopStream}
            addToWatchlist={cs.addToWatchlist}
            setActiveNav={setActiveNav}
          />
        )}

        {activeNav === 'calendar' && (
          <CalendarView
            watchlist={cs.watchlist}
            liveCalendar={cs.liveCalendar}
            addToWatchlist={cs.addToWatchlist}
          />
        )}

        {activeNav === 'watchlist' && (
          <WatchlistView
            watchlist={cs.watchlist}
            globalKeywords={cs.globalKeywords}
            addToWatchlist={cs.addToWatchlist}
            removeFromWatchlist={cs.removeFromWatchlist}
            toggleWatchlistKeyword={cs.toggleWatchlistKeyword}
          />
        )}

        {activeNav === 'keywords' && (
          <KeywordsView
            globalKeywords={cs.globalKeywords}
            addKeyword={cs.addKeyword}
            removeKeyword={cs.removeKeyword}
          />
        )}

        {activeNav === 'alerts' && (
          <AlertsView
            alerts={cs.alerts}
            clearAlerts={cs.clearAlerts}
            startStream={cs.startStream}
            isStreaming={cs.isStreaming}
          />
        )}

        {activeNav === 'settings' && (
          <SettingsView
            apiKey={cs.apiKey}
            setApiKey={cs.setApiKey}
            apiStatus={cs.apiStatus}
            liveCalendar={cs.liveCalendar}
            loadingCalendar={cs.loadingCalendar}
            handleApiKeySubmit={cs.handleApiKeySubmit}
            hasSupabase={cs.hasSupabase}
            benzingaKey={cs.benzingaKey}
            setBenzingaKey={cs.setBenzingaKey}
            handleBenzingaKeySubmit={cs.handleBenzingaKeySubmit}
          />
        )}
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

