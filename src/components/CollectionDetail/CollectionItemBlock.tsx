"use client";

import React from 'react';
import Link from 'next/link';
import { Play, Star, Clock, Film } from 'lucide-react';
import dynamic from 'next/dynamic';

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false }) as any;

export interface CollectionItemProps {
    id: string;
    title: string;
    year: string;
    image: string;
    genres: string[];
    duration: string;
    rating: number;
    description: string;
    type: 'movies' | 'series' | 'anime' | 'games';
    linkId: string;
    trailerUrl?: string;
}

export default function CollectionItemBlock({ item, index }: { item: CollectionItemProps; index: number }) {
    return (
        <article id={`item-${item.id}`} className="w-full mb-16 scroll-mt-24">
            {/* H2 Title */}
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6 flex items-baseline gap-3">
                <span className="text-[var(--theme-primary)] text-4xl md:text-5xl">{index}.</span>
                <span>
                    {item.title} <span className="text-white/40 text-2xl font-semibold">({item.year})</span>
                </span>
            </h2>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Col: Media (or Trailer) */}
                <div className="lg:col-span-7">
                    {item.trailerUrl ? (
                        <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black">
                            <ReactPlayer
                                url={item.trailerUrl}
                                width="100%"
                                height="100%"
                                controls={true}
                                light={item.image} // uses the image as placeholder, click to play
                                playIcon={
                                    <div className="w-16 h-16 rounded-full bg-[var(--theme-primary)]/90 backdrop-blur-md flex items-center justify-center shadow-[0_0_30px_var(--theme-primary)] transition-transform hover:scale-110 cursor-pointer">
                                        <Play className="w-6 h-6 text-white fill-current ml-1" />
                                    </div>
                                }
                            />
                        </div>
                    ) : (
                        <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10 group cursor-pointer">
                            <div 
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                style={{ backgroundImage: `url(${item.image})` }}
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
                        </div>
                    )}
                </div>

                {/* Right Col: Info */}
                <div className="lg:col-span-5 flex flex-col justify-center">
                    
                    {/* Metadata Badges */}
                    <div className="flex flex-wrap gap-3 mb-6">
                        <div className="flex items-center gap-1.5 bg-[#f5c518]/10 border border-[#f5c518]/30 text-[#f5c518] px-2.5 py-1 rounded-lg text-sm font-bold backdrop-blur-md">
                            <Star className="w-4 h-4 fill-current" />
                            {item.rating.toFixed(1)}
                        </div>
                        <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 text-white/80 px-2.5 py-1 rounded-lg text-sm font-medium backdrop-blur-md">
                            <Film className="w-4 h-4" />
                            {item.genres.slice(0, 2).join(', ')}
                        </div>
                        <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 text-white/80 px-2.5 py-1 rounded-lg text-sm font-medium backdrop-blur-md">
                            <Clock className="w-4 h-4" />
                            {item.duration}
                        </div>
                    </div>

                    {/* Review / Description Text */}
                    <div className="text-white/70 text-lg leading-relaxed mb-8">
                        {item.description}
                    </div>

                    {/* CTA Button */}
                    <Link 
                        href={`/${item.type}/${item.linkId}`} 
                        className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-theme-gradient hover:opacity-90 text-white font-bold text-lg px-8 py-4 rounded-xl transition-all shadow-md hover:shadow-lg hover:shadow-[var(--theme-primary)]/40"
                    >
                        <Play className="w-5 h-5 fill-current" />
                        Смотреть
                    </Link>

                </div>
            </div>
            
            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mt-16" />
        </article>
    );
}
