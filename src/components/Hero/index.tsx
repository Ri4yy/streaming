"use client";

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { TMDBMedia, tmdbApi } from '@/services/tmdb';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Parallax, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

export default function Hero({ movies }: { movies: TMDBMedia[] }) {
    const progressCircle = useRef<SVGSVGElement>(null);
    const progressContent = useRef<HTMLSpanElement>(null);

    const onAutoplayTimeLeft = (s: any, time: number, progress: number) => {
        if (progressCircle.current) {
            progressCircle.current.style.setProperty('--progress', String(1 - progress));
        }
        if (progressContent.current) {
            progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
        }
    };

    if (!movies || movies.length === 0) return null;

    return (
        <section className='w-full h-screen md:min-h-[800px] relative overflow-hidden'>
            <Swiper
                speed={1000}
                parallax={true}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                    el: '.custom-pagination',
                    bulletClass: 'custom-bullet',
                    bulletActiveClass: 'custom-bullet-active',
                }}
                modules={[Autoplay, Parallax, Pagination]}
                onAutoplayTimeLeft={onAutoplayTimeLeft}
                className="w-full h-full"
            >
                {movies.map((movie) => (
                    <SwiperSlide key={movie.id} className="relative overflow-hidden flex flex-col justify-center">
                        <div className="absolute inset-0 z-0" data-swiper-parallax="-20%">
                            <Image 
                                src={tmdbApi.getImageUrl(movie.backdrop_path || movie.poster_path, 'original')}
                                alt={movie.title || movie.name || 'Hero'}
                                fill
                                className="object-cover object-center"
                                priority
                            />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-[#111112]/90 via-[#111112]/60 to-transparent z-10"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#111112] via-transparent to-[#111112]/40 z-10"></div>
                        
                        <div className="container relative z-20 mx-auto h-full flex flex-col justify-center" data-swiper-parallax="-50%">
                            <div className="flex md:flex-col flex-row items-center md:items-start gap-x-2 mt-6 md:mt-0 mb-4" data-swiper-parallax="-100">
                                <div className="rounded-lg backdrop-blur-xl h-fit bg-[#ff1414]/30 border border-[#ff1414]/50 w-fit px-3 py-1 text-white text-xs font-bold uppercase tracking-wider mb-2 shadow-[0_0_15px_rgba(255,20,20,0.3)]">
                                    Топ новинка
                                </div>
                                <div className="flex items-center gap-x-2 md:mt-2">
                                    <div className="rounded-lg backdrop-blur-md bg-white/10 border border-white/20 w-fit px-3 py-1 text-white text-sm uppercase font-bold shadow-lg">{movie.media_type === 'tv' ? 'Сериал' : 'Кино'}</div>
                                    <div className="rounded-lg backdrop-blur-md bg-white/10 border border-white/20 w-fit px-3 py-1 text-white text-sm uppercase font-bold shadow-lg">4K</div>
                                </div>
                            </div>
                            
                            <h1 className='md:text-[64px] text-4xl font-bold w-fit my-2 max-w-4xl text-white drop-shadow-lg' data-swiper-parallax="-200">
                                {movie.title || movie.name}
                            </h1>
                            
                            <div className="flex items-center mt-2 mb-6" data-swiper-parallax="-300">
                                <svg width="24" height="24" viewBox="0 0 43 22" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                                    <path d="M43 1.89083C42.8833 0.922265 42.1751 0.150295 41.2733 0C37.3203 0 5.69694 0 1.74393 0C0.756052 0.164717 0 1.07484 0 2.17169C0 3.935 0 18.0384 0 19.801C0 21.0155 0.925061 22 2.06699 22C5.95494 22 37.0623 22 40.9502 22C42.0017 22 42.8699 21.1643 43 20.0826C43 16.4444 43 3.70955 43 1.89083Z" fill="#F6C700"></path>
                                    <path fillRule="evenodd" clipRule="evenodd" d="M34.2105 15.7931C34.4184 15.7931 34.6936 15.7074 34.7565 15.5381C34.7983 15.425 34.8297 15.0174 34.8514 14.3152V10.8987C34.8514 10.3347 34.8155 9.96654 34.7445 9.79423C34.6727 9.62193 34.3938 9.53615 34.1859 9.53615C33.9825 9.53615 33.8508 9.61206 33.791 9.76159C33.7304 9.91265 33.7005 10.2914 33.7005 10.8987V14.4223C33.7005 15.0083 33.7342 15.3825 33.803 15.5464C33.8718 15.7112 34.0071 15.7931 34.2105 15.7931ZM33.4852 17.5504H30.4131V4.21738H33.7005V8.55468C33.9727 8.23511 34.2764 7.99676 34.6106 7.83964C34.9457 7.68251 35.4482 7.60281 35.8408 7.60281C36.2925 7.60281 36.6844 7.67416 37.0164 7.81687C37.3484 7.95957 37.6019 8.1592 37.7762 8.41653C37.9504 8.67385 38.0551 8.9251 38.0903 9.1718C38.1254 9.4185 38.1434 9.94377 38.1434 10.7484V14.4891C38.1434 15.2891 38.0903 15.8842 37.9841 16.2759C37.8779 16.6668 37.6281 17.0069 37.2363 17.2938C36.8436 17.5815 36.3785 17.725 35.8393 17.725C35.4519 17.725 34.9516 17.6399 34.6174 17.4691C34.2816 17.2991 33.9757 17.0426 33.6975 16.701C33.6953 16.7098 33.6918 16.724 33.6869 16.7436C33.6602 16.8508 33.5933 17.1197 33.4852 17.5504ZM14.911 9.62588L15.0461 10.5624L15.8366 4.3335H20.2944V17.6665H17.315L17.3038 8.667L16.111 17.6665H13.982L12.7241 8.86284L12.7137 17.6665H9.72461V4.3335H14.1487C14.2789 5.14114 14.415 6.0877 14.5578 7.17544C14.5846 7.36349 14.7025 8.1806 14.911 9.62588ZM8.59885 4.42081H5.18652V17.7538H8.59885V4.42081ZM25.9279 7.10712C25.9653 7.27715 25.9847 7.66276 25.9847 8.26546V13.4347C25.9847 14.322 25.9279 14.8655 25.815 15.0659C25.7013 15.2663 25.3992 15.3658 24.9093 15.3658V6.61373C25.281 6.61373 25.5345 6.65396 25.6691 6.7329C25.8037 6.8126 25.8905 6.93709 25.9279 7.10712ZM27.4691 17.5306C27.8752 17.4403 28.2162 17.2809 28.4929 17.0539C28.7689 16.8262 28.9626 16.5112 29.0732 16.1081C29.1847 15.7058 29.2505 14.9065 29.2505 13.711V9.02908C29.2505 7.76751 29.2019 6.92191 29.1263 6.49228C29.0501 6.06189 28.8609 5.67097 28.558 5.32028C28.2544 4.96959 27.8117 4.71758 27.2298 4.56425C26.6473 4.41092 25.6975 4.3335 24.0456 4.3335H21.5V17.6665H25.634C26.5867 17.6361 27.1984 17.5913 27.4691 17.5306Z" fill="black"></path>
                                </svg>
                                <span className='text-lg font-bold text-white shadow-black drop-shadow-md'>{movie.vote_average ? movie.vote_average.toFixed(1) : '0.0'}</span>
                                <span className='flex items-center relative before:w-1.5 before:h-1.5 before:bg-white/50 before:rounded-full before:absolute before:-left-3 ml-6 text-white/80 font-medium text-lg drop-shadow-md'>
                                    {movie.release_date ? movie.release_date.split('-')[0] : (movie.first_air_date ? movie.first_air_date.split('-')[0] : 'N/A')}
                                </span>
                            </div>
                            
                            <p className='text-lg text-[#BFBFBF] lg:w-1/2 md:w-4/5 leading-[1.6] line-clamp-3 drop-shadow-md' data-swiper-parallax="-400">
                                {movie.overview || "Описание отсутствует."}
                            </p>
                            
                            <div className="flex items-center gap-4 mt-8" data-swiper-parallax="-500">
                                <Link href={`/${movie.media_type === 'tv' ? 'series' : 'movies'}/${movie.id}`} className='flex gap-2 justify-center items-center group py-3.5 px-10 rounded-xl bg-[#ff1414] hover:bg-[#ff1414]/90 relative overflow-hidden transition-all duration-500 shadow-[0_0_20px_rgba(255,20,20,0.4)] hover:shadow-[0_0_30px_rgba(255,20,20,0.6)]'>
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 bg-white rounded-full transition-all duration-500 ease-out group-hover:w-[300px] group-hover:h-[300px] z-0"></div>
                                    <span className="relative z-10 text-white group-hover:text-black font-semibold text-lg transition-colors duration-500">Смотреть</span>
                                    <svg width="24" height="24" className='fill-white group-hover:fill-black z-50 relative' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8 19L19 12L8 5V19Z"></path>
                                    </svg>
                                </Link>
                                <Link href={`/${movie.media_type === 'tv' ? 'series' : 'movies'}/${movie.id}`} className='py-3.5 px-8 rounded-xl backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium transition-all duration-300'>
                                    Подробнее
                                </Link>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Custom Pagination and Timer */}
            <div className="absolute right-8 bottom-12 z-50 flex items-center gap-6">
                <div className="custom-pagination flex gap-2 items-center"></div>
                <div className="relative w-14 h-10 flex items-center justify-center font-bold text-white text-sm backdrop-blur-md bg-black/40 rounded-full border border-white/10 shadow-lg">
                    <svg viewBox="0 0 48 48" className="absolute left-0 top-0 w-full h-full -rotate-90 stroke-white/20 stroke-[3px] fill-none rounded-full">
                        <circle cx="24" cy="24" r="20"></circle>
                    </svg>
                    <svg viewBox="0 0 48 48" className="absolute left-0 top-0 w-full h-full -rotate-90 stroke-[#ff1414] stroke-[3px] fill-none rounded-full transition-all duration-100 ease-linear" style={{ strokeDasharray: '125.6', strokeDashoffset: 'calc(125.6 * var(--progress, 0))' }} ref={progressCircle}>
                        <circle cx="24" cy="24" r="20"></circle>
                    </svg>
                    <span ref={progressContent} className="font-mono text-[13px] tracking-tighter"></span>
                </div>
            </div>

            <style>{`
                .custom-bullet {
                    width: 10px;
                    height: 10px;
                    display: inline-block;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.4);
                    cursor: pointer;
                    transition: all 0.4s ease;
                }
                .custom-bullet:hover {
                    background: rgba(255, 255, 255, 0.8);
                }
                .custom-bullet-active {
                    background: #ff1414;
                    width: 36px;
                    border-radius: 8px;
                }
            `}</style>
        </section>
    );
}
