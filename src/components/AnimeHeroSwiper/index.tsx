"use client";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import Image from 'next/image';
import Link from 'next/link';
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
                    <Link href={`/anime/${anime.id}`} className="block relative group overflow-hidden rounded-xl">
                        <Image 
                            src={tmdbApi.getImageUrl(anime.backdrop_path || anime.poster_path)} 
                            alt={anime.name || anime.title || ''} 
                            width={500} 
                            height={300} 
                            className='w-full h-[300px] object-cover rounded-xl group-hover:scale-110 transition-transform duration-500' 
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500"></div>
                    </Link>
                </SwiperSlide>
            ))}
            <div className="flex items-center mt-10">
                <SwiperNavButtons />
                <div className="w-full h-[1px] bg-[#F8F7F9]/70 mx-10"></div>
            </div>
        </Swiper>
    );
}
