"use client";

import React, { useState } from 'react';
import MediaCard from '@/components/MediaCard';
import { BsSearch } from "react-icons/bs";
import Checkbox from '@/components/Checkbox';

export default function BooksPage() {
    let arrGenre = [
        { id: 1, name: 'Фантастика' },
        { id: 2, name: 'Фэнтези' },
        { id: 3, name: 'Детективы' },
        { id: 4, name: 'Романы' },
        { id: 5, name: 'Ужасы' },
        { id: 6, name: 'Научная литература' },
        { id: 7, name: 'Биографии' },
        { id: 8, name: 'История' },
        { id: 9, name: 'Бизнес' },
        { id: 10, name: 'Саморазвитие' }
    ];
    
    const [isActive, setActive] = useState(false);

    return (
        <main className='-mt-20'>
            <section className='lg:px-[80px] md:px-10 px-5 pt-[100px]'>
                <div className="bg-[#1E1E20] bg-center bg-cover rounded-2xl h-[700px] w-full relative overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <div className="absolute md:bottom-5 md:left-5 md:right-5 bottom-0 px-4 py-2.5 bg-black/60 backdrop-blur-md rounded-xl lg:max-w-[700px]">
                        <p className='md:text-3xl text-xl font-medium mb-4'>Властелин колец</p>
                        <p className='md:text-base text-xs text-[#e8dfde]'>
                            «Властелин колец» — роман-эпопея английского писателя Дж. Р. Р. Толкина, одно из самых известных произведений жанра фэнтези.
                        </p>
                    </div>
                </div>
            </section>

            <section className='container lg:py-[120px] md:py-14 py-8'>
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
                                {arrGenre.map(genre =>
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
                <div className="grid xl:grid-cols-4 lg:grid-cols-3 xs:grid-cols-2 mt-20 gap-x-5 gap-y-9">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                        <MediaCard 
                            key={i}
                            name="Властелин колец" 
                            year="1954" 
                            genre="Фэнтези" 
                            rate="9.5" 
                            img="/img/poster/spider.jpg" // placeholder
                            type="book"
                            href="/books/1"
                        />
                    ))}
                </div>
            </section>
        </main>
    );
}
