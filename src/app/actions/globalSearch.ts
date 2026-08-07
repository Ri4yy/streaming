"use server";

import { tmdbApi } from "@/services/tmdb";
import { steamApi } from "@/services/steam";
import { googleBooksApi } from "@/services/googleBooks";

export interface GlobalSearchResult {
    id: string;
    title: string;
    year: string;
    genre: string;
    rate: number;
    img: string;
    fallbackImg?: string;
    type: 'movie' | 'tv' | 'anime' | 'game' | 'book';
    href: string;
}

export interface GroupedGlobalSearchResults {
    movies: GlobalSearchResult[];
    series: GlobalSearchResult[];
    anime: GlobalSearchResult[];
    games: GlobalSearchResult[];
    books: GlobalSearchResult[];
}

export async function fetchGlobalSearch(query: string, category: string): Promise<GroupedGlobalSearchResults | GlobalSearchResult[]> {
    if (!query || query.length < 2) {
        return category === 'search' ? { movies: [], series: [], anime: [], games: [], books: [] } : [];
    }

    const LIMIT = category === 'search' ? 3 : 10;

    const fetchMovies = async () => {
        try {
            const response = await tmdbApi.search(query, 'movie');
            const res = response.results || [];
            return res.slice(0, LIMIT).map(item => ({
                id: item.id.toString(),
                title: item.title || item.name || '',
                year: item.release_date ? item.release_date.split('-')[0] : '',
                genre: "Фильм",
                rate: item.vote_average || 0,
                img: tmdbApi.getImageUrl(item.poster_path, 'w500'),
                type: 'movie' as const,
                href: `/movies/${item.id}`
            }));
        } catch (e) { return []; }
    };

    const fetchSeries = async (isAnime = false) => {
        try {
            const response = await tmdbApi.search(query, 'tv');
            let res = response.results || [];
            if (isAnime) {
                res = res.filter(item => item.genre_ids?.includes(16) || item.original_language === 'ja');
            } else {
                res = res.filter(item => !item.genre_ids?.includes(16) && item.original_language !== 'ja');
            }
            return res.slice(0, LIMIT).map(item => ({
                id: item.id.toString(),
                title: item.name || item.title || '',
                year: item.first_air_date ? item.first_air_date.split('-')[0] : '',
                genre: isAnime ? "Аниме" : "Сериал",
                rate: item.vote_average || 0,
                img: tmdbApi.getImageUrl(item.poster_path, 'w500'),
                type: (isAnime ? 'anime' : 'tv') as 'anime' | 'tv',
                href: `/${isAnime ? 'anime' : 'series'}/${item.id}`
            }));
        } catch (e) { return []; }
    };

    const fetchGames = async () => {
        try {
            const url = `https://store.steampowered.com/search/results?term=${encodeURIComponent(query)}&ndl=1`;
            const res = await fetch(url);
            const text = await res.text();
            const ids: string[] = [];
            const regex = /data-ds-appid="(\d+)"/g;
            let match;
            while ((match = regex.exec(text)) !== null && ids.length < LIMIT) {
                if (!ids.includes(match[1])) ids.push(match[1]);
            }
            
            const results = await Promise.all(ids.map(id => steamApi.getGameDetails(id)));
            return results.filter(g => g !== null).map(game => ({
                id: game!.steam_appid.toString(),
                title: game!.name,
                year: game!.release_date?.date?.match(/\b(19\d{2}|20\d{2})\b/)?.[1] || '',
                genre: "Игра",
                rate: game!.metacritic?.score ? game!.metacritic.score / 10 : 0,
                img: steamApi.getVerticalImage(game!.steam_appid),
                fallbackImg: game!.header_image,
                type: 'game' as const,
                href: `/games/${game!.steam_appid}`
            }));
        } catch (e) { return []; }
    };

    const fetchBooks = async () => {
        try {
            const res = await googleBooksApi.searchBooks(query);
            return res.slice(0, LIMIT).map(book => ({
                id: book.id,
                title: book.volumeInfo.title,
                year: book.volumeInfo.publishedDate?.split('-')[0] || '',
                genre: "Книга",
                rate: book.volumeInfo.averageRating || 0,
                img: googleBooksApi.getThumbnail(book),
                type: 'book' as const,
                href: `/books/${book.id}`
            }));
        } catch (e) { return []; }
    };

    if (category === 'search') {
        const [movies, series, anime, games, books] = await Promise.all([
            fetchMovies(),
            fetchSeries(false),
            fetchSeries(true),
            fetchGames(),
            fetchBooks()
        ]);
        return { movies, series, anime, games, books };
    } else if (category === 'movies') {
        return await fetchMovies();
    } else if (category === 'series') {
        return await fetchSeries(false);
    } else if (category === 'anime') {
        return await fetchSeries(true);
    } else if (category === 'games') {
        return await fetchGames();
    } else if (category === 'books') {
        return await fetchBooks();
    }

    return [];
}
