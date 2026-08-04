import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import DetailActions from '@/components/DetailActions';
import { steamApi } from '@/services/steam';
import { notFound } from 'next/navigation';
import GameScreenshots from '@/components/GameScreenshots';

export default async function GameDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const game = await steamApi.getGameDetails(id);

    if (!game) {
        return notFound();
    }

    return (
        <main className='-mt-20'>
            <section className='pb-20 pt-[120px] md:pt-[150px] bg-no-repeat bg-cover bg-center w-full min-h-screen relative overflow-hidden'>
                <Image
                    src={game.background_raw || game.background || game.header_image}
                    alt={game.name}
                    fill
                    className="absolute top-0 object-cover object-center z-0 opacity-40 blur-md !h-auto"
                    priority
                />
                <div className="absolute inset-0 bg-black/50 z-10"></div>
                <div className="container flex max-[1100px]:flex-col gap-x-20 items-start z-20 relative">
                    <div className="max-[1100px]:mt-[40px] w-[30%] h-full max-[1100px]:w-full relative sticky top-[120px]">
                        {/* Изменено на 9/16 постер */}
                        <Image src={steamApi.getVerticalImage(game.steam_appid)} alt={game.name} width={600} height={900} className='rounded-xl w-full h-[600px] object-cover border border-white/10' />
                        <DetailActions 
                            id={game.steam_appid} 
                            type="game" 
                            title={game.name} 
                            coverUrl={steamApi.getVerticalImage(game.steam_appid)}
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
            </section>
        </main>
    );
}
