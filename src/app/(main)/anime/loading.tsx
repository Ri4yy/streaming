import React from 'react';

export default function AnimeLoading() {
    return (
        <main className="animate-pulse bg-[#0a0a0a]">
            <section className='relative w-full lg:h-screen h-fit pt-40 lg:py-0 md:min-h-[800px] flex flex-col justify-center lg:justify-end overflow-hidden'>
                <div className="absolute inset-0 bg-white/5 z-0"></div>
                <div className="min-[1240px]:pl-[calc((100%-1240px)/2)] min-[768px]:pl-10 min-[320px]:pl-5 flex lg:flex-row flex-col gap-20 z-20 lg:items-end">
                    
                    {/* Left text skeleton */}
                    <div className="flex flex-col min-[1440px]:w-[40%] lg:w-[50%] min-[1680px]:pb-[200px] lg:pb-[100px] min-[768px]:pr-10 min-[320px]:pr-5">
                        <div className="h-8 w-48 bg-white/10 rounded mb-4"></div>
                        <div className="h-16 w-3/4 bg-white/10 rounded-xl mb-4"></div>
                        <div className='p-4 rounded-xl bg-white/5 border border-white/10 mt-4'>
                            <div className="h-4 w-full bg-white/10 rounded mb-2"></div>
                            <div className="h-4 w-5/6 bg-white/10 rounded mb-2"></div>
                            <div className="h-4 w-4/6 bg-white/10 rounded"></div>
                        </div>
                        <div className="flex items-center gap-6 mt-6">
                            <div className="h-8 w-16 bg-[#F6C700]/50 rounded"></div>
                            <div className="h-8 w-16 bg-white/10 rounded"></div>
                        </div>
                        <div className="flex xs:flex-row flex-col xs:items-center gap-4 mt-12">
                            <div className="h-14 w-40 bg-[#ff1414]/50 rounded-xl"></div>
                            <div className="h-14 w-40 bg-white/10 border border-white/10 rounded-xl"></div>
                        </div>
                    </div>

                    {/* Right swiper skeleton */}
                    <div className="min-[1440px]:w-[60%] lg:w-[50%] mb-10">
                        <div className="flex gap-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="min-w-[220px] h-[330px] bg-white/5 border border-white/10 rounded-xl"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className='container lg:pb-[120px] md:pb-14 pb-8 pt-10'>
                <div className="mb-10">
                    <div className="h-8 bg-white/10 rounded w-56 mb-6"></div>
                    <div className="flex gap-4 overflow-hidden">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="min-w-[200px] h-[300px] bg-white/5 border border-white/10 rounded-xl"></div>
                        ))}
                    </div>
                </div>

                <div className="mt-12 mb-8">
                    <div className="h-14 bg-white/5 border border-white/10 rounded-xl w-full"></div>
                    <div className="flex gap-4 mt-6">
                        <div className="h-10 bg-white/5 border border-white/10 rounded-xl w-40"></div>
                        <div className="h-10 bg-white/5 border border-white/10 rounded-xl w-32"></div>
                    </div>
                </div>

                <div className="flex flex-col items-center">
                    <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 xs:grid-cols-2 gap-x-5 gap-y-9 w-full">
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
