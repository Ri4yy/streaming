import React from 'react';

export default function GameDetailLoading() {
    return (
        <main className="relative min-h-screen animate-pulse bg-[#0a0a0a]">
            {/* Background Skeleton */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="w-full h-full bg-white/5 blur-xl"></div>
            </div>

            <div className="relative z-20">
                <section className='pb-20 pt-[120px] md:pt-[150px] w-full min-h-screen'>
                    <div className="container flex max-[1100px]:flex-col gap-x-20 items-start">
                        
                        {/* Left Column (Poster + Actions) */}
                        <div className="max-[1100px]:mt-[40px] w-[30%] h-full max-[1100px]:w-full relative sticky top-[120px]">
                            {/* Poster Skeleton */}
                            <div className="w-full h-[600px] rounded-xl bg-white/10 border border-white/10 shadow-lg"></div>
                            
                            {/* Detail Actions Skeleton */}
                            <div className="mt-6 flex flex-col gap-4">
                                <div className="w-full h-14 bg-white/5 border border-white/10 rounded-xl"></div>
                                <div className="flex gap-2">
                                    <div className="flex-1 h-12 bg-white/5 border border-white/10 rounded-xl"></div>
                                    <div className="flex-1 h-12 bg-white/5 border border-white/10 rounded-xl"></div>
                                    <div className="flex-1 h-12 bg-white/5 border border-white/10 rounded-xl"></div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column (Info) */}
                        <div className="max-[1100px]:mt-10 w-[70%] max-[1100px]:w-full pr-4 pb-10">
                            {/* Badges Skeleton */}
                            <div className="flex items-center gap-2 mb-2">
                                <div className="h-6 w-24 bg-white/10 rounded-md"></div>
                                <div className="h-6 w-16 bg-[#CAE962]/50 rounded-md"></div>
                                <div className="h-6 w-20 bg-[#4A90E2]/50 rounded-md"></div>
                            </div>
                            
                            {/* Title Skeleton */}
                            <div className="h-14 md:h-16 w-3/4 bg-white/10 rounded-xl my-4"></div>
                            
                            {/* Metacritic & Genres */}
                            <div className="flex items-center gap-4 flex-wrap mb-6">
                                <div className="h-8 w-32 bg-[#F6C700]/50 rounded-md"></div>
                                <div className="h-8 w-64 bg-white/10 rounded-md"></div>
                            </div>
                            
                            {/* Description Skeleton */}
                            <div className="flex flex-col gap-3 my-8 xl:w-4/5">
                                <div className="h-4 w-full bg-white/5 rounded"></div>
                                <div className="h-4 w-full bg-white/5 rounded"></div>
                                <div className="h-4 w-11/12 bg-white/5 rounded"></div>
                                <div className="h-4 w-full bg-white/5 rounded"></div>
                                <div className="h-4 w-10/12 bg-white/5 rounded"></div>
                                <div className="h-4 w-full bg-white/5 rounded"></div>
                                <div className="h-4 w-2/3 bg-white/5 rounded"></div>
                            </div>

                            {/* Trailer Skeleton */}
                            <div className="mt-8 xl:w-4/5">
                                <div className="h-8 w-32 bg-white/10 rounded mb-4"></div>
                                <div className="w-full aspect-video bg-white/5 border border-white/10 rounded-xl"></div>
                            </div>

                            {/* Screenshots Skeleton */}
                            <div className="mt-10">
                                <div className="h-8 w-40 bg-white/10 rounded mb-4"></div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="w-full aspect-video bg-white/5 border border-white/10 rounded-xl"></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Similar Games Skeleton */}
                    <div className="container mt-20">
                        <div className="h-8 w-64 bg-white/10 rounded mb-6"></div>
                        <div className="flex gap-4 overflow-hidden">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="min-w-[200px] h-[300px] bg-white/5 border border-white/10 rounded-xl"></div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
