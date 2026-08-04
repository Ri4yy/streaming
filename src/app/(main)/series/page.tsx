import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import MediaCard from '@/components/MediaCard';
import CatalogFilters from '@/components/CatalogFilters';
import { tmdbApi } from '@/services/tmdb';

import Pagination from '@/components/Pagination';
import WeeklySlider from '@/components/WeeklySlider';


export const metadata: Metadata = {
  title: "Сериалы",
  description: "Популярные сериалы, новинки и классика.",
};

export default async function SeriesPage({ searchParams }: { searchParams: Promise<{ q?: string, sort?: string, genres?: string, page?: string }> }) {
    const { q, sort, genres, page: pageParam } = await searchParams;
    const page = parseInt(pageParam || '1');

    let allSeries = [];
    let totalPages = 1;
    
    // TMDB genre IDs for TV
    let arrGenre = [
        {id: 10759, name: 'Боевики'}, {id: 37, name: 'Вестерны'}, {id: 10768, name: 'Военное'},
        {id: 9648, name: 'Детективы'}, {id: 99, name: 'Документальное'}, {id: 35, name: 'Комедия'},
        {id: 18, name: 'Драма'}, {id: 80, name: 'Криминал'}, {id: 10765, name: 'Фантастика'},
        {id: 10751, name: 'Семейное'}, {id: 10762, name: 'Детское'}, {id: 10767, name: 'Ток-шоу'}
    ];

    if (q) {
        const searchRes = await tmdbApi.searchPaginated(q, 'tv', page);
        allSeries = searchRes.results.filter((item: any) => !item.genre_ids?.includes(16));
        totalPages = searchRes.total_pages;
    } else {
        const options: Record<string, string> = {
            without_genres: '16' // Exclude Anime
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
            // Default trending or popular for series, let's sort by date descending of recent popularity
            options.sort_by = 'popularity.desc';
            const today = new Date();
            const lastYear = new Date();
            lastYear.setFullYear(today.getFullYear() - 1);
            options['first_air_date.gte'] = lastYear.toISOString().split('T')[0];
        }
        
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
                    <div className="absolute md:bottom-5 md:left-5 md:right-5 bottom-0 px-4 py-2.5 bg-black/60 backdrop-blur-md rounded-xl lg:max-w-[700px] z-10">
                        <p className='md:text-3xl text-xl font-medium mb-4'>{heroSeries?.title || heroSeries?.name}</p>
                        <p className='md:text-base text-xs text-[#e8dfde] line-clamp-3'>
                            {heroSeries?.overview || "Описание отсутствует."}
                        </p>
                    </div>
                </div>
            </section>

            <section className='container lg:pb-[120px] md:pb-14 pb-8'>
                {!q && !genres && !sort && (
                    <WeeklySlider items={weeklySeries} type="tv" />
                )}
                
                <CatalogFilters genres={arrGenre} />
                <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 xs:grid-cols-2 mt-20 gap-x-5 gap-y-9">
                    {paginatedSeries.length > 0 ? paginatedSeries.map((series, index) => (
                        <MediaCard 
                            key={`${series.id}-${index}`}
                            id={series.id}
                            name={series.title || series.name || ''} 
                            year={series.first_air_date ? series.first_air_date.split('-')[0] : 'N/A'} 
                            genre="Сериал" 
                            rate={series.vote_average || 0} 
                            img={tmdbApi.getImageUrl(series.poster_path)} 
                            type="tv"
                            href={`/series/${series.id}`}
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
