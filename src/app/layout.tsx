import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTopBtn from "@/components/ScrollToTopBtn";

export const metadata: Metadata = {
  title: "Entertainment Catalog",
  description: "Your personal tracking catalog for movies, series, anime, games, and books.",
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
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
