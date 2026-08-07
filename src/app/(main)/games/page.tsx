import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import MediaCard from '@/components/MediaCard';
import CatalogFilters from '@/components/CatalogFilters';
import { steamApi } from '@/services/steam';

import LoadMoreGrid from '@/components/LoadMoreGrid';
import WeeklySlider from '@/components/WeeklySlider';


export const metadata: Metadata = {
    title: "Игры",
    description: "Каталог популярных видеоигр.",
};

export default async function GamesPage({ searchParams }: { searchParams: Promise<{ q?: string, sort?: string, genres?: string, page?: string, yearMin?: string, yearMax?: string, ratingMin?: string, ratingMax?: string }> }) {
    const { q, sort, genres: selectedGenresQuery, page: pageParam, yearMin, yearMax, ratingMin, ratingMax } = await searchParams;
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

    // Выбор игры для Hero-баннера
    let heroGame = null;
    let gamesList: any[] = [];

    if (allGames.length > 0) {
        if (q) {
            heroGame = allGames[0];
            gamesList = allGames; // При поиске оставляем игру в сетке
        } else {
            // Берем случайную игру из топ-10
            const topN = Math.min(allGames.length, 10);
            const randomIndex = Math.floor(Math.random() * topN);
            heroGame = allGames[randomIndex];

            // Оставляем игру в сетке, как просил пользователь
            gamesList = allGames;
        }
    }

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

    // Filter by year and rating
    if (yearMin || yearMax || ratingMin || ratingMax) {
        gamesList = gamesList.filter((game: any) => {
            const year = extractYear(game.release_date?.date || '');
            const score = game.metacritic?.score ? game.metacritic.score / 10 : 0;
            
            let pass = true;
            if (yearMin && year && parseInt(year, 10) < parseInt(yearMin, 10)) pass = false;
            if (yearMax && year && parseInt(year, 10) > parseInt(yearMax, 10)) pass = false;
            
            if (ratingMin && score < parseFloat(ratingMin)) pass = false;
            if (ratingMax && score > parseFloat(ratingMax)) pass = false;

            return pass;
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
        <main>
            <section className='lg:px-[80px] md:px-10 px-5 pt-[120px]'>
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
                        <div className="absolute md:bottom-10 md:left-10 md:right-10 bottom-4 left-4 right-4 p-6 bg-black/40 backdrop-blur-3xl border border-white/10 rounded-2xl lg:max-w-[700px] shadow-2xl shadow-black/50 z-10">
                            <p className='text-[#CAE962] text-xl font-bold mb-2 drop-shadow-md'>{heroGame.genres?.[0]?.description || 'Игра'}</p>
                            <p className='md:text-5xl text-3xl font-bold mb-4 leading-[1.1] drop-shadow-lg'>{heroGame.name}</p>

                            <div className="flex items-center gap-4 mb-6">
                                {heroGame.metacritic && (
                                    <span className="bg-[#F6C700] text-black px-3 py-1 rounded-md font-bold text-sm shadow-md">Metacritic: {heroGame.metacritic.score}</span>
                                )}
                            </div>

                            <div className='p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md shadow-inner'>
                                <p className='md:text-base text-sm text-white/90 line-clamp-3 leading-[1.5]'>
                                    {heroGame.short_description || "Описание отсутствует."}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <section className='container lg:pb-[120px] md:pb-14 pb-8 pt-4'>
                {!q && weeklyGames.length > 0 && (
                    <WeeklySlider items={weeklyGames} type="game" title="Ожидаемые новинки" />
                )}

                {!q && bestOf2026Games.length > 0 && (
                    <div className="mt-10">
                        <WeeklySlider items={bestOf2026Games} type="game" title="Лучшие новинки (2026)" />
                    </div>
                )}

                <CatalogFilters genres={arrGenre} hideYear={true} hideRating={true} />

                <LoadMoreGrid
                    initialItems={paginatedGames.map((game: any) => ({
                        id: game.steam_appid,
                        name: game.name,
                        year: extractYear(game.release_date?.date || ''),
                        genre: game.genres?.[0]?.description || "Игра",
                        rate: game.rate || (game.metacritic?.score ? game.metacritic.score / 10 : 0),
                        img: steamApi.getVerticalImage(game.steam_appid),
                        fallbackImg: game.header_image,
                        type: 'game',
                        href: `/games/${game.steam_appid}`
                    }))}
                    catalogType="game"
                    totalPages={totalPages}
                />
            </section>
        </main>
    );
}
