"use client";

import { usePathname, useRouter } from 'next/navigation';
import { LayoutGrid, Search, Heart } from 'lucide-react';
import { Toolbar, ToolbarItem } from '@/components/kokonutui/toolbar';

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems: ToolbarItem[] = [
    { id: '/twa', title: 'Каталог', icon: LayoutGrid },
    { id: '/twa/search', title: 'Поиск', icon: Search },
    { id: '/twa/favorites', title: 'Избранное', icon: Heart },
  ];

  // Determine current active id based on pathname
  // If not exactly matching one of the tabs, default to '/twa' (or handle subroutes if needed)
  const activeId = navItems.find(item => item.id === pathname)?.id || '/twa';

  const handleSelect = (itemId: string) => {
    router.push(itemId);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-2">
      <div className="flex justify-center w-full max-w-md mx-auto">
        <Toolbar 
          items={navItems} 
          defaultSelected={activeId} 
          onSelect={handleSelect}
        />
      </div>
    </div>
  );
}
