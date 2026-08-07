import React from 'react';
import { Metadata } from 'next';
import MediaCard from '@/components/MediaCard';
import { tmdbApi } from '@/services/tmdb';
import { steamApi } from '@/services/steam';
import { googleBooksApi } from '@/services/googleBooks';


export const metadata: Metadata = {
  title: "Поиск",
  description: "Поиск фильмов, сериалов, аниме, книг и игр по каталогу CineBox.",
};

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q: string }> }) {
    const { q } = await searchParams;
    const query = q || '';

    let moviesList: any[] = [];
    let seriesList: any[] = [];
    let gamesList: any[] = [];
    let booksList: any[] = [];

    if (query) {
        try {
            const [tmdbRes, steamRes, booksRes] = await Promise.allSettled([
                tmdbApi.search(query),
                steamApi.searchGamesWithDetails(query, 12),
                googleBooksApi.searchBooks(query)
            ]);

            if (tmdbRes.status === 'fulfilled') {
                const results = tmdbRes.value.results || [];
                moviesList = results.filter(item => item.media_type === 'movie');
                seriesList = results.filter(item => item.media_type === 'tv');
            }

            if (steamRes.status === 'fulfilled') {
                gamesList = steamRes.value || [];
            }

            if (booksRes.status === 'fulfilled') {
                booksList = booksRes.value || [];
            }
        } catch (error) {
            console.error("Search error:", error);
        }
    }

    const hasResults = moviesList.length > 0 || seriesList.length > 0 || gamesList.length > 0 || booksList.length > 0;

    return (
        <main className='pt-40 container min-h-screen'>
            <h1 className="text-4xl font-bold mb-10">Результаты поиска: {query}</h1>

            {!hasResults && query && (
                <p className="text-xl text-gray-400">По вашему запросу ничего не найдено.</p>
            )}

            {!query && (
                <p className="text-xl text-gray-400">Введите поисковой запрос.</p>
            )}

            {moviesList.length > 0 && (
                <section className="mb-14">
                    <h2 className="text-2xl font-bold mb-6 border-b border-white/20 pb-2">Фильмы</h2>
                    <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 xs:grid-cols-2 gap-x-5 gap-y-9">
                        {moviesList.map(movie => (
                            <MediaCard 
                                key={movie.id}
                                id={movie.id}
                                name={movie.title || movie.name || ''} 
                                year={movie.release_date ? movie.release_date.split('-')[0] : 'N/A'} 
                                genre="Фильм" 
                                rate={movie.vote_average || 0} 
                                img={tmdbApi.getImageUrl(movie.poster_path)}
                                type="movie"
                                href={`/movies/${movie.id}`}
                            />
                        ))}
                    </div>
                </section>
            )}

            {seriesList.length > 0 && (
                <section className="mb-14">
                    <h2 className="text-2xl font-bold mb-6 border-b border-white/20 pb-2">Сериалы</h2>
                    <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 xs:grid-cols-2 gap-x-5 gap-y-9">
                        {seriesList.map(series => (
                            <MediaCard 
                                key={series.id}
                                id={series.id}
                                name={series.title || series.name || ''} 
                                year={series.first_air_date ? series.first_air_date.split('-')[0] : 'N/A'} 
                                genre="Сериал" 
                                rate={series.vote_average || 0} 
                                img={tmdbApi.getImageUrl(series.poster_path)} 
                                type="tv"
                                href={`/series/${series.id}`}
                            />
                        ))}
                    </div>
                </section>
            )}

            {gamesList.length > 0 && (
                <section className="mb-14">
                    <h2 className="text-2xl font-bold mb-6 border-b border-white/20 pb-2">Игры</h2>
                    <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 xs:grid-cols-2 gap-x-5 gap-y-9">
                        {gamesList.map(game => (
                            <MediaCard
                                key={game.steam_appid}
                                id={game.steam_appid}
                                name={game.name}
                                year={game.release_date?.date?.split(' ')[2] || game.release_date?.date?.split(',')[1]?.trim() || ''}
                                genre={game.genres?.[0]?.description || "Игра"}
                                rate={game.metacritic?.score ? game.metacritic.score / 10 : 0}
                                img={steamApi.getVerticalImage(game.steam_appid)}
                                type="game"
                                href={`/games/${game.steam_appid}`}
                            />
                        ))}
                    </div>
                </section>
            )}

            {booksList.length > 0 && (
                <section className="mb-14">
                    <h2 className="text-2xl font-bold mb-6 border-b border-white/20 pb-2">Книги</h2>
                    <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 xs:grid-cols-2 gap-x-5 gap-y-9">
                        {booksList.map(book => (
                            <MediaCard 
                                key={book.id}
                                id={book.id}
                                name={book.volumeInfo.title} 
                                year={book.volumeInfo.publishedDate ? book.volumeInfo.publishedDate.substring(0, 4) : ""} 
                                genre={book.volumeInfo.categories?.[0] || "Книга"} 
                                rate={book.volumeInfo.averageRating ? book.volumeInfo.averageRating.toString() : ""} 
                                img={googleBooksApi.getThumbnail(book)}
                                type="book"
                                href={`/books/${book.id}`}
                            />
                        ))}
                    </div>
                </section>
            )}
        </main>
    );
}
