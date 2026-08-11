import type { Metadata } from "next";
import "./globals.css";
import ScrollToTopBtn from "@/components/ScrollToTopBtn";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import Script from "next/script";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  metadataBase: new URL('https://cinebox.local'), // Will be changed to production URL later
  title: {
    template: "%s | CineBox",
    default: "CineBox — Каталог кино, сериалов, аниме и игр",
  },
  description: "CineBox — твой личный каталог и трекер для фильмов, сериалов, аниме, игр и книг. Ищи, сохраняй и смотри.",
  openGraph: {
    title: "CineBox — Каталог кино, сериалов, аниме и игр",
    description: "CineBox — твой личный каталог и трекер для фильмов, сериалов, аниме, игр и книг. Ищи, сохраняй и смотри.",
    url: 'https://cinebox.local',
    siteName: 'CineBox',
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "CineBox — Каталог кино, сериалов, аниме и игр",
    description: "CineBox — твой личный каталог и трекер для фильмов, сериалов, аниме, игр и книг. Ищи, сохраняй и смотри.",
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
      </head>
      <body className="antialiased flex flex-col min-h-screen">
        <ScrollToTopBtn />
        {children}
      </body>
    </html>
  );
}
