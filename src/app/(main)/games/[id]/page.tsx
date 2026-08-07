import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import DetailActions from '@/components/DetailActions';
import { steamApi } from '@/services/steam';
import { notFound } from 'next/navigation';
import GameScreenshots from '@/components/GameScreenshots';
import GamePoster from '@/components/GamePoster';
import SimilarSlider from '@/components/SimilarSlider';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const game = await steamApi.getGameDetails(id);
    if (!game) return { title: 'Не найдено' };
    
    const rawDesc = game.short_description || game.detailed_description || '';
    const cleanDesc = rawDesc.replace(/<[^>]*>?/gm, '').substring(0, 160);
    
    return {
        title: game.name || 'Игра',
        description: cleanDesc || "Подробная информация об игре.",
    };
}

export default async function GameDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const game = await steamApi.getGameDetails(id);

    if (!game) {
        return notFound();
    }
    
    const similar = await steamApi.getSimilarGames(game);

    return (
        <main className="relative min-h-screen">
            <div className="fixed inset-0 z-0 pointer-events-none">
                <Image
                    src={game.background_raw || game.background || game.header_image}
                    alt={game.name}
                    fill
                    className="object-cover opacity-40 blur-md"
                    priority
                />
                <div className="absolute inset-0 bg-black/50"></div>
            </div>

            <div className="relative z-20">
                <section className='pb-20 pt-[120px] md:pt-[150px] w-full min-h-screen'>
                    <div className="container flex max-[1100px]:flex-col gap-x-20 items-start">
                    <div className="max-[1100px]:mt-[40px] w-[30%] h-full max-[1100px]:w-full relative sticky top-[120px]">
                        <div className="relative">
                            {/* Постер с фоллбеком */}
                            <GamePoster 
                                appId={game.steam_appid} 
                                name={game.name} 
                                initialSrc={steamApi.getVerticalImage(game.steam_appid)} 
                                fallbackSrc={game.header_image}
                            />
                            <Link 
                                href={`https://store.steampowered.com/app/${game.steam_appid}`} 
                                target="_blank" 
                                className="absolute top-4 left-4 z-50 bg-black/40 hover:bg-[#1b2838]/90 backdrop-blur-md border border-white/20 hover:border-[#66c0f4]/50 text-white rounded-xl px-4 py-2.5 flex items-center gap-2 transition-all duration-300 shadow-xl opacity-90 hover:opacity-100 group"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" className="fill-current group-hover:text-[#66c0f4] transition-colors">
                                    <path d="M11.979 0C5.353 0 0 5.373 0 12c0 6.628 5.353 12 11.979 12 6.628 0 12-5.372 12-12 0-6.627-5.372-12-12-12zm7.11 8.528c0 1.954-1.583 3.538-3.538 3.538-.28 0-.547-.034-.805-.094l-2.457 3.513v.163c0 2.126-1.724 3.85-3.85 3.85-2.125 0-3.85-1.724-3.85-3.85 0-2.125 1.725-3.85 3.85-3.85.962 0 1.84.354 2.518.94l2.585-3.693c-.113-.377-.184-.775-.184-1.189 0-1.954 1.584-3.537 3.538-3.537 1.954 0 3.537 1.583 3.537 3.537zm-7.253 7.108c-.765 1.488-2.656 2.073-4.143 1.31-1.487-.765-2.074-2.657-1.31-4.144.764-1.487 2.656-2.074 4.143-1.31 1.487.766 2.074 2.657 1.31 4.144zm4.143-6.505c-.328.638-1.14 1.02-1.776.693-.637-.327-1.02-1.139-.692-1.777.327-.637 1.14-1.019 1.777-.692.637.327 1.019 1.14.691 1.776z"/>
                                </svg>
                                <span className="font-semibold tracking-wide text-sm">Играть в Steam</span>
                            </Link>
                        </div>
                        <DetailActions 
                            id={game.steam_appid} 
                            type="game" 
                            title={game.name} 
                            coverUrl={game.header_image}
                        />
                    </div>
                    <div className="max-[1100px]:mt-10 w-[70%] max-[1100px]:w-full pr-4 pb-10">
                        <div className="flex md:flex-col flex-row items-center md:items-start gap-x-2">
                            <div className="rounded-lg backdrop-blur-md h-fit bg-black/40 w-fit px-2.5 py-1 text-[#BFBFBF] text-sm mb-2">
                                {game.developers?.[0] || 'Steam Game'}
                            </div>
                            <div className="flex items-center gap-x-2">
                                <div className="typeMovie rounded-md bg-[#CAE962] w-fit px-2.5 py-1 text-black font-bold text-sm uppercase">Игра</div>
                                <Link href={`https://store.steampowered.com/app/${game.steam_appid}`} target="_blank" className="typeMovie rounded-md bg-[#4A90E2] w-fit px-2.5 py-1 text-white text-sm uppercase hover:bg-blue-600 transition">В Steam</Link>
                            </div>
                        </div>
                        <h1 className='md:text-[50px] text-4xl font-bold w-fit my-4 leading-[1.1]'>{game.name}</h1>
                        <div className="flex items-center gap-4 flex-wrap mb-4">
                            {game.metacritic && (
                                <div className="bg-[#F6C700] text-black px-3 py-1 rounded-md font-bold">
                                    Metacritic: {game.metacritic.score}
                                </div>
                            )}
                            <div className="bg-white/20 text-white px-3 py-1 rounded-md font-medium text-sm">
                                Жанры: {game.genres?.map(g => g.description).join(', ')}
                            </div>
                        </div>
                        <div className='text-lg text-[#BFBFBF] my-6 xl:w-4/5 leading-[1.3] description-content' dangerouslySetInnerHTML={{ __html: game.detailed_description || game.short_description || '' }} />

                        {/* Трейлер */}
                        {game.movies && game.movies.length > 0 && (
                            <div className="mt-8 xl:w-4/5">
                                <h2 className="text-2xl font-bold mb-4">Трейлер:</h2>
                                <video
                                    controls
                                    poster={game.movies[0].thumbnail}
                                    className="w-full rounded-xl border border-white/10 shadow-lg"
                                >
                                    <source src={game.movies[0].mp4?.max || game.movies[0].mp4?.['480']} type="video/mp4" />
                                    <source src={game.movies[0].webm?.max || game.movies[0].webm?.['480']} type="video/webm" />
                                    Ваш браузер не поддерживает видео.
                                </video>
                            </div>
                        )}

                        {/* Скриншоты через клиентский компонент */}
                        <GameScreenshots screenshots={game.screenshots} />
                    </div>
                </div>
                
                <SimilarSlider items={similar} type="game" />
                </section>
            </div>
        </main>
    );
}
