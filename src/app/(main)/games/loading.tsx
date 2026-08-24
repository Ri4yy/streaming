import React from 'react';

export default function GamesLoading() {
    return (
        <main className="animate-pulse">
            {/* Hero Section Skeleton */}
            <section className='lg:px-[80px] md:px-10 px-5 pt-[120px]'>
                <div className="bg-white/5 border border-white/10 rounded-2xl h-[700px] w-full relative overflow-hidden flex items-center justify-center">
                    <div className="absolute md:bottom-10 md:left-10 md:right-10 bottom-4 left-4 right-4 p-6 bg-white/5 border border-white/10 rounded-2xl lg:max-w-[700px]">
                        <div className="h-6 bg-white/10 rounded w-1/4 mb-4"></div>
                        <div className="h-12 bg-white/10 rounded w-3/4 mb-6"></div>
                        <div className="h-6 bg-white/10 rounded w-32 mb-6"></div>
                        <div className='p-4 rounded-xl bg-white/5 border border-white/10'>
                            <div className="h-4 bg-white/10 rounded w-full mb-2"></div>
                            <div className="h-4 bg-white/10 rounded w-5/6 mb-2"></div>
                            <div className="h-4 bg-white/10 rounded w-4/6"></div>
                        </div>
                    </div>
                </div>
            </section>

            <section className='container lg:pb-[120px] md:pb-14 pb-8 pt-4 mt-10'>
                {/* Sliders Skeleton */}
                <div className="mb-10">
                    <div className="h-8 bg-white/10 rounded w-48 mb-6"></div>
                    <div className="flex gap-4 overflow-hidden">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="min-w-[200px] h-[300px] bg-white/5 border border-white/10 rounded-xl"></div>
                        ))}
                    </div>
                </div>
                
                <div className="mb-10 mt-10">
                    <div className="h-8 bg-white/10 rounded w-56 mb-6"></div>
                    <div className="flex gap-4 overflow-hidden">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="min-w-[200px] h-[300px] bg-white/5 border border-white/10 rounded-xl"></div>
                        ))}
                    </div>
                </div>

                {/* Filters Skeleton */}
                <div className="mt-12 mb-8">
                    <div className="h-14 bg-white/5 border border-white/10 rounded-xl w-full"></div>
                    <div className="flex gap-4 mt-6">
                        <div className="h-10 bg-white/5 border border-white/10 rounded-xl w-40"></div>
                        <div className="h-10 bg-white/5 border border-white/10 rounded-xl w-32"></div>
                    </div>
                </div>

                {/* Grid Skeleton */}
                <div className="flex flex-col items-center">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-x-5 gap-y-9 w-full">
                        {Array.from({ length: 20 }).map((_, index) => (
                            <div key={index} className="flex flex-col gap-2">
                                <div className="w-full aspect-[2/3] bg-white/5 border border-white/10 rounded-xl"></div>
                                <div className="h-5 bg-white/10 rounded w-3/4 mt-2"></div>
                                <div className="flex justify-between">
                                    <div className="h-4 bg-white/10 rounded w-1/3"></div>
                                    <div className="h-4 bg-white/10 rounded w-1/4"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
