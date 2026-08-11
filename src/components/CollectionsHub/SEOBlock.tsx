"use client";

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function SEOBlock() {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 mt-12 mb-20 shadow-lg backdrop-blur-sm">
            <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpanded(!expanded)}>
                <h2 className="text-xl font-bold text-white/90">О разделе подборок</h2>
                <button className="text-white/50 hover:text-white transition-colors">
                    {expanded ? <ChevronUp /> : <ChevronDown />}
                </button>
            </div>
            
            <div className={`mt-4 text-white/50 text-sm leading-relaxed transition-all duration-300 overflow-hidden ${expanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 m-0'}`}>
                <p className="mb-3">
                    Добро пожаловать в хаб подборок! Здесь вы найдете лучшие коллекции фильмов, сериалов, аниме и видеоигр, собранные вручную нашими редакторами и алгоритмами. Не знаете, что посмотреть сегодня вечером? Ищете страшный хоррор на Хэллоуин или расслабляющую игру после тяжелого рабочего дня? Наши тематические подборки помогут вам сделать правильный выбор.
                </p>
                <p className="mb-3">
                    Мы регулярно обновляем списки, добавляя свежие новинки 2024 года, а также бессмертную классику кинематографа и игровой индустрии. Вы можете использовать удобные фильтры по настроению, чтобы найти контент, который идеально подойдет под ваше текущее эмоциональное состояние. Смотреть фильмы онлайн в хорошем качестве или искать лучшие RPG игры теперь стало намного проще благодаря нашей системе умных подборок.
                </p>
                <p>
                    <strong>Ключевые слова:</strong> подборки фильмов, лучшие сериалы 2024, что посмотреть вечером, топ аниме, игры для слабого ПК, кино по жанрам, фильмотека, каталог игр, рейтинги, рекомендации.
                </p>
            </div>
        </div>
    );
}
