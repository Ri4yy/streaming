import React from 'react';
import MediaCard from '@/components/MediaCard';
import CatalogFilters from '@/components/CatalogFilters';
import { tmdbApi } from '@/services/tmdb';

export default async function SeriesPage() {
    const popularSeries = await tmdbApi.getPopular('tv');
    const heroSeries = popularSeries.results[0];
    const seriesList = popularSeries.results.slice(1);

    let arrGenre = [
        { id: 1, name: 'Боевики' }, { id: 2, name: 'Вестерны' }, { id: 3, name: 'Военное' },
        { id: 4, name: 'Детективы' }, { id: 5, name: 'Документальное' }, { id: 6, name: 'Комедия' },
        { id: 7, name: 'Драма' }, { id: 8, name: 'Криминал' }, { id: 9, name: 'Ужасы' },
        { id: 10, name: 'Триллеры' }, { id: 11, name: 'Фэнтези' }, { id: 12, name: 'Фантастика' }
    ];
    
    return (
        <main className='-mt-20'>
            <section className='lg:px-[80px] md:px-10 px-5 pt-[100px]'>
                <div 
                    className="bg-center bg-cover rounded-2xl h-[700px] w-full relative overflow-hidden"
                    style={{ backgroundImage: `url('${tmdbApi.getImageUrl(heroSeries?.backdrop_path || heroSeries?.poster_path, 'original')}')` }}
                >
                    <div className="absolute md:bottom-5 md:left-5 md:right-5 bottom-0 px-4 py-2.5 bg-black/60 backdrop-blur-md rounded-xl lg:max-w-[700px]">
                        <p className='md:text-3xl text-xl font-medium mb-4'>{heroSeries?.title || heroSeries?.name}</p>
                        <p className='md:text-base text-xs text-[#e8dfde] line-clamp-3'>
                            {heroSeries?.overview || "Описание отсутствует."}
                        </p>
                    </div>
                </div>
            </section>

            <section className='container lg:py-[120px] md:py-14 py-8'>
                <CatalogFilters genres={arrGenre} />
                <div className="grid xl:grid-cols-4 lg:grid-cols-3 xs:grid-cols-2 mt-20 gap-x-5 gap-y-9">
                    {seriesList.map(series => (
                        <MediaCard 
                            key={series.id}
                            name={series.title || series.name || ''} 
                            year={series.first_air_date ? series.first_air_date.split('-')[0] : 'N/A'} 
                            genre="Сериал" 
                            rate={series.vote_average || 0} 
                            img={tmdbApi.getImageUrl(series.poster_path)} 
                            type="tv"
                            href={`/series/${series.id}`}
                        />
                    ))}
                </div>
            </section>
        </main>
    );
}
