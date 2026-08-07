"use client";

import React, { Fragment, useState, useEffect } from 'react';
import { Metadata } from 'next';
import { Tab } from '@headlessui/react';
import Link from 'next/link';
import Image from 'next/image';
import { useUserMedia } from '@/hooks/useUserMedia';
import { createClient } from '@/utils/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import MediaCard from '@/components/MediaCard';
import { User, Heart, Settings } from 'lucide-react';

function ProfileSkeleton() {
    return (
        <main className='mt-[120px] mb-[100px]'>
            <div className="container flex lg:flex-row flex-col gap-20">
                {/* Left Sidebar Skeleton (Exact match of real tabs) */}
                <div className="relative z-10 flex flex-col space-y-1 min-w-[280px] h-fit rounded-2xl border border-white/10 bg-black/40 p-2 shadow-xl shadow-black/50 before:content-[''] before:absolute before:inset-0 before:backdrop-blur-3xl before:rounded-2xl before:-z-10">
                    <div className="flex w-full items-center rounded-xl border border-white/10 bg-white/5 p-3 shadow-sm">
                        <div className="flex flex-1 items-center gap-3">
                            <User className="h-4 w-4 text-white/90" />
                            <span className="whitespace-nowrap font-medium text-sm leading-tight tracking-tight text-white/90">Профиль</span>
                        </div>
                    </div>
                    <div className="my-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent relative z-10" />
                    <div className="flex w-full items-center rounded-xl border border-transparent p-3 opacity-70">
                        <div className="flex flex-1 items-center gap-3">
                            <Heart className="h-4 w-4 text-white/60" />
                            <span className="whitespace-nowrap font-medium text-sm leading-tight tracking-tight text-white/70">Избранное</span>
                        </div>
                    </div>
                    <div className="my-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent relative z-10" />
                    <div className="flex w-full items-center rounded-xl border border-transparent p-3 opacity-70">
                        <div className="flex flex-1 items-center gap-3">
                            <Settings className="h-4 w-4 text-white/60" />
                            <span className="whitespace-nowrap font-medium text-sm leading-tight tracking-tight text-white/70">Настройки</span>
                        </div>
                    </div>
                </div>
                
                {/* Right Content Skeleton (Exact match of Profile Tab) */}
                <div className='w-full'>
                    <div className="flex flex-col p-10 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl animate-pulse">
                        {/* Avatar */}
                        <div className='w-[80px] h-[80px] rounded-xl bg-white/10'></div>
                        {/* Info List */}
                        <ul className='flex flex-col divide-y-[1px] divide-[#dee2e6]/20 mt-12'>
                            <li className='flex xs:flex-row flex-col gap-y-1 py-4'>
                                <span className='text-[#8C8C8C] xs:w-1/3'>Email</span>
                                <div className='h-5 w-48 bg-white/10 rounded'></div>
                            </li>
                            <li className='flex xs:flex-row flex-col gap-y-1 py-4'>
                                <span className='text-[#8C8C8C] xs:w-1/3'>Статус</span>
                                <div className='h-5 w-32 bg-white/10 rounded'></div>
                            </li>
                            <li className='flex xs:flex-row flex-col gap-y-1 py-4'>
                                <span className='text-[#8C8C8C] xs:w-1/3'>Всего в Избранном</span>
                                <div className='h-5 w-24 bg-white/10 rounded'></div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </main>
    );
}

function TabCustom({ text, icon: Icon }: { text: string, icon: any }) {
    return (
        <Tab as={Fragment}>
            {({ selected }) => (
                <button className={`group/item flex w-full cursor-pointer items-center rounded-xl border p-3 transition-all duration-200 hover:border-white/10 hover:bg-white/5 hover:shadow-sm outline-none ${
                    selected ? 'border-white/10 bg-white/5 shadow-sm' : 'border-transparent bg-transparent'
                }`}>
                    <div className="flex flex-1 items-center gap-3">
                        <Icon className={`h-4 w-4 transition-colors ${selected ? 'text-white/90' : 'text-white/60 group-hover/item:text-white/90'}`} />
                        <span className={`whitespace-nowrap font-medium text-sm leading-tight tracking-tight transition-colors ${selected ? 'text-white/90' : 'text-white/70 group-hover/item:text-white/90'}`}>
                            {text}
                        </span>
                    </div>
                </button>
            )}
        </Tab>
    )
}

function SubTabCustom({ text }: { text: string }) {
    return (
        <Tab as={Fragment}>
            {({ selected }) => (
                <button className={`px-4 py-2.5 rounded-xl font-medium transition-all duration-300 border backdrop-blur-md shadow-sm ${selected ? 'bg-[#ff1414]/20 border-[#ff1414]/40 text-white' : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20 hover:text-white'}`}>
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

    const FilterableMediaList = ({ items }: { items: any[] }) => {
        const [statusFilter, setStatusFilter] = useState<string>('all');
        
        const filteredItems = statusFilter === 'all' 
            ? items 
            : items.filter(item => item.status === statusFilter);

        if (items.length === 0) return <p className="text-gray-400 p-5">Список пуст</p>;

        return (
            <div className="flex flex-col gap-6">
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                    <button 
                        onClick={() => setStatusFilter('all')}
                        className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-300 border backdrop-blur-md shadow-sm whitespace-nowrap ${statusFilter === 'all' ? 'bg-[#ff1414]/20 border-[#ff1414]/40 text-white' : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20 hover:text-white'}`}
                    >
                        Все ({items.length})
                    </button>
                    <button 
                        onClick={() => setStatusFilter('planned')}
                        className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-300 border backdrop-blur-md shadow-sm whitespace-nowrap ${statusFilter === 'planned' ? 'bg-[#ff1414]/20 border-[#ff1414]/40 text-white' : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20 hover:text-white'}`}
                    >
                        В планах ({items.filter(i => i.status === 'planned').length})
                    </button>
                    <button 
                        onClick={() => setStatusFilter('watching')}
                        className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-300 border backdrop-blur-md shadow-sm whitespace-nowrap ${statusFilter === 'watching' ? 'bg-[#ff1414]/20 border-[#ff1414]/40 text-white' : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20 hover:text-white'}`}
                    >
                        Смотрю ({items.filter(i => i.status === 'watching').length})
                    </button>
                    <button 
                        onClick={() => setStatusFilter('completed')}
                        className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-300 border backdrop-blur-md shadow-sm whitespace-nowrap ${statusFilter === 'completed' ? 'bg-[#ff1414]/20 border-[#ff1414]/40 text-white' : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20 hover:text-white'}`}
                    >
                        Просмотрено ({items.filter(i => i.status === 'completed').length})
                    </button>
                    <button 
                        onClick={() => setStatusFilter('dropped')}
                        className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-300 border backdrop-blur-md shadow-sm whitespace-nowrap ${statusFilter === 'dropped' ? 'bg-[#ff1414]/20 border-[#ff1414]/40 text-white' : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20 hover:text-white'}`}
                    >
                        Брошено ({items.filter(i => i.status === 'dropped').length})
                    </button>
                </div>
                
                {filteredItems.length === 0 ? (
                    <p className="text-gray-400 p-5">В этой категории пока ничего нет</p>
                ) : (
                    <ul className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-4'>
                        {filteredItems.map(item => (
                            <li key={`${item.media_type}-${item.media_id}`}>
                                <MediaCard 
                                    id={item.media_id}
                                    name={item.title}
                                    year={
                                        item.status === 'planned' ? 'В планах' : 
                                        item.status === 'watching' ? 'Смотрю' : 
                                        item.status === 'completed' ? 'Просмотрено' : 'Брошено'
                                    }
                                    genre={
                                        item.media_type === 'tv' ? 'Сериал' : 
                                        item.media_type === 'movie' ? 'Фильм' : 
                                        item.media_type === 'anime' ? 'Аниме' : 
                                        item.media_type === 'game' ? 'Игра' : 'Книга'
                                    }
                                    rate={item.rating || 0}
                                    img={item.cover_url || ''}
                                    type={item.media_type}
                                    href={`/${item.media_type === 'tv' ? 'series' : item.media_type === 'movie' ? 'movies' : item.media_type === 'anime' ? 'anime' : item.media_type + 's'}/${item.media_id}`}
                                />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        );
    };

    if (loading) {
        return <ProfileSkeleton />;
    }

    return (  
        <main className='mt-[120px] mb-[100px]'>
            <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
                <div className="container flex lg:flex-row flex-col gap-20">
                    <Tab.List className="relative z-10 flex flex-col space-y-1 min-w-[280px] h-fit rounded-2xl border border-white/10 bg-black/40 p-2 shadow-xl shadow-black/50 before:content-[''] before:absolute before:inset-0 before:backdrop-blur-3xl before:rounded-2xl before:-z-10">
                        <TabCustom text='Профиль' icon={User} />
                        <div className="my-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent relative z-10" />
                        <TabCustom text='Избранное' icon={Heart} />
                        <div className="my-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent relative z-10" />
                        <TabCustom text='Настройки' icon={Settings} />
                    </Tab.List>
                    <Tab.Panels className='w-full'>
                        <Tab.Panel>
                            <div className="flex flex-col p-10 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl">
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
                                    <Tab.Panel><FilterableMediaList items={movies} /></Tab.Panel>
                                    <Tab.Panel><FilterableMediaList items={series} /></Tab.Panel>
                                    <Tab.Panel><FilterableMediaList items={anime} /></Tab.Panel>
                                    <Tab.Panel><FilterableMediaList items={games} /></Tab.Panel>
                                    <Tab.Panel><FilterableMediaList items={books} /></Tab.Panel>
                                </Tab.Panels>
                            </Tab.Group>
                        </Tab.Panel>

                        <Tab.Panel>
                            <div className="flex flex-col p-10 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl">
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
        <React.Suspense fallback={<ProfileSkeleton />}>
            <ProfileContent />
        </React.Suspense>
    );
}
