"use client";

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperNavButtons from '@/components/SwiperNavButtons';
import MediaCard from '@/components/MediaCard';
import { TMDBMedia, tmdbApi } from '@/services/tmdb';
import { SteamGameDetails, steamApi } from '@/services/steam';
import 'swiper/css';
import 'swiper/css/navigation';
import { Film, Tv, Gamepad2, PlayCircle } from 'lucide-react';

const typeIcons = {
    movie: Film,
    tv: Tv,
    anime: PlayCircle,
    game: Gamepad2
};

interface SimilarSliderProps {
    items: (TMDBMedia | SteamGameDetails)[];
    type: 'movie' | 'tv' | 'anime' | 'game';
}

export default function SimilarSlider({ items, type }: SimilarSliderProps) {
    if (!items || items.length === 0) return null;

    // Type guard helpers
    const isTMDB = (item: any): item is TMDBMedia => 'poster_path' in item || 'vote_average' in item;
    const isSteam = (item: any): item is SteamGameDetails => 'steam_appid' in item;

    const Icon = typeIcons[type] || Film;

    return (
        <section className='container py-12 relative'>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                    <Icon className="w-6 h-6 text-white" />
                    Похожие {type === 'movie' ? 'фильмы' : type === 'tv' ? 'сериалы' : type === 'anime' ? 'аниме' : 'игры'}
                </h2>
            </div>
            <Swiper
                modules={[Navigation]}
                spaceBetween={20}
                slidesPerView={1.5}
                breakpoints={{
                    480: { slidesPerView: 2 },
                    768: { slidesPerView: 3 },
                    1024: { slidesPerView: 4 },
                    1280: { slidesPerView: 5 },
                }}
                className="w-full relative static-buttons-swiper pb-10"
            >
                <div className="absolute top-[-50px] right-0 z-10 flex gap-2">
                    <SwiperNavButtons />
                </div>
                {items.map((item, idx) => {
                    let cardProps: any = {};
                    
                    if (isTMDB(item)) {
                        cardProps = {
                            id: item.id,
                            name: item.title || item.name || '',
                            year: item.release_date ? item.release_date.split('-')[0] : (item.first_air_date ? item.first_air_date.split('-')[0] : 'N/A'),
                            genre: type === 'anime' ? 'Аниме' : (type === 'movie' ? 'Фильм' : 'Сериал'),
                            rate: item.vote_average || 0,
                            img: tmdbApi.getImageUrl(item.poster_path),
                            href: `/${type === 'movie' ? 'movies' : type === 'anime' ? 'anime' : 'series'}/${item.id}`
                        };
                    } else if (isSteam(item)) {
                        cardProps = {
                            id: item.steam_appid,
                            name: item.name,
                            year: item.release_date?.date ? item.release_date.date.split(',').pop()?.trim() || 'N/A' : 'N/A',
                            genre: item.genres?.[0]?.description || 'Игра',
                            rate: 0, // Not available easily on basic details
                            img: steamApi.getVerticalImage(item.steam_appid),
                            fallbackImg: item.header_image,
                            href: `/games/${item.steam_appid}`
                        };
                    }

                    return (
                        <SwiperSlide key={cardProps.id || idx} className="h-auto">
                            <MediaCard {...cardProps} type={type} size="small" />
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </section>
    );
}
