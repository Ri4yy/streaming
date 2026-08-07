"use client";

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import Image from 'next/image';
import { tmdbApi } from '@/services/tmdb';
import SwiperNavButtons from '@/components/SwiperNavButtons';
import 'swiper/css';
import 'swiper/css/navigation';

interface FramesSliderProps {
    images: { file_path: string }[];
}

export default function FramesSlider({ images }: FramesSliderProps) {
    if (!images || images.length === 0) return null;

    return (
        <section className='container py-12 relative'>

            <Swiper
                modules={[Navigation]}
                spaceBetween={20}
                slidesPerView={1.5}
                breakpoints={{
                    640: { slidesPerView: 2.5 },
                    1024: { slidesPerView: 3.5 },
                }}
                className="w-full relative static-buttons-swiper pb-10"
            >
                <div className="absolute top-[-50px] right-0 z-10 flex gap-2">
                    <SwiperNavButtons />
                </div>
                {images.map((backdrop, idx) => (
                    <SwiperSlide key={idx} className="rounded-xl overflow-hidden h-auto">
                        <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                            <Image
                                src={tmdbApi.getImageUrl(backdrop.file_path, 'original')}
                                alt={`Кадр ${idx + 1}`}
                                fill
                                className='object-cover'
                            />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
}
