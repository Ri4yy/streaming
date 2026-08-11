"use client";

import React from 'react';
import { List } from 'lucide-react';

interface TOCProps {
    items: { id: string; title: string }[];
}

export default function TableOfContents({ items }: TOCProps) {
    const scrollToItem = (id: string) => {
        const element = document.getElementById(`item-${id}`);
        if (element) {
            // Offset for fixed header if any (assuming ~80px)
            const y = element.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    return (
        <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 mb-12 shadow-lg backdrop-blur-sm">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <List className="text-[var(--theme-primary)]" />
                Оглавление
            </h3>
            
            <ul className="space-y-3">
                {items.map((item, index) => (
                    <li key={item.id} className="flex items-start gap-3">
                        <span className="text-[var(--theme-primary)] font-bold min-w-[24px]">
                            {index + 1}.
                        </span>
                        <button 
                            onClick={() => scrollToItem(item.id)}
                            className="text-left text-white/70 hover:text-white hover:underline underline-offset-4 decoration-white/30 transition-all"
                        >
                            {item.title}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
