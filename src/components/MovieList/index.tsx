"use client";

import React from 'react';
import Link from 'next/link';
import { Clapperboard } from 'lucide-react';
import MediaCard from '@/components/MediaCard';
import { StaggerContainer, StaggerItem } from '@/components/AnimateIn/Stagger';
import { TMDBMedia, tmdbApi } from '@/services/tmdb';

export default function MovieList({ movies }: { movies: TMDBMedia[] }) {
    if (!movies || movies.length === 0) return null;
    return (  
        <div className="bg-[linear-gradient(95.92deg,#bc2fb2_0%,#f55267_49.13%,#feae71_100%)]">
            <StaggerContainer className="container md:py-[120px] py-20">
                <StaggerItem><div className="rounded-md backdrop-blur-md bg-white/10 w-fit px-2.5 py-1 text-white/80 text-sm mx-auto">Онлайн-просмотр</div></StaggerItem>
                <StaggerItem>
                    <h2 className='flex items-center justify-center gap-3 text-center md:text-[32px] text-2xl leading-[1.2] mt-2 font-bold'>
                        <Clapperboard className="w-8 h-8 text-white" />
                        Недавно вышедшие фильмы
                    </h2>
                </StaggerItem>
                <div className="grid xl:grid-cols-6 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-x-3 md:gap-x-7 md:gap-y-12 gap-y-8 mt-10">
                    {movies.slice(0, 6).map((movie) => 
                        <StaggerItem key={movie.id} className="h-full">
                            <MediaCard 
                                id={movie.id}
                                name={movie.title || movie.name || ''} 
                                year={movie.release_date ? movie.release_date.split('-')[0] : 'N/A'} 
                                genre="Кино" 
                                rate={movie.vote_average || 0} 
                                img={tmdbApi.getImageUrl(movie.poster_path)}
                                type="movie"
                                href={`/movies/${movie.id}`}
                            />
                        </StaggerItem>
                    )}
                </div>
                <StaggerItem>
                    <Link href="/movies" className='flex gap-2 justify-center items-center group py-3 px-8 rounded-lg hover:scale-110 bg-theme-gradient text-white relative overflow-hidden transition-all duration-700 mx-auto mt-12 w-fit'>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 bg-white rounded-full transition-all duration-500 ease-out group-hover:w-[300px] group-hover:h-[300px] z-0"></div>
                        <span className="relative z-10 group-hover:text-black transition-colors duration-500">Просмотреть все</span>
                    </Link>
                </StaggerItem>
            </StaggerContainer>
        </div>
    );
}
