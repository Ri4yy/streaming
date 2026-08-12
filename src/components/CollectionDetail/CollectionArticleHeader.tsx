"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Calendar, Clock, Share2, MessageCircle } from 'lucide-react';
import { SiTelegram, SiVk, SiX } from '@icons-pack/react-simple-icons';
import { markCollectionAsViewed } from '@/utils/viewedCollections';

interface HeaderProps {
    id?: string;
    slug?: string;
    title: string;
    coverImage: string;
    date: string;
    readTime: string;
    hookText: string;
    category?: string;
}

const categoryTitles: Record<string, string> = {
    movies: 'Фильмы',
    series: 'Сериалы',
    anime: 'Аниме',
    games: 'Игры',
    books: 'Книги',
    mixed: 'Разное',
};

export default function CollectionArticleHeader({ id, slug, title, coverImage, date, readTime, hookText, category }: HeaderProps) {
    useEffect(() => {
        if (id || slug) {
            markCollectionAsViewed(id || '', slug || '');
        }
    }, [id, slug]);
    return (
        <div className="relative w-full mb-6 md:mb-10 rounded-t-3xl overflow-hidden">
            {/* Massive Banner Image */}
            <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${coverImage})`, backgroundPosition: 'center 20%' }}
            />
            
            {/* Gradients to ensure text readability */}
            <div className="absolute inset-0 bg-[#080c13]/60 backdrop-blur-sm" />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--theme-bg)] via-[var(--theme-bg)]/80 to-transparent opacity-100" />
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--theme-bg)]/80 to-transparent" />

            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-12 pt-10 pb-16 md:pb-24 flex flex-col justify-end min-h-[500px]">
                
                {/* Breadcrumbs */}
                <nav className="flex text-sm text-white/50 mb-auto font-medium" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-3">
                        <li className="inline-flex items-center">
                            <Link href="/" className="hover:text-white transition-colors">Главная</Link>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <ChevronRight className="w-4 h-4 mx-1" />
                                <Link href="/collections" className="hover:text-white transition-colors">Подборки</Link>
                            </div>
                        </li>
                        {category && categoryTitles[category] && (
                            <li>
                                <div className="flex items-center">
                                    <ChevronRight className="w-4 h-4 mx-1" />
                                    <Link href={`/collections/${category}`} className="hover:text-white transition-colors">{categoryTitles[category]}</Link>
                                </div>
                            </li>
                        )}
                        <li>
                            <div className="flex items-center">
                                <ChevronRight className="w-4 h-4 mx-1" />
                                <span className="text-white/80 line-clamp-1">{title}</span>
                            </div>
                        </li>
                    </ol>
                </nav>

                {/* H1 Title */}
                <h1 className="text-3xl md:text-[52px] font-sans font-black tracking-tight text-white leading-tight mb-6 drop-shadow-xl max-w-4xl mt-10 md:mt-[120px]">
                    {title}
                </h1>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 text-white/70 text-sm md:text-base font-medium mb-8">
                    <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-md">
                        <Calendar className="w-4 h-4 text-[var(--theme-primary)]" />
                        {date}
                    </div>
                    <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-md">
                        <Clock className="w-4 h-4 text-[var(--theme-primary)]" />
                        ⏳ {readTime} чтения
                    </div>
                    
                    {/* Share Buttons */}
                    <div className="flex items-center gap-2 ml-auto lg:ml-8">
                        <span className="text-sm mr-2 hidden sm:block">Поделиться:</span>
                        <button className="p-2 rounded-full bg-white/5 hover:bg-[#0088cc]/20 hover:text-[#0088cc] border border-white/10 transition-colors group">
                            <SiTelegram className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
                        </button>
                        <button className="p-2 rounded-full bg-white/5 hover:bg-[#0077FF]/20 hover:text-[#0077FF] border border-white/10 transition-colors group">
                            <SiVk className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
                        </button>
                        <button className="p-2 rounded-full bg-white/5 hover:bg-white/20 hover:text-white border border-white/10 transition-colors group">
                            <SiX className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
                        </button>
                    </div>
                </div>

                {/* Hook / Intro */}
                <div className="max-w-4xl text-lg md:text-xl text-white/90 leading-relaxed font-medium bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl border-l-4 border-l-[var(--theme-primary)] p-6 shadow-[-10px_0_30px_-15px_var(--theme-primary)]">
                    {hookText}
                </div>
                
            </div>
        </div>
    );
}
