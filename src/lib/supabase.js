import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Singleton client for browser usage
let client = null;

export function getSupabase() {
    if (!supabaseUrl || !supabaseAnonKey) {
        return null; // Gracefully handle missing config
    }
    if (!client) {
        client = createClient(supabaseUrl, supabaseAnonKey);
    }
    return client;
}

// Check if Supabase is configured
export function isSupabaseConfigured() {
    return !!(supabaseUrl && supabaseAnonKey);
}
