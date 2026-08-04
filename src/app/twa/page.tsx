"use client";

import { Film, Tv, PlaySquare, Gamepad2, Book } from 'lucide-react';
import SpotlightCards, { SpotlightItem } from '@/components/kokonutui/spotlight-cards';

const categories: SpotlightItem[] = [
  { title: 'Фильмы', href: '/twa/search?type=movie', icon: Film, color: '#3b82f6' },
  { title: 'Сериалы', href: '/twa/search?type=tv', icon: Tv, color: '#a855f7' },
  { title: 'Аниме', href: '/twa/search?type=anime', icon: PlaySquare, color: '#ef4444' },
  { title: 'Игры', href: '/twa/search?type=game', icon: Gamepad2, color: '#22c55e' },
  { title: 'Книги', href: '/twa/search?type=book', icon: Book, color: '#f59e0b' }
];

export default function TWACatalogPage() {
  return (
    <div className="p-4 pt-8">
      <h1 className="text-2xl font-bold mb-6">Каталог</h1>
      <SpotlightCards 
        items={categories} 
        className="bg-transparent dark:bg-transparent p-0"
      />
    </div>
  );
}
