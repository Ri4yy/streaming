"use client";

import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { FaUserAlt } from 'react-icons/fa';
import { BiSolidLock } from 'react-icons/bi';
import { createClient } from '@/utils/supabase/client';
import { LoginButton } from '@telegram-auth/react';

export default function ModalLogin({ active, setActive }: { active: boolean, setActive: (v: boolean) => void }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [supabase] = useState(() => createClient());

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

    const handleTelegramAuth = async (user: any) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/auth/telegram', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user)
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Ошибка авторизации через Telegram');
            }
            
            // Successfully got session, now set it in Supabase
            const { error: sessionError } = await supabase.auth.setSession(data.session);
            
            if (sessionError) throw sessionError;
            
            setActive(false);
            window.location.reload();
        } catch (err: any) {
            setError(err.message || 'Произошла ошибка при входе через Telegram');
        } finally {
            setLoading(false);
        }
    };

    return (  
        <div className={`${active ? 'modal__active' : 'modal'} flex justify-center items-center`}>
            <div className={`bg-black/40 backdrop-blur-3xl border border-white/10 shadow-2xl shadow-black/50 md:pt-[60px] pt-8 md:px-[50px] px-[30px] md:pb-[50px] pb-6 rounded-2xl min-[440px]:w-[440px] w-[90%] h-fit z-[63] ${active ? 'flex ' : 'hidden'} relative`}>
                <button onClick={() => setActive(false)} className="flex justify-center items-center absolute top-10 right-12 backdrop-blur-md bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300 w-10 h-10 z-[62]">
                    <IoClose className=' h-8 w-8' />
                </button>
                <form className='flex flex-col gap-8 w-full' onSubmit={(e) => { e.preventDefault(); handleAuth('signin'); }}>
                    <p className='text-2xl font-medium text-center'>Вход в аккаунт</p>
                    
                    {error && <div className="text-red-500 text-sm text-center">{error}</div>}

                    <div className="group relative">
                        <FaUserAlt className='absolute top-1/2 -translate-y-1/2 left-6 fill-white/50 group-focus-within:fill-white transition-colors duration-300 z-10' />
                        <input value={email} onChange={e => setEmail(e.target.value)} required className='w-full py-4 pl-[60px] pr-6 rounded-xl bg-white/5 hover:bg-white/10 focus:bg-white/10 outline-none border border-white/10 hover:border-white/20 focus:border-white/30 transition-all duration-300 text-white placeholder:text-white/50' name='email' type="email" placeholder='Email' autoComplete='email' />
                    </div>
                    <div className="group relative">
                        <BiSolidLock className='absolute top-1/2 -translate-y-1/2 left-6 h-5 w-5 fill-white/50 group-focus-within:fill-white transition-colors duration-300 z-10' />
                        <input value={password} onChange={e => setPassword(e.target.value)} required className='w-full py-4 pl-[60px] pr-6 rounded-xl bg-white/5 hover:bg-white/10 focus:bg-white/10 outline-none border border-white/10 hover:border-white/20 focus:border-white/30 transition-all duration-300 text-white placeholder:text-white/50' name='password' type="password" placeholder='Пароль' autoComplete='current-password' />
                    </div>
                    <div className="flex flex-col gap-4 mt-2">
                        <button type="submit" disabled={loading} className='flex justify-center items-center group py-4 w-full rounded-lg bg-theme-gradient text-white font-bold hover:opacity-90 relative overflow-hidden transition-all duration-500 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100'>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 bg-white rounded-full transition-all duration-500 ease-out group-hover:w-[400px] group-hover:h-[400px] z-0"></div>
                            <span className="relative z-10 font-medium group-hover:text-black transition-colors duration-500">{loading ? 'Загрузка...' : 'Войти'}</span>
                        </button>
                        
                        <div className="flex items-center gap-3 w-full">
                            <div className="h-[1px] bg-white/10 flex-1"></div>
                            <span className="text-white/40 text-sm">или</span>
                            <div className="h-[1px] bg-white/10 flex-1"></div>
                        </div>

                        {/* 
                        <div className="flex justify-center w-full items-center my-2">
                            {process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME ? (
                                <LoginButton
                                    botUsername={process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME}
                                    onAuthCallback={(data) => handleTelegramAuth(data)}
                                    buttonSize="large"
                                    cornerRadius={8}
                                    showAvatar={true}
                                    lang="ru"
                                />
                            ) : (
                                <div className="text-xs text-white/50 text-center px-4 py-2 border border-white/10 rounded-lg w-full bg-white/5">Telegram Auth недоступен (не настроен NEXT_PUBLIC_TELEGRAM_BOT_USERNAME)</div>
                            )}
                        </div>
                        */}

                        <button type="button" onClick={() => handleAuth('signup')} disabled={loading} className='flex justify-center items-center group py-4 w-full rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40 transition-all duration-300 disabled:opacity-50'>
                            <span className="font-medium text-white/90 transition-colors duration-300 group-hover:text-white">Регистрация</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
