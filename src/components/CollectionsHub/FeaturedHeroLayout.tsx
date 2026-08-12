"use client";

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { Flame, Play, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

import { CollectionProps } from './CollectionCard';

interface FeaturedHeroLayoutProps {
    trending: CollectionProps[];
    latest: CollectionProps[];
    viewAllHref?: string;
}

export default function FeaturedHeroLayout({ trending, latest, viewAllHref }: FeaturedHeroLayoutProps) {
    return (
        <div className="w-full flex flex-col xl:flex-row gap-6 mb-12 mt-6 h-auto xl:h-[550px]">
            {/* Custom Styles for Slider Pagination */}
            <style dangerouslySetInnerHTML={{__html: `
                .collections-pagination.swiper-pagination {
                    width: auto !important;
                    display: flex !important;
                    gap: 8px !important;
                }
                @media (min-width: 768px) {
                    .collections-pagination.swiper-pagination {
                        bottom: 48px !important;
                        left: 48px !important;
                    }
                }
                .collections-pagination .swiper-pagination-bullet {
                    width: 8px;
                    height: 8px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    opacity: 1;
                    transition: all 0.3s ease;
                }
                .collections-pagination .swiper-pagination-bullet-active {
                    background: var(--theme-primary);
                    width: 24px;
                    border-radius: 4px;
                    box-shadow: 0 0 10px var(--theme-primary);
                }
            `}} />

            {/* Left: Big Trending Slider */}
            <div className="w-full xl:w-2/3 h-[450px] xl:h-full rounded-3xl overflow-hidden relative shadow-2xl shadow-black/40 border border-white/10 group bg-[var(--theme-bg)]">
                <Swiper
                    modules={[Pagination, Autoplay, EffectFade]}
                    effect="fade"
                    pagination={{ clickable: true, el: '.collections-pagination' }}
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                    className="w-full h-full"
                >
                    {trending.map((item) => (
                        <SwiperSlide key={item.id} className="bg-[var(--theme-bg)]">
                            <div className="relative w-full h-full">
                                {/* Background Image with Fallback */}
                                <div 
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[10000ms] scale-100 group-hover:scale-110 bg-[var(--theme-bg)]"
                                    style={{ backgroundImage: item.banner_image || item.image ? `url(${item.banner_image || item.image})` : 'none' }}
                                />
                                {/* Gradients & Blur */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#080c13] via-[#080c13]/50 to-transparent opacity-90 backdrop-blur-sm" />
                                <div className="absolute inset-0 bg-gradient-to-r from-[var(--theme-bg)]/80 via-transparent to-transparent opacity-90 backdrop-blur-sm" />
                                
                                {/* Content */}
                                <div className="absolute inset-0 p-8 pb-16 md:p-12 md:pb-16 flex flex-col justify-end items-start z-10">
                                    <div className="bg-[var(--theme-primary)]/20 text-[var(--theme-primary)] border border-[var(--theme-primary)]/30 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-1.5 backdrop-blur-md">
                                        <Flame className="w-4 h-4" /> Выбор редакции
                                    </div>
                                    
                                    <h3 className="text-3xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg max-w-2xl leading-tight">
                                        {item.title}
                                    </h3>
                                    
                                    <p className="text-white/70 text-lg max-w-xl mb-8 line-clamp-2">
                                        {item.description}
                                    </p>

                                    <Link href={`/collections/${item.type}/${item.id}`} className="flex items-center gap-2 bg-white text-black px-6 py-3.5 rounded-2xl font-bold hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                                        <Play className="w-5 h-5 fill-current" />
                                        Смотреть подборку
                                    </Link>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
                {/* Custom Pagination inside the block */}
                <div className="absolute !bottom-6 !left-8 md:bottom-8 md:!left-12 z-20 collections-pagination flex gap-2" />
            </div>

            {/* Right: Latest Collections (Vertical List) */}
            <div className="w-full xl:w-1/3 flex flex-col bg-black/10 border border-white/10 rounded-3xl p-6 shadow-xl backdrop-blur-md h-[450px] xl:h-full overflow-hidden">
                <div className="flex items-center justify-between mb-6 shrink-0">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Clock className="w-5 h-5 text-[var(--theme-primary)]" /> Свежее
                    </h2>
                    {viewAllHref && (
                        <Link href={viewAllHref} className="text-sm text-white/50 hover:text-white transition-colors">
                            Смотреть все
                        </Link>
                    )}
                </div>
                
                <div className="flex flex-col gap-4 flex-1 overflow-y-auto pr-2 no-scrollbar">
                    {latest.map((item) => (
                        <Link key={item.id} href={`/collections/${item.type}/${item.id}`} className="flex gap-4 group bg-white/5 hover:bg-white/10 border border-white/10 p-3 rounded-2xl transition-all cursor-pointer items-center backdrop-blur-md shadow-sm shrink-0">
                            {/* Small Cover */}
                            <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-white/5">
                                <div 
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                    style={{ backgroundImage: item.image ? `url(${item.image})` : 'none' }}
                                />
                            </div>
                            
                            {/* Text */}
                            <div className="flex flex-col flex-1 justify-center">
                                <span className="text-[10px] uppercase tracking-wider text-[var(--theme-primary)] font-bold mb-1">
                                    {item.count} тайтлов
                                </span>
                                <h4 className="text-white font-bold text-sm leading-tight line-clamp-2 group-hover:text-[var(--theme-primary)] transition-colors">
                                    {item.title}
                                </h4>
                            </div>
                            
                            {/* Arrow */}
                            <div className="pr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                                <ArrowRight className="w-5 h-5 text-[var(--theme-primary)]" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            
        </div>
    );
}
