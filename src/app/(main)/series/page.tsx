import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import MediaCard from '@/components/MediaCard';
import CatalogFilters from '@/components/CatalogFilters';
import { tmdbApi } from '@/services/tmdb';

import LoadMoreGrid from '@/components/LoadMoreGrid';
import WeeklySlider from '@/components/WeeklySlider';


export const metadata: Metadata = {
    title: "Лучшие сериалы: популярные проекты, новинки и даты выхода серий",
    description: "Лучшие сериалы со всего мира на CineBox. Узнайте даты выхода новых серий, читайте отзывы и рецензии, изучайте актерский состав и рейтинг.",
    openGraph: {
        title: "Лучшие сериалы на CineBox",
        description: "Лучшие сериалы со всего мира. Узнайте даты выхода новых серий, читайте отзывы и изучайте рейтинг.",
    }
};

export default async function SeriesPage({ searchParams }: { searchParams: Promise<{ q?: string, sort?: string, genres?: string, page?: string, yearMin?: string, yearMax?: string, ratingMin?: string, ratingMax?: string }> }) {
    const { q, sort, genres, page: pageParam, yearMin, yearMax, ratingMin, ratingMax } = await searchParams;
    const page = parseInt(pageParam || '1');

    let allSeries = [];
    let totalPages = 1;

    // TMDB genre IDs for TV
    let arrGenre = [
        { id: 10759, name: 'Боевики' }, { id: 37, name: 'Вестерны' }, { id: 10768, name: 'Военное' },
        { id: 9648, name: 'Детективы' }, { id: 99, name: 'Документальное' }, { id: 35, name: 'Комедия' },
        { id: 18, name: 'Драма' }, { id: 80, name: 'Криминал' }, { id: 10765, name: 'Фантастика' },
        { id: 10751, name: 'Семейное' }, { id: 10762, name: 'Детское' }, { id: 10767, name: 'Ток-шоу' }
    ];

    if (q) {
        const searchRes = await tmdbApi.searchPaginated(q, 'tv', page);
        allSeries = searchRes.results.filter((item: any) => !item.genre_ids?.includes(16));
        totalPages = searchRes.total_pages;
    } else {
        const options: Record<string, string> = {
            without_genres: '16', // Exclude Anime
            without_original_language: 'zh,th,hi,ar,tl,te,ta,jp', // Exclude CN, TH, IN, EG, PH
            'vote_count.gte': '150' // Filter out daily local soaps that have high popularity but no votes
        };

        if (genres) {
            const selectedGenreNames = genres.split(',');
            const selectedGenreIds = arrGenre
                .filter(g => selectedGenreNames.includes(g.name))
                .map(g => g.id);
            if (selectedGenreIds.length > 0) {
                options.with_genres = selectedGenreIds.join(',');
            }
        }

        if (sort) {
            if (sort === 'rating') options.sort_by = 'vote_average.desc';
            if (sort === 'rating_asc') options.sort_by = 'vote_average.asc';
            if (sort === 'date') options.sort_by = 'first_air_date.desc';
            if (sort === 'date_asc') options.sort_by = 'first_air_date.asc';
            if (sort.includes('rating')) options['vote_count.gte'] = '100';
        } else {
            options.sort_by = 'popularity.desc';
        }

        if (yearMin) {
            options['first_air_date.gte'] = `${yearMin}-01-01`;
        } else {
            const currentYear = new Date().getFullYear();
            options['first_air_date.gte'] = `${currentYear - 6}-01-01`;
        }
        if (yearMax) options['first_air_date.lte'] = `${yearMax}-12-31`;
        if (ratingMin) options['vote_average.gte'] = ratingMin;
        if (ratingMax) options['vote_average.lte'] = ratingMax;
        if (ratingMin || ratingMax) options['vote_count.gte'] = '10';

        const discoverRes = await tmdbApi.getDiscoverPaginated('tv', options, page);
        allSeries = discoverRes.results;
        totalPages = discoverRes.total_pages;
    }

    // Weekly slider items
    const trendingRes = await tmdbApi.getTrending('tv', 'week', 1);
    const weeklySeries = trendingRes.results.filter((item: any) => !item.genre_ids?.includes(16)).slice(0, 20);

    const heroSeries = allSeries.length > 0 ? allSeries[0] : null;
    let paginatedSeries = allSeries.length > 0 ? (q ? allSeries : allSeries.slice(1)) : [];

    return (
        <main>
            <section className='lg:px-[80px] md:px-10 px-5 pt-[120px]'>
                <div className="rounded-2xl h-[700px] w-full relative overflow-hidden flex items-center justify-center">
                    <Image
                        src={tmdbApi.getImageUrl(heroSeries?.backdrop_path || heroSeries?.poster_path || null, 'original')}
                        alt="Hero"
                        fill
                        className="object-cover object-center z-0"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/20 z-0"></div>
                    <div className="absolute md:bottom-10 md:left-10 md:right-10 bottom-4 left-4 right-4 p-6 bg-black/40 backdrop-blur-3xl border border-white/10 rounded-2xl lg:max-w-[700px] shadow-2xl shadow-black/50 z-10">
                        <p className='md:text-5xl text-3xl font-bold mb-6 leading-[1.1] drop-shadow-lg'>{heroSeries?.title || heroSeries?.name}</p>

                        <div className='p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md shadow-inner'>
                            <p className='md:text-base text-sm text-white/90 line-clamp-3 leading-[1.5]'>
                                {heroSeries?.overview || "Описание отсутствует."}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className='container lg:pb-[120px] md:pb-14 pb-8 pt-4'>
                {!q && (
                    <WeeklySlider items={weeklySeries} type="tv" title="Новинки недели" />
                )}

                <CatalogFilters genres={arrGenre} />

                <LoadMoreGrid
                    initialItems={paginatedSeries.map((series: any) => ({
                        id: series.id,
                        name: series.title || series.name || '',
                        year: series.first_air_date ? series.first_air_date.split('-')[0] : 'N/A',
                        genre: "Сериал",
                        rate: series.vote_average || 0,
                        img: tmdbApi.getImageUrl(series.poster_path),
                        type: 'tv',
                        href: `/series/${series.id}`
                    }))}
                    catalogType="tv"
                    totalPages={totalPages}
                />
            </section>
        </main>
    );
}
