"use client";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import Image from 'next/image';
import SwiperNavButtons from '@/components/SwiperNavButtons';
import 'swiper/css';
import 'swiper/css/navigation';
import { TMDBMedia, tmdbApi } from '@/services/tmdb';

export default function AnimeHeroSwiper({ animes }: { animes: TMDBMedia[] }) {
    if (!animes || animes.length === 0) return null;
    return (
        <Swiper 
            breakpoints={{
                320: { slidesPerView: 1 },
                580: { slidesPerView: 2 },
                900: { slidesPerView: 3 },
                1024: { slidesPerView: 1.5 },
            }}
            modules={[Navigation]}
            spaceBetween={50}
            slidesPerView={1.5}
        >
            {animes.map(anime => (
                <SwiperSlide key={anime.id}>
                    <Image 
                        src={tmdbApi.getImageUrl(anime.backdrop_path || anime.poster_path)} 
                        alt={anime.name || anime.title || ''} 
                        width={500} 
                        height={300} 
                        className='w-full h-[300px] object-cover rounded-xl' 
                        unoptimized
                    />
                </SwiperSlide>
            ))}
            <div className="flex items-center mt-10">
                <SwiperNavButtons />
                <div className="w-full h-[1px] bg-[#F8F7F9]/70 mx-10"></div>
            </div>
        </Swiper>
    );
}
