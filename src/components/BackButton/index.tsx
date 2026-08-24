"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

interface BackButtonProps {
    fallbackHref?: string;
}

export default function BackButton({ fallbackHref = '/' }: BackButtonProps) {
    const router = useRouter();

    return (
        <button 
            onClick={() => {
                if (window.history.length > 2) {
                    router.back();
                } else {
                    router.push(fallbackHref);
                }
            }} 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white/80 hover:text-white transition-all backdrop-blur-md font-medium text-sm w-fit"
        >
            <ChevronLeft className="w-4 h-4" /> Назад
        </button>
    );
}
