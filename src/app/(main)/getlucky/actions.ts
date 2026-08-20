'use server'

import { tmdbApi, TMDBMedia } from '@/services/tmdb';
import { createClient } from '@/utils/supabase/server';

export type GetLuckyFilters = {
    type: 'all' | 'movie' | 'tv' | 'anime' | 'cartoon';
    excludeWatched?: boolean;
    genre?: string;
    year?: string;
    ratingMin?: number;
    ratingMax?: number;
    country?: string;
    studio?: string;
};

// Shuffle array using Fisher-Yates
function shuffleArray<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

export async function spinRoulette(filters: GetLuckyFilters): Promise<TMDBMedia[]> {
    let typeToFetch: 'movie' | 'tv' = 'movie';
    let options: Record<string, string> = {
        'vote_count.gte': '100', // Filter out extremely obscure stuff
    };

    // Determine type and options
    if (filters.type === 'all') {
        typeToFetch = Math.random() > 0.5 ? 'movie' : 'tv';
    } else if (filters.type === 'movie') {
        typeToFetch = 'movie';
    } else if (filters.type === 'tv') {
        typeToFetch = 'tv';
    } else if (filters.type === 'anime') {
        typeToFetch = 'tv';
        options['with_genres'] = '16';
        options['with_original_language'] = 'ja';
    } else if (filters.type === 'cartoon') {
        typeToFetch = 'movie';
        options['with_genres'] = '16';
    }

    if (filters.genre) {
        options['with_genres'] = options['with_genres'] ? `${options['with_genres']},${filters.genre}` : filters.genre;
    }
    if (filters.year) {
        if (typeToFetch === 'movie') options['primary_release_year'] = filters.year;
        else options['first_air_date_year'] = filters.year;
    }
    if (filters.ratingMin) options['vote_average.gte'] = String(filters.ratingMin);
    if (filters.ratingMax) options['vote_average.lte'] = String(filters.ratingMax);
    if (filters.country) options['with_origin_country'] = filters.country;
    if (filters.studio) options['with_companies'] = filters.studio;

    try {
        let resultsToReturn: TMDBMedia[] = [];
        
        // First fetch page 1 to get total pages
        let firstPageResponse = await tmdbApi.getDiscoverPaginated(typeToFetch, options, 1);
        
        // If no results, try relaxing the vote_count constraint
        if ((!firstPageResponse.results || firstPageResponse.results.length === 0) && options['vote_count.gte']) {
            delete options['vote_count.gte'];
            firstPageResponse = await tmdbApi.getDiscoverPaginated(typeToFetch, options, 1);
        }

        let totalAvailablePages = firstPageResponse.total_pages;
        
        if (!firstPageResponse.results || firstPageResponse.results.length === 0) {
            // Return empty array if no results match the strict filters
            return [];
        } else {
            // Cap max pages
            let maxPage = Math.min(totalAvailablePages, filters.type === 'anime' ? 20 : 50);
            
            if (maxPage > 1) {
                // Pick a random page between 1 and maxPage
                const randomPage = Math.floor(Math.random() * maxPage) + 1;
                
                if (randomPage === 1) {
                    resultsToReturn = firstPageResponse.results;
                } else {
                    const randomPageResponse = await tmdbApi.getDiscoverPaginated(typeToFetch, options, randomPage);
                    resultsToReturn = randomPageResponse.results && randomPageResponse.results.length > 0 
                        ? randomPageResponse.results 
                        : firstPageResponse.results;
                }
            } else {
                resultsToReturn = firstPageResponse.results;
            }
        }

        const originalResults = [...resultsToReturn];
        // Exclude watched items if requested
        if (filters.excludeWatched) {
            const supabase = await createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: interactions } = await supabase
                    .from('user_interactions')
                    .select('item_id')
                    .eq('user_id', user.id)
                    .in('status', ['watched', 'watching', 'dropped', 'on_hold']);
                
                if (interactions && interactions.length > 0) {
                    const watchedIds = new Set(interactions.map(i => i.item_id));
                    // Convert TMDB id to string to match our item_id which might be stringified
                    resultsToReturn = resultsToReturn.filter(item => !watchedIds.has(String(item.id)));
                }
            }
        }

        // If filtering removed everything, just return the unfiltered (better than nothing)
        if (resultsToReturn.length === 0) {
            resultsToReturn = originalResults;
        }

        // Shuffle the results so the outcome is unpredictable
        return shuffleArray(resultsToReturn);
    } catch (e) {
        console.error("Failed to fetch getlucky results:", e);
        return [];
    }
}
