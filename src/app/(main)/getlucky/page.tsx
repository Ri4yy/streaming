import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import GetLuckyClient from '@/components/GetLucky/GetLuckyClient';
import { createClient } from '@/utils/supabase/server';

export const metadata: Metadata = {
  title: "Мне повезёт — Случайный фильм | CineBox",
  description: "Кейс-рулетка фильмов: настрой фильтры, крути и получай случайный фильм с работающим плеером.",
};

export default async function GetLuckyPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    return (
        <main className="container min-h-screen pt-[120px] pb-[100px]">
            <Link href="/" className="text-gray-400 hover:text-white mb-6 inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-sm font-medium border border-white/5">
                &larr; На главную
            </Link>
            
            <header className="mb-10">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Мне повезёт</h1>
                <p className="text-lg text-gray-400">
                    Кейс-рулетка фильмов: настрой фильтры, крути и получай случайный фильм с работающим плеером
                </p>
            </header>

            <GetLuckyClient isAuth={!!user} />
        </main>
    );
}
