import React from 'react';
import Image from 'next/image';
import MediaCard from '@/components/MediaCard';
import CatalogFilters from '@/components/CatalogFilters';
import { steamApi } from '@/services/steam';

export default async function GamesPage() {
    // Получаем 20 топовых игр со всеми деталями
    const games = await steamApi.getGamesWithDetails(24);

    // Первая игра для Hero-баннера
    const heroGame = games.length > 0 ? games[0] : null;
    const gamesList = games.length > 0 ? games.slice(1) : [];

    // Извлекаем все уникальные жанры из загруженных игр для фильтра
    const allGenres = Array.from(new Set(games.flatMap(g => g.genres?.map(genre => genre.description) || [])));
    const arrGenre = allGenres.map((name, index) => ({ id: index + 1, name }));

    return (
        <main className='-mt-20'>
            <section className='lg:px-[80px] md:px-10 px-5 pt-[100px]'>
                <div className="bg-[#1E1E20] rounded-2xl h-[700px] w-full relative overflow-hidden flex items-center justify-center">
                    {heroGame && (
                        <Image
                            src={steamApi.getHeroImage(heroGame.steam_appid)}
                            alt={heroGame.name}
                            fill
                            className="object-cover object-center z-0 opacity-80"
                            priority
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-0"></div>

                    {heroGame && (
                        <div className="absolute md:bottom-5 md:left-5 md:right-5 bottom-0 px-4 py-2.5 bg-black/60 backdrop-blur-md rounded-xl lg:max-w-[700px] z-10">
                            <p className='text-[#CAE962] text-xl font-bold mb-1'>{heroGame.genres?.[0]?.description || 'Игра'}</p>
                            <p className='md:text-4xl text-2xl font-bold mb-3 leading-[1.1]'>{heroGame.name}</p>

                            <div className="flex items-center gap-4 mb-4">
                                {heroGame.metacritic && (
                                    <span className="bg-[#F6C700] text-black px-2 py-0.5 rounded font-bold text-sm">Metacritic: {heroGame.metacritic.score}</span>
                                )}
                            </div>

                            <div className='p-3 rounded-md bg-white/20 backdrop-blur-sm'>
                                <p className='md:text-base text-sm text-[#F8F7F9]/100 line-clamp-3 leading-[1.3]'>
                                    {heroGame.short_description || "Описание отсутствует."}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <section className='container lg:py-[120px] md:py-14 py-8'>
                <CatalogFilters genres={arrGenre} />

                <div className="grid xl:grid-cols-4 lg:grid-cols-3 xs:grid-cols-2 mt-20 gap-x-5 gap-y-9">
                    {gamesList.map(game => (
                        <MediaCard
                            key={game.steam_appid}
                            name={game.name}
                            year={game.release_date?.date?.split(' ')[2] || game.release_date?.date?.split(',')[1]?.trim() || ''}
                            genre={game.genres?.[0]?.description || "Игра"}
                            rate={game.metacritic?.score ? game.metacritic.score / 10 : 0} // Scale 100 to 10
                            img={steamApi.getVerticalImage(game.steam_appid)}
                            type="game"
                            href={`/games/${game.steam_appid}`}
                        />
                    ))}
                </div>
            </section>
        </main>
    );
}
