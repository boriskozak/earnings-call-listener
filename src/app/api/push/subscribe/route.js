import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';

export async function POST(request) {
    try {
        const subscription = await request.json();

        if (!subscription?.endpoint || !subscription?.keys) {
            return Response.json({ error: 'Invalid subscription data' }, { status: 400 });
        }

        // Store subscription in Supabase if configured
        if (isSupabaseConfigured()) {
            const supabase = getSupabase();
            if (supabase) {
                await supabase.from('push_subscriptions').upsert({
                    endpoint: subscription.endpoint,
                    keys_p256dh: subscription.keys.p256dh,
                    keys_auth: subscription.keys.auth,
                }, { onConflict: 'endpoint' });
            }
        }

        return Response.json({ success: true });
    } catch (err) {
        return Response.json({ error: err.message }, { status: 500 });
    }
}
