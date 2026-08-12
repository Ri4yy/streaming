"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Film, Tv, Gamepad2, PlaySquare, Check } from 'lucide-react';
import { checkIsCollectionViewed } from '@/utils/viewedCollections';

export interface CollectionProps {
    id: string;
    slug?: string;
    title: string;
    description: string;
    image: string;
    banner_image?: string;
    count: number;
    type: 'movies' | 'series' | 'anime' | 'games' | 'mixed';
    moods?: string[];
}

const typeIcons = {
    movies: <Film className="w-3 h-3" />,
    series: <Tv className="w-3 h-3" />,
    anime: <PlaySquare className="w-3 h-3" />,
    games: <Gamepad2 className="w-3 h-3" />,
    mixed: <Film className="w-3 h-3" />, // default fallback
};

const typeLabels = {
    movies: 'Фильмы',
    series: 'Сериалы',
    anime: 'Аниме',
    games: 'Игры',
    mixed: 'Микс',
};

export default function CollectionCard({ collection }: { collection: CollectionProps }) {
    const [isViewed, setIsViewed] = useState(false);

    useEffect(() => {
        const updateViewedStatus = () => {
            setIsViewed(checkIsCollectionViewed(collection.id, collection.slug));
        };
        updateViewedStatus();
        window.addEventListener('viewedCollectionsUpdated', updateViewedStatus);
        return () => window.removeEventListener('viewedCollectionsUpdated', updateViewedStatus);
    }, [collection.id, collection.slug]);

    return (
        <Link href={`/collections/${collection.type}/${collection.slug || collection.id}`} className="group block relative w-full h-full">
            <div className="relative w-full aspect-[3/4] md:aspect-[4/5] rounded-2xl overflow-hidden bg-white/5 border border-white/10 shadow-lg shadow-black/20 backdrop-blur-md transition-all duration-300 group-hover:shadow-[0_0_20px_var(--theme-primary)] group-hover:border-[var(--theme-primary)]/50 group-hover:-translate-y-1">
                
                {/* Cover Image */}
                <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-80"
                    style={{ backgroundImage: `url(${collection.image})` }}
                />
                
                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--theme-bg)] via-[var(--theme-bg)]/60 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute inset-0 bg-[var(--theme-primary)]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay" />

                {/* Content */}
                <div className="absolute inset-0 p-5 flex flex-col justify-between z-10">
                    {/* Top Badges */}
                    <div className="flex justify-between items-start w-full gap-1.5 flex-wrap max-w-full">
                        <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md border border-white/10 px-2 py-1 sm:px-2.5 rounded-lg text-white/90 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider shadow-sm whitespace-nowrap shrink-0">
                            {typeIcons[collection.type]}
                            {typeLabels[collection.type]}
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap justify-end shrink-0 max-w-full">
                            {isViewed && (
                                <div className="flex items-center gap-1 bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 px-2 py-1 rounded-lg text-[10px] sm:text-[11px] font-bold backdrop-blur-md shadow-sm shrink-0 whitespace-nowrap">
                                    <Check className="w-3 h-3 stroke-[3]" />
                                    <span>Просмотрено</span>
                                </div>
                            )}
                            <div className="bg-[var(--theme-primary)]/20 backdrop-blur-md border border-[var(--theme-primary)]/50 text-white px-2 py-1 rounded-lg text-[10px] sm:text-[11px] font-bold shadow-sm whitespace-nowrap text-center shrink-0">
                                {collection.count} тайтлов
                            </div>
                        </div>
                    </div>

                    {/* Bottom Info */}
                    <div className="flex flex-col transform transition-transform duration-300 group-hover:-translate-y-1">
                        <h3 className="text-sm sm:text-base md:text-lg font-bold text-white leading-tight drop-shadow-md group-hover:text-[var(--theme-primary)] transition-colors line-clamp-3">
                            {collection.title}
                        </h3>
                        <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-300">
                            <div className="overflow-hidden">
                                <p className="text-sm text-white/60 line-clamp-2 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 mt-2">
                                    {collection.description}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
