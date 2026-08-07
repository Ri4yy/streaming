"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface GamePosterProps {
    appId: number | string;
    name: string;
    initialSrc: string;
    fallbackSrc?: string;
}

export default function GamePoster({ appId, name, initialSrc, fallbackSrc }: GamePosterProps) {
    const [imgSrc, setImgSrc] = useState(initialSrc);
    const [isHorizontal, setIsHorizontal] = useState(false);

    useEffect(() => {
        setImgSrc(initialSrc);
    }, [initialSrc]);

    return (
        <div className="relative w-full h-[600px] rounded-xl overflow-hidden border border-white/10">
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
                className={`w-full h-full z-10 ${isHorizontal ? 'object-contain' : 'object-cover'}`} 
                onLoad={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.naturalWidth > target.naturalHeight) {
                        setIsHorizontal(true);
                    }
                }}
                onError={() => {
                if (fallbackSrc && imgSrc !== fallbackSrc) {
                    setImgSrc(fallbackSrc);
                } else if (!imgSrc.includes('header.jpg')) {
                    setImgSrc(`https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${appId}/header.jpg`);
                }
            }}
        />
        </div>
    );
}
