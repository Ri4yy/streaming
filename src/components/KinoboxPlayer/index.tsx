"use client";

import React, { useEffect, useRef } from 'react';

interface KinoboxPlayerProps {
    tmdbId: string | number;
}

export default function KinoboxPlayer({ tmdbId }: KinoboxPlayerProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const scriptId = 'kinobox-script';
        
        const initPlayer = () => {
            if (window.Kinobox && containerRef.current) {
                containerRef.current.innerHTML = '';
                new window.Kinobox(containerRef.current, {
                    search: {
                        tmdb: tmdbId
                    },
                    menu: {
                        enable: true,
                        default: 'menu_list' 
                    }
                }).init();
            }
        };

        if (!document.getElementById(scriptId)) {
            const script = document.createElement('script');
            script.id = scriptId;
            script.src = 'https://kinobox.tv/kinobox.min.js';
            script.async = true;
            script.onload = initPlayer;
            document.body.appendChild(script);
        } else {
            initPlayer();
        }

        return () => {
            if (containerRef.current) {
                containerRef.current.innerHTML = '';
            }
        };
    }, [tmdbId]);

    return (
        <section className="container mx-auto px-5 lg:px-0">
            <div 
                ref={containerRef} 
                className="kinobox_player w-full xl:w-4/5 mx-auto min-h-[400px] md:min-h-[600px] rounded-2xl overflow-hidden bg-[#1E1E20] border border-white/10 shadow-2xl"
            >
                {/* Fallback while loading script/player */}
                <div className="w-full h-[400px] md:h-[600px] flex items-center justify-center text-white/50 animate-pulse">
                    Загрузка плеера...
                </div>
            </div>
        </section>
    );
}

declare global {
    interface Window {
        Kinobox: any;
    }
}
