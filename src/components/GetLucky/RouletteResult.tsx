import React from 'react';
import { TMDBMedia, tmdbApi } from '@/services/tmdb';
import Image from 'next/image';
import Link from 'next/link';

interface Props {
    item: TMDBMedia;
    onSpinAgain: () => void;
    isSpinning: boolean;
}

export default function RouletteResult({ item, onSpinAgain, isSpinning }: Props) {
    const title = item.title || item.name || '';
    const date = item.release_date || item.first_air_date || '';
    const year = date ? date.split('-')[0] : '';
    
    // We only have genre IDs, not names, but let's assume we can map them if we have a utility, 
    // or just show a fallback if we don't. To keep it simple, we'll try to map them or show default text.
    // Assuming getGenreName doesn't exist yet, I'll provide a local mapping for common ones, or we can omit.
    // Actually, we can just omit or mock the genres if we don't have the dictionary, but let's try to map some common ones.
    const COMMON_GENRES: Record<number, string> = {
        28: 'боевик', 12: 'приключения', 16: 'мультфильм', 35: 'комедия', 
        80: 'криминал', 99: 'документальный', 18: 'драма', 10751: 'семейный', 
        14: 'фэнтези', 36: 'история', 27: 'ужасы', 10402: 'музыка', 
        9648: 'детектив', 10749: 'мелодрама', 878: 'фантастика', 10770: 'ТВ фильм', 
        53: 'триллер', 10752: 'военный', 37: 'вестерн',
        10759: 'боевик и приключения', 10762: 'детский', 10765: 'научная фантастика и фэнтези',
        10766: 'мыльная опера', 10767: 'ток-шоу', 10768: 'война и политика'
    };

    const genreNames = item.genre_ids?.map(id => COMMON_GENRES[id]).filter(Boolean).slice(0, 3).join(' • ');
    
    // Determine the route based on item type
    // If it's a TV show with animation genre, it's anime
    const isAnime = item.media_type === 'tv' && item.genre_ids?.includes(16);
    const mediaType = isAnime ? 'anime' : (item.media_type === 'tv' || item.first_air_date ? 'series' : 'movies');
    const itemUrl = `/${mediaType}/${item.id}`;

    return (
        <div className={`mt-8 bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row gap-6 transition-all duration-500 ${isSpinning ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>
            <div className="shrink-0 w-32 sm:w-40 rounded-xl overflow-hidden shadow-xl">
                <Image
                    src={tmdbApi.getImageUrl(item.poster_path)}
                    alt={title}
                    width={160}
                    height={240}
                    className="w-full aspect-[2/3] object-cover"
                />
            </div>
            
            <div className="flex flex-col justify-center flex-grow">
                <h2 className="text-2xl font-bold text-white mb-2">
                    {title} <span className="text-gray-400 font-normal">{year ? `(${year})` : ''}</span>
                </h2>
                
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-[#434b5c] px-2 py-0.5 rounded-full text-xs font-bold text-white">
                        TMDB {item.vote_average?.toFixed(1) || '0.0'}
                    </div>
                </div>
                
                <div className="text-gray-400 text-sm mb-1">
                    {genreNames || 'Жанр не указан'}
                </div>
                <div className="text-gray-500 text-sm mb-6">
                    {item.origin_country?.[0] || 'Страна не указана'}
                </div>
                
                <div className="flex flex-wrap gap-3 mt-auto">
                    <Link 
                        href={itemUrl}
                        className="px-6 py-2.5 rounded-xl bg-theme-main hover:bg-theme-main/80 text-white font-medium transition-colors"
                    >
                        Смотреть
                    </Link>
                    <button 
                        onClick={onSpinAgain}
                        className="px-6 py-2.5 rounded-xl bg-[#262c36] hover:bg-[#343b47] text-white font-medium transition-colors"
                    >
                        Крутить ещё
                    </button>
                </div>
            </div>
        </div>
    );
}
