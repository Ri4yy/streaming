"use client";

import React, { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { BsPlayFill } from 'react-icons/bs';
import { IoClose } from 'react-icons/io5';
import CustomPlayer from '@/components/CustomPlayer';

interface TrailerModalProps {
    trailerKey: string;
}

export default function TrailerModal({ trailerKey }: TrailerModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    
    if (!trailerKey) return null;
    
    const thumbnailUrl = `https://i.ytimg.com/vi/${trailerKey}/maxresdefault.jpg`;
    const fallbackUrl = `https://i.ytimg.com/vi/${trailerKey}/hqdefault.jpg`;

    return (
        <>
            <div className="mt-10">
                <div 
                    className="relative w-[280px] h-[158px] rounded-xl overflow-hidden cursor-pointer group shadow-lg"
                    onClick={() => setIsOpen(true)}
                >
                    <img 
                        src={thumbnailUrl} 
                        onError={(e) => {
                            if (e.currentTarget.src !== fallbackUrl) {
                                e.currentTarget.src = fallbackUrl;
                            }
                        }}
                        alt="Trailer thumbnail" 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex justify-center items-center">
                        <button className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex justify-center items-center group-hover:bg-[#ff1414] transition-colors duration-300">
                            <BsPlayFill className="text-white text-3xl ml-1" />
                        </button>
                    </div>
                </div>
            </div>

            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-5xl transform overflow-visible rounded-2xl bg-black text-left align-middle shadow-xl transition-all relative">
                                    <button 
                                        onClick={() => setIsOpen(false)}
                                        className="absolute -top-12 right-0 text-white hover:text-[#ff1414] transition-colors z-50"
                                    >
                                        <IoClose size={40} />
                                    </button>
                                    <div className="w-full aspect-video relative rounded-2xl overflow-hidden">
                                        {isOpen && <CustomPlayer url={`https://www.youtube.com/watch?v=${trailerKey}`} autoPlay />}
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}
