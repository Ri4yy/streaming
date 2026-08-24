"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { useUserMedia } from '@/hooks/useUserMedia';

interface MediaCardProps {
    id: string | number;
    name: string;
    year: string | number;
    genre: string;
    rate: string | number;
    img: string;
    fallbackImg?: string;
    type?: 'movie' | 'tv' | 'anime' | 'game' | 'book';
    href?: string;
    size?: 'normal' | 'small';
}

export default function MediaCard({ id, name, year, genre, rate, img, fallbackImg, type = "movie", href = "/movies/1", size = "normal" }: MediaCardProps) {
    const { getMedia, toggleFavorite } = useUserMedia();
    const [imgSrc, setImgSrc] = useState(img || (type === 'game' ? `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${id}/header.jpg` : '/img/poster/spider.jpg'));
    const [isHorizontal, setIsHorizontal] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const currentMedia = getMedia(type, String(id));
    const isFavorite = currentMedia?.is_favorite || false;

    const handleToggleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        toggleFavorite(type, String(id), { title: name, cover_url: img });
    };

    useEffect(() => {
        setImgSrc(img || (type === 'game' ? `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${id}/header.jpg` : '/img/poster/spider.jpg'));
    }, [img, type, id]);

    return (
        <div className="flex flex-col gap-4 group h-full">
            <div className={`w-full relative rounded-lg overflow-hidden bg-white/5 aspect-[9/16]`}>
                {/* Image loading skeleton */}
                {!isLoaded && (
                    <div className="absolute inset-0 bg-white/10 animate-pulse z-0"></div>
                )}
                
                {(rate !== 0 && rate !== '0' && rate !== '0.0' && rate !== 'N/A') && (
                    <div className='absolute top-3 right-3 text-white font-bold rounded-md bg-[#F6C700]/40 backdrop-blur-md border border-[#F6C700]/50 shadow-[0_0_15px_rgba(246,199,0,0.2)] py-1 px-2.5 z-20'>
                        {typeof rate === 'number' ? rate.toFixed(1) : rate}
                    </div>
                )}

                <button
                    onClick={handleToggleFavorite}
                    className='absolute top-3 left-3 rounded-full backdrop-blur-md bg-black/50 p-2 z-20 hover:bg-white/20 transition-all duration-300'
                >
                    <Heart className={`w-5 h-5 transition-all duration-300 ${isFavorite ? 'fill-red-500 stroke-red-500 scale-110' : 'stroke-white'}`} />
                </button>

                <Link href={href} className="block w-full h-full relative">
                    {isHorizontal && (
                        <Image
                            src={imgSrc}
                            alt={`${name} background`}
                            fill
                            className='absolute inset-0 object-cover blur-xl opacity-60 scale-150 z-0'
                        />
                    )}
                    <Image
                        src={imgSrc}
                        alt={name}
                        fill
                        className={`flex rounded-lg w-full h-full overflow-hidden transition-all duration-700 z-10 aspect-[9/16] ${isHorizontal ? 'object-contain scale-100 group-hover:scale-105' : 'object-cover group-hover:scale-105'} ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                        onLoad={(e) => {
                            setIsLoaded(true);
                            const target = e.target as HTMLImageElement;
                            if (target.naturalWidth > target.naturalHeight) {
                                setIsHorizontal(true);
                            }
                        }}
                        onError={() => {
                            const steamFallback = type === 'game' ? (fallbackImg || `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${id}/header.jpg`) : null;
                            const defaultFallback = fallbackImg || '/img/poster/spider.jpg';

                            if (type === 'game' && steamFallback && imgSrc !== steamFallback && imgSrc !== defaultFallback) {
                                setImgSrc(steamFallback);
                                setIsHorizontal(true);
                            } else if (imgSrc !== defaultFallback) {
                                setImgSrc(defaultFallback);
                            }
                        }}
                    />
                </Link>
            </div>
            <Link href={href} className={`text-base hover:text-theme-main transition-colors duration-300 line-clamp-1`}>{name}</Link>
            <ul className='flex gap-x-3 items-center'>
                <li className='text-[#BFBFBF] text-sm truncate'>{year}</li>
                <li><div className='h-1 w-1 rounded-full bg-[#323234]'></div></li>
                <li className='text-[#BFBFBF] text-sm truncate'>{genre}</li>
            </ul>
        </div>
    );
}
