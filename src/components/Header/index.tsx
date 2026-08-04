"use client";

import React, { useEffect, useState } from 'react';
import { BsSearch, BsThreeDotsVertical } from "react-icons/bs";
import { HiMenu } from "react-icons/hi";
import { TbDownload } from "react-icons/tb";
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import ModalLogin from '@/components/ModalLogin';
import ModalSearch from '@/components/ModalSearch';
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

    const getLinkClass = (path: string) => {
        const isActive = pathname === path;
        return isActive 
            ? "px-[10px] py-1.5 rounded-md backdrop-blur-md bg-white/20 transition-all duration-300" 
            : "px-[10px] py-1.5 rounded-md backdrop-blur-md hover:bg-white/10 transition-all duration-300";
    };

    return (
        <>
        <header className={`flex justify-between items-center px-8 rounded-lg backdrop-blur-md bg-black/50 w-[98%] left-[1%] absolute ${ scrollDirection === "down" ? "-top-24 " : "top-2 sticky"} top-2 transition-all duration-500 z-[60]`}>
            <button className='relative after:transition-all after:duration-500 hover:after:absolute after:w-10 after:h-10 hover:after:bg-white/20 after:top-1/2 after:-translate-y-1/2 after:left-1/2 after:-translate-x-1/2 after:rounded-full'>
                <BsThreeDotsVertical />
            </button>
            <nav>
                <ul className='hidden md:flex gap-3 text-sm'>
                    <li className='py-5'><Link href='/' className={getLinkClass('/')}>Главная</Link></li>
                    <li className='py-5'><Link href='/movies' className={getLinkClass('/movies')}>Фильмы</Link></li>
                    <li className='py-5'><Link href='/series' className={getLinkClass('/series')}>Сериалы</Link></li>
                    <li className='py-5'><Link href='/anime' className={getLinkClass('/anime')}>Аниме</Link></li>
                    <li className='py-5'><Link href='/games' className={getLinkClass('/games')}>Игры</Link></li>
                    <li className='py-5'><Link href='/books' className={getLinkClass('/books')}>Книги</Link></li>
                </ul>
            </nav>
            <div className="flex md:gap-5 gap-3 items-center ml-auto md:ml-0 md:mr-6 mr-4">
                <button onClick={() => setActiveSearch(true)}><BsSearch className='xs:block hidden h-5 w-5 hover:fill-[#ff1414] transition-all duration-300'/></button>
                
                {!user ? (
                    <>
                        <Link href='/profile?tab=1' className='flex justify-center items-center group md:py-2 md:px-4 rounded-lg md:border-white md:border-[2px] relative overflow-hidden mr-2'>
                            <div className="md:block hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 bg-white rounded-full transition-all duration-500 ease-out group-hover:w-[300px] group-hover:h-[300px] z-0"></div>
                            <span className='md:block hidden relative z-10 group-hover:text-black transition-colors duration-500 text-sm'>Избранное</span>
                        </Link>
                        <button onClick={() => setActiveLogin(true)} className='flex justify-center items-center group md:py-2 md:px-6 rounded-lg md:border-white md:border-[2px] relative overflow-hidden '>
                            <div className="md:block hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 bg-white rounded-full transition-all duration-500 ease-out group-hover:w-[300px] group-hover:h-[300px] z-0"></div>
                            <span className='md:block hidden relative z-10 group-hover:text-black transition-colors duration-500 text-sm'>Вход</span>
                        </button>
                    </>
                ) : (
                    <div className="group relative md:py-5 py-3 after:w-[calc(100%+100px)] after:-translate-x-[100px] after:h-3 after:absolute after:-bottom-3 after:left-0 md:block hidden">
                        <div className='w-10 h-10 rounded-full hover:outline-offset-1 hover:outline hover:outline-1 transition-all duration-200 cursor-pointer overflow-hidden relative bg-[#ff1414] flex justify-center items-center text-xl font-bold'>
                            {user.email?.[0].toUpperCase()}
                        </div>
                        <div className="group-hover:flex px-8 py-6 rounded-lg backdrop-blur-md bg-black/80 absolute top-[90px] right-0 hidden min-w-[calc(100%+200px)] ">
                            <ul className='flex flex-col'>
                                <li><div className="text-gray-400 text-xs mb-3 border-b border-gray-600 pb-2">{user.email}</div></li>
                                <li><Link href='/profile?tab=0' className='flex items-center whitespace-nowrap py-2 hover:pl-2 hover:before:w-1.5 hover:before:h-1.5 hover:before:opacity-100 transition-all duration-300 before:transition-all before:duration-300 before:-translate-x-3 before:w-0 before:h-0 before:rounded-full before:bg-red-500 before:opacity-0'>Профиль</Link></li>
                                <li><Link href='/profile?tab=1' className='flex items-center whitespace-nowrap py-2 hover:pl-2 hover:before:w-1.5 hover:before:h-1.5 hover:before:opacity-100 transition-all duration-300 before:transition-all before:duration-300 before:-translate-x-3 before:w-0 before:h-0 before:rounded-full before:bg-red-500 before:opacity-0'>Избранное</Link></li>
                                <li><button onClick={handleSignOut} className='flex w-full text-left items-center whitespace-nowrap py-2 hover:pl-2 hover:before:w-1.5 hover:before:h-1.5 hover:before:opacity-100 transition-all duration-300 before:transition-all before:duration-300 before:-translate-x-3 before:w-0 before:h-0 before:rounded-full before:bg-red-500 before:opacity-0 text-red-400'>Выйти</button></li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
            <div className="md:hidden flex justify-center items-center relative md:py-0 py-3" onClick={() => setActiveMenu(true)}>
                <HiMenu className='cursor-pointer h-6 w-6 z-20' />
                <div className="absolute backdrop-blur-md bg-white/20 rounded-md w-8 h-8"></div>
            </div>
        </header>
        <ModalLogin active={activeLogin} setActive={setActiveLogin} />
        <ModalSearch activeSearch={activeSearch} setActiveSearch={setActiveSearch} />
        </>
    );
}
