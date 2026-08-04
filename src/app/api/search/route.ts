import { NextResponse } from 'next/server';
import { tmdbApi } from '@/services/tmdb';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  
  if (!q) {
    return NextResponse.json([]);
  }

  try {
    const results = await tmdbApi.searchMany(q, 'multi', 2);
    
    // Filter out people and other non-media, keep only movies and tv shows
    const filtered = results.filter(item => item.media_type === 'movie' || item.media_type === 'tv');
    
    // Process results to help identify anime on the client
    const processed = filtered.map(item => {
      // Basic heuristic for anime from TMDB
      const isAnime = item.genre_ids?.includes(16) && 
        (item.original_language === 'ja' || item.origin_country?.includes('JP'));
        
      if (isAnime) {
        // We preserve the original media_type as it might be needed, 
        // but add an isAnime flag or override media_type for the client filter
        return { ...item, _isAnime: true };
      }
      return item;
    });

    return NextResponse.json(processed);
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Failed to fetch search results' }, { status: 500 });
  }
}
