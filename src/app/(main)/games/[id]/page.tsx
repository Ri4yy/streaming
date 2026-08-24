import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import DetailActions from '@/components/DetailActions';
import BackButton from '@/components/BackButton';
import { steamApi } from '@/services/steam';
import { notFound } from 'next/navigation';
import GameScreenshots from '@/components/GameScreenshots';
import GamePoster from '@/components/GamePoster';
import SimilarSlider from '@/components/SimilarSlider';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const game = await steamApi.getGameDetails(id);
    if (!game) return { title: 'Не найдено' };
    
    const rawDesc = game.short_description || game.detailed_description || '';
    const cleanDesc = rawDesc.replace(/<[^>]*>?/gm, '').substring(0, 160);
    const title = `${game.name} — системные требования, дата выхода, отзывы, рейтинг`;
    const description = cleanDesc || `Вся информация об игре «${game.name}». Системные требования, отзывы геймеров, трейлеры, скриншоты и рейтинг Metacritic.`;
    const imgUrl = game.header_image;
    
    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: [imgUrl],
            type: 'website',
        }
    };
}

export default async function GameDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const game = await steamApi.getGameDetails(id);

    if (!game) {
        return notFound();
    }
    
    const similar = await steamApi.getSimilarGames(game);

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'VideoGame',
        name: game.name,
        image: game.header_image,
        description: game.short_description?.replace(/<[^>]*>?/gm, ''),
        publisher: game.publishers?.[0],
        genre: game.genres?.map((g: any) => g.description),
        aggregateRating: game.metacritic ? {
            '@type': 'AggregateRating',
            ratingValue: game.metacritic.score,
            bestRating: '100',
            ratingCount: 1, // API usually doesn't return count for metacritic, default to 1
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
                    src={game.background_raw || game.background || game.header_image}
                    alt={game.name}
                    fill
                    className="object-cover opacity-40 blur-md"
                    priority
                />
                <div className="absolute inset-0 bg-black/50"></div>
            </div>

            <div className="relative z-20">
                <div className="absolute top-[100px] left-0 w-full z-30">
                    <div className="container">
                        <BackButton fallbackHref="/games" />
                    </div>
                </div>
                <section className='pt-[150px] max-[1100px]:pb-20 w-full min-[1100px]:min-h-screen md:min-h-[800px] flex flex-col justify-center'>
                    <div className="container flex max-[1100px]:flex-col gap-x-20 items-start">
                    <div className="max-[1100px]:mt-[40px] w-[30%] h-full max-[1100px]:w-full relative min-[1100px]:sticky min-[1100px]:top-[120px]">
                        <div className="relative pb-32">
                            {/* Постер с фоллбеком */}
                            <GamePoster 
                                appId={game.steam_appid} 
                                name={game.name} 
                                initialSrc={steamApi.getVerticalImage(game.steam_appid)} 
                                fallbackSrc={game.header_image}
                            />
                            <Link 
                                href={`https://store.steampowered.com/app/${game.steam_appid}`} 
                                target="_blank" 
                                className="absolute top-4 left-4 z-50 bg-black/40 hover:bg-[#1b2838]/90 backdrop-blur-md border border-white/20 hover:border-[#66c0f4]/50 text-white rounded-xl px-4 py-2.5 flex items-center gap-2 transition-all duration-300 shadow-xl opacity-90 hover:opacity-100 group"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" className="fill-current group-hover:text-[#66c0f4] transition-colors">
                                    <path d="M11.979 0C5.353 0 0 5.373 0 12c0 6.628 5.353 12 11.979 12 6.628 0 12-5.372 12-12 0-6.627-5.372-12-12-12zm7.11 8.528c0 1.954-1.583 3.538-3.538 3.538-.28 0-.547-.034-.805-.094l-2.457 3.513v.163c0 2.126-1.724 3.85-3.85 3.85-2.125 0-3.85-1.724-3.85-3.85 0-2.125 1.725-3.85 3.85-3.85.962 0 1.84.354 2.518.94l2.585-3.693c-.113-.377-.184-.775-.184-1.189 0-1.954 1.584-3.537 3.538-3.537 1.954 0 3.537 1.583 3.537 3.537zm-7.253 7.108c-.765 1.488-2.656 2.073-4.143 1.31-1.487-.765-2.074-2.657-1.31-4.144.764-1.487 2.656-2.074 4.143-1.31 1.487.766 2.074 2.657 1.31 4.144zm4.143-6.505c-.328.638-1.14 1.02-1.776.693-.637-.327-1.02-1.139-.692-1.777.327-.637 1.14-1.019 1.777-.692.637.327 1.019 1.14.691 1.776z"/>
                                </svg>
                                <span className="font-semibold tracking-wide text-sm">Играть в Steam</span>
                            </Link>
                            <DetailActions 
                                id={game.steam_appid} 
                                type="game" 
                                title={game.name} 
                                coverUrl={game.header_image}
                            />
                        </div>

                        {/* Режимы игры */}
                        <div className="mt-4 flex flex-col gap-2">
                            {game.categories?.some((c: any) => c.id === 2) && (
                                <div className="flex items-center gap-3 px-4 py-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl text-white/90">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                                    <span className="font-medium">Для одного игрока</span>
                                </div>
                            )}
                            {game.categories?.some((c: any) => [1, 9, 27, 38, 39].includes(c.id)) && (
                                <div className="flex items-center gap-3 px-4 py-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl text-white/90">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
                                    <span className="font-medium">{game.categories?.some((c: any) => [9, 38, 39].includes(c.id)) ? 'Кооператив / Мультиплеер' : 'Мультиплеер'}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="max-[1100px]:mt-10 w-[70%] max-[1100px]:w-full pr-4 pb-10">
                        <div className="flex md:flex-col flex-row items-center md:items-start gap-x-2">
                            <div className="rounded-lg backdrop-blur-md h-fit bg-black/40 w-fit px-2.5 py-1 text-[#BFBFBF] text-sm mb-2">
                                {game.developers?.[0] || 'Steam Game'}
                            </div>
                            <div className="flex items-center gap-x-2">
                                <div className="typeMovie rounded-md bg-[#CAE962] w-fit px-2.5 py-1 text-black font-bold text-sm uppercase">Игра</div>
                                <Link href={`https://store.steampowered.com/app/${game.steam_appid}`} target="_blank" className="typeMovie rounded-md bg-[#4A90E2] w-fit px-2.5 py-1 text-white text-sm uppercase hover:bg-blue-600 transition">В Steam</Link>
                            </div>
                        </div>

                        {game.release_date?.coming_soon && (
                            <div className="text-[#CAE962] font-semibold text-base mt-4 mb-1">
                                Выходит: {game.release_date.date}
                            </div>
                        )}
                        <h1 className='md:text-[50px] text-4xl font-bold w-fit my-4 leading-[1.1]'>{game.name}</h1>
                        <div className="flex items-center gap-4 flex-wrap mb-4">
                            {game.metacritic && (
                                <div className="bg-[#F6C700] text-black px-3 py-1 rounded-md font-bold">
                                    Metacritic: {game.metacritic.score}
                                </div>
                            )}
                            <div className="bg-white/20 text-white px-3 py-1 rounded-md font-medium text-sm">
                                Жанры: {game.genres?.map(g => g.description).join(', ')}
                            </div>
                        </div>
                        <div className='text-lg text-[#BFBFBF] my-6 xl:w-4/5 leading-[1.3] description-content' dangerouslySetInnerHTML={{ __html: game.detailed_description || game.short_description || '' }} />

                        {/* Трейлер */}
                        {game.movies && game.movies.length > 0 && (
                            <div className="mt-8 xl:w-4/5">
                                <h2 className="text-2xl font-bold mb-4">Трейлер:</h2>
                                <video
                                    controls
                                    poster={game.movies[0].thumbnail}
                                    className="w-full rounded-xl border border-white/10 shadow-lg"
                                >
                                    <source src={game.movies[0].mp4?.max || game.movies[0].mp4?.['480']} type="video/mp4" />
                                    <source src={game.movies[0].webm?.max || game.movies[0].webm?.['480']} type="video/webm" />
                                    Ваш браузер не поддерживает видео.
                                </video>
                            </div>
                        )}

                        {/* Скриншоты через клиентский компонент */}
                        <GameScreenshots screenshots={game.screenshots} />
                    </div>
                </div>
                
                <SimilarSlider items={similar} type="game" />
                </section>
            </div>
        </main>
    );
}
