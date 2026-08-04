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

    const isOngoing = (type === 'tv' || type === 'anime') && media.status === 'Returning Series';

    return (
        <section>
            <Tab.Group>
                <Tab.List className={'mt-10 xl:w-2/5 md:w-4/5 px-5 md:px-0 mx-auto flex gap-4'}>
                    <Tab as={Fragment}>
                        {({ selected }) => (
                            <button
                            className={`${selected ? 'border-white text-white' : 'border-[#323234] text-[#cbcbd2]'} py-2.5 px-5 border-b-[2px] xs:w-fit w-full`}
                            >
                            Подробная информация
                            </button>
                        )}
                    </Tab>
                    {isOngoing && (
                        <Tab as={Fragment}>
                            {({ selected }) => (
                                <button
                                className={`${selected ? 'border-white text-white' : 'border-[#323234] text-[#cbcbd2]'} py-2.5 px-5 border-b-[2px] xs:w-fit w-full`}
                                >
                                Выход серий
                                </button>
                            )}
                        </Tab>
                    )}
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
                    {isOngoing && (
                        <Tab.Panel>
                            <div className="flex flex-col gap-y-10 xl:w-2/5 md:w-4/5 px-5 md:px-0 mx-auto pb-20">
                                {media.next_episode_to_air ? (
                                    <div className="bg-[#1E1E20] p-6 rounded-xl border border-white/10">
                                        <h3 className="text-xl font-bold mb-4">Следующая серия</h3>
                                        <p className="text-[#CAE962] font-medium text-lg mb-2">
                                            {media.next_episode_to_air.name || `Эпизод ${media.next_episode_to_air.episode_number}`}
                                        </p>
                                        <p className="text-white/60">
                                            Дата выхода: {new Date(media.next_episode_to_air.air_date).toLocaleDateString('ru-RU')}
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-white/60">Информация о выходе новых серий пока отсутствует.</p>
                                )}
                            </div>
                        </Tab.Panel>
                    )}
                </Tab.Panels>
            </Tab.Group>
        </section>
    );
}
