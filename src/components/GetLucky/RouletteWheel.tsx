'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import { TMDBMedia, tmdbApi } from '@/services/tmdb';
import Image from 'next/image';

interface Props {
    items: TMDBMedia[];
    isSpinning: boolean;
    onComplete: (winner: TMDBMedia) => void;
}

const ITEM_WIDTH = 140; // width of each poster
const ITEM_GAP = 16; // gap between posters
const TOTAL_ITEM_WIDTH = ITEM_WIDTH + ITEM_GAP;
const WINNER_INDEX = 50; // Increased index so the wheel spins much faster to reach it

export default function RouletteWheel({ items, isSpinning, onComplete }: Props) {
    const controls = useAnimationControls();
    const containerRef = useRef<HTMLDivElement>(null);
    const [displayItems, setDisplayItems] = useState<TMDBMedia[]>([]);
    const [hasSpun, setHasSpun] = useState(false);
    
    // We need enough items to spin through. If we don't have enough, duplicate them.
    useEffect(() => {
        if (!items || items.length === 0) return;
        
        let newItems = [...items];
        while (newItems.length < 80) {
            newItems = [...newItems, ...items];
        }
        
        // Ensure unique keys by mapping
        setDisplayItems(newItems.slice(0, 80));
    }, [items]);

    useEffect(() => {
        if (isSpinning && displayItems.length >= WINNER_INDEX) {
            // Calculate distance to move
            // We want the WINNER_INDEX item to land exactly in the center of the container
            const containerWidth = containerRef.current?.offsetWidth || 800;
            const centerOffset = containerWidth / 2;
            
            // The exact position of the winner item center from the start of the strip
            const winnerItemCenter = (WINNER_INDEX * TOTAL_ITEM_WIDTH) + (ITEM_WIDTH / 2);
            
            // The distance to translate X
            const distanceToMove = winnerItemCenter - centerOffset;
            
            // Reset position instantly
            controls.set({ x: 0 });
            setHasSpun(true);
            
            // Animate to the winner
            controls.start({
                x: -distanceToMove,
                transition: {
                    duration: 10,
                    ease: [0.1, 0.0, 0.2, 1], // Start fast, slow down gradually
                }
            }).then(() => {
                onComplete(displayItems[WINNER_INDEX]);
            });
        }
    }, [isSpinning, displayItems, controls, onComplete]);

    return (
        <div className="w-full relative py-6" ref={containerRef}>
            {/* Center Pointer */}
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1 z-20 flex flex-col justify-between items-center pointer-events-none">
                <div className="w-4 h-4 border-l-8 border-r-8 border-t-8 border-transparent border-t-yellow-400"></div>
                <div className="w-0.5 h-full bg-yellow-400/50"></div>
                <div className="w-4 h-4 border-l-8 border-r-8 border-b-8 border-transparent border-b-yellow-400"></div>
            </div>

            {/* Fading Edges */}
            <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-[#0b1016] to-transparent z-10 pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-[#0b1016] to-transparent z-10 pointer-events-none"></div>

            {/* Track */}
            <div className="overflow-hidden w-full py-4 -my-4">
                <motion.div 
                    className="flex gap-4 items-center"
                    animate={controls}
                    initial={{ x: 0 }}
                >
                    {displayItems.length > 0 ? (
                        displayItems.map((item, idx) => {
                            // Dim non-winning items slightly after spin completes
                            const isWinner = !isSpinning && idx === WINNER_INDEX;
                            const isDimmed = !isSpinning && idx !== WINNER_INDEX && hasSpun;
                            
                            return (
                                <div 
                                    key={`${item.id}-${idx}`} 
                                    className={`shrink-0 transition-opacity duration-500 ${isDimmed ? 'opacity-30' : 'opacity-100'}`}
                                    style={{ width: ITEM_WIDTH }}
                                >
                                    <div className={`relative rounded-xl overflow-hidden transition-all duration-300 ${isWinner ? 'ring-2 ring-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.3)] scale-105 z-10' : ''}`}>
                                        <Image
                                            src={tmdbApi.getImageUrl(item.poster_path)}
                                            alt={item.title || item.name || 'Poster'}
                                            width={ITEM_WIDTH}
                                            height={210}
                                            className="w-full aspect-[2/3] object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                        <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end">
                                            <div className="bg-white/20 backdrop-blur-md px-1.5 py-0.5 rounded text-xs font-bold text-white">
                                                {item.vote_average?.toFixed(1) || '0.0'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        // Placeholder skeleton track
                        Array(10).fill(0).map((_, i) => (
                            <div key={i} className="shrink-0 w-[140px] aspect-[2/3] bg-white/5 rounded-xl animate-pulse"></div>
                        ))
                    )}
                </motion.div>
            </div>
        </div>
    );
}
