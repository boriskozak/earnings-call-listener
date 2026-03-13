import webpush from 'web-push';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';

// Configure web-push with VAPID details
const VAPID_PUBLIC = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY || '';

if (VAPID_PUBLIC && VAPID_PRIVATE) {
    webpush.setVapidDetails(
        'mailto:callsignal@example.com',
        VAPID_PUBLIC,
        VAPID_PRIVATE
    );
}

export async function POST(request) {
    try {
        const { title, body, url } = await request.json();

        if (!VAPID_PUBLIC || !VAPID_PRIVATE) {
            return Response.json({ error: 'VAPID keys not configured', sent: 0 });
        }

        // Get all subscriptions from Supabase
        let subscriptions = [];
        if (isSupabaseConfigured()) {
            const supabase = getSupabase();
            if (supabase) {
                const { data } = await supabase.from('push_subscriptions').select('*');
                subscriptions = data || [];
            }
        }

        if (subscriptions.length === 0) {
            return Response.json({ sent: 0, message: 'No subscriptions found' });
        }

        const payload = JSON.stringify({ title, body, url });

        // Send to all subscriptions
        const results = await Promise.allSettled(
            subscriptions.map(sub =>
                webpush.sendNotification(
                    {
                        endpoint: sub.endpoint,
                        keys: {
                            p256dh: sub.keys_p256dh,
                            auth: sub.keys_auth,
                        },
                    },
                    payload
                ).catch(async (err) => {
                    // Remove invalid subscriptions (410 Gone)
                    if (err.statusCode === 410 || err.statusCode === 404) {
                        const supabase = getSupabase();
                        if (supabase) {
                            await supabase.from('push_subscriptions').delete().eq('endpoint', sub.endpoint);
                        }
                    }
                    throw err;
                })
            )
        );

        const sent = results.filter(r => r.status === 'fulfilled').length;
        return Response.json({ sent, total: subscriptions.length });
    } catch (err) {
        return Response.json({ error: err.message, sent: 0 }, { status: 500 });
    }
}
