"use client";

import React, { useState, useEffect, useRef } from 'react';
import { BsSearch, BsChevronRight, BsChevronLeft } from "react-icons/bs";
import { useRouter, useSearchParams } from 'next/navigation';
import { Transition } from '@headlessui/react';

const sortOptions = [
    { id: 'rating', name: 'Рейтингу (по убыванию)' },
    { id: 'rating_asc', name: 'Рейтингу (по возрастанию)' },
    { id: 'date', name: 'Дате выхода (сначала новые)' },
    { id: 'date_asc', name: 'Дате выхода (сначала старые)' },
];

type MenuState = 'main' | 'genre' | 'year' | 'rating' | 'sort';

function CatalogFiltersContent({ genres, hideFilters = false, hideRatingToggle = false, hideYear = false, hideRating = false }: { genres: { id: number, name: string }[], hideFilters?: boolean, hideRatingToggle?: boolean, hideYear?: boolean, hideRating?: boolean }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [isOpen, setIsOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState<MenuState>('main');

    const currentSort = searchParams.get('sort') || 'rating';
    const currentQuery = searchParams.get('q') || '';
    const currentGenres = searchParams.get('genres')?.split(',').filter(Boolean) || [];
    
    const [query, setQuery] = useState(currentQuery);
    
    // Local state for inputs to allow typing before applying
    const [yearMin, setYearMin] = useState(searchParams.get('yearMin') || '');
    const [yearMax, setYearMax] = useState(searchParams.get('yearMax') || '');
    const [ratingMin, setRatingMin] = useState(searchParams.get('ratingMin') || '');
    const [ratingMax, setRatingMax] = useState(searchParams.get('ratingMax') || '');

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Reset menu state when closing
    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => setActiveMenu('main'), 200); // Wait for transition
        }
    }, [isOpen]);

    const updateParams = (updates: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(updates).forEach(([key, value]) => {
            if (value === null || value === '') {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        });
        if (updates.sort || updates.genres || updates.q !== undefined || updates.yearMin !== undefined || updates.yearMax !== undefined || updates.ratingMin !== undefined || updates.ratingMax !== undefined) {
            params.delete('page');
        }
        router.push(`?${params.toString()}`, { scroll: false });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        updateParams({ q: query });
    };

    const toggleGenre = (e: React.MouseEvent, genreName: string) => {
        e.preventDefault();
        e.stopPropagation();
        let newGenres = [...currentGenres];
        if (newGenres.includes(genreName)) {
            newGenres = newGenres.filter(g => g !== genreName);
        } else {
            newGenres.push(genreName);
        }
        updateParams({ genres: newGenres.join(',') });
    };

    const handleApplyFilters = () => {
        updateParams({ yearMin, yearMax, ratingMin, ratingMax });
        setIsOpen(false);
    };

    const activeFilters = [];

    // Genres
    currentGenres.forEach(genre => {
        activeFilters.push({
            id: `genre-${genre}`,
            label: <><span className="text-gray-400 font-normal">Жанр:</span> {genre}</>,
            onRemove: () => {
                const newGenres = currentGenres.filter(g => g !== genre);
                updateParams({ genres: newGenres.length > 0 ? newGenres.join(',') : null });
            }
        });
    });

    // Year
    const yearMinUrl = searchParams.get('yearMin');
    const yearMaxUrl = searchParams.get('yearMax');
    if (yearMinUrl && yearMaxUrl) {
        activeFilters.push({
            id: 'year',
            label: <><span className="text-gray-400 font-normal">Год:</span> {yearMinUrl} - {yearMaxUrl}</>,
            onRemove: () => { setYearMin(''); setYearMax(''); updateParams({ yearMin: null, yearMax: null }); }
        });
    } else if (yearMinUrl) {
        activeFilters.push({
            id: 'year',
            label: <><span className="text-gray-400 font-normal">Год:</span> от {yearMinUrl}</>,
            onRemove: () => { setYearMin(''); updateParams({ yearMin: null }); }
        });
    } else if (yearMaxUrl) {
        activeFilters.push({
            id: 'year',
            label: <><span className="text-gray-400 font-normal">Год:</span> до {yearMaxUrl}</>,
            onRemove: () => { setYearMax(''); updateParams({ yearMax: null }); }
        });
    }

    // Rating
    const ratingMinUrl = searchParams.get('ratingMin');
    const ratingMaxUrl = searchParams.get('ratingMax');
    if (ratingMinUrl && ratingMaxUrl) {
        activeFilters.push({
            id: 'rating',
            label: <><span className="text-gray-400 font-normal">Рейтинг:</span> {ratingMinUrl} - {ratingMaxUrl}</>,
            onRemove: () => { setRatingMin(''); setRatingMax(''); updateParams({ ratingMin: null, ratingMax: null }); }
        });
    } else if (ratingMinUrl) {
        activeFilters.push({
            id: 'rating',
            label: <><span className="text-gray-400 font-normal">Рейтинг:</span> от {ratingMinUrl}</>,
            onRemove: () => { setRatingMin(''); updateParams({ ratingMin: null }); }
        });
    } else if (ratingMaxUrl) {
        activeFilters.push({
            id: 'rating',
            label: <><span className="text-gray-400 font-normal">Рейтинг:</span> до {ratingMaxUrl}</>,
            onRemove: () => { setRatingMax(''); updateParams({ ratingMax: null }); }
        });
    }

    // Sort
    const sortUrl = searchParams.get('sort');
    if (sortUrl) {
        const sortOption = sortOptions.find(o => o.id === sortUrl);
        if (sortOption) {
            activeFilters.push({
                id: 'sort',
                label: <><span className="text-gray-400 font-normal">Сортировка:</span> {sortOption.name}</>,
                onRemove: () => updateParams({ sort: null })
            });
        }
    }

    return (
        <>
            <form action="#" className='w-full' onSubmit={handleSearch}>
                <div className="group relative">
                    <input 
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        className='focus:bg-black/50 w-full py-4 px-7 pr-14 rounded-lg backdrop-blur-md bg-[#1E1E20] outline-none transition-colors duration-300 border border-transparent focus:border-white/10' 
                        name='search' 
                        type="text" 
                        placeholder='Найти фильм, сериал, игру...' 
                        autoComplete='off' 
                    />
                    <button type='submit'><BsSearch className='absolute top-1/2 -translate-y-1/2 right-6 h-5 w-5 fill-white hover:fill-[#ff1414] transition-colors duration-300' /></button>
                </div>
            </form>
            
            {!hideFilters && (
                <div className="flex md:flex-row flex-col gap-5 justify-between md:items-center mt-6 z-50 relative">
                    <div className="flex flex-wrap items-center gap-3">
                        {activeFilters.map(filter => (
                            <div
                                key={filter.id}
                                className="flex items-center gap-1 pl-4 pr-2 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white font-medium text-[15px] shadow-lg backdrop-blur-md"
                            >
                                <span>{filter.label}</span>
                                <button
                                    onClick={filter.onRemove}
                                    className="ml-1 p-1 text-gray-400 hover:text-[#ff1414] hover:bg-white/10 rounded-lg transition-all"
                                >
                                    <span className="text-[22px] leading-[0.6] block">&times;</span>
                                </button>
                            </div>
                        ))}
                        
                        <div className="relative" ref={dropdownRef}>
                            <button 
                                className='px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300 text-white font-medium flex items-center gap-2 shadow-lg backdrop-blur-md'
                                onClick={() => setIsOpen(!isOpen)}
                            >
                                <span className="text-xl leading-none font-light mb-0.5">+</span> Добавить фильтр
                            </button>
                            
                            <Transition
                                show={isOpen}
                                enter="transition ease-out duration-200"
                                enterFrom="opacity-0 translate-y-2 scale-95"
                                enterTo="opacity-100 translate-y-0 scale-100"
                                leave="transition ease-in duration-150"
                                leaveFrom="opacity-100 translate-y-0 scale-100"
                                leaveTo="opacity-0 translate-y-2 scale-95"
                            >
                                <div className="absolute left-0 mt-3 rounded-2xl bg-black/40 backdrop-blur-3xl w-[280px] shadow-xl shadow-black/50 border border-white/10 overflow-hidden z-50">
                                
                                {/* MAIN MENU */}
                                {activeMenu === 'main' && (
                                    <div className="flex flex-col py-2">
                                        <div className="px-3 pb-2 pt-1 border-b border-white/5">
                                            <input 
                                                type="text" 
                                                placeholder="Найти фильтр или значение..."
                                                className="w-full bg-black/40 rounded-lg px-3 py-2 text-sm text-white outline-none border border-white/10 focus:border-white/30 focus:bg-white/5 placeholder-gray-400 transition-all"
                                            />
                                        </div>
                                        <ul className="flex flex-col mt-1">
                                            <li className="px-4 py-2.5 hover:bg-white/10 cursor-pointer flex justify-between items-center transition-colors" onClick={() => setActiveMenu('genre')}>
                                                <span className="text-[15px] text-white">Жанр</span>
                                                <BsChevronRight className="w-3.5 h-3.5 text-gray-400" />
                                            </li>
                                            {!hideYear && (
                                                <li className="px-4 py-2.5 hover:bg-white/10 cursor-pointer flex justify-between items-center transition-colors" onClick={() => setActiveMenu('year')}>
                                                    <span className="text-[15px] text-white">Год</span>
                                                    <BsChevronRight className="w-3.5 h-3.5 text-gray-400" />
                                                </li>
                                            )}
                                            {!hideRating && (
                                                <li className="px-4 py-2.5 hover:bg-white/10 cursor-pointer flex justify-between items-center transition-colors" onClick={() => setActiveMenu('rating')}>
                                                    <span className="text-[15px] text-white">Рейтинг</span>
                                                    <BsChevronRight className="w-3.5 h-3.5 text-gray-400" />
                                                </li>
                                            )}
                                            <li className="px-4 py-2.5 hover:bg-white/10 cursor-pointer flex justify-between items-center transition-colors" onClick={() => setActiveMenu('sort')}>
                                                <span className="text-[15px] text-white">Сортировка</span>
                                                <BsChevronRight className="w-3.5 h-3.5 text-gray-400" />
                                            </li>
                                        </ul>
                                    </div>
                                )}

                                {/* GENRE MENU */}
                                {activeMenu === 'genre' && (
                                    <div className="flex flex-col h-[350px]">
                                        <div className="flex items-center px-4 py-3 border-b border-white/10 bg-white/5 cursor-pointer hover:bg-white/10 transition-colors" onClick={() => setActiveMenu('main')}>
                                            <BsChevronLeft className="w-4 h-4 text-gray-300 mr-3" />
                                            <span className="font-medium text-white text-[15px]">Жанры</span>
                                        </div>
                                        <ul className='flex flex-col overflow-y-auto custom-scrollbar p-2'>
                                            {genres.map(genre => {
                                                const isChecked = currentGenres.includes(genre.name);
                                                return (
                                                    <li key={genre.id} className='hover:bg-white/10 transition-all duration-200 px-3 py-2 rounded-xl'>
                                                        <label className='flex gap-3 items-center cursor-pointer' onClick={(e) => toggleGenre(e, genre.name)}>
                                                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isChecked ? 'bg-[#ff1414] border-[#ff1414]' : 'border-white/30 bg-black/20'}`}>
                                                                {isChecked && (
                                                                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                )}
                                                            </div>
                                                            <p className="select-none text-[15px] text-gray-200">{genre.name}</p>
                                                        </label>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                )}

                                {/* YEAR MENU */}
                                {activeMenu === 'year' && (
                                    <div className="flex flex-col">
                                        <div className="flex items-center px-4 py-3 border-b border-white/10 bg-white/5 cursor-pointer hover:bg-white/10 transition-colors" onClick={() => setActiveMenu('main')}>
                                            <BsChevronLeft className="w-4 h-4 text-gray-300 mr-3" />
                                            <span className="font-medium text-white text-[15px]">Год</span>
                                        </div>
                                        <div className="p-4">
                                            <div className="flex items-center gap-3">
                                                <input 
                                                    type="number" 
                                                    placeholder="ОТ" 
                                                    value={yearMin}
                                                    onChange={(e) => setYearMin(e.target.value)}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
                                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-white/30 focus:bg-white/5 text-center transition-all"
                                                />
                                                <span className="text-gray-400">—</span>
                                                <input 
                                                    type="number" 
                                                    placeholder="ДО" 
                                                    value={yearMax}
                                                    onChange={(e) => setYearMax(e.target.value)}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
                                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-white/30 focus:bg-white/5 text-center transition-all"
                                                />
                                            </div>
                                            <button 
                                                onClick={handleApplyFilters}
                                                className="w-full mt-4 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-medium py-2 rounded-xl transition-all"
                                            >
                                                Применить
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* RATING MENU */}
                                {activeMenu === 'rating' && (
                                    <div className="flex flex-col">
                                        <div className="flex items-center px-4 py-3 border-b border-white/10 bg-white/5 cursor-pointer hover:bg-white/10 transition-colors" onClick={() => setActiveMenu('main')}>
                                            <BsChevronLeft className="w-4 h-4 text-gray-300 mr-3" />
                                            <span className="font-medium text-white text-[15px]">Рейтинг</span>
                                        </div>
                                        <div className="p-4">
                                            {!hideRatingToggle && (
                                                <div className="flex gap-2 mb-4">
                                                    <button className="flex-1 py-1.5 rounded-xl bg-black/40 text-gray-400 border border-white/5 text-sm font-medium hover:bg-white/5 transition-all">
                                                        КП
                                                    </button>
                                                    <button className="flex-1 py-1.5 rounded-xl bg-white/10 text-white border border-white/10 shadow-sm text-sm font-medium">
                                                        TMDB
                                                    </button>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-3">
                                                <input 
                                                    type="number" 
                                                    step="0.1"
                                                    placeholder="ОТ" 
                                                    value={ratingMin}
                                                    onChange={(e) => setRatingMin(e.target.value)}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
                                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-white/30 focus:bg-white/5 text-center transition-all"
                                                />
                                                <span className="text-gray-400">—</span>
                                                <input 
                                                    type="number" 
                                                    step="0.1"
                                                    placeholder="ДО" 
                                                    value={ratingMax}
                                                    onChange={(e) => setRatingMax(e.target.value)}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
                                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-white/30 focus:bg-white/5 text-center transition-all"
                                                />
                                            </div>
                                            <button 
                                                onClick={handleApplyFilters}
                                                className="w-full mt-4 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-medium py-2 rounded-xl transition-all"
                                            >
                                                Применить
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* SORT MENU */}
                                {activeMenu === 'sort' && (
                                    <div className="flex flex-col">
                                        <div className="flex items-center px-4 py-3 border-b border-white/10 bg-white/5 cursor-pointer hover:bg-white/10 transition-colors" onClick={() => setActiveMenu('main')}>
                                            <BsChevronLeft className="w-4 h-4 text-gray-300 mr-3" />
                                            <span className="font-medium text-white text-[15px]">Сортировка</span>
                                        </div>
                                        <ul className='flex flex-col p-2'>
                                            {sortOptions.map(option => (
                                                <li key={option.id} className='hover:bg-white/10 transition-all duration-200 px-3 py-2 rounded-xl'>
                                                    <label className='flex gap-3 items-center cursor-pointer'>
                                                        <input 
                                                            type="radio" 
                                                            name="sort"
                                                            checked={currentSort === option.id}
                                                            onChange={() => {
                                                                updateParams({ sort: option.id });
                                                                setIsOpen(false);
                                                            }}
                                                            className="w-4 h-4 accent-[#4096FF] cursor-pointer"
                                                        />
                                                        <p className="select-none text-[14px] text-gray-200">{option.name}</p>
                                                    </label>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                </div>
                            </Transition>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default function CatalogFilters(props: { genres: { id: number, name: string }[], hideFilters?: boolean, hideRatingToggle?: boolean, hideYear?: boolean, hideRating?: boolean }) {
    return (
        <React.Suspense fallback={<div className="h-20 w-full animate-pulse bg-white/5 rounded-lg"></div>}>
            <CatalogFiltersContent {...props} />
        </React.Suspense>
    );
}
