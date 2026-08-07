import React from 'react';
import { Metadata } from 'next';
import MediaCard from '@/components/MediaCard';
import CatalogFilters from '@/components/CatalogFilters';
import { googleBooksApi } from '@/services/googleBooks';

import LoadMoreGrid from '@/components/LoadMoreGrid';


export const metadata: Metadata = {
    title: "Книги",
    description: "Каталог интересных книг и бестселлеров.",
};

export default async function BooksPage({ searchParams }: { searchParams: Promise<{ q?: string, sort?: string, genres?: string, page?: string }> }) {
    const { q, sort, genres: selectedGenresQuery, page: pageParam } = await searchParams;
    const page = parseInt(pageParam || '1');

    let allBooks = [];

    const excludedSubjects = '-subject:medical -subject:science -subject:study -subject:education';

    if (q) {
        allBooks = await googleBooksApi.searchBooks(`${q} ${excludedSubjects}`);
    } else {
        allBooks = await googleBooksApi.getPopularBooks(`популярные книги ${excludedSubjects}`, 60);
    }

    const heroBook = allBooks.length > 0 ? allBooks[0] : null;
    let booksList = allBooks.length > 0 ? (q ? allBooks : allBooks.slice(1)) : [];

    const allGenres = q ? [] : Array.from(new Set(allBooks.flatMap(b => b.volumeInfo?.categories || [])));
    const arrGenre = allGenres.map((name, index) => ({ id: index + 1, name: name as string }));

    // Local filter by query is removed since we use API search now

    // Filter by genres
    if (selectedGenresQuery) {
        const selectedGenres = selectedGenresQuery.split(',');
        booksList = booksList.filter(book => {
            const bookGenres = book.volumeInfo.categories || [];
            return selectedGenres.some(g => bookGenres.includes(g));
        });
    }

    // Sort
    if (sort) {
        booksList.sort((a, b) => {
            const getRating = (book: any) => book.volumeInfo.averageRating || 0;
            if (sort === 'rating') return getRating(b) - getRating(a);
            if (sort === 'rating_asc') return getRating(a) - getRating(b);

            const getYear = (book: any) => parseInt(book.volumeInfo.publishedDate?.substring(0, 4) || '0', 10);

            if (sort === 'date') return getYear(b) - getYear(a);
            if (sort === 'date_asc') return getYear(a) - getYear(b);

            return 0;
        });
    } else {
        // Отсортировать книги по умолчанию: самые новые первыми, а при равном годе - самые популярные
        booksList.sort((a, b) => {
            const yearA = parseInt(a.volumeInfo.publishedDate?.substring(0, 4) || '0', 10);
            const yearB = parseInt(b.volumeInfo.publishedDate?.substring(0, 4) || '0', 10);

            if (yearB !== yearA) return yearB - yearA;

            const countA = a.volumeInfo.ratingsCount || 0;
            const countB = b.volumeInfo.ratingsCount || 0;

            if (countB !== countA) return countB - countA;

            const ratingA = a.volumeInfo.averageRating || 0;
            const ratingB = b.volumeInfo.averageRating || 0;
            return ratingB - ratingA;
        });
    }

    const ITEMS_PER_PAGE = 20;
    const totalPages = Math.ceil(booksList.length / ITEMS_PER_PAGE);
    const paginatedBooks = booksList.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    return (
        <main>
            <section className='lg:px-[80px] md:px-10 px-5 pt-[120px]'>
                <div className="bg-[#1E1E20] rounded-2xl h-[700px] w-full relative overflow-hidden flex items-center justify-center">
                    {heroBook && (
                        <div
                            className="absolute inset-0 bg-cover bg-center opacity-40 z-0"
                            style={{ backgroundImage: `url(${googleBooksApi.getHeroImage(heroBook)})` }}
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-0"></div>

                    {heroBook && (
                        <div className="absolute md:bottom-5 md:left-5 md:right-5 bottom-0 p-6 bg-white/5 backdrop-blur-2xl border border-white/10 shadow-xl rounded-2xl lg:max-w-[700px] z-10">
                            <p className='text-[#CAE962] text-xl font-bold mb-1'>{heroBook.volumeInfo?.categories?.[0] || 'Книга'}</p>
                            <p className='md:text-4xl text-2xl font-bold mb-3 leading-[1.1]'>{heroBook.volumeInfo?.title}</p>

                            <div className="flex flex-wrap items-center gap-4 mb-4 text-sm font-medium">
                                {heroBook.volumeInfo?.authors && (
                                    <span className="bg-white/10 px-2 py-1 rounded">Автор: {heroBook.volumeInfo.authors.join(', ')}</span>
                                )}
                                {heroBook.volumeInfo?.publishedDate && (
                                    <span className="bg-white/10 px-2 py-1 rounded">Год: {heroBook.volumeInfo.publishedDate.substring(0, 4)}</span>
                                )}
                                {heroBook.volumeInfo?.averageRating && (
                                    <span className="bg-[#F6C700] text-black px-2 py-1 rounded font-bold">Оценка: {heroBook.volumeInfo.averageRating}</span>
                                )}
                            </div>

                            <div className='p-4 rounded-xl bg-black/40 backdrop-blur-md border border-white/10'>
                                <p className='md:text-base text-sm text-[#F8F7F9]/100 line-clamp-3 leading-[1.3]'>
                                    {heroBook.volumeInfo?.description || "Описание отсутствует."}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <section className='container lg:py-[120px] md:py-14 py-8'>
                <CatalogFilters genres={arrGenre} hideYear={true} hideRating={true} />

                <LoadMoreGrid
                    initialItems={paginatedBooks.map((book: any) => ({
                        id: book.id,
                        name: book.volumeInfo?.title || "Без названия",
                        year: book.volumeInfo?.publishedDate ? book.volumeInfo.publishedDate.substring(0, 4) : "",
                        genre: book.volumeInfo?.categories?.[0] || "Книга",
                        rate: book.volumeInfo?.averageRating || 0,
                        img: googleBooksApi.getThumbnail(book),
                        type: 'book',
                        href: `/books/${book.id}`
                    }))}
                    catalogType="book"
                    totalPages={totalPages}
                />
            </section>
        </main>
    );
}
