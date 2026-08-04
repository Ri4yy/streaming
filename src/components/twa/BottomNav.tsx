"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Search, Heart } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Каталог', href: '/twa', icon: LayoutGrid },
    { name: 'Поиск', href: '/twa/search', icon: Search },
    { name: 'Избранное', href: '/twa/favorites', icon: Heart },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-2 bg-black/60 backdrop-blur-xl border-t border-white/10">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full gap-1 transition-colors duration-300 ${
                isActive ? 'text-red-500' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'fill-red-500/20' : ''}`} />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
