"use client";

import React, { useEffect, useState } from 'react';
import { BsSearch, BsThreeDotsVertical, BsTelegram } from "react-icons/bs";
import { HiMenu } from "react-icons/hi";
import { TbDownload } from "react-icons/tb";
import { LogOut, User, Heart, LogIn } from "lucide-react";
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import ModalLogin from '@/components/ModalLogin';
import ModalSearch from '@/components/ModalSearch';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { createClient } from '@/utils/supabase/client';

function useScrollDirection() {
    const [scrollDirection, setScrollDirection] = useState<string | null>(null);

    useEffect(() => {
        let lastScrollY = window.pageYOffset;

        const updateScrollDirection = () => {
            const scrollY = window.pageYOffset;
            const direction = scrollY > lastScrollY ? "down" : "up";
            if (direction !== scrollDirection && (scrollY - lastScrollY > 8 || scrollY - lastScrollY < -8)) {
                setScrollDirection(direction);
            }
            lastScrollY = scrollY > 0 ? scrollY : 0;
        };
        window.addEventListener("scroll", updateScrollDirection);
        return () => {
            window.removeEventListener("scroll", updateScrollDirection);
        }
    }, [scrollDirection]);

    return scrollDirection;
}

export default function Header() {
    const scrollDirection = useScrollDirection();
    const pathname = usePathname();
    const [activeLogin, setActiveLogin] = useState(false);
    const [activeSearch, setActiveSearch] = useState(false);
    const [activeMenu, setActiveMenu] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const [user, setUser] = useState<any>(null);
    const [supabase] = useState(() => createClient());

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            if (data?.user) setUser(data.user);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
        });

        return () => subscription.unsubscribe();
    }, [supabase.auth]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        window.location.reload();
    };

    const navLinks = [
        { path: '/', label: 'Главная' },
        { path: '/movies', label: 'Фильмы' },
        { path: '/series', label: 'Сериалы' },
        { path: '/anime', label: 'Аниме' },
        { path: '/games', label: 'Игры' },
        { path: '/collections', label: 'Подборки' },

    ];

    const navRef = React.useRef<HTMLUListElement>(null);
    const [pillStyle, setPillStyle] = useState({ left: 0, width: 0, opacity: 0 });
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const activeIndex = navLinks.findIndex(link => pathname === link.path);

    useEffect(() => {
        // When not hovering, default to activeIndex
        if (hoveredIndex === null && activeIndex !== -1 && navRef.current) {
            const activeEl = navRef.current.children[activeIndex] as HTMLElement;
            if (activeEl) {
                setPillStyle({
                    left: activeEl.offsetLeft,
                    width: activeEl.offsetWidth,
                    opacity: 1
                });
            }
        } else if (hoveredIndex === null && activeIndex === -1) {
            setPillStyle(prev => ({ ...prev, opacity: 0 }));
        }
    }, [hoveredIndex, activeIndex, pathname]);

    useEffect(() => {
        // Handle window resize to recalculate pill position
        const handleResize = () => {
            if (hoveredIndex === null && activeIndex !== -1 && navRef.current) {
                const activeEl = navRef.current.children[activeIndex] as HTMLElement;
                if (activeEl) {
                    setPillStyle({
                        left: activeEl.offsetLeft,
                        width: activeEl.offsetWidth,
                        opacity: 1
                    });
                }
            }
        };
        window.addEventListener('resize', handleResize);
        // Small delay to ensure fonts/layout are ready
        setTimeout(handleResize, 100);
        return () => window.removeEventListener('resize', handleResize);
    }, [hoveredIndex, activeIndex]);

    const handleMouseEnter = (index: number) => {
        setHoveredIndex(index);
        if (navRef.current) {
            const el = navRef.current.children[index] as HTMLElement;
            if (el) {
                setPillStyle({
                    left: el.offsetLeft,
                    width: el.offsetWidth,
                    opacity: 1
                });
            }
        }
    };

    const handleMouseLeave = () => {
        setHoveredIndex(null);
    };

    return (
        <>
            <header className={`flex justify-between items-center px-8 py-1 rounded-2xl backdrop-blur-xl bg-black/40 border border-white/10 shadow-lg shadow-black/20 w-[98%] left-[1%] absolute ${scrollDirection === "down" ? "-top-24 " : "fixed"} top-2 transition-all duration-500 z-[60]`}>
                <Link 
                    href={`https://t.me/${process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME}`}
                    target="_blank" 
                    title="Перейти в Telegram-бота"
                    className="flex items-center justify-center w-10 h-10 rounded-[14px] bg-[#0088cc]/10 border border-[#0088cc]/20 text-[#0088cc] hover:bg-[#0088cc]/20 hover:border-[#0088cc]/40 hover:shadow-[0_0_15px_rgba(0,136,204,0.15)] transition-all duration-300"
                >
                    <BsTelegram className="w-5 h-5 drop-shadow-[0_0_4px_rgba(0,136,204,0.3)]" />
                </Link>
                <nav className="relative flex items-center">
                    <ul ref={navRef} className='hidden lg:flex gap-2 text-sm relative z-10' onMouseLeave={handleMouseLeave}>
                        {navLinks.map((link, idx) => (
                            <li key={link.path} className='py-4' onMouseEnter={() => handleMouseEnter(idx)}>
                                <Link href={link.path} className={`px-4 py-2 block text-white transition-colors duration-300 ${pathname === link.path ? 'font-medium' : 'text-white/70 hover:text-white'}`}>
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <div
                        className="absolute hidden lg:block top-1/2 -translate-y-1/2 h-[36px] bg-theme-main/20 backdrop-blur-xl border border-theme-main/40 rounded-xl shadow-[0_0_15px_var(--theme-border)] transition-all duration-300 ease-out z-0 pointer-events-none"
                        style={{ left: pillStyle.left, width: pillStyle.width, opacity: pillStyle.opacity }}
                    />
                </nav>
                <div className="flex lg:gap-5 gap-3 items-center ml-auto lg:ml-0 lg:mr-6 mr-4">
                    <button onClick={() => setActiveSearch(true)}><BsSearch className='xs:block hidden h-5 w-5 text-white/70 hover:text-theme-main hover:drop-shadow-[0_0_8px_var(--theme-primary)] transition-all duration-300' /></button>

                    {!user ? (
                        <div 
                            className="group relative md:py-1 py-1 after:w-[calc(100%+100px)] after:-translate-x-[100px] after:h-4 after:absolute after:-bottom-4 after:left-0 z-[70]"
                            onMouseEnter={() => setUserMenuOpen(true)}
                            onMouseLeave={() => setUserMenuOpen(false)}
                        >
                            {/* Trigger */}
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-2 transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:shadow-lg focus:outline-none backdrop-blur-md"
                                type="button"
                            >
                                <div className="flex-1 text-left hidden lg:block px-2">
                                    <div className="font-medium text-sm text-white/90 leading-tight tracking-tight">
                                        Гость
                                    </div>
                                    <div className="text-xs text-white/50 leading-tight tracking-tight">
                                        Войдите в аккаунт
                                    </div>
                                </div>
                                <div className="relative">
                                    <div className='w-10 h-10 rounded-full overflow-hidden relative bg-white/10 flex justify-center items-center text-xl font-bold text-white shadow-inner'>
                                        <User className="w-5 h-5 text-white/70" />
                                    </div>
                                </div>
                            </button>

                            {/* Dropdown Content */}
                            <div 
                                className={`absolute top-[calc(100%+8px)] right-0 ${userMenuOpen ? 'block' : 'hidden'} min-w-[240px] origin-top-right rounded-2xl border border-white/10 bg-black/40 p-2 shadow-xl shadow-black/50 transition-all duration-300 z-50 before:content-[''] before:absolute before:inset-0 before:backdrop-blur-3xl before:rounded-2xl before:-z-10`}
                            >
                                <div className="space-y-1 relative z-10">
                                    <Link href="/profile?tab=1" onClick={() => setUserMenuOpen(false)} className="group/item flex cursor-pointer items-center rounded-xl border border-transparent p-3 transition-all duration-200 hover:border-white/10 hover:bg-white/5 hover:shadow-sm">
                                        <div className="flex flex-1 items-center gap-3">
                                            <Heart className="h-4 w-4 text-white/60 group-hover/item:text-white/90 transition-colors" />
                                            <span className="whitespace-nowrap font-medium text-sm text-white/70 leading-tight tracking-tight transition-colors group-hover/item:text-white/90">Избранное</span>
                                        </div>
                                    </Link>
                                </div>

                                <div className="my-2 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent relative z-10" />

                                <ThemeSwitcher />

                                <div className="my-2 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent relative z-10" />

                                <button onClick={() => { setActiveLogin(true); setUserMenuOpen(false); }} className="group/item flex w-full cursor-pointer items-center gap-3 rounded-xl border border-transparent bg-white/5 p-3 transition-all duration-200 hover:border-white/20 hover:bg-white/10 hover:shadow-sm" type="button">
                                    <LogIn className="h-4 w-4 text-white/90 transition-colors" />
                                    <span className="font-medium text-white/90 text-sm transition-colors">Вход</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div 
                            className="group relative md:py-1 py-1 after:w-[calc(100%+100px)] after:-translate-x-[100px] after:h-4 after:absolute after:-bottom-4 after:left-0 z-[70]"
                            onMouseEnter={() => setUserMenuOpen(true)}
                            onMouseLeave={() => setUserMenuOpen(false)}
                        >
                            {/* Trigger */}
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-2 transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:shadow-lg focus:outline-none backdrop-blur-md"
                                type="button"
                            >
                                <div className="flex-1 text-left hidden lg:block px-2">
                                    <div className="font-medium text-sm text-white/90 leading-tight tracking-tight">
                                        {user.email?.split('@')[0] || "Пользователь"}
                                    </div>
                                    <div className="text-xs text-white/50 leading-tight tracking-tight">
                                        {user.email}
                                    </div>
                                </div>
                                <div className="relative">
                                    <div className='w-10 h-10 rounded-full overflow-hidden relative bg-theme-main flex justify-center items-center text-xl font-bold text-white shadow-inner'>
                                        {user.email?.[0].toUpperCase()}
                                    </div>
                                </div>
                            </button>

                            {/* Dropdown Content */}
                            <div 
                                className={`absolute top-[calc(100%+8px)] right-0 ${userMenuOpen ? 'block' : 'hidden'} min-w-[240px] origin-top-right rounded-2xl border border-white/10 bg-black/40 p-2 shadow-xl shadow-black/50 transition-all duration-300 z-50 before:content-[''] before:absolute before:inset-0 before:backdrop-blur-3xl before:rounded-2xl before:-z-10`}
                            >
                                <div className="space-y-1 relative z-10">
                                    <Link href="/profile?tab=0" onClick={() => setUserMenuOpen(false)} className="group/item flex cursor-pointer items-center rounded-xl border border-transparent p-3 transition-all duration-200 hover:border-white/10 hover:bg-white/5 hover:shadow-sm">
                                        <div className="flex flex-1 items-center gap-3">
                                            <User className="h-4 w-4 text-white/60 group-hover/item:text-white/90 transition-colors" />
                                            <span className="whitespace-nowrap font-medium text-sm text-white/70 leading-tight tracking-tight transition-colors group-hover/item:text-white/90">Профиль</span>
                                        </div>
                                    </Link>
                                    <Link href="/profile?tab=1" onClick={() => setUserMenuOpen(false)} className="group/item flex cursor-pointer items-center rounded-xl border border-transparent p-3 transition-all duration-200 hover:border-white/10 hover:bg-white/5 hover:shadow-sm">
                                        <div className="flex flex-1 items-center gap-3">
                                            <Heart className="h-4 w-4 text-white/60 group-hover/item:text-white/90 transition-colors" />
                                            <span className="whitespace-nowrap font-medium text-sm text-white/70 leading-tight tracking-tight transition-colors group-hover/item:text-white/90">Избранное</span>
                                        </div>
                                    </Link>
                                </div>

                                <div className="my-2 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent relative z-10" />

                                <ThemeSwitcher />

                                <div className="my-2 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent relative z-10" />

                                <button onClick={() => { handleSignOut(); setUserMenuOpen(false); }} className="group/item flex w-full cursor-pointer items-center gap-3 rounded-xl border border-transparent bg-red-500/10 p-3 transition-all duration-200 hover:border-red-500/30 hover:bg-red-500/20 hover:shadow-sm" type="button">
                                    <LogOut className="h-4 w-4 text-red-500 group-hover/item:text-red-400 transition-colors" />
                                    <span className="font-medium text-red-500 text-sm group-hover/item:text-red-400 transition-colors">Выйти</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                <div className="lg:hidden flex justify-center items-center relative lg:py-0 py-3" onClick={() => setActiveMenu(!activeMenu)}>
                    <HiMenu className='cursor-pointer h-6 w-6 z-20' />
                    <div className="absolute backdrop-blur-md bg-white/20 rounded-md w-8 h-8"></div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {activeMenu && (
                <div className="fixed inset-0 z-[55] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center lg:hidden pt-20 transition-all duration-300">
                    <button className="absolute top-6 right-6 text-white text-3xl" onClick={() => setActiveMenu(false)}>&times;</button>
                    <ul className="flex flex-col gap-6 text-center text-xl font-medium">
                        {navLinks.map(link => (
                            <li key={link.path}>
                                <Link href={link.path} onClick={() => setActiveMenu(false)} className={`transition-colors duration-300 ${pathname === link.path ? 'text-white' : 'text-white/70 hover:text-white'}`}>
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <ModalLogin active={activeLogin} setActive={setActiveLogin} />
            <ModalSearch activeSearch={activeSearch} setActiveSearch={setActiveSearch} />
        </>
    );
}
