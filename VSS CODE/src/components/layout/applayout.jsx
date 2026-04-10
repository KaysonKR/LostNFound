import React, { useState } from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';
import Navbar from './navbar';
import Sidebar from './sidebar';

export default function AppLayout() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        {/* Sidebar always visible on desktop */}
        <div className="hidden lg:block">
          <Sidebar selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
        </div>
        <main className="flex-1 min-w-0">
          <Outlet context={{ selectedCategory, setSelectedCategory }} />
        </main>
      </div>
    </div>
  );
}