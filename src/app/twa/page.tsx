"use client";

import { Film, Tv, PlaySquare } from 'lucide-react';
import SpotlightCards, { SpotlightItem } from '@/components/kokonutui/spotlight-cards';

const categories: SpotlightItem[] = [
  { title: 'Фильмы', href: '/twa/search?type=movie', icon: Film, color: '#3b82f6', description: 'Смотреть новинки и классику' },
  { title: 'Сериалы', href: '/twa/search?type=tv', icon: Tv, color: '#a855f7', description: 'Захватывающие сериалы для вас' },
  { title: 'Аниме', href: '/twa/search?type=anime', icon: PlaySquare, color: '#ef4444', description: 'Популярная японская анимация' }
];

export default function TWACatalogPage() {
  return (
    <div className="p-0 pt-4">
      <SpotlightCards 
        items={categories} 
        heading="Каталог" 
        eyebrow="Разделы"
        className="bg-transparent dark:bg-transparent"
      />
    </div>
  );
}
