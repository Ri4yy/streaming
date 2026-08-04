"use client";

import React, { Fragment, useState } from 'react';
import { Tab } from '@headlessui/react';
import Link from 'next/link';

function TabCustom({ text }: { text: string }) {
    return (
        <Tab as={Fragment}>
            {({ selected }) => (
                <button className={
                    selected ? 'outline-none flex items-center whitespace-nowrap py-2 pl-2 before:w-1.5 before:h-1.5 before:opacity-100 transition-all duration-300 before:transition-all before:duration-300 before:-translate-x-3 before:rounded-full before:bg-red-500' : 'outline-none flex items-center whitespace-nowrap py-2 hover:pl-2 hover:before:w-1.5 hover:before:h-1.5 hover:before:opacity-100 transition-all duration-300 before:transition-all before:duration-300 before:-translate-x-3 before:w-0 before:h-0 before:rounded-full before:bg-red-500 before:opacity-0'
                }
                >{text}</button>
            )}
        </Tab>
    )
}

export default function ProfilePage() {
    return (  
        <main className='mt-[120px] mb-[100px]'>
            <Tab.Group defaultIndex={0}>
                <div className="container flex lg:flex-row flex-col gap-20">
                    <Tab.List className='flex flex-col bg-[#161618] rounded-xl p-10 min-w-[300px] h-fit'>
                        <TabCustom text='Профиль' />
                        <TabCustom text='Избранное' />
                        <TabCustom text='Комментарии' />
                        <TabCustom text='Настройки' />
                    </Tab.List>
                    <Tab.Panels className='w-full'>
                        <Tab.Panel>
                            <div className="flex flex-col p-10 rounded-xl bg-[#161618]">
                                <div className='w-[80px] h-[80px] rounded-xl bg-gray-500'></div>
                                <ul className='flex flex-col divide-y-[1px] divide-[#dee2e6]/20 mt-12'>
                                    <li className='flex xs:flex-row flex-col gap-y-1 py-2.5'>
                                        <span className='text-[#8C8C8C] xs:w-1/2'>Имя</span>
                                        <span className='xs:w-1/2 xs:text-base text-sm'>Александр</span>
                                    </li>
                                    <li className='flex xs:flex-row flex-col gap-y-1 py-2.5'>
                                        <span className='text-[#8C8C8C] xs:w-1/2'>Фамилия</span>
                                        <span className='xs:w-1/2 xs:text-base text-sm'>Иванов</span>
                                    </li>
                                    <li className='flex xs:flex-row flex-col gap-y-1 py-2.5'>
                                        <span className='text-[#8C8C8C] xs:w-1/2'>Страна</span>
                                        <span className='xs:w-1/2 xs:text-base text-sm'>Россия</span>
                                    </li>
                                    <li className='flex xs:flex-row flex-col gap-y-1 py-2.5'>
                                        <span className='text-[#8C8C8C] xs:w-1/2'>Город</span>
                                        <span className='xs:w-1/2 xs:text-base text-sm'>Москва</span>
                                    </li>
                                </ul>
                            </div>
                        </Tab.Panel>
                        <Tab.Panel>
                            <ul className='flex flex-col gap-y-5'>
                                <li className='flex justify-between items-center p-5 rounded-xl bg-[#161618]'>
                                    <div className="flex items-center gap-5">
                                        <div className='w-[70px] h-[70px] rounded-xl bg-gray-500'></div>
                                        <div>
                                            <p>Трансформеры</p>
                                            <ul className='flex items-center gap-x-3 text-[#8c8c8c]'>
                                                <li>8.4</li>
                                                <li><div className="h-1 w-1 rounded-full bg-[#8c8c8c]"></div></li>
                                                <li>2023</li>
                                                <li><div className="h-1 w-1 rounded-full bg-[#8c8c8c]"></div></li>
                                                <li>2ч 23 мин.</li>
                                            </ul>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </Tab.Panel>
                        <Tab.Panel>
                            <ul className='flex flex-col gap-y-5'>
                                <li className='flex flex-col rounded-xl bg-[#161618]'>
                                    <div className="p-7 border-b-[1px] border-[#323234] w-full">
                                        <div className="flex items-center gap-5 ">
                                            <div className='w-[70px] h-[70px] rounded-xl bg-gray-500'></div>
                                            <div>
                                                <Link href='/movies/1' className='hover:text-[#ff1414]'>Трансформеры: Последний рыцарь</Link>
                                                <ul className='flex items-center gap-x-3 text-[#8c8c8c]'>
                                                    <li>8.4</li>
                                                    <li><div className="h-1 w-1 rounded-full bg-[#8c8c8c]"></div></li>
                                                    <li>2023</li>
                                                </ul>
                                            </div>
                                        </div>
                                        <p className='text-[#BFBFBF] py-7 pb-0'>Отличный фильм! Рекомендую.</p>
                                    </div>
                                </li>
                            </ul>
                        </Tab.Panel>
                        <Tab.Panel>
                            <form method='POST' className="flex flex-col p-10 rounded-xl bg-[#161618]" onSubmit={e => e.preventDefault()}>
                                <ul className='flex flex-col gap-y-4 mt-12'>
                                    <li className='flex md:items-center md:flex-row flex-col'>
                                        <label htmlFor='name' className="xl:w-1/5 lg:w-1/3 md:w-1/3 mb-1">
                                            Имя
                                        </label>
                                        <div className="xl:w-4/5 lg:w-2/3 md:w-2/3">
                                            <input id='name' type="text" name="name" className='py-2.5 px-6 w-full rounded-lg bg-[#1E1E20] border-[1px] border-[#323233] outline-none focus:border-white/70' placeholder='Ваше имя' autoComplete='off' />
                                        </div>
                                    </li>
                                    <li className='flex md:items-center md:flex-row flex-col'>
                                        <label htmlFor='surname' className="xl:w-1/5 lg:w-1/3 md:w-1/3 mb-1">
                                            Фамилия
                                        </label>
                                        <div className="xl:w-4/5 lg:w-2/3 md:w-2/3">
                                            <input id='surname' type="text" name="surname" className='py-2.5 px-6 w-full rounded-lg bg-[#1E1E20] border-[1px] border-[#323233] outline-none focus:border-white/70' placeholder='Ваша фамилия' autoComplete='off' />
                                        </div>
                                    </li>
                                    <li className='flex gap-5 justify-end items-center'>
                                        <button className="group hover:scale-[1.03] transition-all duration-500 overflow-hidden flex justify-center items-center relative bg-[#252527] py-4 px-8 rounded-lg cursor-pointer mt-10">
                                            <span className='group-hover:text-black transition-all duration-500'>Отмена</span>
                                            <div className="-z-10 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-0 h-0 group-hover:w-[150%] rounded-full group-hover:h-[300%] bg-white transition-all duration-700"></div>
                                        </button>
                                        <button type='submit' className="group hover:scale-[1.05] transition-all duration-500 overflow-hidden flex justify-center items-center relative bg-[#F63131] py-4 px-8 rounded-lg cursor-pointer mt-10">
                                            <span className='group-hover:text-black transition-all duration-500'>Сохранить</span>
                                            <div className="-z-10 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-0 h-0 group-hover:w-[150%] rounded-full group-hover:h-[300%] bg-white transition-all duration-700"></div>
                                        </button>
                                    </li>
                                </ul>
                            </form>
                        </Tab.Panel>
                    </Tab.Panels>
                </div>
            </Tab.Group>
        </main>
    );
}
