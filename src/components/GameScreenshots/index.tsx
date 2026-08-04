"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { AiOutlineClose } from 'react-icons/ai';

interface GameScreenshotsProps {
    screenshots: { id: number; path_thumbnail: string; path_full: string }[];
}

export default function GameScreenshots({ screenshots }: GameScreenshotsProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    if (!screenshots || screenshots.length === 0) return null;

    const openModal = (index: number) => {
        setActiveIndex(index);
        setIsModalOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setIsModalOpen(false);
        document.body.style.overflow = 'auto';
    };

    return (
        <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Скриншоты:</h2>
            <Swiper
                spaceBetween={16}
                slidesPerView="auto"
                className="w-full"
            >
                {screenshots.map((screenshot, index) => (
                    <SwiperSlide key={screenshot.id} className="!w-[250px] md:!w-[300px]">
                        <div 
                            className="h-[150px] md:h-[180px] relative rounded-lg overflow-hidden border border-white/10 cursor-pointer group"
                            onClick={() => openModal(index)}
                        >
                            <Image src={screenshot.path_full} alt="Screenshot" fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm">
                    <button 
                        onClick={closeModal}
                        className="absolute top-5 right-5 z-[101] p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all"
                    >
                        <AiOutlineClose className="w-6 h-6 text-white" />
                    </button>
                    
                    <div className="w-full max-w-6xl px-4 h-full max-h-[80vh] flex items-center justify-center">
                        <Swiper
                            initialSlide={activeIndex}
                            spaceBetween={20}
                            slidesPerView={1}
                            className="w-full h-full"
                            navigation
                        >
                            {screenshots.map((screenshot) => (
                                <SwiperSlide key={screenshot.id} className="flex items-center justify-center">
                                    <div className="relative w-full h-full flex items-center justify-center">
                                        <Image 
                                            src={screenshot.path_full} 
                                            alt="Screenshot Full" 
                                            width={1920} 
                                            height={1080}
                                            className="max-h-full max-w-full object-contain rounded-lg" 
                                            quality={100}
                                        />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            )}
        </div>
    );
}
