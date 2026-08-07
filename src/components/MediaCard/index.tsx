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
            <div className={`w-full relative rounded-lg overflow-hidden ${size === 'small' ? 'h-[250px]' : 'h-[400px]'}`}>
                {(rate !== 0 && rate !== '0' && rate !== '0.0' && rate !== 'N/A') && (
                    <div className='absolute top-3 right-3 text-white rounded-md backdrop-blur-md bg-black/50 py-1 px-2.5 z-20'>
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
                            unoptimized
                            className='absolute inset-0 object-cover blur-xl opacity-60 scale-150 z-0' 
                        />
                    )}
                    <Image 
                        src={imgSrc} 
                        alt={name}
                        fill
                        unoptimized
                        className={`flex rounded-lg w-full overflow-hidden transition-all duration-700 z-10 ${size === 'small' ? 'h-[250px]' : 'h-[400px]'} ${isHorizontal ? 'object-contain scale-100 group-hover:scale-105' : 'object-cover group-hover:scale-105'}`} 
                        onLoad={(e) => {
                            const target = e.target as HTMLImageElement;
                            if (target.naturalWidth > target.naturalHeight) {
                                setIsHorizontal(true);
                            }
                        }}
                        onError={() => {
                            const steamFallback = `/api/steam/image/${id}`;
                            const defaultFallback = fallbackImg || '/img/poster/spider.jpg';
                            
                            if (type === 'game' && imgSrc !== steamFallback && imgSrc !== defaultFallback) {
                                setImgSrc(steamFallback);
                            } else if (imgSrc !== defaultFallback) {
                                setImgSrc(defaultFallback);
                            }
                        }}
                    />
                </Link>
            </div>
            <Link href={href} className={`${size === 'small' ? 'text-base' : 'text-xl'} hover:text-[#ff1414] transition-colors duration-300 line-clamp-1`}>{name}</Link>
            <ul className='flex gap-x-3 items-center'>
                <li className='text-[#BFBFBF] text-sm truncate'>{year}</li>
                <li><div className='h-1 w-1 rounded-full bg-[#323234]'></div></li>
                <li className='text-[#BFBFBF] text-sm truncate'>{genre}</li>
            </ul>
        </div>
    );
}
