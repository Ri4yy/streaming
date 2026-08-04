import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import MediaCard from '@/components/MediaCard';
import CatalogFilters from '@/components/CatalogFilters';
import AnimeHeroSwiper from '@/components/AnimeHeroSwiper';
import { tmdbApi } from '@/services/tmdb';

import Pagination from '@/components/Pagination';

export default async function AnimePage({ searchParams }: { searchParams: Promise<{ q?: string, sort?: string, genres?: string, page?: string }> }) {
    const { q, sort, genres, page: pageParam } = await searchParams;
    const page = parseInt(pageParam || '1');

    let allAnime = [];

    if (q) {
        // We use TMDB multi search but we'd better filter for anime. TMDB search doesn't easily restrict to anime, but we can search 'tv' and maybe it returns some. Actually TMDB doesn't have an 'anime' type, it's just 'tv' with genre 16.
        const res = await tmdbApi.searchMany(q, 'tv', 4);
        allAnime = res.filter(item => item.genre_ids?.includes(16));
    } else {
        allAnime = await tmdbApi.getManyDiscoverAnime(4);
    }

    const heroAnime = allAnime.length > 0 ? allAnime[0] : null;
    const swiperAnimes = allAnime.length > 1 ? allAnime.slice(1, 6) : [];
    let animeList = allAnime.length > 0 ? (q ? allAnime : allAnime.slice(1)) : [];

    let arrGenre = [
        {id: 1, name: 'Вампиры'}, {id: 2, name: 'Безумное'}, {id: 3, name: 'Военное'},
        {id: 4, name: 'Детективы'}, {id: 5, name: 'Демоны'}, {id: 6, name: 'Комедия'},
        {id: 7, name: 'Драма'}, {id: 8, name: 'Приключения'}, {id: 9, name: 'Ужасы'},
        {id: 10, name: 'Фантастика'}, {id: 11, name: 'Фэнтези'}, {id: 12, name: 'Школа'}
    ];

    // Local filter by query is removed since we use API search now

    // Filter by genres
    if (genres) {
        const selectedGenres = genres.split(',');
        animeList = animeList.filter(anime => {
            const animeGenres = anime.genre_ids.map(id => arrGenre.find(g => g.id === id)?.name).filter(Boolean);
            return selectedGenres.some(g => animeGenres.includes(g));
        });
    }

    // Sort
    if (sort) {
        animeList.sort((a, b) => {
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
    const totalPages = Math.ceil(animeList.length / ITEMS_PER_PAGE);
    const paginatedAnime = animeList.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    return (  
        <main className='-mt-20'>
            <section className='relative w-full lg:h-screen h-fit pt-40 lg:py-0 md:min-h-[800px] flex flex-col justify-center lg:justify-end overflow-hidden'>
                <Image 
                    src={tmdbApi.getImageUrl(heroAnime?.backdrop_path || heroAnime?.poster_path || null, 'original')}
                    alt="Hero"
                    fill
                    className="object-cover object-[50%_0] z-0"
                    priority
                />
                <div className="absolute inset-0 bg-black/60 z-10"></div>
                <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 xl:w-[1200px] lg:w-[1000px] md:w-[700px] w-[300px] h-[220px] rounded-[1200px] outline outline-[200px] outline-black outline-offset-[200px] blur-[150px] z-10"></div>
                <div className="min-[1240px]:pl-[calc((100%-1240px)/2)] min-[768px]:pl-10 min-[320px]:pl-5 flex lg:flex-row flex-col gap-20 z-20 lg:items-end">
                    <div className="flex flex-col min-[1440px]:w-[40%] lg:w-[50%] min-[1680px]:pb-[200px] lg:pb-[100px] min-[768px]:pr-10 min-[320px]:pr-5">
                        <p className='text-[#CAE962] text-2xl font-bold'>#1 Популярное Аниме</p>
                        <h1 className='text-[48px] font-bold leading-[1.1]'>{heroAnime?.name || heroAnime?.title}</h1>
                        <div className='p-3 rounded-md bg-white/20 backdrop-blur-sm mt-4'>
                            <p className='text-lg font-medium text-[#F8F7F9]/100 leading-[1.25] line-clamp-4'>
                                {heroAnime?.overview || "Описание отсутствует."}
                            </p>
                        </div>
                        <div className="flex items-center mt-3 z-20">
                            <svg width="43" height="22" viewBox="0 0 43 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M43 1.89083C42.8833 0.922265 42.1751 0.150295 41.2733 0C37.3203 0 5.69694 0 1.74393 0C0.756052 0.164717 0 1.07484 0 2.17169C0 3.935 0 18.0384 0 19.801C0 21.0155 0.925061 22 2.06699 22C5.95494 22 37.0623 22 40.9502 22C42.0017 22 42.8699 21.1643 43 20.0826C43 16.4444 43 3.70955 43 1.89083Z" fill="#F6C700"></path>
                                <path fillRule="evenodd" clipRule="evenodd" d="M34.2105 15.7931C34.4184 15.7931 34.6936 15.7074 34.7565 15.5381C34.7983 15.425 34.8297 15.0174 34.8514 14.3152V10.8987C34.8514 10.3347 34.8155 9.96654 34.7445 9.79423C34.6727 9.62193 34.3938 9.53615 34.1859 9.53615C33.9825 9.53615 33.8508 9.61206 33.791 9.76159C33.7304 9.91265 33.7005 10.2914 33.7005 10.8987V14.4223C33.7005 15.0083 33.7342 15.3825 33.803 15.5464C33.8718 15.7112 34.0071 15.7931 34.2105 15.7931ZM33.4852 17.5504H30.4131V4.21738H33.7005V8.55468C33.9727 8.23511 34.2764 7.99676 34.6106 7.83964C34.9457 7.68251 35.4482 7.60281 35.8408 7.60281C36.2925 7.60281 36.6844 7.67416 37.0164 7.81687C37.3484 7.95957 37.6019 8.1592 37.7762 8.41653C37.9504 8.67385 38.0551 8.9251 38.0903 9.1718C38.1254 9.4185 38.1434 9.94377 38.1434 10.7484V14.4891C38.1434 15.2891 38.0903 15.8842 37.9841 16.2759C37.8779 16.6668 37.6281 17.0069 37.2363 17.2938C36.8436 17.5815 36.3785 17.725 35.8393 17.725C35.4519 17.725 34.9516 17.6399 34.6174 17.4691C34.2816 17.2991 33.9757 17.0426 33.6975 16.701C33.6953 16.7098 33.6918 16.724 33.6869 16.7436C33.6602 16.8508 33.5933 17.1197 33.4852 17.5504ZM14.911 9.62588L15.0461 10.5624L15.8366 4.3335H20.2944V17.6665H17.315L17.3038 8.667L16.111 17.6665H13.982L12.7241 8.86284L12.7137 17.6665H9.72461V4.3335H14.1487C14.2789 5.14114 14.415 6.0877 14.5578 7.17544C14.5846 7.36349 14.7025 8.1806 14.911 9.62588ZM8.59885 4.42081H5.18652V17.7538H8.59885V4.42081ZM25.9279 7.10712C25.9653 7.27715 25.9847 7.66276 25.9847 8.26546V13.4347C25.9847 14.322 25.9279 14.8655 25.815 15.0659C25.7013 15.2663 25.3992 15.3658 24.9093 15.3658V6.61373C25.281 6.61373 25.5345 6.65396 25.6691 6.7329C25.8037 6.8126 25.8905 6.93709 25.9279 7.10712ZM27.4691 17.5306C27.8752 17.4403 28.2162 17.2809 28.4929 17.0539C28.7689 16.8262 28.9626 16.5112 29.0732 16.1081C29.1847 15.7058 29.2505 14.9065 29.2505 13.711V9.02908C29.2505 7.76751 29.2019 6.92191 29.1263 6.49228C29.0501 6.06189 28.8609 5.67097 28.558 5.32028C28.2544 4.96959 27.8117 4.71758 27.2298 4.56425C26.6473 4.41092 25.6975 4.3335 24.0456 4.3335H21.5V17.6665H25.634C26.5867 17.6361 27.1984 17.5913 27.4691 17.5306Z" fill="black"></path>
                            </svg>
                            <span className='pl-2'>{heroAnime?.vote_average ? heroAnime.vote_average.toFixed(1) : '0.0'}</span>
                            <span className='flex items-center relative before:w-1 before:h-1 before:bg-white/30 before:rounded-full before:absolute before:-left-1/2 ml-8'>
                                {heroAnime?.first_air_date ? heroAnime.first_air_date.split('-')[0] : 'N/A'}
                            </span>
                        </div>
                        <div className="flex xs:flex-row flex-col xs:items-center gap-3 mt-12">
                            <button className='bg-[#CAE962] hover:bg-[#b6d552] active:bg-[#c8de7d] transition-all duration-300 rounded-2xl py-4 px-8 text-[#F8F7F9] hover:text-[#dedede] active:text-[#f6f5f5] text-2xl font-bold [text-shadow:_0_4px_2px_rgb(0,0,0,0.50)] active:[text-shadow:_0_3px_2px_rgb(0,0,0,0.50)] w-fit'>
                                Смотреть
                            </button>
                            {heroAnime && <Link href={`/anime/${heroAnime.id}`} className='text-lg hover:text-[#c8de7d] transition-all duration-300'>Подробнее</Link>}
                        </div>
                    </div>
                    <div className="min-[1440px]:w-[60%] lg:w-[50%] mb-10">
                        <AnimeHeroSwiper animes={swiperAnimes} />
                    </div>
                </div>
            </section>

            <section className='container lg:py-[120px] md:py-14 py-8'>
                <CatalogFilters genres={arrGenre} />
                <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 xs:grid-cols-2 mt-20 gap-x-5 gap-y-9">
                    {paginatedAnime.length > 0 ? paginatedAnime.map(anime => (
                        <MediaCard 
                            key={anime.id}
                            id={anime.id}
                            name={anime.name || anime.title || ''} 
                            year={anime.first_air_date ? anime.first_air_date.split('-')[0] : 'N/A'} 
                            genre="Аниме" 
                            rate={anime.vote_average || 0} 
                            img={tmdbApi.getImageUrl(anime.poster_path)} 
                            type="anime"
                            href={`/anime/${anime.id}`}
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
