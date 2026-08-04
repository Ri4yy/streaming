import React from 'react';
import { BsTelegram } from 'react-icons/bs';
import { SlSocialVkontakte } from 'react-icons/sl';
import Link from 'next/link';

export default function Footer() {
    return (  
        <footer className="w-[98%] mx-auto my-4 relative z-10">
            <div className="rounded-2xl backdrop-blur-xl bg-black/40 border border-white/10 shadow-lg shadow-black/20 overflow-hidden relative p-8 md:p-12">
                {/* Background image layer for glass effect */}
                <div className="absolute inset-0 bg-[url(/img/footer.png)] bg-cover bg-center opacity-30 -z-10 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-black/40 -z-10"></div>

                <div className="flex flex-col md:flex-row justify-between gap-10">
                    <div className="flex flex-col gap-6 md:w-1/3">
                        <div>
                            <Link href="/" className="text-2xl font-bold text-white tracking-wider">CineBox</Link>
                            <p className="mt-4 text-gray-400 text-sm leading-relaxed">Твой личный каталог и трекер для фильмов, сериалов, аниме и игр. Ищи, сохраняй и смотри.</p>
                        </div>
                        <span className='text-gray-500 text-sm'>© 2026 CineBox</span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-10 md:gap-20">
                        <div className="flex flex-col gap-4">
                            <h3 className="text-white font-medium uppercase tracking-wider text-sm mb-2">Разделы</h3>
                            <Link href="/movies" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-300">Фильмы</Link>
                            <Link href="/series" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-300">Сериалы</Link>
                            <Link href="/anime" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-300">Аниме</Link>
                            <Link href="/games" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-300">Игры</Link>
                        </div>

                        <div className="flex flex-col gap-4">
                            <h3 className="text-white font-medium uppercase tracking-wider text-sm mb-2">Правовое</h3>
                            <Link href="/terms" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-300">Пользовательское соглашение</Link>
                            <Link href="/privacy" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-300">Обработка персональных данных</Link>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 items-start md:items-end">
                        <h3 className="text-white font-medium uppercase tracking-wider text-sm mb-2">Социальные сети</h3>
                        <div className="flex gap-x-4">
                            <a href="#" className="group relative cursor-pointer w-12 h-12 flex justify-center items-center rounded-full border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/20 transition-all duration-300">
                                <BsTelegram className='w-5 h-5 text-gray-300 group-hover:text-white transition-colors duration-300'/>
                            </a>
                            <a href="https://vk.com/" className="group relative cursor-pointer w-12 h-12 flex justify-center items-center rounded-full border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/20 transition-all duration-300">
                                <SlSocialVkontakte className='w-5 h-5 text-gray-300 group-hover:text-white transition-colors duration-300'/>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
