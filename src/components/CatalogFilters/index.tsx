"use client";

import React, { useState } from 'react';
import { BsSearch } from "react-icons/bs";
import Checkbox from '@/components/Checkbox';

export default function CatalogFilters({ genres }: { genres: { id: number, name: string }[] }) {
    const [isActive, setActive] = useState(false);

    return (
        <>
            <form action="#" className='w-full' onSubmit={(e) => e.preventDefault()}>
                <div className="group relative">
                    <input className='focus:bg-black/50 w-full py-4 px-7 pr-14 rounded-lg backdrop-blur-md bg-[#1E1E20] outline-none' name='name' type="text" placeholder='Поиск...' autoComplete='off' />
                    <button type='submit'><BsSearch className='absolute top-1/2 -translate-y-1/2 right-6 h-5 w-5 fill-white hover:fill-[#ff1414]' /></button>
                </div>
            </form>
            <div className="flex md:flex-row flex-col gap-5 justify-between md:items-center mt-4 ">
                <div className="flex xs:flex-row flex-col xs:items-center gap-5">
                    Сортировать по: 
                    <select className='px-6 py-3 rounded-lg bg-white/10 backdrop-blur-sm'>
                        <option>Дате добавления</option>
                        <option>Дате выхода</option>
                        <option>Рейтингу</option>
                        <option>Названию</option>
                    </select>
                </div>
                <div className="relative w-fit">
                    <button 
                        className='px-6 py-3 rounded-lg bg-white/10 backdrop-blur-sm'
                        onClick={() => setActive(!isActive)}
                    >Выберите жанр</button>
                    <div className={`absolute z-[51] top-14 left-0 p-3 rounded-md bg-black min-w-[200px] ${isActive ? 'block' : 'hidden'}`}>
                        <ul className='flex flex-col gap-1 text-white max-h-[204px] overflow-y-scroll'>
                            {genres.map(genre => 
                                <li key={genre.id} className='hover:bg-[#ff1414]/70 transition-all duration-300 px-2 py-1 rounded-md'>
                                    <label className='flex gap-3 items-center cursor-pointer'>
                                        <Checkbox />
                                        <p>{genre.name}</p>
                                    </label>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}
