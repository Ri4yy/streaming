"use client";

import React from 'react';
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
        <section className='container py-[100px]'>
            <div className='pt-8'>
                <Swiper
                breakpoints={{
                    320: { slidesPerView: 1 },
                    580: { slidesPerView: 2 },
                    900: { slidesPerView: 3 },
                    1024: { slidesPerView: 4 },
                }}
                modules={[Navigation]}
                spaceBetween={50}
                slidesPerView={4}
                className='flex flex-col'
                >
                    <div className="flex justify-between items-center order-1 mb-12 pt-2">
                        <h2 className='md:text-[32px] text-2xl leading-[1.2] font-bold whitespace-nowrap'>Лучшие сериалы</h2>
                        <div className="h-[1px] w-full bg-[#323234] mx-10"></div>
                        <SwiperNavButtons />
                    </div>
                    {series.map((show) => (
                        <SwiperSlide key={show.id}>
                            <MediaCard 
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
