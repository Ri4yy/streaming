import { NextResponse } from 'next/server';
import { tmdbApi } from '@/services/tmdb';
import { steamApi } from '@/services/steam';
import { googleBooksApi } from '@/services/googleBooks';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  const type = searchParams.get('type') || 'all';
  
  if (!q) {
    return NextResponse.json([]);
  }

  try {
    let results: any[] = [];
    
    if (type === 'game') {
       const games = await steamApi.searchGamesWithDetails(q, 10);
       results = games.map(g => ({ ...g, media_type: 'game' }));
    } else if (type === 'book') {
       const books = await googleBooksApi.searchBooks(q);
       results = books.slice(0, 10).map(b => ({ ...b, media_type: 'book' }));
    } else if (type === 'all') {
       const [tmdbRes, steamRes, booksRes] = await Promise.all([
          tmdbApi.searchMany(q, 'multi', 2),
          steamApi.searchGamesWithDetails(q, 4),
          googleBooksApi.searchBooks(q)
       ]);
       const tmdbFiltered = tmdbRes.filter(item => item.media_type === 'movie' || item.media_type === 'tv');
       const steamMapped = steamRes.map(g => ({ ...g, media_type: 'game' }));
       const booksMapped = (booksRes || []).slice(0, 4).map(b => ({ ...b, media_type: 'book' }));
       results = [...tmdbFiltered, ...steamMapped, ...booksMapped];
    } else {
       const tmdbRes = await tmdbApi.searchMany(q, 'multi', 2);
       results = tmdbRes.filter(item => item.media_type === 'movie' || item.media_type === 'tv');
    }
    
    // Process results to help identify anime on the client
    const processed = results.map(item => {
      if (item.media_type === 'movie' || item.media_type === 'tv') {
        const isAnime = item.genre_ids?.includes(16) && 
          (item.original_language === 'ja' || item.origin_country?.includes('JP'));
          
        if (isAnime) {
          return { ...item, _isAnime: true };
        }
      }
      return item;
    });

    return NextResponse.json(processed);
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Failed to fetch search results' }, { status: 500 });
  }
}
