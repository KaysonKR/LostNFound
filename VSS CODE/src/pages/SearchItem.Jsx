import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { useOutletContext } from 'react-router-dom';
import SearchHeader from '@/components/search/SearchHeader';
import ItemCard from '@/components/search/ItemCard';
import Sidebar from '@/components/layout/Sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal } from 'lucide-react';

export default function SearchItems() {
  const { selectedCategory, setSelectedCategory } = useOutletContext();
  const [query, setQuery] = useState('');

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['lost-items'],
    queryFn: () => base44.entities.LostItem.list('-created_date', 200),
  });

  const filtered = items.filter((item) => {
    const catMatch = !selectedCategory || selectedCategory === 'all' || item.category === selectedCategory;
    const q = query.toLowerCase();
    const textMatch =
      !query ||
      item.title?.toLowerCase().includes(q) ||
      item.physical_description?.toLowerCase().includes(q) ||
      item.location_found?.toLowerCase().includes(q);
    return catMatch && textMatch;
  });

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="font-heading font-bold text-2xl md:text-3xl">Find Your Lost Item</h1>
        <p className="text-muted-foreground mt-1">Browse by category or search for your item</p>
      </div>

      <div className="space-y-5">
        <div className="flex items-center gap-3">
          {/* Mobile category filter */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden shrink-0">
                <SlidersHorizontal className="w-4 h-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0 pt-10 bg-[hsl(0,0%,9%)]">
              <Sidebar selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
            </SheetContent>
          </Sheet>
          <div className="flex-1">
            <SearchHeader query={query} onQueryChange={setQuery} resultCount={filtered.length} />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="rounded-xl border border-border overflow-hidden">
                <Skeleton className="aspect-[4/3] w-full" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No items found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
          </div>
        )}
      </div>


    </div>
  );
}