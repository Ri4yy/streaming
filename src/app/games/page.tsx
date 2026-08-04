import React from 'react';
import Image from 'next/image';
import MediaCard from '@/components/MediaCard';
import CatalogFilters from '@/components/CatalogFilters';
import { steamApi } from '@/services/steam';

import Pagination from '@/components/Pagination';

export default async function GamesPage({ searchParams }: { searchParams: Promise<{ q?: string, sort?: string, genres?: string, page?: string }> }) {
    const { q, sort, genres: selectedGenresQuery, page: pageParam } = await searchParams;
    const page = parseInt(pageParam || '1');

    let allGames = [];
    
    if (q) {
        // Fetch real details for search results
        allGames = await steamApi.searchGamesWithDetails(q, 20);
        
        // Sort search results by date primarily (newest or unreleased first)
        allGames.sort((a: any, b: any) => {
            const getYear = (game: any) => {
                const parts = game.release_date?.date?.split(' ') || [];
                const year = parseInt(parts[parts.length - 1]);
                return isNaN(year) ? 9999 : year; // Unreleased or upcoming games often don't have a strict year, putting them first
            };
            return getYear(b) - getYear(a);
        });
    } else {
        // Получаем топовые игры со всеми деталями
        allGames = await steamApi.getGamesWithDetails(60);
    }

    // Первая игра для Hero-баннера
    const heroGame = allGames.length > 0 ? allGames[0] : null;
    // Keep the hero game in the grid if searching so users don't miss it
    let gamesList = allGames.length > 0 ? (q ? allGames : allGames.slice(1)) : [];

    // Извлекаем все уникальные жанры из загруженных игр для фильтра (только если не поиск, так как поиск возвращает фейковые данные)
    const allGenres = q ? [] : Array.from(new Set(allGames.flatMap((g: any) => g.genres?.map((genre: any) => genre.description) || [])));
    const arrGenre = allGenres.map((name, index) => ({ id: index + 1, name: name as string }));

    // Local filter by query is removed since we use API search now

    // Filter by genres
    if (selectedGenresQuery) {
        const selectedGenres = selectedGenresQuery.split(',');
        gamesList = gamesList.filter((game: any) => {
            const gameGenres = game.genres?.map((g: any) => g.description) || [];
            return selectedGenres.some((g: string) => gameGenres.includes(g));
        });
    }

    // Sort
    if (sort) {
        gamesList.sort((a: any, b: any) => {
            const getScore = (game: any) => game.metacritic?.score || 0;
            if (sort === 'rating') return getScore(b) - getScore(a);
            if (sort === 'rating_asc') return getScore(a) - getScore(b);
            
            // Very rough date parsing, as Steam returns localized strings or different formats
            const getYear = (game: any) => {
                const parts = game.release_date?.date?.split(' ') || [];
                const year = parseInt(parts[parts.length - 1]);
                return isNaN(year) ? 0 : year;
            };
            
            if (sort === 'date') return getYear(b) - getYear(a);
            if (sort === 'date_asc') return getYear(a) - getYear(b);
            
            return 0;
        });
    }

    const ITEMS_PER_PAGE = 20;
    const totalPages = Math.ceil(gamesList.length / ITEMS_PER_PAGE);
    const paginatedGames = gamesList.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

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

                <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 xs:grid-cols-2 mt-20 gap-x-5 gap-y-9">
                    {paginatedGames.length > 0 ? paginatedGames.map((game: any) => (
                        <MediaCard
                            key={game.steam_appid}
                            id={game.steam_appid}
                            name={game.name}
                            year={game.release_date?.date?.split(' ')[2] || game.release_date?.date?.split(',')[1]?.trim() || ''}
                            genre={game.genres?.[0]?.description || "Игра"}
                            rate={game.metacritic?.score ? game.metacritic.score / 10 : 0} // Scale 100 to 10
                            img={steamApi.getVerticalImage(game.steam_appid)}
                            type="game"
                            href={`/games/${game.steam_appid}`}
                        />
                    )) : (
                        <p className="text-gray-400 col-span-full">Ничего не найдено.</p>
                    )}
                </div>
                
                {totalPages > 1 && <Pagination totalPages={totalPages} />}
            </section>
        </main>
    );
}
