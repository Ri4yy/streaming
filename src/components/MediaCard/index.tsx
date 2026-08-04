"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart } from 'lucide-react';

interface MediaCardProps {
    name: string;
    year: string | number;
    genre: string;
    rate: string | number;
    img: string;
    type?: string;
    href?: string;
}

export default function MediaCard({ name, year, genre, rate, img, type = "movie", href = "/movies/1" }: MediaCardProps) {
    const [isFavorite, setIsFavorite] = useState(false);

    const toggleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsFavorite(!isFavorite);
    };

    return (  
        <div className="flex flex-col gap-4 group h-full">
            <div className="w-full relative rounded-lg h-[400px] overflow-hidden">
                <div className='absolute top-3 right-3 text-white rounded-md backdrop-blur-md bg-black/50 py-1 px-2.5 z-20'>{typeof rate === 'number' ? rate.toFixed(1) : rate}</div>
                
                <button 
                    onClick={toggleFavorite}
                    className='absolute top-3 left-3 rounded-full backdrop-blur-md bg-black/50 p-2 z-20 hover:bg-white/20 transition-all duration-300'
                >
                    <Heart className={`w-5 h-5 transition-all duration-300 ${isFavorite ? 'fill-red-500 stroke-red-500 scale-110' : 'stroke-white'}`} />
                </button>

                <Link href={href}>
                    <Image 
                        src={img} 
                        alt={name}
                        fill
                        className='flex h-[400px] rounded-lg w-full overflow-hidden object-cover group-hover:scale-105 transition-all duration-700 z-10' 
                    />
                </Link>
            </div>
            <Link href={href} className='text-xl hover:text-[#ff1414] transition-colors duration-300'>{name}</Link>
            <ul className='flex gap-x-3 items-center'>
                <li className='text-[#BFBFBF] text-sm'>{year}</li>
                <li><div className='h-1 w-1 rounded-full bg-[#323234]'></div></li>
                <li className='text-[#BFBFBF] text-sm'>{genre}</li>
            </ul>
        </div>
    );
}
