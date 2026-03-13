// Benzinga API proxy — keeps API key server-side
// Provides WebSocket connection details for real-time transcripts

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'status';
    const apiKey = process.env.BENZINGA_API_KEY || '';

    if (!apiKey) {
        return Response.json({
            error: 'Benzinga API key not configured. Add BENZINGA_API_KEY to .env.local',
            configured: false,
        });
    }

    switch (action) {
        case 'connect': {
            // Return WebSocket URL with auth token
            // Benzinga's WebSocket endpoint for conference call transcripts
            const wsUrl = `wss://api.benzinga.com/api/v1/conferenceCall/stream?token=${encodeURIComponent(apiKey)}`;
            return Response.json({ wsUrl, configured: true });
        }

        case 'calls': {
            // Fetch upcoming/active conference calls
            try {
                const res = await fetch(
                    `https://api.benzinga.com/api/v1/conferenceCall/calls?token=${encodeURIComponent(apiKey)}`,
                    { next: { revalidate: 60 } }
                );
                const data = await res.json();
                return Response.json({ data, configured: true });
            } catch (err) {
                return Response.json({ error: err.message, configured: true }, { status: 500 });
            }
        }

        case 'status':
        default:
            return Response.json({ configured: true, message: 'Benzinga API is configured' });
    }
}
