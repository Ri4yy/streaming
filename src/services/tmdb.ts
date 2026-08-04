export const TMDB_API_BASE_URL = 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
export const TMDB_IMAGE_ORIGINAL_URL = 'https://image.tmdb.org/t/p/original';

const TMDB_API_KEY = process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_TMDB_API_KEY;

export interface TMDBMedia {
    id: number;
    title?: string;
    name?: string;
    original_title?: string;
    original_name?: string;
    original_language?: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    media_type?: 'movie' | 'tv' | 'person';
    genre_ids: number[];
    popularity: number;
    release_date?: string;
    first_air_date?: string;
    vote_average: number;
    vote_count: number;
    origin_country?: string[];
}

export interface TMDBResponse<T> {
    page: number;
    results: T[];
    total_pages: number;
    total_results: number;
}

const defaultParams = {
    language: 'ru-RU'
};

export interface TMDBVideo {
    key: string;
    site: string;
    type: string;
}

export interface TMDBPerson {
    id: number;
    name: string;
    profile_path: string | null;
    character?: string;
}

export interface TMDBDetail extends TMDBMedia {
    genres: { id: number; name: string }[];
    runtime?: number; // for movies
    episode_run_time?: number[]; // for tv
    origin_country?: string[];
    credits?: {
        cast: TMDBPerson[];
    };
    videos?: {
        results: TMDBVideo[];
    };
    images?: {
        backdrops: { file_path: string }[];
    };
    number_of_seasons?: number;
    number_of_episodes?: number;
    status?: string;
    next_episode_to_air?: { air_date: string; episode_number: number; name: string } | null;
}

const mockMedia: TMDBDetail = {
    id: 1,
    title: "Человек-паук: Паутина вселенных",
    name: "Человек-паук: Паутина вселенных",
    overview: "Майлз Моралес отправляется в приключение по мультивселенной вместе с Гвен Стейси и новой командой Людей-пауков.",
    poster_path: null,
    backdrop_path: null,
    genre_ids: [28, 12, 16],
    genres: [{id: 28, name: 'Экшен'}, {id: 16, name: 'Мультфильм'}],
    popularity: 100,
    release_date: "2023-05-31",
    vote_average: 8.4,
    vote_count: 1000,
    runtime: 140,
    credits: {
        cast: [
            { id: 1, name: "Шамеик Мур", character: "Майлз Моралес", profile_path: null },
            { id: 2, name: "Хейли Стайнфелд", character: "Гвен Стейси", profile_path: null }
        ]
    },
    videos: { results: [] }
};

async function fetchTMDB<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    const url = new URL(`${TMDB_API_BASE_URL}${endpoint}`);
    
    // Add default params
    Object.entries({ ...defaultParams, ...params }).forEach(([key, value]) => {
        url.searchParams.append(key, value);
    });

    try {
        const response = await fetch(url.toString(), {
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${TMDB_API_KEY}`
            },
            next: { revalidate: 3600 } // Cache for 1 hour
        });

        if (!response.ok) {
            throw new Error(`TMDB API Error: ${response.statusText}`);
        }

        return response.json();
    } catch (error) {
        console.error(`Fetch failed for ${endpoint}:`, error);
        
        // Return fallback mock data to prevent app crash
        // This object satisfies both list response and detail response
        const mockFallback: any = {
            ...mockMedia,
            page: 1,
            results: Array(20).fill(mockMedia).map((m, i) => ({ ...m, id: m.id + i })),
            total_pages: 1,
            total_results: 20
        };
        return mockFallback as T;
    }
}

export const tmdbApi = {
    getTrending: (type: 'movie' | 'tv' | 'all' = 'all', timeWindow: 'day' | 'week' = 'week', page = 1) => 
        fetchTMDB<TMDBResponse<TMDBMedia>>(`/trending/${type}/${timeWindow}`, { page: String(page) }),
    
    getPopular: (type: 'movie' | 'tv' = 'movie', page = 1) => 
        fetchTMDB<TMDBResponse<TMDBMedia>>(`/${type}/popular`, { page: String(page) }),
        
    getManyPopular: async (type: 'movie' | 'tv' = 'movie', pagesCount = 4): Promise<TMDBMedia[]> => {
        const promises = Array.from({ length: pagesCount }).map((_, i) => tmdbApi.getPopular(type, i + 1));
        const results = await Promise.all(promises);
        return results.flatMap(res => res.results);
    },

    getManyTrending: async (type: 'movie' | 'tv' | 'all' = 'all', timeWindow: 'day' | 'week' = 'week', pagesCount = 4): Promise<TMDBMedia[]> => {
        const promises = Array.from({ length: pagesCount }).map((_, i) => tmdbApi.getTrending(type, timeWindow, i + 1));
        const results = await Promise.all(promises);
        return results.flatMap(res => res.results);
    },

    getTopRated: (type: 'movie' | 'tv' = 'movie', page = 1) => 
        fetchTMDB<TMDBResponse<TMDBMedia>>(`/${type}/top_rated`, { page: String(page) }),
        
    getUpcoming: (page = 1) => 
        fetchTMDB<TMDBResponse<TMDBMedia>>(`/movie/upcoming`, { page: String(page) }),
        
    getDiscoverAnime: (page = 1) => {
        const today = new Date();
        const lastMonth = new Date();
        lastMonth.setMonth(today.getMonth() - 1);
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);

        return fetchTMDB<TMDBResponse<TMDBMedia>>('/discover/tv', {
            with_genres: '16', // Animation
            with_original_language: 'ja',
            sort_by: 'first_air_date.desc', // Changed from popularity.desc
            'air_date.gte': lastMonth.toISOString().split('T')[0],
            'air_date.lte': nextWeek.toISOString().split('T')[0],
            page: String(page)
        });
    },

    getManyDiscoverAnime: async (pagesCount = 4): Promise<TMDBMedia[]> => {
        const promises = Array.from({ length: pagesCount }).map((_, i) => tmdbApi.getDiscoverAnime(i + 1));
        const results = await Promise.all(promises);
        return results.flatMap(res => res.results);
    },

    getBestRecentSeries: async (): Promise<TMDBMedia[]> => {
        const today = new Date();
        const threeYearsAgo = new Date();
        threeYearsAgo.setFullYear(today.getFullYear() - 3);

        const res = await fetchTMDB<TMDBResponse<TMDBMedia>>('/discover/tv', {
            sort_by: 'vote_average.desc',
            'first_air_date.gte': threeYearsAgo.toISOString().split('T')[0],
            'first_air_date.lte': today.toISOString().split('T')[0],
            'vote_count.gte': '500',
            without_genres: '16'
        });
        return res.results;
    },

    getDiscoverPaginated: async (type: 'movie' | 'tv', options: Record<string, string>, uiPage = 1): Promise<{ results: TMDBMedia[], total_pages: number }> => {
        const response = await fetchTMDB<TMDBResponse<TMDBMedia>>(`/discover/${type}`, { ...options, page: String(uiPage) });
        return {
            results: response.results,
            total_pages: Math.min(response.total_pages, 500) // TMDB limit
        };
    },

    searchPaginated: async (query: string, type: 'movie' | 'tv' | 'multi' = 'multi', uiPage = 1): Promise<{ results: TMDBMedia[], total_pages: number }> => {
        const response = await fetchTMDB<TMDBResponse<TMDBMedia>>(`/search/${type}`, { query, page: String(uiPage) });
        return {
            results: response.results,
            total_pages: Math.min(response.total_pages, 500)
        };
    },
        
    getDetails: (id: string, type: 'movie' | 'tv' | string) => 
        fetchTMDB<TMDBDetail>(`/${type}/${id}`, {
            append_to_response: 'videos,credits,images'
        }),
        
    getImageUrl: (path: string | null, size: 'w500' | 'original' = 'w500') => {
        if (!path) return '/img/poster/spider.jpg';
        return size === 'w500' ? `${TMDB_IMAGE_BASE_URL}${path}` : `${TMDB_IMAGE_ORIGINAL_URL}${path}`;
    },
    
    search: (query: string, type: 'movie' | 'tv' | 'multi' = 'multi', page = 1) =>
        fetchTMDB<TMDBResponse<TMDBMedia>>(`/search/${type}`, { query, page: String(page) }),

    searchMany: async (query: string, type: 'movie' | 'tv' | 'multi' = 'multi', pagesCount = 4): Promise<TMDBMedia[]> => {
        const promises = Array.from({ length: pagesCount }).map((_, i) => tmdbApi.search(query, type, i + 1));
        const results = await Promise.all(promises);
        return results.flatMap(res => res.results);
    }
};
