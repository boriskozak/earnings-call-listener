// API route to proxy Financial Modeling Prep (FMP) earnings data
// Free tier: 250 calls/day — https://financialmodelingprep.com
// Updated to use /stable/ endpoints (v3/v4 deprecated after Aug 2025)

const FMP_STABLE = 'https://financialmodelingprep.com/stable';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'calendar';
    // Prefer the header so API keys stay out of URLs and server access logs
    const apiKey = request.headers.get('x-fmp-api-key') || searchParams.get('apiKey') || process.env.FMP_API_KEY || '';

    if (!apiKey) {
        return Response.json({ error: 'No API key provided. Get a free key at https://financialmodelingprep.com/register', data: null }, { status: 400 });
    }

    try {
        let url;

        switch (type) {
            case 'calendar': {
                // Earnings calendar — upcoming dates
                const from = searchParams.get('from') || getDateString(0);
                const to = searchParams.get('to') || getDateString(90);
                url = `${FMP_STABLE}/earnings-calendar?from=${from}&to=${to}&apikey=${apiKey}`;
                break;
            }
            case 'transcript': {
                // Earnings call transcript
                const symbol = encodeURIComponent(searchParams.get('symbol') || 'IBM');
                const year = searchParams.get('year') || new Date().getFullYear();
                const quarter = searchParams.get('quarter') || '1';
                url = `${FMP_STABLE}/earning-call-transcript?symbol=${symbol}&year=${year}&quarter=${quarter}&apikey=${apiKey}`;
                break;
            }
            case 'transcript-dates': {
                // Available transcript dates for a symbol
                const symbol = encodeURIComponent(searchParams.get('symbol') || 'IBM');
                url = `${FMP_STABLE}/earning-call-transcript?symbol=${symbol}&apikey=${apiKey}`;
                break;
            }
            case 'search': {
                // Company search
                const query = searchParams.get('query') || '';
                url = `${FMP_STABLE}/search?query=${encodeURIComponent(query)}&limit=20&apikey=${apiKey}`;
                break;
            }
            case 'profile': {
                // Company profile
                const symbol = encodeURIComponent(searchParams.get('symbol') || 'IBM');
                url = `${FMP_STABLE}/profile?symbol=${symbol}&apikey=${apiKey}`;
                break;
            }
            default:
                return Response.json({ error: 'Invalid type parameter' }, { status: 400 });
        }

        const res = await fetch(url, { next: { revalidate: 300 } }); // Cache 5 min
        const data = await res.json();

        return Response.json({ data, error: null });
    } catch (err) {
        return Response.json({ error: err.message, data: null }, { status: 500 });
    }
}

function getDateString(daysFromNow) {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    return d.toISOString().split('T')[0];
}

