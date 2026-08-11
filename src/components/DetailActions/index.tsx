"use client";

import React from 'react';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { useUserMedia } from '@/hooks/useUserMedia';
import { Listbox, Transition } from '@headlessui/react';
import { BsChevronDown } from 'react-icons/bs';

const statusOptions = [
    { id: 'planned', name: 'В планах' },
    { id: 'watching', name: 'Смотрю / Читаю / Играю' },
    { id: 'completed', name: 'Просмотрено' },
    { id: 'dropped', name: 'Брошено' },
];

interface DetailActionsProps {
    id: string | number;
    type: 'movie' | 'tv' | 'anime' | 'game' | 'book';
    title: string;
    coverUrl?: string;
}

export default function DetailActions({ id, type, title, coverUrl }: DetailActionsProps) {
    const { getMedia, toggleFavorite, updateMedia } = useUserMedia();
    const media = getMedia(type, String(id));
    const isFavorite = media?.is_favorite || false;
    const status = media?.status || 'planned';

    const handleFavorite = () => {
        toggleFavorite(type, String(id), { title, cover_url: coverUrl });
    };

    const selectedStatusOption = statusOptions.find(opt => opt.id === status) || statusOptions[0];

    const handleStatusChange = (option: { id: string, name: string }) => {
        updateMedia({
            media_type: type,
            media_id: String(id),
            title,
            cover_url: coverUrl,
            status: option.id as any
        });
    };

    return (
        <div className="flex flex-col gap-3 mt-4 absolute bottom-5 left-1/2 -translate-x-1/2 w-[90%] z-20">
            <div className="relative w-full z-10">
                <Listbox value={selectedStatusOption} onChange={handleStatusChange}>
                    <Listbox.Button className="relative w-full cursor-default rounded-lg backdrop-blur-md bg-black/60 text-white py-2.5 pl-4 pr-10 text-left border border-white/20 outline-none hover:bg-black/80 transition-all duration-300">
                        <span className="block truncate font-medium text-sm">{selectedStatusOption.name}</span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                            <BsChevronDown className="h-4 w-4 text-white" aria-hidden="true" />
                        </span>
                    </Listbox.Button>
                    <Transition
                        as={React.Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Listbox.Options className="absolute bottom-full mb-2 w-full overflow-auto rounded-lg bg-black/90 backdrop-blur-md border border-white/20 py-1 shadow-lg ring-1 ring-black/5 focus:outline-none text-white text-sm">
                            {statusOptions.map((option, index) => (
                                <Listbox.Option
                                    key={index}
                                    className={({ active }) =>
                                        `relative cursor-default select-none py-2.5 pl-4 pr-4 transition-colors duration-200 ${
                                            active ? 'bg-white/20' : ''
                                        }`
                                    }
                                    value={option}
                                >
                                    {({ selected }) => (
                                        <span className={`block truncate ${selected ? 'font-bold text-theme-main' : 'font-normal'}`}>
                                            {option.name}
                                        </span>
                                    )}
                                </Listbox.Option>
                            ))}
                        </Listbox.Options>
                    </Transition>
                </Listbox>
            </div>
            
            <button 
                onClick={handleFavorite}
                className="group hover:scale-105 transition-all duration-500 overflow-hidden flex justify-center items-center backdrop-blur-md bg-black/60 py-2.5 w-full rounded-lg cursor-pointer"
            >
                {isFavorite ? (
                    <AiFillHeart className='w-5 h-5 fill-theme-main transition-all duration-500' />
                ) : (
                    <AiOutlineHeart className='w-5 h-5 group-hover:fill-black transition-all duration-500' />
                )}
                <span className={`whitespace-nowrap pl-3 transition-all duration-500 ${isFavorite ? 'text-theme-main' : 'group-hover:text-black'}`}>
                    {isFavorite ? 'В Избранном' : 'Добавить в Избранное'}
                </span>
                {!isFavorite && <div className="-z-10 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-0 h-0 group-hover:w-[150%] rounded-full group-hover:h-[1000%] bg-white transition-all duration-500"></div>}
            </button>
        </div>
    );
}
