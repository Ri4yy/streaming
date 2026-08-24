"use client";

import React from 'react';

interface VideoPlayerProps {
    tmdbId: number;
    imdbId?: string | null;
    type: 'movie' | 'tv';
}

export default function VideoPlayer({ tmdbId, imdbId, type }: VideoPlayerProps) {
    const publisherId = "678901809";
    const mediaType = imdbId ? 'imdb' : (type === 'tv' ? 'series' : 'movie');
    const mediaId = imdbId || tmdbId.toString();

    // Мы используем dangerouslySetInnerHTML, чтобы React не конфликтовал с внешним скриптом, 
    // который модифицирует DOM (заменяет <ins> на <iframe>).
    const insHtml = `<ins data-publisher-id="${publisherId}" data-type="${mediaType}" data-id="${mediaId}" data-design="2" data-color1="#333333" data-color2="#d4d4d4" data-color3="#999999" data-color4="#CCCCCC" data-color5="#FFFFFF" data-height="100%" data-width="100%"></ins>`;

    return (
        <div 
            className="w-full aspect-video bg-black/40 rounded-xl overflow-hidden border border-white/10 shadow-lg flex items-center justify-center relative"
            dangerouslySetInnerHTML={{ __html: insHtml }}
        />
    );
}
