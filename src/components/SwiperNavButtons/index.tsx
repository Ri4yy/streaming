"use client";

import React from 'react';
import { useSwiper } from 'swiper/react';

export default function SwiperNavButtons() {
    const swiper = useSwiper();
    
    return (  
        <div className="flex gap-x-3">
            <button className='w-12 h-12 flex justify-center items-center bg-white/5 rounded-xl border border-white/10 backdrop-blur-md hover:bg-white/10 hover:border-white/20 shadow-lg transition-all duration-300' onClick={() => swiper.slidePrev()}>
                <svg width="7" height="12" viewBox="0 0 7 12" className='stroke-white stroke-[2px] fill-transparent transition-colors duration-300' xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.02704 11.238L1.13961 6.35061L6.02704 1.4632"></path>
                </svg>
            </button>
            <button className='w-12 h-12 flex justify-center items-center bg-white/5 rounded-xl border border-white/10 backdrop-blur-md hover:bg-white/10 hover:border-white/20 shadow-lg transition-all duration-300' onClick={() => swiper.slideNext()}>
                <svg width="7" height="12" viewBox="0 0 7 12" className='stroke-white stroke-[2px] fill-transparent transition-colors duration-300 rotate-180' xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.02704 11.238L1.13961 6.35061L6.02704 1.4632"></path>
                </svg>
            </button>
        </div>
    );
}
