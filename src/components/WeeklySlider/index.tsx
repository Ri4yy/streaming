"use client";

import React from 'react';
import MediaCard from '@/components/MediaCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperNavButtons from '@/components/SwiperNavButtons';
import 'swiper/css';
import 'swiper/css/navigation';
import { tmdbApi } from '@/services/tmdb';

export default function WeeklySlider({ items, type, title = "Новинки недели" }: { items: any[], type: 'movie' | 'tv' | 'anime' | 'game', title?: string }) {
    if (!items || items.length === 0) return null;

    return (
        <div className="mb-16 mt-[60px] relative">
            <h2 className="text-2xl font-medium mb-6">{title}</h2>
            <Swiper
                modules={[Navigation]}
                spaceBetween={20}
                slidesPerView={2}
                breakpoints={{
                    640: { slidesPerView: 3 },
                    768: { slidesPerView: 4 },
                    1024: { slidesPerView: 5 },
                    1280: { slidesPerView: 5 },
                }}
                className="w-full relative static-buttons-swiper"
            >
                <div className="absolute top-[-50px] right-0 z-10 flex gap-2">
                    <SwiperNavButtons />
                </div>
                {items.map((item) => (
                    <SwiperSlide key={item.id} className="h-auto pb-4">
                        <MediaCard
                            id={item.id}
                            name={item.title || item.name || ''}
                            year={item.release_date ? item.release_date.split('-')[0] : (item.first_air_date ? item.first_air_date.split('-')[0] : 'N/A')}
                            genre={type === 'movie' ? 'Фильм' : type === 'tv' ? 'Сериал' : type === 'anime' ? 'Аниме' : 'Игра'}
                            rate={item.vote_average || item.rate || 0}
                            img={item.img || tmdbApi.getImageUrl(item.poster_path)}
                            fallbackImg={item.fallbackImg}
                            type={type}
                            href={`/${type === 'tv' ? 'series' : type + 's'}/${item.id}`}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
