import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import DetailActions from '@/components/DetailActions';
import { googleBooksApi } from '@/services/googleBooks';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const book = await googleBooksApi.getBookDetails(id);
    if (!book) return { title: 'Не найдено' };
    
    const { volumeInfo } = book;
    const rawDesc = volumeInfo.description || '';
    const cleanDesc = rawDesc.replace(/<[^>]*>?/gm, '').substring(0, 160);
    
    return {
        title: volumeInfo.title || 'Книга',
        description: cleanDesc || "Подробная информация о книге.",
    };
}

export default async function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const book = await googleBooksApi.getBookDetails(id);

    if (!book) {
        return notFound();
    }

    const { volumeInfo } = book;

    return (
        <main>
            <section className='pb-20 pt-[120px] md:pt-[150px] bg-no-repeat bg-cover bg-center w-full min-h-screen relative overflow-hidden'>
                <div 
                    className="absolute top-0 inset-x-0 h-full bg-cover bg-center z-0 opacity-40 blur-md"
                    style={{ backgroundImage: `url(${googleBooksApi.getHeroImage(book)})` }}
                />
                <div className="absolute inset-0 bg-black/50 z-10"></div>
                <div className="container flex max-[1100px]:flex-col gap-x-20 items-start z-20 relative">
                    <div className="max-[1100px]:mt-[40px] w-[30%] h-full max-[1100px]:w-full relative sticky top-[120px]">
                        <Image 
                            src={googleBooksApi.getHeroImage(book)} 
                            alt={volumeInfo.title} 
                            width={600} 
                            height={900} 
                            className='rounded-xl w-full h-[600px] object-cover border border-white/10' 
                        />
                        <DetailActions 
                            id={book.id} 
                            type="book" 
                            title={volumeInfo.title} 
                            coverUrl={googleBooksApi.getHeroImage(book)}
                        />
                    </div>
                    <div className="max-[1100px]:mt-10 w-[70%] max-[1100px]:w-full pr-4 pb-10">
                        <div className="flex md:flex-col flex-row items-center md:items-start gap-x-2">
                            <div className="rounded-lg backdrop-blur-md h-fit bg-black/40 w-fit px-2.5 py-1 text-[#BFBFBF] text-sm mb-2">
                                {volumeInfo.authors?.join(', ') || 'Неизвестный автор'}
                            </div>
                            <div className="flex items-center gap-x-2">
                                <div className="typeMovie rounded-md bg-[#E2A74A] w-fit px-2.5 py-1 text-black font-bold text-sm uppercase">Книга</div>
                            </div>
                        </div>
                        <h1 className='md:text-[50px] text-4xl font-bold w-fit my-4 leading-[1.1]'>{volumeInfo.title}</h1>
                        <div className="flex items-center gap-4 flex-wrap mb-4">
                            {volumeInfo.averageRating && (
                                <div className="bg-[#F6C700] text-black px-3 py-1 rounded-md font-bold">
                                    Оценка: {volumeInfo.averageRating}
                                </div>
                            )}
                            <div className="bg-white/20 text-white px-3 py-1 rounded-md font-medium text-sm">
                                Жанры: {volumeInfo.categories?.join(', ') || 'Не указаны'}
                            </div>
                            {volumeInfo.publishedDate && (
                                <div className="bg-white/20 text-white px-3 py-1 rounded-md font-medium text-sm">
                                    Год: {volumeInfo.publishedDate.substring(0, 4)}
                                </div>
                            )}
                            {volumeInfo.pageCount && (
                                <div className="bg-white/20 text-white px-3 py-1 rounded-md font-medium text-sm">
                                    Страниц: {volumeInfo.pageCount}
                                </div>
                            )}
                        </div>
                        <div className='text-lg text-[#BFBFBF] my-6 xl:w-4/5 leading-[1.3] description-content'>
                            {volumeInfo.description ? (
                                <div dangerouslySetInnerHTML={{ __html: volumeInfo.description }} />
                            ) : (
                                "Описание отсутствует."
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
