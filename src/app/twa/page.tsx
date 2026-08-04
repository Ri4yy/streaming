import Link from 'next/link';
import { Film, Tv, PlaySquare, Gamepad2, Book } from 'lucide-react';

const categories = [
  { name: 'Фильмы', href: '/twa/search?type=movie', icon: Film, color: 'from-blue-500 to-cyan-400' },
  { name: 'Сериалы', href: '/twa/search?type=tv', icon: Tv, color: 'from-purple-500 to-pink-500' },
  { name: 'Аниме', href: '/twa/search?type=anime', icon: PlaySquare, color: 'from-red-500 to-orange-500' }
];

export default function TWACatalogPage() {
  return (
    <div className="p-4 pt-8">
      <h1 className="text-2xl font-bold mb-6">Каталог</h1>
      
      <div className="grid grid-cols-2 gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            href={cat.href}
            className={`relative overflow-hidden rounded-2xl p-4 flex flex-col items-center justify-center gap-3 aspect-square bg-gradient-to-br ${cat.color} opacity-90 hover:opacity-100 transition-opacity`}
          >
            <cat.icon className="w-12 h-12 text-white drop-shadow-lg" />
            <span className="font-bold text-white drop-shadow-md">{cat.name}</span>
            <div className="absolute inset-0 bg-black/10"></div>
          </Link>
        ))}
      </div>
    </div>
  );
}
