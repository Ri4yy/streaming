import { notFound } from 'next/navigation';
import CollectionsGrid from '@/components/CollectionsHub/CollectionsGrid';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import { CollectionProps } from '@/components/CollectionsHub/CollectionCard';

const categoryTitles: Record<string, string> = {
    movies: 'Подборки фильмов',
    series: 'Подборки сериалов',
    anime: 'Подборки аниме',
    games: 'Подборки игр',
    books: 'Подборки книг',
    mixed: 'Разное',
};

export default async function CollectionCategoryPage({ params }: { params: Promise<{ category: string }> }) {
    const { category } = await params;
    const title = categoryTitles[category];
    
    if (!title) {
        notFound();
    }

    const supabase = await createClient();

    const { data } = await supabase
        .from('collections')
        .select('id, title, hook_text, cover_image, banner_image, category, slug, collection_items(count)')
        .eq('is_published', true)
        .eq('category', category)
        .order('created_at', { ascending: false });

    const filteredCollections: CollectionProps[] = (data || []).map((col: any) => ({
        id: col.slug,
        title: col.title,
        description: col.hook_text,
        image: col.cover_image,
        banner_image: col.banner_image,
        count: col.collection_items?.[0]?.count || 0,
        type: col.category
    }));

    return (
        <main className="min-h-screen bg-[var(--theme-bg)] pb-20 pt-[120px]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px]">
                
                <Link href="/collections" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8 group">
                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    К общим подборкам
                </Link>

                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-12 drop-shadow-lg">
                    {title}
                </h1>

                {filteredCollections.length > 0 ? (
                    <CollectionsGrid collections={filteredCollections} title="Все подборки" />
                ) : (
                    <div className="flex items-center justify-center h-64 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md">
                        <p className="text-white/50 text-lg">В этой категории пока нет подборок.</p>
                    </div>
                )}
            </div>
        </main>
    );
}
