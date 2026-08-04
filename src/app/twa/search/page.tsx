"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search as SearchIcon } from 'lucide-react';
import TWAMediaCard from '@/components/twa/TWAMediaCard';

export default function TWASearchPage() {
  const searchParams = useSearchParams();
  const initialType = searchParams.get('type') || 'all';
  
  const [query, setQuery] = useState('');
  const [type, setType] = useState(initialType);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        
        if (type !== 'all') {
            setResults(data.filter((item: any) => item.media_type === type));
        } else {
            setResults(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchResults, 500);
    return () => clearTimeout(debounceTimer);
  }, [query, type]);

  return (
    <div className="p-4 pt-6">
      <div className="relative mb-6">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск..."
          className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-red-500 transition-colors"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        {['all', 'movie', 'tv', 'anime', 'game', 'book'].map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
              type === t ? 'bg-red-500 text-white' : 'bg-white/10 text-gray-300'
            }`}
          >
            {t === 'all' ? 'Всё' : t === 'movie' ? 'Фильмы' : t === 'tv' ? 'Сериалы' : t === 'anime' ? 'Аниме' : t === 'game' ? 'Игры' : 'Книги'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {results.map((item: any) => {
             // For TMA, we might need a modified DetailActions or we can just use MediaCard
             // MediaCard links to `/games/123`, which goes to the desktop layout!
             // Wait! If TMA clicks a MediaCard, it opens the desktop layout because it navigates to `/games/123`.
             return (
              <div key={item.id} className="relative">
                 <TWAMediaCard
                   id={item.id}
                   name={item.title || item.name}
                   rate={item.vote_average || 0}
                   img={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : (item.imageLinks?.thumbnail || item.header_image || '')}
                   type={item.media_type}
                   year={new Date(item.release_date || item.first_air_date || item.publishedDate || Date.now()).getFullYear() || ''}
                   genre={item.genre_ids ? 'Жанр' : ''}
                 />
              </div>
             )
          })}
        </div>
      ) : query ? (
        <div className="text-center text-gray-500 mt-10">Ничего не найдено</div>
      ) : (
        <div className="text-center text-gray-500 mt-10">Начните вводить для поиска</div>
      )}
    </div>
  );
}
