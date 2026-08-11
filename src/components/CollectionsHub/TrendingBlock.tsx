"use client";

import React from 'react';
import { Flame, Play, Plus } from 'lucide-react';
import Link from 'next/link';

export default function TrendingBlock() {
    return (
        <div className="w-full mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Flame className="text-orange-500" /> Выбор редакции
            </h2>
            
            <div className="relative w-full aspect-[21/9] md:aspect-[21/7] rounded-3xl overflow-hidden group cursor-pointer border border-white/10 shadow-2xl shadow-black/40">
                {/* Background Image (Placeholder) */}
                <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: 'url("https://image.tmdb.org/t/p/original/8rpDcsfLJypbO6vtecsmEZzAUdi.jpg")' }}
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#080c13] via-[#080c13]/60 to-transparent opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--theme-bg)]/90 via-transparent to-transparent opacity-90" />

                {/* Content */}
                <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end items-start z-10">
                    <div className="bg-orange-500/20 text-orange-400 border border-orange-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-1.5 backdrop-blur-md">
                        <Flame className="w-3.5 h-3.5" /> В тренде
                    </div>
                    
                    <div className="flex gap-2 mb-3 text-white/70 text-sm font-medium">
                        <span className="bg-white/10 px-2.5 py-1 rounded-lg backdrop-blur-md border border-white/10">Киберпанк</span>
                        <span className="bg-white/10 px-2.5 py-1 rounded-lg backdrop-blur-md border border-white/10">Мрачное будущее</span>
                    </div>

                    <h3 className="text-3xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg max-w-2xl leading-tight">
                        Неоновые сны: Лучшие игры и фильмы в стиле Киберпанк
                    </h3>
                    
                    <p className="text-white/70 text-lg md:text-xl max-w-2xl mb-8 line-clamp-2 md:line-clamp-none">
                        Огромные мегаполисы, импланты, хакеры и зловещие корпорации. Мы собрали самые атмосферные тайтлы, погружающие в эстетику мрачного будущего.
                    </p>

                    <div className="flex items-center gap-4">
                        <Link href="/collections/movies/cyberpunk" className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                            <Play className="w-5 h-5 fill-current" />
                            Смотреть подборку
                        </Link>
                        <button className="flex items-center gap-2 bg-white/10 border border-white/20 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/20 transition-all backdrop-blur-md">
                            <Plus className="w-5 h-5" />
                            Сохранить
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
