'use server';

import { tmdbApi } from '@/services/tmdb';
import { steamApi } from '@/services/steam';
import { googleBooksApi } from '@/services/googleBooks';

export interface CatalogItem {
    id: number | string;
    name: string;
    year: string;
    genre: string;
    rate: number;
    img: string;
    fallbackImg?: string;
    type: 'movie' | 'tv' | 'anime' | 'game' | 'book';
    href: string;
}

export async function fetchMoreItems(
    catalogType: 'movie' | 'tv' | 'anime' | 'game' | 'book',
    page: number,
    queryParams: { q?: string; sort?: string; genres?: string; yearMin?: string; yearMax?: string; ratingMin?: string; ratingMax?: string; }
): Promise<{ items: CatalogItem[], totalPages: number }> {
    const { q, sort, genres, yearMin, yearMax, ratingMin, ratingMax } = queryParams;

    // --- GAMES ---
    if (catalogType === 'game') {
        if (q) {
            // Wait, for games search, the API currently fetches everything or max 20, ignoring page
            const searchRes = await steamApi.searchGamesWithDetails(q, 20);
            
            searchRes.sort((a: any, b: any) => {
                const getYear = (game: any) => {
                    const dateStr = game.release_date?.date || '';
                    const match = dateStr.match(/\b(19\d{2}|20\d{2})\b/);
                    if (match) return parseInt(match[1], 10);
                    return game.release_date?.coming_soon ? 9999 : 0;
                };
                return getYear(b) - getYear(a);
            });
            
            // Search games is unpaginated on our end currently, so return nothing if page > 1
            if (page > 1) return { items: [], totalPages: 1 };
            
            return {
                items: searchRes.map((game: any) => {
                    const match = game.release_date?.date?.match(/\b(19\d{2}|20\d{2})\b/);
                    return {
                        id: game.steam_appid,
                        name: game.name,
                        year: match ? match[1] : '',
                        genre: game.genres?.[0]?.description || "Игра",
                        rate: game.rate || (game.metacritic?.score ? game.metacritic.score / 10 : 0),
                        img: steamApi.getVerticalImage(game.steam_appid),
                        fallbackImg: game.header_image,
                        type: 'game',
                        href: `/games/${game.steam_appid}`
                    };
                }),
                totalPages: 1
            };
        } else {
            const gamesRes = await steamApi.getGamesWithDetails(page, 20);
            let gamesList = gamesRes.results;
            
            // Filter by genres
            if (genres) {
                const selectedGenres = genres.split(',');
                gamesList = gamesList.filter((game: any) => {
                    const gameGenres = game.genres?.map((g: any) => g.description) || [];
                    return selectedGenres.some((g: string) => gameGenres.includes(g));
                });
            }

            // Sort
            if (sort) {
                gamesList.sort((a: any, b: any) => {
                    const getScore = (game: any) => game.metacritic?.score || 0;
                    if (sort === 'rating') return getScore(b) - getScore(a);
                    if (sort === 'rating_asc') return getScore(a) - getScore(b);
                    
                    const getYear = (game: any) => {
                        const dateStr = game.release_date?.date || '';
                        const match = dateStr.match(/\b(19\d{2}|20\d{2})\b/);
                        if (match) return parseInt(match[1], 10);
                        return game.release_date?.coming_soon ? 9999 : 0;
                    };
                    
                    if (sort === 'date') return getYear(b) - getYear(a);
                    if (sort === 'date_asc') return getYear(a) - getYear(b);
                    
                    return 0;
                });
            }

            // Filter by year and rating (local for games)
            if (yearMin || yearMax || ratingMin || ratingMax) {
                gamesList = gamesList.filter((game: any) => {
                    const yearMatch = game.release_date?.date?.match(/\b(19\d{2}|20\d{2})\b/);
                    const year = yearMatch ? yearMatch[1] : '';
                    const score = game.metacritic?.score ? game.metacritic.score / 10 : 0;
                    
                    let pass = true;
                    if (yearMin && year && parseInt(year, 10) < parseInt(yearMin, 10)) pass = false;
                    if (yearMax && year && parseInt(year, 10) > parseInt(yearMax, 10)) pass = false;
                    if (ratingMin && score < parseFloat(ratingMin)) pass = false;
                    if (ratingMax && score > parseFloat(ratingMax)) pass = false;
                    return pass;
                });
            }

            return {
                items: gamesList.map((game: any) => {
                    const match = game.release_date?.date?.match(/\b(19\d{2}|20\d{2})\b/);
                    return {
                        id: game.steam_appid,
                        name: game.name,
                        year: match ? match[1] : '',
                        genre: game.genres?.[0]?.description || "Игра",
                        rate: game.rate || (game.metacritic?.score ? game.metacritic.score / 10 : 0),
                        img: steamApi.getVerticalImage(game.steam_appid),
                        fallbackImg: game.header_image,
                        type: 'game',
                        href: `/games/${game.steam_appid}`
                    };
                }),
                totalPages: gamesRes.total_pages
            };
        }
    }
    
    // --- BOOKS ---
    if (catalogType === 'book') {
        let allBooks = [];
        const excludedSubjects = '-subject:medical -subject:science -subject:study -subject:education';
        
        // Use pagination for Google Books
        const ITEMS_PER_PAGE = 20;
        const startIndex = (page - 1) * ITEMS_PER_PAGE;
        
        if (q) {
            allBooks = await googleBooksApi.searchBooks(`${q} ${excludedSubjects}`, startIndex);
        } else {
            // For books, we might have a massive list, let's fetch a chunk or just rely on searchBooks generic
            // Since our old logic just fetched top 60, we can adapt:
            allBooks = await googleBooksApi.searchBooks(`популярные книги ${excludedSubjects}`, startIndex);
        }

        let booksList = allBooks;

        if (genres) {
            const selectedGenres = genres.split(',');
            booksList = booksList.filter(book => {
                const bookGenres = book.volumeInfo?.categories || [];
                return selectedGenres.some(g => bookGenres.includes(g));
            });
        }

        if (sort) {
            booksList.sort((a, b) => {
                const getRating = (book: any) => book.volumeInfo?.averageRating || 0;
                if (sort === 'rating') return getRating(b) - getRating(a);
                if (sort === 'rating_asc') return getRating(a) - getRating(b);
                
                const getYear = (book: any) => parseInt(book.volumeInfo?.publishedDate?.substring(0, 4) || '0', 10);
                
                if (sort === 'date') return getYear(b) - getYear(a);
                if (sort === 'date_asc') return getYear(a) - getYear(b);
                
                return 0;
            });
        }

        return {
            items: booksList.map((book: any) => ({
                id: book.id,
                name: book.volumeInfo?.title || "Без названия",
                year: book.volumeInfo?.publishedDate ? book.volumeInfo.publishedDate.substring(0, 4) : "N/A",
                genre: book.volumeInfo?.categories?.[0] || "Книга",
                rate: book.volumeInfo?.averageRating ? book.volumeInfo.averageRating : 0,
                img: googleBooksApi.getThumbnail(book),
                type: 'book',
                href: `/books/${book.id}`
            })),
            totalPages: 50 // arbitrary max pages for infinite scroll
        };
    }

    // --- TMDB (movie, tv, anime) ---
    
    // Arrays for mapping genres from names back to IDs if needed
    const TMDB_GENRES = {
        movie: [
            {id: 28, name: 'Боевики'}, {id: 37, name: 'Вестерны'}, {id: 10752, name: 'Военное'},
            {id: 9648, name: 'Детективы'}, {id: 99, name: 'Документальное'}, {id: 35, name: 'Комедия'},
            {id: 18, name: 'Драма'}, {id: 80, name: 'Криминал'}, {id: 27, name: 'Ужасы'},
            {id: 53, name: 'Триллеры'}, {id: 14, name: 'Фэнтези'}, {id: 878, name: 'Фантастика'}
        ],
        tv: [
            {id: 10759, name: 'Боевик'}, {id: 16, name: 'Мультфильм'}, {id: 35, name: 'Комедия'},
            {id: 80, name: 'Криминал'}, {id: 99, name: 'Документальное'}, {id: 18, name: 'Драма'},
            {id: 10751, name: 'Семейное'}, {id: 10762, name: 'Детское'}, {id: 9648, name: 'Детектив'},
            {id: 10763, name: 'Новости'}, {id: 10764, name: 'Реалити'}, {id: 10765, name: 'Фантастика'},
            {id: 10766, name: 'Мыльная опера'}, {id: 10767, name: 'Ток-шоу'}, {id: 10768, name: 'Военное'},
            {id: 37, name: 'Вестерн'}
        ],
        anime: [
            {id: 10759, name: 'Боевик'}, {id: 16, name: 'Мультфильм'}, {id: 35, name: 'Комедия'},
            {id: 18, name: 'Драма'}, {id: 10765, name: 'Фантастика'}, {id: 9648, name: 'Детектив'}
        ]
    };

    let rawResults = [];
    let totalPages = 1;

    const arrGenre = TMDB_GENRES[catalogType];

    if (q) {
        const searchRes = await tmdbApi.searchPaginated(q, catalogType === 'anime' ? 'tv' : catalogType, page);
        let results = searchRes.results;
        
        if (catalogType === 'anime') {
            results = results.filter((item: any) => {
                const isAnim = item.origin_country?.includes('JP') || item.original_language === 'ja';
                const hasAnimGenre = item.genre_ids?.includes(16);
                return isAnim && hasAnimGenre;
            });
        }
        
        rawResults = results;
        totalPages = searchRes.total_pages;
    } else {
        const options: Record<string, string> = {};
        
        if (genres) {
            const selectedGenreNames = genres.split(',');
            const selectedGenreIds = arrGenre
                .filter(g => selectedGenreNames.includes(g.name))
                .map(g => g.id);
            if (selectedGenreIds.length > 0) {
                options.with_genres = selectedGenreIds.join(',');
            }
        }
        
        if (sort) {
            if (sort === 'rating') options.sort_by = 'vote_average.desc';
            if (sort === 'rating_asc') options.sort_by = 'vote_average.asc';
            if (sort === 'date') options.sort_by = (catalogType === 'movie' ? 'primary_release_date.desc' : 'first_air_date.desc');
            if (sort === 'date_asc') options.sort_by = (catalogType === 'movie' ? 'primary_release_date.asc' : 'first_air_date.asc');
            if (sort.includes('rating')) options['vote_count.gte'] = '100';
        } else {
            options.sort_by = 'popularity.desc';
        }

        if (yearMin) options[catalogType === 'movie' ? 'primary_release_date.gte' : 'first_air_date.gte'] = `${yearMin}-01-01`;
        if (yearMax) options[catalogType === 'movie' ? 'primary_release_date.lte' : 'first_air_date.lte'] = `${yearMax}-12-31`;
        if (ratingMin) options['vote_average.gte'] = ratingMin;
        if (ratingMax) options['vote_average.lte'] = ratingMax;
        if (ratingMin || ratingMax) options['vote_count.gte'] = '10';

        if (catalogType === 'anime') {
            options.with_genres = options.with_genres ? `${options.with_genres},16` : '16';
            options.with_original_language = 'ja';
        }
        
        const discoverRes = await tmdbApi.getDiscoverPaginated(catalogType === 'anime' ? 'tv' : catalogType, options, page);
        rawResults = discoverRes.results;
        totalPages = discoverRes.total_pages;
    }

    const typeLabel = catalogType === 'movie' ? 'Фильм' : (catalogType === 'tv' ? 'Сериал' : 'Аниме');
    const hrefPrefix = catalogType === 'movie' ? '/movies' : (catalogType === 'tv' ? '/series' : '/anime');

    const mappedItems: CatalogItem[] = rawResults.map((item: any) => ({
        id: item.id,
        name: item.title || item.name || '',
        year: item.release_date ? item.release_date.split('-')[0] : (item.first_air_date ? item.first_air_date.split('-')[0] : 'N/A'),
        genre: typeLabel,
        rate: item.vote_average || 0,
        img: tmdbApi.getImageUrl(item.poster_path),
        type: catalogType,
        href: `${hrefPrefix}/${item.id}`
    }));

    return {
        items: mappedItems,
        totalPages
    };
}
