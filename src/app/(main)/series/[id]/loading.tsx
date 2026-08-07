import React from 'react';

export default function SeriesDetailLoading() {
    return (
        <main className="relative min-h-screen animate-pulse bg-[#0a0a0a]">
            {/* Background Skeleton */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="w-full h-full bg-white/5 blur-xl"></div>
            </div>

            <div className="relative z-20">
                <section className='pt-[120px] max-[1100px]:pb-20 w-full min-[1100px]:h-screen md:min-h-[800px] flex flex-col justify-center'>
                    <div className="container flex max-[1100px]:flex-col gap-x-20 items-center">
                        
                        {/* Left Column (Poster + Actions) */}
                        <div className="max-[1100px]:mt-[160px] w-[30%] h-full max-[1100px]:w-full relative pb-32">
                            <div className="w-full h-[600px] rounded-xl bg-white/10 border border-white/10 shadow-lg"></div>
                            
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
                            <div className="flex items-center gap-2 mb-2">
                                <div className="h-6 w-24 bg-white/10 rounded-md"></div>
                                <div className="h-6 w-16 bg-[#2BB157]/50 rounded-md"></div>
                                <div className="h-6 w-16 bg-[#4A90E2]/50 rounded-md"></div>
                            </div>
                            
                            <div className="h-14 md:h-16 w-3/4 bg-white/10 rounded-xl my-4"></div>
                            
                            <div className="flex items-center gap-4 flex-wrap mb-6">
                                <div className="h-8 w-16 bg-[#F6C700]/50 rounded-md"></div>
                                <div className="h-8 w-24 bg-white/10 rounded-md"></div>
                            </div>
                            
                            <div className="flex flex-col gap-3 my-8 xl:w-4/5">
                                <div className="h-4 w-full bg-white/5 rounded"></div>
                                <div className="h-4 w-full bg-white/5 rounded"></div>
                                <div className="h-4 w-11/12 bg-white/5 rounded"></div>
                                <div className="h-4 w-2/3 bg-white/5 rounded"></div>
                            </div>

                            <div className="flex gap-4 mt-6">
                                <div className="h-4 w-24 bg-white/10 rounded"></div>
                                <div className="h-4 w-24 bg-white/10 rounded"></div>
                                <div className="h-4 w-24 bg-white/10 rounded"></div>
                            </div>
                        </div>
                    </div>
                </section>
                
                <div className="container mt-10">
                    <div className="flex gap-4 overflow-hidden">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="min-w-[300px] h-[200px] bg-white/5 border border-white/10 rounded-xl"></div>
                        ))}
                    </div>
                </div>

                <div className="container mt-20 mb-20">
                    <div className="h-8 w-64 bg-white/10 rounded mb-6"></div>
                    <div className="flex gap-4 overflow-hidden">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="min-w-[200px] h-[300px] bg-white/5 border border-white/10 rounded-xl"></div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
