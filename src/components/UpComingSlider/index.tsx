"use client";

import React from 'react';
import { Calendar } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import CardUpComing from '@/components/CardUpComing';
import SwiperNavButtons from '@/components/SwiperNavButtons';
import { TMDBMedia, tmdbApi } from '@/services/tmdb';
import 'swiper/css';
import 'swiper/css/navigation';

export default function UpComingSlider({ movies }: { movies: TMDBMedia[] }) {
    if (!movies || movies.length === 0) return null;
    return (  
        <div className="container pt-[60px] md:pt-[100px]">
            <h2 className='md:text-[32px] text-2xl leading-[1.2] font-bold flex items-center gap-3'>
                <Calendar className="w-8 h-8 text-white" />
                Предстоящие релизы
            </h2>
            <div className="pt-10">
                <Swiper
                    breakpoints={{
                        768: { slidesPerView: 2, spaceBetween: 40 },
                        1024: { slidesPerView: 2, spaceBetween: 50 },
                        1280: { slidesPerView: 2, spaceBetween: 50 },
                    }}
                    modules={[Navigation]}
                    spaceBetween={20}
                    slidesPerView={1}
                >
                    {movies.map((movie) => (
                        <SwiperSlide key={movie.id}>
                            <CardUpComing 
                                name={movie.title || movie.name || ''} 
                                desc={movie.overview || "Описание отсутствует."} 
                                rate={movie.vote_average || 0} 
                                img={tmdbApi.getImageUrl(movie.backdrop_path || movie.poster_path, 'original')} 
                                href={`/movies/${movie.id}`}
                            />
                        </SwiperSlide>
                    ))}
                    
                    <div className="flex justify-between items-center pr-[calc((100%-1240px))] mt-12">
                        <div className="h-[1px] w-full bg-[#323234] md:mr-10 mr-5"></div>
                        <SwiperNavButtons />
                    </div>
                </Swiper>
            </div>
        </div>
    );
}
