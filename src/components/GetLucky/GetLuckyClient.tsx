'use client';

import React, { useState, Fragment, useRef, useEffect } from 'react';
import { GetLuckyFilters, spinRoulette } from '@/app/(main)/getlucky/actions';
import { TMDBMedia } from '@/services/tmdb';
import { ChevronDown, Plus, Trash2, X, ChevronRight, ChevronLeft } from 'lucide-react';
import { Listbox, Transition } from '@headlessui/react';
import RouletteWheel from './RouletteWheel';
import RouletteResult from './RouletteResult';
import Image from 'next/image';
import { tmdbApi } from '@/services/tmdb';

interface Props {
    isAuth: boolean;
}

const GENRES = [
    { value: '28', label: 'Боевик' },
    { value: '12', label: 'Приключения' },
    { value: '16', label: 'Мультфильм' },
    { value: '35', label: 'Комедия' },
    { value: '80', label: 'Криминал' },
    { value: '18', label: 'Драма' },
    { value: '14', label: 'Фэнтези' },
    { value: '27', label: 'Ужасы' },
    { value: '878', label: 'Фантастика' },
    { value: '53', label: 'Триллер' },
];

const TYPE_OPTIONS = [
    { value: 'all', label: 'Все' },
    { value: 'movie', label: 'Фильмы' },
    { value: 'tv', label: 'Сериалы' },
    { value: 'cartoon', label: 'Мультфильмы' },
    { value: 'anime', label: 'Аниме' },
];

const COUNTRIES = [
    { value: 'US', label: 'США' },
    { value: 'RU', label: 'Россия' },
    { value: 'KR', label: 'Южная Корея' },
    { value: 'JP', label: 'Япония' },
    { value: 'GB', label: 'Великобритания' },
    { value: 'FR', label: 'Франция' },
    { value: 'DE', label: 'Германия' },
    { value: 'CN', label: 'Китай' },
];

const STUDIOS = [
    { value: '2', label: 'Walt Disney' },
    { value: '3', label: 'Pixar' },
    { value: '33', label: 'Universal' },
    { value: '174', label: 'Warner Bros' },
    { value: '420', label: 'Marvel Studios' },
    { value: '521', label: 'DreamWorks' },
    { value: '25', label: '20th Century Fox' },
    { value: '12', label: 'New Line Cinema' },
    { value: '4', label: 'Paramount' },
    { value: '5', label: 'Columbia' }
];

export default function GetLuckyClient({ isAuth }: Props) {
    const [filters, setFilters] = useState<GetLuckyFilters>({
        type: 'all',
        excludeWatched: false,
    });

    const [isSpinning, setIsSpinning] = useState(false);
    const [rouletteItems, setRouletteItems] = useState<TMDBMedia[]>([]);
    const [winnerItem, setWinnerItem] = useState<TMDBMedia | null>(null);
    const [history, setHistory] = useState<TMDBMedia[]>([]);

    const [showAdvanced, setShowAdvanced] = useState(false);
    const [activeMenu, setActiveMenu] = useState<'main' | 'genre' | 'year' | 'rating' | 'country' | 'studio'>('main');

    // For custom dropdown
    const selectedType = TYPE_OPTIONS.find(t => t.value === filters.type) || TYPE_OPTIONS[0];

    const advancedMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (advancedMenuRef.current && !advancedMenuRef.current.contains(event.target as Node)) {
                setShowAdvanced(false);
                setTimeout(() => setActiveMenu('main'), 200);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const [nextItemsBuffer, setNextItemsBuffer] = useState<TMDBMedia[]>([]);

    useEffect(() => {
        let isMounted = true;
        
        // Fetch initial items for the wheel
        spinRoulette(filters).then(items => {
            if (isMounted) {
                setRouletteItems(items);
                // Background fetch for the next spin
                spinRoulette(filters).then(buffer => {
                    if (isMounted) setNextItemsBuffer(buffer);
                });
            }
        });
        
        return () => { isMounted = false; };
    }, [filters]);

    const handleSpin = async () => {
        if (isSpinning || rouletteItems.length === 0) return;

        setIsSpinning(true);
        setWinnerItem(null); // Clear previous result
        
        // If we have a buffer ready and we've already spun once (we have history or a winner before),
        // we can instantly swap to the buffer before spinning so it's a new set of movies!
        if (nextItemsBuffer.length > 0) {
            // We'll shuffle the current items slightly if it's the very first spin,
            // or swap in the buffer if they click "Крутить ещё".
            // Since resetting the wheel is instant, we can safely just swap it!
            setRouletteItems(nextItemsBuffer);
            
            // Fetch the NEXT buffer
            spinRoulette(filters).then(setNextItemsBuffer);
        } else {
            // Fallback: shuffle current items so it doesn't land on the same one
            setRouletteItems(prev => [...prev].sort(() => Math.random() - 0.5));
        }

        // The RouletteWheel will automatically pick up the items and animate.
    };

    const handleSpinComplete = (winner: TMDBMedia) => {
        setWinnerItem(winner);
        setIsSpinning(false);
        setHistory(prev => {
            const newHistory = [winner, ...prev.filter(i => i.id !== winner.id)].slice(0, 10);
            return newHistory;
        });
    };

    return (
        <div className="space-y-10">
            {/* Filter Bar */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-wrap items-center gap-4 relative z-50">
                {/* Type Select Custom */}
                <div className="relative z-30">
                    <Listbox value={selectedType} onChange={(v) => setFilters(prev => ({ ...prev, type: v.value as any }))} disabled={isSpinning}>
                        <div className="relative mt-1">
                            <Listbox.Button className="relative w-full cursor-pointer rounded-xl bg-[var(--theme-input-bg)] hover:bg-[var(--theme-input-bg)]/80 border border-white/10 backdrop-blur-md shadow-lg py-2.5 pl-4 pr-10 text-left text-white focus:outline-none transition-all duration-300">
                                <span className="block truncate font-medium">{selectedType.label}</span>
                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                    <ChevronDown className="h-4 w-4 text-white" aria-hidden="true" />
                                </span>
                            </Listbox.Button>
                            <Transition
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <Listbox.Options className="absolute mt-2 min-w-full w-max overflow-auto rounded-xl bg-black/40 backdrop-blur-3xl shadow-xl shadow-black/50 py-1 ring-1 ring-black/5 focus:outline-none sm:text-sm z-[100] border border-white/10 text-white">
                                    {TYPE_OPTIONS.map((opt, optIdx) => (
                                        <Listbox.Option
                                            key={optIdx}
                                            className={({ active }) =>
                                                `relative cursor-default select-none py-2.5 pl-4 pr-4 transition-colors duration-200 ${active ? 'bg-white/20' : ''
                                                }`
                                            }
                                            value={opt}
                                        >
                                            {({ selected }) => (
                                                <span className={`block whitespace-nowrap ${selected ? 'font-bold text-theme-main' : 'font-normal'}`}>
                                                    {opt.label}
                                                </span>
                                            )}
                                        </Listbox.Option>
                                    ))}
                                </Listbox.Options>
                            </Transition>
                        </div>
                    </Listbox>
                </div>

                {/* Exclude Watched */}
                {isAuth && (
                    <button
                        onClick={() => !isSpinning && setFilters(prev => ({ ...prev, excludeWatched: !prev.excludeWatched }))}
                        disabled={isSpinning}
                        className={`px-4 py-2.5 rounded-xl border backdrop-blur-md shadow-lg transition-colors ${filters.excludeWatched ? 'bg-theme-main/20 border-theme-main/50 text-white' : 'bg-[var(--theme-input-bg)] border-white/10 text-gray-200 hover:bg-[var(--theme-input-bg)]/80'}`}
                    >
                        Без просмотренных
                    </button>
                )}

                {/* Active Filter Pills */}
                {filters.genre && (
                    <div className="flex items-center gap-1 pl-4 pr-2 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white font-medium text-[15px] shadow-lg backdrop-blur-md">
                        <span>Жанр: {GENRES.find(g => g.value === filters.genre)?.label || filters.genre}</span>
                        <button onClick={() => setFilters(prev => ({ ...prev, genre: undefined }))} className="ml-1 p-1 text-gray-400 hover:text-theme-main hover:bg-white/10 rounded-lg transition-all">
                            <span className="text-[22px] leading-[0.6] block">&times;</span>
                        </button>
                    </div>
                )}
                {filters.year && (
                    <div className="flex items-center gap-1 pl-4 pr-2 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white font-medium text-[15px] shadow-lg backdrop-blur-md">
                        <span>Год: {filters.year}</span>
                        <button onClick={() => setFilters(prev => ({ ...prev, year: undefined }))} className="ml-1 p-1 text-gray-400 hover:text-theme-main hover:bg-white/10 rounded-lg transition-all">
                            <span className="text-[22px] leading-[0.6] block">&times;</span>
                        </button>
                    </div>
                )}
                {filters.ratingMin && (
                    <div className="flex items-center gap-1 pl-4 pr-2 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white font-medium text-[15px] shadow-lg backdrop-blur-md">
                        <span>Рейтинг от: {filters.ratingMin}</span>
                        <button onClick={() => setFilters(prev => ({ ...prev, ratingMin: undefined }))} className="ml-1 p-1 text-gray-400 hover:text-theme-main hover:bg-white/10 rounded-lg transition-all">
                            <span className="text-[22px] leading-[0.6] block">&times;</span>
                        </button>
                    </div>
                )}

                {filters.country && (
                    <div className="flex items-center gap-1 pl-4 pr-2 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white font-medium text-[15px] shadow-lg backdrop-blur-md">
                        <span>Страна: {COUNTRIES.find(c => c.value === filters.country)?.label || filters.country}</span>
                        <button onClick={() => setFilters(prev => ({ ...prev, country: undefined }))} className="ml-1 p-1 text-gray-400 hover:text-theme-main hover:bg-white/10 rounded-lg transition-all">
                            <span className="text-[22px] leading-[0.6] block">&times;</span>
                        </button>
                    </div>
                )}
                {filters.studio && (
                    <div className="flex items-center gap-1 pl-4 pr-2 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white font-medium text-[15px] shadow-lg backdrop-blur-md">
                        <span>Студия: {STUDIOS.find(s => s.value === filters.studio)?.label || filters.studio}</span>
                        <button onClick={() => setFilters(prev => ({ ...prev, studio: undefined }))} className="ml-1 p-1 text-gray-400 hover:text-theme-main hover:bg-white/10 rounded-lg transition-all">
                            <span className="text-[22px] leading-[0.6] block">&times;</span>
                        </button>
                    </div>
                )}

                {/* Add Filter Toggle Custom */}
                <div className="relative" ref={advancedMenuRef}>
                    <button
                        disabled={isSpinning}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border transition-all duration-300 font-medium shadow-lg backdrop-blur-md ${showAdvanced ? 'bg-white/10 border-white/20 text-white' : 'bg-[var(--theme-input-bg)] hover:bg-[var(--theme-input-bg)]/80 border-white/10 text-white'}`}
                        onClick={() => setShowAdvanced(!showAdvanced)}
                    >
                        <span className="text-xl leading-none font-light mb-0.5">+</span>
                        <span>Добавить фильтр</span>
                    </button>

                    {/* Advanced Filters Popover styled like screenshot */}
                    <Transition
                        show={showAdvanced}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-2 scale-95"
                        enterTo="opacity-100 translate-y-0 scale-100"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0 scale-100"
                        leaveTo="opacity-0 translate-y-2 scale-95"
                    >
                        <div className="absolute top-full left-0 mt-3 rounded-2xl bg-black/40 backdrop-blur-3xl w-[280px] shadow-xl shadow-black/50 border border-white/10 overflow-hidden z-[100]">
                            {activeMenu === 'main' && (
                                <div className="flex flex-col">
                                    <div className="p-3 border-b border-white/5">
                                        <input
                                            type="text"
                                            placeholder="Найти фильтр или значение..."
                                            className="w-full bg-black/40 rounded-lg px-3 py-2 text-sm text-white outline-none border border-white/10 focus:border-white/30 focus:bg-white/5 placeholder-gray-400 transition-all"
                                        />
                                    </div>
                                    <div className="flex flex-col py-1">
                                        <div onClick={() => setActiveMenu('genre')} className="group cursor-pointer flex items-center justify-between px-4 py-2.5 hover:bg-white/10 transition-colors">
                                            <span className="text-white text-[15px]">Жанр</span>
                                            <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-white transition-colors" />
                                        </div>
                                        <div onClick={() => setActiveMenu('country')} className="group cursor-pointer flex items-center justify-between px-4 py-2.5 hover:bg-white/10 transition-colors">
                                            <span className="text-white text-[15px]">Страна</span>
                                            <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-white transition-colors" />
                                        </div>
                                        <div onClick={() => setActiveMenu('studio')} className="group cursor-pointer flex items-center justify-between px-4 py-2.5 hover:bg-white/10 transition-colors">
                                            <span className="text-white text-[15px]">Студия</span>
                                            <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-white transition-colors" />
                                        </div>
                                        <div onClick={() => setActiveMenu('year')} className="group cursor-pointer flex items-center justify-between px-4 py-2.5 hover:bg-white/10 transition-colors">
                                            <span className="text-white text-[15px]">Год</span>
                                            <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-white transition-colors" />
                                        </div>
                                        <div onClick={() => setActiveMenu('rating')} className="group cursor-pointer flex items-center justify-between px-4 py-2.5 hover:bg-white/10 transition-colors">
                                            <span className="text-white text-[15px]">Рейтинг</span>
                                            <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-white transition-colors" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeMenu === 'genre' && (
                                <div className="flex flex-col h-[350px]">
                                    <div className="flex items-center px-4 py-3 border-b border-white/10 bg-white/5 cursor-pointer hover:bg-white/10 transition-colors" onClick={() => setActiveMenu('main')}>
                                        <ChevronLeft className="w-4 h-4 text-gray-300 mr-3" />
                                        <span className="font-medium text-white text-[15px]">Жанры</span>
                                    </div>
                                    <ul className="flex flex-col overflow-y-auto custom-scrollbar p-2">
                                        {GENRES.map(g => {
                                            const isChecked = filters.genre === g.value;
                                            return (
                                                <li
                                                    key={g.value}
                                                    className="hover:bg-white/10 transition-all duration-200 px-3 py-2 rounded-xl"
                                                >
                                                    <label
                                                        className="flex gap-3 items-center cursor-pointer"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setFilters(prev => ({ ...prev, genre: isChecked ? undefined : g.value }));
                                                        }}
                                                    >
                                                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isChecked ? 'bg-theme-main border-theme-main' : 'border-white/30 bg-black/20'}`}>
                                                            {isChecked && (
                                                                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                        <p className="select-none text-[15px] text-gray-200">{g.label}</p>
                                                    </label>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            )}

                            {activeMenu === 'year' && (
                                <div className="flex flex-col">
                                    <div className="flex items-center px-4 py-3 border-b border-white/10 bg-white/5 cursor-pointer hover:bg-white/10 transition-colors" onClick={() => setActiveMenu('main')}>
                                        <ChevronLeft className="w-4 h-4 text-gray-300 mr-3" />
                                        <span className="font-medium text-white text-[15px]">Год</span>
                                    </div>
                                    <div className="p-4 flex flex-col gap-3">
                                        <input
                                            type="number"
                                            placeholder="Например: 2023"
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-white/30 focus:bg-white/5 transition-all"
                                            value={filters.year || ''}
                                            onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value || undefined }))}
                                        />
                                        <button
                                            onClick={() => { setShowAdvanced(false); setTimeout(() => setActiveMenu('main'), 200); }}
                                            className="w-full mt-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-medium py-2 rounded-xl transition-all"
                                        >
                                            Применить
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeMenu === 'rating' && (
                                <div className="flex flex-col">
                                    <div className="flex items-center px-4 py-3 border-b border-white/10 bg-white/5 cursor-pointer hover:bg-white/10 transition-colors" onClick={() => setActiveMenu('main')}>
                                        <ChevronLeft className="w-4 h-4 text-gray-300 mr-3" />
                                        <span className="font-medium text-white text-[15px]">Рейтинг</span>
                                    </div>
                                    <div className="p-4 flex flex-col gap-3">
                                        <input
                                            type="number"
                                            min="0" max="10" step="0.1"
                                            placeholder="Например: 7.0"
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-white/30 focus:bg-white/5 transition-all"
                                            value={filters.ratingMin || ''}
                                            onChange={(e) => setFilters(prev => ({ ...prev, ratingMin: e.target.value ? Number(e.target.value) : undefined }))}
                                        />
                                        <button
                                            onClick={() => { setShowAdvanced(false); setTimeout(() => setActiveMenu('main'), 200); }}
                                            className="w-full mt-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-medium py-2 rounded-xl transition-all"
                                        >
                                            Применить
                                        </button>
                                    </div>
                                </div>
                            )}

                            {(activeMenu === 'country' || activeMenu === 'studio') && (
                                <div className="flex flex-col h-[350px]">
                                    <div className="flex items-center px-4 py-3 border-b border-white/10 bg-white/5 cursor-pointer hover:bg-white/10 transition-colors" onClick={() => setActiveMenu('main')}>
                                        <ChevronLeft className="w-4 h-4 text-gray-300 mr-3" />
                                        <span className="font-medium text-white text-[15px]">
                                            {activeMenu === 'country' ? 'Страны' : 'Студии'}
                                        </span>
                                    </div>
                                    <ul className="flex flex-col overflow-y-auto custom-scrollbar p-2">
                                        {(activeMenu === 'country' ? COUNTRIES : STUDIOS).map(item => {
                                            const isChecked = activeMenu === 'country' 
                                                ? filters.country === item.value 
                                                : filters.studio === item.value;
                                            return (
                                                <li 
                                                    key={item.value} 
                                                    className="hover:bg-white/10 transition-all duration-200 px-3 py-2 rounded-xl"
                                                >
                                                    <label 
                                                        className="flex gap-3 items-center cursor-pointer"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            if (activeMenu === 'country') {
                                                                setFilters(prev => ({ ...prev, country: isChecked ? undefined : item.value }));
                                                            } else {
                                                                setFilters(prev => ({ ...prev, studio: isChecked ? undefined : item.value }));
                                                            }
                                                        }}
                                                    >
                                                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isChecked ? 'bg-theme-main border-theme-main' : 'border-white/30 bg-black/20'}`}>
                                                            {isChecked && (
                                                                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                        <p className="select-none text-[15px] text-gray-200">{item.label}</p>
                                                    </label>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </Transition>
                </div>
            </div>

            {/* Roulette Area */}
            <div className="bg-[#0b1016] rounded-2xl border border-white/5 p-6 md:p-10 relative overflow-hidden flex flex-col items-center">
                <RouletteWheel
                    items={rouletteItems}
                    isSpinning={isSpinning}
                    onComplete={handleSpinComplete}
                />

                <button
                    onClick={handleSpin}
                    disabled={isSpinning}
                    className="mt-8 relative overflow-hidden group px-10 py-4 rounded-2xl font-bold text-lg text-white shadow-[0_0_20px_rgba(239,68,68,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-500 transition-transform group-hover:scale-105"></div>
                    <span className="relative z-10">Мне повезёт</span>
                </button>
            </div>

            {/* Result Area */}
            {winnerItem && (
                <RouletteResult item={winnerItem} onSpinAgain={handleSpin} isSpinning={isSpinning} />
            )}

            {/* History Area */}
            {history.length > 0 && (
                <div className="pt-10">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-3">
                            Выпадало раньше
                            <button
                                onClick={() => setHistory([])}
                                className="text-gray-500 hover:text-red-400 transition-colors"
                                title="Очистить историю"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </h2>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                        {history.map((item, idx) => (
                            <div key={`${item.id}-${idx}`} className="w-[120px] shrink-0 relative group rounded-xl overflow-hidden cursor-pointer" onClick={() => setWinnerItem(item)}>
                                <Image
                                    src={tmdbApi.getImageUrl(item.poster_path)}
                                    alt={item.title || item.name || ''}
                                    width={120}
                                    height={180}
                                    className="w-full aspect-[2/3] object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end">
                                    <div className="bg-white/20 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] font-bold text-white">
                                        {item.vote_average?.toFixed(1) || '0.0'}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
