import React from 'react';
import CollectionArticleHeader from '@/components/CollectionDetail/CollectionArticleHeader';
import TableOfContents from '@/components/CollectionDetail/TableOfContents';
import CollectionItemBlock, { CollectionItemProps } from '@/components/CollectionDetail/CollectionItemBlock';
import ArticleFooter from '@/components/CollectionDetail/ArticleFooter';
import { CollectionProps } from '@/components/CollectionsHub/CollectionCard';
import { tmdbApi } from '@/services/tmdb';
import { steamApi } from '@/services/steam';
import type { Metadata } from 'next';
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: Promise<{ slug: string, category: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const supabase = await createClient();
    const { data: collection } = await supabase.from('collections').select('title, hook_text, seo_title, seo_description').eq('slug', slug).single();
    
    if (!collection) return { title: 'Не найдено | Подборки' };

    const title = collection.seo_title || `${collection.title} | Подборки`;
    return {
        title,
        description: collection.seo_description || collection.hook_text,
    };
}

export default async function CollectionDetailPage({ params }: { params: Promise<{ slug: string, category: string }> }) {
    const { slug, category } = await params;
    const supabase = await createClient();

    console.log("Fetching slug:", slug, "category:", category);

    // Запрашиваем саму подборку
    const { data: articleData, error: articleError } = await supabase
        .from('collections')
        .select(`
            id, title, hook_text, cover_image, banner_image, date:created_at, read_time, category,
            collection_items (
                id, order_index, item_type, item_id, custom_description, cached_metadata
            ),
            collection_tags (
                tags ( name )
            )
        `)
        .eq('slug', slug)
        .single();

    if (articleError || !articleData) {
        console.log("Collection 404 Error:", articleError, articleData);
        return notFound();
    }

    // Извлекаем теги из сводной таблицы
    const tags = articleData.collection_tags?.map((ct: any) => ct.tags.name) || [];

    // Преобразуем элементы коллекции к формату пропсов с запросами к API
    const itemsDataPromises = (articleData.collection_items || [])
        .sort((a: any, b: any) => a.order_index - b.order_index)
        .map(async (item: any): Promise<CollectionItemProps> => {
            const meta = item.cached_metadata || {};
            let rating = meta.rating || 0;
            let genres = meta.genres || [];
            let duration = meta.duration || '';
            let trailerUrl = '';
            let image = meta.image || '';
            if (image && image.startsWith('/')) {
                image = `https://image.tmdb.org/t/p/original${image}`;
            }
            let title = meta.title || 'Без названия';
            let year = meta.year || '';
            let seasons = null;

            if (item.item_type === 'games') {
                try {
                    const gameDetails = await steamApi.getGameDetails(item.item_id);
                    if (gameDetails) {
                        rating = gameDetails.metacritic?.score ? gameDetails.metacritic.score / 10 : rating;
                        genres = gameDetails.genres?.map((g: any) => g.description) || genres;
                        image = steamApi.getHeroImage(item.item_id) || gameDetails.header_image || image;
                        title = gameDetails.name || title;
                        year = gameDetails.release_date?.date ? gameDetails.release_date.date.split(',')[1]?.trim() || gameDetails.release_date.date.split(' ')[2] || gameDetails.release_date.date : year;
                    }
                } catch (e) {
                    console.error("Steam fetch error", e);
                }
            } else {
                try {
                    const type = item.item_type === 'anime' ? 'tv' : (item.item_type === 'movies' ? 'movie' : 'tv');
                    const details = await tmdbApi.getDetails(item.item_id, type);
                    if (details) {
                        rating = details.vote_average || rating;
                        genres = details.genres?.map((g: any) => g.name) || genres;
                        if (details.runtime) duration = `${Math.floor(details.runtime / 60)}ч ${details.runtime % 60}м`;
                        else if (details.episode_run_time?.[0]) duration = `${details.episode_run_time[0]}м`;

                        image = tmdbApi.getImageUrl(details.backdrop_path || details.poster_path, 'original') || image;
                        title = details.title || details.name || title;
                        const parsedYear = details.release_date ? details.release_date.split('-')[0] : (details.first_air_date ? details.first_air_date.split('-')[0] : '');
                        if (parsedYear) year = parsedYear;

                        // Получаем трейлер
                        const videos = details.videos?.results || [];
                        const trailer = videos.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube') || videos.find((v: any) => v.site === 'YouTube');
                        if (trailer) {
                            trailerUrl = `https://www.youtube.com/watch?v=${trailer.key}`;
                        }
                        
                        if (details.number_of_seasons) {
                            seasons = details.number_of_seasons;
                        }
                    }
                } catch (e) {
                    console.error("TMDB fetch error", e);
                }
            }

            return {
                id: item.item_id,
                title,
                year,
                image,
                genres,
                duration,
                seasons,
                rating,
                description: item.custom_description || '',
                type: item.item_type,
                linkId: item.item_id,
                trailerUrl
            };
        });

    const itemsData = await Promise.all(itemsDataPromises);

    const tocItems = itemsData.map((item: any) => ({ id: item.id, title: item.title }));

    // Запрашиваем похожие коллекции (пока просто случайные из той же категории)
    // В идеале нужен RPC метод для поиска по пересечению тегов
    const { data: similarData } = await supabase
        .from('collections')
        .select('id, title, hook_text, cover_image, banner_image, category, slug, collection_items(count)')
        .eq('category', category)
        .neq('id', articleData.id)
        .limit(3);

    const similarCollections: CollectionProps[] = (similarData || []).map((col: any) => ({
        id: col.slug,
        title: col.title,
        description: col.hook_text,
        image: col.cover_image,
        banner_image: col.banner_image,
        count: col.collection_items?.[0]?.count || 0,
        type: col.category
    }));

    // Форматирование даты
    const formattedDate = new Date(articleData.date).toLocaleDateString('ru-RU', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    return (
        <main className="min-h-screen pt-[100px] pb-10 relative">
            {/* Page Background Image */}
            <div 
                className="absolute inset-0 z-0 bg-cover bg-center bg-fixed"
                style={{ backgroundImage: `url(${articleData.banner_image || articleData.cover_image || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop'})` }}
            />
            {/* Overlay to darken the background and blend with theme */}
            <div className="absolute inset-0 z-0 bg-[var(--theme-bg)]/80 backdrop-blur-3xl" />

            {/* Liquid Glass Container (Width 90%) */}
            <div className="relative z-10 w-[90%] mx-auto bg-white/10 border border-white/10 rounded-3xl shadow-2xl backdrop-blur-2xl pb-16">
                
                {/* Header / Hero Banner */}
                <CollectionArticleHeader 
                    title={articleData.title}
                    coverImage={articleData.banner_image || articleData.cover_image}
                    date={formattedDate}
                    readTime={`${articleData.read_time} мин`}
                    hookText={articleData.hook_text}
                    category={category}
                />

                {/* Content Block max-width 1480px */}
                <div className="w-full max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-12 mt-12">
                    <div className="flex flex-col lg:flex-row gap-12 items-start">
                        
                        {/* Table of Contents (Sticky Left) */}
                        <aside className="w-full lg:w-1/4 shrink-0 lg:sticky lg:top-32 hidden lg:block">
                            <TableOfContents items={tocItems} />
                        </aside>

                        {/* Right Content */}
                        <div className="w-full lg:w-3/4 flex flex-col gap-16">
                            
                            {/* Mobile TOC */}
                            <div className="lg:hidden">
                                <TableOfContents items={tocItems} />
                            </div>

                            {/* Items List */}
                            <div className="flex flex-col gap-12">
                                {itemsData.map((item: any, index: number) => (
                                    <CollectionItemBlock key={item.id} item={item} index={index + 1} />
                                ))}
                            </div>

                            {/* Footer (Tags, Similar, Comments) */}
                            <ArticleFooter tags={tags} similarCollections={similarCollections} />
                        </div>
                        
                    </div>
                </div>
            </div>
        </main>
    );
}
