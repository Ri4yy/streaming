"use client";

import React, { useState, useEffect } from 'react';
import { BsSearch } from "react-icons/bs";
import Checkbox from '@/components/Checkbox';
import { useRouter, useSearchParams } from 'next/navigation';

import { Listbox, Transition } from '@headlessui/react';
import { BsChevronDown } from 'react-icons/bs';

const sortOptions = [
    { id: 'rating', name: 'Рейтингу (по убыванию)' },
    { id: 'rating_asc', name: 'Рейтингу (по возрастанию)' },
    { id: 'date', name: 'Дате выхода (сначала новые)' },
    { id: 'date_asc', name: 'Дате выхода (сначала старые)' },
];

function CatalogFiltersContent({ genres }: { genres: { id: number, name: string }[] }) {
    const [isActive, setActive] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentSort = searchParams.get('sort') || 'rating';
    const currentQuery = searchParams.get('q') || '';
    const currentGenres = searchParams.get('genres')?.split(',').filter(Boolean) || [];
    
    const selectedSortOption = sortOptions.find(opt => opt.id === currentSort) || sortOptions[0];

    const [query, setQuery] = useState(currentQuery);

    const updateParams = (updates: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(updates).forEach(([key, value]) => {
            if (value === null || value === '') {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        });
        // Remove page on sort/filter change to go back to page 1
        if (updates.sort || updates.genres || updates.q !== undefined) {
            params.delete('page');
        }
        router.push(`?${params.toString()}`, { scroll: false });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        updateParams({ q: query });
    };

    const handleSortChange = (option: { id: string, name: string }) => {
        updateParams({ sort: option.id });
    };

    const toggleGenre = (genreName: string) => {
        let newGenres = [...currentGenres];
        if (newGenres.includes(genreName)) {
            newGenres = newGenres.filter(g => g !== genreName);
        } else {
            newGenres.push(genreName);
        }
        updateParams({ genres: newGenres.join(',') });
    };

    return (
        <>
            <form action="#" className='w-full' onSubmit={handleSearch}>
                <div className="group relative">
                    <input 
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        className='focus:bg-black/50 w-full py-4 px-7 pr-14 rounded-lg backdrop-blur-md bg-[#1E1E20] outline-none transition-colors duration-300' 
                        name='search' 
                        type="text" 
                        placeholder='Поиск...' 
                        autoComplete='off' 
                    />
                    <button type='submit'><BsSearch className='absolute top-1/2 -translate-y-1/2 right-6 h-5 w-5 fill-white hover:fill-[#ff1414] transition-colors duration-300' /></button>
                </div>
            </form>
            
            <div className="flex md:flex-row flex-col gap-5 justify-between md:items-center mt-6">
                <div className="flex xs:flex-row flex-col xs:items-center gap-4 z-50">
                    <span className="text-gray-300">Сортировать по:</span>
                    <div className="relative w-64">
                        <Listbox value={selectedSortOption} onChange={handleSortChange}>
                            <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-3 pl-5 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm text-black">
                                <span className="block truncate font-medium">{selectedSortOption.name}</span>
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
                                <Listbox.Options className="absolute mt-2 max-h-60 w-full overflow-auto rounded-md bg-white py-2 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm text-black border border-gray-100">
                                    {sortOptions.map((option, index) => (
                                        <Listbox.Option
                                            key={index}
                                            className={({ active }) =>
                                                `relative cursor-default select-none py-2.5 pl-5 pr-4 ${
                                                    active ? 'bg-gray-100 text-black' : 'text-gray-900'
                                                }`
                                            }
                                            value={option}
                                        >
                                            {({ selected }) => (
                                                <span className={`block truncate ${selected ? 'font-bold text-red-600' : 'font-normal'}`}>
                                                    {option.name}
                                                </span>
                                            )}
                                        </Listbox.Option>
                                    ))}
                                </Listbox.Options>
                            </Transition>
                        </Listbox>
                    </div>
                </div>

                {genres && genres.length > 0 && (
                    <div className="relative w-fit z-40">
                        <button 
                            className='px-6 py-3 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors duration-300'
                            onClick={() => setActive(!isActive)}
                        >
                            Фильтр по жанрам {currentGenres.length > 0 ? `(${currentGenres.length})` : ''}
                        </button>
                        
                        <Transition
                            show={isActive}
                            enter="transition ease-out duration-200"
                            enterFrom="opacity-0 translate-y-1"
                            enterTo="opacity-100 translate-y-0"
                            leave="transition ease-in duration-150"
                            leaveFrom="opacity-100 translate-y-0"
                            leaveTo="opacity-0 translate-y-1"
                        >
                            <div className="absolute right-0 mt-3 p-4 rounded-xl bg-[#1E1E20] min-w-[280px] border border-white/10 shadow-2xl">
                                <ul className='flex flex-col gap-2 text-white max-h-[300px] overflow-y-auto custom-scrollbar pr-2'>
                                    {genres.map(genre => {
                                        const isChecked = currentGenres.includes(genre.name);
                                        return (
                                            <li key={genre.id} className='hover:bg-white/5 transition-all duration-300 px-3 py-2 rounded-lg'>
                                                <label className='flex gap-4 items-center cursor-pointer'>
                                                    <input 
                                                        type="checkbox" 
                                                        checked={isChecked}
                                                        onChange={() => toggleGenre(genre.name)}
                                                        className="w-4 h-4 accent-red-500 cursor-pointer rounded border-gray-600 bg-gray-700 focus:ring-red-500 focus:ring-offset-gray-800"
                                                    />
                                                    <p className="select-none text-[15px]">{genre.name}</p>
                                                </label>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </Transition>
                    </div>
                )}
            </div>
        </>
    );
}

export default function CatalogFilters(props: { genres: { id: number, name: string }[] }) {
    return (
        <React.Suspense fallback={<div className="h-20 w-full animate-pulse bg-white/5 rounded-lg"></div>}>
            <CatalogFiltersContent {...props} />
        </React.Suspense>
    );
}
