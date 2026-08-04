"use client";

import React from 'react';
import MediaCard from '@/components/MediaCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperNavButtons from '@/components/SwiperNavButtons';
import { StaggerContainer, StaggerItem } from '@/components/AnimateIn/Stagger';
import { TMDBMedia, tmdbApi } from '@/services/tmdb';
import 'swiper/css';
import 'swiper/css/navigation';

export default function ReleaseSlider({ movies }: { movies: TMDBMedia[] }) {
    if (!movies || movies.length === 0) return null;
    return (  
        <StaggerContainer className='xl:pl-[calc((100%-1240px)/2)] min-[1240px]:pl-[calc((100%-1160px)/2)] md:pl-10 px-5 md:px-0 pt-[100px]'>
            <section>
                <StaggerItem><h2 className='text-3xl font-bold'>Премьеры</h2></StaggerItem>
                <StaggerItem>
                    <div className='pt-10'>
                        <Swiper
                        className="[&>.swiper-wrapper]:w-[500%] [&>.swiper-wrapper]:p-5 [&>.swiper-wrapper]:rounded-lg [&>.swiper-wrapper]:bg-[#f8f7f9]/10 [&>.swiper-wrapper]:backdrop-blur-sm"
                        breakpoints={{
                            320: { slidesPerView: 1 },
                            580: { slidesPerView: 2 },
                            900: { slidesPerView: 3 },
                            1024: { slidesPerView: 4 },
                            1480: { slidesPerView: 5 }
                        }}
                        modules={[Navigation]}
                        spaceBetween={50}
                        slidesPerView={5}
                        >
                            {movies.map((movie) => (
                                <SwiperSlide key={movie.id}>
                                    <MediaCard 
                                        name={movie.title || movie.name || ''} 
                                        year={movie.release_date ? movie.release_date.split('-')[0] : 'N/A'} 
                                        genre="Кино" 
                                        rate={movie.vote_average || 0} 
                                        img={tmdbApi.getImageUrl(movie.poster_path)}
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
                </StaggerItem>
            </section>
        </StaggerContainer>
    );
}
