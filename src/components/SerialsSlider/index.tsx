"use client";

import React from 'react';
import { Tv } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import MediaCard from '@/components/MediaCard';
import SwiperNavButtons from '@/components/SwiperNavButtons';
import { TMDBMedia, tmdbApi } from '@/services/tmdb';
import 'swiper/css';
import 'swiper/css/navigation';

export default function SerialsSlider({ series }: { series: TMDBMedia[] }) {
    if (!series || series.length === 0) return null;
    return (  
        <section className='container py-[60px] md:py-[100px]'>
            <div className='pt-8'>
                <Swiper
                    breakpoints={{
                        480: { slidesPerView: 2, spaceBetween: 30 },
                        768: { slidesPerView: 3, spaceBetween: 40 },
                        1024: { slidesPerView: 4, spaceBetween: 50 },
                        1280: { slidesPerView: 5, spaceBetween: 50 },
                    }}
                    modules={[Navigation]}
                    spaceBetween={20}
                    slidesPerView={1}
                className='flex flex-col'
                >
                    <div slot="container-start" className="flex justify-between items-center mb-8 md:mb-12 pt-2 gap-4">
                        <h2 className='md:text-[32px] text-xl xs:text-2xl leading-[1.2] font-bold whitespace-nowrap flex items-center gap-3'>
                            <Tv className="w-8 h-8 text-white" />
                            Лучшие сериалы
                        </h2>
                        <div className="hidden sm:block h-[1px] w-full bg-[#323234] mx-10"></div>
                        <SwiperNavButtons />
                    </div>
                    {series.map((show) => (
                        <SwiperSlide key={show.id}>
                            <MediaCard 
                                id={show.id}
                                name={show.title || show.name || ''} 
                                year={show.first_air_date ? show.first_air_date.split('-')[0] : 'N/A'} 
                                genre="Сериал" 
                                rate={show.vote_average || 0} 
                                img={tmdbApi.getImageUrl(show.poster_path)}
                                type="tv"
                                href={`/series/${show.id}`}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
}
