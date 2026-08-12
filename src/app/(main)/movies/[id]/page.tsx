import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import DetailActions from '@/components/DetailActions';
import DetailTabs from '@/components/DetailTabs';
import FramesSlider from '@/components/FramesSlider';
import TrailerModal from '@/components/TrailerModal';
import SimilarSlider from '@/components/SimilarSlider';
import { tmdbApi } from '@/services/tmdb';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const movie = await tmdbApi.getDetails(id, 'movie');
    
    const year = movie.release_date?.split('-')[0] || '';
    const title = `${movie.title || movie.name} ${year ? `(${year}) ` : ''}— обзор, актеры, отзывы, рейтинг`;
    const description = `Вся информация о фильме «${movie.title || movie.name}» ${year ? `(${year})` : ''}. Сюжет, актерский состав, трейлеры и похожие фильмы. Читайте отзывы и узнайте рейтинг.`;
    const imgUrl = tmdbApi.getImageUrl(movie.poster_path);

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: [imgUrl],
            type: 'video.movie',
        }
    };
}

export default async function MovieDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const movie = await tmdbApi.getDetails(id, 'movie');
    const trailer = movie.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');
    const similar = await tmdbApi.getRecommendations(id, 'movie');

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Movie',
        name: movie.title || movie.name,
        image: tmdbApi.getImageUrl(movie.poster_path),
        description: movie.overview,
        datePublished: movie.release_date,
        aggregateRating: movie.vote_average ? {
            '@type': 'AggregateRating',
            ratingValue: movie.vote_average,
            bestRating: '10',
            ratingCount: movie.vote_count || 1,
        } : undefined,
    };

    return (
        <main className="relative min-h-screen">
            <Script
                id="json-ld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="fixed inset-0 z-0 pointer-events-none">
                <Image
                    src={tmdbApi.getImageUrl(movie.backdrop_path || movie.poster_path, 'original')}
                    alt={movie.title || movie.name || ''}
                    fill
                    className="object-cover opacity-40 blur-md"
                    priority
                />
                <div className="absolute inset-0 bg-black/50"></div>
            </div>

            <div className="relative z-20">
                <section className='pt-[120px] max-[1100px]:pb-20 w-full min-[1100px]:h-screen md:min-h-[800px] flex flex-col justify-center'>
                    <div className="container flex max-[1100px]:flex-col gap-x-20 items-center">
                        <div className="max-[1100px]:mt-6 w-[30%] h-full max-[1100px]:w-full max-[1100px]:max-w-[360px] max-[1100px]:mx-auto relative pb-32">
                            <Image src={tmdbApi.getImageUrl(movie.poster_path)} alt="Poster" width={500} height={750} className='rounded-xl w-full object-cover max-[1100px]:aspect-[9/16] min-[1100px]:h-full' />
                            <DetailActions
                                id={movie.id}
                                type="movie"
                                title={movie.title || movie.name || ''}
                                coverUrl={tmdbApi.getImageUrl(movie.poster_path)}
                            />
                        </div>
                        <div className="max-[1100px]:mt-10 w-[70%] max-[1100px]:w-full">
                            <div className="flex md:flex-col flex-row items-center md:items-start gap-x-2">
                                <div className="rounded-lg backdrop-blur-md h-fit bg-black/20 w-fit px-2.5 py-1 text-[#BFBFBF] text-sm">
                                    {movie.genres?.[0]?.name || 'Фантастика'}
                                </div>
                                <div className="flex items-center gap-x-2 md:mt-2">
                                    <div className="typeMovie rounded-md bg-[#2BB157] w-fit px-2.5 py-1 text-white text-sm uppercase">Фильм</div>
                                    <div className="typeMovie rounded-md bg-[#4A90E2] w-fit px-2.5 py-1 text-white text-sm uppercase">4K</div>
                                    <div className="text-white/60">12+</div>
                                </div>
                            </div>
                            <h1 className='md:text-[50px] text-4xl font-bold w-fit my-4 leading-[1.1]'>{movie.title || movie.name}</h1>
                            <div className="flex items-center">
                                <svg width="43" height="22" viewBox="0 0 43 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M43 1.89083C42.8833 0.922265 42.1751 0.150295 41.2733 0C37.3203 0 5.69694 0 1.74393 0C0.756052 0.164717 0 1.07484 0 2.17169C0 3.935 0 18.0384 0 19.801C0 21.0155 0.925061 22 2.06699 22C5.95494 22 37.0623 22 40.9502 22C42.0017 22 42.8699 21.1643 43 20.0826C43 16.4444 43 3.70955 43 1.89083Z" fill="#F6C700"></path>
                                    <path fillRule="evenodd" clipRule="evenodd" d="M34.2105 15.7931C34.4184 15.7931 34.6936 15.7074 34.7565 15.5381C34.7983 15.425 34.8297 15.0174 34.8514 14.3152V10.8987C34.8514 10.3347 34.8155 9.96654 34.7445 9.79423C34.6727 9.62193 34.3938 9.53615 34.1859 9.53615C33.9825 9.53615 33.8508 9.61206 33.791 9.76159C33.7304 9.91265 33.7005 10.2914 33.7005 10.8987V14.4223C33.7005 15.0083 33.7342 15.3825 33.803 15.5464C33.8718 15.7112 34.0071 15.7931 34.2105 15.7931ZM33.4852 17.5504H30.4131V4.21738H33.7005V8.55468C33.9727 8.23511 34.2764 7.99676 34.6106 7.83964C34.9457 7.68251 35.4482 7.60281 35.8408 7.60281C36.2925 7.60281 36.6844 7.67416 37.0164 7.81687C37.3484 7.95957 37.6019 8.1592 37.7762 8.41653C37.9504 8.67385 38.0551 8.9251 38.0903 9.1718C38.1254 9.4185 38.1434 9.94377 38.1434 10.7484V14.4891C38.1434 15.2891 38.0903 15.8842 37.9841 16.2759C37.8779 16.6668 37.6281 17.0069 37.2363 17.2938C36.8436 17.5815 36.3785 17.725 35.8393 17.725C35.4519 17.725 34.9516 17.6399 34.6174 17.4691C34.2816 17.2991 33.9757 17.0426 33.6975 16.701C33.6953 16.7098 33.6918 16.724 33.6869 16.7436C33.6602 16.8508 33.5933 17.1197 33.4852 17.5504ZM14.911 9.62588L15.0461 10.5624L15.8366 4.3335H20.2944V17.6665H17.315L17.3038 8.667L16.111 17.6665H13.982L12.7241 8.86284L12.7137 17.6665H9.72461V4.3335H14.1487C14.2789 5.14114 14.415 6.0877 14.5578 7.17544C14.5846 7.36349 14.7025 8.1806 14.911 9.62588ZM8.59885 4.42081H5.18652V17.7538H8.59885V4.42081ZM25.9279 7.10712C25.9653 7.27715 25.9847 7.66276 25.9847 8.26546V13.4347C25.9847 14.322 25.9279 14.8655 25.815 15.0659C25.7013 15.2663 25.3992 15.3658 24.9093 15.3658V6.61373C25.281 6.61373 25.5345 6.65396 25.6691 6.7329C25.8037 6.8126 25.8905 6.93709 25.9279 7.10712ZM27.4691 17.5306C27.8752 17.4403 28.2162 17.2809 28.4929 17.0539C28.7689 16.8262 28.9626 16.5112 29.0732 16.1081C29.1847 15.7058 29.2505 14.9065 29.2505 13.711V9.02908C29.2505 7.76751 29.2019 6.92191 29.1263 6.49228C29.0501 6.06189 28.8609 5.67097 28.558 5.32028C28.2544 4.96959 27.8117 4.71758 27.2298 4.56425C26.6473 4.41092 25.6975 4.3335 24.0456 4.3335H21.5V17.6665H25.634C26.5867 17.6361 27.1984 17.5913 27.4691 17.5306Z" fill="black"></path>
                                </svg>
                                <span className='pl-2'>{movie.vote_average ? movie.vote_average.toFixed(1) : '0.0'}</span>
                                <span className='flex items-center relative before:w-1 before:h-1 before:bg-white/30 before:rounded-full before:absolute before:-left-1/2 ml-8 text-white/60'>
                                    {movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}
                                </span>
                            </div>
                            <p className='text-lg text-[#BFBFBF] my-8 xl:w-4/5 leading-[1.2] line-clamp-3'>
                                {movie.overview || "Описание отсутствует."}
                            </p>
                            <ul className='flex md:flex-row flex-col gap-x-8 gap-y-2 md:items-center'>
                                {movie.credits?.cast?.slice(0, 3).map(person => (
                                    <li key={person.id}>
                                        <Link href="#" className='text-white hover:text-theme-main transition-all duration-300'>
                                            {person.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                            {trailer && <TrailerModal trailerKey={trailer.key} />}
                        </div>
                    </div>
                </section>

                {movie.images?.backdrops && movie.images.backdrops.length > 0 && (
                    <FramesSlider images={movie.images.backdrops} />
                )}

                <DetailTabs media={movie} type="movie" />

                <SimilarSlider items={similar} type="movie" />
            </div>
        </main>
    );
}

