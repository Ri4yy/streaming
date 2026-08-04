"use client";

import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { BsSearch, BsChevronDown } from "react-icons/bs";
import { useRouter } from 'next/navigation';
import { Listbox, Transition } from '@headlessui/react';

const searchCategories = [
    { id: 'search', name: 'Везде' },
    { id: 'movies', name: 'Фильмы' },
    { id: 'series', name: 'Сериалы' },
    { id: 'anime', name: 'Аниме' },
    { id: 'games', name: 'Игры' },
    { id: 'books', name: 'Книги' },
];

export default function ModalSearch({ activeSearch, setActiveSearch }: { activeSearch: boolean, setActiveSearch: (v: boolean) => void }) {
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState(searchCategories[0]);
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            setActiveSearch(false);
            router.push(`/${category.id}?q=${encodeURIComponent(query.trim())}`);
        }
    };

    return (  
        <div className={`${activeSearch ? 'modal__active' : 'modal'} flex justify-center items-center`}>
            <div className={`md:w-3/5 xl:w-2/5 w-[90%] h-fit z-[63] ${activeSearch ? 'flex flex-col gap-4' : 'hidden'} relative`}>
                <button onClick={() => setActiveSearch(false)} className="flex justify-center items-center absolute -top-14 right-0 backdrop-blur-md bg-white/20 rounded-lg hover:rounded-full transition-all duration-300 w-10 h-10 z-[62]">
                    <IoClose className=' h-8 w-8' />
                </button>
                <form action="#" method="POST" className='w-full flex gap-3 xs:flex-row flex-col' onSubmit={handleSearch}>
                    <div className="relative w-full xs:w-[150px] shrink-0 z-50">
                        <Listbox value={category} onChange={setCategory}>
                            <Listbox.Button className="relative w-full h-full min-h-[56px] cursor-default rounded-lg bg-[#1E1E20] py-4 pl-5 pr-10 text-left shadow-md focus:outline-none sm:text-sm text-white">
                                <span className="block truncate font-medium">{category.name}</span>
                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                                    <BsChevronDown className="h-4 w-4 text-gray-500" aria-hidden="true" />
                                </span>
                            </Listbox.Button>
                            <Transition
                                as={React.Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <Listbox.Options className="absolute mt-2 max-h-60 w-full overflow-auto rounded-md bg-[#1E1E20] py-2 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm text-white border border-white/10">
                                    {searchCategories.map((option, index) => (
                                        <Listbox.Option
                                            key={index}
                                            className={({ active }) =>
                                                `relative cursor-default select-none py-2.5 pl-5 pr-4 ${
                                                    active ? 'bg-white/10' : ''
                                                }`
                                            }
                                            value={option}
                                        >
                                            {({ selected }) => (
                                                <span className={`block truncate ${selected ? 'font-bold text-red-500' : 'font-normal'}`}>
                                                    {option.name}
                                                </span>
                                            )}
                                        </Listbox.Option>
                                    ))}
                                </Listbox.Options>
                            </Transition>
                        </Listbox>
                    </div>
                    <div className="group relative w-full">
                        <input 
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className='focus:bg-black/50 w-full py-4 px-7 pr-14 rounded-lg backdrop-blur-md bg-black/30 outline-none border border-transparent focus:border-white/30 transition-all duration-300' 
                            name='search' 
                            type="text" 
                            placeholder='Поиск...' 
                            autoComplete='off' 
                        />
                        <button type='submit'><BsSearch className='absolute top-1/2 -translate-y-1/2 right-6 h-5 w-5 fill-white hover:fill-[#ff1414] transition-colors duration-300' /></button>
                    </div>
                </form>
            </div>
        </div>
    );
}
