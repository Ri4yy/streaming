import React from 'react';

export default function MainLoading() {
    return (
        <main className="animate-pulse bg-[#0a0a0a]">
            {/* Hero Skeleton */}
            <section className='relative w-full lg:h-screen h-fit pt-40 lg:py-0 md:min-h-[800px] flex flex-col justify-center overflow-hidden'>
                <div className="absolute inset-0 bg-white/5 z-0"></div>
                <div className="container relative z-20 flex flex-col justify-center h-full pt-[100px]">
                    <div className="md:w-1/2 flex flex-col gap-4">
                        <div className="h-6 w-32 bg-[#CAE962]/50 rounded mb-2"></div>
                        <div className="h-16 w-full bg-white/10 rounded-xl mb-4"></div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="h-6 w-16 bg-[#F6C700]/50 rounded"></div>
                            <div className="h-6 w-24 bg-white/10 rounded"></div>
                        </div>
                        <div className='p-4 rounded-xl bg-white/5 border border-white/10'>
                            <div className="h-4 w-full bg-white/10 rounded mb-2"></div>
                            <div className="h-4 w-5/6 bg-white/10 rounded mb-2"></div>
                            <div className="h-4 w-4/6 bg-white/10 rounded"></div>
                        </div>
                        <div className="flex gap-4 mt-8">
                            <div className="h-14 w-40 bg-[#CAE962]/50 rounded-xl"></div>
                            <div className="h-14 w-40 bg-white/10 border border-white/10 rounded-xl"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sliders Skeletons */}
            <section className='container py-20 flex flex-col gap-20'>
                {/* Slider 1 */}
                <div>
                    <div className="h-8 w-64 bg-white/10 rounded mb-6"></div>
                    <div className="flex gap-4 overflow-hidden">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="min-w-[200px] h-[300px] bg-white/5 border border-white/10 rounded-xl"></div>
                        ))}
                    </div>
                </div>

                {/* Slider 2 */}
                <div>
                    <div className="h-8 w-64 bg-white/10 rounded mb-6"></div>
                    <div className="flex gap-4 overflow-hidden">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="min-w-[200px] h-[300px] bg-white/5 border border-white/10 rounded-xl"></div>
                        ))}
                    </div>
                </div>
                
                {/* Weekly Highlight Skeleton */}
                <div className="w-full h-[400px] bg-white/5 border border-white/10 rounded-2xl mt-10"></div>
                
                {/* Slider 3 */}
                <div>
                    <div className="h-8 w-64 bg-white/10 rounded mb-6"></div>
                    <div className="flex gap-4 overflow-hidden">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="min-w-[200px] h-[300px] bg-white/5 border border-white/10 rounded-xl"></div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
