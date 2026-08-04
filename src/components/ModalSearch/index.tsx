"use client";

import React from 'react';
import { IoClose } from 'react-icons/io5';
import { BsSearch } from "react-icons/bs";

export default function ModalSearch({ activeSearch, setActiveSearch }: { activeSearch: boolean, setActiveSearch: (v: boolean) => void }) {
    return (  
        <div className={`${activeSearch ? 'modal__active' : 'modal'} flex justify-center items-center`}>
            <div className={`md:w-3/5 xl:w-2/5 w-[90%] h-fit z-[63] ${activeSearch ? 'flex ' : 'hidden'} relative`}>
                <button onClick={() => setActiveSearch(false)} className="flex justify-center items-center absolute -top-14 right-0 backdrop-blur-md bg-white/20 rounded-lg hover:rounded-full transition-all duration-300 w-10 h-10 z-[62]">
                    <IoClose className=' h-8 w-8' />
                </button>
                <form action="#" method="POST" className='w-full' onSubmit={(e) => e.preventDefault()}>
                    <div className="group relative">
                        <input className='focus:bg-black/50 w-full py-4 px-7 pr-14 rounded-lg backdrop-blur-md bg-black/30 outline-none border border-transparent focus:border-white/30 transition-all duration-300' name='search' type="text" placeholder='Поиск...' autoComplete='off' />
                        <button type='submit'><BsSearch className='absolute top-1/2 -translate-y-1/2 right-6 h-5 w-5 fill-white hover:fill-[#ff1414] transition-colors duration-300' /></button>
                    </div>
                </form>
            </div>
        </div>
    );
}
