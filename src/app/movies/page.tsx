import React from 'react';
import Image from 'next/image';
import MediaCard from '@/components/MediaCard';
import CatalogFilters from '@/components/CatalogFilters';
import { tmdbApi } from '@/services/tmdb';

import Pagination from '@/components/Pagination';
import WeeklySlider from '@/components/WeeklySlider';

export default async function MoviesPage({ searchParams }: { searchParams: Promise<{ q?: string, sort?: string, genres?: string, page?: string }> }) {
    const { q, sort, genres, page: pageParam } = await searchParams;
    const page = parseInt(pageParam || '1');

    let allMovies = [];
    let totalPages = 1;
    
    // TMDB genre IDs for movies
    let arrGenre = [
        {id: 28, name: 'Боевики'}, {id: 37, name: 'Вестерны'}, {id: 10752, name: 'Военное'},
        {id: 9648, name: 'Детективы'}, {id: 99, name: 'Документальное'}, {id: 35, name: 'Комедия'},
        {id: 18, name: 'Драма'}, {id: 80, name: 'Криминал'}, {id: 27, name: 'Ужасы'},
        {id: 53, name: 'Триллеры'}, {id: 14, name: 'Фэнтези'}, {id: 878, name: 'Фантастика'}
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
        <main className='-mt-20'>
            <section className='lg:px-[80px] md:px-10 px-5 pt-[100px]'>
                <div className="rounded-2xl h-[700px] w-full relative overflow-hidden flex items-center justify-center">
                    <Image 
                        src={tmdbApi.getImageUrl(heroMovie?.backdrop_path || heroMovie?.poster_path || null, 'original')}
                        alt="Hero"
                        fill
                        className="object-cover object-center z-0"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/20 z-0"></div>
                    <div className="absolute md:bottom-5 md:left-5 md:right-5 bottom-0 px-4 py-2.5 bg-black/60 backdrop-blur-md rounded-xl lg:max-w-[700px] z-10">
                        <p className='md:text-3xl text-xl font-medium mb-4'>{heroMovie?.title || heroMovie?.name}</p>
                        <p className='md:text-base text-xs text-[#e8dfde] line-clamp-3'>
                            {heroMovie?.overview || "Описание отсутствует."}
                        </p>
                    </div>
                </div>
            </section>

            <section className='container lg:pb-[120px] md:pb-14 pb-8'>
                {!q && !genres && !sort && (
                    <WeeklySlider items={weeklyMovies} type="movie" />
                )}
                
                <CatalogFilters genres={arrGenre} />
                <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 xs:grid-cols-2 mt-20 gap-x-5 gap-y-9">
                    {paginatedMovies.length > 0 ? paginatedMovies.map((movie, index) => (
                        <MediaCard 
                            key={`${movie.id}-${index}`}
                            id={movie.id}
                            name={movie.title || movie.name || ''} 
                            year={movie.release_date ? movie.release_date.split('-')[0] : 'N/A'} 
                            genre="Фильм" 
                            rate={movie.vote_average || 0} 
                            img={tmdbApi.getImageUrl(movie.poster_path)}
                            type="movie"
                            href={`/movies/${movie.id}`}
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
