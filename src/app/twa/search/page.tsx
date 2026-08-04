"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search as SearchIcon } from 'lucide-react';
import { motion } from 'framer-motion';
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
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=${type}`);
        const data = await res.json();
        
        if (type !== 'all') {
            setResults(data.filter((item: any) => {
                if (type === 'anime') return item._isAnime;
                if (type === 'movie' || type === 'tv') return item.media_type === type && !item._isAnime;
                if (type === 'game') return item.media_type === 'game';
                if (type === 'book') return item.media_type === 'book';
                return item.media_type === type;
            }));
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
            className={`relative px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
              type === t ? 'text-white' : 'bg-white/10 text-gray-300 hover:text-white'
            }`}
          >
            {type === t && (
              <motion.div
                layoutId="active-search-tab"
                className="absolute inset-0 bg-red-500 rounded-full z-0"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">
              {t === 'all' ? 'Всё' : t === 'movie' ? 'Фильмы' : t === 'tv' ? 'Сериалы' : t === 'anime' ? 'Аниме' : t === 'game' ? 'Игры' : 'Книги'}
            </span>
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
              <div key={item.id || item.steam_appid || item.appid} className="relative">
                 <TWAMediaCard
                   id={item.id || item.steam_appid || item.appid}
                   name={item.title || item.name || item.volumeInfo?.title}
                   rate={item.vote_average || item.volumeInfo?.averageRating || 0}
                   img={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : (item.imageLinks?.thumbnail || item.header_image || item.volumeInfo?.imageLinks?.thumbnail || '')}
                   type={item.media_type}
                   year={new Date(item.release_date?.date || item.release_date || item.first_air_date || item.publishedDate || item.volumeInfo?.publishedDate || Date.now()).getFullYear() || ''}
                   genre={item.genre_ids ? 'Жанр' : (item.volumeInfo?.authors?.join(', ') || '')}
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
