"use client";

import React from 'react';
import { IoClose } from 'react-icons/io5';
import { FaUserAlt } from 'react-icons/fa';
import { BiSolidLock } from 'react-icons/bi';

export default function ModalLogin({ active, setActive }: { active: boolean, setActive: (v: boolean) => void }) {
    return (  
        <div className={`${active ? 'modal__active' : 'modal'} flex justify-center items-center`}>
            <div className={`bg-black/30 md:pt-[60px] pt-8 md:px-[50px] px-[30px] md:pb-[50px] pb-6 rounded-2xl min-[440px]:w-[440px] w-[90%] h-fit z-[63] ${active ? 'flex ' : 'hidden'} relative`}>
                <button onClick={() => setActive(false)} className="flex justify-center items-center absolute top-10 right-12 backdrop-blur-md bg-white/20 rounded-lg hover:rounded-full transition-all duration-300 w-10 h-10 z-[62]">
                    <IoClose className=' h-8 w-8' />
                </button>
                <form action="#" method="POST" className='flex flex-col gap-8 w-full' onSubmit={(e) => e.preventDefault()}>
                    <p className='text-2xl font-medium text-center'>Вход</p>
                    <div className="group relative">
                        <FaUserAlt className='absolute top-1/2 -translate-y-1/2 left-6 fill-white/50 group-focus-within:fill-white transition-colors duration-300' />
                        <input className='w-full py-[10px] pl-[60px] pr-6 rounded-lg border-[1px] border-white/10 bg-white/5 outline-none focus:border-white/70' name='login' type="text" placeholder='Логин' autoComplete='off' />
                    </div>
                    <div className="group relative">
                        <BiSolidLock className='absolute top-1/2 -translate-y-1/2 left-6 h-5 w-5 fill-white/50 group-focus-within:fill-white transition-colors duration-300' />
                        <input className='w-full py-[10px] pl-[60px] pr-6 rounded-lg border-[1px] border-white/10 bg-white/5 outline-none focus:border-white/70' name='password' type="password" placeholder='Пароль' autoComplete='off' />
                    </div>
                    <button className='flex justify-center items-center group mt-4 py-4 w-full rounded-lg bg-[#ff1414] relative overflow-hidden transition-all duration-500 hover:scale-105'>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 bg-white rounded-full transition-all duration-500 ease-out group-hover:w-[400px] group-hover:h-[400px] z-0"></div>
                        <span className="relative z-10 font-medium group-hover:text-black transition-colors duration-500">Войти</span>
                    </button>
                    <button type="button" className='text-base font-medium text-center hover:text-[#ff1414] transition-all duration-300'>Регистрация</button>
                </form>
            </div>
        </div>
    );
}
