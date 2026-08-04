"use client";

import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { FaUserAlt } from 'react-icons/fa';
import { BiSolidLock } from 'react-icons/bi';
import { createClient } from '@/utils/supabase/client';

export default function ModalLogin({ active, setActive }: { active: boolean, setActive: (v: boolean) => void }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const supabase = createClient();

    const handleAuth = async (type: 'signin' | 'signup') => {
        setLoading(true);
        setError(null);
        try {
            const { error } = type === 'signin' 
                ? await supabase.auth.signInWithPassword({ email, password })
                : await supabase.auth.signUp({ email, password });
                
            if (error) {
                setError(error.message);
            } else {
                setActive(false);
                window.location.reload(); // Перезагружаем страницу, чтобы обновить состояние в Header
            }
        } catch (err: any) {
            setError(err.message || 'Произошла ошибка');
        } finally {
            setLoading(false);
        }
    };

    return (  
        <div className={`${active ? 'modal__active' : 'modal'} flex justify-center items-center`}>
            <div className={`bg-black/80 backdrop-blur-xl md:pt-[60px] pt-8 md:px-[50px] px-[30px] md:pb-[50px] pb-6 rounded-2xl min-[440px]:w-[440px] w-[90%] h-fit z-[63] ${active ? 'flex ' : 'hidden'} relative`}>
                <button onClick={() => setActive(false)} className="flex justify-center items-center absolute top-10 right-12 backdrop-blur-md bg-white/20 rounded-lg hover:rounded-full transition-all duration-300 w-10 h-10 z-[62]">
                    <IoClose className=' h-8 w-8' />
                </button>
                <form className='flex flex-col gap-8 w-full' onSubmit={(e) => { e.preventDefault(); handleAuth('signin'); }}>
                    <p className='text-2xl font-medium text-center'>Вход в аккаунт</p>
                    
                    {error && <div className="text-red-500 text-sm text-center">{error}</div>}

                    <div className="group relative">
                        <FaUserAlt className='absolute top-1/2 -translate-y-1/2 left-6 fill-white/50 group-focus-within:fill-white transition-colors duration-300' />
                        <input value={email} onChange={e => setEmail(e.target.value)} required className='w-full py-[10px] pl-[60px] pr-6 rounded-lg border-[1px] border-white/10 bg-white/5 outline-none focus:border-white/70' name='email' type="email" placeholder='Email' autoComplete='email' />
                    </div>
                    <div className="group relative">
                        <BiSolidLock className='absolute top-1/2 -translate-y-1/2 left-6 h-5 w-5 fill-white/50 group-focus-within:fill-white transition-colors duration-300' />
                        <input value={password} onChange={e => setPassword(e.target.value)} required className='w-full py-[10px] pl-[60px] pr-6 rounded-lg border-[1px] border-white/10 bg-white/5 outline-none focus:border-white/70' name='password' type="password" placeholder='Пароль' autoComplete='current-password' />
                    </div>
                    <button type="submit" disabled={loading} className='flex justify-center items-center group mt-4 py-4 w-full rounded-lg bg-[#ff1414] relative overflow-hidden transition-all duration-500 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100'>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 bg-white rounded-full transition-all duration-500 ease-out group-hover:w-[400px] group-hover:h-[400px] z-0"></div>
                        <span className="relative z-10 font-medium group-hover:text-black transition-colors duration-500">{loading ? 'Загрузка...' : 'Войти'}</span>
                    </button>
                    <button type="button" onClick={() => handleAuth('signup')} disabled={loading} className='text-base font-medium text-center hover:text-[#ff1414] transition-all duration-300 disabled:opacity-50'>
                        Регистрация
                    </button>
                </form>
            </div>
        </div>
    );
}
