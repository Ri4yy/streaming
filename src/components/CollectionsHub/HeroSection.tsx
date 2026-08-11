"use client";

import React, { useState } from 'react';
import { Search } from 'lucide-react';

export default function HeroSection() {
    const [query, setQuery] = useState('');

    return (
        <section className="relative w-full overflow-hidden py-16 md:py-24 rounded-3xl bg-white/5 border border-white/10 shadow-xl shadow-black/20 backdrop-blur-md">
            {/* Ambient Background Gradient */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[300px] bg-[var(--theme-primary)]/20 blur-[100px] opacity-60 rounded-full" />
            </div>

            <div className="relative z-10 container mx-auto px-6 text-center flex flex-col items-center">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 drop-shadow-md tracking-tight">
                    Не знаете, что <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--theme-primary)] to-white">посмотреть</span><br className="hidden md:block"/> или во что поиграть?
                </h1>
                <p className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl mx-auto font-medium">
                    Наши редакторы собрали лучшие фильмы, сериалы, аниме и игры для любого настроения. Откройте для себя новые вселенные.
                </p>

                {/* Smart Search */}
                <div className="w-full max-w-2xl relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-white/50 group-focus-within:text-[var(--theme-primary)] transition-colors duration-300" />
                    </div>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Найти подборку (например, «Киберпанк» или «Для двоих»)..."
                        className="w-full py-4 pl-14 pr-6 rounded-2xl bg-[var(--theme-input-bg)] border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)]/50 focus:border-[var(--theme-primary)]/50 transition-all duration-300 shadow-lg shadow-black/20 backdrop-blur-md text-lg"
                    />
                    
                    {/* Animated Typing Effect placeholder logic could go here later */}
                </div>
            </div>
        </section>
    );
}
