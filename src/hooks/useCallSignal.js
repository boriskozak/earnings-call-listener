'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';
import { matchKeywords } from '@/lib/keywords';
import { IBM_TRANSCRIPT, DEFAULT_KEYWORDS, DEFAULT_WATCHLIST } from '@/app/demoData';

/**
 * Central state hook for CallSignal. Manages:
 * - Watchlist + keywords (persisted to Supabase when configured, localStorage fallback)
 * - Transcript streaming (demo or live Benzinga)
 * - Keyword matching + alert generation
 * - Toasts
 */
export function useCallSignal() {
    const [watchlist, setWatchlist] = useState([]);
    const [globalKeywords, setGlobalKeywords] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [transcriptLines, setTranscriptLines] = useState([]);
    const [isStreaming, setIsStreaming] = useState(false);
    const [streamIndex, setStreamIndex] = useState(0);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [toasts, setToasts] = useState([]);
    const [apiKey, setApiKey] = useState('');
    const [apiStatus, setApiStatus] = useState('disconnected');
    const [benzingaKey, setBenzingaKey] = useState('');
    const [liveCalendar, setLiveCalendar] = useState(null);
    const [loadingCalendar, setLoadingCalendar] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false);

    const transcriptRef = useRef(null);
    const streamTimerRef = useRef(null);
    const streamIndexRef = useRef(0);

    // ===== SUPABASE PERSISTENCE =====
    const supabase = getSupabase();
    const hasSupabase = isSupabaseConfigured();

    // Load initial data from Supabase or defaults
    useEffect(() => {
        async function loadData() {
            if (hasSupabase && supabase) {
                try {
                    // Load watchlist
                    const { data: wl } = await supabase.from('watchlist').select('*').order('created_at');
                    if (wl && wl.length > 0) {
                        setWatchlist(wl.map(w => ({ ticker: w.ticker, name: w.name, keywords: w.keywords || [] })));
                    } else {
                        // Seed with defaults
                        setWatchlist(DEFAULT_WATCHLIST);
                        for (const w of DEFAULT_WATCHLIST) {
                            await supabase.from('watchlist').upsert({ ticker: w.ticker, name: w.name, keywords: w.keywords });
                        }
                    }

                    // Load global keywords
                    const { data: kw } = await supabase.from('global_keywords').select('*').order('created_at');
                    if (kw && kw.length > 0) {
                        setGlobalKeywords(kw.map(k => k.keyword));
                    } else {
                        setGlobalKeywords(DEFAULT_KEYWORDS);
                        for (const k of DEFAULT_KEYWORDS) {
                            await supabase.from('global_keywords').upsert({ keyword: k });
                        }
                    }

                    // Load alerts
                    const { data: al } = await supabase.from('alerts').select('*').order('created_at', { ascending: false }).limit(100);
                    if (al) {
                        setAlerts(al.map(a => ({
                            id: a.id,
                            ticker: a.ticker,
                            company: a.company,
                            speaker: a.speaker,
                            role: a.speaker_role,
                            text: a.text,
                            keywords: a.keywords || [],
                            time: a.call_time,
                            timestamp: a.created_at,
                        })));
                    }

                    // Load FMP API key from settings
                    const { data: fmpSetting } = await supabase.from('user_settings').select('value').eq('key', 'fmp_api_key').single();
                    if (fmpSetting?.value) {
                        setApiKey(fmpSetting.value);
                    }

                    // Load Benzinga API key from settings
                    const { data: bzSetting } = await supabase.from('user_settings').select('value').eq('key', 'benzinga_api_key').single();
                    if (bzSetting?.value) {
                        setBenzingaKey(bzSetting.value);
                    }
                } catch (err) {
                    console.warn('Supabase load failed, using defaults:', err.message);
                    setWatchlist(DEFAULT_WATCHLIST);
                    setGlobalKeywords(DEFAULT_KEYWORDS);
                }
            } else {
                // No Supabase — use defaults
                setWatchlist(DEFAULT_WATCHLIST);
                setGlobalKeywords(DEFAULT_KEYWORDS);
            }
            setDataLoaded(true);
        }
        loadData();
    }, [hasSupabase, supabase]);

    // ===== TOAST =====
    const addToast = useCallback((title, message, type = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, title, message, type }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    // ===== ACTIVE KEYWORDS =====
    const getActiveKeywords = useCallback(() => {
        if (!selectedCompany) return globalKeywords;
        const entry = watchlist.find(w => w.ticker === selectedCompany.ticker);
        return entry ? [...new Set([...entry.keywords, ...globalKeywords])] : globalKeywords;
    }, [selectedCompany, watchlist, globalKeywords]);

    // ===== FMP CALENDAR =====
    const fetchCalendar = useCallback(async (key) => {
        if (!key) return;
        setLoadingCalendar(true);
        try {
            const res = await fetch(`/api/earnings?type=calendar&apiKey=${encodeURIComponent(key)}`);
            const json = await res.json();
            if (json.data && Array.isArray(json.data)) {
                const now = new Date();
                const filtered = json.data
                    .filter(item => new Date(item.date) >= now)
                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                    .slice(0, 50);
                setLiveCalendar(filtered);
                setApiStatus('connected');
                addToast('✓ API Connected', `Loaded ${filtered.length} upcoming earnings events from FMP`, 'info');
            } else if (json.error) {
                setApiStatus('disconnected');
                addToast('✗ API Error', json.error, 'alert');
            }
        } catch (err) {
            setApiStatus('disconnected');
            addToast('✗ Connection Error', err.message, 'alert');
        }
        setLoadingCalendar(false);
    }, [addToast]);

    // ===== PUSH NOTIFICATIONS =====
    async function sendPushNotification(alert) {
        try {
            await fetch('/api/push/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: `⚡ ${alert.keywords.join(', ')}`,
                    body: `${alert.speaker} — ${alert.ticker} call: "${alert.text.substring(0, 100)}..."`,
                    url: '/',
                }),
            });
        } catch (err) {
            // Push send is best-effort
        }
    }

    // ===== STREAMING =====
    const startStream = useCallback((company) => {
        setSelectedCompany(company);
        setTranscriptLines([]);
        setStreamIndex(0);
        streamIndexRef.current = 0;
        setIsStreaming(true);
        setAlerts(prev => prev); // keep existing alerts
        addToast('📡 Connected', `Monitoring ${company.name || company.ticker} (${company.ticker}) earnings call`, 'info');
    }, [addToast]);

    const stopStream = useCallback(() => {
        setIsStreaming(false);
        clearInterval(streamTimerRef.current);
        addToast('Disconnected', 'Stream stopped.', 'info');
    }, [addToast]);

    // Stream effect — feeds transcript lines with delay
    useEffect(() => {
        if (!isStreaming) return;

        streamTimerRef.current = setInterval(() => {
            const idx = streamIndexRef.current;
            if (idx >= IBM_TRANSCRIPT.length) {
                setIsStreaming(false);
                addToast('Stream Ended', 'The earnings call has concluded.', 'info');
                clearInterval(streamTimerRef.current);
                return;
            }

            const line = IBM_TRANSCRIPT[idx];
            streamIndexRef.current = idx + 1;
            setStreamIndex(idx + 1);

            if (line) {
                setTranscriptLines(tl => [...tl, line]);

                const activeKws = getActiveKeywords();
                const matches = matchKeywords(line.text, activeKws);
                if (matches.length > 0) {
                    const newAlert = {
                        id: Date.now() + Math.random(),
                        ticker: selectedCompany?.ticker || 'IBM',
                        company: selectedCompany?.name || 'IBM',
                        speaker: line.speaker,
                        role: line.role || '',
                        text: line.text,
                        keywords: [...new Set(matches.map(m => m.keyword))],
                        time: line.time,
                        timestamp: new Date().toISOString(),
                    };
                    setAlerts(prev => [newAlert, ...prev]);
                    addToast(
                        `MATCH: ${matches[0].keyword}`,
                        `${line.speaker} — ${selectedCompany?.ticker || 'IBM'} call`,
                        'alert'
                    );

                    // Persist alert to Supabase
                    if (hasSupabase && supabase) {
                        supabase.from('alerts').insert({
                            ticker: newAlert.ticker,
                            company: newAlert.company,
                            speaker: newAlert.speaker,
                            speaker_role: newAlert.role,
                            text: newAlert.text,
                            keywords: newAlert.keywords,
                            call_time: newAlert.time,
                        }).then(() => { });
                    }

                    // Send push notification
                    sendPushNotification(newAlert);
                }
            }
        }, 2200);

        return () => clearInterval(streamTimerRef.current);
    }, [isStreaming, addToast, getActiveKeywords, selectedCompany, hasSupabase, supabase]);

    // Auto-scroll transcript
    useEffect(() => {
        if (transcriptRef.current) {
            transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
        }
    }, [transcriptLines]);

    // ===== WATCHLIST MUTATIONS =====
    const addToWatchlist = useCallback(async (company) => {
        if (watchlist.find(w => w.ticker === company.ticker)) return;
        const newEntry = { ticker: company.ticker, name: company.name, keywords: [] };
        setWatchlist(prev => [...prev, newEntry]);

        if (hasSupabase && supabase) {
            await supabase.from('watchlist').upsert({ ticker: company.ticker, name: company.name, keywords: [] });
        }
    }, [watchlist, hasSupabase, supabase]);

    const removeFromWatchlist = useCallback(async (ticker) => {
        setWatchlist(prev => prev.filter(w => w.ticker !== ticker));
        if (hasSupabase && supabase) {
            await supabase.from('watchlist').delete().eq('ticker', ticker);
        }
    }, [hasSupabase, supabase]);

    const toggleWatchlistKeyword = useCallback(async (ticker, keyword) => {
        setWatchlist(prev => prev.map(w => {
            if (w.ticker !== ticker) return w;
            const updated = w.keywords.includes(keyword)
                ? { ...w, keywords: w.keywords.filter(k => k !== keyword) }
                : { ...w, keywords: [...w.keywords, keyword] };

            // Persist
            if (hasSupabase && supabase) {
                supabase.from('watchlist').update({ keywords: updated.keywords }).eq('ticker', ticker).then(() => { });
            }
            return updated;
        }));
    }, [hasSupabase, supabase]);

    // ===== KEYWORD MUTATIONS =====
    const addKeyword = useCallback(async (kw) => {
        const keyword = kw.trim().toLowerCase();
        if (!keyword || globalKeywords.includes(keyword)) return;
        setGlobalKeywords(prev => [...prev, keyword]);

        if (hasSupabase && supabase) {
            await supabase.from('global_keywords').upsert({ keyword });
        }
    }, [globalKeywords, hasSupabase, supabase]);

    const removeKeyword = useCallback(async (kw) => {
        setGlobalKeywords(prev => prev.filter(k => k !== kw));
        if (hasSupabase && supabase) {
            await supabase.from('global_keywords').delete().eq('keyword', kw);
        }
    }, [hasSupabase, supabase]);

    // ===== ALERT MUTATIONS =====
    const clearAlerts = useCallback(async () => {
        setAlerts([]);
        if (hasSupabase && supabase) {
            await supabase.from('alerts').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        }
    }, [hasSupabase, supabase]);

    // ===== API KEY =====
    const handleApiKeySubmit = useCallback(async (key) => {
        setApiKey(key);
        if (key.trim()) {
            fetchCalendar(key.trim());
            if (hasSupabase && supabase) {
                await supabase.from('user_settings').upsert({ key: 'fmp_api_key', value: key.trim() });
            }
        }
    }, [fetchCalendar, hasSupabase, supabase]);

    // ===== BENZINGA KEY =====
    const handleBenzingaKeySubmit = useCallback(async (key) => {
        setBenzingaKey(key);
        if (key.trim() && hasSupabase && supabase) {
            await supabase.from('user_settings').upsert({ key: 'benzinga_api_key', value: key.trim() });
        }
        addToast('✓ Benzinga Key Saved', 'Your Benzinga API key has been stored.', 'info');
    }, [hasSupabase, supabase, addToast]);

    return {
        // State
        watchlist,
        globalKeywords,
        alerts,
        transcriptLines,
        isStreaming,
        streamIndex,
        selectedCompany,
        toasts,
        apiKey,
        setApiKey,
        apiStatus,
        liveCalendar,
        loadingCalendar,
        dataLoaded,
        transcriptRef,
        hasSupabase,
        benzingaKey,
        setBenzingaKey,

        // Actions
        addToast,
        removeToast,
        getActiveKeywords,
        fetchCalendar,
        startStream,
        stopStream,
        addToWatchlist,
        removeFromWatchlist,
        toggleWatchlistKeyword,
        addKeyword,
        removeKeyword,
        clearAlerts,
        handleApiKeySubmit,
        handleBenzingaKeySubmit,
    };
}
