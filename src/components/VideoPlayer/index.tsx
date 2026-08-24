"use client";

import React, { useState } from 'react';
import { Popcorn, Maximize, Minimize } from 'lucide-react';

interface VideoPlayerProps {
    tmdbId: number;
    imdbId?: string | null;
    type: 'movie' | 'tv';
}

export default function VideoPlayer({ tmdbId, imdbId, type }: VideoPlayerProps) {
    const [isCinemaMode, setIsCinemaMode] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const publisherId = "678901809";
    const mediaType = imdbId ? 'imdb' : (type === 'tv' ? 'series' : 'movie');
    const mediaId = imdbId || tmdbId.toString();

    // Мы используем dangerouslySetInnerHTML, чтобы React не конфликтовал с внешним скриптом, 
    // который модифицирует DOM (заменяет <ins> на <iframe>).
    const insHtml = `<ins data-publisher-id="${publisherId}" data-type="${mediaType}" data-id="${mediaId}" data-design="2" data-color1="#333333" data-color2="#d4d4d4" data-color3="#999999" data-color4="#CCCCCC" data-color5="#FFFFFF" data-height="100%" data-width="100%"></ins>`;

    return (
        <>
            {isCinemaMode && (
                <div 
                    className="fixed inset-0 bg-black/90 z-40 transition-opacity duration-300"
                    onClick={() => setIsCinemaMode(false)}
                />
            )}
            
            <div className={`relative transition-all duration-500 ease-in-out ${isCinemaMode ? 'z-50' : 'z-10'} ${isExpanded ? 'w-full max-w-full' : 'w-full max-w-[1000px] mx-auto'}`}>
                <div 
                    className="w-full aspect-video bg-black/40 rounded-xl overflow-hidden border border-white/10 shadow-lg relative transition-all duration-300"
                    dangerouslySetInnerHTML={{ __html: insHtml }}
                />
                
                <div className="flex items-center gap-3 mt-4">
                    <button 
                        onClick={() => setIsCinemaMode(!isCinemaMode)}
                        className={`p-3.5 rounded-2xl transition-all duration-300 flex items-center justify-center border border-white/5 ${isCinemaMode ? 'bg-[#CAE962] text-black' : 'bg-[#262831] text-white hover:bg-[#343640]'}`}
                        title="Режим кинотеатра"
                    >
                        <Popcorn className="w-5 h-5" />
                    </button>
                    <button 
                        onClick={() => setIsExpanded(!isExpanded)}
                        className={`p-3.5 rounded-2xl transition-all duration-300 flex items-center justify-center border border-white/5 ${isExpanded ? 'bg-[#CAE962] text-black' : 'bg-[#262831] text-white hover:bg-[#343640]'}`}
                        title={isExpanded ? "Свернуть" : "Развернуть"}
                    >
                        {isExpanded ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                    </button>
                </div>
            </div>
        </>
    );
}
