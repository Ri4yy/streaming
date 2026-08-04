import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import DetailActions from '@/components/DetailActions';
import DetailTabs from '@/components/DetailTabs';
import { tmdbApi } from '@/services/tmdb';

export default async function AnimeDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const anime = await tmdbApi.getDetails(id, 'tv');

    return (  
        <main className='-mt-20'>
            <section className='pt-[120px] max-[1100px]:pb-20 bg-[url(/img/bg.png)] bg-no-repeat bg-cover bg-center w-full min-[1100px]:h-screen md:min-h-[800px] flex flex-col justify-center relative after:absolute after:top-0 after:left-0 after:backdrop-blur-md after:z-10 after:w-full after:h-full overflow-hidden'>
                <div className="container flex max-[1100px]:flex-col gap-x-20 items-center z-20">
                    <div className="max-[1100px]:mt-[160px] w-[30%] h-full max-[1100px]:w-full relative pb-32">
                        <Image src={tmdbApi.getImageUrl(anime.poster_path)} alt="Poster" width={500} height={750} className='rounded-xl w-full object-cover h-[300px] min-[1100px]:h-full' />
                        <DetailActions 
                            id={anime.id} 
                            type="anime" 
                            title={anime.title || anime.name || ''} 
                            coverUrl={tmdbApi.getImageUrl(anime.poster_path)}
                        />
                    </div>
                    <div className="max-[1100px]:mt-10 w-[70%] max-[1100px]:w-full">
                        <div className="flex md:flex-col flex-row items-center md:items-start gap-x-2">
                            <div className="rounded-lg backdrop-blur-md h-fit bg-black/20 w-fit px-2.5 py-1 text-[#BFBFBF] text-sm">
                                {anime.genres?.[0]?.name || 'Фантастика'}
                            </div>
                            <div className="flex items-center gap-x-2 md:mt-2">
                                <div className="typeMovie rounded-md bg-[#CAE962] w-fit px-2.5 py-1 text-black font-bold text-sm uppercase">Аниме</div>
                                <div className="typeMovie rounded-md bg-[#4A90E2] w-fit px-2.5 py-1 text-white text-sm uppercase">HD</div>
                                <div className="text-white/60">16+</div>
                            </div>
                        </div>

                        {anime.number_of_seasons && (
                            <div className="flex gap-4 mt-4 text-[#BFBFBF] text-sm">
                                <span>Сезонов: <strong className="text-white">{anime.number_of_seasons}</strong></span>
                                <span>Серий: <strong className="text-white">{anime.number_of_episodes || '?'}</strong></span>
                                {anime.status && (
                                    <span>Статус: <strong className="text-[#CAE962]">{anime.status === 'Ended' ? 'Завершен' : 'Продолжается'}</strong></span>
                                )}
                            </div>
                        )}

                        <h1 className='md:text-[50px] text-4xl font-bold w-fit my-4 leading-[1.1]'>{anime.title || anime.name}</h1>
                        <div className="flex items-center">
                            <svg width="43" height="22" viewBox="0 0 43 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M43 1.89083C42.8833 0.922265 42.1751 0.150295 41.2733 0C37.3203 0 5.69694 0 1.74393 0C0.756052 0.164717 0 1.07484 0 2.17169C0 3.935 0 18.0384 0 19.801C0 21.0155 0.925061 22 2.06699 22C5.95494 22 37.0623 22 40.9502 22C42.0017 22 42.8699 21.1643 43 20.0826C43 16.4444 43 3.70955 43 1.89083Z" fill="#F6C700"></path>
                                <path fillRule="evenodd" clipRule="evenodd" d="..." fill="black"></path>
                            </svg>
                            <span className='pl-2'>{anime.vote_average ? anime.vote_average.toFixed(1) : '0.0'}</span>
                            <span className='flex items-center relative before:w-1 before:h-1 before:bg-white/30 before:rounded-full before:absolute before:-left-1/2 ml-8 text-white/60'>
                                {anime.first_air_date ? anime.first_air_date.split('-')[0] : 'N/A'}
                            </span>
                        </div>
                        <p className='text-lg text-[#BFBFBF] my-8 xl:w-4/5 leading-[1.2] line-clamp-3'>
                            {anime.overview || "Описание отсутствует."}
                        </p>
                        <ul className='flex md:flex-row flex-col gap-x-8 gap-y-2 md:items-center'>
                            {anime.credits?.cast?.slice(0, 3).map(person => (
                                <li key={person.id}>
                                    <Link href="#" className='text-white hover:text-[#CAE962] transition-all duration-300'>
                                        {person.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>
            
            {anime.images?.backdrops && anime.images.backdrops.length > 0 && (
                <section className='container py-12'>
                    <h2 className='text-2xl font-bold mb-6'>Кадры</h2>
                    <div className='flex overflow-x-auto gap-4 pb-4 snap-x'>
                        {anime.images.backdrops.map((backdrop: any, idx: number) => (
                            <div key={idx} className='flex-none w-[300px] md:w-[450px] snap-center rounded-xl overflow-hidden'>
                                <Image
                                    src={tmdbApi.getImageUrl(backdrop.file_path, 'original')}
                                    alt={`Кадр ${idx + 1}`}
                                    width={450}
                                    height={253}
                                    className='w-full h-auto object-cover'
                                />
                            </div>
                        ))}
                    </div>
                </section>
            )}
            
            <DetailTabs media={anime} type="anime" />
        </main>
    );
}
