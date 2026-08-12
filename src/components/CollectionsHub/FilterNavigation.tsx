"use client";

import React, { useState, useEffect, useRef } from 'react';
import { BsSearch } from 'react-icons/bs';
import { useRouter, useSearchParams } from 'next/navigation';

const tabs = ['Все', 'Фильмы', 'Сериалы', 'Аниме', 'Игры'];
const moodTags = [
    { label: 'Поплакать', emoji: '😭' },
    { label: 'Пощекотать нервы', emoji: '😱' },
    { label: 'Смотреть с друзьями', emoji: '🍕' },
    { label: 'На один вечер', emoji: '🛋️' },
    { label: 'Для мозга', emoji: '🧠' },
];

const categoryPlaceholders = [
    'Найти подборку...',
    '«Киберпанк»',
    '«Для двоих»',
    '«Космос и фантастика»',
    '«Что посмотреть на Хэллоуин»'
];

export default function FilterNavigation({ availableMoods }: { availableMoods?: string[] }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const activeTab = searchParams.get('tab') || 'Все';
    
    const activeMood = searchParams.get('mood');

    const handleMoodClick = (mood: string) => {
        if (availableMoods && !availableMoods.includes(mood)) return;
        
        const params = new URLSearchParams(searchParams.toString());
        if (activeMood === mood) {
            params.delete('mood');
        } else {
            params.set('mood', mood);
        }
        router.push(`?${params.toString()}`, { scroll: false });
    };

    const tabsRef = useRef<HTMLUListElement>(null);
    const [pillStyle, setPillStyle] = useState({ left: 0, width: 0, opacity: 0 });
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    // Typing effect state
    const [placeholderText, setPlaceholderText] = useState('');
    const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    const activeIndex = tabs.findIndex(tab => activeTab === tab);

    useEffect(() => {
        const currentPhrase = categoryPlaceholders[currentPhraseIndex];
        const typeSpeed = 100;
        const deleteSpeed = 50;
        const pauseDelay = 2000;
        let timer: NodeJS.Timeout;

        if (isDeleting) {
            timer = setTimeout(() => {
                setPlaceholderText(currentPhrase.substring(0, placeholderText.length - 1));
                if (placeholderText.length === 0) {
                    setIsDeleting(false);
                    setCurrentPhraseIndex((prev) => (prev + 1) % categoryPlaceholders.length);
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
    }, [placeholderText, isDeleting, currentPhraseIndex]);

    useEffect(() => {
        const handleResize = () => {
            if (hoveredIndex === null && activeIndex !== -1 && tabsRef.current) {
                const activeEl = tabsRef.current.children[activeIndex + 1] as HTMLElement; // +1 to skip the pill background element
                if (activeEl) {
                    setPillStyle({
                        left: activeEl.offsetLeft,
                        width: activeEl.offsetWidth,
                        opacity: 1
                    });
                }
            }
        };
        window.addEventListener('resize', handleResize);
        setTimeout(handleResize, 100);
        return () => window.removeEventListener('resize', handleResize);
    }, [hoveredIndex, activeIndex]);

    useEffect(() => {
        if (hoveredIndex === null && activeIndex !== -1 && tabsRef.current) {
            const activeEl = tabsRef.current.children[activeIndex + 1] as HTMLElement; // +1 to skip pill element
            if (activeEl) {
                setPillStyle({
                    left: activeEl.offsetLeft,
                    width: activeEl.offsetWidth,
                    opacity: 1
                });
            }
        } else if (hoveredIndex === null && activeIndex === -1) {
            setPillStyle(prev => ({ ...prev, opacity: 0 }));
        }
    }, [hoveredIndex, activeIndex]);

    const handleMouseEnter = (index: number) => {
        setHoveredIndex(index);
        if (tabsRef.current) {
            const el = tabsRef.current.children[index + 1] as HTMLElement; // +1 to skip pill
            if (el) {
                setPillStyle({
                    left: el.offsetLeft,
                    width: el.offsetWidth,
                    opacity: 1
                });
            }
        }
    };

    const handleMouseLeave = () => {
        setHoveredIndex(null);
    };

    const activeQuery = searchParams.get('q') || '';
    const [query, setQuery] = useState(activeQuery);
    
    // Sync URL when search changes
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());
            if (query) {
                params.set('q', query);
            } else {
                params.delete('q');
            }
            // don't push if it hasn't changed
            if (params.get('q') !== searchParams.get('q')) {
                router.push(`?${params.toString()}`, { scroll: false });
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [query, searchParams, router]);

    // ... inside return ...
    return (
        <div className="w-full flex flex-col gap-6 my-10 z-40 bg-transparent">
            {/* Search Input */}
            <div className="w-full max-w-2xl mx-auto relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <BsSearch className="h-5 w-5 text-white/50 group-focus-within:text-white transition-colors duration-300" />
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={placeholderText}
                    className="w-full py-4 pl-14 pr-12 rounded-2xl bg-white/5 border border-white/10 hover:border-white/30 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/40 transition-all duration-300 shadow-lg shadow-black/20 backdrop-blur-md text-lg"
                />
                {query && (
                    <button 
                        onClick={() => setQuery('')}
                        className="absolute inset-y-0 right-0 pr-5 flex items-center text-white/50 hover:text-white transition-colors duration-300"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Top Pills (Content Type) */}
            <div className="flex items-center justify-start md:justify-center gap-2 overflow-x-auto max-w-full no-scrollbar px-4 pb-2">
                <ul ref={tabsRef} className="flex relative bg-white/5 p-1.5 rounded-full border border-white/10 shadow-inner backdrop-blur-md" onMouseLeave={handleMouseLeave}>
                    {/* Sliding Pill Background */}
                    <div 
                        className="absolute top-1.5 bottom-1.5 bg-[var(--theme-primary)]/40 border border-[var(--theme-primary)] rounded-full transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] shadow-[0_0_15px_var(--theme-primary)]/20 z-0 pointer-events-none"
                        style={{
                            left: pillStyle.left,
                            width: pillStyle.width,
                            opacity: pillStyle.opacity
                        }}
                    />
                    
                    {tabs.map((tab, index) => (
                        <li 
                            key={tab}
                            onMouseEnter={() => handleMouseEnter(index)}
                            onClick={() => router.push(`?tab=${tab}`, { scroll: false })}
                            className="relative z-10"
                        >
                            <button
                                className={`px-6 py-2.5 rounded-full font-medium text-sm transition-colors duration-300 whitespace-nowrap ${
                                    activeTab === tab 
                                    ? 'text-white' 
                                    : 'text-white/60 hover:text-white'
                                }`}
                            >
                                {tab}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Bottom Tags (Mood) */}
            <div className="flex items-center justify-start md:justify-center gap-3 overflow-x-auto max-w-full no-scrollbar px-4">
                {moodTags.map(tag => {
                    const isDisabled = availableMoods ? !availableMoods.includes(tag.label) : false;
                    return (
                        <button
                            key={tag.label}
                            onClick={() => handleMoodClick(tag.label)}
                            disabled={isDisabled}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 border whitespace-nowrap backdrop-blur-md ${
                                activeMood === tag.label 
                                ? 'bg-[var(--theme-primary)]/20 border-[var(--theme-primary)] text-white shadow-[0_0_15px_var(--theme-primary)]/20' 
                                : isDisabled 
                                    ? 'bg-white/5 border-white/5 text-white/30 cursor-not-allowed'
                                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20 hover:text-white'
                            }`}
                        >
                            <span className={isDisabled ? 'opacity-50' : ''}>{tag.emoji}</span>
                            <span>{tag.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
