import React from 'react';
import Image from 'next/image';
import MediaCard from '@/components/MediaCard';
import CatalogFilters from '@/components/CatalogFilters';
import { tmdbApi } from '@/services/tmdb';

import Pagination from '@/components/Pagination';

export default async function SeriesPage({ searchParams }: { searchParams: Promise<{ q?: string, sort?: string, genres?: string, page?: string }> }) {
    const { q, sort, genres, page: pageParam } = await searchParams;
    const page = parseInt(pageParam || '1');

    let allSeries = [];
    
    if (q) {
        allSeries = await tmdbApi.searchMany(q, 'tv', 4);
    } else {
        // Use trending to avoid showing 2000s series like Breaking Bad as top results
        allSeries = await tmdbApi.getManyTrending('tv', 'week', 4);
    }

    const heroSeries = allSeries.length > 0 ? allSeries[0] : null;
    let seriesList = allSeries.length > 0 ? (q ? allSeries : allSeries.slice(1)) : [];

    let arrGenre = [
        { id: 1, name: 'Боевики' }, { id: 2, name: 'Вестерны' }, { id: 3, name: 'Военное' },
        { id: 4, name: 'Детективы' }, { id: 5, name: 'Документальное' }, { id: 6, name: 'Комедия' },
        { id: 7, name: 'Драма' }, { id: 8, name: 'Криминал' }, { id: 9, name: 'Ужасы' },
        { id: 10, name: 'Триллеры' }, { id: 11, name: 'Фэнтези' }, { id: 12, name: 'Фантастика' }
    ];

    // Local filter by query is removed since we use API search now

    // Filter by genres
    if (genres) {
        const selectedGenres = genres.split(',');
        seriesList = seriesList.filter(series => {
            const seriesGenres = series.genre_ids.map(id => arrGenre.find(g => g.id === id)?.name).filter(Boolean);
            return selectedGenres.some(g => seriesGenres.includes(g));
        });
    }

    // Sort
    if (sort) {
        seriesList.sort((a, b) => {
            if (sort === 'rating') return (b.vote_average || 0) - (a.vote_average || 0);
            if (sort === 'rating_asc') return (a.vote_average || 0) - (b.vote_average || 0);
            
            const dateA = new Date(a.first_air_date || 0).getTime();
            const dateB = new Date(b.first_air_date || 0).getTime();
            
            if (sort === 'date') return dateB - dateA;
            if (sort === 'date_asc') return dateA - dateB;
            
            return 0;
        });
    }
    
    const ITEMS_PER_PAGE = 20;
    const totalPages = Math.ceil(seriesList.length / ITEMS_PER_PAGE);
    const paginatedSeries = seriesList.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    return (
        <main className='-mt-20'>
            <section className='lg:px-[80px] md:px-10 px-5 pt-[100px]'>
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

            <section className='container lg:py-[120px] md:py-14 py-8'>
                <CatalogFilters genres={arrGenre} />
                <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 xs:grid-cols-2 mt-20 gap-x-5 gap-y-9">
                    {paginatedSeries.length > 0 ? paginatedSeries.map(series => (
                        <MediaCard 
                            key={series.id}
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
