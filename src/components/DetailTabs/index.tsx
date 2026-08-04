"use client";

import React, { Fragment } from 'react';
import { Tab } from '@headlessui/react';
import Image from 'next/image';
import { FaUserAlt } from 'react-icons/fa';
import { FaMessage } from 'react-icons/fa6';
import { MdEmail } from 'react-icons/md';
import { TMDBDetail, tmdbApi } from '@/services/tmdb';

export default function DetailTabs({ media, type }: { media: TMDBDetail, type: 'movie' | 'tv' | 'anime' }) {
    const runtime = media.runtime || (media.episode_run_time && media.episode_run_time[0]) || 0;
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    const runtimeStr = hours > 0 ? `${hours} часа ${minutes} мин.` : `${minutes} мин.`;
    const releaseYear = (media.release_date || media.first_air_date || '').split('-')[0];

    const trailer = media.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');

    return (
        <section>
            <Tab.Group>
                <Tab.List className={'mt-10 xl:w-2/5 md:w-4/5 px-5 md:px-0 mx-auto'}>
                    <Tab as={Fragment}>
                        {({ selected }) => (
                            <button
                            className={`${selected ? 'border-white text-white' : 'border-[#323234] text-[#cbcbd2]'} py-2.5 px-5 border-b-[2px] xs:w-fit w-full`}
                            >
                            Подробная информация
                            </button>
                        )}
                    </Tab>
                    <Tab as={Fragment}>
                        {({ selected }) => (
                            <button
                            className={`${selected ? 'border-white text-white' : 'border-[#323234] text-[#cbcbd2]'} py-2.5 px-5 border-b-[2px] xs:w-fit w-full`}
                            >
                            Отзывы
                            </button>
                        )}
                    </Tab>
                </Tab.List>
                <Tab.Panels className={'mt-10'}>
                    <Tab.Panel>
                        <div className="xl:w-2/5 md:w-4/5 px-5 md:px-0 mx-auto pb-10">
                            <p className='text-[#8C8C8C] leading-[1.6]'>
                                {media.overview || "Описание отсутствует."}
                            </p>
                            {trailer && (
                                <div className="mt-10 w-full aspect-video rounded-xl overflow-hidden">
                                    <iframe 
                                        width="100%" 
                                        height="100%" 
                                        src={`https://www.youtube.com/embed/${trailer.key}`} 
                                        title="YouTube video player" 
                                        frameBorder="0" 
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            )}
                            <ul className='flex flex-col divide-y-[1px] divide-[#dee2e6]/20 mt-12'>
                                <li className='flex xs:flex-row flex-col gap-y-1 py-2.5'>
                                    <span className='text-[#8C8C8C] xs:w-1/2'>Год производства</span>
                                    <span className='xs:w-1/2 xs:text-base text-sm'>{releaseYear || 'N/A'}</span>
                                </li>
                                <li className='flex xs:flex-row flex-col gap-y-1 py-2.5'>
                                    <span className='text-[#8C8C8C] xs:w-1/2'>Страна</span>
                                    <span className='xs:w-1/2 xs:text-base text-sm'>{media.origin_country?.join(', ') || 'N/A'}</span>
                                </li>
                                <li className='flex xs:flex-row flex-col gap-y-1 py-2.5'>
                                    <span className='text-[#8C8C8C] xs:w-1/2'>Жанр</span>
                                    <span className='xs:w-1/2 xs:text-base text-sm'>{media.genres?.map(g => g.name).join(', ') || 'N/A'}</span>
                                </li>
                                <li className='flex xs:flex-row flex-col gap-y-1 py-2.5'>
                                    <span className='text-[#8C8C8C] xs:w-1/2'>Длительность</span>
                                    <span className='xs:w-1/2 xs:text-base text-sm'>{runtimeStr}</span>
                                </li>
                            </ul>
                        </div>
                    </Tab.Panel>
                    <Tab.Panel>
                        <div className="flex flex-col gap-y-10 xl:w-2/5 md:w-4/5 px-5 md:px-0 mx-auto pb-20">
                            <div className="flex flex-col gap-y-5">
                                <div className="flex items-center gap-4">
                                    <div className='w-[70px] h-[70px] rounded-xl bg-gray-500'></div>
                                    <div className="flex flex-col ">
                                        <p className='font-medium'>Name Surname</p>
                                        <span className='text-sm text-[#8C8C8C]'>January 6, 2021 at 1:24 pm</span>
                                    </div>
                                </div>
                                <p className='text-[#BFBFBF]'>
                                    Отличный фильм! Спецэффекты на высшем уровне.
                                </p>
                            </div>
                        </div>
                        <div className='bg-[#161618] lg:py-[120px] md:py-14 py-8'>
                            <div className="xl:w-2/5 md:w-4/5 px-5 md:px-0 mx-auto">
                                <form method='POST' className=" flex flex-col" onSubmit={(e) => e.preventDefault()}>
                                    <h2 className='text-[28px] font-bold mb-14'>Добавить отзыв</h2>
                                    <div className="w-full relative">
                                        <FaMessage className='absolute top-4 left-6 h-4 w-4 fill-white/50 group-focus:fill-white' />
                                        <textarea name="review" className='w-full min-h-[160px] rounded-xl border-[1px] border-[#323233] pl-14 py-2.5 pr-6 bg-[#1E1E20] outline-none focus:border-white/70' placeholder='Ваш отзыв'></textarea>
                                    </div>
                                    <div className="flex min-[600px]:flex-row flex-col gap-x-7 gap-y-4 min-[600px]:mt-7 mt-4">
                                        <div className="grow group relative">
                                            <FaUserAlt className='absolute top-1/2 -translate-y-1/2 left-6 h-4 w-4 fill-white/50 group-focus:fill-white' />
                                            <input type="text" name="name" className='py-2.5 pr-6 pl-14 w-full rounded-xl bg-[#1E1E20] border-[1px] border-[#323233] outline-none focus:border-white/70' placeholder='Ваше имя' autoComplete='off' />
                                        </div>
                                        <div className="grow group relative">
                                            <MdEmail className='absolute top-1/2 -translate-y-1/2 left-6 h-4 w-4 fill-white/50 group-focus:fill-white' />
                                            <input type="text" name="email" className='py-2.5 pr-6 pl-14 w-full rounded-xl bg-[#1E1E20] border-[1px] border-[#323233] outline-none focus:border-white/70' placeholder='Ваша почта' autoComplete='off' />
                                        </div>
                                    </div>
                                    <button type='submit' className="group hover:scale-105 transition-all duration-500 overflow-hidden flex justify-center items-center relative bg-[#ff1414] py-2.5 px-8 min-[600px]:w-fit w-full rounded-lg cursor-pointer mt-10">
                                        <span className='group-hover:text-black transition-all duration-500'>Отправить</span>
                                        <div className="-z-10 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-0 h-0 group-hover:w-[150%] rounded-full group-hover:h-[500%] bg-white transition-all duration-500"></div>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>
        </section>
    );
}
