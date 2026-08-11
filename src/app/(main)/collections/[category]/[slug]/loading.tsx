import React from 'react';

export default function CollectionDetailLoading() {
    return (
        <main className="bg-[#0A0A0A] text-white min-h-screen">
            
            {/* Header Banner Skeleton */}
            <div className="w-full h-[50vh] min-h-[400px] bg-white/5 animate-pulse relative"></div>
            
            {/* Overlapping Intro Card Skeleton */}
            <div className="-mt-32 max-w-4xl mx-auto px-4 z-10 relative">
                <div className="w-full h-48 bg-white/5 animate-pulse rounded-3xl border border-white/10 backdrop-blur-md"></div>
            </div>

            {/* Main Content Skeleton */}
            <div className="container mx-auto px-4 max-w-5xl py-12">
                
                {/* TOC Skeleton */}
                <div className="w-full h-64 bg-white/5 animate-pulse rounded-2xl mb-16 border border-white/5"></div>

                {/* Items List Skeleton */}
                <div className="flex flex-col gap-24">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex flex-col md:flex-row gap-8 items-start">
                            
                            {/* Left Text Side */}
                            <div className="flex-1 flex flex-col gap-4 w-full">
                                <div className="w-16 h-8 bg-white/5 animate-pulse rounded-full"></div>
                                <div className="w-3/4 h-10 bg-white/5 animate-pulse rounded-xl"></div>
                                <div className="w-full h-24 bg-white/5 animate-pulse rounded-xl mt-4"></div>
                                
                                {/* Info tags skeleton */}
                                <div className="flex gap-2 mt-4">
                                    <div className="w-20 h-6 bg-white/5 animate-pulse rounded"></div>
                                    <div className="w-24 h-6 bg-white/5 animate-pulse rounded"></div>
                                </div>
                                
                                {/* Button skeleton */}
                                <div className="w-40 h-12 bg-white/5 animate-pulse rounded-xl mt-4"></div>
                            </div>

                            {/* Right Image/Video Side */}
                            <div className="w-full md:w-[45%] h-[280px] bg-white/5 animate-pulse rounded-2xl border border-white/5 shrink-0"></div>
                        </div>
                    ))}
                </div>

            </div>
        </main>
    );
}
