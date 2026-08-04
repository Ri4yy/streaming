import type { Metadata } from "next";
import "./globals.css";
import ScrollToTopBtn from "@/components/ScrollToTopBtn";

export const metadata: Metadata = {
  title: {
    template: "%s | CineBox",
    default: "CineBox — Каталог кино, сериалов, аниме и игр",
  },
  description: "CineBox — твой личный каталог и трекер для фильмов, сериалов, аниме, игр и книг. Ищи, сохраняй и смотри.",
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
    <html lang="ru">
      <body className="antialiased flex flex-col min-h-screen">
        <ScrollToTopBtn />
        {children}
      </body>
    </html>
  );
}
