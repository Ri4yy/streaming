"use client";

import { useUserMedia } from '@/hooks/useUserMedia';
import TWAMediaCard from '@/components/twa/TWAMediaCard';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function TWAFavoritesPage() {
  const { mediaList, loading } = useUserMedia();
  const [filter, setFilter] = useState('all');

  const favorites = mediaList.filter(m => m.is_favorite);
  const filteredFavorites = filter === 'all' ? favorites : favorites.filter(m => m.media_type === filter);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 pt-8">
      <h1 className="text-2xl font-bold mb-6">Избранное</h1>
      
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {['all', 'movie', 'tv', 'anime', 'game', 'book'].map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`relative px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap ${
              filter === t 
                ? 'text-white' 
                : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20 hover:text-white backdrop-blur-md shadow-sm'
            }`}
          >
            {filter === t && (
              <motion.div
                layoutId="active-favorites-tab"
                className="absolute inset-0 bg-theme-main/20 border border-theme-main/40 rounded-xl z-0 backdrop-blur-md shadow-sm"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">
              {t === 'all' ? 'Всё' : t === 'movie' ? 'Фильмы' : t === 'tv' ? 'Сериалы' : t === 'anime' ? 'Аниме' : t === 'game' ? 'Игры' : 'Книги'}
            </span>
          </button>
        ))}
      </div>

      {filteredFavorites.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {filteredFavorites.map((item) => (
             <div key={`${item.media_type}-${item.media_id}`} className="relative">
                 <TWAMediaCard
                   id={item.media_id}
                   name={item.title}
                   rate={item.rating || 0}
                   img={item.cover_url || ''}
                   type={item.media_type as any}
                   year={""}
                   genre={""}
                 />
              </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-20">
          У вас пока нет сохраненных элементов
        </div>
      )}
    </div>
  );
}
