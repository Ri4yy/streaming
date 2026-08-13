"use client";

import React, { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import { BsSearch, BsChevronDown, BsStarFill, BsHeart, BsHeartFill } from "react-icons/bs";
import { useRouter } from 'next/navigation';
import { Listbox, Transition } from '@headlessui/react';
import Link from 'next/link';
import Image from 'next/image';
import { fetchGlobalSearch, GlobalSearchResult, GroupedGlobalSearchResults } from '@/app/actions/globalSearch';

// Helper hook for debounce
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
}

const searchCategories = [
    { id: 'search', name: 'Везде' },
    { id: 'movies', name: 'Фильмы' },
    { id: 'series', name: 'Сериалы' },
    { id: 'anime', name: 'Аниме' },
    { id: 'games', name: 'Игры' },
    { id: 'books', name: 'Книги' },
];

const categoryPlaceholders: Record<string, string[]> = {
    search: ['Найти фильм...', 'Найти сериал...', 'Найти игру...', 'Найти аниме...', 'Дэдпул и Росомаха', 'The Witcher 3', 'Во все тяжкие'],
    movies: ['Найти фильм...', 'Мстители', 'Интерстеллар', 'Дюна', 'Побег из Шоушенка', 'Матрица'],
    series: ['Найти сериал...', 'Во все тяжкие', 'Игра престолов', 'Офис', 'Пацаны', 'Очень странные дела'],
    anime: ['Найти аниме...', 'Наруто', 'Атака титанов', 'Ван Пис', 'Тетрадь смерти', 'Клинок, рассекающий демонов'],
    games: ['Найти игру...', 'Ведьмак 3', 'Cyberpunk 2077', 'GTA V', 'Red Dead Redemption 2', 'Elden Ring'],
    books: ['Найти книгу...', 'Гарри Поттер', 'Властелин колец', 'Мастер и Маргарита', '1984', 'Дюна'],
};

export default function ModalSearch({ activeSearch, setActiveSearch }: { activeSearch: boolean, setActiveSearch: (v: boolean) => void }) {
    const [query, setQuery] = useState('');
    const debouncedQuery = useDebounce(query, 500);
    const [category, setCategory] = useState(searchCategories[0]);
    const router = useRouter();
    
    const [isSearching, setIsSearching] = useState(false);
    const [results, setResults] = useState<GlobalSearchResult[] | GroupedGlobalSearchResults | null>(null);

    // Typing effect state
    const [placeholderText, setPlaceholderText] = useState('');
    const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const phrases = categoryPlaceholders[category.id] || categoryPlaceholders['search'];
        const currentPhrase = phrases[currentPhraseIndex];
        
        const typeSpeed = 100;
        const deleteSpeed = 50;
        const pauseDelay = 2000;

        let timer: NodeJS.Timeout;

        if (isDeleting) {
            timer = setTimeout(() => {
                setPlaceholderText(currentPhrase.substring(0, placeholderText.length - 1));
                if (placeholderText.length === 0) {
                    setIsDeleting(false);
                    setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
                }
            }, deleteSpeed);
        } else {
            timer = setTimeout(() => {
                setPlaceholderText(currentPhrase.substring(0, placeholderText.length + 1));
                if (placeholderText === currentPhrase) {
                    setTimeout(() => setIsDeleting(true), pauseDelay);
                }
            }, typeSpeed);
        }

        return () => clearTimeout(timer);
    }, [placeholderText, isDeleting, currentPhraseIndex, category.id]);

    // Reset typing effect when category changes
    useEffect(() => {
        setPlaceholderText('');
        setIsDeleting(false);
        setCurrentPhraseIndex(0);
    }, [category.id]);

    useEffect(() => {
        if (!activeSearch) {
            setQuery('');
            setResults(null);
            return;
        }
    }, [activeSearch]);

    useEffect(() => {
        const performSearch = async () => {
            if (!debouncedQuery.trim() || debouncedQuery.trim().length < 2) {
                setResults(null);
                setIsSearching(false);
                return;
            }
            setIsSearching(true);
            try {
                const data = await fetchGlobalSearch(debouncedQuery.trim(), category.id);
                setResults(data);
            } catch (error) {
                console.error("Search failed:", error);
            } finally {
                setIsSearching(false);
            }
        };
        performSearch();
    }, [debouncedQuery, category.id]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            setActiveSearch(false);
            router.push(`/${category.id}?q=${encodeURIComponent(query.trim())}`);
        }
    };

    return (  
        <div className={`${activeSearch ? 'modal__active' : 'modal'} flex justify-center items-center`}>
            <div className={`md:w-3/5 xl:w-2/5 w-[90%] h-fit z-[63] ${activeSearch ? 'flex flex-col gap-4' : 'hidden'} relative`}>
                <button onClick={() => setActiveSearch(false)} className="flex justify-center items-center absolute -top-14 right-0 backdrop-blur-md bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300 w-10 h-10 z-[62]">
                    <IoClose className=' h-8 w-8' />
                </button>
                <form action="#" method="POST" className='w-full flex gap-3 xs:flex-row flex-col' onSubmit={handleSearch}>
                    <div className="relative w-full xs:w-[150px] shrink-0 z-50">
                        <Listbox value={category} onChange={setCategory}>
                            <Listbox.Button className="relative w-full h-full min-h-[56px] cursor-pointer rounded-xl bg-[var(--theme-input-bg)] hover:bg-[var(--theme-input-bg)]/80 border border-white/10 transition-all duration-300 py-4 pl-5 pr-10 text-left shadow-lg backdrop-blur-md focus:outline-none sm:text-sm text-white flex items-center">
                                <span className="block truncate font-medium">{category.name}</span>
                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                                    <BsChevronDown className="h-4 w-4 text-gray-400" aria-hidden="true" />
                                </span>
                            </Listbox.Button>
                            <Transition
                                as={React.Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <Listbox.Options className="absolute mt-2 max-h-60 w-full overflow-auto custom-scrollbar rounded-2xl bg-black/80 backdrop-blur-3xl py-2 text-base shadow-xl shadow-black/50 ring-1 ring-white/10 focus:outline-none sm:text-sm text-white border border-white/10 z-[70]">
                                    {searchCategories.map((option, index) => (
                                        <Listbox.Option
                                            key={index}
                                            className={({ active }) =>
                                                `relative cursor-pointer select-none py-2.5 pl-5 pr-4 transition-colors ${
                                                    active ? 'bg-white/10' : ''
                                                }`
                                            }
                                            value={option}
                                        >
                                            {({ selected }) => (
                                                <span className={`block truncate ${selected ? 'font-bold text-theme-main' : 'font-normal'}`}>
                                                    {option.name}
                                                </span>
                                            )}
                                        </Listbox.Option>
                                    ))}
                                </Listbox.Options>
                            </Transition>
                        </Listbox>
                    </div>
                    <div className="group relative w-full">
                        <input 
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className='w-full py-4 px-7 pr-14 rounded-xl bg-[var(--theme-input-bg)] hover:bg-[var(--theme-input-bg)]/80 focus:bg-[var(--theme-input-bg)]/80 outline-none border border-white/10 hover:border-white/20 focus:border-white/30 transition-all duration-300 text-white placeholder:text-white/50' 
                            name='search' 
                            type="text" 
                            placeholder={placeholderText} 
                            autoComplete='off' 
                        />
                        <button type='submit'>
                            {isSearching ? (
                                <div className="absolute top-1/2 -translate-y-1/2 right-6 w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <BsSearch className='absolute top-1/2 -translate-y-1/2 right-6 h-5 w-5 fill-white hover:fill-theme-main transition-colors duration-300' />
                            )}
                        </button>
                    </div>
                </form>

                {/* SEARCH RESULTS DROPDOWN */}
                {results && (
                    <div className="w-full bg-black/40 backdrop-blur-3xl border border-white/10 rounded-xl mt-2 overflow-hidden shadow-2xl shadow-black/50 flex flex-col max-h-[60vh]">
                        <div className="overflow-y-auto custom-scrollbar p-2">
                            {category.id === 'search' ? (
                                // GROUPED RESULTS
                                <>
                                    <ResultGroup title="Фильмы" items={(results as GroupedGlobalSearchResults).movies} onSelect={() => setActiveSearch(false)} />
                                    <ResultGroup title="Сериалы" items={(results as GroupedGlobalSearchResults).series} onSelect={() => setActiveSearch(false)} />
                                    <ResultGroup title="Аниме" items={(results as GroupedGlobalSearchResults).anime} onSelect={() => setActiveSearch(false)} />
                                    <ResultGroup title="Игры" items={(results as GroupedGlobalSearchResults).games} onSelect={() => setActiveSearch(false)} />
                                    <ResultGroup title="Книги" items={(results as GroupedGlobalSearchResults).books} onSelect={() => setActiveSearch(false)} />
                                    
                                    {Object.values(results as GroupedGlobalSearchResults).every(arr => arr.length === 0) && (
                                        <p className="text-gray-400 text-center py-8">Ничего не найдено</p>
                                    )}
                                </>
                            ) : (
                                // FLAT LIST (Single Category)
                                <>
                                    {(results as GlobalSearchResult[]).length > 0 ? (
                                        <div className="flex flex-col gap-1">
                                            {(results as GlobalSearchResult[]).map(item => (
                                                <ResultItem key={item.id} item={item} onSelect={() => setActiveSearch(false)} />
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-400 text-center py-8">Ничего не найдено</p>
                                    )}
                                </>
                            )}
                        </div>
                        <button 
                            onClick={handleSearch}
                            className="w-full p-4 bg-[var(--theme-input-bg)] hover:bg-[var(--theme-input-bg)]/80 transition-colors border-t border-white/10 text-white font-medium flex items-center justify-center gap-2"
                        >
                            Показать все результаты поиска
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}

// Subcomponents for results
function ResultGroup({ title, items, onSelect }: { title: string, items: GlobalSearchResult[], onSelect: () => void }) {
    if (!items || items.length === 0) return null;
    return (
        <div className="mb-4 last:mb-0">
            <h3 className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2 px-3">{title}</h3>
            <div className="flex flex-col gap-1">
                {items.map(item => (
                    <ResultItem key={item.id} item={item} onSelect={onSelect} />
                ))}
            </div>
        </div>
    );
}

function ResultItem({ item, onSelect }: { item: GlobalSearchResult, onSelect: () => void }) {
    const [imgSrc, setImgSrc] = useState(item.img);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        setImgSrc(item.img);
    }, [item.img]);

    const toggleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsFavorite(!isFavorite);
        // Here you would typically add API logic to save favorite
    };

    return (
        <div className="relative group">
            <Link 
                href={item.href} 
                onClick={onSelect}
                className="flex items-center gap-4 p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
                <div className="w-12 h-16 bg-black/40 rounded overflow-hidden shrink-0 relative">
                    {imgSrc && !imgSrc.includes('null') ? (
                        <Image 
                            src={imgSrc} 
                            alt={item.title} 
                            fill 
                            className="object-cover" 
                            onError={() => {
                                if (item.fallbackImg && imgSrc !== item.fallbackImg) {
                                    setImgSrc(item.fallbackImg);
                                }
                            }}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-white/30 text-center p-1">Нет фото</div>
                    )}
                </div>
                <div className="flex flex-col justify-center overflow-hidden w-full pr-10">
                    <div className="flex items-center justify-between gap-3">
                        <p className="text-white font-medium truncate group-hover:text-theme-main transition-colors">{item.title}</p>
                        {item.rate > 0 && (
                            <div className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded text-xs shrink-0">
                                <BsStarFill className="w-2.5 h-2.5 text-yellow-500" />
                                <span className="text-white">{item.rate.toFixed(1)}</span>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                        <span>{item.genre}</span>
                        {item.year && (
                            <>
                                <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                                <span>{item.year}</span>
                            </>
                        )}
                    </div>
                </div>
            </Link>
            <button 
                onClick={toggleFavorite}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100 z-10 focus:opacity-100"
                title={isFavorite ? "Убрать из избранного" : "Добавить в избранное"}
            >
                {isFavorite ? (
                    <BsHeartFill className="w-4 h-4 text-theme-main" />
                ) : (
                    <BsHeart className="w-4 h-4 text-gray-400 hover:text-white" />
                )}
            </button>
        </div>
    );
}
