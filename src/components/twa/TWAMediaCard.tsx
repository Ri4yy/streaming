"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { useUserMedia } from '@/hooks/useUserMedia';

interface TWAMediaCardProps {
    id: string | number;
    name: string;
    year: string | number;
    genre: string;
    rate: string | number;
    img: string;
    type?: 'movie' | 'tv' | 'anime' | 'game' | 'book';
}

export default function TWAMediaCard({ id, name, year, genre, rate, img, type = "movie" }: TWAMediaCardProps) {
    const { getMedia, toggleFavorite } = useUserMedia();
    const [imgSrc, setImgSrc] = useState(img || (type === 'game' ? `/api/steam/image/${id}` : '/img/poster/spider.jpg'));
    const currentMedia = getMedia(type, String(id));
    const isFavorite = currentMedia?.is_favorite || false;

    const handleToggleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        toggleFavorite(type, String(id), { title: name, cover_url: img });
    };

    useEffect(() => {
        setImgSrc(img || (type === 'game' ? `/api/steam/image/${id}` : '/img/poster/spider.jpg'));
    }, [img, type, id]);

    return (  
        <div className="flex flex-col gap-2 group h-full bg-white/5 p-2 rounded-xl border border-white/10">
            <div className="w-full relative rounded-lg aspect-[2/3] overflow-hidden">
                {(rate !== 0 && rate !== '0' && rate !== '0.0' && rate !== 'N/A') && (
                    <div className='absolute top-2 right-2 text-white rounded-md backdrop-blur-md bg-black/50 py-0.5 px-1.5 z-20 text-xs font-bold'>
                        {typeof rate === 'number' ? rate.toFixed(1) : rate}
                    </div>
                )}
                
                <button 
                    onClick={handleToggleFavorite}
                    className='absolute bottom-2 right-2 rounded-full backdrop-blur-md bg-black/60 p-2 z-20 active:scale-95 transition-transform'
                >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 stroke-red-500 scale-110' : 'stroke-white'}`} />
                </button>

                <Image 
                    src={imgSrc} 
                    alt={name}
                    fill
                    className="object-cover rounded-lg z-10" 
                    onError={() => {
                        const defaultFallback = '/img/poster/spider.jpg';
                        if (type === 'game' && imgSrc !== `/api/steam/image/${id}` && imgSrc !== defaultFallback) {
                            setImgSrc(`/api/steam/image/${id}`);
                        } else if (imgSrc !== defaultFallback) {
                            setImgSrc(defaultFallback);
                        }
                    }}
                />
            </div>
            <div className='text-sm font-semibold truncate mt-1'>{name}</div>
            <div className='flex gap-x-2 items-center text-xs text-gray-400 truncate'>
                <span>{year}</span>
                <div className='h-1 w-1 rounded-full bg-gray-600'></div>
                <span className="truncate">{genre}</span>
            </div>
        </div>
    );
}
