"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { useUserMedia } from '@/hooks/useUserMedia';
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

interface TWAMediaCardProps {
    id: string | number;
    name: string;
    year: string | number;
    genre: string;
    rate: string | number;
    img: string;
    type?: 'movie' | 'tv' | 'anime' | 'game' | 'book';
}

const TILT_MAX = 9;
const TILT_SPRING = { stiffness: 300, damping: 28 } as const;
const GLOW_SPRING = { stiffness: 180, damping: 22 } as const;

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

    const cardRef = useRef<HTMLDivElement>(null);
    const normX = useMotionValue(0.5);
    const normY = useMotionValue(0.5);

    const rawRotateX = useTransform(normY, [0, 1], [TILT_MAX, -TILT_MAX]);
    const rawRotateY = useTransform(normX, [0, 1], [-TILT_MAX, TILT_MAX]);

    const rotateX = useSpring(rawRotateX, TILT_SPRING);
    const rotateY = useSpring(rawRotateY, TILT_SPRING);
    const glowOpacity = useSpring(0, GLOW_SPRING);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const el = cardRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        normX.set((e.clientX - rect.left) / rect.width);
        normY.set((e.clientY - rect.top) / rect.height);
    };

    const handleMouseEnter = () => {
        glowOpacity.set(1);
    };

    const handleMouseLeave = () => {
        normX.set(0.5);
        normY.set(0.5);
        glowOpacity.set(0);
    };

    // Extract primary color from genre or type if needed, here we just use a generic color tint
    const glowColor = '#a78bfa';

    return (  
        <motion.div 
            className="group relative flex flex-col gap-2 h-full bg-white/5 p-2 rounded-xl border border-white/10 overflow-hidden cursor-pointer"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
            ref={cardRef}
            style={{
                rotateX,
                rotateY,
                transformPerspective: 900,
            }}
            transition={{ duration: 0.18, ease: "easeOut" }}
        >
            {/* Static accent tint */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-xl"
                style={{
                    background: `radial-gradient(ellipse at 50% 0%, ${glowColor}10, transparent 65%)`,
                }}
            />

            {/* Hover glow layer */}
            <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-xl"
                style={{
                    opacity: glowOpacity,
                    background: `radial-gradient(ellipse at 50% 0%, ${glowColor}25, transparent 65%)`,
                }}
            />

            {/* Shimmer sweep */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 w-[55%] -translate-x-full -skew-x-12 bg-linear-to-r from-transparent via-white/5 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[280%]"
            />

            <div className="w-full relative rounded-lg aspect-[2/3] overflow-hidden z-10">
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
                    className="object-cover rounded-lg" 
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
            <div className='text-sm font-semibold truncate mt-1 z-10'>{name}</div>
            <div className='flex gap-x-2 items-center text-xs text-gray-400 truncate z-10'>
                <span>{year}</span>
                <div className='h-1 w-1 rounded-full bg-gray-600'></div>
                <span className="truncate">{genre}</span>
            </div>

            {/* Accent bottom line */}
            <div
                aria-hidden="true"
                className="absolute bottom-0 left-0 h-[2px] w-0 rounded-full transition-all duration-500 group-hover:w-full"
                style={{
                    background: `linear-gradient(to right, ${glowColor}80, transparent)`,
                }}
            />
        </motion.div>
    );
}
