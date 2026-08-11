"use client";

import React, { useEffect, useState } from 'react';

type ThemeType = 'red' | 'blue' | 'orange' | 'lime';

export default function ThemeSwitcher() {
    const [theme, setTheme] = useState<ThemeType>('red');

    useEffect(() => {
        const savedTheme = localStorage.getItem('site-theme') as ThemeType;
        if (savedTheme) {
            setTheme(savedTheme);
            document.documentElement.setAttribute('data-theme', savedTheme);
        }
    }, []);

    const toggleTheme = (newTheme: ThemeType) => {
        setTheme(newTheme);
        localStorage.setItem('site-theme', newTheme);
        if (newTheme === 'red') {
            document.documentElement.removeAttribute('data-theme');
        } else {
            document.documentElement.setAttribute('data-theme', newTheme);
        }
    };

    return (
        <div className="relative z-10 px-2 py-2">
            <div className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Тема оформления</div>
            <div className="flex items-center gap-3">
                <button 
                    onClick={() => toggleTheme('red')} 
                    className={`w-7 h-7 rounded-full bg-[#ff1414] shadow-[0_0_8px_#ff1414] transition-all duration-200 border-2 outline-none ${theme === 'red' ? 'border-white scale-110' : 'border-transparent hover:scale-110'}`}
                    title="Красная"
                />
                <button 
                    onClick={() => toggleTheme('blue')} 
                    className={`w-7 h-7 rounded-full bg-[#2aabee] shadow-[0_0_8px_#2aabee] transition-all duration-200 border-2 outline-none ${theme === 'blue' ? 'border-white scale-110' : 'border-transparent hover:scale-110'}`}
                    title="Голубая"
                />
                <button 
                    onClick={() => toggleTheme('orange')} 
                    className={`w-7 h-7 rounded-full bg-[#f97316] shadow-[0_0_8px_#f97316] transition-all duration-200 border-2 outline-none ${theme === 'orange' ? 'border-white scale-110' : 'border-transparent hover:scale-110'}`}
                    title="Оранжевая"
                />
                <button 
                    onClick={() => toggleTheme('lime')} 
                    className={`w-7 h-7 rounded-full bg-[#84cc16] shadow-[0_0_8px_#84cc16] transition-all duration-200 border-2 outline-none ${theme === 'lime' ? 'border-white scale-110' : 'border-transparent hover:scale-110'}`}
                    title="Лаймовая"
                />
            </div>
        </div>
    );
}
