import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import DetailActions from '@/components/DetailActions';
import DetailTabs from '@/components/DetailTabs';
import FramesSlider from '@/components/FramesSlider';
import { tmdbApi } from '@/services/tmdb';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const series = await tmdbApi.getDetails(id, 'tv');
    return {
        title: series.title || series.name || 'Сериал',
        description: series.overview?.substring(0, 160) || "Подробная информация о сериале.",
    };
}

export default async function SeriesDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const series = await tmdbApi.getDetails(id, 'tv');

    return (  
        <main>
            <section className='pt-[120px] max-[1100px]:pb-20 bg-[url(/img/bg.png)] bg-no-repeat bg-cover bg-center w-full min-[1100px]:h-screen md:min-h-[800px] flex flex-col justify-center relative after:absolute after:top-0 after:left-0 after:backdrop-blur-md after:z-10 after:w-full after:h-full overflow-hidden'>
                <div className="container flex max-[1100px]:flex-col gap-x-20 items-center z-20">
                    <div className="max-[1100px]:mt-[160px] w-[30%] h-full max-[1100px]:w-full relative pb-32">
                        <Image src={tmdbApi.getImageUrl(series.poster_path)} alt="Poster" width={500} height={750} className='rounded-xl w-full object-cover h-[300px] min-[1100px]:h-full' />
                        <DetailActions 
                            id={series.id} 
                            type="tv" 
                            title={series.title || series.name || ''} 
                            coverUrl={tmdbApi.getImageUrl(series.poster_path)}
                        />
                    </div>
                    <div className="max-[1100px]:mt-10 w-[70%] max-[1100px]:w-full">
                        <div className="flex md:flex-col flex-row items-center md:items-start gap-x-2">
                            <div className="rounded-lg backdrop-blur-md h-fit bg-black/20 w-fit px-2.5 py-1 text-[#BFBFBF] text-sm">
                                {series.genres?.[0]?.name || 'Драма'}
                            </div>
                            <div className="flex items-center gap-x-2 md:mt-2">
                                <div className="typeMovie rounded-md bg-[#2BB157] w-fit px-2.5 py-1 text-white text-sm uppercase">Сериал</div>
                                <div className="typeMovie rounded-md bg-[#4A90E2] w-fit px-2.5 py-1 text-white text-sm uppercase">HD</div>
                                <div className="text-white/60">16+</div>
                            </div>
                        </div>
                        
                        {series.number_of_seasons && (
                            <div className="flex gap-4 mt-4 text-[#BFBFBF] text-sm">
                                <span>Сезонов: <strong className="text-white">{series.number_of_seasons}</strong></span>
                                <span>Серий: <strong className="text-white">{series.number_of_episodes || '?'}</strong></span>
                                {series.status && (
                                    <span>Статус: <strong className="text-[#CAE962]">{series.status === 'Ended' ? 'Завершен' : 'Продолжается'}</strong></span>
                                )}
                            </div>
                        )}

                        <h1 className='md:text-[50px] text-4xl font-bold w-fit my-4 leading-[1.1]'>{series.title || series.name}</h1>
                        <div className="flex items-center">
                            <svg width="43" height="22" viewBox="0 0 43 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M43 1.89083C42.8833 0.922265 42.1751 0.150295 41.2733 0C37.3203 0 5.69694 0 1.74393 0C0.756052 0.164717 0 1.07484 0 2.17169C0 3.935 0 18.0384 0 19.801C0 21.0155 0.925061 22 2.06699 22C5.95494 22 37.0623 22 40.9502 22C42.0017 22 42.8699 21.1643 43 20.0826C43 16.4444 43 3.70955 43 1.89083Z" fill="#F6C700"></path>
                                <path fillRule="evenodd" clipRule="evenodd" d="..." fill="black"></path>
                            </svg>
                            <span className='pl-2'>{series.vote_average ? series.vote_average.toFixed(1) : '0.0'}</span>
                            <span className='flex items-center relative before:w-1 before:h-1 before:bg-white/30 before:rounded-full before:absolute before:-left-1/2 ml-8 text-white/60'>
                                {series.first_air_date ? series.first_air_date.split('-')[0] : 'N/A'}
                            </span>
                        </div>
                        <p className='text-lg text-[#BFBFBF] my-8 xl:w-4/5 leading-[1.2] line-clamp-3'>
                            {series.overview || "Описание отсутствует."}
                        </p>
                        <ul className='flex md:flex-row flex-col gap-x-8 gap-y-2 md:items-center'>
                            {series.credits?.cast?.slice(0, 3).map(person => (
                                <li key={person.id}>
                                    <Link href="#" className='text-white hover:text-[#ff1414] transition-all duration-300'>
                                        {person.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>
            
            {series.images?.backdrops && series.images.backdrops.length > 0 && (
                <FramesSlider images={series.images.backdrops} />
            )}
            
            <DetailTabs media={series} type="tv" />
        </main>
    );
}
