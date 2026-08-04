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

const mockMedia: TMDBMedia = {
    id: 1,
    title: "Человек-паук: Паутина вселенных",
    name: "Человек-паук: Паутина вселенных",
    overview: "Майлз Моралес отправляется в приключение по мультивселенной вместе с Гвен Стейси и новой командой Людей-пауков.",
    poster_path: null,
    backdrop_path: null,
    genre_ids: [28, 12, 16],
    popularity: 100,
    release_date: "2023-05-31",
    vote_average: 8.4,
    vote_count: 1000
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
        const mockResponse: TMDBResponse<TMDBMedia> = {
            page: 1,
            results: Array(20).fill(mockMedia).map((m, i) => ({ ...m, id: m.id + i })),
            total_pages: 1,
            total_results: 20
        };
        return mockResponse as unknown as T;
    }
}

export const tmdbApi = {
    getTrending: (type: 'movie' | 'tv' | 'all' = 'all', timeWindow: 'day' | 'week' = 'week') => 
        fetchTMDB<TMDBResponse<TMDBMedia>>(`/trending/${type}/${timeWindow}`),
    
    getPopular: (type: 'movie' | 'tv' = 'movie') => 
        fetchTMDB<TMDBResponse<TMDBMedia>>(`/${type}/popular`),
        
    getTopRated: (type: 'movie' | 'tv' = 'movie') => 
        fetchTMDB<TMDBResponse<TMDBMedia>>(`/${type}/top_rated`),
        
    getUpcoming: () => 
        fetchTMDB<TMDBResponse<TMDBMedia>>(`/movie/upcoming`),
        
    getDiscoverAnime: () => 
        fetchTMDB<TMDBResponse<TMDBMedia>>('/discover/tv', {
            with_genres: '16', // Animation
            with_original_language: 'ja',
            sort_by: 'popularity.desc'
        }),
        
    getDetails: (id: string, type: 'movie' | 'tv') => 
        fetchTMDB<any>(`/${type}/${id}`, {
            append_to_response: 'videos,credits'
        }),
        
    getImageUrl: (path: string | null, size: 'w500' | 'original' = 'w500') => {
        if (!path) return '/img/poster/spider.jpg';
        return size === 'w500' ? `${TMDB_IMAGE_BASE_URL}${path}` : `${TMDB_IMAGE_ORIGINAL_URL}${path}`;
    }
};
