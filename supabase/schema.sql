-- =============================================
-- CallSignal: Supabase Schema
-- Run this in your Supabase Dashboard → SQL Editor
-- =============================================

-- Watchlist: Companies the user is tracking
CREATE TABLE IF NOT EXISTS watchlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ticker TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  keywords TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Global Keywords: Monitored across all calls
CREATE TABLE IF NOT EXISTS global_keywords (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  keyword TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Alerts: Persisted keyword match alerts
CREATE TABLE IF NOT EXISTS alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ticker TEXT NOT NULL,
  company TEXT,
  speaker TEXT,
  speaker_role TEXT,
  text TEXT NOT NULL,
  keywords TEXT[] DEFAULT '{}',
  call_time TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Settings: API keys and preferences
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Push Subscriptions: Browser push endpoints
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  endpoint TEXT NOT NULL UNIQUE,
  keys_p256dh TEXT NOT NULL,
  keys_auth TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_alerts_ticker ON alerts(ticker);
CREATE INDEX IF NOT EXISTS idx_alerts_created ON alerts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_watchlist_ticker ON watchlist(ticker);

-- Disable RLS for single-user simplicity (enable later for multi-user)
ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE global_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Allow all access (single-user mode) — replace with auth policies for multi-user
CREATE POLICY "Allow all" ON watchlist FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON global_keywords FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON alerts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON user_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON push_subscriptions FOR ALL USING (true) WITH CHECK (true);
