# CallSignal — Live Earnings Call Monitor

Real-time keyword alerts on public company earnings calls. Add companies to your watchlist,
define keywords per company (plus global keywords), and get instant in-app toasts and
browser push notifications when a transcript line matches.

## Features

- **Watchlist** — track companies with per-company keywords
- **Live-ish transcript stream** — demo stream plus Benzinga WebSocket support for live calls
- **Keyword matching** — alerts fire the moment a transcript line contains a keyword
- **Push notifications** — browser push via Web Push (VAPID) even when the tab is closed
- **Earnings calendar** — upcoming earnings dates from Financial Modeling Prep (FMP)
- **Persistence** — watchlist, keywords, and alerts sync to Supabase (localStorage-free)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Without any env vars configured, the app runs in demo mode: watchlist and keywords use
built-in defaults, and the transcript player streams a sample IBM earnings call.

## Environment Variables

Copy these into `.env.local` to unlock live data and persistence:

| Variable | Required for | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Persistence | From your Supabase project settings |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Persistence | From your Supabase project settings |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | Push notifications | Generate with `npx web-push generate-vapid-keys` |
| `VAPID_PRIVATE_KEY` | Push notifications | Private half of the VAPID pair (server only) |
| `FMP_API_KEY` | Earnings calendar, transcripts | Free tier (250 calls/day) at [financialmodelingprep.com/register](https://financialmodelingprep.com/register) |
| `BENZINGA_API_KEY` | Live transcripts | Free trial at [benzinga.com/apis](https://www.benzinga.com/apis/conference-call-transcripts) |

The FMP and Benzinga keys can also be entered and saved in the Settings view, which stores
them in the `user_settings` table when Supabase is configured.

## Supabase Setup

1. Create a free project at [supabase.com](https://supabase.com).
2. Open the SQL Editor and run [`supabase/schema.sql`](supabase/schema.sql) (a migration
   script is also kept in `supabase-migration.sql`).
3. Add the URL and anon key to `.env.local` as above.

## Project Layout

- `src/app/page.js` — main app shell and view routing
- `src/components/` — views (Dashboard, Watchlist, Keywords, Calendar, Alerts, Settings)
- `src/hooks/useCallSignal.js` — central state: watchlist, keywords, alerts, transcript stream
- `src/hooks/useNotifications.js` — push subscription management
- `src/hooks/useBenzinga.js` — Benzinga live transcript WebSocket
- `src/app/api/` — server routes proxying FMP, Benzinga, and push delivery
- `public/sw.js` — service worker for push notifications

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm start` — serve the production build
- `npm run lint` — ESLint

## Deploy

The app deploys as a standard Next.js project. On Vercel, add the environment variables
above in the project settings. The `/api/*` routes and `sw.js` header config in
`next.config.mjs` carry over as-is.

## License

MIT — see [LICENSE](LICENSE).
