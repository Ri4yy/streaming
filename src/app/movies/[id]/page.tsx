import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import DetailActions from '@/components/DetailActions';
import DetailTabs from '@/components/DetailTabs';
import FramesSlider from '@/components/FramesSlider';
import { tmdbApi } from '@/services/tmdb';

export default async function MovieDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const movie = await tmdbApi.getDetails(id, 'movie');

    return (  
        <main className='-mt-20'>
            <section className='pt-[120px] max-[1100px]:pb-20 bg-[url(/img/bg.png)] bg-no-repeat bg-cover bg-center w-full min-[1100px]:h-screen md:min-h-[800px] flex flex-col justify-center relative after:absolute after:top-0 after:left-0 after:backdrop-blur-md after:z-10 after:w-full after:h-full overflow-hidden'>
                <div className="container flex max-[1100px]:flex-col gap-x-20 items-center z-20">
                    <div className="max-[1100px]:mt-[160px] w-[30%] h-full max-[1100px]:w-full relative pb-32">
                        <Image src={tmdbApi.getImageUrl(movie.poster_path)} alt="Poster" width={500} height={750} className='rounded-xl w-full object-cover h-[300px] min-[1100px]:h-full' />
                        <DetailActions 
                            id={movie.id} 
                            type="movie" 
                            title={movie.title || movie.name || ''} 
                            coverUrl={tmdbApi.getImageUrl(movie.poster_path)}
                        />
                    </div>
                    <div className="max-[1100px]:mt-10 w-[70%] max-[1100px]:w-full">
                        <div className="flex md:flex-col flex-row items-center md:items-start gap-x-2">
                            <div className="rounded-lg backdrop-blur-md h-fit bg-black/20 w-fit px-2.5 py-1 text-[#BFBFBF] text-sm">
                                {movie.genres?.[0]?.name || 'Фантастика'}
                            </div>
                            <div className="flex items-center gap-x-2 md:mt-2">
                                <div className="typeMovie rounded-md bg-[#2BB157] w-fit px-2.5 py-1 text-white text-sm uppercase">Фильм</div>
                                <div className="typeMovie rounded-md bg-[#4A90E2] w-fit px-2.5 py-1 text-white text-sm uppercase">4K</div>
                                <div className="text-white/60">12+</div>
                            </div>
                        </div>
                        <h1 className='md:text-[50px] text-4xl font-bold w-fit my-4 leading-[1.1]'>{movie.title || movie.name}</h1>
                        <div className="flex items-center">
                            <svg width="43" height="22" viewBox="0 0 43 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M43 1.89083C42.8833 0.922265 42.1751 0.150295 41.2733 0C37.3203 0 5.69694 0 1.74393 0C0.756052 0.164717 0 1.07484 0 2.17169C0 3.935 0 18.0384 0 19.801C0 21.0155 0.925061 22 2.06699 22C5.95494 22 37.0623 22 40.9502 22C42.0017 22 42.8699 21.1643 43 20.0826C43 16.4444 43 3.70955 43 1.89083Z" fill="#F6C700"></path>
                                <path fillRule="evenodd" clipRule="evenodd" d="..." fill="black"></path>
                            </svg>
                            <span className='pl-2'>{movie.vote_average ? movie.vote_average.toFixed(1) : '0.0'}</span>
                            <span className='flex items-center relative before:w-1 before:h-1 before:bg-white/30 before:rounded-full before:absolute before:-left-1/2 ml-8 text-white/60'>
                                {movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}
                            </span>
                        </div>
                        <p className='text-lg text-[#BFBFBF] my-8 xl:w-4/5 leading-[1.2] line-clamp-3'>
                            {movie.overview || "Описание отсутствует."}
                        </p>
                        <ul className='flex md:flex-row flex-col gap-x-8 gap-y-2 md:items-center'>
                            {movie.credits?.cast?.slice(0, 3).map(person => (
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

            {movie.images?.backdrops && movie.images.backdrops.length > 0 && (
                <FramesSlider images={movie.images.backdrops} />
            )}
            
            <DetailTabs media={movie} type="movie" />
        </main>
    );
}
 
