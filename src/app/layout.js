import "./globals.css";

export const metadata = {
  title: "CallSignal — Live Earnings Call Monitor",
  description: "Real-time keyword alerts on public company earnings calls. Monitor transcripts, track keywords, and get instant notifications when critical terms are mentioned.",
};

export const viewport = {
  themeColor: "#06080d",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#06080d" />
      </head>
      <body>
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').catch(() => {});
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
