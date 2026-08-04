"use client";

import Script from 'next/script';
import BottomNav from '@/components/twa/BottomNav';
import { useEffect, useState } from 'react';
import { useTelegram } from '@/hooks/useTelegram';
import { createClient } from '@/utils/supabase/client';

export default function TWALayout({ children }: { children: React.ReactNode }) {
  const { initData } = useTelegram();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only attempt auth if we have initData from Telegram
    if (initData) {
      const authenticateUser = async () => {
        try {
          const res = await fetch('/api/twa/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ initData })
          });

          const data = await res.json();
          if (res.ok && data.session) {
            // Set the session in the local supabase client
            const supabase = createClient();
            await supabase.auth.setSession({
              access_token: data.session.access_token,
              refresh_token: data.session.refresh_token
            });
            setIsAuthenticated(true);
          } else {
            setError(data.error || 'Authentication failed');
          }
        } catch (e: any) {
          setError(e.message);
        }
      };
      
      authenticateUser();
    } else {
      // If run outside Telegram, we might want to still show it for debugging, 
      // but without auth. Or we can just let it render.
      // For now, we will simulate true if in development and no window.Telegram
      if (typeof window !== 'undefined' && !(window as any).Telegram?.WebApp?.initData) {
        setIsAuthenticated(true); // Allow local browser testing without auth
      }
    }
  }, [initData]);

  return (
    <div className="flex flex-col min-h-screen bg-black text-white relative">
      <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
      
      <main className="flex-grow pb-24">
        {!isAuthenticated && !error ? (
          <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-screen p-4 text-center">
            <p className="text-red-500">Ошибка авторизации: {error}</p>
          </div>
        ) : (
          children
        )}
      </main>
      
      <BottomNav />
    </div>
  );
}
