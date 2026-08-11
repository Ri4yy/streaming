import React from 'react';

export default function CollectionsLoading() {
    return (
        <main className="min-h-screen bg-[var(--theme-bg)] pb-20 pt-[120px]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px]">
                
                {/* Hero Skeleton */}
                <div className="w-full h-[500px] md:h-[600px] bg-white/5 animate-pulse rounded-[32px] mb-12 border border-white/5"></div>

                {/* Filter Navigation Skeleton */}
                <div className="w-full flex flex-col gap-6 my-10 z-40">
                    <div className="w-full max-w-2xl mx-auto h-14 bg-white/5 animate-pulse rounded-2xl border border-white/5"></div>
                    <div className="flex items-center justify-center gap-2 overflow-x-auto max-w-full px-4 pb-2">
                        <div className="w-[350px] h-[44px] bg-white/5 animate-pulse rounded-full border border-white/5"></div>
                    </div>
                    <div className="flex items-center justify-center gap-3 overflow-x-auto max-w-full px-4">
                        <div className="w-28 h-[42px] bg-white/5 animate-pulse rounded-xl border border-white/5"></div>
                        <div className="w-40 h-[42px] bg-white/5 animate-pulse rounded-xl border border-white/5"></div>
                        <div className="w-32 h-[42px] bg-white/5 animate-pulse rounded-xl border border-white/5"></div>
                        <div className="w-36 h-[42px] bg-white/5 animate-pulse rounded-xl border border-white/5"></div>
                    </div>
                </div>

                {/* Grid Skeletons */}
                {[...Array(2)].map((_, gridIdx) => (
                    <div key={gridIdx} className="mb-16">
                        <div className="w-64 h-8 bg-white/5 animate-pulse rounded-lg mb-8"></div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                            {[...Array(5)].map((_, itemIdx) => (
                                <div key={itemIdx} className="flex flex-col gap-4">
                                    <div className="w-full aspect-[4/5] bg-white/5 animate-pulse rounded-3xl border border-white/5"></div>
                                    <div className="w-3/4 h-6 bg-white/5 animate-pulse rounded-md"></div>
                                    <div className="w-1/2 h-4 bg-white/5 animate-pulse rounded-md"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}
