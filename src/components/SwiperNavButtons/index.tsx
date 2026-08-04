"use client";

import React from 'react';
import { useSwiper } from 'swiper/react';

export default function SwiperNavButtons() {
    const swiper = useSwiper();
    
    return (  
        <div className="flex gap-x-3">
            <button className='w-12 h-12 flex justify-center items-center group bg-black/30 rounded-full border-[1px] border-white/20 hover:scale-110 relative overflow-hidden transition-all duration-500' onClick={() => swiper.slidePrev()}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 bg-white rounded-full transition-all duration-500 ease-out group-hover:w-[150px] group-hover:h-[150px] z-0"></div>
                <svg width="7" height="12" viewBox="0 0 7 12" className='fill-white group-hover:fill-black relative z-10 transition-colors duration-500' xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.02704 11.238L1.13961 6.35061L6.02704 1.4632"></path>
                </svg>
            </button>
            <button className='w-12 h-12 flex justify-center items-center group bg-black/30 rounded-full border-[1px] border-white/20 hover:scale-110 relative overflow-hidden transition-all duration-500' onClick={() => swiper.slideNext()}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 bg-white rounded-full transition-all duration-500 ease-out group-hover:w-[150px] group-hover:h-[150px] z-0"></div>
                <svg width="7" height="12" viewBox="0 0 7 12" className='fill-white group-hover:fill-black relative z-10 transition-colors duration-500 rotate-180' xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.02704 11.238L1.13961 6.35061L6.02704 1.4632"></path>
                </svg>
            </button>
        </div>
    );
}
