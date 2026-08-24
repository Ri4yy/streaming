import React from 'react';

export default function CategoryLoading() {
    return (
        <main className="min-h-screen bg-[var(--theme-bg)] pb-20 pt-[120px]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px]">
                
                {/* Back Link Skeleton */}
                <div className="w-40 h-6 bg-white/5 animate-pulse rounded-md mb-8"></div>

                {/* Title Skeleton */}
                <div className="w-[300px] md:w-[450px] h-12 bg-white/5 animate-pulse rounded-xl mb-12"></div>

                {/* Grid Skeleton */}
                <div className="mb-16">
                    <div className="w-48 h-8 bg-white/5 animate-pulse rounded-lg mb-8"></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6">
                        {[...Array(10)].map((_, itemIdx) => (
                            <div key={itemIdx} className="flex flex-col gap-4">
                                <div className="w-full aspect-[4/5] bg-white/5 animate-pulse rounded-3xl border border-white/5"></div>
                                <div className="w-3/4 h-6 bg-white/5 animate-pulse rounded-md"></div>
                                <div className="w-1/2 h-4 bg-white/5 animate-pulse rounded-md"></div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </main>
    );
}
