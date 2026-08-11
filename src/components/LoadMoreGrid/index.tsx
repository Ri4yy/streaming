'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import MediaCard from '@/components/MediaCard';
import Pagination from '@/components/Pagination';
import { CatalogItem, fetchMoreItems } from '@/app/actions/catalog';

interface LoadMoreGridProps {
    initialItems: CatalogItem[];
    catalogType: 'movie' | 'tv' | 'anime' | 'game' | 'book';
    totalPages: number;
}

export default function LoadMoreGrid({ initialItems, catalogType, totalPages }: LoadMoreGridProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // Initialize page from URL
    const urlPage = parseInt(searchParams.get('page') || '1');
    const [items, setItems] = useState<CatalogItem[]>(initialItems);
    const [page, setPage] = useState(urlPage);
    const [isLoading, setIsLoading] = useState(false);
    
    // When the initial items change (e.g. from filters or search), reset the grid
    useEffect(() => {
        setItems(initialItems);
        setPage(parseInt(searchParams.get('page') || '1'));
    }, [initialItems, searchParams]);

    const handlePaginationChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', newPage.toString());
        router.push(`?${params.toString()}`, { scroll: true });
    };

    const handleLoadMore = async () => {
        if (page >= totalPages || isLoading) return;
        
        setIsLoading(true);
        const nextPage = page + 1;
        
        const q = searchParams.get('q') || undefined;
        const sort = searchParams.get('sort') || undefined;
        const genres = searchParams.get('genres') || undefined;
        const yearMin = searchParams.get('yearMin') || undefined;
        const yearMax = searchParams.get('yearMax') || undefined;
        const ratingMin = searchParams.get('ratingMin') || undefined;
        const ratingMax = searchParams.get('ratingMax') || undefined;
        
        try {
            const result = await fetchMoreItems(catalogType, nextPage, { q, sort, genres, yearMin, yearMax, ratingMin, ratingMax });
            if (result.items && result.items.length > 0) {
                // Filter out duplicates just in case API shifts
                setItems(prev => {
                    const newItems = result.items.filter(item => !prev.some(p => p.id === item.id));
                    return [...prev, ...newItems];
                });
                setPage(nextPage);
            }
        } catch (error) {
            console.error('Failed to fetch more items:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 xs:grid-cols-2 mt-20 gap-x-5 gap-y-9 w-full">
                {items.length > 0 ? (
                    items.map((item, index) => (
                        <MediaCard 
                            key={`${item.id}-${index}`}
                            id={item.id}
                            name={item.name} 
                            year={item.year} 
                            genre={item.genre} 
                            rate={item.rate} 
                            img={item.img}
                            fallbackImg={item.fallbackImg}
                            type={item.type}
                            href={item.href}
                        />
                    ))
                ) : (
                    <p className="text-gray-400 col-span-full">Ничего не найдено.</p>
                )}
            </div>
            
            {page < totalPages && items.length > 0 && (
                <button 
                    onClick={handleLoadMore}
                    disabled={isLoading}
                    className="mt-12 px-8 py-3 bg-theme-main hover:bg-theme-hover text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[200px]"
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                        'Показать еще'
                    )}
                </button>
            )}

            {totalPages > 1 && (
                <div className="mt-4">
                    <Pagination 
                        totalPages={totalPages} 
                        currentPage={page} 
                        onPageChange={handlePaginationChange} 
                    />
                </div>
            )}
        </div>
    );
}
