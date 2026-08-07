import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import MediaCard from '@/components/MediaCard';
import CatalogFilters from '@/components/CatalogFilters';
import { tmdbApi } from '@/services/tmdb';

import LoadMoreGrid from '@/components/LoadMoreGrid';
import WeeklySlider from '@/components/WeeklySlider';


export const metadata: Metadata = {
    title: "Фильмы",
    description: "Смотреть и искать лучшие фильмы в высоком качестве.",
};

export default async function MoviesPage({ searchParams }: { searchParams: Promise<{ q?: string, sort?: string, genres?: string, page?: string, yearMin?: string, yearMax?: string, ratingMin?: string, ratingMax?: string }> }) {
    const { q, sort, genres, page: pageParam, yearMin, yearMax, ratingMin, ratingMax } = await searchParams;
    const page = parseInt(pageParam || '1');

    let allMovies = [];
    let totalPages = 1;

    // TMDB genre IDs for movies
    let arrGenre = [
        { id: 28, name: 'Боевики' }, { id: 37, name: 'Вестерны' }, { id: 10752, name: 'Военное' },
        { id: 9648, name: 'Детективы' }, { id: 99, name: 'Документальное' }, { id: 35, name: 'Комедия' },
        { id: 18, name: 'Драма' }, { id: 80, name: 'Криминал' }, { id: 27, name: 'Ужасы' },
        { id: 53, name: 'Триллеры' }, { id: 14, name: 'Фэнтези' }, { id: 878, name: 'Фантастика' }
    ];

    if (q) {
        const searchRes = await tmdbApi.searchPaginated(q, 'movie', page);
        allMovies = searchRes.results;
        totalPages = searchRes.total_pages;
    } else {
        const options: Record<string, string> = {};

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
            if (sort === 'date') options.sort_by = 'primary_release_date.desc';
            if (sort === 'date_asc') options.sort_by = 'primary_release_date.asc';
            // Need minimum vote count for rating sorts to make sense
            if (sort.includes('rating')) options['vote_count.gte'] = '100';
        } else {
            options.sort_by = 'popularity.desc';
        }

        if (yearMin) options['primary_release_date.gte'] = `${yearMin}-01-01`;
        if (yearMax) options['primary_release_date.lte'] = `${yearMax}-12-31`;
        if (ratingMin) options['vote_average.gte'] = ratingMin;
        if (ratingMax) options['vote_average.lte'] = ratingMax;
        if (ratingMin || ratingMax) options['vote_count.gte'] = '10'; // Ensure we don't get 10.0 ratings with 1 vote

        const discoverRes = await tmdbApi.getDiscoverPaginated('movie', options, page);
        allMovies = discoverRes.results;
        totalPages = discoverRes.total_pages;
    }

    // Weekly slider items (only on first page, or always?)
    const trendingRes = await tmdbApi.getTrending('movie', 'week', 1);
    const weeklyMovies = trendingRes.results.slice(0, 20);

    const heroMovie = allMovies.length > 0 ? allMovies[0] : null;
    let paginatedMovies = allMovies.length > 0 ? (q ? allMovies : allMovies.slice(1)) : [];

    return (
        <main>
            <section className='lg:px-[80px] md:px-10 px-5 pt-[120px]'>
                <div className="rounded-2xl h-[700px] w-full relative overflow-hidden flex items-center justify-center">
                    <Image
                        src={tmdbApi.getImageUrl(heroMovie?.backdrop_path || heroMovie?.poster_path || null, 'original')}
                        alt="Hero"
                        fill
                        className="object-cover object-center z-0"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/20 z-0"></div>
                    <div className="absolute md:bottom-10 md:left-10 md:right-10 bottom-4 left-4 right-4 p-6 bg-black/40 backdrop-blur-3xl border border-white/10 rounded-2xl lg:max-w-[700px] shadow-2xl shadow-black/50 z-10">
                        <p className='md:text-5xl text-3xl font-bold mb-6 leading-[1.1] drop-shadow-lg'>{heroMovie?.title || heroMovie?.name}</p>
                        
                        <div className='p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md shadow-inner'>
                            <p className='md:text-base text-sm text-white/90 line-clamp-3 leading-[1.5]'>
                                {heroMovie?.overview || "Описание отсутствует."}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className='container lg:pb-[120px] md:pb-14 pb-8'>
                {!q && (
                    <WeeklySlider items={weeklyMovies} type="movie" />
                )}

                <CatalogFilters genres={arrGenre} />

                <LoadMoreGrid
                    initialItems={paginatedMovies.map((movie: any) => ({
                        id: movie.id,
                        name: movie.title || movie.name || '',
                        year: movie.release_date ? movie.release_date.split('-')[0] : 'N/A',
                        genre: "Фильм",
                        rate: movie.vote_average || 0,
                        img: tmdbApi.getImageUrl(movie.poster_path),
                        type: 'movie',
                        href: `/movies/${movie.id}`
                    }))}
                    catalogType="movie"
                    totalPages={totalPages}
                />
            </section>
        </main>
    );
}
