import type { Metadata } from "next";
import "./globals.css";
import ScrollToTopBtn from "@/components/ScrollToTopBtn";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  metadataBase: new URL('https://vixio.online'), // Will be changed to production URL later
  title: {
    template: "%s | Vixio",
    default: "Vixio — Каталог кино, сериалов, аниме и игр",
  },
  description: "Vixio — твой личный каталог и трекер для фильмов, сериалов, аниме, игр и книг. Ищи, сохраняй и смотри.",
  openGraph: {
    title: "Vixio — Каталог кино, сериалов, аниме и игр",
    description: "Vixio — твой личный каталог и трекер для фильмов, сериалов, аниме, игр и книг. Ищи, сохраняй и смотри.",
    url: 'https://vixio.online',
    siteName: 'Vixio',
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Vixio — Каталог кино, сериалов, аниме и игр",
    description: "Vixio — твой личный каталог и трекер для фильмов, сериалов, аниме, игр и книг. Ищи, сохраняй и смотри.",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={cn("dark font-sans", geist.variable)} suppressHydrationWarning>
      <head>
        <Script
          id="theme-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('site-theme');
                if (theme && theme !== 'red') {
                  document.documentElement.setAttribute('data-theme', theme);
                }
              } catch (e) {}
            `,
          }}
        />
        <meta name="yandex-verification" content="04c3f7bd725e984c" />
        {/* Vibix Player SDK */}
        <Script src="https://graphicslab.io/sdk/v2/rendex-sdk.min.js" strategy="afterInteractive" />
        <Script src="https://alt.graphicslab.io/sdk/v2/rendex-sdk.min.js" strategy="afterInteractive" />
      </head>
      <body className="antialiased flex flex-col min-h-screen">
        <ScrollToTopBtn />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
