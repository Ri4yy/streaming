"use client";

import React, { useState, useEffect } from 'react';

export default function ScrollToTopBtn() {
    const [scrollToTop, setScrollToTop] = useState(false);
    
    useEffect(() => {
        const handleScroll = () => {
            if(window.scrollY > 1000) {
                setScrollToTop(true);
            } else {
                setScrollToTop(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    const scrollUp = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    if (!scrollToTop) return null;

    return (  
        <div onClick={scrollUp} className="group flex justify-center items-center -rotate-90 w-12 h-12 rounded-full backdrop-blur-md bg-black/20 border-2 hover:scale-110 hover:border-white border-white/50 fixed bottom-20 right-10 cursor-pointer transition-all duration-500 z-50">
            <div className="rounded-full bg-white w-0 h-0 absolute transition-all duration-300 group-hover:w-full group-hover:h-full"></div>
            <svg width="18" height="18" viewBox="0 0 24 24" className='group-hover:stroke-black stroke-white z-20 transition-all duration-300' fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 6L15 12L9 18" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
        </div>
    );
}
