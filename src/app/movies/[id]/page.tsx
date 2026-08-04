"use client";

import React, { Fragment } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AiOutlineHeart } from 'react-icons/ai';
import { FaUserAlt } from 'react-icons/fa';
import { FaMessage } from 'react-icons/fa6';
import { MdEmail } from 'react-icons/md';
import { Tab } from '@headlessui/react';

export default function MovieDetailPage({ params }: { params: { id: string } }) {
    return (  
        <main className='-mt-20'>
            <section className='max-[1100px]:pb-20 bg-[url(/img/bg.png)] bg-no-repeat bg-cover bg-center w-full min-[1100px]:h-screen md:min-h-[800px] flex flex-col justify-center relative after:absolute after:top-0 after:left-0 after:backdrop-blur-md after:z-10 after:w-full after:h-full overflow-hidden'>
                <div className="container flex max-[1100px]:flex-col gap-x-20 items-center z-20">
                    <div className="max-[1100px]:mt-[160px] w-[30%] h-full max-[1100px]:w-full relative">
                        <Image src="/img/poster/trans.jpg" alt="Poster" width={500} height={750} className='rounded-xl w-full object-cover h-[300px] min-[1100px]:h-full' />
                        <button className="group hover:scale-105 transition-all duration-500 overflow-hidden flex justify-center items-center absolute bottom-5 left-1/2 -translate-x-1/2 backdrop-blur-md bg-black/20 py-2.5 w-[90%] rounded-lg cursor-pointer">
                            <AiOutlineHeart className='w-5 h-5 group-hover:fill-black transition-all duration-500' />
                            <span className='whitespace-nowrap pl-3 group-hover:text-black transition-all duration-500'>Добавить в Избранное</span>
                            <div className="-z-10 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-0 h-0 group-hover:w-[150%] rounded-full group-hover:h-[1000%] bg-white transition-all duration-500"></div>
                        </button>
                    </div>
                    <div className="max-[1100px]:mt-10 w-[70%] max-[1100px]:w-full">
                        <div className="flex md:flex-col flex-row items-center md:items-start gap-x-2">
                            <div className="rounded-lg backdrop-blur-md h-fit bg-black/20 w-fit px-2.5 py-1 text-[#BFBFBF] text-sm">Фантастика</div>
                            <div className="flex items-center gap-x-2 md:mt-2">
                                <div className="typeMovie rounded-md bg-[#2BB157] w-fit px-2.5 py-1 text-white text-sm uppercase">Фильм</div>
                                <div className="typeMovie rounded-md bg-[#4A90E2] w-fit px-2.5 py-1 text-white text-sm uppercase">4K</div>
                                <div className="text-white/60">12+</div>
                            </div>
                        </div>
                        <h1 className='md:text-[50px] text-4xl font-bold w-fit my-4 leading-[1.1]'>Трансформеры: Последний рыцарь</h1>
                        <div className="flex items-center">
                            <svg width="43" height="22" viewBox="0 0 43 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M43 1.89083C42.8833 0.922265 42.1751 0.150295 41.2733 0C37.3203 0 5.69694 0 1.74393 0C0.756052 0.164717 0 1.07484 0 2.17169C0 3.935 0 18.0384 0 19.801C0 21.0155 0.925061 22 2.06699 22C5.95494 22 37.0623 22 40.9502 22C42.0017 22 42.8699 21.1643 43 20.0826C43 16.4444 43 3.70955 43 1.89083Z" fill="#F6C700"></path>
                                <path fillRule="evenodd" clipRule="evenodd" d="M34.2105 15.7931C34.4184 15.7931 34.6936 15.7074 34.7565 15.5381C34.7983 15.425 34.8297 15.0174 34.8514 14.3152V10.8987C34.8514 10.3347 34.8155 9.96654 34.7445 9.79423C34.6727 9.62193 34.3938 9.53615 34.1859 9.53615C33.9825 9.53615 33.8508 9.61206 33.791 9.76159C33.7304 9.91265 33.7005 10.2914 33.7005 10.8987V14.4223C33.7005 15.0083 33.7342 15.3825 33.803 15.5464C33.8718 15.7112 34.0071 15.7931 34.2105 15.7931ZM33.4852 17.5504H30.4131V4.21738H33.7005V8.55468C33.9727 8.23511 34.2764 7.99676 34.6106 7.83964C34.9457 7.68251 35.4482 7.60281 35.8408 7.60281C36.2925 7.60281 36.6844 7.67416 37.0164 7.81687C37.3484 7.95957 37.6019 8.1592 37.7762 8.41653C37.9504 8.67385 38.0551 8.9251 38.0903 9.1718C38.1254 9.4185 38.1434 9.94377 38.1434 10.7484V14.4891C38.1434 15.2891 38.0903 15.8842 37.9841 16.2759C37.8779 16.6668 37.6281 17.0069 37.2363 17.2938C36.8436 17.5815 36.3785 17.725 35.8393 17.725C35.4519 17.725 34.9516 17.6399 34.6174 17.4691C34.2816 17.2991 33.9757 17.0426 33.6975 16.701C33.6953 16.7098 33.6918 16.724 33.6869 16.7436C33.6602 16.8508 33.5933 17.1197 33.4852 17.5504ZM14.911 9.62588L15.0461 10.5624L15.8366 4.3335H20.2944V17.6665H17.315L17.3038 8.667L16.111 17.6665H13.982L12.7241 8.86284L12.7137 17.6665H9.72461V4.3335H14.1487C14.2789 5.14114 14.415 6.0877 14.5578 7.17544C14.5846 7.36349 14.7025 8.1806 14.911 9.62588ZM8.59885 4.42081H5.18652V17.7538H8.59885V4.42081ZM25.9279 7.10712C25.9653 7.27715 25.9847 7.66276 25.9847 8.26546V13.4347C25.9847 14.322 25.9279 14.8655 25.815 15.0659C25.7013 15.2663 25.3992 15.3658 24.9093 15.3658V6.61373C25.281 6.61373 25.5345 6.65396 25.6691 6.7329C25.8037 6.8126 25.8905 6.93709 25.9279 7.10712ZM27.4691 17.5306C27.8752 17.4403 28.2162 17.2809 28.4929 17.0539C28.7689 16.8262 28.9626 16.5112 29.0732 16.1081C29.1847 15.7058 29.2505 14.9065 29.2505 13.711V9.02908C29.2505 7.76751 29.2019 6.92191 29.1263 6.49228C29.0501 6.06189 28.8609 5.67097 28.558 5.32028C28.2544 4.96959 27.8117 4.71758 27.2298 4.56425C26.6473 4.41092 25.6975 4.3335 24.0456 4.3335H21.5V17.6665H25.634C26.5867 17.6361 27.1984 17.5913 27.4691 17.5306Z" fill="black"></path>
                            </svg>
                            <span className='pl-2'>8.4</span>
                            <span className='flex items-center relative before:w-1 before:h-1 before:bg-white/30 before:rounded-full before:absolute before:-left-1/2 ml-8 text-white/60'>2017</span>
                        </div>
                        <p className='text-lg text-[#BFBFBF] my-8 xl:w-4/5 leading-[1.2]'>
                            Оптимус Прайм исчез. Люди ведут войну с Трансформерами. Ключ к нашему будущему погребен в тайнах прошлого, в скрытой истории Трансформеров на Земле… Миссия по спасению мира ложится на плечи разношерстной компании, состоящей из Кейда Йегера, Бамблби, английского лорда и профессора из Оксфорда.
                        </p>
                        <ul className='flex md:flex-row flex-col gap-x-8 gap-y-2 md:items-center'>
                            <li><Link href="/actors/1" className='text-white hover:text-[#ff1414] transition-all duration-300'>Марк Уолберг</Link></li>
                            <li><Link href="/actors/2" className='text-white hover:text-[#ff1414] transition-all duration-300'>Энтони Хопкинс</Link></li>
                        </ul>
                        <button className='mt-8 flex gap-2 justify-center items-center group py-3 px-8 rounded-lg hover:scale-110 bg-[#ff1414] relative overflow-hidden transition-all duration-700'>
                            <div className='group-hover:w-[200%] group-hover:h-[500%] group-hover:opacity-100 group-hover:-top-[70px] group-hover:-left-1/2 group-hover:translate-1/2 w-0 h-0 opacity-0 rounded-full bg-white absolute transition-all duration-500 ease-out top-5 left-1/2'></div>
                            <span className='group-hover:text-black relative transition-all duration-700 ease-out leading-0'>Трейлер</span>
                            <svg width="24" height="24" className='fill-white group-hover:fill-black z-10' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 19L19 12L8 5V19Z"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </section>

            <section className=''>
                <Tab.Group>
                    <Tab.List className={'mt-10 xl:w-2/5 md:w-4/5 px-5 md:px-0 mx-auto'}>
                        <Tab as={Fragment}>
                            {({ selected }) => (
                                <button
                                className={`${selected ? 'border-white text-white' : 'border-[#323234] text-[#cbcbd2]'} py-2.5 px-5 border-b-[2px] xs:w-fit w-full`}
                                >
                                Подробная информация
                                </button>
                            )}
                        </Tab>
                        <Tab as={Fragment}>
                            {({ selected }) => (
                                <button
                                className={`${selected ? 'border-white text-white' : 'border-[#323234] text-[#cbcbd2]'} py-2.5 px-5 border-b-[2px] xs:w-fit w-full`}
                                >
                                Отзывы
                                </button>
                            )}
                        </Tab>
                    </Tab.List>
                    <Tab.Panels className={'mt-10'}>
                        <Tab.Panel>
                            <div className="xl:w-2/5 md:w-4/5 px-5 md:px-0 mx-auto pb-10">
                                <p className='text-[#8C8C8C]'>
                                    Оптимус Прайм исчез. Люди ведут войну с Трансформерами. Ключ к нашему будущему погребен в тайнах прошлого, в скрытой истории Трансформеров на Земле… 
                                    Миссия по спасению мира ложится на плечи разношерстной компании, состоящей из Кейда Йегера, Бамблби, английского лорда и профессора из Оксфорда. 
                                    Пришла пора действовать! Жертвы станут героями. Герои станут злодеями. Выстоит только один мир: их или наш.
                                </p>
                                <Image src="/img/poster/transformers.webp" alt="Trailer" width={800} height={450} className='rounded-xl mt-10 w-full object-cover' />
                                <ul className='flex flex-col divide-y-[1px] divide-[#dee2e6]/20 mt-12'>
                                    <li className='flex xs:flex-row flex-col gap-y-1 py-2.5'>
                                        <span className='text-[#8C8C8C] xs:w-1/2'>Год производства</span>
                                        <span className='xs:w-1/2 xs:text-base text-sm'>2017</span>
                                    </li>
                                    <li className='flex xs:flex-row flex-col gap-y-1 py-2.5'>
                                        <span className='text-[#8C8C8C] xs:w-1/2'>Страна</span>
                                        <span className='xs:w-1/2 xs:text-base text-sm'>USA</span>
                                    </li>
                                    <li className='flex xs:flex-row flex-col gap-y-1 py-2.5'>
                                        <span className='text-[#8C8C8C] xs:w-1/2'>Жанр</span>
                                        <span className='xs:w-1/2 xs:text-base text-sm'>Фильм</span>
                                    </li>
                                    <li className='flex xs:flex-row flex-col gap-y-1 py-2.5'>
                                        <span className='text-[#8C8C8C] xs:w-1/2'>Длительность</span>
                                        <span className='xs:w-1/2 xs:text-base text-sm'>2 часа 23 мин.</span>
                                    </li>
                                </ul>
                            </div>
                        </Tab.Panel>
                        <Tab.Panel>
                            <div className="flex flex-col gap-y-10 xl:w-2/5 md:w-4/5 px-5 md:px-0 mx-auto pb-20">
                                <div className="flex flex-col gap-y-5">
                                    <div className="flex items-center gap-4">
                                        <div className='w-[70px] h-[70px] rounded-xl bg-gray-500'></div>
                                        <div className="flex flex-col ">
                                            <p className='font-medium'>Name Surname</p>
                                            <span className='text-sm text-[#8C8C8C]'>January 6, 2021 at 1:24 pm</span>
                                        </div>
                                    </div>
                                    <p className='text-[#BFBFBF]'>
                                        Отличный фильм! Спецэффекты на высшем уровне.
                                    </p>
                                </div>
                            </div>
                            <div className='bg-[#161618] lg:py-[120px] md:py-14 py-8'>
                                <div className="xl:w-2/5 md:w-4/5 px-5 md:px-0 mx-auto">
                                    <form method='POST' className=" flex flex-col" onSubmit={(e) => e.preventDefault()}>
                                        <h2 className='text-[28px] font-bold mb-14'>Добавить отзыв</h2>
                                        <div className="w-full relative">
                                            <FaMessage className='absolute top-4 left-6 h-4 w-4 fill-white/50 group-focus:fill-white' />
                                            <textarea name="review" className='w-full min-h-[160px] rounded-xl border-[1px] border-[#323233] pl-14 py-2.5 pr-6 bg-[#1E1E20] outline-none focus:border-white/70' placeholder='Ваш отзыв'></textarea>
                                        </div>
                                        <div className="flex min-[600px]:flex-row flex-col gap-x-7 gap-y-4 min-[600px]:mt-7 mt-4">
                                            <div className="grow group relative">
                                                <FaUserAlt className='absolute top-1/2 -translate-y-1/2 left-6 h-4 w-4 fill-white/50 group-focus:fill-white' />
                                                <input type="text" name="name" className='py-2.5 pr-6 pl-14 w-full rounded-xl bg-[#1E1E20] border-[1px] border-[#323233] outline-none focus:border-white/70' placeholder='Ваше имя' autoComplete='off' />
                                            </div>
                                            <div className="grow group relative">
                                                <MdEmail className='absolute top-1/2 -translate-y-1/2 left-6 h-4 w-4 fill-white/50 group-focus:fill-white' />
                                                <input type="text" name="email" className='py-2.5 pr-6 pl-14 w-full rounded-xl bg-[#1E1E20] border-[1px] border-[#323233] outline-none focus:border-white/70' placeholder='Ваша почта' autoComplete='off' />
                                            </div>
                                        </div>
                                        <button type='submit' className="group hover:scale-105 transition-all duration-500 overflow-hidden flex justify-center items-center relative bg-[#ff1414] py-2.5 px-8 min-[600px]:w-fit w-full rounded-lg cursor-pointer mt-10">
                                            <span className='group-hover:text-black transition-all duration-500'>Отправить</span>
                                            <div className="-z-10 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-0 h-0 group-hover:w-[150%] rounded-full group-hover:h-[500%] bg-white transition-all duration-500"></div>
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </Tab.Panel>
                    </Tab.Panels>
                </Tab.Group>
            </section>
        </main>
    );
}
 
