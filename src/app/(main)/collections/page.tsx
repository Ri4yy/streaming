import { Suspense } from 'react';
import FeaturedHeroLayout from '@/components/CollectionsHub/FeaturedHeroLayout';
import FilterNavigation from '@/components/CollectionsHub/FilterNavigation';
import CollectionsGrid from '@/components/CollectionsHub/CollectionsGrid';
import SEOBlock from '@/components/CollectionsHub/SEOBlock';
import { CollectionProps } from '@/components/CollectionsHub/CollectionCard';
import { createClient } from '@/utils/supabase/server';

export const metadata = {
    title: 'Подборки | Каталог развлечений',
    description: 'Лучшие подборки фильмов, сериалов, аниме и игр под любое настроение.',
};

export default async function CollectionsHubPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const params = await searchParams;
    const currentTab = typeof params.tab === 'string' ? params.tab : 'Все';

    const tabMap: Record<string, string> = {
        'Фильмы': 'movies',
        'Сериалы': 'series',
        'Аниме': 'anime',
        'Игры': 'games'
    };
    const activeType = tabMap[currentTab];
    const currentMood = typeof params.mood === 'string' ? params.mood : null;

    const supabase = await createClient();

    // Fetch collections
    const { data } = await supabase
        .from('collections')
        .select('id, title, hook_text, cover_image, banner_image, category, slug, views, collection_items(count), collection_tags(tags(name, type))')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

    const allCollections: CollectionProps[] = (data || []).map((col: any) => {
        const moods = col.collection_tags
            ?.map((ct: any) => ct.tags)
            ?.filter((t: any) => t?.type === 'mood')
            ?.map((t: any) => t?.name) || [];

        const allTags = col.collection_tags
            ?.map((ct: any) => ct.tags?.name)
            ?.filter(Boolean) || [];

        return {
            id: col.slug,
            title: col.title,
            description: col.hook_text,
            image: col.cover_image,
            banner_image: col.banner_image,
            count: col.collection_items?.[0]?.count || 0,
            type: col.category,
            moods,
            allTags
        };
    });

    const q = typeof params.q === 'string' ? params.q.toLowerCase() : null;

    let filteredCollections = allCollections;
    if (activeType) {
        filteredCollections = filteredCollections.filter(c => c.type === activeType);
    }

    const availableMoods = new Set<string>();
    filteredCollections.forEach(c => c.moods?.forEach(m => availableMoods.add(m)));

    if (currentMood) {
        filteredCollections = filteredCollections.filter(c => c.moods?.includes(currentMood));
    }

    if (q) {
        filteredCollections = filteredCollections.filter((c: any) => {
            const matchesTitle = c.title.toLowerCase().includes(q);
            const matchesDesc = c.description && c.description.toLowerCase().includes(q);
            const matchesTag = c.allTags?.some((t: string) => t.toLowerCase().includes(q));

            return matchesTitle || matchesDesc || matchesTag;
        });
    }

    // Split data
    const trendingCollections = [...filteredCollections].sort((a: any, b: any) => (b.views || 0) - (a.views || 0)).slice(0, 5);
    const latestCollections = filteredCollections.slice(0, 10);
    const popularWeekly = [...filteredCollections].sort((a: any, b: any) => (b.views || 0) - (a.views || 0)).slice(0, 8); // just mock logic for now

    // Fallback for hero banner if filtered is empty
    const heroTrending = trendingCollections.length > 0 ? trendingCollections : [...allCollections].sort((a: any, b: any) => (b.views || 0) - (a.views || 0)).slice(0, 5);
    const heroLatest = latestCollections.length > 0 ? latestCollections.slice(0, 8) : allCollections.slice(0, 8);

    return (
        <main className="min-h-screen bg-[var(--theme-bg)] pb-20 pt-[120px]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px]">

                {/* 1. Featured Hero Block (Slider + Latest) - Hide if searching */}
                {!q && (
                    <FeaturedHeroLayout
                        trending={heroTrending}
                        latest={heroLatest}
                    />
                )}

                {/* 2. Filter Navigation & Search */}
                <Suspense fallback={<div className="h-20" />}>
                    <FilterNavigation availableMoods={Array.from(availableMoods)} />
                </Suspense>

                {/* Check if empty */}
                {filteredCollections.length > 0 ? (
                    q ? (
                        <CollectionsGrid collections={filteredCollections} title={`Результаты поиска по «${params.q}»`} />
                    ) : (
                        <>
                            {/* 3. Main Collections Grid */}
                            <CollectionsGrid collections={latestCollections} title="Свежие подборки" />

                            {/* 4. Another Grid */}
                            <CollectionsGrid collections={popularWeekly} title="Популярное за неделю" />
                        </>
                    )
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md mb-12 text-center px-4 mt-8">
                        <div className="text-6xl mb-6">🍿</div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Здесь пока пусто</h2>
                        <p className="text-white/50 max-w-md text-lg">
                            Мы еще не добавили подборки в эту категорию, но скоро они обязательно появятся.
                        </p>
                    </div>
                )}

                {/* 5. SEO Block */}
                <SEOBlock />

            </div>
        </main>
    );
}
