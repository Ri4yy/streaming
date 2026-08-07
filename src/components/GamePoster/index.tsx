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
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setImgSrc(initialSrc);
    }, [initialSrc]);

    return (
        <div className="relative w-full h-[600px] rounded-xl overflow-hidden border border-white/10 bg-white/5">
            {!isLoaded && (
                <div className="absolute inset-0 bg-white/10 animate-pulse z-0"></div>
            )}
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
                className={`w-full h-full z-10 transition-opacity duration-700 ${isHorizontal ? 'object-contain' : 'object-cover'} ${isLoaded ? 'opacity-100' : 'opacity-0'}`} 
                onLoad={(e) => {
                    setIsLoaded(true);
                    const target = e.target as HTMLImageElement;
                    if (target.naturalWidth > target.naturalHeight) {
                        setIsHorizontal(true);
                    }
                }}
                onError={() => {
                    if (fallbackSrc && imgSrc !== fallbackSrc) {
                        setImgSrc(fallbackSrc);
                        setIsHorizontal(true);
                    } else if (!imgSrc.includes('header.jpg')) {
                        setImgSrc(`https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${appId}/header.jpg`);
                        setIsHorizontal(true);
                    }
                }}
        />
        </div>
    );
}
