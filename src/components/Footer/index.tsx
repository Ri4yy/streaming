import React from 'react';
import { BsTelegram } from 'react-icons/bs';
import { SlSocialVkontakte } from 'react-icons/sl';

export default function Footer() {
    return (  
        <footer className={`relative py-8 box-border w-full before:content-[''] before:block before:absolute before:top-0 before:left-0 before:right-0 before:bottom-0 before:-z-10 before:origin-center 
        before:min-h-full before:bg-[url(/img/footer.png)] before:bg-[50%_60%] `}>
            <div className="absolute top-0 left-0 w-full h-full bg-[#111112]/80 -z-10"></div>
            <div className="container flex justify-between items-center z-10">
                <span className='text-[#BFBFBF]'>© 2026 Entertainment Catalog</span>
                <div className="flex gap-x-5">
                    <a href="#" className="group relative cursor-pointer">
                        <div className="absolute opacity-0 group-hover:opacity-100 transition-all duration-300 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 backdrop-blur-md bg-white/20 h-0 w-0 group-hover:w-12 group-hover:h-12 rounded-full -z-10"></div>
                        <BsTelegram className='w-7 h-7 z-10 group-hover:fill-white/70 backdrop-blur-md transition-all duration-300'/>
                    </a>
                    <a href="https://vk.com/" className="group relative cursor-pointer">
                        <div className="absolute opacity-0 group-hover:opacity-100 transition-all duration-300 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 backdrop-blur-md bg-white/20 h-0 w-0 group-hover:w-12 group-hover:h-12 rounded-full -z-10"></div>
                        <SlSocialVkontakte className='w-7 h-7 z-10 group-hover:fill-white/70 backdrop-blur-md transition-all duration-300'/>
                    </a>
                </div>
            </div>
        </footer>
    );
}
