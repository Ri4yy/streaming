"use client";

import React from 'react';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { useUserMedia } from '@/hooks/useUserMedia';

interface DetailActionsProps {
    id: string | number;
    type: 'movie' | 'tv' | 'anime' | 'game' | 'book';
    title: string;
    coverUrl?: string;
}

export default function DetailActions({ id, type, title, coverUrl }: DetailActionsProps) {
    const { getMedia, toggleFavorite, updateMedia } = useUserMedia();
    const media = getMedia(type, String(id));
    const isFavorite = media?.is_favorite || false;
    const status = media?.status || 'planned';

    const handleFavorite = () => {
        toggleFavorite(type, String(id), { title, cover_url: coverUrl });
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        updateMedia({
            media_type: type,
            media_id: String(id),
            title,
            cover_url: coverUrl,
            status: e.target.value as any
        });
    };

    return (
        <div className="flex flex-col gap-3 mt-4 absolute bottom-5 left-1/2 -translate-x-1/2 w-[90%]">
            <select 
                value={status}
                onChange={handleStatusChange}
                className="w-full backdrop-blur-md bg-black/60 text-white py-2 px-3 rounded-lg border border-white/20 outline-none"
            >
                <option value="planned">В планах</option>
                <option value="watching">Смотрю / Читаю / Играю</option>
                <option value="completed">Просмотрено</option>
                <option value="dropped">Брошено</option>
            </select>
            
            <button 
                onClick={handleFavorite}
                className="group hover:scale-105 transition-all duration-500 overflow-hidden flex justify-center items-center backdrop-blur-md bg-black/60 py-2.5 w-full rounded-lg cursor-pointer"
            >
                {isFavorite ? (
                    <AiFillHeart className='w-5 h-5 fill-red-500 transition-all duration-500' />
                ) : (
                    <AiOutlineHeart className='w-5 h-5 group-hover:fill-black transition-all duration-500' />
                )}
                <span className={`whitespace-nowrap pl-3 transition-all duration-500 ${isFavorite ? 'text-red-500' : 'group-hover:text-black'}`}>
                    {isFavorite ? 'В Избранном' : 'Добавить в Избранное'}
                </span>
                {!isFavorite && <div className="-z-10 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-0 h-0 group-hover:w-[150%] rounded-full group-hover:h-[1000%] bg-white transition-all duration-500"></div>}
            </button>
        </div>
    );
}
