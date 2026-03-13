'use client';

import { useState, useEffect, useCallback } from 'react';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';

/**
 * Hook for browser push notification management.
 * Handles permission, subscription, and registration with server.
 */
export function useNotifications() {
    const [permission, setPermission] = useState('default');
    const [subscription, setSubscription] = useState(null);
    const [isSupported, setIsSupported] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator) {
            setIsSupported(true);
            setPermission(Notification.permission);
        }
    }, []);

    // Register service worker and get push subscription
    const subscribe = useCallback(async () => {
        if (!isSupported) return null;

        try {
            // Request permission
            const perm = await Notification.requestPermission();
            setPermission(perm);
            if (perm !== 'granted') return null;

            // Register service worker
            const registration = await navigator.serviceWorker.register('/sw.js');
            await navigator.serviceWorker.ready;

            // Get VAPID public key
            const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
            if (!vapidPublicKey) {
                console.warn('VAPID public key not configured, push notifications disabled');
                return null;
            }

            // Subscribe to push
            const sub = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
            });

            setSubscription(sub);

            // Send subscription to server
            await fetch('/api/push/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(sub.toJSON()),
            });

            return sub;
        } catch (err) {
            console.error('Push subscription failed:', err);
            return null;
        }
    }, [isSupported]);

    // Unsubscribe
    const unsubscribe = useCallback(async () => {
        if (subscription) {
            await subscription.unsubscribe();
            setSubscription(null);
        }
    }, [subscription]);

    return {
        permission,
        subscription,
        isSupported,
        subscribe,
        unsubscribe,
    };
}

// Utility: Convert VAPID key from base64 to Uint8Array
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
