import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthUser } from '@/lib/AuthUserContext';
import {
  Shirt, Footprints, Package, GlassWater,
  Glasses, Key, HelpCircle, LayoutGrid, Plus, Shield, Home
} from 'lucide-react';

const CATEGORIES = [
  { value: 'all', label: 'All Items', icon: LayoutGrid },
  { value: 'Jacket/Outerwear', label: 'Jacket / Outerwear', icon: Shirt },
  { value: 'Pants/Shorts', label: 'Pants / Shorts', icon: Shirt },
  { value: 'Shoes', label: 'Shoes', icon: Footprints },
  { value: 'Shirts', label: 'Shirts', icon: Shirt },
  { value: 'Lunchbox', label: 'Lunchbox', icon: Package },
  { value: 'Backpack', label: 'Backpack', icon: Package },
  { value: 'Water Bottles', label: 'Water Bottles', icon: GlassWater },
  { value: 'Accessories', label: 'Accessories', icon: Glasses },
  { value: 'Private Belonging', label: 'Private Belonging', icon: Key },
  { value: 'Others', label: 'Others', icon: HelpCircle },
];

export default function Sidebar({ selectedCategory, onSelectCategory }) {
  const { isTeacher } = useAuthUser();
  const location = useLocation();
  const isSearchPage = location.pathname === '/search' || location.pathname === '/';

  return (
    <aside className="w-56 shrink-0 bg-[hsl(0,0%,9%)] min-h-[calc(100vh-4rem)] flex flex-col border-r border-[hsl(0,0%,18%)]">
      {/* Navigation links */}
      <div className="px-3 pt-5 pb-3">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 px-2 mb-2">Navigation</p>
        <Link to="/">
          <button className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-1 ${
            location.pathname === '/' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}>
            <Home className="w-4 h-4 shrink-0" />
            Home
          </button>
        </Link>
        <Link to="/search">
          <button className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-1 ${
            location.pathname === '/search' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}>
            <LayoutGrid className="w-4 h-4 shrink-0" />
            Browse Items
          </button>
        </Link>
        {isTeacher && (
          <>
            <Link to="/report">
              <button className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-1 ${
                location.pathname === '/report' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}>
                <Plus className="w-4 h-4 shrink-0" />
                Report Found Item
              </button>
            </Link>
            <Link to="/admin">
              <button className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-1 ${
                location.pathname === '/admin' ? 'bg-secondary text-secondary-foreground' : 'text-yellow-400 hover:text-yellow-300 hover:bg-white/10'
              }`}>
                <Shield className="w-4 h-4 shrink-0" />
                Admin Dashboard
              </button>
            </Link>
          </>
        )}
      </div>

      {/* Category filter (only relevant on browse/home) */}
      <div className="px-3 pt-3 pb-5 border-t border-[hsl(0,0%,18%)] flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 px-2 mb-2">Categories</p>
        <div className="space-y-0.5">
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => onSelectCategory && onSelectCategory(cat.value)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                  active
                    ? 'bg-primary/80 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <cat.icon className="w-4 h-4 shrink-0" />
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

export { CATEGORIES };