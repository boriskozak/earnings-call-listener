'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Hook for Benzinga WebSocket real-time transcript streaming.
 * Falls back to demo mode when no API key is configured.
 */
export function useBenzinga({ onTranscriptLine, onError }) {
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [activeCall, setActiveCall] = useState(null);
    const wsRef = useRef(null);
    const reconnectTimerRef = useRef(null);
    const reconnectAttemptRef = useRef(0);

    const connect = useCallback(async (apiKey, callId) => {
        if (!apiKey) {
            onError?.('No Benzinga API key configured');
            return;
        }

        setIsConnecting(true);
        reconnectAttemptRef.current = 0;

        try {
            // Get WebSocket URL from our API proxy
            const res = await fetch(`/api/benzinga?action=connect&callId=${encodeURIComponent(callId || '')}`);
            const { wsUrl, error } = await res.json();

            if (error) {
                onError?.(error);
                setIsConnecting(false);
                return;
            }

            // Connect WebSocket
            const ws = new WebSocket(wsUrl);
            wsRef.current = ws;

            ws.onopen = () => {
                setIsConnected(true);
                setIsConnecting(false);
                setActiveCall(callId);
                reconnectAttemptRef.current = 0;

                // Send auth message
                ws.send(JSON.stringify({
                    action: 'subscribe',
                    data: { authToken: apiKey, callId },
                }));
            };

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.type === 'transcript') {
                        onTranscriptLine?.({
                            speaker: data.speaker || 'Unknown',
                            role: data.role || '',
                            text: data.content || data.text || '',
                            time: data.timestamp || new Date().toLocaleTimeString(),
                        });
                    }
                } catch (err) {
                    // Ignore malformed messages
                }
            };

            ws.onclose = () => {
                setIsConnected(false);
                // Auto-reconnect with exponential backoff
                if (reconnectAttemptRef.current < 5) {
                    const delay = Math.min(1000 * Math.pow(2, reconnectAttemptRef.current), 30000);
                    reconnectAttemptRef.current++;
                    reconnectTimerRef.current = setTimeout(() => {
                        connect(apiKey, callId);
                    }, delay);
                }
            };

            ws.onerror = () => {
                onError?.('WebSocket connection error');
                setIsConnecting(false);
            };
        } catch (err) {
            onError?.(err.message);
            setIsConnecting(false);
        }
    }, [onTranscriptLine, onError]);

    const disconnect = useCallback(() => {
        clearTimeout(reconnectTimerRef.current);
        reconnectAttemptRef.current = 999; // Prevent reconnect
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }
        setIsConnected(false);
        setIsConnecting(false);
        setActiveCall(null);
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            clearTimeout(reconnectTimerRef.current);
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, []);

    return {
        isConnected,
        isConnecting,
        activeCall,
        connect,
        disconnect,
    };
}
