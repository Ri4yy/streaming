"use client";

import React, { Fragment, useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import Link from 'next/link';
import Image from 'next/image';
import { useUserMedia } from '@/hooks/useUserMedia';
import { createClient } from '@/utils/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';

function TabCustom({ text }: { text: string }) {
    return (
        <Tab as={Fragment}>
            {({ selected }) => (
                <button className={
                    selected ? 'outline-none flex items-center whitespace-nowrap py-2 pl-2 before:w-1.5 before:h-1.5 before:opacity-100 transition-all duration-300 before:transition-all before:duration-300 before:-translate-x-3 before:rounded-full before:bg-red-500 text-white' : 'outline-none flex items-center whitespace-nowrap py-2 hover:pl-2 hover:before:w-1.5 hover:before:h-1.5 hover:before:opacity-100 transition-all duration-300 before:transition-all before:duration-300 before:-translate-x-3 before:w-0 before:h-0 before:rounded-full before:bg-red-500 before:opacity-0 text-gray-400 hover:text-white'
                }
                >{text}</button>
            )}
        </Tab>
    )
}

function SubTabCustom({ text }: { text: string }) {
    return (
        <Tab as={Fragment}>
            {({ selected }) => (
                <button className={`px-4 py-2 rounded-lg font-medium transition-colors ${selected ? 'bg-red-500 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}>
                    {text}
                </button>
            )}
        </Tab>
    )
}

function ProfileContent() {
    const { mediaList, user, loading } = useUserMedia();
    const router = useRouter();
    const searchParams = useSearchParams();
    const tabIndexParam = searchParams.get('tab');
    
    const [selectedIndex, setSelectedIndex] = useState(tabIndexParam ? parseInt(tabIndexParam) : 0);

    const favorites = mediaList.filter(m => m.is_favorite);
    const movies = favorites.filter(m => m.media_type === 'movie');
    const series = favorites.filter(m => m.media_type === 'tv');
    const anime = favorites.filter(m => m.media_type === 'anime');
    const games = favorites.filter(m => m.media_type === 'game');
    const books = favorites.filter(m => m.media_type === 'book');

    const renderMediaList = (list: any[]) => {
        if (list.length === 0) return <p className="text-gray-400 p-5">Список пуст</p>;
        
        return (
            <ul className='flex flex-col gap-y-5'>
                {list.map(item => (
                    <li key={`${item.media_type}-${item.media_id}`} className='flex flex-col sm:flex-row justify-between sm:items-center p-5 rounded-xl bg-[#161618] gap-4'>
                        <div className="flex items-center gap-5">
                            <div className='w-[70px] h-[90px] rounded-xl bg-gray-500 relative overflow-hidden shrink-0'>
                                {item.cover_url && <Image src={item.cover_url} alt={item.title} fill className="object-cover" />}
                            </div>
                            <div>
                                <Link href={`/${item.media_type === 'tv' ? 'series' : item.media_type === 'movie' ? 'movies' : item.media_type}s/${item.media_id}`} className="text-lg font-medium hover:text-red-500 transition-colors">
                                    {item.title}
                                </Link>
                                <div className='flex items-center gap-x-3 text-[#8c8c8c] mt-2'>
                                    <span className="capitalize">{item.media_type}</span>
                                    <li><div className="h-1 w-1 rounded-full bg-[#8c8c8c]"></div></li>
                                    <span>Статус: {
                                        item.status === 'planned' ? 'В планах' : 
                                        item.status === 'watching' ? 'В процессе' : 
                                        item.status === 'completed' ? 'Просмотрено' : 'Брошено'
                                    }</span>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        );
    };

    if (loading) {
        return <div className="mt-[120px] mb-[100px] text-center text-white">Загрузка...</div>;
    }

    return (  
        <main className='mt-[120px] mb-[100px]'>
            <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
                <div className="container flex lg:flex-row flex-col gap-20">
                    <Tab.List className='flex flex-col bg-[#161618] rounded-xl p-10 min-w-[300px] h-fit'>
                        <TabCustom text='Профиль' />
                        <TabCustom text='Избранное' />
                        <TabCustom text='Настройки' />
                    </Tab.List>
                    <Tab.Panels className='w-full'>
                        <Tab.Panel>
                            <div className="flex flex-col p-10 rounded-xl bg-[#161618]">
                                <div className='w-[80px] h-[80px] rounded-xl bg-red-500 flex justify-center items-center text-3xl font-bold'>
                                    {user?.email?.[0].toUpperCase() || 'G'}
                                </div>
                                <ul className='flex flex-col divide-y-[1px] divide-[#dee2e6]/20 mt-12'>
                                    <li className='flex xs:flex-row flex-col gap-y-1 py-4'>
                                        <span className='text-[#8C8C8C] xs:w-1/3'>Email</span>
                                        <span className='xs:w-2/3 xs:text-base text-sm'>{user?.email || 'Гость'}</span>
                                    </li>
                                    <li className='flex xs:flex-row flex-col gap-y-1 py-4'>
                                        <span className='text-[#8C8C8C] xs:w-1/3'>Статус</span>
                                        <span className='xs:w-2/3 xs:text-base text-sm'>{user ? 'Авторизован' : 'Анонимный гость (данные сохраняются только в браузере)'}</span>
                                    </li>
                                    <li className='flex xs:flex-row flex-col gap-y-1 py-4'>
                                        <span className='text-[#8C8C8C] xs:w-1/3'>Всего в Избранном</span>
                                        <span className='xs:w-2/3 xs:text-base text-sm'>{favorites.length} элементов</span>
                                    </li>
                                </ul>
                            </div>
                        </Tab.Panel>
                        
                        <Tab.Panel>
                            <Tab.Group>
                                <Tab.List className="flex gap-3 overflow-x-auto pb-4 mb-6 scrollbar-hide">
                                    <SubTabCustom text={`Фильмы (${movies.length})`} />
                                    <SubTabCustom text={`Сериалы (${series.length})`} />
                                    <SubTabCustom text={`Аниме (${anime.length})`} />
                                    <SubTabCustom text={`Игры (${games.length})`} />
                                    <SubTabCustom text={`Книги (${books.length})`} />
                                </Tab.List>
                                <Tab.Panels>
                                    <Tab.Panel>{renderMediaList(movies)}</Tab.Panel>
                                    <Tab.Panel>{renderMediaList(series)}</Tab.Panel>
                                    <Tab.Panel>{renderMediaList(anime)}</Tab.Panel>
                                    <Tab.Panel>{renderMediaList(games)}</Tab.Panel>
                                    <Tab.Panel>{renderMediaList(books)}</Tab.Panel>
                                </Tab.Panels>
                            </Tab.Group>
                        </Tab.Panel>

                        <Tab.Panel>
                            <div className="flex flex-col p-10 rounded-xl bg-[#161618]">
                                <h2 className="text-xl font-medium mb-6">Настройки аккаунта</h2>
                                {user ? (
                                    <p className="text-gray-400">Настройки доступны только для демо-режима.</p>
                                ) : (
                                    <p className="text-gray-400">Пожалуйста, войдите в аккаунт, чтобы изменить настройки.</p>
                                )}
                            </div>
                        </Tab.Panel>
                    </Tab.Panels>
                </div>
            </Tab.Group>
        </main>
    );
}

export default function ProfilePage() {
    return (
        <React.Suspense fallback={<div className="mt-[120px] mb-[100px] text-center text-white">Загрузка...</div>}>
            <ProfileContent />
        </React.Suspense>
    );
}
