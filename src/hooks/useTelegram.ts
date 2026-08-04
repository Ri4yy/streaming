"use client";

import { useEffect, useState } from "react";

export function useTelegram() {
  const [tg, setTg] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [initData, setInitData] = useState<string>('');

  useEffect(() => {
    // Only access window in the browser
    if (typeof window !== "undefined") {
      // Telegram is injected into the window object by telegram-web-app.js
      const telegram = (window as any).Telegram?.WebApp;
      if (telegram) {
        setTg(telegram);
        setInitData(telegram.initData);
        if (telegram.initDataUnsafe?.user) {
          setUser(telegram.initDataUnsafe.user);
        }
        
        // Ensure the web app expands to full height
        telegram.expand();
      }
    }
  }, []);

  const onClose = () => {
    tg?.close();
  };

  return {
    tg,
    user,
    initData,
    onClose,
  };
}
