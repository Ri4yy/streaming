import React from 'react';
import Image from 'next/image';
import MediaCard from '@/components/MediaCard';
import CatalogFilters from '@/components/CatalogFilters';
import { steamApi } from '@/services/steam';

import Pagination from '@/components/Pagination';
import WeeklySlider from '@/components/WeeklySlider';

export default async function GamesPage({ searchParams }: { searchParams: Promise<{ q?: string, sort?: string, genres?: string, page?: string }> }) {
    const { q, sort, genres: selectedGenresQuery, page: pageParam } = await searchParams;
    const page = parseInt(pageParam || '1');

    let allGames: any[] = [];
    let weeklyGamesRaw: any[] = [];
    let bestOf2026Raw: any[] = [];
    let totalPages = 1;
    
    if (q) {
        // Fetch real details for search results
        allGames = await steamApi.searchGamesWithDetails(q, 20);
        
        // Sort search results by date primarily (newest or unreleased first)
        allGames.sort((a: any, b: any) => {
            const getYear = (game: any) => {
                const dateStr = game.release_date?.date || '';
                const match = dateStr.match(/\b(19\d{2}|20\d{2})\b/);
                if (match) {
                    return parseInt(match[1], 10);
                }
                return game.release_date?.coming_soon ? 9999 : 0;
            };
            return getYear(b) - getYear(a);
        });
    } else {
        // Получаем игры для текущей страницы
        const [gamesRes, weeklyRes, bestOf2026Res] = await Promise.all([
            steamApi.getGamesWithDetails(page, 20),
            steamApi.getAnticipatedGames(20),
            steamApi.getBestGamesOf2026(20)
        ]);
        allGames = gamesRes.results;
        totalPages = gamesRes.total_pages;
        weeklyGamesRaw = weeklyRes;
        bestOf2026Raw = bestOf2026Res;
    }

    // Первая игра для Hero-баннера
    const heroGame = allGames.length > 0 ? allGames[0] : null;

    const extractYear = (dateStr: string) => {
        const match = dateStr?.match(/\b(19\d{2}|20\d{2})\b/);
        return match ? match[1] : '';
    };
    
    // Новинки недели (первые 8 игр из официального API стима - релизы этой недели + coming soon)
    const weeklyGames = weeklyGamesRaw.length > 0 ? weeklyGamesRaw.map(game => ({
        ...game,
        id: game.steam_appid,
        title: game.name,
        release_date: extractYear(game.release_date?.date || ''),
        rate: game.metacritic?.score ? game.metacritic.score / 10 : 0,
        img: steamApi.getVerticalImage(game.steam_appid),
        fallbackImg: game.header_image
    })) : [];

    const bestOf2026Games = bestOf2026Raw.length > 0 ? bestOf2026Raw.map(game => ({
        ...game,
        id: game.steam_appid,
        title: game.name,
        release_date: extractYear(game.release_date?.date || ''),
        rate: game.metacritic?.score ? game.metacritic.score / 10 : 0,
        img: steamApi.getVerticalImage(game.steam_appid),
        fallbackImg: game.header_image
    })) : [];

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
                const dateStr = game.release_date?.date || '';
                const match = dateStr.match(/\b(19\d{2}|20\d{2})\b/);
                if (match) {
                    return parseInt(match[1], 10);
                }
                return game.release_date?.coming_soon ? 9999 : 0;
            };
            
            if (sort === 'date') return getYear(b) - getYear(a);
            if (sort === 'date_asc') return getYear(a) - getYear(b);
            
            return 0;
        });
    }

    // We don't slice paginatedGames anymore, as allGames only contains current page items
    const paginatedGames = gamesList;

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

            <section className='container lg:pb-[120px] md:pb-14 pb-8'>
                {!q && !selectedGenresQuery && !sort && weeklyGames.length > 0 && (
                    <WeeklySlider items={weeklyGames} type="game" title="Ожидаемые новинки" />
                )}
                
                {!q && !selectedGenresQuery && !sort && bestOf2026Games.length > 0 && (
                    <div className="mt-10">
                        <WeeklySlider items={bestOf2026Games} type="game" title="Лучшие новинки (2026)" />
                    </div>
                )}
                
                <CatalogFilters genres={arrGenre} />

                <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 xs:grid-cols-2 mt-20 gap-x-5 gap-y-9">
                    {paginatedGames.length > 0 ? paginatedGames.map((game: any, index: number) => (
                        <MediaCard
                            key={`${game.steam_appid}-${index}`}
                            id={game.steam_appid}
                            name={game.name}
                            year={extractYear(game.release_date?.date || '')}
                            genre={game.genres?.[0]?.description || "Игра"}
                            rate={game.rate || (game.metacritic?.score ? game.metacritic.score / 10 : 0)} 
                            img={steamApi.getVerticalImage(game.steam_appid)} 
                            fallbackImg={game.header_image}
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
